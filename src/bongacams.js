const mangayomiSources = [
    {
        "name": "BongaCams",
        "lang": "en",
        "baseUrl": "https://bongacams.com",
        "apiUrl": "",
        "iconUrl": "https://www.google.com/s2/favicons?sz=64&domain=bongacams.com",
        "typeSource": "single",
        "isNsfw": true,
        "itemType": 1,
        "version": "1.0.0",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/bongacams.js",
    },
];

// Dirette di BongaCams dalla stessa API JSON che usa il sito:
//   elenco  /tools/listing_v3.php?livetab=female&online_only=true&offset=&limit=&model_search[base_sort]=popular|new&tag=
//           → models[]: username, room ("public"), viewers, vq ("1920x1080"), esid (server video), thumb_image
//   video   https://<esid>.bcvcdn.com/hls/stream_<nome>/playlist.m3u8 → qualità con audio dentro
// online_only=true dà solo stanze in show pubblico. Il server video (esid) cambia da
// stanza a stanza: si porta nel link (#e=…) e, se è cambiato, si ricerca nell'elenco.
const BASE = "https://bongacams.com";
const PER_PAGE = 40;
const BIG = 500;
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

const GENDERS = [
    ["female", "Ragazze"],
    ["couples", "Coppie"],
    ["transsexual", "Trans"],
    ["male", "Uomini"],
];

// Solo i tag che il sito filtra davvero (provati): lingue parlate e pochi altri.
const TAGS = [
    ["", "Tutte"],
    ["italian", "Parla italiano"],
    ["spanish", "Parla spagnolo"],
    ["english", "Parla inglese"],
    ["french", "Parla francese"],
    ["german", "Parla tedesco"],
    ["russian", "Parla russo"],
    ["ukrainian", "Parla ucraino"],
    ["romanian", "Parla rumeno"],
    ["squirt", "Squirt"],
    ["lovense", "Lovense (giocattolo interattivo)"],
    ["bdsm", "BDSM"],
    ["smoking", "Fumo"],
];

const SORTS = [
    ["viewers", "Più spettatori"],
    ["popular", "In evidenza (ordine del sito)"],
    ["new", "Nuove"],
];

class DefaultExtension extends MProvider {
    constructor() {
        super();
        this.client = new Client();
        this.cache = {};
    }

    getHeaders(url) {
        return { "User-Agent": UA };
    }

    async json(url) {
        var res;
        try {
            res = await this.client.get(url, {
                "Referer": BASE + "/",
                "X-Requested-With": "XMLHttpRequest",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
            });
        } catch (e) {
            throw new Error("BongaCams non risponde (problema di connessione). Controlla la rete e tocca Riprova.");
        }
        var body = String(res.body || "");
        if (/<title>\s*(just a moment|attention required)/i.test(body)) {
            throw new Error("BongaCams chiede il controllo del browser (Cloudflare). Tocca Webview, aspetta che il sito si apra, poi torna qui e tocca Riprova.");
        }
        // Verifica dell'età obbligatoria per legge: la fa la persona nella Webview.
        if (!/^\s*[\[{]/.test(body) && /verify your age|age[ _-]?verif|verifica (la tua |dell.)et|yoti|agekey|face ?scan/i.test(body.slice(0, 200000))) {
            throw new Error("BongaCams chiede la verifica dell'età (obbligatoria in Italia). Tocca Webview, completala, poi torna qui e tocca Riprova.");
        }
        if (res.statusCode >= 400) throw new Error("BongaCams ha risposto con errore " + res.statusCode + ". Tocca Riprova.");
        try {
            return JSON.parse(body);
        } catch (e) {
            throw new Error("BongaCams ha risposto in modo inatteso. Tocca Webview per controllare il sito, poi Riprova.");
        }
    }

    async listing(tab, opts, offset, limit) {
        var url = BASE + "/tools/listing_v3.php?livetab=" + tab + "&online_only=true&offset=" + offset + "&limit=" + limit;
        url += "&model_search%5Bbase_sort%5D=" + (opts.sort === "new" ? "new" : "popular");
        if (opts.tag) url += "&tag=" + encodeURIComponent(opts.tag);
        var data = await this.json(url);
        var list = ((data && data.models) || []).filter(function (m) { return m && m.username && m.room === "public" && m.esid; });
        return { list: list, total: (data && data.total_count) || 0 };
    }

    // Le prime 500 stanze (ordine del sito), tenute 2 minuti: servono per
    // ordinare per spettatori, per la ricerca e per ritrovare il server video.
    async bigList(tab, opts) {
        var key = [tab, opts.tag || "", opts.sort === "new" ? "new" : "popular"].join("|");
        var hit = this.cache[key];
        if (hit && Date.now() - hit.at < 120000) return hit.list;
        var r = await this.listing(tab, opts, 0, BIG);
        this.cache[key] = { at: Date.now(), list: r.list };
        return r.list;
    }

    card(m) {
        var thumb = String(m.thumb_image || "").replace("{ext}", "jpg");
        if (thumb.indexOf("//") === 0) thumb = "https:" + thumb;
        return {
            name: (m.display_name || m.username) + " · " + (m.viewers || 0) + " spettatori",
            imageUrl: thumb,
            link: "/" + m.username + "#e=" + m.esid,
        };
    }

    async browse(page, tab, opts, query) {
        var self = this;
        var sort = opts.sort || "viewers";
        if (sort !== "viewers" && !query) {
            var r = await this.listing(tab, opts, (page - 1) * PER_PAGE, PER_PAGE);
            return { list: r.list.map(function (m) { return self.card(m); }), hasNextPage: page * PER_PAGE < r.total && r.list.length > 0 };
        }
        var list = (await this.bigList(tab, opts)).slice();
        if (query) {
            var q = query.toLowerCase();
            list = list.filter(function (m) {
                return String(m.username).toLowerCase().indexOf(q) !== -1 || String(m.display_name || "").toLowerCase().indexOf(q) !== -1;
            });
        }
        if (sort === "viewers") list.sort(function (a, b) { return (b.viewers || 0) - (a.viewers || 0); });
        var slice = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);
        return { list: slice.map(function (m) { return self.card(m); }), hasNextPage: list.length > page * PER_PAGE };
    }

    // Popolare = ragazze con più spettatori, dalla più seguita.
    async getPopular(page) {
        return this.browse(page, "female", { sort: "viewers" });
    }

    async getLatestUpdates(page) {
        return this.browse(page, "female", { sort: "new" });
    }

    pick(filters, name) {
        var f = (filters || []).filter(function (x) { return x && x.name === name; })[0];
        if (!f || !f.values) return "";
        var v = f.values[f.state || 0];
        return v ? v.value : "";
    }

    async search(query, page, filters) {
        var text = String(query || "").trim();
        var link = text.match(/bongacams\d*\.[a-z]+\/([A-Za-z0-9_-]+)/i);
        if (link) text = link[1];
        var tab = this.pick(filters, "Genere") || "female";
        var opts = { tag: this.pick(filters, "Tag"), sort: this.pick(filters, "Ordine") || "viewers" };
        var r = await this.browse(page, tab, opts, text);
        if (!r.list.length && text && page === 1) {
            // Non tra le prime 500 di quel genere: si prova negli altri.
            for (var i = 0; i < GENDERS.length && !r.list.length; i++) {
                if (GENDERS[i][0] === tab) continue;
                r = await this.browse(1, GENDERS[i][0], { sort: "viewers" }, text);
            }
        }
        return r;
    }

    user(url) {
        var raw = String(url || "").split("#")[0];
        var m = raw.match(/([A-Za-z0-9_-]+)\/?$/);
        return m ? m[1] : "";
    }

    async findModel(user) {
        var key = user.toLowerCase();
        for (var i = 0; i < GENDERS.length; i++) {
            var list = await this.bigList(GENDERS[i][0], {});
            for (var j = 0; j < list.length; j++) {
                if (String(list[j].username).toLowerCase() === key) return list[j];
            }
        }
        return null;
    }

    async getDetail(url) {
        var user = this.user(url);
        if (!user) throw new Error("Link di BongaCams non riconosciuto.");
        var m = await this.findModel(user);
        var lines = [m ? "In diretta adesso" : "Non in show pubblico adesso (offline, privato o tra le meno viste)."];
        if (m) {
            lines.push(m.viewers + " spettatori");
            if (m.vq) lines.push("Qualità della diretta: " + String(m.vq).split("x").pop() + "p");
        }
        var thumb = m ? this.card(m).imageUrl : "";
        var link = m ? "/" + m.username + "#e=" + m.esid : "/" + user;
        return {
            name: m ? (m.display_name || m.username) : user,
            imageUrl: thumb,
            link: link,
            description: lines.join("\n\n"),
            genre: ["Diretta"],
            status: m ? 0 : 5,
            chapters: [{ name: m ? "▶ Diretta" : "Diretta (non pubblica adesso)", url: link }],
        };
    }

    async master(user, esid) {
        if (!esid) return "";
        var url = "https://" + esid + ".bcvcdn.com/hls/stream_" + user + "/playlist.m3u8";
        try {
            var res = await this.client.get(url, { "Referer": BASE + "/", "User-Agent": UA });
            var body = String(res.body || "");
            if (res.statusCode < 400 && body.indexOf("#EXT-X-STREAM-INF") !== -1) return { url: url, body: body };
        } catch (e) {}
        return "";
    }

    async getVideoList(url) {
        var user = this.user(url);
        var esid = (String(url).match(/#e=([A-Za-z0-9-]+)/) || [])[1] || "";
        var got = await this.master(user, esid);
        if (!got) {
            var m = await this.findModel(user);
            if (!m) throw new Error(user + " non è in show pubblico adesso (offline o in privato). Riprova più tardi o scegli un'altra stanza.");
            user = m.username;
            got = await this.master(user, m.esid);
        }
        if (!got) throw new Error("La diretta di " + user + " non si apre adesso. Riprova tra poco.");
        var headers = { "Referer": BASE + "/", "Origin": BASE, "User-Agent": UA };
        var base = got.url.replace(/[^\/]*$/, "");
        var lines = got.body.split(/\r?\n/);
        var variants = [];
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].indexOf("#EXT-X-STREAM-INF:") !== 0) continue;
            var next = (lines[i + 1] || "").trim();
            if (!next || next.charAt(0) === "#") continue;
            var res = lines[i].match(/RESOLUTION=(\d+)x(\d+)/);
            // Le dirette dal telefono sono in verticale (720x960): conta il lato corto.
            var h = res ? Math.min(parseInt(res[1], 10), parseInt(res[2], 10)) : 0;
            variants.push({ h: h, url: /^https?:/i.test(next) ? next : base + next });
        }
        if (!variants.length) return [{ url: got.url, originalUrl: got.url, quality: "Diretta", headers: headers }];
        variants.sort(function (a, b) { return b.h - a.h; });
        // Si parte al massimo da 1080p; le altre restano sceglibili nel player.
        var first = variants.filter(function (v) { return v.h <= 1080; })[0] || variants[variants.length - 1];
        var ordered = [first].concat(variants.filter(function (v) { return v !== first; }));
        return ordered.map(function (v) {
            return { url: v.url, originalUrl: v.url, quality: v.h ? v.h + "p" : "Diretta", headers: headers };
        });
    }

    getFilterList() {
        var options = function (pairs) {
            return pairs.map(function (p) { return { type_name: "SelectOption", name: p[1], value: p[0] }; });
        };
        return [
            {
                type_name: "HeaderFilter",
                name: "Scrivi un nome per cercare tra le stanze in diretta, oppure incolla il link di una stanza.",
            },
            { type_name: "SelectFilter", name: "Genere", state: 0, values: options(GENDERS) },
            { type_name: "SelectFilter", name: "Tag", state: 0, values: options(TAGS) },
            { type_name: "SelectFilter", name: "Ordine", state: 0, values: options(SORTS) },
        ];
    }

    getSourcePreferences() {
        return [];
    }
}
