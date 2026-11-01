const mangayomiSources = [
    {
        "name": "HypnoTube",
        "lang": "en",
        "baseUrl": "https://hypnotube.com",
        "apiUrl": "",
        "iconUrl": "https://www.google.com/s2/favicons?sz=64&domain=hypnotube.com",
        "typeSource": "single",
        "isNsfw": true,
        "itemType": 1,
        "version": "1.0.0",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/hypnotube.js",
    },
];

const DEFAULT_BASE = "https://hypnotube.com";
const PREF_BASE = "hypnotube_base_url";
const UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

// Ordine = finestra temporale del listato /videos/.
const PERIODS = [
    ["", "Recenti"], ["day", "Top oggi"], ["week", "Top settimana"],
    ["month", "Top mese"], ["year", "Top anno"],
];

// Categorie del sito ("channels"): value = "<id>/<slug>".
const CHANNELS = [
    ["1/anti-sissy", "Anti Sissy"],
    ["2/asian", "Asian"],
    ["3/big-cock", "Big Cock"],
    ["4/captions", "Captions"],
    ["5/cei-cum-eating-instructions", "CEI Cum Eating Instructions"],
    ["6/chastity", "Chastity"],
    ["7/cock-sucking", "Cock Sucking"],
    ["8/cum", "Cum"],
    ["9/cuckold", "Cuckold"],
    ["10/deepslutpuppy", "Deepslutpuppy"],
    ["11/hypnosis", "Hypnosis"],
    ["12/emperor-hypnos", "Emperor Hypnos"],
    ["13/female-pov", "Female POV"],
    ["14/femdom", "Femdom"],
    ["15/feminization", "Feminization"],
    ["16/fucking", "Fucking"],
    ["17/gay", "Gay"],
    ["18/humiliation", "Humiliation"],
    ["19/interracial", "Interracial"],
    ["20/jizzfeed", "Jizzfeed"],
    ["21/jlodalisque", "Jlodalisque"],
    ["22/miscon", "Miscon"],
    ["23/music-pmv", "Music PMV"],
    ["24/pandora-sissy", "Pandora Sissy"],
    ["25/sissy-sandra", "Sissy Sandra"],
    ["26/sissygasm", "Sissygasm"],
    ["27/small-cock", "Small Cock"],
    ["28/sissy-training", "Sissy Training"],
    ["29/tgirls", "TGirls"],
    ["30/toys", "Toys"],
    ["31/movies", "Movies"],
    ["32/gifs", "Gifs"],
    ["33/images", "Images"],
    ["34/gloryhole", "Gloryhole"],
    ["35/bdsm", "BDSM"],
    ["36/girl-mode", "Girl Mode"],
    ["37/audio", "Audio"],
    ["38/hd", "HD"],
    ["39/amber-sis", "Amber Sis"],
    ["40/back-door-man", "Back Door Man"],
    ["41/gargantua4", "Gargantua4"],
    ["42/klausner", "Klausner"],
    ["43/male-voice", "Male Voice"],
    ["44/vr", "VR"],
    ["46/holditsissy", "Holditsissy"],
    ["47/amateur", "Amateur"],
    ["48/censored", "Censored"],
    ["49/nyarlathotep", "Nyarlathotep"],
    ["50/brainwashing", "Brainwashing"],
    ["51/sissycouture", "Sissycouture"],
    ["52/revolutionarygurl", "Revolutionarygurl"],
    ["53/zoepmv", "Zoepmv"],
    ["54/evasissyslut", "Evasissyslut"],
    ["56/leyendecker", "Leyendecker"],
    ["57/leal2k", "Leal2k"],
    ["58/anal-cum-bunny", "Anal Cum Bunny"],
    ["59/no-music", "No Music"],
    ["60/andreealuv", "Andreealuv"],
    ["61/sissy-gal-jasmine", "Sissy Gal Jasmine"],
    ["62/sissylady-b", "Sissylady B"],
    ["64/instructional", "Instructional"],
    ["65/tgirls-for-guys", "TGirls For Guys"],
    ["66/f3mm3f4t4l3", "F3mm3f4t4l3"],
    ["67/hypnocypher", "Hypnocypher"],
    ["68/art", "Art"],
    ["69/cocotranse", "Cocotranse"],
    ["70/sissy-student", "Sissy Student"],
    ["71/drogon", "Drogon"],
    ["73/for-girls", "For Girls"],
    ["74/starter-content", "Starter Content"],
    ["75/affirming", "Affirming"],
    ["76/anal", "Anal"],
    ["77/chandra-spirit", "Chandra Spirit"],
    ["78/hypnorko", "Hypnorko"],
    ["79/hentai", "Hentai"],
    ["80/betaslaver", "Betaslaver"],
    ["81/tests", "Tests"],
    ["84/non-english", "Non English"],
    ["85/furry", "Furry"],
    ["86/caption-story", "Caption Story"],
    ["87/holopmv", "Holopmv"],
    ["88/dosha-pmv", "Dosha PMV"],
    ["89/bambi", "Bambi"],
    ["90/vip", "Vip"],
    ["91/gooning", "Gooning"],
    ["92/vertical-video", "Vertical Video"],
    ["93/created-sissy", "Created Sissy"],
    ["94/pelo", "Pelo"],
    ["95/mk-ultra", "MK Ultra"],
    ["96/goonlimp", "Goonlimp"],
    ["97/cbt", "CBT"],
    ["98/sph", "SPH"],
    ["99/ai", "AI"],
    ["100/joi-jerk-off-instructions", "JOI Jerk Off Instructions"],
    ["101/gangbang", "Gangbang"],
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

    async doc(path) {
        var url = path.indexOf("http") === 0 ? path : this.getBaseUrl() + path;
        var res = await this.client.get(url, this.headers());
        return new Document(res.body);
    }

    // base finisce con "/"; pagina N>1 -> base + "pageN.html".
    paged(base, page) {
        return page > 1 ? base + "page" + page + ".html" : base;
    }

    parseList(doc) {
        var list = [];
        for (var item of doc.select("div.item-col")) {
            var a = item.selectFirst('a[href*="/video/"]');
            if (!a) continue;
            var link = a.getHref;
            if (!link) continue;
            var name = a.attr("title") || "";
            var img = item.selectFirst("img");
            var imageUrl = img ? img.attr("src") || img.attr("data-src") || "" : "";
            if (!name && img) name = img.attr("alt") || "";
            if (!name) continue;
            list.push({ name: name, imageUrl: imageUrl, link: link });
        }
        var next = doc.selectFirst('a[href*="page"]');
        return { list: list, hasNextPage: !!next && list.length > 0 };
    }

    async getPopular(page) {
        return this.parseList(await this.doc(this.paged("/videos/month/", page)));
    }

    async getLatestUpdates(page) {
        return this.parseList(await this.doc(this.paged("/videos/", page)));
    }

    async search(query, page, filters) {
        var channel = this.filterValue(filters, "Categoria");
        var period = this.filterValue(filters, "Ordine");
        var base;
        if (query && query.length) {
            base = "/search/" + encodeURIComponent(query.trim()) + "/";
        } else if (channel) {
            base = "/channels/" + channel + "/";
        } else {
            base = "/videos/" + (period ? period + "/" : "");
        }
        return this.parseList(await this.doc(this.paged(base, page)));
    }

    async getDetail(url) {
        var doc = await this.doc(url);
        var description = "";
        var d = doc.selectFirst("div.main-description") || doc.selectFirst(".video-description");
        if (d) description = d.text.trim();
        if (!description) {
            var meta = doc.selectFirst('meta[name="description"]');
            if (meta) description = (meta.attr("content") || "").trim();
        }

        var genre = [];
        for (var g of doc.select('a[href*="/channels/"]')) {
            var t = g.text.trim();
            if (t && t.length > 0 && t.length < 30 && genre.indexOf(t) === -1) genre.push(t);
        }

        return {
            link: url,
            description: description || "Nessuna descrizione.",
            genre: genre,
            status: 1,
            chapters: [{ name: "Guarda il video", url: url }],
        };
    }

    async getVideoList(url) {
        var raw = String(url);
        try { raw = decodeURIComponent(raw); } catch (e) {}
        var lastHttp = raw.lastIndexOf("http");
        if (lastHttp > 0) raw = raw.slice(lastHttp);
        var pageUrl = raw.indexOf("http") === 0 ? raw : this.getBaseUrl() + raw;

        var res = await this.client.get(pageUrl, this.headers());
        var s = res.body.match(/<source[^>]+src="([^"]+\.mp4[^"]*)"/);
        if (!s) s = res.body.match(/https?:\/\/media\.hypnotube\.com\/[^\s'"]+\.mp4[^\s'"]*/);
        if (!s) throw new Error("Nessuno stream trovato per questo video");
        var mp4 = (s[1] || s[0]).replace(/&amp;/g, "&");

        return [
            {
                url: mp4,
                originalUrl: mp4,
                quality: "HypnoTube",
                headers: this.headers(pageUrl),
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
                name: "La categoria ha priorità sul testo. Ordine = finestra temporale del listato.",
            },
            { type_name: "SelectFilter", name: "Ordine", state: 0, values: this.options(PERIODS, "") },
            { type_name: "SelectFilter", name: "Categoria", state: 0, values: this.options(CHANNELS, "Tutte") },
        ];
    }

    getSourcePreferences() {
        return [
            {
                key: PREF_BASE,
                editTextPreference: {
                    title: "Dominio HypnoTube",
                    summary: "Cambialo se il sito cambia indirizzo (es. https://hypnotube.com)",
                    value: DEFAULT_BASE,
                    dialogTitle: "Dominio HypnoTube",
                    dialogMessage: "URL base, senza slash finale",
                },
            },
        ];
    }
}
