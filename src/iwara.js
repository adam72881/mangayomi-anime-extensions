const mangayomiSources = [
    {
        "name": "Iwara",
        "lang": "it",
        "baseUrl": "https://www.iwara.tv",
        "apiUrl": "https://api.iwara.tv",
        "iconUrl": "https://www.google.com/s2/favicons?sz=64&domain=iwara.tv",
        "typeSource": "single",
        "isNsfw": true,
        "itemType": 1,
        "version": "1.1.0",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/iwara.js",
    },
];

const API = "https://api.iwara.tv";
const FILES = "https://files.iwara.tv";
// Firma dei video: lo stesso «salt» del frontend di iwara (confermato anche da yt-dlp).
const SALT = "mSvL05GfEmeEmsEYfGCnVpEjYgTJraJN";
// iwara dietro Cloudflare accetta un User-Agent da browser senza challenge; con l'UA
// di default dà 403. I CDN dei file invece rispondono anche senza.
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const PER = 32;

// SHA-1 (UTF-8 -> hex). Serve per l'header X-Version che sblocca le qualità alte.
function sha1(str) {
    function rotl(n, s) { return (n << s) | (n >>> (32 - s)); }
    function hx(n) { var s = "", v; for (var i = 7; i >= 0; i--) { v = (n >>> (i * 4)) & 0x0f; s += v.toString(16); } return s; }
    var b = [];
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (c < 0x80) b.push(c);
        else if (c < 0x800) b.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
        else if (c < 0xd800 || c >= 0xe000) b.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
        else { i++; var c2 = str.charCodeAt(i); var cp = 0x10000 + (((c & 0x3ff) << 10) | (c2 & 0x3ff)); b.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3f), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f)); }
    }
    var ml = b.length * 8;
    b.push(0x80);
    while (b.length % 64 !== 56) b.push(0);
    for (var i = 7; i >= 0; i--) b.push((ml / Math.pow(2, i * 8)) & 0xff);
    var h0 = 0x67452301, h1 = 0xEFCDAB89, h2 = 0x98BADCFE, h3 = 0x10325476, h4 = 0xC3D2E1F0;
    for (var j = 0; j < b.length; j += 64) {
        var w = new Array(80);
        for (var i = 0; i < 16; i++) w[i] = (b[j + i * 4] << 24) | (b[j + i * 4 + 1] << 16) | (b[j + i * 4 + 2] << 8) | (b[j + i * 4 + 3]);
        for (var i = 16; i < 80; i++) w[i] = rotl(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
        var a = h0, bb = h1, c = h2, d = h3, e = h4;
        for (var i = 0; i < 80; i++) {
            var f, k;
            if (i < 20) { f = (bb & c) | (~bb & d); k = 0x5A827999; }
            else if (i < 40) { f = bb ^ c ^ d; k = 0x6ED9EBA1; }
            else if (i < 60) { f = (bb & c) | (bb & d) | (c & d); k = 0x8F1BBCDC; }
            else { f = bb ^ c ^ d; k = 0xCA62C1D6; }
            var t = (rotl(a, 5) + f + e + k + w[i]) | 0;
            e = d; d = c; c = rotl(bb, 30); bb = a; a = t;
        }
        h0 = (h0 + a) | 0; h1 = (h1 + bb) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0; h4 = (h4 + e) | 0;
    }
    return hx(h0) + hx(h1) + hx(h2) + hx(h3) + hx(h4);
}

class DefaultExtension extends MProvider {
    constructor() {
        super();
        this.client = new Client();
    }

    hdr(extra) {
        var h = { "User-Agent": UA, "Accept": "application/json" };
        if (extra) for (var k in extra) h[k] = extra[k];
        return h;
    }

    async getJson(path) {
        var res = await this.client.get(API + path, this.hdr());
        if (!res || res.statusCode === 403) throw new Error("Iwara non risponde (403): forse è bloccato dalla rete.");
        if (res.statusCode !== 200) throw new Error("Iwara non risponde (" + res.statusCode + ").");
        try { return JSON.parse(String(res.body || "")); } catch (e) { throw new Error("Iwara ha dato una risposta non valida."); }
    }

    // Copertina: miniatura personalizzata se c'è, altrimenti il frame scelto dal video.
    thumbOf(v) {
        var ct = v && v.customThumbnail;
        if (ct && ct.id && ct.name) return FILES + "/image/large/" + ct.id + "/" + ct.name;
        var f = v && v.file;
        if (f && f.id) {
            var n = typeof v.thumbnail === "number" ? v.thumbnail : 0;
            var nn = (n < 10 ? "0" : "") + n;
            return FILES + "/image/thumbnail/" + f.id + "/thumbnail-" + nn + ".jpg";
        }
        return "";
    }

    card(v) {
        return { name: String(v.title || v.slug || v.id), imageUrl: this.thumbOf(v), link: "/video/" + v.id };
    }

    mapList(data) {
        var self = this;
        return ((data && data.results) || [])
            .filter(function (v) { return v && v.id && !v.private && v.file && v.file.id; })
            .map(function (v) { return self.card(v); });
    }

    // /videos: count = (page+1)*limit+1 finché c'è una pagina dopo.
    // /search: count = totale vero. In entrambi i casi vale (page+1)*limit < count.
    hasNext(data, page0) {
        var total = (data && typeof data.count === "number") ? data.count : 0;
        return (page0 + 1) * PER < total;
    }

    // tags: id di una categoria/tag (opzionale). La virgola sarebbe un AND, qui
    // ne passiamo una sola. La ricerca per parola non accetta tags, solo lo sfoglio.
    async browse(sort, rating, tags, page) {
        var p = (page || 1) - 1;
        var url = "/videos?sort=" + encodeURIComponent(sort) + "&rating=" + encodeURIComponent(rating) + "&page=" + p + "&limit=" + PER;
        if (tags) url += "&tags=" + encodeURIComponent(tags);
        var data = await this.getJson(url);
        return { list: this.mapList(data), hasNextPage: this.hasNext(data, p) };
    }

    async getPopular(page) {
        return this.browse("trending", "all", "", page);
    }

    async getLatestUpdates(page) {
        return this.browse("date", "all", "", page);
    }

    async search(query, page, filters) {
        var q = String(query == null ? "" : query).trim();
        var p = (page || 1) - 1;
        if (!q) {
            return this.browse(this.sortOf(filters), this.ratingOf(filters), this.categoryOf(filters), page);
        }
        // La ricerca per parola vuole type=videos (plurale) e non accetta sort/rating.
        var data = await this.getJson("/search?type=videos&query=" + encodeURIComponent(q) + "&page=" + p + "&limit=" + PER);
        return { list: this.mapList(data), hasNextPage: this.hasNext(data, p) };
    }

    async getDetail(url) {
        var id = String(url).replace(/^\/video\//, "").split(/[?#]/)[0];
        var v = await this.getJson("/video/" + encodeURIComponent(id));
        if (v && /privateVideo/.test(String(v.message || ""))) throw new Error("Video privato: serve un account Iwara per vederlo.");
        if (v && /notFound/.test(String(v.message || ""))) throw new Error("Questo video non esiste più su Iwara.");
        var title = String(v.title || v.slug || id);
        var author = (v.user && (v.user.name || v.user.username)) || "";
        var genre = [];
        if (author) genre.push("@" + author);
        ((v.tags || [])).forEach(function (t) { if (t && t.id && genre.length < 8) genre.push(t.id); });
        var lines = [];
        if (typeof v.numViews === "number") lines.push(v.numViews + " visualizzazioni");
        if (v.rating === "ecchi") lines.push("+18");
        var body = String(v.body || "").trim();
        var description = (lines.join(" · ") + (body ? "\n\n" + body : "")).trim() || "Nessuna descrizione.";
        var chapter = { name: "Guarda", url: "/video/" + id, thumbnailUrl: this.thumbOf(v) };
        var when = Date.parse(v.createdAt || "");
        if (when) chapter.dateUpload = String(when);
        return {
            name: title,
            link: "/video/" + id,
            imageUrl: this.thumbOf(v),
            author: author,
            description: description,
            genre: genre,
            status: 1,
            chapters: [chapter],
        };
    }

    async getVideoList(url) {
        var id = String(url).replace(/^\/video\//, "").split(/[?#]/)[0];
        var v = await this.getJson("/video/" + encodeURIComponent(id));
        if (v && /privateVideo/.test(String(v.message || ""))) throw new Error("Video privato: serve un account Iwara.");
        var fileUrl = v && v.fileUrl;
        if (!fileUrl) {
            if (v && v.embedUrl) throw new Error("Questo video è ospitato su un altro sito, non apribile qui.");
            throw new Error("Iwara: questo video non è riproducibile.");
        }
        var path = String(fileUrl).replace(/^https?:\/\/[^/]+/, "").split("?")[0];
        var lastSeg = path.split("/").filter(function (s) { return s; }).pop() || "";
        var expires = (String(fileUrl).match(/[?&]expires=([^&]+)/) || [])[1] || "";
        var xver = sha1(lastSeg + "_" + expires + "_" + SALT);
        var fres = await this.client.get(fileUrl, this.hdr({ "X-Version": xver }));
        if (!fres || fres.statusCode !== 200) throw new Error("Iwara: impossibile ottenere i formati del video.");
        var arr;
        try { arr = JSON.parse(String(fres.body || "")); } catch (e) { arr = []; }
        var rank = { "Source": 4, "540": 3, "360": 2, "preview": 0 };
        var out = [];
        (arr || []).forEach(function (f) {
            if (!f || f.name === "preview") return; // «preview» è una clip breve, non il video intero
            var src = (f.src && (f.src.view || f.src.download)) || "";
            if (!src) return;
            if (src.indexOf("//") === 0) src = "https:" + src;
            out.push({ url: src, originalUrl: src, quality: "Iwara · " + (f.name || "video"), headers: { "User-Agent": UA }, _r: rank[f.name] || 1 });
        });
        out.sort(function (a, b) { return b._r - a._r; });
        out.forEach(function (x) { delete x._r; });
        if (!out.length) throw new Error("Iwara: nessun formato disponibile per questo video.");
        return out;
    }

    selectVal(filters, name, fallback) {
        try {
            for (var i = 0; i < (filters || []).length; i++) {
                var f = filters[i];
                if (f && f.type_name === "SelectFilter" && f.name === name && f.values && typeof f.state === "number") {
                    var v = f.values[f.state];
                    return (v && v.value) || fallback;
                }
            }
        } catch (e) {}
        return fallback;
    }

    sortOf(filters) {
        var v = this.selectVal(filters, "Ordine", "date");
        return (v === "trending" || v === "popularity" || v === "views" || v === "likes") ? v : "date";
    }

    ratingOf(filters) {
        var v = this.selectVal(filters, "Contenuti", "all");
        return (v === "ecchi" || v === "general") ? v : "all";
    }

    categoryOf(filters) {
        return this.selectVal(filters, "Categoria", "") || "";
    }

    getFilterList() {
        return [
            {
                type_name: "SelectFilter",
                name: "Ordine",
                state: 0,
                values: [
                    { type_name: "SelectOption", name: "Novità", value: "date" },
                    { type_name: "SelectOption", name: "Tendenza", value: "trending" },
                    { type_name: "SelectOption", name: "Popolari", value: "popularity" },
                    { type_name: "SelectOption", name: "Più visti", value: "views" },
                    { type_name: "SelectOption", name: "Più piaciuti", value: "likes" },
                ],
            },
            {
                type_name: "SelectFilter",
                name: "Contenuti",
                state: 0,
                values: [
                    { type_name: "SelectOption", name: "Tutti", value: "all" },
                    { type_name: "SelectOption", name: "Solo +18 (ecchi)", value: "ecchi" },
                    { type_name: "SelectOption", name: "Solo soft (general)", value: "general" },
                ],
            },
            {
                type_name: "SelectFilter",
                name: "Categoria",
                state: 0,
                values: [
                    { type_name: "SelectOption", name: "Tutte", value: "" },
                    { type_name: "SelectOption", name: "Cosplay", value: "cosplay" },
                    { type_name: "SelectOption", name: "MMD", value: "mikumikudance" },
                    { type_name: "SelectOption", name: "Koikatsu", value: "koikatsu" },
                    { type_name: "SelectOption", name: "Honey Select", value: "honey_select" },
                    { type_name: "SelectOption", name: "Virt-a-Mate", value: "virt_a_mate" },
                    { type_name: "SelectOption", name: "Blender", value: "blender" },
                    { type_name: "SelectOption", name: "SFM (Source Filmmaker)", value: "sfm" },
                    { type_name: "SelectOption", name: "AI generato", value: "ai_generated" },
                    { type_name: "SelectOption", name: "HMV", value: "hmv" },
                ],
            },
            { type_name: "HeaderFilter", name: "Senza testo vedi l'elenco secondo «Ordine», «Contenuti» e «Categoria». Con una parola cerchi (la ricerca ignora i filtri e mostra tutti i tipi)." },
        ];
    }

    getSourcePreferences() {
        return [];
    }
}
