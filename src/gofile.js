const mangayomiSources = [
    {
        "name": "Gofile",
        "lang": "it",
        "baseUrl": "https://gofile.io",
        "apiUrl": "",
        "iconUrl": "https://www.google.com/s2/favicons?sz=64&domain=gofile.io",
        "typeSource": "single",
        "isNsfw": false,
        "itemType": 1,
        "version": "1.24.2",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/gofile.js",
    },
];

// Come in Link universale: «Salva un link» aggiunge, «Togli i link» toglie.
// I link stanno nell'archivio dell'estensione (getString/setString). Mangayomi, per
// leggere una preferenza non ancora salvata, richiama getSourcePreferences: lì
// dentro le letture passano da un blocco (_syncing) che ferma il giro.
const STORE_LINKS = "gofile_saved_links";
const STORE_ADD_N = "gofile_add_n";
const STORE_MIGRATED = "gofile_migrated";
const STORE_REN_N = "gofile_ren_n";
const STORE_REM_N = "gofile_rem_n";
const STORE_BATCH = "gofile_last_batch";
const STORE_INFO = "gofile_folder_info";
const STORE_TOKEN = "gofile_token";
const STORE_FILES = "gofile_folder_files";
const STORE_BK_HOST = "gofile_bunkr_host";
const STORE_BK_BAD = "gofile_bunkr_bad";
const BAD_TTL = 24 * 3600000;
const STORE_FIX = "gofile_fix_1_12";
const STORE_REMOTE = "gofile_remote_cache";
const STORE_PUSH_N = "gofile_push_n";
const STORE_PUSH_STATUS = "gofile_push_status";
const STORE_PUSH_PENDING = "gofile_push_pending";
// Copie interne (readStore) dei valori delle impostazioni URL/token. Leggerle con
// setting() mentre si costruiscono le preferenze fa richiamare getSourcePreferences in
// loop (app in crash): le impostazioni si leggono solo dentro syncLinks e si copiano qui.
const MIRROR_URL = "gofile_m_remote_url";
const MIRROR_TOKEN = "gofile_m_remote_token";
const REMOTE_TTL = 60000;
// Lista link condivisa: un file di testo (un link per riga) che l'estensione legge
// sempre. Modificandolo da un dispositivo con tastiera (telefono/PC) i link compaiono
// anche dove digitare è scomodo (es. TV). Di default un file nel repo; cambiabile dalle
// impostazioni (anche un Gist o un altro URL «raw»).
const DEFAULT_REMOTE_URL = "https://raw.githubusercontent.com/adam72881/mangayomi-anime-extensions/main/links/gofile.txt";
// Domini di Bunkr: alcuni operatori italiani ne bloccano qualcuno, si prova il successivo.
const BUNKR_HOSTS = ["bunkr.cr", "bunkr.si", "bunkr.fi", "bunkr.ph", "bunkr.ws", "bunkr.site", "bunkr.pk"];
const FILES_TTL = 6 * 3600000;
// Versione dello schema della cache (lista file di una scheda). Aumentandola, le schede
// salvate con una versione precedente vengono rilette una volta, anche se non scadute:
// così i miglioramenti nella lettura (es. album Bunkr completi) prendono effetto senza
// dover togliere e rimettere il link.
const READ_V = 2;
const VIDEO_EXT = /\.(mp4|mkv|webm|mov|m4v|avi|ts|m3u8)$/i;
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

// La lista di una cartella la disegna il JavaScript di Gofile: la pagina si apre
// nella WebView nascosta di Mangayomi, come nel browser, e lo script legge le righe.
// Si ferma appena ci sono tutte («N items» della pagina) o quando smettono di
// aumentare. Il link del file è la cartella della miniatura più il nome del file;
// per scaricarlo serve il cookie accountToken della stessa visita.
// La copertina è la miniatura del primo video: Mangayomi accetta solo indirizzi
// http (a un'immagine «data:» antepone l'indirizzo del sito e la rompe), quindi
// niente collage né ritaglio.
function listScript() {
    return `(function () {
    var last = -1, same = 0, ticks = 0;
    var timer = setInterval(function () {
        ticks++;
        var rows = document.querySelectorAll('.fm-row[data-type]');
        if (rows.length && rows.length === last) same++; else same = 0;
        last = rows.length;
        var body = document.body ? document.body.innerText : '';
        var count = parseInt((body.match(/(\\d+)\\s+items?\\b/i) || [])[1], 10);
        var complete = rows.length && count > 0 && rows.length >= count;
        var stop = !rows.length && ticks >= 6 && /not found|unreachable|password|expired|deleted|removed/i.test(body);
        // Un link con un solo file apre subito il lettore, senza lista.
        var vid = document.querySelector('video');
        var vsrc = vid ? (vid.currentSrc || vid.src || ((vid.querySelector('source') || {}).src) || '') : '';
        var single = !rows.length && /gofile\\.io\\/download\\//.test(vsrc);
        if (!(complete || single || same >= 3 || stop || ticks > 50)) return;
        clearInterval(timer);
        var out = { title: document.title, cookie: document.cookie, text: body.slice(0, 300), rows: [] };
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i], p = r.querySelector('p'), img = r.querySelector('img');
            out.rows.push({ id: r.getAttribute('data-id'), type: r.getAttribute('data-type'), name: p ? p.textContent.trim() : '', img: img ? img.src : '' });
        }
        if (single) {
            var fname = decodeURIComponent(vsrc.split('?')[0].split('/').pop());
            out.rows.push({ id: 'single', type: 'file', name: fname, img: vid.poster || vsrc.replace(/[^\\/]+$/, '') });
        }
        window.flutter_inappwebview.callHandler('setResponse', JSON.stringify(out));
    }, 500);
})();`;
}

// Album Bunkr nella WebView. La «modalità avanzata» (?advanced=1) mette tutti i file
// nella variabile globale window.albumFiles. Sul telefono però la richiesta HTTP con
// query a volte non arriva (resta a 100). Qui carichiamo la pagina normale dell'album
// (che passa l'eventuale verifica Cloudflare e prende i cookie) e, se la lista non c'è
// già, la scarichiamo con fetch dalla stessa origine: così la query parte davvero e i
// cookie (compreso il via libera di Cloudflare) accompagnano la richiesta.
function bunkrAlbumScript() {
    return `(function () {
    var done = false;
    function send(out) { if (done) return; done = true; try { window.flutter_inappwebview.callHandler('setResponse', JSON.stringify(out)); } catch (e) {} }
    function fromList(f) { var o = { title: document.title, files: [] }; for (var i = 0; i < f.length; i++) { var x = f[i] || {}; o.files.push({ original: x.original, slug: x.slug, type: x.type, thumbnail: x.thumbnail }); } return o; }
    function fromHtml(html) {
        var o = { title: (html.match(/<title>([^<]*)<\\/title>/i) || [])[1] || document.title, files: [] };
        var re = /original:\\s*"((?:[^"\\\\]|\\\\.)*)"\\s*,\\s*slug:\\s*"([^"]+)"\\s*,\\s*type:\\s*"([^"]+)"[\\s\\S]*?thumbnail:\\s*"([^"]+)"/g, m;
        while ((m = re.exec(html))) { if (m[3].indexOf('video/') !== 0) continue; o.files.push({ original: m[1], slug: m[2], type: m[3], thumbnail: m[4] }); }
        return o;
    }
    setTimeout(function () { if (!done) send({ title: document.title, files: [] }); }, 42000);
    var tries = 0;
    var timer = setInterval(function () {
        tries++;
        // Se la pagina caricata è già quella avanzata, i file sono in window.albumFiles.
        if (window.albumFiles && window.albumFiles.length) { clearInterval(timer); send(fromList(window.albumFiles)); return; }
        var body = document.body ? document.body.innerText : '';
        var ready = /\\/f\\//.test(document.documentElement.innerHTML) || /been deleted|been removed|does not exist|not found/i.test(body);
        if (!(ready || tries > 20)) return;  // aspetta che la pagina (o la verifica Cloudflare) sia pronta
        clearInterval(timer);
        // Scarica la modalità avanzata dalla stessa origine, con i cookie (query e via
        // libera di Cloudflare inclusi): così arriva la lista completa dei file.
        fetch(location.pathname + '?advanced=1', { credentials: 'include', headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            .then(function (r) { return r.text(); })
            .then(function (html) { send(fromHtml(html)); })
            .catch(function () { send({ title: document.title, files: [] }); });
    }, 500);
})();`;
}

class DefaultExtension extends MProvider {
    constructor() {
        super();
        this.client = new Client();
    }

    readStore(key) {
        try { return String(new SharedPreferences().getString(key, "") || ""); } catch (e) { return ""; }
    }

    writeStore(key, value) {
        try { new SharedPreferences().setString(key, value); } catch (e) {}
    }

    // Accetta https://gofile.io/d/XXXX, gofile.io/d/XXXX o il solo codice.
    codeOf(text) {
        var s = String(text || "").trim();
        var m = s.match(/gofile\.io\/d\/([A-Za-z0-9]+)/i);
        if (m) return m[1];
        return /^[A-Za-z0-9]{4,}$/.test(s) ? s : "";
    }

    // Bunkr: album /a/<id> o singolo file /f/<id> (anche /v/, /i/), su qualsiasi
    // dominio bunkr.*. Il codice interno è «bk~tipo~id», senza dominio: lo stesso
    // album con domini diversi è lo stesso link (fino alla 1.12.1 c'era anche il dominio).
    bunkrCode(text) {
        var m = String(text || "").match(/(bunkr+\.[a-z]{2,})\/([afvi])\/([A-Za-z0-9]+)/i);
        if (!m) return "";
        return "bk~" + (m[2].toLowerCase() === "a" ? "a" : "f") + "~" + m[3];
    }

    normCode(code) {
        return this.isBunkr(code) ? String(code).split("~").slice(0, 3).join("~") : code;
    }

    // filester.me/d/<slug> e i suoi mirror (filester.gg, .si, …): stesso servizio,
    // slug e API condivisi. Accettiamo qualsiasi TLD e normalizziamo su .me.
    // Codice «fl~<slug>».
    filesterCode(text) {
        var m = String(text || "").match(/filester\.[a-z]{2,}\/d\/([A-Za-z0-9]+)/i);
        return m ? "fl~" + m[1] : "";
    }

    isFilester(code) {
        return String(code).indexOf("fl~") === 0;
    }

    // pixeldrain.com: file singolo /u/<id> o lista /l/<id>, API pubblica in chiaro.
    // Codice «pd~f~<id>» (file) o «pd~l~<id>» (lista).
    pixeldrainCode(text) {
        var m = String(text || "").match(/pixeldrain\.com\/([ul])\/([A-Za-z0-9]+)/i);
        if (!m) return "";
        return "pd~" + (m[1].toLowerCase() === "l" ? "l" : "f") + "~" + m[2];
    }

    isPixeldrain(code) {
        return String(code).indexOf("pd~") === 0;
    }

    pdParts(code) {
        var p = String(code).split("~");
        return { kind: p[1], id: p[2] };
    }

    // Pagine che incapsulano un link diretto Gofile in base64 nel parametro em=
    // (es. capistock.com/ember?em=…&t=…). Il codice è «em~» più l'indirizzo intero.
    embedCode(text) {
        var m = String(text || "").match(/(?:https?:\/\/)?[A-Za-z0-9.-]+\.[a-z]{2,}\/[^\s|?]*\?[^\s|]*\bem=[A-Za-z0-9+\/=_%-]+[^\s|]*/i);
        if (!m) return "";
        var url = /^https?:/i.test(m[0]) ? m[0] : "https://" + m[0];
        // Si salva se dentro em= c'è un indirizzo qualsiasi; se non è un file Gofile,
        // la scheda lo dirà. Così un link incapsulato non sparisce in silenzio.
        return this.embedInner(url) ? "em~" + url : "";
    }

    // L'indirizzo decodificato da em=, qualunque sia il sito.
    embedInner(url) {
        var em = (String(url).match(/[?&]em=([^&#\s]+)/) || [])[1];
        var target = em ? this.b64(decodeURIComponent(em)) : "";
        return /^https?:\/\/\S+$/i.test(target) ? target : "";
    }

    isEmbed(code) {
        return String(code).indexOf("em~") === 0;
    }

    b64(str) {
        var t = String(str || "").replace(/%3D/gi, "=").replace(/-/g, "+").replace(/_/g, "/").replace(/[^A-Za-z0-9+\/=]/g, "");
        var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", out = "", bits = 0, val = 0;
        for (var i = 0; i < t.length && t.charAt(i) !== "="; i++) {
            val = (val << 6) | abc.indexOf(t.charAt(i));
            bits += 6;
            if (bits >= 8) { bits -= 8; out += String.fromCharCode((val >> bits) & 255); }
        }
        return out;
    }

    // Indirizzo del file dentro em=, solo se è un download di Gofile (anche incompleto,
    // così un link tagliato nell'incollare si salva lo stesso e la scheda lo segnala).
    embedTarget(url) {
        var em = (String(url).match(/[?&]em=([^&#\s]+)/) || [])[1];
        var target = em ? this.b64(decodeURIComponent(em)) : "";
        return /^https?:\/\/[a-z0-9-]+\.gofile\.io\/download\//i.test(target) ? target : "";
    }

    // Vero solo se l'indirizzo è completo: cartella/tipo, id e nome del file con estensione.
    // Un link tagliato (es. finisce in «/download/di») non lo è.
    embedComplete(target) {
        return /\/download\/(?:direct|web)\/[0-9a-f]{6,}[0-9a-f-]*\/[^\/?]+\.[a-z0-9]{2,5}(?:\?|$)/i.test(String(target || ""));
    }

    linkCode(text) {
        return this.bunkrCode(text) || this.filesterCode(text) || this.pixeldrainCode(text) || this.embedCode(text) || this.codeOf(text);
    }

    isBunkr(code) {
        return String(code).indexOf("bk~") === 0;
    }

    bunkrParts(code) {
        var p = String(code).split("~");
        return { kind: p[1], id: p[2], host: p[3] || this.readStore(STORE_BK_HOST) || "bunkr.si" };
    }

    linkUrl(code) {
        if (this.isEmbed(code)) return String(code).slice(3);
        if (this.isFilester(code)) return "https://filester.me/d/" + String(code).slice(3);
        if (this.isPixeldrain(code)) { var p = this.pdParts(code); return "https://pixeldrain.com/" + (p.kind === "l" ? "l" : "u") + "/" + p.id; }
        if (!this.isBunkr(code)) return "https://gofile.io/d/" + code;
        var b = this.bunkrParts(code);
        return "https://" + b.host + "/" + b.kind + "/" + b.id;
    }

    readJson(key, fallback) {
        try { var v = this.readStore(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    }

    setting(key) {
        try { return new SharedPreferences().get(key); } catch (e) { return null; }
    }

    // La casella «Salva un link» ha una chiave nuova dopo ogni aggiunta: così,
    // riaprendo le impostazioni, è di nuovo vuota.
    addKey() {
        return "gofile_add_" + (parseInt(this.readStore(STORE_ADD_N), 10) || 0);
    }

    _hash(str) {
        var h = 0;
        for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
        return (h >>> 0).toString(36);
    }

    // I link aggiunti con l'ultimo «Salva un link» (anche più d'uno, incollati insieme),
    // che sono ancora salvati. Se non ce ne sono, l'ultimo link.
    lastBatch(links) {
        var codes = this.readJson(STORE_BATCH, []);
        var present = {};
        for (var i = 0; i < links.length; i++) present[links[i].code] = links[i];
        var out = [];
        for (var j = 0; j < codes.length; j++) if (present[codes[j]]) out.push(present[codes[j]]);
        if (!out.length && links.length) out = [links[links.length - 1]];
        return out;
    }

    // «Nome dell'ultimo link»: vale per i link dell'ultimo salvataggio. La chiave cambia
    // dopo ogni uso (casella di nuovo vuota) e quando cambia il gruppo: Mangayomi mostra
    // la scritta salvata la prima volta, che altrimenti resterebbe quella vecchia.
    renameKey(links) {
        var batch = this.lastBatch(links);
        var sig = batch.map(function (l) { return l.code + (l.name ? "n" : ""); }).join(",");
        return "gofile_lastname_" + (parseInt(this.readStore(STORE_REN_N), 10) || 0) + "_" + this._hash(sig);
    }

    shortLink(code) {
        if (this.isEmbed(code)) return this.linkUrl(code).split("/")[2] + " (video)";
        return this.linkUrl(code).replace(/^https:\/\//, "");
    }

    // La chiave di «Togli i link» cambia dopo ogni rimozione (contatore rotante), oltre
    // a dipendere dai link correnti. Senza il contatore, togliere e poi rimettere lo
    // stesso link ricreava lo stesso stato → stessa chiave → Mangayomi riproponeva la
    // vecchia spunta «da togliere» e il link rimesso spariva di nuovo.
    removeKey(links) {
        var h = 0, str = links.map(function (l) { return l.code + "=" + l.name; }).join("|");
        for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
        return "gofile_remove_" + (parseInt(this.readStore(STORE_REM_N), 10) || 0) + "_" + (h >>> 0).toString(36);
    }

    // «link | nome», «link nome» o solo il link; più link separati da spazio, senza nome.
    parseLinks(text) {
        var out = [];
        var line = String(text || "").trim();
        if (!line) return out;
        var links = line.match(/(?:https?:\/\/)?(?:www\.)?(?:gofile\.io\/d\/[A-Za-z0-9]+|bunkr+\.[a-z]{2,}\/[afvi]\/[A-Za-z0-9]+|filester\.[a-z]{2,}\/d\/[A-Za-z0-9]+|pixeldrain\.com\/[ul]\/[A-Za-z0-9]+|[A-Za-z0-9.-]+\.[a-z]{2,}\/[^\s|?]*\?[^\s|]*\bem=[A-Za-z0-9+\/=_%-]+[^\s|]*)/gi) || [];
        // Più link insieme: il testo che resta (es. «… | Asuna») è il nome di tutti.
        if (links.length > 1) {
            var common = line;
            for (var j = 0; j < links.length; j++) common = common.replace(links[j], " ");
            common = common.replace(/^[\s|:;,\-–—]+|[\s|:;,\-–—]+$/g, "").slice(0, 60);
            for (var i = 0; i < links.length; i++) out.push({ code: this.linkCode(links[i]), name: common });
            return out;
        }
        var code, rest;
        if (links.length === 1) {
            code = this.linkCode(links[0]);
            rest = line.replace(links[0], " ");
        } else {
            var first = line.split(/[\s|]+/)[0];
            code = this.codeOf(first);
            rest = line.slice(first.length);
        }
        if (code) out.push({ code: code, name: rest.replace(/^[\s|:\-–—]+|[\s|:\-–—]+$/g, "").slice(0, 60) });
        return out;
    }

    // Legge «Salva un link» e «Togli i link» e aggiorna l'elenco. Si chiama da
    // Popolari, ricerca e scheda, mai da getSourcePreferences.
    savedLinks() {
        var memo = this._linksMemo;
        if (memo && Date.now() - memo.at < 1500) return memo.list.slice();
        // Leggere una voce non ancora salvata fa richiamare getSourcePreferences, che
        // a sua volta aggiornerebbe i link: durante l'aggiornamento si usa l'elenco salvato.
        if (this._syncing) return this.readJson(STORE_LINKS, []);
        this._syncing = true;
        try { return this.syncLinks(); } finally { this._syncing = false; }
    }

    syncLinks() {
        var links = this.readJson(STORE_LINKS, []);
        if (links.some(function (l) { return /^bk~[^~]+~[^~]+~/.test(l.code); })) links = this.dropBunkrHosts(links);
        var changed = false;
        var self = this;
        // Un link salvato di nuovo diventa l'ultimo (per «Nome dell'ultimo link»),
        // tenendo il suo nome se non ne scrivi uno nuovo.
        var push = function (l) {
            if (!l.code) return;
            for (var i = 0; i < links.length; i++) {
                if (links[i].code === l.code) {
                    var old = links.splice(i, 1)[0];
                    l.name = l.name || old.name;
                    break;
                }
            }
            links.push(l);
            changed = true;
        };
        // Link messi con le versioni 1.1–1.3 (campo unico o riquadri Link N / Nome N).
        if (!this.readStore(STORE_MIGRATED)) {
            this.parseLinks(String(this.setting("gofile_links") || "").split(/\r?\n/)[0]).forEach(push);
            for (var n = 1; n <= 15; n++) {
                var old = this.parseLinks(this.setting("gofile_link_" + n));
                if (old.length) { old[0].name = String(this.setting("gofile_name_" + n) || "").trim(); push(old[0]); }
            }
            this.writeStore(STORE_MIGRATED, "1");
        }
        // Prima si legge la scelta in «Togli i link» (la chiave dipende dai nomi di
        // prima), poi si toglie, si aggiunge, e il nome va all'ultimo link salvato,
        // anche se è appena stato aggiunto.
        var remove = links.length ? this.setting(this.removeKey(links)) : null;
        // La casella del nome mostrata era quella dell'elenco di prima di questa lettura.
        var renKey = this.renameKey(links);
        if (remove && remove.length) {
            links = links.filter(function (l) { return remove.indexOf(l.code) === -1; });
            changed = true;
            this.writeStore(STORE_REM_N, String((parseInt(this.readStore(STORE_REM_N), 10) || 0) + 1));
        }
        var added = this.parseLinks(this.setting(this.addKey()));
        if (added.length) {
            added.forEach(push);
            this.writeStore(STORE_ADD_N, String((parseInt(this.readStore(STORE_ADD_N), 10) || 0) + 1));
            this.writeStore(STORE_BATCH, JSON.stringify(added.map(function (a) { return a.code; })));
        }
        var newName = links.length ? String(this.setting(renKey) || "").trim() : "";
        if (newName) {
            var value = newName === "-" ? "" : newName.replace(/^[\s|]+|[\s|]+$/g, "").slice(0, 60);
            var batch = this.lastBatch(links);
            for (var bi = 0; bi < batch.length; bi++) {
                batch[bi].name = value === this.shortLink(batch[bi].code) ? "" : value;
            }
            changed = true;
            this.writeStore(STORE_REN_N, String((parseInt(this.readStore(STORE_REN_N), 10) || 0) + 1));
        }
        if (changed) this.writeStore(STORE_LINKS, JSON.stringify(links));
        // Copia URL/token nelle copie interne e raccogli l'eventuale scelta di «Aggiungi
        // alla lista condivisa» (l'invio vero, che è asincrono, lo fa getPopular).
        this.syncSettings();
        if (links.length) {
            var pushSel = this.setting(this.pushKey(links));
            if (pushSel && pushSel.length) {
                this.writeStore(STORE_PUSH_PENDING, JSON.stringify(pushSel));
                this.writeStore(STORE_PUSH_N, String((parseInt(this.readStore(STORE_PUSH_N), 10) || 0) + 1));
            }
        }
        this._linksMemo = { at: Date.now(), list: links };
        return links.slice();
    }

    // 1.12.2: i codici Bunkr perdono il dominio; doppioni uniti, liste e copertine spostate.
    dropBunkrHosts(links) {
        var self = this, out = [], seen = {};
        for (var i = links.length - 1; i >= 0; i--) {
            var c = this.normCode(links[i].code);
            if (seen[c]) { if (!seen[c].name && links[i].name) seen[c].name = links[i].name; continue; }
            seen[c] = { code: c, name: links[i].name };
            out.unshift(seen[c]);
        }
        ["gofile_folder_files", "gofile_folder_info"].forEach(function (key) {
            var m = self.readJson(key, {}), n = {};
            Object.keys(m).forEach(function (k) { if (k.indexOf("g:") !== 0) n[self.normCode(k)] = m[k]; });
            self.writeStore(key, JSON.stringify(n));
        });
        this.writeStore(STORE_LINKS, JSON.stringify(out));
        return out;
    }

    // URL della lista condivisa, dalla copia interna (non da setting(): vedi MIRROR_URL).
    // Vuoto o «-» = disattivata. Default: file nel repo.
    remoteUrl() {
        var u = String(this.readStore(MIRROR_URL) || "").trim();
        if (u === "-") return "";
        return u || DEFAULT_REMOTE_URL;
    }

    remoteToken() {
        return String(this.readStore(MIRROR_TOKEN) || "").trim();
    }

    // Copia i valori delle impostazioni URL/token nelle copie interne. Va chiamata solo
    // da dentro syncLinks (contesto in cui un re-invoke di getSourcePreferences è sicuro).
    syncSettings() {
        try { var u = this.setting("gofile_remote_url"); this.writeStore(MIRROR_URL, u == null ? "" : String(u)); } catch (e) {}
        try { var t = this.setting("gofile_remote_token"); this.writeStore(MIRROR_TOKEN, t == null ? "" : String(t)); } catch (e) {}
    }

    // Link letti dall'ultima volta dalla lista remota (cache locale, lettura sincrona).
    cachedRemote() {
        var url = this.remoteUrl();
        if (!url) return [];
        var c = this.readJson(STORE_REMOTE, null);
        return c && c.url === url && c.links ? c.links : [];
    }

    // Scarica la lista condivisa (se scaduta) e la mette in cache. In caso di errore di
    // rete tiene l'ultima buona. Si chiama da Popolari e dal «trascina per aggiornare».
    async refreshRemote(force) {
        var url = this.remoteUrl();
        if (!url) { if (this.readStore(STORE_REMOTE)) this.writeStore(STORE_REMOTE, ""); return; }
        var c = this.readJson(STORE_REMOTE, null);
        if (!force && c && c.url === url && Date.now() - (c.at || 0) < REMOTE_TTL) return;
        // Cache-buster: GitHub «raw» tiene il file per ~5 minuti; con un parametro unico
        // otteniamo subito la versione aggiornata (utile dopo aver aggiunto un link).
        var fetchUrl = url + (force ? (url.indexOf("?") === -1 ? "?" : "&") + "_=" + Date.now() : "");
        var res;
        try { res = await this.client.get(fetchUrl, { "User-Agent": UA, "Cache-Control": "no-cache" }); } catch (e) { return; }
        if (!res || res.statusCode !== 200) return;
        var links = [], self = this, seen = {};
        String(res.body || "").split(/\r?\n/).forEach(function (line) {
            var t = line.trim();
            if (!t || t.charAt(0) === "#") return;
            self.parseLinks(t).forEach(function (l) { if (l.code && !seen[l.code]) { seen[l.code] = 1; links.push(l); } });
        });
        this.writeStore(STORE_REMOTE, JSON.stringify({ url: url, at: Date.now(), links: links }));
    }

    // Link locali più quelli della lista condivisa (i locali hanno la precedenza).
    allLinks() {
        var local = this.savedLinks(), seen = {};
        for (var i = 0; i < local.length; i++) seen[local[i].code] = 1;
        var out = local.slice(), remote = this.cachedRemote();
        for (var j = 0; j < remote.length; j++) if (!seen[remote[j].code]) { seen[remote[j].code] = 1; out.push(remote[j]); }
        return out;
    }

    customName(code) {
        var links = this.allLinks();
        for (var i = 0; i < links.length; i++) if (links[i].code === code) return links[i].name;
        return "";
    }

    // --- Scrittura sulla lista condivisa (file GitHub) -------------------------------
    // Solo un URL «raw» di GitHub è scrivibile; da esso ricaviamo repo, ramo e percorso.
    remoteApiTarget() {
        var m = String(this.remoteUrl()).match(/^https?:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)$/i);
        if (!m) return null;
        return { owner: m[1], repo: m[2], branch: m[3], path: m[4] };
    }

    utf8Bytes(str) {
        var out = [];
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            if (c < 0x80) out.push(c);
            else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
            else if (c >= 0xd800 && c <= 0xdbff && i + 1 < str.length) {
                var cp = 0x10000 + ((c & 0x3ff) << 10) + (str.charCodeAt(++i) & 0x3ff);
                out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3f), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
            } else out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
        }
        return out;
    }

    utf8FromBytes(bytes) {
        var s = "", i = 0;
        while (i < bytes.length) {
            var c = bytes[i++];
            if (c < 0x80) s += String.fromCharCode(c);
            else if (c < 0xe0) s += String.fromCharCode(((c & 0x1f) << 6) | (bytes[i++] & 0x3f));
            else if (c < 0xf0) s += String.fromCharCode(((c & 0x0f) << 12) | ((bytes[i++] & 0x3f) << 6) | (bytes[i++] & 0x3f));
            else {
                var cp = ((c & 0x07) << 18) | ((bytes[i++] & 0x3f) << 12) | ((bytes[i++] & 0x3f) << 6) | (bytes[i++] & 0x3f);
                cp -= 0x10000;
                s += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 0x3ff));
            }
        }
        return s;
    }

    bytesToB64(bytes) {
        var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", out = "";
        for (var i = 0; i < bytes.length; i += 3) {
            var b1 = bytes[i], b2 = i + 1 < bytes.length ? bytes[i + 1] : NaN, b3 = i + 2 < bytes.length ? bytes[i + 2] : NaN;
            var e1 = b1 >> 2, e2 = ((b1 & 3) << 4) | (isNaN(b2) ? 0 : b2 >> 4);
            var e3 = isNaN(b2) ? 64 : (((b2 & 15) << 2) | (isNaN(b3) ? 0 : b3 >> 6)), e4 = isNaN(b3) ? 64 : (b3 & 63);
            out += abc.charAt(e1) + abc.charAt(e2) + (e3 === 64 ? "=" : abc.charAt(e3)) + (e4 === 64 ? "=" : abc.charAt(e4));
        }
        return out;
    }

    b64ToBytes(b64) {
        var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var t = String(b64 || "").replace(/[^A-Za-z0-9+/]/g, ""), out = [], bits = 0, val = 0;
        for (var i = 0; i < t.length; i++) {
            val = (val << 6) | abc.indexOf(t.charAt(i));
            bits += 6;
            if (bits >= 8) { bits -= 8; out.push((val >> bits) & 255); }
        }
        return out;
    }

    pushStatus() { return this.readStore(STORE_PUSH_STATUS); }
    setPushStatus(t) { this.writeStore(STORE_PUSH_STATUS, String(t || "")); }

    pushKey(localLinks) {
        var h = 0, str = localLinks.map(function (l) { return l.code; }).join("|");
        for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
        return "gofile_push_" + (parseInt(this.readStore(STORE_PUSH_N), 10) || 0) + "_" + (h >>> 0).toString(36);
    }

    // Aggiunge i link scelti al file GitHub della lista condivisa. Legge il contenuto
    // attuale (per il suo sha), accoda le righe mancanti e rimanda indietro il file.
    async pushToRemote(codes) {
        var tok = this.remoteToken();
        var tgt = this.remoteApiTarget();
        if (!tok) { this.setPushStatus("Manca il token GitHub: mettilo in «Token GitHub»."); return; }
        if (!tgt) { this.setPushStatus("La lista condivisa non è un file GitHub su cui scrivere."); return; }
        var api = "https://api.github.com/repos/" + tgt.owner + "/" + tgt.repo + "/contents/" + tgt.path;
        var hdr = { "Authorization": "token " + tok, "Accept": "application/vnd.github+json", "Content-Type": "application/json", "User-Agent": UA };
        var cur = "", sha = "";
        try {
            var g = await this.client.get(api + "?ref=" + encodeURIComponent(tgt.branch), hdr);
            if (g && g.statusCode === 200) { var j = JSON.parse(String(g.body || "{}")); sha = j.sha || ""; cur = this.utf8FromBytes(this.b64ToBytes(j.content || "")); }
            else if (!g || g.statusCode !== 404) { this.setPushStatus("GitHub ha risposto " + (g && g.statusCode) + " alla lettura. Controlla il token."); return; }
        } catch (e) { this.setPushStatus("Non riesco a leggere il file (rete?)."); return; }
        var links = this.savedLinks(), byCode = {};
        for (var i = 0; i < links.length; i++) byCode[links[i].code] = links[i];
        var add = [], addedLinks = [];
        for (var k = 0; k < codes.length; k++) {
            var l = byCode[codes[k]]; if (!l) continue;
            var url = this.linkUrl(l.code);
            if (cur.indexOf(url) !== -1) continue; // già presente nel file
            add.push(url + (l.name ? " | " + l.name : ""));
            addedLinks.push({ code: l.code, name: l.name });
        }
        if (!add.length) { this.setPushStatus("Niente da aggiungere: erano già nella lista."); return; }
        var next = cur.replace(/\s*$/, "") + "\n" + add.join("\n") + "\n";
        var body = { message: "Aggiungi " + add.length + " link da Mangayomi", content: this.bytesToB64(this.utf8Bytes(next)), branch: tgt.branch };
        if (sha) body.sha = sha;
        try {
            var p = await this.client.put(api, hdr, body);
            if (p && (p.statusCode === 200 || p.statusCode === 201)) {
                // Aggiorna subito la cache locale così l'elenco del documento mostra i
                // nuovi link senza aspettare la cache di GitHub (raw può restare vecchia).
                var cached = this.cachedRemote().slice(), have = {};
                cached.forEach(function (x) { have[x.code] = 1; });
                addedLinks.forEach(function (x) { if (!have[x.code]) cached.push(x); });
                this.writeStore(STORE_REMOTE, JSON.stringify({ url: this.remoteUrl(), at: Date.now(), links: cached }));
                this.setPushStatus("Aggiunti " + add.length + " link alla lista. ✓");
            } else {
                var sc = p && p.statusCode;
                var why = (sc === 401 || sc === 403) ? "il token è sbagliato o senza permesso Contents: Read and write su quel repo."
                    : sc === 404 ? "repo o file non trovato (controlla l'URL della lista)."
                    : sc === 409 ? "conflitto: riprova (il file è cambiato nel frattempo)."
                    : sc === 422 ? "richiesta rifiutata (file troppo grande o dati non validi)."
                    : "richiesta non valida; riprova.";
                this.setPushStatus("GitHub ha risposto " + sc + " alla scrittura: " + why);
            }
        } catch (e) { this.setPushStatus("Non riesco a scrivere il file (rete?)."); }
    }

    infoMap() {
        try { return JSON.parse(this.readStore(STORE_INFO) || "{}") || {}; } catch (e) { return {}; }
    }

    // Link con lo stesso nome (maiuscole e spazi non contano) sono una scheda sola,
    // «/g/<nome>», con i video di tutti i link. Senza nome: una scheda per link, «/d/<codice>».
    groupKey(name) {
        return String(name || "").trim().toLowerCase().replace(/\s+/g, " ");
    }

    // Raggruppa per nome la lista passata (o tutti i link se non specificata).
    groupsFrom(links) {
        if (!links) links = this.allLinks();
        var byKey = {}, order = [];
        for (var i = 0; i < links.length; i++) {
            var key = links[i].name ? this.groupKey(links[i].name) : "#" + links[i].code;
            if (!byKey[key]) { byKey[key] = { key: key, name: links[i].name, codes: [], last: i }; order.push(key); }
            byKey[key].codes.push(links[i].code);
            byKey[key].last = i;
        }
        var out = order.map(function (k) { return byKey[k]; });
        out.sort(function (x, y) { return y.last - x.last; });
        return out;
    }

    groups() { return this.groupsFrom(); }

    groupOf(key) {
        // Cerca tra tutti (locali + documento) così sia Popolari sia Recenti aprono.
        var all = this.groupsFrom();
        for (var i = 0; i < all.length; i++) if (all[i].key === key) return all[i];
        return null;
    }

    filesMap() {
        return this.readJson(STORE_FILES, {});
    }

    cardPath(code) {
        if (this.isEmbed(code)) return "/em/" + encodeURIComponent(code);
        if (this.isFilester(code)) return "/fl/" + code;
        if (this.isPixeldrain(code)) return "/pd/" + code;
        return (this.isBunkr(code) ? "/bk/" : "/d/") + code;
    }

    // Copertina: la miniatura del primo video (solo indirizzi http).
    coverOf(code) {
        var info = this.infoMap()[code] || {};
        if (/^http/.test(info.image || "")) return info.image;
        var f = this.filesMap()[code];
        return f && f.files.length && f.files[0].img ? f.files[0].img : "";
    }

    card(code, name) {
        var info = this.infoMap()[code] || {};
        return { name: name || this.customName(code) || info.name || this.shortLink(code), imageUrl: this.coverOf(code), link: this.cardPath(code) };
    }

    groupCard(g) {
        if (g.key.charAt(0) === "#") return this.card(g.codes[0], "");
        var cover = "";
        for (var i = 0; i < g.codes.length && !cover; i++) cover = this.coverOf(g.codes[i]);
        return { name: g.name, imageUrl: cover, link: "/g/" + encodeURIComponent(g.key) };
    }

    // Legge una cartella e ricorda lista dei video, titolo e (se chiesta) copertina.
    // Se Gofile non risponde non salva niente: si riprova la volta dopo.
    async readOne(code) {
        if (this.isBunkr(code)) return this.readBunkr(code);
        if (this.isFilester(code)) return this.readFilester(code);
        if (this.isPixeldrain(code)) return this.readPixeldrain(code);
        if (this.isEmbed(code)) return this.readEmbed(code);
        var data;
        try { data = await this.readFolder(code); } catch (e) { return null; }
        var rows = data.rows || [];
        var notFound = !rows.length && /not found/i.test(String(data.text || ""));
        if (!rows.length && !notFound) return data;
        var title = notFound ? "Gofile " + code + " (non trovata)" : String(data.title || "").replace(/\s*·\s*Gofile\s*$/i, "").trim() || code;
        if (VIDEO_EXT.test(title)) title = this.episodeName(title);
        var files = rows.filter(function (r) { return r.type === "file" && VIDEO_EXT.test(r.name || ""); })
            .map(function (r) { return { n: r.name, img: r.img }; });
        var fm = this.filesMap();
        fm[code] = { title: title, files: files, folders: rows.filter(function (r) { return r.type === "folder"; }).length, at: Date.now(), v: READ_V };
        this.writeStore(STORE_FILES, JSON.stringify(fm));
        var map = this.infoMap();
        var old = map[code] || {};
        var thumb = files.length && files[0].img ? files[0].img : "";
        map[code] = { name: title, image: thumb || (/^http/.test(old.image || "") ? old.image : "") };
        this.writeStore(STORE_INFO, JSON.stringify(map));
        return data;
    }

    decodeHtml(t) {
        return String(t || "").replace(/&quot;/g, '"').replace(/&#0*39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
    }

    // Pagina di Bunkr dal primo dominio che risponde davvero (prima quello che ha
    // funzionato l'ultima volta). Una pagina di blocco dell'operatore non è Bunkr.
    // Un dominio bloccato può far aspettare il telefono finché non rinuncia: chi non ha
    // risposto (o ha dato una pagina di blocco) si salta per 24 ore e si prova per ultimo.
    async bunkrPage(path, host) {
        var bad = this.readJson(STORE_BK_BAD, {}), now = Date.now();
        var order = [this.readStore(STORE_BK_HOST), host].concat(BUNKR_HOSTS).filter(function (h, i, a) { return h && a.indexOf(h) === i; });
        var fresh = order.filter(function (h) { return !(bad[h] && now - bad[h] < BAD_TTL); });
        order = fresh.concat(order.filter(function (h) { return fresh.indexOf(h) === -1; }));
        var tried = [];
        for (var i = 0; i < order.length; i++) {
            var res = null;
            try { res = await this.client.get("https://" + order[i] + path, { "User-Agent": UA }); } catch (e) {}
            var html = String((res && res.body) || "");
            var status = res ? res.statusCode : 0;
            var isBunkr = /\|\s*Bunkr\s*<\/title>|theItem|bunkr/i.test(html.slice(0, 20000)) && /<title>/i.test(html);
            if (status === 200 && isBunkr) {
                this.writeStore(STORE_BK_HOST, order[i]);
                if (bad[order[i]]) { delete bad[order[i]]; this.writeStore(STORE_BK_BAD, JSON.stringify(bad)); }
                return { html: html, host: order[i], status: 200 };
            }
            if (status === 404 && isBunkr) return { html: html, host: order[i], status: 404 };
            bad[order[i]] = Date.now();
            this.writeStore(STORE_BK_BAD, JSON.stringify(bad));
            tried.push(order[i] + " " + (status || "nessuna risposta"));
        }
        return { html: "", host: host, status: 0, tried: tried };
    }

    // Estrae i file video da una pagina album Bunkr (nome, miniatura, slug /f/),
    // saltando i doppioni tra pagine diverse.
    collectBunkrFiles(html, host, files, seen) {
        var parts = String(html).split(/class="relative group\/item theItem"/).slice(1);
        for (var i = 0; i < parts.length; i++) {
            var p = parts[i];
            var slug = (p.match(/href="\/f\/([A-Za-z0-9]+)"/) || [])[1];
            var name = this.decodeHtml((p.match(/class="truncate theName[^"]*">([^<]+)</) || [])[1] || (p.match(/title="([^"]+)"/) || [])[1] || "");
            if (!slug || seen[slug] || !VIDEO_EXT.test(name)) continue;
            seen[slug] = 1;
            files.push({ n: name, img: (p.match(/class="grid-images_box-img"[^>]*?src="([^"]+)"/) || p.match(/src="([^"]+)"[^>]*class="grid-images_box-img"/) || [])[1] || "", bf: slug, bh: host });
        }
    }

    // Album Bunkr dalla WebView: carica ?advanced=1 (tutti i file in window.albumFiles),
    // superando le query e l'eventuale verifica Cloudflare che bloccano l'HTTP diretto.
    async readBunkrAlbumWebview(b, host) {
        if (typeof evaluateJavascriptViaWebview !== "function") return null;
        var h = host || this.readStore(STORE_BK_HOST) || "bunkr.si";
        var raw;
        try { raw = await evaluateJavascriptViaWebview("https://" + h + "/a/" + b.id, {}, [bunkrAlbumScript()], 45); } catch (e) { return null; }
        var data = null;
        try { data = JSON.parse(raw || "null"); } catch (e) {}
        if (!data) return null;
        var out = [], seen = {}, arr = data.files || [];
        for (var i = 0; i < arr.length; i++) {
            var x = arr[i] || {};
            if (!x.slug || seen[x.slug] || String(x.type || "").indexOf("video/") !== 0) continue;
            seen[x.slug] = 1;
            out.push({ n: this.decodeHtml(x.original || "video.mp4"), img: x.thumbnail || "", bf: x.slug, bh: h });
        }
        return { title: this.decodeHtml(String(data.title || "").replace(/\s*\|\s*Bunkr\s*$/i, "")), files: out };
    }

    // La pagina dell'album ha nome, miniatura e link /f/<id> di ogni file; quella di un
    // file ha la miniatura. Gli album grandi sono paginati a 100 file, quindi per
    // leggerli tutti si usa la WebView (modalità avanzata); l'HTTP paginato è il ripiego.
    async readBunkr(code) {
        var b = this.bunkrParts(code);
        var reqPath = "/" + b.kind + "/" + b.id;
        var page = await this.bunkrPage(reqPath, b.host);
        if (!page.status) return { rows: [], text: "bunkr-blocked " + (page.tried || []).join(", ") };
        var html = page.html;
        var files = [];
        var partial = false;
        var title = this.decodeHtml((html.match(/<title>([^<]*)<\/title>/i) || [])[1] || "").replace(/\s*\|\s*Bunkr\s*$/i, "");
        if (b.kind === "a") {
            // Prima la WebView (modalità avanzata = tutti i file in una volta). Se non
            // c'è la WebView o non dà nulla, ripiego sulla lettura paginata via HTTP.
            var wv = await this.readBunkrAlbumWebview(b, page.host);
            if (wv && wv.files.length) { if (wv.title) title = wv.title; files = wv.files; }
            if (!files.length) {
                var seen = {}, expMax = 1, pmx = html.match(/[?&]page=(\d+)/g) || [];
                for (var xi = 0; xi < pmx.length; xi++) { var xn = parseInt(pmx[xi].replace(/\D/g, ""), 10) || 1; if (xn > expMax) expMax = xn; }
                this.collectBunkrFiles(html, page.host, files, seen);
                for (var pg = 2; pg <= 60; pg++) {
                    var before = files.length;
                    var body = await this.bunkrAlbumPage(page.host, b.id, pg);
                    if (body == null) { if (pg <= expMax) partial = true; break; }
                    this.collectBunkrFiles(body, page.host, files, seen);
                    if (files.length === before) { if (pg <= expMax && !/theItem/.test(body)) partial = true; break; }
                }
            }
        } else {
            var og = (html.match(/property="og:image" content="([^"]+)"/) || [])[1] || "";
            if (VIDEO_EXT.test(title)) {
                files.push({ n: title, img: og, bf: b.id, bh: page.host });
                title = this.episodeName(title);
            }
        }
        var notFound = page.status === 404;
        if (notFound) title = this.shortLink(code) + " (non trovata)";
        var fm = this.filesMap();
        fm[code] = { title: title || this.shortLink(code), files: files, folders: 0, at: Date.now(), partial: !!partial, v: READ_V };
        this.writeStore(STORE_FILES, JSON.stringify(fm));
        var map = this.infoMap();
        map[code] = { name: fm[code].title, image: files.length ? files[0].img : "" };
        this.writeStore(STORE_INFO, JSON.stringify(map));
        return { rows: files, text: notFound ? "not found" : "" };
    }

    // Una pagina successiva di un album Bunkr (?page=N): prima il dominio che ha già
    // risposto, poi gli altri come ripiego, senza marcare «non valido» chi fallisce
    // (così un intoppo qui non rovina la lettura degli altri album). Restituisce il
    // corpo della prima risposta 200 con elementi album, o null se nessuno risponde.
    async bunkrAlbumPage(host, id, pg) {
        var order = [host].concat(BUNKR_HOSTS).filter(function (h, i, a) { return h && a.indexOf(h) === i; });
        for (var i = 0; i < order.length; i++) {
            var res = null;
            try { res = await this.client.get("https://" + order[i] + "/a/" + id + "?page=" + pg, { "User-Agent": UA }); } catch (e) {}
            if (res && res.statusCode === 200 && /theItem/.test(String(res.body || ""))) return String(res.body);
        }
        return null;
    }

    // filester.me: host di file con API pubblica in chiaro. La pagina /d/<slug> dà
    // titolo e copertina; il video si ottiene al momento dall'API (permesso a tempo).
    async readFilester(code) {
        var slug = String(code).slice(3);
        var res;
        try { res = await this.client.get("https://filester.me/d/" + slug, { "User-Agent": UA }); } catch (e) { return null; }
        var html = String((res && res.body) || "");
        var status = res ? res.statusCode : 0;
        if (status >= 500) return null;
        var raw = this.decodeHtml((html.match(/<title>([^<]*)<\/title>/i) || [])[1] || "").replace(/\s*\|\s*filester\.me\s*$/i, "");
        var notFound = status === 404 || (!raw && !/videoPlayer/.test(html));
        var title = notFound ? this.shortLink(code) + " (non trovata)" : (this.episodeName(raw) || slug);
        var img = (html.match(/property="og:image" content="([^"]+)"/) || [])[1] || "";
        var fm = this.filesMap();
        fm[code] = { title: title, files: notFound ? [] : [{ n: raw || "video.mp4", img: img, fl: slug }], folders: 0, at: Date.now(), v: READ_V };
        this.writeStore(STORE_FILES, JSON.stringify(fm));
        var map = this.infoMap();
        map[code] = { name: title, image: /^http/.test(img) ? img : "" };
        this.writeStore(STORE_INFO, JSON.stringify(map));
        return { rows: fm[code].files, text: notFound ? "not found" : "" };
    }

    // pixeldrain: API pubblica in chiaro. Un file (/u/) è un video; una lista (/l/) è
    // una cartella di video. Titolo e miniatura dall'API; il video è l'URL diretto
    // /api/file/<id>, senza Referer né permessi a tempo.
    async readPixeldrain(code) {
        var p = this.pdParts(code);
        var api = p.kind === "l"
            ? "https://pixeldrain.com/api/list/" + p.id
            : "https://pixeldrain.com/api/file/" + p.id + "/info";
        var res;
        try { res = await this.client.get(api, { "User-Agent": UA }); } catch (e) { return null; }
        if (res && res.statusCode >= 500) return null;
        var data = null;
        try { data = JSON.parse(String((res && res.body) || "")); } catch (e) {}
        // L'API risponde sempre in JSON (anche «file assente»: {"success":false}).
        // Se arriva altro (pagina di blocco dell'operatore, challenge, errore di rete
        // travestito da 200) pixeldrain non è davvero raggiungibile dal telefono: non è
        // un file sparito. Non salviamo una scheda «non trovata», così si riprova dopo.
        if (!data) return { rows: [], text: "pd-unreachable" };
        var notFound = !data.success;
        var files = [], title = "";
        if (!notFound && p.kind === "l") {
            title = this.episodeName(data.title || "") || p.id;
            var arr = data.files || [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].mime_type && arr[i].mime_type.indexOf("video/") !== 0) continue;
                files.push({ n: arr[i].name || "video.mp4", img: "https://pixeldrain.com/api/file/" + arr[i].id + "/thumbnail", pd: arr[i].id });
            }
        } else if (!notFound) {
            title = this.episodeName(data.name || "") || p.id;
            files.push({ n: data.name || "video.mp4", img: "https://pixeldrain.com/api/file/" + p.id + "/thumbnail", pd: p.id });
        }
        if (notFound) title = this.shortLink(code) + " (non trovata)";
        var fm = this.filesMap();
        fm[code] = { title: title, files: files, folders: 0, at: Date.now(), v: READ_V };
        this.writeStore(STORE_FILES, JSON.stringify(fm));
        var map = this.infoMap();
        map[code] = { name: title, image: files.length ? files[0].img : "" };
        this.writeStore(STORE_INFO, JSON.stringify(map));
        return { rows: files, text: notFound ? "not found" : "" };
    }

    // Link incapsulato. Se dentro em= c'è un file Gofile → un video. Se c'è un altro
    // sito (es. uno streaming con video protetto) → non si può aprire, e si dice perché.
    readEmbed(code) {
        var inner = this.embedInner(this.linkUrl(code));
        var gofile = this.embedTarget(this.linkUrl(code));
        var complete = gofile && this.embedComplete(gofile);
        var state = "";
        if (!gofile) state = "other";          // altro sito, non Gofile
        else if (!complete) state = "cut";      // Gofile ma tagliato nell'incollare
        var name = "";
        try { name = decodeURIComponent(gofile.split("?")[0].split("/").pop()); } catch (e) { name = gofile.split("?")[0].split("/").pop(); }
        var otherHost = state === "other" ? (inner.match(/^https?:\/\/([^/]+)/) || [])[1] || "" : "";
        var fm = this.filesMap();
        fm[code] = {
            title: state === "other" ? (otherHost + " (non Gofile)") : state === "cut" ? "Link incompleto" : (this.episodeName(name) || this.shortLink(code)),
            files: state ? [] : [{ n: name || "video.mp4", img: "", em: code }],
            folders: 0, at: Date.now(), embState: state, otherHost: otherHost, v: READ_V,
        };
        this.writeStore(STORE_FILES, JSON.stringify(fm));
        var map = this.infoMap();
        map[code] = { name: fm[code].title, image: "" };
        this.writeStore(STORE_INFO, JSON.stringify(map));
        return { rows: fm[code].files, text: state === "other" ? "embed-other:" + otherHost : state === "cut" ? "embed-cut" : "" };
    }

    // Tre cartelle alla volta.
    async readMany(codes) {
        for (var k = 0; k < codes.length; k += 3) {
            await Promise.all(codes.slice(k, k + 3).map(function (c) { return this.readOne(c); }.bind(this)));
        }
    }

    // Popolari: legge una volta sola i link nuovi (lista dei video e copertina insieme),
    // così poi le schede e le raccolte si aprono subito.
    async getPopular(page) {
        if (page > 1) return { list: [], hasNextPage: false };
        this.fixOnce();
        // savedLinks() sincronizza (copie interne del token/URL + raccoglie la scelta
        // «Aggiungi alla lista condivisa» in STORE_PUSH_PENDING). Azzeriamo la memo così
        // la sincronizzazione (e quindi la copia del token) è sempre fresca prima di
        // scrivere: altrimenti un token appena messo potrebbe non essere ancora copiato.
        this._linksMemo = null;
        this.savedLinks();
        try {
            var pending = this.readJson(STORE_PUSH_PENDING, null);
            if (pending && pending.length) {
                this.writeStore(STORE_PUSH_PENDING, "");
                await this.pushToRemote(pending);
            }
            await this.refreshRemote(true);
        } catch (e) { /* la lista condivisa non deve mai bloccare Popolari */ }
        // Popolari: solo i link salvati sul telefono.
        return this.browseGroups(this.groupsFrom(this.savedLinks()));
    }

    // Legge le schede mancanti dei gruppi e restituisce le loro card. Condiviso da
    // Popolari (link locali) e Recenti (link della lista condivisa).
    async browseGroups(groups) {
        var fm = this.filesMap(), self = this;
        var codes = [];
        groups.forEach(function (g) { codes = codes.concat(g.codes); });
        var missing = codes.filter(function (c) {
            var f = fm[c];
            if (!f) return true;
            if (f.v !== READ_V) return true; // scheda salvata da una versione precedente: rileggi una volta
            // Una cartella «non trovata» si riprova dopo 6 ore.
            return /non trovata/.test(f.title || "") && Date.now() - (f.at || 0) > FILES_TTL;
        });
        if (typeof evaluateJavascriptViaWebview !== "function") missing = missing.filter(function (c) { return self.isBunkr(c) || self.isFilester(c) || self.isPixeldrain(c) || self.isEmbed(c); });
        if (missing.length) await this.readMany(missing);
        return { list: groups.map(function (g) { return self.groupCard(g); }), hasNextPage: false };
    }

    // 1.12: via le copertine «data:» (Mangayomi le rompe) e si riprovano gli album
    // Bunkr segnati «non trovata» quando il dominio era solo bloccato.
    fixOnce() {
        if (this.readStore(STORE_FIX)) return;
        var info = this.infoMap(), fm = this.filesMap();
        Object.keys(info).forEach(function (k) {
            if (k.indexOf("g:") === 0) delete info[k];
            else if (!/^http/.test(info[k].image || "")) info[k].image = "";
        });
        Object.keys(fm).forEach(function (k) {
            if (k.indexOf("bk~") === 0 && /non trovata/.test(fm[k].title || "")) { delete fm[k]; delete info[k]; }
        });
        this.writeStore(STORE_INFO, JSON.stringify(info));
        this.writeStore(STORE_FILES, JSON.stringify(fm));
        this.writeStore(STORE_FIX, "1");
    }

    // Recenti: i link della lista condivisa (il documento). Popolari resta sui tuoi.
    async getLatestUpdates(page) {
        if (page > 1) return { list: [], hasNextPage: false };
        this.fixOnce();
        try { this.savedLinks(); await this.refreshRemote(true); } catch (e) {}
        return this.browseGroups(this.groupsFrom(this.cachedRemote()));
    }

    // Nella ricerca si può incollare un link (o il codice) per aprirlo una volta;
    // altrimenti filtra le schede salvate per nome.
    async search(query, page, filters) {
        if (page > 1) return { list: [], hasNextPage: false };
        var q = String(query || "").trim();
        var code = /gofile\.io|bunkr+\.|filester\.[a-z]{2,}|pixeldrain\.com|[?&]em=/i.test(q) ? this.linkCode(q) : "";
        if (code) return { list: [this.card(code)], hasNextPage: false };
        // La ricerca guarda tutti (locali + documento).
        this.savedLinks();
        try { await this.refreshRemote(true); } catch (e) {}
        var all = (await this.browseGroups(this.groupsFrom())).list;
        if (!q) return { list: all, hasNextPage: false };
        var low = q.toLowerCase();
        var list = all.filter(function (c) { return c.name.toLowerCase().indexOf(low) !== -1 || c.link.toLowerCase().indexOf(low) !== -1; });
        if (!list.length && this.codeOf(q)) list = [this.card(this.codeOf(q))];
        return { list: list, hasNextPage: false };
    }

    async readFolder(code) {
        if (typeof evaluateJavascriptViaWebview !== "function") {
            throw new Error("Gofile: serve Mangayomi 0.9.96 o successivo (WebView per le estensioni).");
        }
        var raw = await evaluateJavascriptViaWebview("https://gofile.io/d/" + code, {}, [listScript()], 40);
        var data = null;
        try { data = JSON.parse(raw || "null"); } catch (e) {}
        if (!data) throw new Error("Gofile: la pagina non ha risposto in tempo. Riprova.");
        var token = (String(data.cookie || "").match(/accountToken=([^;]+)/) || [])[1] || "";
        if (token) this.writeStore(STORE_TOKEN, token);
        return data;
    }

    episodeName(name) {
        return String(name || "").replace(/\.[A-Za-z0-9]{2,4}$/, "").trim() || "Video";
    }

    // La scheda usa le liste ricordate. Si rileggono quelle mai lette o vecchie di più
    // di 6 ore (aggiornamento della libreria), e tutte se la scheda viene richiesta di
    // nuovo entro 2 minuti: è il «trascina in basso per aggiornare».
    async getDetail(url) {
        var raw = String(url);
        this.savedLinks(); // aggiorna le copie interne (URL della lista) prima di leggerla
        try { await this.refreshRemote(); } catch (e) {}
        var g = null, codes;
        var gm = raw.match(/\/g\/([^?#]+)/);
        if (gm) {
            g = this.groupOf(decodeURIComponent(gm[1]));
            if (!g) throw new Error("Gofile: questa raccolta non c'è più tra i link salvati.");
            codes = g.codes;
        } else {
            var bk = raw.match(/\/bk\/(bk~[^?#\/]+)/);
            var emm = raw.match(/\/em\/(em(?:~|%7E)[^#]+)/i);
            var flm = raw.match(/\/fl\/(fl~[A-Za-z0-9]+)/i);
            var pdm = raw.match(/\/pd\/(pd~[^?#\/]+)/i);
            var code = pdm ? pdm[1] : flm ? flm[1] : emm ? decodeURIComponent(emm[1]) : bk ? this.normCode(decodeURIComponent(bk[1])) : (this.codeOf(raw) || this.codeOf(raw.replace(/^\/d\//, "")));
            if (!code) throw new Error("Gofile: link non valido.");
            codes = [code];
        }
        this._seen = this._seen || {};
        var again = this._seen[raw] && Date.now() - this._seen[raw] < 120000;
        this._seen[raw] = Date.now();
        var fm = this.filesMap(), info = this.infoMap();
        var need = codes.filter(function (c) { return again || !fm[c] || fm[c].v !== READ_V || Date.now() - (fm[c].at || 0) > FILES_TTL; });
        var problem = "";
        if (need.length) {
            for (var k = 0; k < need.length; k += 3) {
                var got = await Promise.all(need.slice(k, k + 3).map(function (c) { return this.readOne(c); }.bind(this)));
                got.forEach(function (d) {
                    if (!d || (d.rows || []).length) return;
                    var why = String(d.text || "");
                    if (/^bunkr-blocked/.test(why)) problem = "Bunkr non risponde dal tuo telefono: forse i suoi domini sono bloccati dal tuo operatore. Provati: " + why.replace(/^bunkr-blocked\s*/, "") + ". Se si sblocca, trascina in basso la scheda.";
                    else if (/pd-unreachable/.test(why)) problem = "pixeldrain non risponde dal tuo telefono (ha dato una pagina di blocco, non i dati del file). Spesso in Italia pixeldrain.com è bloccato dall'operatore: prova a cambiare rete (dati mobili al posto del Wi-Fi o viceversa), oppure apri il link nel browser per controllare. Se si sblocca, trascina in basso la scheda.";
                    else if (/unreachable/i.test(why)) problem = "Gofile non risponde in questo momento: riprova tra qualche minuto (trascina in basso la scheda).";
                    else if (/password/i.test(why)) problem = "Una cartella è protetta da password: aprila nel browser.";
                    else if (/embed-cut/.test(why)) problem = "Il link si è tagliato quando l'hai incollato: toglilo da «Togli i link» e reincollalo per intero (tutto fino alla fine).";
                });
            }
            fm = this.filesMap();
            info = this.infoMap();
        }

        var chapters = [], videos = 0, folders = 0, missingThumb = 0, gone = 0, cut = 0, other = "";
        for (var i = 0; i < codes.length; i++) {
            var f = fm[codes[i]];
            if (!f) continue;
            if (/non trovata/.test(f.title || "")) gone++;
            if (f.embState === "cut") cut++;
            if (f.embState === "other") other = f.otherHost || "quel sito";
            folders += f.folders || 0;
            for (var j = 0; j < f.files.length; j++) {
                var v = f.files[j];
                videos++;
                if (v.em) {
                    chapters.push({ name: "Episodio " + (chapters.length + 1) + " - " + this.episodeName(v.n), url: "embed:" + v.em });
                    continue;
                }
                if (v.bf) {
                    chapters.push({ name: "Episodio " + (chapters.length + 1) + " - " + this.episodeName(v.n), url: "bunkr:https://" + v.bh + "/f/" + v.bf, thumbnailUrl: v.img });
                    continue;
                }
                if (v.fl) {
                    chapters.push({ name: "Episodio " + (chapters.length + 1) + " - " + this.episodeName(v.n), url: "filester:" + v.fl, thumbnailUrl: /^http/.test(v.img || "") ? v.img : undefined });
                    continue;
                }
                if (v.pd) {
                    chapters.push({ name: "Episodio " + (chapters.length + 1) + " - " + this.episodeName(v.n), url: "pixeldrain:" + v.pd, thumbnailUrl: /^http/.test(v.img || "") ? v.img : undefined });
                    continue;
                }
                var base = /^https?:\/\/[^/]+\.gofile\.io\/download\/web\/[^/]+\//.test(v.img || "") ? v.img.replace(/[^/]+$/, "") : "";
                if (!base) { missingThumb++; continue; }
                chapters.push({ name: "Episodio " + (chapters.length + 1) + " - " + this.episodeName(v.n), url: base + encodeURIComponent(v.n), thumbnailUrl: v.img });
            }
        }
        // Dall'ultimo al primo, come le altre sorgenti: così Mangayomi trova il successivo.
        chapters.reverse();

        var single = codes.length === 1 ? (fm[codes[0]] || {}) : null;
        var title = g ? g.name : (this.customName(codes[0]) || (single && single.title) || this.shortLink(codes[0]));
        var image = "";
        for (var ci = 0; ci < codes.length && !image; ci++) image = this.coverOf(codes[ci]);
        var lines = [];
        lines.push(codes.length > 1 ? codes.length + " link · " + videos + " video" : videos + " video");
        var bunkrPartial = false;
        for (var qp = 0; qp < codes.length; qp++) if (fm[codes[qp]] && fm[codes[qp]].partial) bunkrPartial = true;
        if (bunkrPartial) lines.push("Album grande: sono riuscito a leggere solo questi " + videos + " video. Le pagine successive dell'album non si scaricano dal tuo telefono (possibile blocco o limite di rete su Bunkr). Prova a cambiare rete, o trascina in basso per riprovare.");
        if (missingThumb) lines.push(missingThumb + " video senza anteprima non si possono aprire da qui.");
        if (folders) lines.push(folders + " sottocartelle: aggiungile come link a parte.");
        if (gone) lines.push(codes.length > 1 ? gone + " link non esistono più su Gofile." : "Questa cartella non esiste più su Gofile.");
        if (other && !videos) lines = ["Questo link non porta a un file Gofile ma a " + other + ", un sito di streaming con il video protetto. L'estensione apre solo i file Gofile (e gli album Bunkr), non lo streaming protetto di altri siti."];
        else if (other) lines.push("Un link porta a " + other + " (streaming protetto), non apribile qui.");
        if (cut && !videos) lines = ["Link incompleto: si è tagliato quando l'hai incollato. Toglilo da «Togli i link» e reincollalo per intero, fino alla fine."];
        else if (cut) lines.push(cut + " link si sono tagliati nell'incollare: reincollali per intero.");
        if (problem && !videos && !cut && !other) lines = [problem];
        else if (problem) lines.push(problem);
        if (!videos && !problem && !gone && !Object.keys(fm).some(function (c) { return codes.indexOf(c) !== -1; })) {
            lines = ["Nessun file trovato. La cartella può essere vuota o scaduta."];
        }

        return {
            name: title,
            link: g ? "/g/" + encodeURIComponent(g.key) : this.cardPath(codes[0]),
            imageUrl: image,
            description: lines.join("\n") + "\n\n" + codes.map(this.linkUrl.bind(this)).join("\n"),
            genre: [],
            status: 1,
            chapters: chapters,
        };
    }

    // Bunkr: la pagina del file ha l'indirizzo del mp4 (jsCDN) e quello che lo firma
    // (signUrl); il loro lettore chiede la firma e la aggiunge al link, come qui.
    async bunkrVideo(page) {
        var m = String(page).match(/^https?:\/\/([^/]+)(\/.*)$/);
        var got = m ? await this.bunkrPage(m[2], m[1]) : { html: "" };
        if (!got.status) throw new Error("Bunkr non risponde dal tuo telefono: forse i suoi domini sono bloccati dal tuo operatore. Provati: " + (got.tried || []).join(", "));
        var html = got.html;
        var unq = function (v) { return String(v || "").replace(/\\\//g, "/"); };
        var cdn = unq((html.match(/var\s+jsCDN\s*=\s*"([^"]+)"/) || [])[1]);
        var signer = unq((html.match(/var\s+signUrl\s*=\s*"([^"]+)"/) || [])[1]);
        if (!cdn) throw new Error("Bunkr: il file non è più disponibile.");
        var out = cdn;
        if (signer) {
            var path = decodeURIComponent(cdn.replace(/^https?:\/\/[^/]+/, "").split("?")[0]);
            var sres = await this.client.get(signer + "?path=" + encodeURIComponent(path), { "User-Agent": UA });
            var sig = null;
            try { sig = JSON.parse(sres.body); } catch (e) {}
            if (!sig || !sig.token) throw new Error("Bunkr: non è stato possibile avere il permesso per il video. Riprova.");
            out = cdn + (cdn.indexOf("?") === -1 ? "?" : "&") + "token=" + encodeURIComponent(sig.token) + "&ex=" + encodeURIComponent(sig.ex);
        }
        var ext = ((cdn.split("?")[0].match(/\.([A-Za-z0-9]+)$/) || [])[1] || "video").toUpperCase();
        return [{ url: out, originalUrl: out, quality: "Bunkr · " + ext, headers: { "User-Agent": UA } }];
    }

    // filester.me: API pubblica. POST /v2/api/public/view con lo slug → permesso a tempo,
    // poi il video è <server>/v2/<file>?token=…. Il permesso si prende fresco a ogni play.
    async filesterVideo(slug) {
        var res;
        try {
            res = await this.client.post("https://filester.me/v2/api/public/view",
                { "Content-Type": "application/json", "User-Agent": UA },
                { file_slug: slug });
        } catch (e) { throw new Error("filester non risponde in questo momento. Riprova."); }
        var data = null;
        try { data = JSON.parse(String((res && res.body) || "")); } catch (e) {}
        if (!data || !data.server || !data.file || !data.token) {
            throw new Error("filester: il file non è più disponibile.");
        }
        var url = data.server + "/v2/" + data.file + "?token=" + encodeURIComponent(data.token);
        var ext = ((String(data.file).match(/\.([A-Za-z0-9]+)$/) || [])[1] || "video").toUpperCase();
        return [{ url: url, originalUrl: url, quality: "filester · " + ext, headers: { "User-Agent": UA } }];
    }

    // pixeldrain: il file si scarica direttamente da /api/file/<id> (supporta i range,
    // nessun Referer). Niente permessi a tempo: l'URL è stabile.
    pixeldrainVideo(id) {
        var url = "https://pixeldrain.com/api/file/" + id;
        return [{ url: url, originalUrl: url, quality: "Pixeldrain", headers: { "User-Agent": UA } }];
    }

    // Il file Gofile risponde solo se la richiesta sembra arrivare dalla pagina che lo
    // incapsula (altrimenti «Access denied from this domain»): si fa come il suo lettore,
    // con quel Referer. Il parametro t= è la scadenza della PAGINA, non del file: il link
    // Gofile interno risponde lo stesso dopo che t= è passato, finché il file esiste.
    async embedVideo(code) {
        var page = this.linkUrl(code);
        var target = this.embedTarget(page);
        if (!target) {
            var inner = this.embedInner(page);
            var host = (inner.match(/^https?:\/\/([^/]+)/) || [])[1] || "un altro sito";
            throw new Error("Questo link porta a " + host + ", non a Gofile: è uno streaming protetto che l'estensione non apre.");
        }
        if (!this.embedComplete(target)) {
            throw new Error("Questo link si è tagliato quando l'hai incollato. Toglilo e reincollalo per intero, fino alla fine.");
        }
        var origin = page.match(/^https?:\/\/[^/]+/)[0];
        var headers = { "Referer": origin + "/", "User-Agent": UA };
        // Il link Gofile «direct» rimbalza (302) verso un server CDN che vuole anche lui
        // il Referer. Alcuni lettori lo perdono nel rimbalzo e restano a caricare: si
        // risolve qui l'indirizzo finale, così il lettore fa una sola richiesta col Referer.
        var finalUrl = target;
        try {
            var res = await this.client.head(target, headers);
            var u = res && res.request && res.request.url;
            if (u && /\.gofile\.io\/download\//i.test(u)) finalUrl = u;
        } catch (e) {}
        var ext = ((target.split("?")[0].match(/\.([A-Za-z0-9]+)$/) || [])[1] || "video").toUpperCase();
        return [{ url: finalUrl, originalUrl: finalUrl, quality: "Gofile · " + ext, headers: headers }];
    }

    async getVideoList(url) {
        var file = String(url);
        if (file.indexOf("bunkr:") === 0) return this.bunkrVideo(file.slice(6));
        if (file.indexOf("embed:") === 0) return this.embedVideo(file.slice(6));
        if (file.indexOf("filester:") === 0) return this.filesterVideo(file.slice(9));
        if (file.indexOf("pixeldrain:") === 0) return this.pixeldrainVideo(file.slice(11));
        var token = this.readStore(STORE_TOKEN);
        if (!token) throw new Error("Gofile: riapri la scheda della cartella (serve il permesso della visita).");
        var name = decodeURIComponent(file.split("/").pop() || "");
        return [{
            url: file,
            originalUrl: file,
            quality: "Gofile · " + ((name.match(/\.([A-Za-z0-9]+)$/) || [])[1] || "video").toUpperCase(),
            headers: { "Cookie": "accountToken=" + token, "Referer": "https://gofile.io/" },
        }];
    }

    getFilterList() {
        return [
            { type_name: "HeaderFilter", name: "Incolla nella ricerca un link Gofile (https://gofile.io/d/…) per aprirlo. Per tenerlo in elenco, salvalo in «➕ Salva un link» nelle impostazioni dell'estensione." },
        ];
    }

    getSourcePreferences() {
        var self = this;
        // Applica subito quello che hai scritto l'ultima volta. Un get() qui dentro, per
        // una voce non ancora salvata, fa richiamare questo metodo a Mangayomi: la
        // seconda chiamata salta l'aggiornamento e il giro si ferma.
        if (!this._syncing) {
            this._linksMemo = null;
            try { this.savedLinks(); } catch (e) {}
            // Rilegge il documento in sottofondo (una volta ogni pochi secondi): così,
            // riaprendo le impostazioni, lo stato e la lista riflettono il documento,
            // anche senza passare prima da Popolari/Recenti.
            if (Date.now() - (this._remoteKick || 0) > 4000) {
                this._remoteKick = Date.now();
                try { Promise.resolve(this.refreshRemote(true)).catch(function () {}); } catch (e) {}
            }
        }
        var links = this.readJson(STORE_LINKS, []);
        var newest = links.slice().reverse();
        var label = function (l) { return l.name || self.shortLink(l.code); };
        var prefs = [{
            key: this.addKey(),
            editTextPreference: {
                title: "➕ Salva un link",
                summary: "Scrivi un link Gofile, Bunkr (album /a/… o video /f/…), filester o pixeldrain (/u/… o lista /l/…), e se vuoi il nome dopo una barra: link | nome. Ogni link diventa una scheda in Popolari.",
                value: "",
                dialogTitle: "Salva un link",
                dialogMessage: "Link Gofile, Bunkr, filester o pixeldrain, poi una barra verticale e il nome della scheda (facoltativo). Es. https://gofile.io/d/XXXX | I miei video",
            },
        }];
        if (links.length) {
            var batch = this.lastBatch(links);
            var one = batch.length === 1 ? batch[0] : null;
            var batchName = batch[0] && batch[0].name ? batch[0].name : "";
            var forWhat = one
                ? (one.name ? one.name + " — " : "") + this.shortLink(one.code) + (one.name ? "" : " (senza nome)")
                : batch.length + " link appena aggiunti" + (batchName ? " — " + batchName : " (senza nome)");
            prefs.push({
                key: this.renameKey(links),
                editTextPreference: {
                    title: one ? "✏️ Nome dell'ultimo link" : "✏️ Nome dei link aggiunti insieme",
                    summary: "Per: " + forWhat,
                    value: "",
                    dialogTitle: one ? "Nome dell'ultimo link" : "Nome dei " + batch.length + " link aggiunti insieme",
                    dialogMessage: (one
                        ? "Nome della scheda per " + this.shortLink(one.code) + "."
                        : "Nome della scheda per i " + batch.length + " link appena salvati insieme (così finiscono in un'unica raccolta).") + " Scrivi - per togliere il nome.",
                },
            });
        }
        if (links.length) {
            prefs.push({
                key: this.removeKey(links),
                multiSelectListPreference: {
                    title: "Togli i link",
                    summary: "Spunta i link da togliere. Spariscono quando riapri questa pagina o la sorgente.",
                    entries: newest.map(label),
                    entryValues: newest.map(function (l) { return l.code; }),
                    values: [],
                },
            });
        }
        var remoteList = this.cachedRemote();
        var remoteNames = remoteList.map(function (l) { return "• " + (l.name || self.shortLink(l.code)); });
        var canWrite = !!this.remoteApiTarget();
        var hasToken = !!this.remoteToken();
        var inDoc = !this.remoteUrl() ? "Lista condivisa disattivata."
            : remoteList.length ? ("Nel documento ci sono " + remoteList.length + " link:\n" + remoteNames.join("\n"))
            : "Il documento è ancora vuoto (nessun link).";
        // Riga di stato con chiave che cambia con lo stato: così il riepilogo si aggiorna
        // davvero (quelli a chiave fissa in Mangayomi restano col primo testo, bug #1196).
        var statusKey = "gofile_status_" + this._hash((hasToken ? "T" : "F") + "|" + remoteList.length + "|" + remoteNames.join(",") + "|" + this.pushStatus());
        prefs.push({
            key: statusKey,
            editTextPreference: {
                title: "ℹ️ Stato lista condivisa",
                summary: (this.pushStatus() ? this.pushStatus() + "\n\n" : "") +
                    (hasToken ? "Token: impostato ✓.\n" : "Token: non impostato.\n") + inDoc,
                value: "", dialogTitle: "Stato", dialogMessage: "Solo informativo: mostra se il token è a posto e i link presenti nel documento.",
            },
        });
        prefs.push({
            key: "gofile_remote_url",
            editTextPreference: {
                title: "📄 Lista condivisa (indirizzo)",
                summary: "Tocca per cambiare l'indirizzo del file (vuoto = file predefinito nel repo; «-» per disattivare). Cosa contiene lo vedi in «ℹ️ Stato».",
                // Il valore attuale, non "": ridisegnare con "" farebbe azzerare a Mangayomi
                // il valore salvato (stesso difetto delle preferenze di #1196).
                value: String(this.readStore(MIRROR_URL) || ""),
                dialogTitle: "Indirizzo della lista condivisa",
                dialogMessage: "Indirizzo «raw» di un file di testo (es. su GitHub o un Gist) con un link per riga. Lascia vuoto per il file predefinito, scrivi - per disattivare.",
            },
        });
        prefs.push({
            key: "gofile_remote_token",
            editTextPreference: {
                title: "🔑 Token GitHub (per aggiungere link da qui)",
                summary: "Tocca per inserire o cambiare il token. Se è a posto lo vedi in «ℹ️ Stato». Serve un token «fine-grained» con Contents: Read and write sul repo della lista. I link in un repo pubblico sono pubblici.",
                // Il valore attuale, non "": altrimenti Mangayomi azzera il token salvato
                // a ogni ridisegno della pagina (per questo risultava sempre «non impostato»).
                value: this.remoteToken(),
                dialogTitle: "Token GitHub",
                dialogMessage: "Incolla il token (resta solo su questo dispositivo). Scrivi - per toglierlo.",
            },
        });
        if (canWrite) {
            var remoteCodes = {};
            this.cachedRemote().forEach(function (l) { remoteCodes[l.code] = 1; });
            var addable = newest.filter(function (l) { return !remoteCodes[l.code]; });
            var tokenNote = hasToken ? "" : "⚠️ Prima metti il token qui sopra. ";
            if (addable.length) {
                prefs.push({
                    key: this.pushKey(links),
                    multiSelectListPreference: {
                        title: "➕ Aggiungi alla lista condivisa",
                        summary: (this.pushStatus() ? this.pushStatus() + " " : "") + tokenNote + "Spunta i link del telefono da mettere nella lista condivisa. Vengono scritti quando riapri Popolari.",
                        entries: addable.map(label),
                        entryValues: addable.map(function (l) { return l.code; }),
                        values: [],
                    },
                });
            } else {
                prefs.push({
                    key: "gofile_push_info",
                    editTextPreference: {
                        title: "➕ Aggiungi alla lista condivisa",
                        summary: (this.pushStatus() ? this.pushStatus() + " " : "") + (links.length ? "Tutti i link salvati sono già nella lista condivisa." : "Prima salva qualche link con «➕ Salva un link»."),
                        value: "", dialogTitle: "Lista condivisa", dialogMessage: "Nessun link da aggiungere.",
                    },
                });
            }
        }
        return prefs;
    }
}
