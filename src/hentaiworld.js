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
        "version": "2.0.0",
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

    async apiEpisodes(params) {
        var res = await this.client.get(
            this.getBaseUrl() + "/api/episodes?" + params,
            this.headers(),
        );
        var json = JSON.parse(res.body);
        return (json && json.episodes) || [];
    }

    // Raggruppa episodi per serie (media_slug), applica il filtro lingua.
    toSeriesList(episodes, langFilter) {
        var seen = {};
        var list = [];
        for (var i = 0; i < episodes.length; i++) {
            var e = episodes[i];
            if (!e || !e.media_slug) continue;
            if (langFilter && langOf(e.media_slug) !== langFilter) continue;
            if (seen[e.media_slug]) continue;
            seen[e.media_slug] = true;
            list.push({
                name: e.media_title || e.media_slug,
                imageUrl: e.thumbnail || "",
                link: e.media_slug,
            });
        }
        return list;
    }

    async getPopular(page) {
        var eps = await this.apiEpisodes("page=" + page);
        eps.sort(function (a, b) {
            return (b.views || 0) - (a.views || 0);
        });
        return { list: this.toSeriesList(eps, ""), hasNextPage: eps.length >= PER_PAGE };
    }

    async getLatestUpdates(page) {
        var eps = await this.apiEpisodes("page=" + page);
        return { list: this.toSeriesList(eps, ""), hasNextPage: eps.length >= PER_PAGE };
    }

    async search(query, page, filters) {
        var lang = "";
        if (filters && filters.length) {
            for (var f of filters) {
                if (
                    f.type_name === "SelectFilter" &&
                    f.name === "Lingua" &&
                    f.values &&
                    f.values[f.state]
                )
                    lang = f.values[f.state].value;
            }
        }
        var params = query && query.length
            ? "q=" + encodeURIComponent(query) + "&page=" + page
            : "page=" + page;
        var eps = await this.apiEpisodes(params);
        return { list: this.toSeriesList(eps, lang), hasNextPage: eps.length >= PER_PAGE };
    }

    async getDetail(url) {
        var slug = String(url).split("?")[0].split("#")[0].replace(/\/+$/, "")
            .split("/").filter(function (s) {
                return s.length > 0;
            }).pop();

        // Deriva un termine di ricerca dal media_slug e raccoglie gli episodi
        // della serie scorrendo il feed di ricerca.
        var query = slug
            .replace(/-(sub-eng|dub-ita|sub-ita)$/g, "")
            .replace(/-/g, " ")
            .trim();

        var byNum = {};
        var mediaTitle = slug;
        for (var p = 1; p <= 4; p++) {
            var eps = await this.apiEpisodes("q=" + encodeURIComponent(query) + "&page=" + p);
            var matched = 0;
            for (var i = 0; i < eps.length; i++) {
                var e = eps[i];
                if (e.media_slug !== slug) continue;
                matched++;
                mediaTitle = e.media_title || mediaTitle;
                var n = String(e.episode_number);
                if (!byNum[n] || !byNum[n].video_url) {
                    byNum[n] = {
                        number: parseInt(n, 10) || 0,
                        video_url: e.video_url || "",
                        ep_slug: e.slug || "",
                    };
                }
            }
            if (eps.length < PER_PAGE) break;
            if (p >= 2 && matched === 0) break; // la serie non è più in queste pagine
        }

        var nums = Object.keys(byNum).sort(function (a, b) {
            return byNum[b].number - byNum[a].number;
        });
        var chapters = [];
        for (var k = 0; k < nums.length; k++) {
            var item = byNum[nums[k]];
            // Preferisci il mp4 diretto; in fallback lo slug dell'episodio.
            chapters.push({
                name: "Episodio " + nums[k],
                url: item.video_url || item.ep_slug,
            });
        }

        var langName = { eng: "SUB ENG", dubita: "DUB ITA", ita: "SUB ITA" }[langOf(slug)];
        return {
            link: slug,
            description: "Lingua: " + langName,
            genre: [],
            status: 5,
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

    getFilterList() {
        return [
            {
                type_name: "SelectFilter",
                name: "Lingua",
                state: 0,
                values: [
                    { type_name: "SelectOption", name: "Tutte", value: "" },
                    { type_name: "SelectOption", name: "Sub ITA", value: "ita" },
                    { type_name: "SelectOption", name: "Sub ENG", value: "eng" },
                    { type_name: "SelectOption", name: "Dub ITA", value: "dubita" },
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
