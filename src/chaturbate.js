const mangayomiSources = [
    {
        "name": "Chaturbate",
        "lang": "en",
        "baseUrl": "https://chaturbate.com",
        "apiUrl": "",
        "iconUrl": "https://www.google.com/s2/favicons?sz=64&domain=chaturbate.com",
        "typeSource": "single",
        "isNsfw": true,
        "itemType": 1,
        "version": "1.0.0",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/chaturbate.js",
    },
];

// Dirette di Chaturbate. Tutto dalle API JSON che usa il sito stesso:
//   elenco  /api/ts/roomlist/room-list/?limit=&offset=&genders=&hashtags=&keywords=&new_cams=
//   diretta /api/chatvideocontext/<nome>/  → hls_source quando la stanza è pubblica
const BASE = "https://chaturbate.com";
const PER_PAGE = 60;
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

const GENDERS = [
    ["f", "Ragazze"],
    ["c", "Coppie"],
    ["t", "Trans"],
    ["m", "Uomini"],
    ["", "Tutti"],
];

const HASHTAGS = [
    ["", "Tutti"],
    ["squirt", "Squirt"],
    ["bigboobs", "Tette grandi"],
    ["lovense", "Lovense (giocattolo interattivo)"],
    ["milf", "MILF"],
    ["mature", "Mature"],
    ["asian", "Asiatiche"],
    ["latina", "Latine"],
    ["ebony", "Ebony"],
    ["bigass", "Sedere grande"],
    ["curvy", "Curvy"],
    ["bbw", "BBW"],
    ["smalltits", "Tette piccole"],
    ["petite", "Minute"],
    ["hairy", "Pelose"],
    ["anal", "Anal"],
    ["feet", "Piedi"],
    ["lesbian", "Lesbiche"],
    ["blonde", "Bionde"],
    ["redhead", "Rosse"],
    ["tattoo", "Tatuate"],
    ["natural", "Naturali"],
    ["bdsm", "BDSM"],
    ["domination", "Dominazione"],
    ["cosplay", "Cosplay"],
    ["ohmibod", "OhMiBod"],
];

const STATUS_TEXT = {
    public: "In diretta adesso",
    private: "In show privato",
    hidden: "In show privato",
    group: "In show di gruppo",
    away: "Assente un momento",
    offline: "Offline",
};

class DefaultExtension extends MProvider {
    constructor() {
        super();
        this.client = new Client();
    }

    // Copertine e miniature: Mangayomi usa queste intestazioni per le immagini.
    getHeaders(url) {
        return { "User-Agent": UA };
    }

    headers() {
        return { "Referer": BASE + "/", "Accept-Language": "it-IT,it;q=0.9,en;q=0.8" };
    }

    async json(url) {
        var res;
        try {
            res = await this.client.get(url, this.headers());
        } catch (e) {
            throw new Error("Chaturbate non risponde (problema di connessione). Controlla la rete e tocca Riprova.");
        }
        var body = String(res.body || "");
        if (res.statusCode === 403 || res.statusCode === 429 || /<title>\s*(just a moment|attention required)/i.test(body)) {
            throw new Error("Chaturbate chiede una verifica. Tocca Webview, superala e poi tocca Riprova.");
        }
        if (res.statusCode === 404) return null;
        if (res.statusCode >= 400) throw new Error("Chaturbate ha risposto con errore " + res.statusCode + ". Tocca Riprova.");
        try {
            return JSON.parse(body);
        } catch (e) {
            throw new Error("Chaturbate ha risposto in modo inatteso. Tocca Riprova.");
        }
    }

    pick(filters, name, fallback) {
        var value = fallback;
        (filters || []).forEach(function (f) {
            if (!f || f.type_name !== "SelectFilter" || f.name !== name) return;
            var opt = (f.values || [])[f.state || 0];
            if (opt) value = opt.value;
        });
        return value;
    }

    async rooms(page, opts) {
        var url = BASE + "/api/ts/roomlist/room-list/?limit=" + PER_PAGE + "&offset=" + ((page - 1) * PER_PAGE);
        if (opts.gender) url += "&genders=" + opts.gender;
        if (opts.hashtag) url += "&hashtags=" + encodeURIComponent(opts.hashtag);
        if (opts.keywords) url += "&keywords=" + encodeURIComponent(opts.keywords);
        if (opts.newCams) url += "&new_cams=true";
        var data = await this.json(url);
        var rooms = (data && data.rooms) || [];
        var list = rooms.filter(function (r) { return r && r.username; }).map(function (r) {
            var viewers = r.num_users ? " · " + r.num_users + " spettatori" : "";
            return {
                name: r.username + viewers,
                imageUrl: r.img || "https://thumb.live.mmcdn.com/riw/" + r.username + ".jpg",
                link: "/" + r.username + "/",
            };
        });
        var total = (data && data.total_count) || 0;
        return { list: list, hasNextPage: rooms.length >= PER_PAGE && (!total || page * PER_PAGE < total) };
    }

    // Popolari: le camgirl in diretta, prima quelle con più spettatori.
    async getPopular(page) {
        return this.rooms(page, { gender: "f" });
    }

    // Recenti: le camgirl nuove sul sito.
    async getLatestUpdates(page) {
        return this.rooms(page, { gender: "f", newCams: true });
    }

    async search(query, page, filters) {
        var text = String(query || "").trim();
        // Un link o un nome incollato: apre direttamente quella stanza.
        var m = text.match(/chaturbate\.com\/([A-Za-z0-9_]+)/i);
        if (m) {
            return { list: [{ name: m[1], imageUrl: "https://thumb.live.mmcdn.com/riw/" + m[1] + ".jpg", link: "/" + m[1] + "/" }], hasNextPage: false };
        }
        var gender = this.pick(filters, "Genere", "f");
        var hashtag = this.pick(filters, "Hashtag", "");
        var newCams = this.pick(filters, "Mostra", "") === "new";
        return this.rooms(page, { gender: gender, hashtag: hashtag, keywords: text, newCams: newCams });
    }

    user(url) {
        var raw = String(url || "").split("#")[0];
        var m = raw.match(/(?:chaturbate\.com)?\/?([A-Za-z0-9_]+)\/?$/);
        return m ? m[1] : "";
    }

    async context(user) {
        var ctx = await this.json(BASE + "/api/chatvideocontext/" + user + "/");
        if (!ctx) throw new Error("La stanza «" + user + "» non esiste più su Chaturbate.");
        return ctx;
    }

    async getDetail(url) {
        var user = this.user(url);
        if (!user) throw new Error("Link di Chaturbate non riconosciuto.");
        var ctx = await this.context(user);
        var status = String(ctx.room_status || "offline");
        var live = status === "public" && !!ctx.hls_source;
        var statusText = STATUS_TEXT[status] || "Offline";
        var lines = [statusText];
        if (ctx.room_title) lines.push(String(ctx.room_title).replace(/<[^>]+>/g, "").trim());
        if (ctx.num_viewers) lines.push(ctx.num_viewers + " spettatori");
        return {
            name: user,
            imageUrl: "https://thumb.live.mmcdn.com/riw/" + user + ".jpg",
            link: "/" + user + "/",
            description: lines.join("\n\n"),
            genre: ["Diretta"],
            status: live ? 0 : 5,
            chapters: [{ name: live ? "▶ Diretta" : "Diretta (" + statusText.toLowerCase() + ")", url: "/" + user + "/" }],
        };
    }

    async getVideoList(url) {
        var user = this.user(url);
        var ctx = await this.context(user);
        if (ctx.room_status !== "public" || !ctx.hls_source) {
            var st = STATUS_TEXT[ctx.room_status] || "offline";
            throw new Error(user + " non è in diretta pubblica adesso (" + st.toLowerCase() + "). Riprova più tardi o scegli un'altra stanza.");
        }
        var src = String(ctx.hls_source);
        return [{
            url: src,
            originalUrl: src,
            quality: "Diretta (HLS)",
            // Il player senza User-Agent si presenta come «libmpv»: meglio come la pagina.
            headers: { "Referer": BASE + "/" + user + "/", "Origin": BASE, "User-Agent": UA },
        }];
    }

    getFilterList() {
        var options = function (pairs) {
            return pairs.map(function (p) { return { type_name: "SelectOption", name: p[1], value: p[0] }; });
        };
        return [
            {
                type_name: "HeaderFilter",
                name: "Solo stanze in diretta adesso. Scrivi un nome o una parola, oppure incolla il link di una stanza.",
            },
            { type_name: "SelectFilter", name: "Genere", state: 0, values: options(GENDERS) },
            { type_name: "SelectFilter", name: "Hashtag", state: 0, values: options(HASHTAGS) },
            { type_name: "SelectFilter", name: "Mostra", state: 0, values: options([["", "Tutte"], ["new", "Solo nuove"]]) },
        ];
    }

    getSourcePreferences() {
        return [];
    }
}
