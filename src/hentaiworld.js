const mangayomiSources = [
    {
        "name": "HentaiWorld",
        "lang": "it",
        "baseUrl": "https://hentaiworld.cc",
        "apiUrl": "",
        "iconUrl": "https://www.google.com/s2/favicons?sz=64&domain=hentaiworld.cc",
        "typeSource": "single",
        "isNsfw": true,
        "itemType": 1,
        "version": "1.0.1",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/hentaiworld.js",
    },
];

// HentaiWorld (hentaiworld.cc) ships its whole catalogue as one JSON
// (/search-data.json); the per-episode streams come from /api/hdb/stream/<slug>~<ep>
// as direct mp4 sources.
const DEFAULT_BASE = "https://hentaiworld.cc";
const PREF_BASE = "hentaiworld_base_url";
const PER_PAGE = 30;
const UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

class DefaultExtension extends MProvider {
    constructor() {
        super();
        this.client = new Client();
        this._catalog = null;
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

    async catalog() {
        if (this._catalog) return this._catalog;
        var res = await this.client.get(
            this.getBaseUrl() + "/search-data.json",
            this.headers(),
        );
        var data = JSON.parse(res.body);
        this._catalog = Array.isArray(data) ? data : [];
        return this._catalog;
    }

    toItem(entry) {
        return {
            name: entry.title,
            imageUrl: entry.img || "",
            link: entry.slug,
        };
    }

    paginate(items, page) {
        var start = (page - 1) * PER_PAGE;
        var slice = items.slice(start, start + PER_PAGE);
        return {
            list: slice.map(this.toItem),
            hasNextPage: start + PER_PAGE < items.length,
        };
    }

    async getPopular(page) {
        var all = (await this.catalog()).slice();
        all.sort(function (a, b) {
            return (b.views || 0) - (a.views || 0);
        });
        return this.paginate(all, page);
    }

    async getLatestUpdates(page) {
        // The catalogue is served newest-first.
        return this.paginate(await this.catalog(), page);
    }

    async search(query, page, filters) {
        var q = (query || "").toLowerCase().trim();
        if (!q) return await this.getPopular(page);
        var all = await this.catalog();
        var matched = all.filter(function (e) {
            return (
                (e.title || "").toLowerCase().indexOf(q) !== -1 ||
                (e.slug || "").toLowerCase().indexOf(q.replace(/\s+/g, "-")) !== -1
            );
        });
        return this.paginate(matched, page);
    }

    findEntry(slug) {
        slug = String(slug).split("/").filter(function (s) {
            return s.length > 0;
        }).pop();
        var all = this._catalog || [];
        for (var i = 0; i < all.length; i++) {
            if (all[i].slug === slug) return all[i];
        }
        return null;
    }

    async getDetail(url) {
        await this.catalog();
        var slug = String(url).split("/").filter(function (s) {
            return s.length > 0;
        }).pop();
        var entry = this.findEntry(slug);

        var genre = [];
        var description = "";
        var chapters = [];

        if (entry) {
            if (entry.genres) {
                genre = String(entry.genres)
                    .split(",")
                    .map(function (g) {
                        return g.trim();
                    })
                    .filter(function (g) {
                        return g.length > 0;
                    });
            }
            var parts = [];
            if (entry.views) parts.push("Visualizzazioni: " + entry.views);
            if (entry.votes) parts.push("Voti: " + entry.votes);
            description = parts.join(" · ");

            var nums = entry.eps ? Object.keys(entry.eps) : [];
            nums.sort(function (a, b) {
                return parseInt(a, 10) - parseInt(b, 10);
            });
            if (nums.length === 0 && entry.ep) {
                for (var n = 1; n <= entry.ep; n++) nums.push(String(n));
            }
            for (var k = nums.length - 1; k >= 0; k--) {
                chapters.push({
                    name: "Episodio " + nums[k],
                    url: slug + "~" + nums[k],
                });
            }
        }

        return {
            link: slug,
            description: description || "Nessuna descrizione disponibile.",
            genre: genre,
            status: 5,
            chapters: chapters,
        };
    }

    async getVideoList(url) {
        var id = String(url); // slug~ep
        var slug = id.split("~")[0];
        var ep = id.split("~")[1] || "1";
        var base = this.getBaseUrl();

        var res = await this.client.get(
            base + "/api/hdb/stream/" + encodeURIComponent(id),
            this.headers(base + "/watch/" + slug + "/" + ep + "/"),
        );
        var json = JSON.parse(res.body);
        var sources = (json && json.sources) || [];

        var h = this.headers(base + "/watch/" + slug + "/" + ep + "/");
        var videos = [];
        for (var i = 0; i < sources.length; i++) {
            var s = sources[i];
            if (!s || !s.url) continue;
            var streamUrl = s.url.indexOf("http") === 0 ? s.url : base + s.url;
            var label =
                (s.q || "") +
                (s.codec ? " " + s.codec : "") +
                (s.server ? " · Server " + s.server : "");
            videos.push({
                url: streamUrl,
                originalUrl: streamUrl,
                quality: label.trim() || "HentaiWorld",
                headers: h,
            });
        }

        // Put the most compatible codec (H.264) first.
        videos.sort(function (a, b) {
            var ah = a.quality.indexOf("H.264") !== -1 ? 0 : 1;
            var bh = b.quality.indexOf("H.264") !== -1 ? 0 : 1;
            return ah - bh;
        });

        if (videos.length === 0)
            throw new Error("Nessuno stream trovato per questo episodio");
        return videos;
    }

    getFilterList() {
        return [];
    }

    getSourcePreferences() {
        return [
            {
                key: PREF_BASE,
                editTextPreference: {
                    title: "Dominio HentaiWorld",
                    summary:
                        "Cambialo quando il sito cambia indirizzo (es. https://hentaiworld.cc)",
                    value: DEFAULT_BASE,
                    dialogTitle: "Dominio HentaiWorld",
                    dialogMessage: "URL base, senza slash finale",
                },
            },
        ];
    }
}
