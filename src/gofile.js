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
        "version": "1.10.0",
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
const STORE_FILES = "gofile_folder_files";
const FILES_TTL = 6 * 3600000;
const VIDEO_EXT = /\.(mp4|mkv|webm|mov|m4v|avi|ts|m3u8)$/i;
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

// Copertina 400x600 da 1, 2 o 4 miniature: a ognuna si tolgono le bande nere di
// Gofile e la si allarga fino a riempire il suo riquadro (le miniature hanno CORS *).
const COVER_FN = `
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
`;

// La lista di una cartella la disegna il JavaScript di Gofile: la pagina si apre
// nella WebView nascosta di Mangayomi, come nel browser, e lo script legge le righe.
// Si ferma appena ci sono tutte («N items» della pagina) o quando smettono di
// aumentare. Il link del file è la cartella della miniatura più il nome del file;
// per scaricarlo serve il cookie accountToken della stessa visita.
// coverN 0 = senza copertina (basta la lista).
function listScript(coverN) {
    return `(function () {
    var COVER_N = ${coverN};
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
        if (!(complete || same >= 3 || stop || ticks > 50)) return;
        clearInterval(timer);
        var out = { title: document.title, cookie: document.cookie, text: body.slice(0, 300), rows: [], cover: '' };
        var thumbs = [];
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i], p = r.querySelector('p'), img = r.querySelector('img');
            out.rows.push({ id: r.getAttribute('data-id'), type: r.getAttribute('data-type'), name: p ? p.textContent.trim() : '', img: img ? img.src : '' });
            if (img && r.getAttribute('data-type') === 'file') thumbs.push(img.src);
        }
        var sent = false;
        var send = function (cover) {
            if (sent) return;
            sent = true;
            out.cover = cover || '';
            window.flutter_inappwebview.callHandler('setResponse', JSON.stringify(out));
        };
        if (!COVER_N || !thumbs.length) return send('');
        var picks = [];
        for (var q = 0; q < COVER_N && q < thumbs.length; q++) {
            picks.push(thumbs[COVER_N > 1 ? Math.round(q * (thumbs.length - 1) / (COVER_N - 1)) : 0]);
        }
        setTimeout(function () { send(''); }, 8000);
        makeCover(picks, COVER_N, send);
    }, 500);
    ${COVER_FN}
})();`;
}

// Copertina di una raccolta da miniature già note (di link diversi).
function coverScript(thumbs, n) {
    return `(function () {
    var done = false;
    var send = function (c) { if (done) return; done = true; window.flutter_inappwebview.callHandler('setResponse', c || ''); };
    setTimeout(function () { send(''); }, 8000);
    ${COVER_FN}
    makeCover(${JSON.stringify(thumbs)}, ${n}, send);
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
    // dominio bunkr.*. Il codice interno è «bk~tipo~id~dominio».
    bunkrCode(text) {
        var m = String(text || "").match(/(bunkr+\.[a-z]{2,})\/([afvi])\/([A-Za-z0-9]+)/i);
        if (!m) return "";
        return "bk~" + (m[2].toLowerCase() === "a" ? "a" : "f") + "~" + m[3] + "~" + m[1].toLowerCase();
    }

    linkCode(text) {
        return this.bunkrCode(text) || this.codeOf(text);
    }

    isBunkr(code) {
        return String(code).indexOf("bk~") === 0;
    }

    bunkrParts(code) {
        var p = String(code).split("~");
        return { kind: p[1], id: p[2], host: p[3] };
    }

    linkUrl(code) {
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
        return this.linkUrl(code).replace(/^https:\/\//, "");
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
        var links = line.match(/(?:https?:\/\/)?(?:www\.)?(?:gofile\.io\/d\/[A-Za-z0-9]+|bunkr+\.[a-z]{2,}\/[afvi]\/[A-Za-z0-9]+)/gi) || [];
        if (links.length > 1) {
            for (var i = 0; i < links.length; i++) out.push({ code: this.linkCode(links[i]), name: "" });
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

    // Link con lo stesso nome (maiuscole e spazi non contano) sono una scheda sola,
    // «/g/<nome>», con i video di tutti i link. Senza nome: una scheda per link, «/d/<codice>».
    groupKey(name) {
        return String(name || "").trim().toLowerCase().replace(/\s+/g, " ");
    }

    groups() {
        var links = this.savedLinks();
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

    groupOf(key) {
        var all = this.groups();
        for (var i = 0; i < all.length; i++) if (all[i].key === key) return all[i];
        return null;
    }

    filesMap() {
        return this.readJson(STORE_FILES, {});
    }

    card(code, name) {
        var info = this.infoMap()[code] || {};
        return { name: name || this.customName(code) || info.name || this.shortLink(code), imageUrl: info.image || "", link: (this.isBunkr(code) ? "/bk/" : "/d/") + code };
    }

    groupCard(g) {
        if (g.key.charAt(0) === "#") return this.card(g.codes[0], "");
        var info = this.infoMap();
        var cover = g.codes.length > 1 && info["g:" + g.key] ? info["g:" + g.key].image : (info[g.codes[0]] || {}).image;
        return { name: g.name, imageUrl: cover || "", link: "/g/" + encodeURIComponent(g.key) };
    }

    // Legge una cartella e ricorda lista dei video, titolo e (se chiesta) copertina.
    // Se Gofile non risponde non salva niente: si riprova la volta dopo.
    async readOne(code, withCover) {
        if (this.isBunkr(code)) return this.readBunkr(code);
        var data;
        try { data = await this.readFolder(code, withCover ? this.coverN() : 0); } catch (e) { return null; }
        var rows = data.rows || [];
        var notFound = !rows.length && /not found/i.test(String(data.text || ""));
        if (!rows.length && !notFound) return data;
        var title = notFound ? "Gofile " + code + " (non trovata)" : String(data.title || "").replace(/\s*·\s*Gofile\s*$/i, "").trim() || code;
        var files = rows.filter(function (r) { return r.type === "file" && VIDEO_EXT.test(r.name || ""); })
            .map(function (r) { return { n: r.name, img: r.img }; });
        var fm = this.filesMap();
        fm[code] = { title: title, files: files, folders: rows.filter(function (r) { return r.type === "folder"; }).length, at: Date.now() };
        this.writeStore(STORE_FILES, JSON.stringify(fm));
        var map = this.infoMap();
        var old = map[code] || {};
        var thumb = files.length && files[0].img ? files[0].img : "";
        map[code] = { name: title, image: data.cover || old.image || thumb, cv: data.cover ? this.coverMark() : (withCover ? this.coverMark() : old.cv || "") };
        this.writeStore(STORE_INFO, JSON.stringify(map));
        return data;
    }

    decodeHtml(t) {
        return String(t || "").replace(/&quot;/g, '"').replace(/&#0*39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
    }

    // Bunkr non ha bisogno della WebView: la pagina dell'album ha già nome,
    // miniatura e link /f/<id> di ogni file; quella di un file ha la miniatura.
    async readBunkr(code) {
        var b = this.bunkrParts(code);
        var res;
        try { res = await this.client.get(this.linkUrl(code), { "User-Agent": UA }); } catch (e) { return null; }
        var html = String((res && res.body) || "");
        var status = res ? res.statusCode : 0;
        if (status >= 500 || (!html && status !== 404)) return null;
        var files = [];
        var title = this.decodeHtml((html.match(/<title>([^<]*)<\/title>/i) || [])[1] || "").replace(/\s*\|\s*Bunkr\s*$/i, "");
        if (b.kind === "a") {
            var parts = html.split(/class="relative group\/item theItem"/).slice(1);
            for (var i = 0; i < parts.length; i++) {
                var p = parts[i];
                var slug = (p.match(/href="\/f\/([A-Za-z0-9]+)"/) || [])[1];
                var name = this.decodeHtml((p.match(/class="truncate theName[^"]*">([^<]+)</) || [])[1] || (p.match(/title="([^"]+)"/) || [])[1] || "");
                if (!slug || !VIDEO_EXT.test(name)) continue;
                files.push({ n: name, img: (p.match(/class="grid-images_box-img"[^>]*?src="([^"]+)"/) || p.match(/src="([^"]+)"[^>]*class="grid-images_box-img"/) || [])[1] || "", bf: slug, bh: b.host });
            }
        } else {
            var og = (html.match(/property="og:image" content="([^"]+)"/) || [])[1] || "";
            if (VIDEO_EXT.test(title)) {
                files.push({ n: title, img: og, bf: b.id, bh: b.host });
                title = this.episodeName(title);
            }
        }
        var notFound = status === 404 || (!files.length && !/theItem|og:type" content="video/.test(html));
        if (notFound) title = this.shortLink(code) + " (non trovata)";
        var fm = this.filesMap();
        fm[code] = { title: title || this.shortLink(code), files: files, folders: 0, at: Date.now() };
        this.writeStore(STORE_FILES, JSON.stringify(fm));
        var map = this.infoMap();
        map[code] = { name: fm[code].title, image: files.length ? files[0].img : "", cv: this.coverMark() };
        this.writeStore(STORE_INFO, JSON.stringify(map));
        return { rows: files, text: notFound ? "not found" : "" };
    }

    // Tre cartelle alla volta.
    async readMany(codes, withCover) {
        for (var k = 0; k < codes.length; k += 3) {
            await Promise.all(codes.slice(k, k + 3).map(function (c) { return this.readOne(c, withCover); }.bind(this)));
        }
    }

    // Copertina di una raccolta: miniature prese sparse tra i video di tutti i suoi link.
    async groupCover(g) {
        var n = this.coverN();
        var mark = this.coverMark() + ":" + g.codes.join(",");
        var info = this.infoMap();
        if (info["g:" + g.key] && info["g:" + g.key].cv === mark) return;
        var fm = this.filesMap(), thumbs = [];
        for (var i = 0; i < g.codes.length; i++) {
            var f = fm[g.codes[i]];
            if (f) f.files.forEach(function (x) { if (x.img) thumbs.push(x.img); });
        }
        if (!thumbs.length) return;
        // Le miniature di Bunkr non permettono di essere rielaborate (niente CORS):
        // il collage usa quelle di Gofile, altrimenti resta la prima miniatura.
        var go = thumbs.filter(function (t) { return /\.gofile\.io\//.test(t); });
        if (!go.length) {
            info["g:" + g.key] = { image: thumbs[0], cv: mark };
            this.writeStore(STORE_INFO, JSON.stringify(info));
            return;
        }
        thumbs = go;
        var picks = [];
        for (var q = 0; q < n && q < thumbs.length; q++) picks.push(thumbs[n > 1 ? Math.round(q * (thumbs.length - 1) / (n - 1)) : 0]);
        var cover = "";
        try { cover = await evaluateJavascriptViaWebview("https://gofile.io/robots.txt", {}, [coverScript(picks, n)], 15); } catch (e) {}
        info = this.infoMap();
        info["g:" + g.key] = { image: /^data:image/.test(cover || "") ? cover : picks[0], cv: mark };
        this.writeStore(STORE_INFO, JSON.stringify(info));
    }

    // Popolari: legge una volta sola i link nuovi (lista dei video e copertina insieme),
    // così poi le schede e le raccolte si aprono subito.
    async getPopular(page) {
        if (page > 1) return { list: [], hasNextPage: false };
        var groups = this.groups();
        var known = this.infoMap(), fm = this.filesMap(), mark = this.coverMark();
        var codes = [];
        groups.forEach(function (g) { codes = codes.concat(g.codes); });
        var missing = codes.filter(function (c) {
            var k = known[c];
            if (k && /non trovata/.test(k.name || "")) return false;
            return !fm[c] || !k || (k.image && k.cv !== mark);
        });
        var self0 = this;
        if (typeof evaluateJavascriptViaWebview !== "function") missing = missing.filter(function (c) { return self0.isBunkr(c); });
        if (missing.length) await this.readMany(missing, true);
        for (var i = 0; i < groups.length; i++) {
            if (groups[i].key.charAt(0) !== "#" && groups[i].codes.length > 1) await this.groupCover(groups[i]);
        }
        var self = this;
        return { list: groups.map(function (g) { return self.groupCard(g); }), hasNextPage: false };
    }

    async getLatestUpdates(page) {
        return this.getPopular(page);
    }

    // Nella ricerca si può incollare un link (o il codice) per aprirlo una volta;
    // altrimenti filtra le schede salvate per nome.
    async search(query, page, filters) {
        if (page > 1) return { list: [], hasNextPage: false };
        var q = String(query || "").trim();
        var code = /gofile\.io|bunkr+\./i.test(q) ? this.linkCode(q) : "";
        if (code) return { list: [this.card(code)], hasNextPage: false };
        var all = (await this.getPopular(1)).list;
        if (!q) return { list: all, hasNextPage: false };
        var low = q.toLowerCase();
        var list = all.filter(function (c) { return c.name.toLowerCase().indexOf(low) !== -1 || c.link.toLowerCase().indexOf(low) !== -1; });
        if (!list.length && this.codeOf(q)) list = [this.card(this.codeOf(q))];
        return { list: list, hasNextPage: false };
    }

    async readFolder(code, coverN) {
        if (typeof evaluateJavascriptViaWebview !== "function") {
            throw new Error("Gofile: serve Mangayomi 0.9.96 o successivo (WebView per le estensioni).");
        }
        var raw = await evaluateJavascriptViaWebview("https://gofile.io/d/" + code, {}, [listScript(coverN)], 40);
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
        var g = null, codes;
        var gm = raw.match(/\/g\/([^?#]+)/);
        if (gm) {
            g = this.groupOf(decodeURIComponent(gm[1]));
            if (!g) throw new Error("Gofile: questa raccolta non c'è più tra i link salvati.");
            codes = g.codes;
        } else {
            var bk = raw.match(/\/bk\/(bk~[^?#\/]+)/);
            var code = bk ? decodeURIComponent(bk[1]) : (this.codeOf(raw) || this.codeOf(raw.replace(/^\/d\//, "")));
            if (!code) throw new Error("Gofile: link non valido.");
            codes = [code];
        }
        this._seen = this._seen || {};
        var again = this._seen[raw] && Date.now() - this._seen[raw] < 120000;
        this._seen[raw] = Date.now();
        var fm = this.filesMap(), info = this.infoMap();
        var need = codes.filter(function (c) { return again || !fm[c] || Date.now() - (fm[c].at || 0) > FILES_TTL; });
        var problem = "";
        if (need.length) {
            for (var k = 0; k < need.length; k += 3) {
                var got = await Promise.all(need.slice(k, k + 3).map(function (c) { return this.readOne(c, !info[c] || !info[c].image); }.bind(this)));
                got.forEach(function (d) {
                    if (!d || (d.rows || []).length) return;
                    var why = String(d.text || "");
                    if (/unreachable/i.test(why)) problem = "Gofile non risponde in questo momento: riprova tra qualche minuto (trascina in basso la scheda).";
                    else if (/password/i.test(why)) problem = "Una cartella è protetta da password: aprila nel browser.";
                });
            }
            fm = this.filesMap();
            info = this.infoMap();
        }

        var chapters = [], videos = 0, folders = 0, missingThumb = 0, gone = 0;
        for (var i = 0; i < codes.length; i++) {
            var f = fm[codes[i]];
            if (!f) continue;
            if (/non trovata/.test(f.title || "")) gone++;
            folders += f.folders || 0;
            for (var j = 0; j < f.files.length; j++) {
                var v = f.files[j];
                videos++;
                if (v.bf) {
                    chapters.push({ name: "Episodio " + (chapters.length + 1) + " - " + this.episodeName(v.n), url: "bunkr:https://" + v.bh + "/f/" + v.bf, thumbnailUrl: v.img });
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
        var title = g ? g.name : (this.customName(codes[0]) || (single && single.title) || codes[0]);
        var image = g && codes.length > 1 && info["g:" + g.key] ? info["g:" + g.key].image : (info[codes[0]] || {}).image || "";
        var lines = [];
        lines.push(codes.length > 1 ? codes.length + " link · " + videos + " video" : videos + " video");
        if (missingThumb) lines.push(missingThumb + " video senza anteprima non si possono aprire da qui.");
        if (folders) lines.push(folders + " sottocartelle: aggiungile come link a parte.");
        if (gone) lines.push(codes.length > 1 ? gone + " link non esistono più su Gofile." : "Questa cartella non esiste più su Gofile.");
        if (problem && !videos) lines = [problem];
        else if (problem) lines.push(problem);
        if (!videos && !problem && !gone && !Object.keys(fm).some(function (c) { return codes.indexOf(c) !== -1; })) {
            lines = ["Nessun file trovato. La cartella può essere vuota o scaduta."];
        }

        return {
            name: title,
            link: g ? "/g/" + encodeURIComponent(g.key) : (this.isBunkr(codes[0]) ? "/bk/" : "/d/") + codes[0],
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
        var res = await this.client.get(page, { "User-Agent": UA });
        var html = String((res && res.body) || "");
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

    async getVideoList(url) {
        var file = String(url);
        if (file.indexOf("bunkr:") === 0) return this.bunkrVideo(file.slice(6));
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
                summary: "Scrivi un link Gofile (https://gofile.io/d/…) o Bunkr (album /a/… o video /f/…), e se vuoi il nome dopo una barra: link | nome. Ogni link diventa una scheda in Popolari.",
                value: "",
                dialogTitle: "Salva un link",
                dialogMessage: "Link Gofile o Bunkr, poi una barra verticale e il nome della scheda (facoltativo). Es. https://gofile.io/d/XXXX | I miei video",
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
