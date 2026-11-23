const mangayomiSources = [
    {
        "name": "Gofile",
        "lang": "it",
        "baseUrl": "https://gofile.io",
        "apiUrl": "",
        "iconUrl": "https://www.google.com/s2/favicons?sz=64&domain=gofile.io",
        "typeSource": "single",
        "isNsfw": true,
        "itemType": 1,
        "version": "1.27.4",
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
const STORE_UNDO = "gofile_undo_last";
const STORE_UNDO_N = "gofile_undo_n";
const STORE_TOK_N = "gofile_tok_n";
const STORE_CONFIRM_N = "gofile_cfm_n";
const STORE_PREF_MIG = "gofile_pref_mig_126";
const STORE_URL_LOCK = "gofile_url_lock_1261";
const STORE_REMOTE_DEL = "gofile_remote_del";
const STORE_REMOTE_RESTORE = "gofile_remote_restore";
const STORE_PUSH_AT = "gofile_push_at";
// Copia interna del token. Leggerla con setting() mentre si costruiscono le preferenze
// fa richiamare getSourcePreferences in loop (app in crash): si legge solo dentro syncLinks.
const MIRROR_URL = "gofile_m_remote_url";
const MIRROR_TOKEN = "gofile_m_remote_token";
const REMOTE_TTL = 60000;
// Lista link condivisa: un file di testo (un link per riga) nel repository. Non è
// un'impostazione: è sempre questo indirizzo.
const DEFAULT_REMOTE_URL = "https://raw.githubusercontent.com/adam72881/mangayomi-anime-extensions/main/links/gofile.txt";
// Domini di Bunkr: alcuni operatori italiani ne bloccano qualcuno, si prova il successivo.
const BUNKR_HOSTS = ["bunkr.cr", "bunkr.si", "bunkr.fi", "bunkr.ph", "bunkr.ws", "bunkr.site", "bunkr.pk"];
// Indice pubblico di Bunkr con API JSON in chiaro (niente anti-bot): cerca album e file.
const BUNKR_SEARCH_HOST = "bunkrsearch.link";
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
        return this.bunkrCode(text) || this.eromeCode(text) || this.filesterCode(text) || this.pixeldrainCode(text) || this.embedCode(text) || this.codeOf(text);
    }

    eromeCode(text) {
        var m = String(text || "").match(/erome\.com\/a\/([A-Za-z0-9]+)/i);
        return m ? "er~" + m[1] : "";
    }

    isErome(code) {
        return /^er~[A-Za-z0-9]+$/i.test(String(code || ""));
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
        if (this.isErome(code)) return "https://www.erome.com/a/" + String(code).slice(3);
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
        var h = 0, str = links.map(function (l) { return l.code + "=" + (l.name || "") + (l.remote ? "~r" : ""); }).join("|");
        for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
        return "gofile_remove_" + (parseInt(this.readStore(STORE_REM_N), 10) || 0) + "_" + (h >>> 0).toString(36);
    }

    // «link | nome», «link nome» o solo il link; più link separati da spazio, senza nome.
    parseLinks(text) {
        var out = [];
        var line = String(text || "").trim();
        if (!line) return out;
        var links = line.match(/(?:https?:\/\/)?(?:www\.)?(?:gofile\.io\/d\/[A-Za-z0-9]+|bunkr+\.[a-z]{2,}\/[afvi]\/[A-Za-z0-9]+|filester\.[a-z]{2,}\/d\/[A-Za-z0-9]+|pixeldrain\.com\/[ul]\/[A-Za-z0-9]+|erome\.com\/a\/[A-Za-z0-9]+|[A-Za-z0-9.-]+\.[a-z]{2,}\/[^\s|?]*\?[^\s|]*\bem=[A-Za-z0-9+\/=_%-]+[^\s|]*)/gi) || [];
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
        // «Togli i link» segna soltanto. Si cancella solo se, nella stessa lettura,
        // «Conferma rimozione» contiene OK: un OK a vuoto non toglie nulla.
        // I link 🌐 sono solo nella lista condivisa: si tolgono dal file solo col token.
        var pool = this.linkPool(links);
        var marked = pool.length ? this.setting(this.removeKey(pool)) : null;
        if (!marked || !marked.length) marked = [];
        this._marked = marked;
        var confirmText = marked.length ? String(this.setting(this.confirmKey(marked)) || "").trim() : "";
        if (marked.length && /^ok$/i.test(confirmText)) {
            var localCodes = {};
            for (var li = 0; li < links.length; li++) localCodes[links[li].code] = 1;
            var localMarked = marked.filter(function (c) { return localCodes[c]; });
            var remoteOnly = marked.filter(function (c) { return !localCodes[c]; });
            var removed = links.filter(function (l) { return localMarked.indexOf(l.code) !== -1; });
            links = links.filter(function (l) { return localMarked.indexOf(l.code) === -1; });
            var remoteRemoved = [];
            if (remoteOnly.length && this.remoteToken()) {
                var byCode = {};
                this.cachedRemote().forEach(function (l) { byCode[l.code] = l; });
                remoteRemoved = remoteOnly.map(function (c) {
                    var l = byCode[c] || { code: c, name: "" };
                    return { code: c, name: l.name || "", line: this.linkUrl(c) + (l.name ? " | " + l.name : "") };
                }, this);
                this.writeStore(STORE_REMOTE_DEL, JSON.stringify(remoteOnly));
            } else if (remoteOnly.length) {
                this.setPushStatus("I link 🌐 restano nella lista condivisa: serve il token GitHub per toglierli.");
            }
            this.rememberUndo(removed, remoteRemoved);
            this.dropLocalCache(removed.map(function (l) { return l.code; }));
            changed = true;
            this.writeStore(STORE_REM_N, String((parseInt(this.readStore(STORE_REM_N), 10) || 0) + 1));
            this.writeStore(STORE_CONFIRM_N, String((parseInt(this.readStore(STORE_CONFIRM_N), 10) || 0) + 1));
            this._marked = [];
        }
        var undo = this.readJson(STORE_UNDO, null);
        var undoHas = undo && ((undo.links && undo.links.length) || (undo.remote && undo.remote.length));
        if (undoHas && /^ok$/i.test(String(this.setting(this.undoKey(undo)) || "").trim())) {
            (undo.links || []).forEach(push);
            this.restoreLocalCache(undo);
            if (undo.remote && undo.remote.length) {
                var pendingDel = this.readJson(STORE_REMOTE_DEL, []) || [];
                var back = {};
                undo.remote.forEach(function (r) { back[r.code] = 1; });
                var left = pendingDel.filter(function (c) { return !back[c]; });
                this.writeStore(STORE_REMOTE_DEL, left.length ? JSON.stringify(left) : "");
                if (!pendingDel.length) this.writeStore(STORE_REMOTE_RESTORE, JSON.stringify(undo.remote));
            }
            this.writeStore(STORE_UNDO, "");
            this.writeStore(STORE_UNDO_N, String((parseInt(this.readStore(STORE_UNDO_N), 10) || 0) + 1));
            changed = true;
        }
        // La casella del nome mostrata era quella dell'elenco di prima di questa lettura.
        var renKey = this.renameKey(links);
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
                var already = {};
                this.cachedRemote().forEach(function (l) { already[l.code] = 1; });
                pushSel = pushSel.filter(function (c) { return !already[c]; });
                if (pushSel.length) {
                    this.writeStore(STORE_PUSH_PENDING, JSON.stringify(pushSel));
                    this.writeStore(STORE_PUSH_N, String((parseInt(this.readStore(STORE_PUSH_N), 10) || 0) + 1));
                }
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

    // La lista condivisa è sempre il file del repository. Non è un'impostazione.
    remoteUrl() {
        return DEFAULT_REMOTE_URL;
    }

    // Link del telefono più quelli solo nel file (🌐). I doppioni restano una voce sola.
    linkPool(localLinks) {
        var seen = {}, items = [];
        (localLinks || []).forEach(function (l) {
            if (!l || !l.code || seen[l.code]) return;
            seen[l.code] = 1;
            items.push({ code: l.code, name: l.name || "", remote: false });
        });
        this.cachedRemote().forEach(function (l) {
            if (!l || !l.code || seen[l.code]) return;
            seen[l.code] = 1;
            items.push({ code: l.code, name: l.name || "", remote: true });
        });
        return items;
    }

    remoteToken() {
        var t = String(this.readStore(MIRROR_TOKEN) || "").trim();
        return t === "-" ? "" : t;
    }

    confirmKey(codes) {
        return "gofile_cfm_" + (parseInt(this.readStore(STORE_CONFIRM_N), 10) || 0) + "_" + this._hash((codes || []).join(","));
    }

    undoKey(undo) {
        var sig = (undo && undo.links || []).map(function (l) { return l.code; }).join(",");
        sig += "#" + (undo && undo.remote || []).map(function (r) { return r.code; }).join(",");
        return "gofile_undo_" + (parseInt(this.readStore(STORE_UNDO_N), 10) || 0) + "_" + this._hash(sig);
    }

    tokenKey() {
        var tail = this.remoteToken();
        return "gofile_tok_" + (parseInt(this.readStore(STORE_TOK_N), 10) || 0) + "_" + this._hash(tail ? tail.slice(-4) : "-");
    }

    // Ultimo elenco tolto: link del telefono, righe 🌐 del file, e le schede in cache
    // dei codici che non sono nella lista condivisa.
    rememberUndo(removed, remoteRows) {
        var remote = {}, list = this.cachedRemote();
        for (var i = 0; i < list.length; i++) remote[list[i].code] = 1;
        var fm = this.filesMap(), info = this.infoMap(), files = {}, infos = {};
        removed.forEach(function (l) {
            if (remote[l.code]) return;
            if (fm[l.code]) files[l.code] = fm[l.code];
            if (info[l.code]) infos[l.code] = info[l.code];
        });
        this.writeStore(STORE_UNDO, JSON.stringify({ links: removed, remote: remoteRows || [], files: files, info: infos }));
    }

    dropLocalCache(codes) {
        var remote = {}, list = this.cachedRemote();
        for (var i = 0; i < list.length; i++) remote[list[i].code] = 1;
        var fm = this.filesMap(), info = this.infoMap(), dirty = false;
        codes.forEach(function (c) {
            if (remote[c]) return;
            if (fm[c]) { delete fm[c]; dirty = true; }
            if (info[c]) { delete info[c]; dirty = true; }
        });
        if (!dirty) return;
        this.writeStore(STORE_FILES, JSON.stringify(fm));
        this.writeStore(STORE_INFO, JSON.stringify(info));
    }

    restoreLocalCache(undo) {
        var fm = this.filesMap(), info = this.infoMap();
        var files = (undo && undo.files) || {}, infos = (undo && undo.info) || {};
        Object.keys(files).forEach(function (c) { fm[c] = files[c]; });
        Object.keys(infos).forEach(function (c) { info[c] = infos[c]; });
        this.writeStore(STORE_FILES, JSON.stringify(fm));
        this.writeStore(STORE_INFO, JSON.stringify(info));
    }

    // Copia URL/token nelle copie interne. Va chiamata solo da dentro syncLinks
    // (un re-invoke di getSourcePreferences è sicuro). Il token non sta più nel valore
    // della voce: una casella vuota non lo cancella. «-» sì.
    syncSettings() {
        this.migrateFixedPrefs();
        this.migrateUrlLock();
        try {
            var typed = this.setting(this.tokenKey());
            if (typed != null && String(typed).trim()) {
                var raw = String(typed).trim();
                this.writeStore(MIRROR_TOKEN, raw === "-" ? "" : raw);
                this.writeStore(STORE_TOK_N, String((parseInt(this.readStore(STORE_TOK_N), 10) || 0) + 1));
            }
        } catch (e) {}
    }

    // Chiavi nuove, così il fork non tiene i titoli vecchi della copia salvata.
    // Il token già presente (voce precedente o copia interna) non si perde.
    migrateFixedPrefs() {
        if (this.readStore(STORE_PREF_MIG) === "1") return;
        var mirror = String(this.readStore(MIRROR_TOKEN) || "").trim();
        var oldTok = "";
        try { oldTok = String(this.setting("gofile_remote_token") || "").trim(); } catch (e) {}
        var real = function (t) { return t && t !== "-" ? t : ""; };
        var keep = real(mirror) || real(oldTok);
        if (mirror === "-" || !mirror || keep !== mirror) this.writeStore(MIRROR_TOKEN, keep);
        this.writeStore(STORE_PREF_MIG, "1");
    }

    // Una volta: se l'indirizzo interno non è quello del repository, si butta e la
    // copia della lista si riscarica. L'indirizzo non è più un'impostazione.
    migrateUrlLock() {
        if (this.readStore(STORE_URL_LOCK) === "1") return;
        var u = String(this.readStore(MIRROR_URL) || "").trim();
        if (u && u !== DEFAULT_REMOTE_URL) {
            this.writeStore(MIRROR_URL, "");
            this.writeStore(STORE_REMOTE, "");
        }
        this.writeStore(STORE_URL_LOCK, "1");
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
        this.saveRemoteText(String(res.body || ""));
    }

    linksFromText(text) {
        var links = [], self = this, seen = {};
        String(text || "").split(/\r?\n/).forEach(function (line) {
            var t = line.trim();
            if (!t || t.charAt(0) === "#") return;
            self.parseLinks(t).forEach(function (l) { if (l.code && !seen[l.code]) { seen[l.code] = 1; links.push(l); } });
        });
        return links;
    }

    saveRemoteText(text) {
        this.writeStore(STORE_REMOTE, JSON.stringify({ url: this.remoteUrl(), at: Date.now(), links: this.linksFromText(text) }));
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
        var remote = {}, list = this.cachedRemote();
        for (var r = 0; r < list.length; r++) remote[list[r].code] = 1;
        // La firma include chi è già nel file: su iPhone una chiave ferma teneva
        // l'elenco della prima volta (una sola voce) anche dopo che i link erano tre.
        var str = localLinks.map(function (l) { return l.code + (remote[l.code] ? "*" : ""); }).join("|") + "#" + list.length;
        var h = 0;
        for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
        return "gofile_push_" + (parseInt(this.readStore(STORE_PUSH_N), 10) || 0) + "_" + (h >>> 0).toString(36);
    }

    // true se l'invio è riuscito (o non c'era nulla da aggiungere). Su 409 si rilegge
    // lo sha e si riprova una volta. Il chiamante cancella STORE_PUSH_PENDING solo allora.
    async pushToRemote(codes) {
        var first = await this.pushAttempt(codes);
        if (first !== "conflict") return first === true;
        var second = await this.pushAttempt(codes);
        if (second === "conflict") {
            this.setPushStatus("GitHub ha risposto 409 alla scrittura: conflitto, il file è cambiato. Si riprova alla prossima apertura.");
            return false;
        }
        return second === true;
    }

    async flushPush() {
        if (this._flushing) return false;
        var pending = this.readJson(STORE_PUSH_PENDING, null);
        if (!pending || !pending.length) return false;
        this._flushing = true;
        try {
            var ok = await this.pushToRemote(pending);
            if (ok) this.writeStore(STORE_PUSH_PENDING, "");
            return !!ok;
        } catch (e) { return false; }
        finally { this._flushing = false; }
    }

    pushWhen() {
        var d = new Date();
        var p = function (n) { return (n < 10 ? "0" : "") + n; };
        return p(d.getDate()) + "/" + p(d.getMonth() + 1) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
    }

    shortPush() {
        var s = String(this.pushStatus() || "");
        if (!s) return "";
        var added = s.match(/Aggiunti (\d+)/);
        if (added) {
            var when = this.readStore(STORE_PUSH_AT);
            return "ultimo invio: +" + added[1] + (when ? " il " + when : "");
        }
        if (/già nella lista/.test(s)) return "ultimo invio: già presenti";
        var removedN = s.match(/Tolti (\d+)/);
        if (removedN) return "ultimo invio: -" + removedN[1];
        if (/Manca il token|serve il token/.test(s)) return "ultimo invio: manca token";
        if (/non è un file GitHub/.test(s)) return "ultimo invio: non scrivibile";
        var sc = s.match(/risposto (\d+)/);
        if (sc) return "ultimo invio: errore " + sc[1];
        if (/rete/.test(s)) return "ultimo invio: errore di rete";
        return "ultimo invio: errore";
    }

    countsTitle() {
        var n = this.cachedRemote().length;
        var m = this.readJson(STORE_LINKS, []).length;
        return n + " nella lista condivisa · " + m + " su questo telefono";
    }

    statusTitle() {
        var tok = this.remoteToken() ? "token ✓" : "token non impostato";
        var sp = this.shortPush();
        var s = "ℹ️ " + this.cachedRemote().length + " link nella lista condivisa · " + this.readJson(STORE_LINKS, []).length + " su questo telefono · " + tok;
        return sp ? s + " · " + sp : s;
    }

    addTitle() {
        var sp = this.shortPush();
        return "➕ " + this.countsTitle() + (sp ? " · " + sp : "");
    }

    // Dei codici scelti, quelli il cui link compare nel testo del documento.
    codesInText(codes, text) {
        var self = this, t = String(text || "");
        return (codes || []).filter(function (c) { return t.indexOf(self.linkUrl(c)) !== -1; });
    }

    // Toglie dai link salvati sul telefono i codici indicati (sono ora nel documento):
    // così un link caricato nella lista condivisa sparisce da Popolari e resta in Recenti.
    removeFromPhone(codes) {
        if (!codes || !codes.length) return;
        var drop = {};
        codes.forEach(function (c) { drop[c] = 1; });
        var links = this.readJson(STORE_LINKS, []);
        var kept = links.filter(function (l) { return !drop[l.code]; });
        if (kept.length !== links.length) {
            this.writeStore(STORE_LINKS, JSON.stringify(kept));
            this._linksMemo = null;
        }
    }

    // Aggiunge i link scelti al file GitHub della lista condivisa. Legge il contenuto
    // attuale (per il suo sha), accoda le righe mancanti e rimanda indietro il file.
    async pushAttempt(codes) {
        var tok = this.remoteToken();
        var tgt = this.remoteApiTarget();
        if (!tok) { this.setPushStatus("Manca il token GitHub: mettilo in «Token GitHub»."); return false; }
        if (!tgt) { this.setPushStatus("La lista condivisa non è un file GitHub su cui scrivere."); return false; }
        var api = "https://api.github.com/repos/" + tgt.owner + "/" + tgt.repo + "/contents/" + tgt.path;
        var hdr = { "Authorization": "token " + tok, "Accept": "application/vnd.github+json", "Content-Type": "application/json", "User-Agent": UA };
        var cur = "", sha = "";
        try {
            var g = await this.client.get(api + "?ref=" + encodeURIComponent(tgt.branch), hdr);
            if (g && g.statusCode === 200) { var j = JSON.parse(String(g.body || "{}")); sha = j.sha || ""; cur = this.utf8FromBytes(this.b64ToBytes(j.content || "")); }
            else if (!g || g.statusCode !== 404) { this.setPushStatus("GitHub ha risposto " + (g && g.statusCode) + " alla lettura. Controlla il token."); return false; }
        } catch (e) { this.setPushStatus("Non riesco a leggere il file (rete?)."); return false; }
        var links = this.savedLinks(), byCode = {};
        for (var i = 0; i < links.length; i++) byCode[links[i].code] = links[i];
        var add = [];
        for (var k = 0; k < codes.length; k++) {
            var l = byCode[codes[k]]; if (!l) continue;
            var url = this.linkUrl(l.code);
            if (cur.indexOf(url) !== -1) continue; // già presente nel file
            add.push(url + (l.name ? " | " + l.name : ""));
        }
        if (!add.length) {
            // Già nel documento: tolgo comunque dal telefono i codici scelti che ci sono.
            this.removeFromPhone(this.codesInText(codes, cur));
            this.setPushStatus("Erano già nella lista: tolti dal telefono.");
            return true;
        }
        var next = cur.replace(/\s*$/, "") + "\n" + add.join("\n") + "\n";
        var body = { message: "Aggiungi " + add.length + " link da Mangayomi", content: this.bytesToB64(this.utf8Bytes(next)), branch: tgt.branch };
        if (sha) body.sha = sha;
        try {
            var p = await this.client.put(api, hdr, body);
            if (p && (p.statusCode === 200 || p.statusCode === 201)) {
                // Tutta la lista, non solo il link appena aggiunto: altrimenti la copia
                // sul telefono restava di una voce anche se il file ne aveva tre.
                this.saveRemoteText(next);
                // Il link è ora nel documento: lo tolgo dal telefono (si sposta in Recenti).
                this.removeFromPhone(this.codesInText(codes, next));
                this.writeStore(STORE_PUSH_AT, this.pushWhen());
                this.setPushStatus("Aggiunti " + add.length + " link alla lista (tolti dal telefono). ✓");
                return true;
            }
            var sc = p && p.statusCode;
            if (sc === 409) return "conflict";
            var why = (sc === 401 || sc === 403) ? "il token è sbagliato o senza permesso Contents: Read and write su quel repo."
                : sc === 404 ? "repo o file non trovato (controlla l'URL della lista)."
                : sc === 422 ? "richiesta rifiutata (file troppo grande o dati non validi)."
                : "richiesta non valida; riprova.";
            this.setPushStatus("GitHub ha risposto " + sc + " alla scrittura: " + why);
            return false;
        } catch (e) { this.setPushStatus("Non riesco a scrivere il file (rete?)."); return false; }
    }

    // Toglie o rimette righe nel file GitHub. Su 409 rilegge lo sha e riprova una volta.
    // Non scrive nulla se manca il token. Il token non finisce nei messaggi.
    async editRemote(mutator, message) {
        var self = this;
        var once = async function () {
            var tok = self.remoteToken();
            var tgt = self.remoteApiTarget();
            if (!tok) { self.setPushStatus("Manca il token GitHub per aggiornare la lista condivisa."); return false; }
            if (!tgt) { self.setPushStatus("La lista condivisa non è un file GitHub su cui scrivere."); return false; }
            var api = "https://api.github.com/repos/" + tgt.owner + "/" + tgt.repo + "/contents/" + tgt.path;
            var hdr = { "Authorization": "token " + tok, "Accept": "application/vnd.github+json", "Content-Type": "application/json", "User-Agent": UA };
            var cur = "", sha = "";
            try {
                var g = await self.client.get(api + "?ref=" + encodeURIComponent(tgt.branch), hdr);
                if (g && g.statusCode === 200) { var j = JSON.parse(String(g.body || "{}")); sha = j.sha || ""; cur = self.utf8FromBytes(self.b64ToBytes(j.content || "")); }
                else if (!g || g.statusCode !== 404) { self.setPushStatus("GitHub ha risposto " + (g && g.statusCode) + " alla lettura della lista."); return false; }
            } catch (e) { self.setPushStatus("Non riesco a leggere il file (rete?)."); return false; }
            var next = mutator(cur);
            if (next == null || next === cur) { self.saveRemoteText(cur); return true; }
            var body = { message: message, content: self.bytesToB64(self.utf8Bytes(next)), branch: tgt.branch };
            if (sha) body.sha = sha;
            try {
                var p = await self.client.put(api, hdr, body);
                if (p && (p.statusCode === 200 || p.statusCode === 201)) { self.saveRemoteText(next); return true; }
                if (p && p.statusCode === 409) return "conflict";
                self.setPushStatus("GitHub ha risposto " + (p && p.statusCode) + " alla scrittura della lista.");
                return false;
            } catch (e2) { self.setPushStatus("Non riesco a scrivere il file (rete?)."); return false; }
        };
        var first = await once();
        if (first !== "conflict") return first === true;
        var second = await once();
        if (second === "conflict") {
            this.setPushStatus("GitHub ha risposto 409 alla scrittura: conflitto, il file è cambiato. Si riprova alla prossima apertura.");
            return false;
        }
        return second === true;
    }

    dropRemoteLines(text, codes) {
        var set = {}, self = this;
        (codes || []).forEach(function (c) { set[c] = 1; });
        var lines = String(text || "").split(/\r?\n/).filter(function (line) {
            var t = line.trim();
            if (!t || t.charAt(0) === "#") return true;
            var hit = false;
            self.parseLinks(t).forEach(function (l) { if (set[l.code]) hit = true; });
            return !hit;
        });
        return lines.join("\n").replace(/\s*$/, "") + "\n";
    }

    addRemoteLines(text, rows) {
        var cur = String(text || "");
        (rows || []).forEach(function (row) {
            var line = row && row.line ? String(row.line).trim() : "";
            if (!line || cur.indexOf(line) !== -1) return;
            cur = cur.replace(/\s*$/, "") + "\n" + line;
        });
        return cur.replace(/\s*$/, "") + "\n";
    }

    async flushRemoteEdits() {
        if (this._remoteEditing) return false;
        var del = this.readJson(STORE_REMOTE_DEL, null);
        var restore = this.readJson(STORE_REMOTE_RESTORE, null);
        if ((!del || !del.length) && (!restore || !restore.length)) return false;
        if (!this.remoteToken()) return false;
        this._remoteEditing = true;
        var self = this;
        try {
            if (del && del.length) {
                var ok = await this.editRemote(function (text) { return self.dropRemoteLines(text, del); }, "Togli " + del.length + " link da Mangayomi");
                if (!ok) return false;
                this.writeStore(STORE_REMOTE_DEL, "");
                this.setPushStatus("Tolti " + del.length + " link dalla lista condivisa.");
            }
            if (restore && restore.length) {
                var ok2 = await this.editRemote(function (text) { return self.addRemoteLines(text, restore); }, "Ripristina " + restore.length + " link da Mangayomi");
                if (!ok2) return false;
                this.writeStore(STORE_REMOTE_RESTORE, "");
            }
            return true;
        } catch (e) { return false; }
        finally { this._remoteEditing = false; }
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
        if (this.isErome(code)) return "/er/" + code;
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
    readOne(code) {
        this._inflight = this._inflight || {};
        if (this._inflight[code]) return this._inflight[code];
        var self = this;
        var p = this.readOneRaw(code);
        this._inflight[code] = p;
        var clear = function () { delete self._inflight[code]; };
        p.then(clear, clear);
        return p;
    }

    async readOneRaw(code) {
        if (this.isErome(code)) return this.readErome(code);
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
            var res = null, ourTimeout = false;
            // Niente timer qui: questa pagina la usa anche il video (getVideoList). Su iPhone
            // la risposta arriva dopo i 12 s della 1.25.1, e se setTimeout non c'è o scatta
            // subito il timer rifiutava ogni dominio prima ancora della richiesta.
            try { res = await this.client.get("https://" + order[i] + path, { "User-Agent": UA }); } catch (e) { ourTimeout = !!(e && e.message === "timeout"); }
            if (ourTimeout) { tried.push(order[i] + " tempo nostro scaduto"); continue; }
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
            files.push({ n: name, img: this.absHttp((p.match(/class="grid-images_box-img"[^>]*?src="([^"]+)"/) || p.match(/src="([^"]+)"[^>]*class="grid-images_box-img"/) || [])[1] || ""), bf: slug, bh: host });
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
            // 1) Modalità avanzata via HTTP: una sola richiesta con tutti i file.
            files = await this.bunkrAdvancedHttp(page.host, b.id);
            // 2) WebView solo se c'è davvero (sul Tizen esiste ma lancia subito un errore).
            if (!files.length && !this._noWebview) {
                var wv = await this.readBunkrAlbumWebview(b, page.host);
                if (wv === null) this._noWebview = true;
                if (wv && wv.files.length) { if (wv.title) title = wv.title; files = wv.files; }
            }
            if (!files.length) {
                var seen = {}, expMax = 1, pmx = html.match(/[?&]page=(\d+)/g) || [];
                for (var xi = 0; xi < pmx.length; xi++) { var xn = parseInt(pmx[xi].replace(/\D/g, ""), 10) || 1; if (xn > expMax) expMax = xn; }
                this.collectBunkrFiles(html, page.host, files, seen);
                var maxPg = Math.min(expMax > 1 ? expMax : 20, 20);
                for (var pg = 2; pg <= maxPg; pg++) {
                    var before = files.length;
                    var body = await this.bunkrAlbumPage(page.host, b.id, pg);
                    if (body == null) { if (pg <= expMax) partial = true; break; }
                    this.collectBunkrFiles(body, page.host, files, seen);
                    if (files.length === before) { if (pg <= expMax && !/theItem/.test(body)) partial = true; break; }
                }
            }
        } else {
            var og = this.absHttp((html.match(/property="og:image" content="([^"]+)"/) || [])[1] || "");
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
    async bunkrAdvancedHttp(host, id) {
        var res = null, out = [], seen = {};
        try { res = await this.withTimeout(this.client.get("https://" + host + "/a/" + id + "?advanced=1", { "User-Agent": UA }), 30000); } catch (e) { return out; }
        if (!res || res.statusCode !== 200) return out;
        var re = /original:\s*"((?:[^"\\]|\\.)*)"\s*,\s*slug:\s*"([^"]+)"\s*,\s*type:\s*"([^"]+)"[\s\S]*?thumbnail:\s*"([^"]+)"/g, m, html = String(res.body || "");
        while ((m = re.exec(html))) {
            if (m[3].indexOf("video/") !== 0 || seen[m[2]]) continue;
            seen[m[2]] = 1;
            out.push({ n: this.decodeHtml(m[1].replace(/\\(.)/g, "$1")), img: m[4].replace(/\\\//g, "/"), bf: m[2], bh: host });
        }
        return out;
    }

    async bunkrAlbumPage(host, id, pg) {
        // Solo il dominio che ha già risposto: provare gli altri 6 a ogni pagina (anche
        // bloccati dall'operatore, fino a 45 s ciascuno) è la parte più lenta.
        var order = [host];
        for (var i = 0; i < order.length; i++) {
            var res = null;
            try { res = await this.withTimeout(this.client.get("https://" + order[i] + "/a/" + id + "?page=" + pg, { "User-Agent": UA }), 30000); } catch (e) {}
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
        var img = this.absHttp((html.match(/property="og:image" content="([^"]+)"/) || [])[1] || "");
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

    // Popolari: link del telefono più lista condivisa, subito dalla copia salvata.
    // Le copertine mancanti e l'aggiornamento del file partono dopo, in sottofondo.
    async getPopular(page) {
        if (page > 1) return { list: [], hasNextPage: false };
        this.fixOnce();
        // savedLinks() sincronizza (copie interne del token/URL + raccoglie la scelta
        // «Aggiungi alla lista condivisa» in STORE_PUSH_PENDING). Azzeriamo la memo così
        // la sincronizzazione (e quindi la copia del token) è sempre fresca prima di
        // scrivere: altrimenti un token appena messo potrebbe non essere ancora copiato.
        this._linksMemo = null;
        try { this.savedLinks(); } catch (e) {}
        // Invio e modifiche al file partono in sottofondo: le schede non li aspettano.
        try { Promise.resolve(this.flushPush()).catch(function () {}); } catch (e) {}
        try { Promise.resolve(this.flushRemoteEdits()).catch(function () {}); } catch (e) {}
        // Popolari mostra SOLO i link salvati su questo telefono; la lista condivisa (il
        // documento) sta in Recenti. Qui il documento si riscarica solo in sottofondo
        // (serve a Recenti e a «Togli i link»), così Popolari non aspetta la rete.
        try { Promise.resolve(this.refreshRemote()).catch(function () {}); } catch (e) {}
        var groups = this.groupsFrom(this.savedLinks()), self = this;
        this.prefetch(groups);
        return { list: groups.map(function (g) { return self.groupCard(g); }), hasNextPage: false };
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
        if (typeof evaluateJavascriptViaWebview !== "function") missing = missing.filter(function (c) { return self.isBunkr(c) || self.isErome(c) || self.isFilester(c) || self.isPixeldrain(c) || self.isEmbed(c); });
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
        try { this.savedLinks(); } catch (e) {}
        // L'invio parte anche da qui, senza far aspettare le schede.
        try { Promise.resolve(this.flushPush()).catch(function () {}); } catch (e) {}
        try { Promise.resolve(this.flushRemoteEdits()).catch(function () {}); } catch (e) {}
        // Card subito dalla cache: la lista condivisa si aggiorna in sottofondo (TTL 60 s)
        // e si aspetta solo la prima volta, al massimo 8 s.
        var cached = this.cachedRemote();
        if (!cached.length) { try { await this.withTimeout(this.refreshRemote(true), 8000); } catch (e) {} cached = this.cachedRemote(); }
        else { try { Promise.resolve(this.refreshRemote()).catch(function () {}); } catch (e) {} }
        var groups = this.groupsFrom(cached), self = this;
        // Gli album non ancora letti si leggono in sottofondo (copertine alla prossima
        // apertura) o all'apertura della scheda (getDetail): la lista non li aspetta.
        this.prefetch(groups);
        return { list: groups.map(function (g) { return self.groupCard(g); }), hasNextPage: false };
    }

    // true solo se setTimeout esiste, non lancia e non esegue la funzione subito.
    // Su QuickJS/flutter_qjs di Mangayomi iPhone il timer può mancare: chiamarlo
    // rifiuta la Promise all'istante e ogni richiesta sembra «nessuna risposta».
    timerOk() {
        if (this._timerOk != null) return this._timerOk;
        if (typeof setTimeout !== "function") { this._timerOk = false; return false; }
        var sync = false, id;
        try { id = setTimeout(function () { sync = true; }, 0); } catch (e) { this._timerOk = false; return false; }
        if (sync) { this._timerOk = false; return false; }
        if (typeof clearTimeout === "function") { try { clearTimeout(id); } catch (e2) {} }
        this._timerOk = true;
        return true;
    }

    withTimeout(p, ms) {
        var waited = Promise.resolve(p);
        if (!this.timerOk()) return waited;
        var t, armed = false;
        var guard = new Promise(function (_, rej) {
            try { t = setTimeout(function () { rej(new Error("timeout")); }, ms); armed = true; } catch (e) {}
        });
        if (!armed) return waited;
        var clear = function () { if (typeof clearTimeout === "function") { try { clearTimeout(t); } catch (e) {} } };
        return Promise.race([waited, guard]).then(function (v) { clear(); return v; }, function (e) { clear(); throw e; });
    }

    prefetch(groups) {
        var fm = this.filesMap(), codes = [];
        groups.forEach(function (g) { codes = codes.concat(g.codes); });
        var missing = codes.filter(function (c) { return !fm[c] || fm[c].v !== READ_V; });
        if (!missing.length || this._prefetching) return;
        this._prefetching = true;
        var self = this;
        Promise.resolve(this.readMany(missing)).catch(function () {}).then(function () { self._prefetching = false; });
    }

    // Un link incollato si apre subito. Una parola cerca solo su bunkrsearch.link,
    // mai tra le schede salvate o la lista condivisa.
    async search(query, page, filters) {
        var q = String(query || "").trim();
        var code = /gofile\.io|bunkr+\.|filester\.[a-z]{2,}|pixeldrain\.com|erome\.com|[?&]em=/i.test(q) ? this.linkCode(q) : "";
        if (code) return { list: [this.card(code)], hasNextPage: false };
        if (!q) return { list: [], hasNextPage: false };
        var mode = this.searchMode(filters);
        if (mode === "erome") return this.eromeSearch(q, page || 1);
        if (mode === "both") return this.bothSearch(q, page || 1);
        return this.bunkrSearch(q, page || 1, mode === "video" ? "video" : "album");
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
            var erm = raw.match(/\/er\/(er~[A-Za-z0-9]+)/i);
            var emm = raw.match(/\/em\/(em(?:~|%7E)[^#]+)/i);
            var flm = raw.match(/\/fl\/(fl~[A-Za-z0-9]+)/i);
            var pdm = raw.match(/\/pd\/(pd~[^?#\/]+)/i);
            var code = erm ? erm[1] : pdm ? pdm[1] : flm ? flm[1] : emm ? decodeURIComponent(emm[1]) : bk ? this.normCode(decodeURIComponent(bk[1])) : (this.codeOf(raw) || this.codeOf(raw.replace(/^\/d\//, "")));
            if (!code) throw new Error("Gofile: link non valido.");
            codes = [code];
        }
        this._seen = this._seen || {};
        var again = this._seen[raw] && Date.now() - this._seen[raw] < 120000;
        this._seen[raw] = Date.now();
        var fm = this.filesMap(), info = this.infoMap(), isEr = this.isErome.bind(this);
        var need = codes.filter(function (c) { return isEr(c) || again || !fm[c] || fm[c].v !== READ_V || Date.now() - (fm[c].at || 0) > FILES_TTL; });
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
                if (v.er) {
                    chapters.push({ name: "Episodio " + (chapters.length + 1) + " - " + v.n, url: "erome:" + codes[i] + ":" + j, thumbnailUrl: /^http/.test(v.img || "") ? v.img : undefined });
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
        if (file.indexOf("erome:") === 0) return this.eromeVideo(file.slice(6));
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
            {
                type_name: "SelectFilter",
                name: "Cosa cerco",
                state: 0,
                values: [
                    { type_name: "SelectOption", name: "Album su Bunkr (con video)", value: "album" },
                    { type_name: "SelectOption", name: "Video su Bunkr (singoli)", value: "video" },
                    { type_name: "SelectOption", name: "Album su Erome", value: "erome" },
                    { type_name: "SelectOption", name: "Bunkr + Erome (album)", value: "both" },
                ],
            },
            { type_name: "HeaderFilter", name: "La ricerca parte sugli album Bunkr. «Album su Erome» cerca solo lì. «Bunkr + Erome (album)» alterna i due. Incolla un link Gofile, Bunkr, Erome, filester o pixeldrain per aprirlo. Per tenerlo, salvalo in «➕ Salva un link»." },
        ];
    }

    // «Cosa cerco»: album (predefinito) o video. Qualsiasi altro valore, anche il
    // vecchio «Le mie schede», resta sugli album di Bunkr.
    searchMode(filters) {
        try {
            for (var i = 0; i < (filters || []).length; i++) {
                var f = filters[i];
                if (f && f.type_name === "SelectFilter" && f.values && typeof f.state === "number") {
                    var v = f.values[f.state];
                    if (v && (v.value === "video" || v.value === "erome" || v.value === "album" || v.value === "both")) return v.value;
                }
            }
        } catch (e) {}
        return "album";
    }

    // Ricerca su bunkrsearch.link (API JSON, nessun anti-bot). kind: «album» o «video».
    // Si usa sempre l'endpoint dei file (che dice il tipo), così si mostrano solo i VIDEO:
    // in modalità «video» i singoli file, in modalità «album» gli album che hanno video
    // (raggruppati). Gli album di sole foto non compaiono.
    async bunkrSearch(q, page, kind) {
        page = page || 1;
        var url = "https://" + BUNKR_SEARCH_HOST + "/api/search?q=" + encodeURIComponent(q) + "&page=" + page;
        var res;
        var down = "Il sito di ricerca Bunkr (bunkrsearch.link) non risponde: forse è bloccato dall'operatore";
        // Nessun timer: su iPhone un timeout nostro può scattare prima della risposta (1.25.2).
        try { res = await this.client.get(url, { "User-Agent": UA }); } catch (e) { throw new Error(down); }
        if (!res || res.statusCode !== 200) throw new Error(down);
        var data = null;
        try { data = JSON.parse(String(res.body || "")); } catch (e) { throw new Error(down); }
        if (!data || !data.results) throw new Error(down);
        if (!data.results.length) return { list: [], hasNextPage: false };
        var self = this, info = this.infoMap(), dirty = false, list = [];
        // Album: niente doppioni tra le pagine della stessa ricerca (azzerato a pagina 1).
        if (kind !== "video" && page === 1) this._albSeen = {};
        var seen = kind !== "video" ? (this._albSeen || (this._albSeen = {})) : {};
        data.results.forEach(function (r) {
            var isVideo = r.ext === "Video" || /^video\//.test(String(r.mime || ""));
            if (!isVideo) return;
            var code, name, thumb = self.absHttp(r.thumbnail);
            if (kind === "video") {
                if (!r.slug) return;
                code = "bk~f~" + r.slug;
                name = self.episodeName(r.original || r.name || r.slug);
            } else {
                var aslug = r.album_slug; if (!aslug || seen[aslug]) return;
                seen[aslug] = 1;
                code = "bk~a~" + aslug;
                name = r.album_name || aslug;
            }
            if (!info[code] || info[code].name !== name || (thumb && info[code].image !== thumb)) {
                info[code] = { name: name, image: thumb };
                dirty = true;
            }
            list.push({ name: name, imageUrl: thumb, link: self.cardPath(code) });
        });
        if (dirty) this.writeStore(STORE_INFO, JSON.stringify(info));
        var size = data.results.length;
        var pages = data.total ? Math.max(1, Math.ceil(data.total / Math.max(size, 1))) : page;
        return { list: list, hasNextPage: page < pages && size > 0 };
    }

    // Titoli da non mostrare: minori, oppure riprese non consensuali o di nascosto.
    // Le parole corte valgono da sole («spy» non blocca «spicy»); «teen» vale anche dentro «teenager».
    blockedTitle(s) {
        var t = String(s || "").toLowerCase().replace(/&#0*39;|&apos;/g, "'").replace(/&amp;/g, " ").replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
        if (!t) return false;
        var re = [
            /(^| )teen/, /(^| )young/, /(^| )tiny/, /(^| )school/, /(^| )student/,
            /(^| )under ?age/, /(^| )minors?( |$)/, /(^| )kids?( |$)/, /(^| )child(ren)?( |$)/,
            /(^| )loli/, /(^| )shota/, /(^| )barely( |$)/, /(^| )1[89] ?yo( |$)/,
            /(^| )leak(ed)?( |$)/, /(^| )caught( |$)/, /(^| )hidden/, /(^| )spy( |$)/, /spycam/,
            /(^| )voyeur/, /upskirt/, /(^| )sleep/, /(^| )drunk/, /passed out/,
            /(^| )forced( |$)/, /(^| )rap(e|ed|ing)( |$)/, /non ?consent/,
            /(^| )revenge/, /(^| )stolen( |$)/, /(^| )ex ?gf( |$)/, /(^| )creep/,
            /(^| )pre ?teen/, /(^| )toddler/, /(^| )infant/, /(^| )kindergarten/
        ];
        for (var i = 0; i < re.length; i++) if (re[i].test(t)) return true;
        return false;
    }

    // Ricerca album su erome.com. Solo se il filtro è «Album su Erome».
    async eromeSearch(q, page) {
        page = page || 1;
        var url = "https://www.erome.com/search?q=" + encodeURIComponent(q) + "&page=" + page;
        var down = "Erome non risponde: forse è bloccato dall'operatore";
        var res;
        try { res = await this.client.get(url, { "User-Agent": UA }); } catch (e) { throw new Error(down); }
        if (!res || res.statusCode !== 200) throw new Error(down);
        var html = String(res.body || "");
        if (!html) throw new Error(down);
        var blocks = html.split(/id="album-/).slice(1);
        var self = this, info = this.infoMap(), dirty = false, list = [];
        blocks.forEach(function (b) {
            var href = (b.match(/class="album-link"[^>]*href="([^"]+)"/i) || b.match(/href="([^"]+)"[^>]*class="album-link"/i) || [])[1] || "";
            var id = (href.match(/\/a\/([A-Za-z0-9]+)/) || [])[1];
            if (!id) return;
            var title = self.decodeHtml((b.match(/class="album-title"[^>]*>([^<]*)</i) || [])[1] || "");
            if (!title || self.blockedTitle(title)) return;
            var videos = parseInt(((b.match(/class="album-videos"[^>]*>[\s\S]*?<\/span>/i) || [""])[0].replace(/<[^>]+>/g, " ").match(/\d+/) || [])[0], 10) || 0;
            if (videos < 1) return;
            var thumb = (b.match(/class="album-thumbnail[^"]*"[^>]*src="([^"]+)"/i) || b.match(/src="([^"]+)"[^>]*class="album-thumbnail/i) || [])[1] || "";
            thumb = self.absHttp(thumb);
            var code = "er~" + id;
            if (!info[code] || info[code].name !== title || (thumb && info[code].image !== thumb)) {
                info[code] = { name: title, image: thumb };
                dirty = true;
            }
            list.push({ name: title, imageUrl: thumb, link: self.cardPath(code) });
        });
        if (dirty) this.writeStore(STORE_INFO, JSON.stringify(info));
        return { list: list, hasNextPage: /rel=["']next["']/i.test(html) };
    }

    // Indirizzo immagine sempre assoluto. //cdn/… diventa https://cdn/…
    absHttp(u) {
        var s = String(u || "").trim();
        if (/^https?:\/\//i.test(s)) return s;
        if (s.indexOf("//") === 0) return "https:" + s;
        return "";
    }

    // Album Bunkr ed Erome insieme: partono in parallelo, poi si alternano.
    // Se uno dei due non risponde restano i risultati dell'altro.
    async bothSearch(q, page) {
        var bunkrP = this.bunkrSearch(q, page, "album").then(function (r) { return { ok: true, r: r }; }, function () { return { ok: false }; });
        var eromeP = this.eromeSearch(q, page).then(function (r) { return { ok: true, r: r }; }, function () { return { ok: false }; });
        var bunkr = await bunkrP, erome = await eromeP;
        if (!bunkr.ok && !erome.ok) throw new Error("Bunkr e Erome non rispondono: forse sono bloccati dall'operatore");
        var a = bunkr.ok ? bunkr.r.list : [], b = erome.ok ? erome.r.list : [];
        var list = [], seen = {}, i = 0;
        while (i < a.length || i < b.length) {
            if (i < a.length && a[i] && !seen[a[i].link]) { seen[a[i].link] = 1; list.push(a[i]); }
            if (i < b.length && b[i] && !seen[b[i].link]) { seen[b[i].link] = 1; list.push(b[i]); }
            i++;
        }
        return { list: list, hasNextPage: !!((bunkr.ok && bunkr.r.hasNextPage) || (erome.ok && erome.r.hasNextPage)) };
    }

    // Pagina album Erome. Gli indirizzi dei video cambiano: si rilegge a ogni apertura.
    async readErome(code) {
        var id = String(code).slice(3);
        var down = "Erome non risponde: forse è bloccato dall'operatore";
        var res;
        try { res = await this.client.get("https://www.erome.com/a/" + id, { "User-Agent": UA, "Referer": "https://www.erome.com/" }); } catch (e) { throw new Error(down); }
        if (!res || res.statusCode !== 200) throw new Error(down);
        var html = String(res.body || "");
        if (!html) throw new Error(down);
        var title = this.decodeHtml((html.match(/class="album-title-page"[^>]*>([^<]*)</i) || html.match(/<title>([^<]*)/i) || [])[1] || "");
        if (this.blockedTitle(title)) throw new Error("Contenuto non disponibile");
        var groups = html.split(/<div class="media-group"/).slice(1);
        var files = [], n = 0;
        for (var i = 0; i < groups.length; i++) {
            var g = groups[i];
            var src = (g.match(/<source[^>]*src=["']([^"']+)["'][^>]*>/i) || [])[1] || "";
            if (!/\.mp4(\?|$)/i.test(src)) continue;
            n++;
            var poster = (g.match(/poster=["']([^"']+)["']/i) || [])[1] || "";
            var resN = (g.match(/\bres=["'](\d+)["']/i) || [])[1];
            var label = (g.match(/\blabel=["']([^"']+)["']/i) || [])[1] || "";
            files.push({ n: "Video " + n, img: this.absHttp(poster), er: src, q: resN ? resN + "p" : (label || "720p") });
        }
        var fm = this.filesMap();
        fm[code] = { title: title || id, files: files, folders: 0, at: Date.now(), v: READ_V };
        this.writeStore(STORE_FILES, JSON.stringify(fm));
        var map = this.infoMap();
        var thumb = files.length && files[0].img ? files[0].img : ((map[code] && map[code].image) || "");
        map[code] = { name: title || (map[code] && map[code].name) || id, image: thumb };
        this.writeStore(STORE_INFO, JSON.stringify(map));
        return { rows: files, text: "" };
    }

    async eromeVideo(spec) {
        var bits = String(spec || "").split(":");
        var code = bits[0];
        var idx = parseInt(bits[1], 10) || 0;
        var headers = { "Referer": "https://www.erome.com/", "User-Agent": UA };
        var self = this;
        var load = async function () {
            await self.readErome(code);
            var files = (self.filesMap()[code] || {}).files || [];
            return files[idx] || files[0];
        };
        var file = await load();
        if (!file || !file.er) throw new Error("Erome non risponde: forse è bloccato dall'operatore");
        var playable = async function (url) {
            try {
                var res = await self.client.head(url, headers);
                var sc = res && res.statusCode;
                return sc === 200 || sc === 206 || sc === 302;
            } catch (e) { return false; }
        };
        if (!await playable(file.er)) {
            file = await load();
            if (!file || !file.er || !await playable(file.er)) throw new Error("I video Erome non partono sulla TV: servono sul telefono");
        }
        var q = file.q || "720p";
        return [{ url: file.er, originalUrl: file.er, quality: "Erome · " + q, headers: headers }];
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
                try { Promise.resolve(this.flushRemoteEdits()).catch(function () {}); } catch (e) {}
            }
        }
        var links = this.readJson(STORE_LINKS, []);
        var newest = links.slice().reverse();
        // Etichetta leggibile: il nome che hai dato, altrimenti il titolo letto dal sito
        // (es. «asuna_love»), e solo in ultima battuta l'indirizzo.
        var pInfo = this.infoMap(), pFm = this.filesMap();
        var niceOf = function (code) {
            var t = (pInfo[code] && pInfo[code].name) || (pFm[code] && pFm[code].title) || "";
            if (t && !/\(non trovata\)/.test(t)) return t;
            return self.shortLink(code);
        };
        var label = function (l) { return l.name || niceOf(l.code); };
        var shared = {};
        this.cachedRemote().forEach(function (l) { shared[l.code] = 1; });
        var pool = this.linkPool(links);
        var hasToken = !!this.remoteToken();
        var prefs = [{
            key: this.addKey(),
            editTextPreference: {
                title: "➕ Salva un link: incolla il link, poi | e il nome",
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
                    title: (one ? "✏️ Nome scheda dell'ultimo link" : "✏️ Nome scheda dei link appena salvati") + " (- toglie il nome)",
                    summary: "Per: " + forWhat,
                    value: "",
                    dialogTitle: one ? "Nome scheda dell'ultimo link" : "Nome scheda dei " + batch.length + " link appena salvati",
                    dialogMessage: (one
                        ? "Nome della scheda per " + this.shortLink(one.code) + "."
                        : "Nome della scheda per i " + batch.length + " link appena salvati insieme (così finiscono in un'unica raccolta).") + " Scrivi - per togliere il nome.",
                },
            });
        }
        if (pool.length) {
            var poolView = pool.slice().reverse();
            var removeTitle = "Togli i link: segna, non si cancellano ancora";
            if (pool.some(function (l) { return l.remote; }) && !hasToken) removeTitle = "Togli i link: segna. I 🌐 della lista condivisa si tolgono solo col token";
            else if (pool.some(function (l) { return l.remote; })) removeTitle = "Togli i link: segna (🌐 = lista condivisa, solo dopo OK)";
            prefs.push({
                key: this.removeKey(pool),
                multiSelectListPreference: {
                    title: removeTitle,
                    summary: "Spunta i link da togliere. I 🌐 sono nel file condiviso" + (hasToken ? " e si tolgono solo scrivendo OK." : ": senza token non si possono togliere.") + " Un OK a vuoto non cancella nulla.",
                    entries: poolView.map(function (l) { return (l.remote ? "🌐 " : "") + (l.name || niceOf(l.code)); }),
                    entryValues: poolView.map(function (l) { return l.code; }),
                    values: [],
                },
            });
            var markedNow = this._marked || [];
            if (markedNow.length) {
                prefs.push({
                    key: this.confirmKey(markedNow),
                    editTextPreference: {
                        title: "Conferma rimozione (" + markedNow.length + "): scrivi OK",
                        summary: "Solo scrivendo OK i link segnati spariscono. Un OK a vuoto non cancella nulla.",
                        value: "",
                        dialogTitle: "Conferma rimozione",
                        dialogMessage: "Scrivi OK per togliere i " + markedNow.length + " link segnati. Lascia vuoto per non fare nulla.",
                    },
                });
            }
        }
        var undo = this.readJson(STORE_UNDO, null);
        if (undo && ((undo.links && undo.links.length) || (undo.remote && undo.remote.length))) {
            prefs.push({
                key: this.undoKey(undo),
                editTextPreference: {
                    title: "Annulla ultima rimozione (" + ((undo.links || []).length + (undo.remote || []).length) + "): scrivi OK",
                    summary: "Rimette l'ultimo elenco di link tolti, anche le righe 🌐 del file. Un OK a vuoto non fa nulla.",
                    value: "",
                    dialogTitle: "Annulla ultima rimozione",
                    dialogMessage: "Scrivi OK per rimettere i link appena tolti.",
                },
            });
        }
        var remoteList = this.cachedRemote();
        var remoteNames = remoteList.map(function (l) { return "• " + (l.name || niceOf(l.code)); });
        var canWrite = !!this.remoteApiTarget();
        var inDoc = remoteList.length ? ("Nel documento ci sono " + remoteList.length + " link:\n" + remoteNames.join("\n")) : "Il documento è ancora vuoto (nessun link).";
        // Riga di stato con chiave che cambia con lo stato: così il riepilogo si aggiorna
        // davvero (quelli a chiave fissa in Mangayomi restano col primo testo, bug #1196).
        var statusKey = "gofile_status_" + this._hash((hasToken ? "T" : "F") + "|" + remoteList.length + "|" + remoteNames.join(",") + "|" + this.pushStatus());
        prefs.push({
            key: statusKey,
            editTextPreference: {
                title: this.statusTitle(),
                summary: this.statusTitle() + "\n\n" + (this.pushStatus() ? this.pushStatus() + "\n\n" : "") +
                    (hasToken ? "Token: impostato ✓.\n" : "Token: non impostato.\n") + inDoc,
                value: "", dialogTitle: "Stato", dialogMessage: "Solo informativo: mostra se il token è a posto e i link presenti nel documento.",
            },
        });
        var tok = this.remoteToken();
        prefs.push({
            key: this.tokenKey(),
            editTextPreference: {
                title: (tok ? "🔑 Token ✓ (…" + tok.slice(-4) + ")" : "🔑 Token: non impostato") + " · fine-grained, Contents: Read and write (leggere e scrivere i file). - toglie",
                summary: "La casella è vuota apposta: il token già salvato non si mostra. Per cambiarlo incolla un token personale fine-grained (limitato a questo repo) con il permesso Contents: Read and write, cioè leggere e scrivere i file. Scrivi - per toglierlo. I link in un repo pubblico restano pubblici.",
                value: "",
                dialogTitle: tok ? "Token ✓ (…" + tok.slice(-4) + ")" : "Token: non impostato",
                dialogMessage: "Incolla un token nuovo, oppure - per togliere quello salvato. Non viene mostrato per intero.",
            },
        });
        if (canWrite) {
            var tokenNote = hasToken ? "" : "⚠️ Prima metti il token qui sopra. ";
            if (newest.length) {
                prefs.push({
                    key: this.pushKey(links),
                    multiSelectListPreference: {
                        title: this.addTitle(),
                        summary: this.addTitle() + "\n\n" + (this.pushStatus() ? this.pushStatus() + "\n\n" : "") + tokenNote + "Spunta i link del telefono da mettere nella lista condivisa. «✓ già condiviso» è già nel file e non si reinvia. Vengono scritti quando riapri Popolari, Recenti o la ricerca.",
                        entries: newest.map(function (l) { return (shared[l.code] ? "✓ già condiviso · " : "") + label(l); }),
                        entryValues: newest.map(function (l) { return l.code; }),
                        values: [],
                    },
                });
            } else {
                prefs.push({
                    key: "gofile_push_info_" + this._hash(this.addTitle()),
                    editTextPreference: {
                        title: this.addTitle() + " · prima salva un link sul telefono",
                        summary: this.addTitle() + "\n\n" + (this.pushStatus() ? this.pushStatus() + " " : "") + "Prima salva qualche link con «➕ Salva un link».",
                        value: "", dialogTitle: "Lista condivisa", dialogMessage: "Nessun link del telefono da aggiungere.",
                    },
                });
            }
        }
        return prefs;
    }
}
