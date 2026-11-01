const mangayomiSources = [
    {
        "name": "HentaiWorld",
        "lang": "it",
        "baseUrl": "https://www.hentaiworld.me",
        "apiUrl": "",
        "iconUrl": "https://www.google.com/s2/favicons?sz=64&domain=hentaiworld.me",
        "typeSource": "single",
        "isNsfw": true,
        "itemType": 1,
        "version": "2.1.0",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/hentaiworld.js",
    },
];

// HentaiWorld italiano (hentaiworld.me): API /api/episodes con video_url mp4
// diretti. ITA ed ENG sono serie separate (slug con -sub-eng / senza suffisso).
const DEFAULT_BASE = "https://www.hentaiworld.me";
const PREF_BASE = "hentaiworld_me_base_url";
const PER_PAGE = 20;

// slug usati da /archive?genre=<slug> (59 generi, pagina archivio live).
const GENRES = [
    ["3d", "3D"], ["ahegao", "Ahegao"], ["anal", "Anal"], ["bdsm", "BDSM"],
    ["big-boobs", "Big Boobs"], ["blow-job", "Blow Job"], ["bondage", "Bondage"],
    ["boob-job", "Boob Job"], ["censored", "Censored"], ["comedy", "Comedy"],
    ["cosplay", "Cosplay"], ["creampie", "Creampie"], ["dark-skin", "Dark Skin"],
    ["facial", "Facial"], ["fantasy", "Fantasy"], ["filmed", "Filmed"],
    ["foot-job", "Foot Job"], ["futanari", "Futanari"], ["gangbang", "Gangbang"],
    ["glasses", "Glasses"], ["hand-job", "Hand Job"], ["harem", "Harem"],
    ["horror", "Horror"], ["incest", "Incest"], ["inflation", "Inflation"],
    ["lactation", "Lactation"], ["maid", "Maid"], ["masturbation", "Masturbation"],
    ["milf", "Milf"], ["mind-break", "Mind Break"], ["mind-control", "Mind Control"],
    ["monster", "Monster"], ["nekomimi", "Nekomimi"], ["ntr", "NTR"],
    ["nurse", "Nurse"], ["orgy", "Orgy"], ["plot", "Plot"], ["pov", "POV"],
    ["pregnant", "Pregnant"], ["public-sex", "Public Sex"], ["rimjob", "Rimjob"],
    ["scat", "Scat"], ["school-girl", "School Girl"], ["softcore", "Softcore"],
    ["swimsuit", "Swimsuit"], ["teacher", "Teacher"], ["tentacle", "Tentacle"],
    ["threesome", "Threesome"], ["toys", "Toys"], ["trap", "Trap"],
    ["tsundere", "Tsundere"], ["ugly-bastard", "Ugly Bastard"],
    ["uncensored", "Uncensored"], ["vanilla", "Vanilla"], ["virgin", "Virgin"],
    ["watersports", "Watersports"], ["x-ray", "X-Ray"], ["yaoi", "Yaoi"],
    ["yuri", "Yuri"],
];

// name="sort" sull'archivio. Non esiste la voce «Più recenti»:
// le serie più recenti sono «Ultime aggiunte» (sort=latest).
const SORTS = [
    ["latest", "Ultime aggiunte"],
    ["a-z", "Lista A-Z"],
    ["z-a", "Lista Z-A"],
    ["views", "Più visti"],
    ["views-low", "Meno visti"],
    ["rating-high", "Voto maggiore"],
    ["rating-low", "Voto minore"],
];

const STATUSES = [
    ["In corso", "In corso"],
    ["Finito", "Finito"],
    ["Non rilasciato", "Non rilasciato"],
    ["Droppato", "Droppato"],
];

const UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function langOf(slug) {
    slug = String(slug || "");
    if (slug.indexOf("-sub-eng") !== -1) return "eng";
    if (slug.indexOf("-dub-ita") !== -1) return "dubita";
    return "ita"; // senza suffisso (o -sub-ita) = italiano
}

class DefaultExtension extends MProvider {
    constructor() {
        super();
        this.client = new Client();
    }

    getPreference(key) {
        return new SharedPreferences().get(key);
    }

    getBaseUrl() {
        var v = this.getPreference(PREF_BASE);
        if (!v || !v.length || v.indexOf("hentaiworld.to") !== -1) v = DEFAULT_BASE;
        return v.replace(/\/+$/, "");
    }

    headers(referer) {
        return {
            "User-Agent": UA,
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
            "X-Requested-With": "XMLHttpRequest",
            "Referer": referer || this.getBaseUrl() + "/",
        };
    }

    filterValue(filters, name) {
        if (!filters || !filters.length) return "";
        for (var i = 0; i < filters.length; i++) {
            var f = filters[i];
            if (!f || f.type_name !== "SelectFilter" || f.name !== name) continue;
            var opt = f.values && f.values[f.state];
            return opt && opt.value != null ? String(opt.value) : "";
        }
        return "";
    }

    slugOf(url) {
        var raw = String(url).split("?")[0].split("#")[0];
        try { raw = decodeURIComponent(raw); } catch (e) {}
        var parts = raw.replace(/\/+$/, "").split("/").filter(function (s) {
            return s.length > 0;
        });
        return parts.length ? parts[parts.length - 1] : "";
    }

    // Schede archivio: <h3 class="line-clamp-2"> + <a href="/hentai/<slug>">
    parseArchive(doc) {
        var list = [];
        var seen = {};
        for (var article of doc.select("article")) {
            var h3 = article.selectFirst("h3.line-clamp-2");
            var a = article.selectFirst('a[href*="/hentai/"]');
            if (!h3 || !a) continue;
            var href = a.getHref || a.attr("href") || "";
            var slug = this.slugOf(href);
            if (!slug || seen[slug]) continue;
            var name = h3.text.trim();
            if (!name) continue;
            seen[slug] = true;
            var img = article.selectFirst("img");
            var imageUrl = img ? img.attr("src") || img.attr("data-src") || "" : "";
            list.push({ name: name, imageUrl: imageUrl, link: "/hentai/" + slug });
        }
        return { list: list, hasNextPage: list.length >= PER_PAGE };
    }

    async archive(params, page) {
        var q = params && params.length ? params + "&page=" + page : "page=" + page;
        return this.parseArchive(await this.doc("/archive?" + q));
    }

    async doc(path) {
        var url = path.indexOf("http") === 0 ? path : this.getBaseUrl() + path;
        var h = this.headers(this.getBaseUrl() + "/");
        h["Accept"] = "text/html,application/xhtml+xml";
        var res = await this.client.get(url, h);
        return new Document(res.body);
    }

    async getPopular(page) {
        return this.archive("sort=views", page);
    }

    // Il sito non ha «Più recenti»: l'ordine recente è sort=latest (Ultime aggiunte).
    async getLatestUpdates(page) {
        return this.archive("sort=latest", page);
    }

    async search(query, page, filters) {
        var genre = this.filterValue(filters, "Genere");
        var sort = this.filterValue(filters, "Ordine");
        var status = this.filterValue(filters, "Stato");
        var lang = this.filterValue(filters, "Lingua");
        if ((!filters || !filters.length) && !(query && query.length))
            return this.getPopular(page);

        var parts = [];
        if (query && query.length) parts.push("search=" + encodeURIComponent(query));
        if (genre) parts.push("genre=" + encodeURIComponent(genre));
        if (sort) parts.push("sort=" + encodeURIComponent(sort));
        if (status) parts.push("status=" + encodeURIComponent(status));
        if (lang) parts.push("language=" + encodeURIComponent(lang));
        return this.archive(parts.join("&"), page);
    }

    async getDetail(url) {
        var slug = this.slugOf(url);
        var doc = await this.doc("/hentai/" + slug);
        var article = doc.selectFirst("article");
        var header = article ? article.selectFirst("header") : null;

        // Trama della serie: div.entry > p. I p.line-clamp-6 della pagina
        // sono le schede «serie simili», non la sinossi.
        var description = "";
        var entry = article ? article.selectFirst("div.entry") : doc.selectFirst("div.entry");
        var plot = entry ? entry.selectFirst("p") : null;
        if (plot) description = plot.text.trim();
        else if (entry) description = entry.text.trim();

        var genre = [];
        var genreRoot = header || article || doc;
        for (var g of genreRoot.select('a[href*="genre="]')) {
            var t = g.text.trim();
            if (t && genre.indexOf(t) === -1) genre.push(t);
        }

        var status = 5;
        var spans = header ? header.select("span") : [];
        for (var i = 0; i < spans.length; i++) {
            var label = spans[i].text.trim();
            if (label === "In corso") status = 0;
            else if (label === "Finito" || label === "Terminato") status = 1;
            else if (label === "Droppato") status = 3;
        }

        var chapters = [];
        var seen = {};
        var eps = doc.select("#episodes-grid article.episode-item");
        if (!eps.length) eps = doc.select("article.episode-item");
        for (var k = 0; k < eps.length; k++) {
            var card = eps[k];
            var a = card.selectFirst('a[href*="/watch/"]');
            if (!a) continue;
            var href = a.getHref || a.attr("href") || "";
            if (!href || seen[href]) continue;
            seen[href] = true;
            var num = card.attr("data-episode") || String(chapters.length + 1);
            chapters.push({ name: "Episodio " + num, url: href, _n: parseInt(num, 10) || 0 });
        }
        chapters.sort(function (a, b) { return b._n - a._n; });
        for (var c = 0; c < chapters.length; c++) delete chapters[c]._n;

        var langName = { eng: "SUB ENG", dubita: "DUB ITA", ita: "SUB ITA" }[langOf(slug)] || "";
        if (langName) {
            description = description
                ? description + "\n\nLingua: " + langName
                : "Lingua: " + langName;
        }

        return {
            link: "/hentai/" + slug,
            description: description || "Nessuna descrizione disponibile.",
            genre: genre,
            status: status,
            chapters: chapters,
        };
    }

    async getVideoList(url) {
        var raw = String(url);
        try {
            raw = decodeURIComponent(raw);
        } catch (e) {}
        // Se Mangayomi ha anteposto il baseUrl a un URL assoluto, tieni l'ultimo http.
        var lastHttp = raw.lastIndexOf("http");
        if (lastHttp > 0) raw = raw.slice(lastHttp);

        // Caso 1: l'URL è già (o contiene) il mp4 diretto.
        var m = raw.match(/https?:\/\/[^\s'"]+\.mp4[^\s'"]*/);
        var mp4 = m ? m[0] : "";

        // Caso 2: è lo slug di un episodio -> leggi la pagina /watch e prendi il mp4.
        if (!mp4) {
            var slug = raw.split("?")[0].split("#")[0].replace(/\/+$/, "")
                .split("/").filter(function (s) {
                    return s.length > 0;
                }).pop();
            var res = await this.client.get(
                this.getBaseUrl() + "/watch/" + slug,
                this.headers(this.getBaseUrl() + "/"),
            );
            var w = res.body.match(/videoUrl\s*=\s*['"]([^'"]+\.mp4[^'"]*)['"]/);
            if (!w) w = res.body.match(/https?:\/\/[^\s'"]+\.mp4[^\s'"]*/);
            if (w) mp4 = w[1] || w[0];
        }

        if (!mp4) throw new Error("Nessuno stream trovato per questo episodio");

        return [
            {
                url: mp4,
                originalUrl: mp4,
                quality: "HentaiWorld",
                headers: { "User-Agent": UA, "Referer": this.getBaseUrl() + "/" },
            },
        ];
    }

    options(pairs, anyLabel) {
        var out = [];
        if (anyLabel) out.push({ type_name: "SelectOption", name: anyLabel, value: "" });
        for (var i = 0; i < pairs.length; i++) {
            out.push({
                type_name: "SelectOption",
                name: pairs[i][1],
                value: pairs[i][0],
            });
        }
        return out;
    }

    getFilterList() {
        return [
            {
                type_name: "HeaderFilter",
                name: "Il sito non ha «Più recenti»: l'ordine delle novità è «Ultime aggiunte». Genere, stato e lingua si combinano.",
            },
            {
                type_name: "SelectFilter",
                name: "Ordine",
                state: 0,
                values: this.options(SORTS, "Standard"),
            },
            {
                type_name: "SelectFilter",
                name: "Stato",
                state: 0,
                values: this.options(STATUSES, "Tutti"),
            },
            {
                type_name: "SelectFilter",
                name: "Genere",
                state: 0,
                values: this.options(GENRES, "Tutti"),
            },
            {
                type_name: "SelectFilter",
                name: "Lingua",
                state: 0,
                values: [
                    { type_name: "SelectOption", name: "Tutte", value: "" },
                    { type_name: "SelectOption", name: "Sub ITA", value: "sub_ita" },
                    { type_name: "SelectOption", name: "Sub ENG", value: "sub_eng" },
                    { type_name: "SelectOption", name: "Dub ITA", value: "dub_ita" },
                ],
            },
        ];
    }

    getSourcePreferences() {
        return [
            {
                key: PREF_BASE,
                editTextPreference: {
                    title: "Dominio HentaiWorld",
                    summary:
                        "Cambialo quando il sito cambia indirizzo (es. https://www.hentaiworld.me)",
                    value: DEFAULT_BASE,
                    dialogTitle: "Dominio HentaiWorld",
                    dialogMessage: "URL base, senza slash finale",
                },
            },
        ];
    }
}
