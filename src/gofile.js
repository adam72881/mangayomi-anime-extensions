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
        "version": "1.8.0",
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
const PREF_COVER = "gofile_cover";
const STORE_INFO = "gofile_folder_info";
const STORE_TOKEN = "gofile_token";
const VIDEO_EXT = /\.(mp4|mkv|webm|mov|m4v|avi|ts|m3u8)$/i;

// La lista di una cartella la disegna il JavaScript di Gofile: la pagina si apre
// nella WebView nascosta di Mangayomi, come nel browser, e lo script legge le righe
// quando smettono di aumentare. Il link del file è la cartella della miniatura più
// il nome del file; per scaricarlo serve il cookie accountToken della stessa visita.
// Copertina 400x600 da 1, 2 o 4 miniature prese sparse nella cartella: a ognuna si
// tolgono le bande nere di Gofile e la si allarga fino a riempire il suo riquadro.
function listScript(n) {
    return `(function () {
    var COVER_N = ${n};
    var last = -1, same = 0, ticks = 0;
    var timer = setInterval(function () {
        ticks++;
        var rows = document.querySelectorAll('.fm-row[data-type]');
        if (rows.length && rows.length === last) same++; else same = 0;
        last = rows.length;
        var body = document.body ? document.body.innerText : '';
        var stop = !rows.length && ticks >= 6 && /not found|unreachable|password|expired|deleted|removed/i.test(body);
        if (!(same >= 3 || stop || ticks > 50)) return;
        clearInterval(timer);
        var out = { title: document.title, cookie: document.cookie, text: document.body ? document.body.innerText.slice(0, 300) : '', rows: [], cover: '' };
        var thumbs = [];
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i], p = r.querySelector('p'), img = r.querySelector('img');
            out.rows.push({ id: r.getAttribute('data-id'), type: r.getAttribute('data-type'), name: p ? p.textContent.trim() : '', img: img ? img.src : '' });
            if (img && r.getAttribute('data-type') === 'file') thumbs.push(img.src);
        }
        var picks = [];
        for (var q = 0; q < COVER_N && q < thumbs.length; q++) {
            picks.push(thumbs[COVER_N > 1 ? Math.round(q * (thumbs.length - 1) / (COVER_N - 1)) : 0]);
        }
        var sent = false;
        var send = function (cover) {
            if (sent) return;
            sent = true;
            out.cover = cover || '';
            window.flutter_inappwebview.callHandler('setResponse', JSON.stringify(out));
        };
        if (!picks.length) return send('');
        setTimeout(function () { send(''); }, 8000);
        makeCover(picks, COVER_N, send);
    }, 500);
    function makeCover(srcs, n, done) {
      var W = 400, H = 600, cells = n >= 4 ? [[0, 0, 200, 300], [200, 0, 200, 300], [0, 300, 200, 300], [200, 300, 200, 300]] : n >= 2 ? [[0, 0, 400, 300], [0, 300, 400, 300]] : [[0, 0, 400, 600]];
      srcs = srcs.slice(0, cells.length);
      if (!srcs.length) return done('');
      while (srcs.length < cells.length) srcs.push(srcs[srcs.length % Math.max(1, srcs.length)]);
      var out = document.createElement('canvas'); out.width = W; out.height = H;
      var ctx = out.getContext('2d'); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
      var left = srcs.length, okAny = false;
      var finish = function () { if (--left === 0) done(okAny ? out.toDataURL('image/jpeg', 0.82) : ''); };
      srcs.forEach(function (src, k) {
        var img = new Image(); img.crossOrigin = 'anonymous';
        img.onload = function () {
          try {
            var w = img.naturalWidth, h = img.naturalHeight, c = document.createElement('canvas');
            c.width = w; c.height = h; var x = c.getContext('2d'); x.drawImage(img, 0, 0);
            var d = x.getImageData(0, 0, w, h).data;
            var dark = function (p0, horiz) { var len = horiz ? w : h, s = 0; for (var i = 0; i < len; i += 2) { var p = horiz ? (p0 * w + i) * 4 : (i * w + p0) * 4; s += d[p] + d[p + 1] + d[p + 2]; } return s / (len / 2) / 3 < 24; };
            var t = 0, b = h - 1, l = 0, r = w - 1;
            while (t < h / 3 && dark(t, true)) t++;
            while (b > h * 2 / 3 && dark(b, true)) b--;
            while (l < w / 3 && dark(l, false)) l++;
            while (r > w * 2 / 3 && dark(r, false)) r--;
            var cw = r - l + 1, ch = b - t + 1, cell = cells[k];
            var sc = Math.max(cell[2] / cw, cell[3] / ch), sw = cell[2] / sc, sh = cell[3] / sc;
            ctx.drawImage(img, l + (cw - sw) / 2, t + (ch - sh) / 2, sw, sh, cell[0], cell[1], cell[2], cell[3]);
            okAny = true;
          } catch (e) {}
          finish();
        };
        img.onerror = finish;
        img.src = src;
      });
    }
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

    // «Nome dell'ultimo link»: vale per il link salvato per ultimo. La chiave cambia
    // dopo ogni uso, così la casella torna vuota.
    renameKey() {
        return "gofile_lastname_" + (parseInt(this.readStore(STORE_REN_N), 10) || 0);
    }

    // Quante miniature nella copertina (impostazione «Copertina»).
    coverN() {
        var v = parseInt(this.setting(PREF_COVER), 10);
        return v === 1 || v === 2 ? v : 4;
    }

    coverMark() {
        return "c" + this.coverN();
    }

    shortLink(code) {
        return "gofile.io/d/" + code;
    }

    removeKey(links) {
        var h = 0, str = links.map(function (l) { return l.code + "=" + l.name; }).join("|");
        for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
        return "gofile_remove_" + (h >>> 0).toString(36);
    }

    // «link | nome», «link nome» o solo il link; più link separati da spazio, senza nome.
    parseLinks(text) {
        var out = [];
        var line = String(text || "").trim();
        if (!line) return out;
        var links = line.match(/(?:https?:\/\/)?(?:www\.)?gofile\.io\/d\/[A-Za-z0-9]+/gi) || [];
        if (links.length > 1) {
            for (var i = 0; i < links.length; i++) out.push({ code: this.codeOf(links[i]), name: "" });
            return out;
        }
        var code, rest;
        if (links.length === 1) {
            code = this.codeOf(links[0]);
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
        var changed = false;
        var self = this;
        var push = function (l) {
            if (!l.code) return;
            for (var i = 0; i < links.length; i++) {
                if (links[i].code === l.code) {
                    if (l.name && links[i].name !== l.name) { links[i].name = l.name; changed = true; }
                    return;
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
        if (remove && remove.length) {
            links = links.filter(function (l) { return remove.indexOf(l.code) === -1; });
            changed = true;
        }
        var added = this.parseLinks(this.setting(this.addKey()));
        if (added.length) {
            added.forEach(push);
            this.writeStore(STORE_ADD_N, String((parseInt(this.readStore(STORE_ADD_N), 10) || 0) + 1));
        }
        var newName = links.length ? String(this.setting(this.renameKey()) || "").trim() : "";
        if (newName) {
            var lastLink = links[links.length - 1];
            lastLink.name = newName === "-" || newName === this.shortLink(lastLink.code) ? "" : newName.replace(/^[\s|]+|[\s|]+$/g, "").slice(0, 60);
            changed = true;
            this.writeStore(STORE_REN_N, String((parseInt(this.readStore(STORE_REN_N), 10) || 0) + 1));
        }
        if (changed) this.writeStore(STORE_LINKS, JSON.stringify(links));
        this._linksMemo = { at: Date.now(), list: links };
        return links.slice();
    }

    customName(code) {
        var links = this.savedLinks();
        for (var i = 0; i < links.length; i++) if (links[i].code === code) return links[i].name;
        return "";
    }

    infoMap() {
        try { return JSON.parse(this.readStore(STORE_INFO) || "{}") || {}; } catch (e) { return {}; }
    }

    card(code, name) {
        var info = this.infoMap()[code] || {};
        return { name: name || this.customName(code) || info.name || "Gofile " + code, imageUrl: info.image || "", link: "/d/" + code };
    }

    // Copertina e titolo si leggono una volta sola, la prima volta che il link
    // compare in elenco (una cartella alla volta), poi restano salvati.
    async remember(code) {
        try {
            var data = await this.readFolder(code);
            // Server non raggiungibili o pagina non caricata: si riprova la prossima volta.
            if (!(data.rows || []).length && !/not found/i.test(String(data.text || ""))) return;
            var files = (data.rows || []).filter(function (r) { return r.type === "file" && r.img; });
            var title = String(data.title || "").replace(/\s*·\s*Gofile\s*$/i, "").trim();
            if (!(data.rows || []).length) title = "Gofile " + code + " (non trovata)";
            var map = this.infoMap();
            map[code] = { name: title || code, image: data.cover || (files.length ? files[0].img : ""), cv: this.coverMark() };
            this.writeStore(STORE_INFO, JSON.stringify(map));
        } catch (e) {}
    }

    async getPopular(page) {
        if (page > 1) return { list: [], hasNextPage: false };
        var links = this.savedLinks();
        var known = this.infoMap();
        // Copertine fatte con un'altra impostazione «Copertina» (o prima della 1.7): si rifanno, una volta.
        var mark = this.coverMark();
        var missing = links.filter(function (l) { var k = known[l.code]; return !k || (k.image && k.cv !== mark && !/non trovata/.test(k.name || "")); }).map(function (l) { return l.code; });
        for (var k = 0; k < missing.length; k++) await this.remember(missing[k]);
        var list = [];
        for (var i = links.length - 1; i >= 0; i--) list.push(this.card(links[i].code, links[i].name));
        return { list: list, hasNextPage: false };
    }

    async getLatestUpdates(page) {
        return this.getPopular(page);
    }

    // Nella ricerca si può incollare un link (o il codice) per aprirlo una volta;
    // altrimenti filtra i link salvati per nome.
    async search(query, page, filters) {
        if (page > 1) return { list: [], hasNextPage: false };
        var q = String(query || "").trim();
        var code = /gofile\.io/i.test(q) ? this.codeOf(q) : "";
        if (code) return { list: [this.card(code)], hasNextPage: false };
        var all = (await this.getPopular(1)).list;
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
        var raw = await evaluateJavascriptViaWebview("https://gofile.io/d/" + code, {}, [listScript(this.coverN())], 40);
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

    async getDetail(url) {
        var code = this.codeOf(url) || this.codeOf(String(url).replace(/^\/d\//, ""));
        if (!code) throw new Error("Gofile: link non valido.");
        var data = await this.readFolder(code);
        var folderTitle = String(data.title || "").replace(/\s*·\s*Gofile\s*$/i, "").trim() || code;
        var title = this.customName(code) || folderTitle;

        var files = (data.rows || []).filter(function (r) { return r.type === "file" && VIDEO_EXT.test(r.name || ""); });
        var folders = (data.rows || []).filter(function (r) { return r.type === "folder"; }).length;
        var chapters = [];
        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            var base = /^https?:\/\/[^/]+\.gofile\.io\/download\/web\/[^/]+\//.test(f.img) ? f.img.replace(/[^/]+$/, "") : "";
            if (!base) continue;
            var ch = { name: "Episodio " + (i + 1) + " - " + this.episodeName(f.name), url: base + encodeURIComponent(f.name) };
            ch.thumbnailUrl = f.img;
            chapters.push(ch);
        }
        // Dall'ultimo al primo, come le altre sorgenti: così Mangayomi trova il successivo.
        chapters.reverse();

        var image = data.cover || (files.length && files[0].img ? files[0].img : "");
        if ((data.rows || []).length) {
            var map = this.infoMap();
            map[code] = { name: folderTitle, image: image, cv: data.cover ? this.coverMark() : "" };
            this.writeStore(STORE_INFO, JSON.stringify(map));
        }

        var lines = [files.length + " video"];
        var skipped = files.length - chapters.length;
        if (skipped > 0) lines.push(skipped + " video senza anteprima non si possono aprire da qui.");
        if (folders) lines.push(folders + " sottocartelle: aggiungile come link a parte.");
        if (!(data.rows || []).length) {
            var why = String(data.text || "");
            if (/unreachable/i.test(why)) lines = ["Gofile non risponde in questo momento. Riprova tra qualche minuto (trascina in basso la scheda)."];
            else if (/not found/i.test(why)) lines = ["Questa cartella non esiste più su Gofile."];
            else if (/password/i.test(why)) lines = ["Questa cartella è protetta da password: aprila nel browser."];
            else lines = ["Nessun file trovato. La cartella può essere vuota o scaduta."];
        }

        return {
            name: title,
            link: "/d/" + code,
            imageUrl: image,
            description: lines.join("\n") + "\n\nhttps://gofile.io/d/" + code,
            genre: [],
            status: 1,
            chapters: chapters,
        };
    }

    async getVideoList(url) {
        var file = String(url);
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
        }
        var links = this.readJson(STORE_LINKS, []);
        var newest = links.slice().reverse();
        var label = function (l) { return l.name || self.shortLink(l.code); };
        var prefs = [{
            key: this.addKey(),
            editTextPreference: {
                title: "➕ Salva un link",
                summary: "Scrivi un link Gofile (https://gofile.io/d/…), e se vuoi il nome dopo una barra: link | nome. Ogni link diventa una scheda in Popolari.",
                value: "",
                dialogTitle: "Salva un link",
                dialogMessage: "Link Gofile, poi una barra verticale e il nome della scheda (facoltativo). Es. https://gofile.io/d/XXXX | I miei video",
            },
        }];
        if (links.length) {
            var last = links[links.length - 1];
            prefs.push({
                key: this.renameKey(),
                editTextPreference: {
                    title: "✏️ Nome dell'ultimo link",
                    summary: "Per: " + (last.name ? last.name + " — " : "") + this.shortLink(last.code) + (last.name ? "" : " (senza nome)"),
                    value: "",
                    dialogTitle: "Nome dell'ultimo link",
                    dialogMessage: "Nome della scheda per " + this.shortLink(last.code) + ". Scrivi - per togliere il nome e vedere il link.",
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
        prefs.push({
            key: PREF_COVER,
            listPreference: {
                title: "Copertina",
                summary: "Quante miniature dei video mettere nella copertina di ogni link. Cambiandola, le copertine si rifanno la prossima volta che apri Popolari.",
                valueIndex: 0,
                entries: ["4 video (2×2)", "2 video (sopra e sotto)", "1 video"],
                entryValues: ["4", "2", "1"],
            },
        });
        return prefs;
    }
}
