const mangayomiSources = [
    {
        "name": "PMVHaven",
        "lang": "en",
        "baseUrl": "https://pmvhaven.com",
        "apiUrl": "",
        "iconUrl": "https://www.google.com/s2/favicons?sz=64&domain=pmvhaven.com",
        "typeSource": "single",
        "isNsfw": true,
        "itemType": 1,
        "version": "1.0.0",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/pmvhaven.js",
    },
];

const DEFAULT_BASE = "https://pmvhaven.com";
const PREF_BASE = "pmvhaven_base_url";
const UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

const ORDERS = [["latest", "Recenti"], ["views", "Più visti"]];

// value = nome tag (il filtro ?tags= è case-insensitive).
const TAGS = [
    ["blowjob", "Blowjob"],
    ["big ass", "Big Ass"],
    ["big boobs", "Big Boobs"],
    ["cumshot", "Cumshot"],
    ["riding", "Riding"],
    ["goon", "Goon"],
    ["teen", "Teen"],
    ["hardcore", "Hardcore"],
    ["bbc", "BBC"],
    ["big dick", "Big Dick"],
    ["cute", "Cute"],
    ["splitscreen", "Splitscreen"],
    ["cum", "Cum"],
    ["doggystyle", "Doggystyle"],
    ["anal", "Anal"],
    ["facial", "Facial"],
    ["bouncing tits", "Bouncing Tits"],
    ["cum on face", "Cum On Face"],
    ["cowgirl", "Cowgirl"],
    ["blonde", "Blonde"],
    ["ass shake", "Ass Shake"],
    ["teasing", "Teasing"],
    ["brunette", "Brunette"],
    ["tiktok", "Tiktok"],
    ["interracial", "Interracial"],
    ["big tits", "Big Tits"],
    ["gooning", "Gooning"],
    ["dancing", "Dancing"],
    ["oral", "Oral"],
    ["asian", "Asian"],
    ["deepthroat", "Deepthroat"],
    ["pawg", "PAWG"],
    ["hmv", "HMV"],
    ["cum in mouth", "Cum In Mouth"],
    ["twerking", "Twerking"],
    ["multiple girls", "Multiple Girls"],
    ["white girl", "White Girl"],
    ["pov", "POV"],
    ["big booty", "Big Booty"],
    ["blacked", "Blacked"],
    ["rough", "Rough"],
    ["creampie", "Creampie"],
    ["missionary", "Missionary"],
    ["milf", "Milf"],
    ["handjob", "Handjob"],
    ["threesome", "Threesome"],
    ["japanese", "Japanese"],
    ["fun", "Fun"],
    ["bnwo", "BNWO"],
    ["jav", "JAV"],
    ["gangbang", "Gangbang"],
    ["tribute", "Tribute"],
    ["huge ass", "Huge Ass"],
    ["non-nude", "Non-nude"],
    ["ahegao", "Ahegao"],
    ["big black cock", "Big Black Cock"],
    ["hypno", "Hypno"],
    ["sissy", "Sissy"],
    ["ass clap", "Ass Clap"],
    ["bbc only", "BBC Only"],
    ["cosplay", "Cosplay"],
    ["transgender", "Transgender"],
    ["natural tits", "Natural Tits"],
    ["hentai", "Hentai"],
    ["3d", "3D"],
    ["boobjob", "Boobjob"],
    ["double penetration", "Double Penetration"],
    ["oil", "Oil"],
    ["cum on tits", "Cum On Tits"],
    ["black dick", "Black Dick"],];
const NAME2TAG = {};
for (var _i = 0; _i < TAGS.length; _i++) {
    NAME2TAG[TAGS[_i][0].toLowerCase()] = TAGS[_i][0];
    NAME2TAG[TAGS[_i][1].toLowerCase()] = TAGS[_i][0];
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
        return (v && v.length ? v : DEFAULT_BASE).replace(/\/+$/, "");
    }

    headers() {
        return {
            "User-Agent": UA,
            "Accept": "application/json",
            "Referer": this.getBaseUrl() + "/",
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

    async api(path) {
        var res = await this.client.get(this.getBaseUrl() + path, this.headers());
        return JSON.parse(res.body);
    }

    toList(json) {
        var vids = json.videos || json.data || json.results || [];
        var list = [];
        for (var i = 0; i < vids.length; i++) {
            var v = vids[i];
            if (!v || !v._id) continue;
            list.push({
                name: v.title || "Senza titolo",
                imageUrl: v.thumbnailUrl || v.thumbnail || "",
                link: v._id,
            });
        }
        var hasNext = json.pagination ? !!json.pagination.hasNext : list.length > 0;
        return { list: list, hasNextPage: hasNext };
    }

    async getPopular(page) {
        return this.toList(await this.api("/api/videos?sort=views&page=" + page));
    }

    async getLatestUpdates(page) {
        return this.toList(await this.api("/api/videos?sort=latest&page=" + page));
    }

    async search(query, page, filters) {
        var tag = this.filterValue(filters, "Categoria");
        var order = this.filterValue(filters, "Ordine");

        // Un tag genere cliccato arriva come testo: se è un tag noto, filtralo.
        if (query && query.length) {
            var qn = query.toLowerCase().trim();
            if (NAME2TAG[qn]) {
                tag = NAME2TAG[qn];
                query = "";
            }
        }

        if (query && query.length) {
            return this.toList(
                await this.api("/api/videos/search?q=" + encodeURIComponent(query.trim()) + "&page=" + page),
            );
        }
        if (tag) {
            return this.toList(
                await this.api("/api/videos?tags=" + encodeURIComponent(tag) + "&page=" + page),
            );
        }
        return this.toList(
            await this.api("/api/videos?sort=" + (order || "latest") + "&page=" + page),
        );
    }

    async getDetail(url) {
        var id = String(url).split("?")[0].split("#")[0].replace(/\/+$/, "")
            .split("/").filter(function (s) {
                return s.length > 0;
            }).pop();
        var json = await this.api("/api/videos/" + id);
        var v = json.data || json.video || json;

        var genre = Array.isArray(v.tags) ? v.tags.slice(0, 20) : [];
        var parts = [];
        if (v.uploader) parts.push("Di " + v.uploader);
        if (v.views != null) parts.push(v.views + " visualizzazioni");
        if (v.duration) parts.push(v.duration);
        if (v.music && typeof v.music === "string" && v.music.trim())
            parts.push("♪ " + v.music.trim());

        return {
            link: id,
            description: parts.join(" · ") || "PMVHaven",
            genre: genre,
            status: 1,
            chapters: [{ name: "Guarda il video", url: v.videoUrl || id }],
        };
    }

    async getVideoList(url) {
        var raw = String(url);
        try { raw = decodeURIComponent(raw); } catch (e) {}
        var lastHttp = raw.lastIndexOf("http");
        if (lastHttp > 0) raw = raw.slice(lastHttp);

        var mp4 = "";
        if (raw.indexOf("http") === 0 && /\.(mp4|m3u8)/.test(raw)) {
            mp4 = raw;
        } else {
            var id = raw.split("?")[0].split("#")[0].replace(/\/+$/, "")
                .split("/").filter(function (s) {
                    return s.length > 0;
                }).pop();
            var json = await this.api("/api/videos/" + id);
            var v = json.data || json;
            mp4 = v.videoUrl || "";
        }
        if (!mp4) throw new Error("Nessuno stream trovato per questo video");

        return [
            {
                url: mp4,
                originalUrl: mp4,
                quality: "PMVHaven",
                headers: { "User-Agent": UA, "Referer": this.getBaseUrl() + "/" },
            },
        ];
    }

    options(pairs, anyLabel) {
        var out = [];
        if (anyLabel) out.push({ type_name: "SelectOption", name: anyLabel, value: "" });
        for (var i = 0; i < pairs.length; i++) {
            out.push({ type_name: "SelectOption", name: pairs[i][1], value: pairs[i][0] });
        }
        return out;
    }

    getFilterList() {
        return [
            {
                type_name: "HeaderFilter",
                name: "La ricerca per testo ha priorità. Senza testo: Ordine o Categoria.",
            },
            { type_name: "SelectFilter", name: "Ordine", state: 0, values: this.options(ORDERS, "") },
            { type_name: "SelectFilter", name: "Categoria", state: 0, values: this.options(TAGS, "Tutte") },
        ];
    }

    getSourcePreferences() {
        return [
            {
                key: PREF_BASE,
                editTextPreference: {
                    title: "Dominio PMVHaven",
                    summary: "Cambialo se il sito cambia indirizzo (es. https://pmvhaven.com)",
                    value: DEFAULT_BASE,
                    dialogTitle: "Dominio PMVHaven",
                    dialogMessage: "URL base, senza slash finale",
                },
            },
        ];
    }
}
