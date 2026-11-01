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
        "version": "1.0.0",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/animeworld.js",
    },
];

const DEFAULT_BASE = "https://www.animeworld.ac";
const PREF_BASE = "animeworld_base_url";
const UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

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
        var url = path.startsWith("http") ? path : this.getBaseUrl() + path;
        var res = await this.client.get(url, this.headers());
        return new Document(res.body);
    }

    // Parse a result/film grid into { list, hasNextPage }.
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
        var doc = await this.doc("/filter?sort=6&page=" + page);
        return this.parseList(doc);
    }

    async getLatestUpdates(page) {
        var doc = await this.doc("/filter?sort=3&page=" + page);
        return this.parseList(doc);
    }

    async search(query, page, filters) {
        if (!query || !query.length) {
            return await this.getPopular(page);
        }
        var doc = await this.doc(
            "/search?keyword=" + encodeURIComponent(query) + "&page=" + page,
        );
        return this.parseList(doc);
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

        var status = 5; // unknown
        var metaEl = doc.selectFirst("dl.meta");
        var metaText = metaEl ? metaEl.text : "";
        if (metaText.indexOf("In corso") !== -1) status = 0; // ongoing
        else if (
            metaText.indexOf("Finito") !== -1 ||
            metaText.indexOf("Terminato") !== -1
        )
            status = 1; // completed

        var chapters = [];
        var seen = {};
        for (var li of doc.select("li.episode")) {
            var a = li.selectFirst("a");
            if (!a) continue;
            var href = a.getHref;
            if (!href) continue;
            var num =
                a.attr("data-episode-num") ||
                a.attr("data-num") ||
                a.text.trim();
            var key = a.attr("data-id") || href;
            if (seen[key]) continue;
            seen[key] = true;
            chapters.push({ name: "Episodio " + num, url: href });
        }
        // The site lists episodes ascending; show newest first.
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
        var clean = url.split("?")[0].split("#")[0];
        var parts = clean.split("/").filter(function (s) {
            return s.length > 0;
        });
        var code = parts[parts.length - 1];
        if (!code) throw new Error("Impossibile ricavare l'ID episodio");

        var api =
            this.getBaseUrl() +
            "/api/episode/info?id=" +
            encodeURIComponent(code) +
            "&alt=0";
        var h = this.headers(url.startsWith("http") ? url : this.getBaseUrl() + url);
        var res = await this.client.get(api, h);
        var json = JSON.parse(res.body);

        var grabber = json && json.grabber;
        var stream = "";
        if (typeof grabber === "string") {
            stream = grabber;
        } else if (grabber && typeof grabber === "object") {
            stream =
                grabber.src ||
                grabber.url ||
                grabber["1080p"] ||
                grabber["720p"] ||
                grabber["480p"] ||
                "";
        }
        if (!stream) throw new Error("Nessuno stream trovato per questo episodio");

        return [
            {
                url: stream,
                originalUrl: stream,
                quality: "AnimeWorld",
                headers: h,
            },
        ];
    }

    getFilterList() {
        return [];
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
