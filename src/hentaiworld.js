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
        "version": "1.0.6",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/hentaiworld.js",
    },
];

// HentaiWorld (hentaiworld.cc): tutto il catalogo è in /search-data.json e gli
// stream (mp4 diretti) arrivano da /api/hdb/stream/<slug>~<ep>.
const DEFAULT_BASE = "https://hentaiworld.cc";
const PREF_BASE = "hentaiworld_cc_base_url";
const PER_PAGE = 30;
const UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

// Generi dal catalogo reale (forma canonica usata nel campo "genres").
const GENRES = [
    "Ahegao", "Anal", "Bdsm", "Big Boobs", "Blow Job", "Bondage", "Boob Job",
    "Censored", "Comedy", "Cosplay", "Creampie", "Dark Skin", "Facial", "Fantasy",
    "Filmed", "Foot Job", "Futanari", "Gangbang", "Glasses", "Hand Job", "Harem",
    "Horror", "Incest", "Lactation", "Maid", "Masturbation", "Milf", "Mind Break",
    "Mind Control", "Monster", "Nekomimi", "Ntr", "Nurse", "Orgy", "Plot", "Pov",
    "Pregnant", "Public Sex", "Rimjob", "Scat", "School Girl", "Softcore", "Swimsuit",
    "Teacher", "Tentacle", "Threesome", "Toys", "Trap", "Tsundere", "Uncensored",
    "Vanilla", "Virgin", "Watersports", "X-Ray", "Yaoi", "Yuri", "3D",
];

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
        if (!v || !v.length || v.indexOf("hentaiworld.to") !== -1) v = DEFAULT_BASE;
        return v.replace(/\/+$/, "");
    }

    headers(referer) {
        return {
            "User-Agent": UA,
            "Referer": referer || this.getBaseUrl() + "/",
        };
    }

    // Replica la stessa richiesta XHR che fa il player del sito.
    apiHeaders(referer) {
        return {
            "User-Agent": UA,
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
            "X-Requested-With": "XMLHttpRequest",
            "Origin": this.getBaseUrl(),
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
        return { name: entry.title, imageUrl: entry.img || "", link: entry.slug };
    }

    paginate(items, page) {
        var start = (page - 1) * PER_PAGE;
        return {
            list: items.slice(start, start + PER_PAGE).map(this.toItem),
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
        return this.paginate(await this.catalog(), page);
    }

    async search(query, page, filters) {
        var q = (query || "").toLowerCase().trim();
        var genre = "";
        if (filters && filters.length) {
            for (var f of filters) {
                if (
                    f.type_name === "SelectFilter" &&
                    f.name === "Genere" &&
                    f.values &&
                    f.values[f.state]
                )
                    genre = f.values[f.state].value;
            }
        }

        var all = await this.catalog();
        var matched = all.filter(function (e) {
            var okQ =
                !q ||
                (e.title || "").toLowerCase().indexOf(q) !== -1 ||
                (e.slug || "").toLowerCase().indexOf(q.replace(/\s+/g, "-")) !== -1;
            var okG = !genre || (e.genres || "").indexOf(genre) !== -1;
            return okQ && okG;
        });

        if (!q && !genre) return this.getPopular(page);
        return this.paginate(matched, page);
    }

    findEntry(slug) {
        var all = this._catalog || [];
        for (var i = 0; i < all.length; i++) {
            if (all[i].slug === slug) return all[i];
        }
        return null;
    }

    async getDetail(url) {
        await this.catalog();
        var slug = String(url).split("?")[0].split("#")[0].replace(/\/+$/, "")
            .split("/").filter(function (s) {
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
        // Normalizza qualsiasi forma di URL verso "<slug>~<ep>".
        var raw = String(url);
        try {
            raw = decodeURIComponent(raw);
        } catch (e) {}
        raw = raw.split("?")[0].split("#")[0].replace(/\/+$/, "");

        var slug, ep;
        var mt = raw.match(/([^\/]+)~(\d+)$/);
        if (mt) {
            slug = mt[1];
            ep = mt[2];
        } else {
            var parts = raw.split("/").filter(function (s) {
                return s.length > 0;
            });
            ep = parts.pop() || "1";
            slug = parts.pop() || "";
        }
        if (!slug) throw new Error("ID episodio non valido: " + url);
        var id = slug + "~" + ep;
        var base = this.getBaseUrl();

        var referer = base + "/watch/" + slug + "/" + ep + "/";
        var h = this.headers(referer);
        var apiUrl = base + "/api/hdb/stream/" + encodeURIComponent(id);

        var json = null;
        var sources = [];
        var lastBody = "";
        for (var attempt = 0; attempt < 3; attempt++) {
            var res = await this.client.get(apiUrl, this.apiHeaders(referer));
            lastBody = res.body;
            json = JSON.parse(res.body);
            sources = (json && json.sources) || [];
            if (sources.length) break;
        }

        // Sottotitoli: tracce multiple (incluso Italiano e Inglese).
        var LANGNAMES = {
            it: "Italiano", en: "English", es: "Español", fr: "Français",
            de: "Deutsch", pt: "Português", ja: "日本語", ru: "Русский",
            ar: "العربية", zh: "中文", ko: "한국어",
        };
        var subtitles = [];
        var subs = (json && json.subs) || [];
        for (var j = 0; j < subs.length; j++) {
            var sb = subs[j];
            if (!sb || !sb.url) continue;
            var subUrl = sb.url.indexOf("http") === 0 ? sb.url : base + sb.url;
            subtitles.push({
                file: subUrl,
                label: LANGNAMES[sb.lang] || (sb.lang || "Sub").toUpperCase(),
            });
        }
        // Italiano e Inglese in cima.
        subtitles.sort(function (a, b) {
            var rank = function (l) {
                return l === "Italiano" ? 0 : l === "English" ? 1 : 2;
            };
            return rank(a.label) - rank(b.label);
        });

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
                subtitles: subtitles,
            });
        }

        // H.264 prima (più compatibile con iPhone).
        videos.sort(function (a, b) {
            var ah = a.quality.indexOf("H.264") !== -1 ? 0 : 1;
            var bh = b.quality.indexOf("H.264") !== -1 ? 0 : 1;
            return ah - bh;
        });

        if (videos.length === 0) {
            var snippet = String(lastBody).slice(0, 160).replace(/\s+/g, " ");
            throw new Error(
                "No stream. id=[" + id + "] resp=" + snippet +
                " — apri la Webview una volta e riprova.",
            );
        }
        return videos;
    }

    getFilterList() {
        var opts = [{ type_name: "SelectOption", name: "Tutti", value: "" }];
        for (var i = 0; i < GENRES.length; i++) {
            opts.push({
                type_name: "SelectOption",
                name: GENRES[i],
                value: GENRES[i],
            });
        }
        return [
            { type_name: "SelectFilter", name: "Genere", state: 0, values: opts },
        ];
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
