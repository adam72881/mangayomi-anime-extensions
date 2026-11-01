const mangayomiSources = [
    {
        "name": "AnimeWorld",
        "lang": "it",
        "baseUrl": "https://www.animeworld.ac",
        "apiUrl": "",
        "iconUrl": "https://www.google.com/s2/favicons?sz=64&domain=animeworld.ac",
        "typeSource": "single",
        "isNsfw": false,
        "itemType": 1,
        "version": "1.1.0",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/animeworld.js",
    },
];

const DEFAULT_BASE = "https://www.animeworld.ac";
const PREF_BASE = "animeworld_base_url";
const UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

// slug -> etichetta italiana (dalla pagina /filter del sito)
const GENRES = [
    ["action", "Azione"], ["adventure", "Avventura"], ["arti-marziali", "Arti Marziali"],
    ["avanguardia", "Avanguardia"], ["bambini", "Bambini"], ["commedia", "Commedia"],
    ["demoni", "Demoni"], ["drama", "Drammatico"], ["ecchi", "Ecchi"], ["fantasy", "Fantasy"],
    ["game", "Gioco"], ["harem", "Harem"], ["hentai", "Hentai"], ["historical", "Storico"],
    ["horror", "Horror"], ["isekai", "Isekai"], ["josei", "Josei"], ["magic", "Magia"],
    ["mecha", "Mecha"], ["military", "Militari"], ["mistery", "Mistero"], ["music", "Musicale"],
    ["parody", "Parodia"], ["police", "Polizia"], ["psychological", "Psicologico"],
    ["romance", "Romantico"], ["samurai", "Samurai"], ["school", "Scolastico"], ["sci-fi", "Sci-Fi"],
    ["seinen", "Seinen"], ["sentimental", "Sentimentale"], ["shoujo-ai", "Shoujo Ai"],
    ["shoujo", "Shoujo"], ["shounen-ai", "Shounen Ai"], ["shounen", "Shounen"],
    ["slice-of-life", "Slice of Life"], ["space", "Spazio"], ["sports", "Sport"],
    ["super-power", "Superpoteri"], ["supernatural", "Soprannaturale"], ["thriller", "Thriller"],
    ["vampire", "Vampiri"], ["veicoli", "Veicoli"], ["yaoi", "Yaoi"], ["yuri", "Yuri"],
];

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
        return (v && v.length ? v : DEFAULT_BASE).replace(/\/+$/, "");
    }

    headers(referer) {
        return {
            "User-Agent": UA,
            "Referer": referer || this.getBaseUrl() + "/",
        };
    }

    async doc(path) {
        var url = path.indexOf("http") === 0 ? path : this.getBaseUrl() + path;
        var res = await this.client.get(url, this.headers());
        return new Document(res.body);
    }

    parseList(doc) {
        var list = [];
        for (var item of doc.select("div.film-list div.item")) {
            var poster = item.selectFirst("a.poster");
            var nameEl = item.selectFirst("a.name");
            var a = poster || nameEl;
            if (!a) continue;
            var link = a.getHref;
            if (!link) continue;
            var name = nameEl ? nameEl.text.trim() : "";
            var img = item.selectFirst("img");
            var imageUrl = img ? img.attr("src") || img.attr("data-src") || "" : "";
            if (!name && img) name = img.attr("alt") || "";
            if (!name) continue;
            list.push({ name: name, imageUrl: imageUrl, link: link });
        }
        return { list: list, hasNextPage: list.length > 0 };
    }

    async getPopular(page) {
        return this.parseList(await this.doc("/filter?sort=6&page=" + page));
    }

    async getLatestUpdates(page) {
        return this.parseList(await this.doc("/filter?sort=3&page=" + page));
    }

    async search(query, page, filters) {
        var genre = "";
        var dub = "";
        if (filters && filters.length) {
            for (var f of filters) {
                if (f.type_name !== "SelectFilter") continue;
                var val = f.values && f.values[f.state] ? f.values[f.state].value : "";
                if (f.name === "Genere") genre = val;
                else if (f.name === "Lingua") dub = val;
            }
        }

        var path;
        if (query && query.length) {
            path = "/search?keyword=" + encodeURIComponent(query) + "&page=" + page;
        } else if (genre) {
            path = "/genre/" + genre + "?page=" + page;
            if (dub) path += "&dub=" + dub;
        } else if (dub) {
            path = "/filter?dub=" + dub + "&page=" + page;
        } else {
            return this.getPopular(page);
        }
        return this.parseList(await this.doc(path));
    }

    async getDetail(url) {
        var doc = await this.doc(url);

        var description = "";
        var descEl = doc.selectFirst("div.desc");
        if (descEl) description = descEl.text.trim();

        var genre = [];
        for (var g of doc.select('dd a[href*="/genre/"]')) {
            var t = g.text.trim();
            if (t && genre.indexOf(t) === -1) genre.push(t);
        }

        var status = 5;
        var metaEl = doc.selectFirst("dl.meta");
        var metaText = metaEl ? metaEl.text : "";
        if (metaText.indexOf("In corso") !== -1) status = 0;
        else if (metaText.indexOf("Finito") !== -1 || metaText.indexOf("Terminato") !== -1)
            status = 1;

        var chapters = [];
        var seen = {};
        for (var li of doc.select("li.episode")) {
            var a = li.selectFirst("a");
            if (!a) continue;
            var href = a.getHref;
            if (!href) continue;
            var num = a.attr("data-episode-num") || a.attr("data-num") || a.text.trim();
            var key = a.attr("data-id") || href;
            if (seen[key]) continue;
            seen[key] = true;
            chapters.push({ name: "Episodio " + num, url: href });
        }
        chapters.reverse();

        return {
            link: url,
            description: description || "Nessuna descrizione disponibile.",
            genre: genre,
            status: status,
            chapters: chapters,
        };
    }

    async getVideoList(url) {
        var raw = String(url);
        try { raw = decodeURIComponent(raw); } catch (e) {}
        raw = raw.split("?")[0].split("#")[0].replace(/\/+$/, "");
        var parts = raw.split("/").filter(function (s) {
            return s.length > 0;
        });
        var code = parts[parts.length - 1];
        if (!code) throw new Error("Impossibile ricavare l'ID episodio da " + url);

        var referer = this.getBaseUrl() + "/play/" + parts.slice(-2).join("/");
        var h = this.headers(referer);
        var res = await this.client.get(
            this.getBaseUrl() + "/api/episode/info?id=" + encodeURIComponent(code) + "&alt=0",
            h,
        );
        var json = JSON.parse(res.body);

        var grabber = json && json.grabber;
        var stream = "";
        if (typeof grabber === "string") stream = grabber;
        else if (grabber && typeof grabber === "object")
            stream =
                grabber.src || grabber.url || grabber["1080p"] ||
                grabber["720p"] || grabber["480p"] || "";
        if (!stream) throw new Error("Nessuno stream trovato per questo episodio");

        return [{ url: stream, originalUrl: stream, quality: "AnimeWorld", headers: h }];
    }

    getFilterList() {
        var lang = [
            { type_name: "SelectOption", name: "Qualsiasi", value: "" },
            { type_name: "SelectOption", name: "Sub ITA", value: "0" },
            { type_name: "SelectOption", name: "Doppiato ITA", value: "1" },
        ];
        var genreOpts = [{ type_name: "SelectOption", name: "Tutti", value: "" }];
        for (var i = 0; i < GENRES.length; i++) {
            genreOpts.push({
                type_name: "SelectOption",
                name: GENRES[i][1],
                value: GENRES[i][0],
            });
        }
        return [
            {
                type_name: "HeaderFilter",
                name: "La ricerca per testo ignora i filtri. Senza testo: scegli genere o lingua.",
            },
            { type_name: "SelectFilter", name: "Lingua", state: 0, values: lang },
            { type_name: "SelectFilter", name: "Genere", state: 0, values: genreOpts },
        ];
    }

    getSourcePreferences() {
        return [
            {
                key: PREF_BASE,
                editTextPreference: {
                    title: "Dominio AnimeWorld",
                    summary:
                        "Cambialo quando il sito cambia indirizzo (es. https://www.animeworld.ac)",
                    value: DEFAULT_BASE,
                    dialogTitle: "Dominio AnimeWorld",
                    dialogMessage: "URL base, senza slash finale",
                },
            },
        ];
    }
}
