const mangayomiSources = [
    {
        "name": "Gofile",
        "lang": "all",
        "baseUrl": "https://gofile.io",
        "apiUrl": "",
        "iconUrl": "https://www.google.com/s2/favicons?sz=64&domain=gofile.io",
        "typeSource": "single",
        "isNsfw": false,
        "itemType": 1,
        "version": "1.0.0",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/all/gofile.js",
    },
];

const PREF_LINKS = "gofile_links";
const STORE_INFO = "gofile_folder_info";
const STORE_TOKEN = "gofile_token";
const VIDEO_EXT = /\.(mp4|mkv|webm|mov|m4v|avi|ts|m3u8)$/i;

// La lista di una cartella la disegna il JavaScript di Gofile: la pagina si apre
// nella WebView nascosta di Mangayomi, come nel browser, e lo script legge le righe
// quando smettono di aumentare. Il link del file è la cartella della miniatura più
// il nome del file; per scaricarlo serve il cookie accountToken della stessa visita.
const LIST_SCRIPT = `(function () {
    var last = -1, same = 0, ticks = 0;
    var timer = setInterval(function () {
        ticks++;
        var rows = document.querySelectorAll('.fm-row[data-type]');
        if (rows.length && rows.length === last) same++; else same = 0;
        last = rows.length;
        if (!(same >= 3 || ticks > 50)) return;
        clearInterval(timer);
        var out = { title: document.title, cookie: document.cookie, text: document.body ? document.body.innerText.slice(0, 300) : '', rows: [] };
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i], p = r.querySelector('p'), img = r.querySelector('img');
            out.rows.push({ id: r.getAttribute('data-id'), type: r.getAttribute('data-type'), name: p ? p.textContent.trim() : '', img: img ? img.src : '' });
        }
        window.flutter_inappwebview.callHandler('setResponse', JSON.stringify(out));
    }, 500);
})();`;

class DefaultExtension extends MProvider {
    constructor() {
        super();
        this.client = new Client();
    }

    getPreference(key) {
        return new SharedPreferences().get(key);
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

    savedCodes() {
        var raw = String(this.getPreference(PREF_LINKS) || "");
        var out = [];
        var parts = raw.split(/[\s,]+/);
        for (var i = 0; i < parts.length; i++) {
            var c = this.codeOf(parts[i]);
            if (c && out.indexOf(c) === -1) out.push(c);
        }
        return out;
    }

    infoMap() {
        try { return JSON.parse(this.readStore(STORE_INFO) || "{}") || {}; } catch (e) { return {}; }
    }

    card(code) {
        var info = this.infoMap()[code] || {};
        return { name: info.name || "Gofile " + code, imageUrl: info.image || "", link: "/d/" + code };
    }

    async getPopular(page) {
        if (page > 1) return { list: [], hasNextPage: false };
        var codes = this.savedCodes();
        var list = [];
        for (var i = 0; i < codes.length; i++) list.push(this.card(codes[i]));
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
        var raw = await evaluateJavascriptViaWebview("https://gofile.io/d/" + code, {}, [LIST_SCRIPT], 40);
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
        var title = String(data.title || "").replace(/\s*·\s*Gofile\s*$/i, "").trim() || code;

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

        var image = files.length && files[0].img ? files[0].img : "";
        var map = this.infoMap();
        map[code] = { name: title, image: image };
        this.writeStore(STORE_INFO, JSON.stringify(map));

        var lines = [files.length + " video"];
        var skipped = files.length - chapters.length;
        if (skipped > 0) lines.push(skipped + " video senza anteprima non si possono aprire da qui.");
        if (folders) lines.push(folders + " sottocartelle: aggiungile come link a parte.");
        if (!(data.rows || []).length) lines = ["Nessun file trovato. La cartella può essere vuota, scaduta o protetta da password.\n\n" + String(data.text || "").trim()];

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
            { type_name: "HeaderFilter", name: "Incolla nella ricerca un link Gofile (https://gofile.io/d/…) per aprirlo. Per tenerlo in elenco, aggiungilo nelle impostazioni dell'estensione." },
        ];
    }

    getSourcePreferences() {
        return [
            {
                key: PREF_LINKS,
                editTextPreference: {
                    title: "Link Gofile",
                    summary: "Un link per riga (https://gofile.io/d/…). Ogni link è una scheda, i video della cartella sono gli episodi.",
                    value: "",
                    dialogTitle: "Link Gofile",
                    dialogMessage: "Un link per riga, o separati da spazi",
                },
            },
        ];
    }
}
