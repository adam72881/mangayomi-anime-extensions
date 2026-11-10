const mangayomiSources = [
    {
        "name": "Stripchat",
        "lang": "en",
        "baseUrl": "https://stripchat.com",
        "apiUrl": "",
        "iconUrl": "https://www.google.com/s2/favicons?sz=64&domain=stripchat.com",
        "typeSource": "single",
        "isNsfw": true,
        "itemType": 1,
        "version": "1.0.0",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/stripchat.js",
    },
];

// Dirette di Stripchat dall'API pubblica per i partner (go.stripchat.com), che non
// passa da Cloudflare e dà per ogni modella in diretta miniatura, spettatori e i
// link del video in più qualità:
//   GET https://go.stripchat.com/api/models?limit=60&offset=…&tag=girls/milfs&isNew=true
// Il primo file del video contiene righe «#EXT-X-MOUFLON» (indicazioni che il player
// ignora); i pezzi del video sono mp4 normali, non cifrati (provato il 10/11/2026).
const BASE = "https://stripchat.com";
const API = "https://go.stripchat.com/api/models";
const PER_PAGE = 60;
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

const GENDERS = [
    ["girls", "Ragazze"],
    ["couples", "Coppie"],
    ["trans", "Trans"],
    ["men", "Uomini"],
];

// Categorie provate: tag=girls/<nome> cambia davvero l'elenco.
const CATEGORIES = [
    ["", "Tutte"],
    ["milfs", "MILF"],
    ["mature", "Mature"],
    ["asian", "Asiatiche"],
    ["latin", "Latine"],
    ["ebony", "Ebony"],
    ["white", "Bianche"],
    ["big-tits", "Tette grandi"],
    ["small-tits", "Tette piccole"],
    ["curvy", "Curvy"],
    ["bbw", "BBW"],
    ["petite", "Minute"],
    ["hairy", "Pelose"],
    ["squirt", "Squirt"],
    ["anal", "Anal"],
    ["lovense", "Lovense (giocattolo interattivo)"],
    ["bdsm", "BDSM"],
];

const STATUS_TEXT = {
    public: "In diretta adesso",
    private: "In show privato",
    p2p: "In show privato",
    groupShow: "In show di gruppo",
    virtualPrivate: "In show privato",
    idle: "Assente un momento",
    off: "Offline",
};

class DefaultExtension extends MProvider {
    constructor() {
        super();
        this.client = new Client();
        // Le modelle viste nelle liste: la scheda e il video le ritrovano qui.
        this.seen = {};
    }

    getHeaders(url) {
        return { "User-Agent": UA };
    }

    playerHeaders(user) {
        return { "Referer": BASE + "/" + user, "Origin": BASE, "User-Agent": UA };
    }

    async json(url) {
        var res;
        try {
            res = await this.client.get(url, { "Referer": BASE + "/", "Accept-Language": "it-IT,it;q=0.9,en;q=0.8" });
        } catch (e) {
            try {
                res = await this.client.get(url, { "Referer": BASE + "/" });
            } catch (e2) {
                throw new Error("Stripchat non risponde (problema di connessione). Controlla la rete e tocca Riprova.");
            }
        }
        if (res.statusCode >= 400) throw new Error("Stripchat ha risposto con errore " + res.statusCode + ". Tocca Riprova.");
        try {
            return JSON.parse(String(res.body || ""));
        } catch (e) {
            throw new Error("Stripchat ha risposto in modo inatteso. Tocca Riprova.");
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

    thumb(m) {
        // Prima l'istantanea della diretta, poi la foto del profilo.
        return m.snapshotUrl || m.popularSnapshotUrl || m.previewUrlThumbBig || m.previewUrl || m.avatarUrl || "";
    }

    card(m) {
        m._at = Date.now();
        this.seen[String(m.username).toLowerCase()] = m;
        var viewers = m.viewersCount ? " · " + m.viewersCount + " spettatori" : "";
        return { name: m.username + viewers, imageUrl: this.thumb(m), link: "/" + m.username + "#id=" + m.id };
    }

    async models(page, opts) {
        var tag = (opts.gender || "girls") + (opts.category ? "/" + opts.category : "");
        var url = API + "?limit=" + PER_PAGE + "&offset=" + ((page - 1) * PER_PAGE) + "&tag=" + encodeURIComponent(tag).replace(/%2F/g, "/");
        if (opts.isNew) url += "&isNew=true";
        var data = await this.json(url);
        var list = (data && data.models) || [];
        return { raw: list, total: (data && data.total) || 0 };
    }

    async page(page, opts) {
        var r = await this.models(page, opts);
        var self = this;
        var cards = r.raw.filter(function (m) { return m && m.username; }).map(function (m) { return self.card(m); });
        return { list: cards, hasNextPage: r.raw.length >= PER_PAGE && (!r.total || page * PER_PAGE < r.total) };
    }

    async getPopular(page) {
        return this.page(page, { gender: "girls" });
    }

    async getLatestUpdates(page) {
        return this.page(page, { gender: "girls", isNew: true });
    }

    async search(query, page, filters) {
        var text = String(query || "").trim();
        var link = text.match(/stripchat\.com\/([A-Za-z0-9_-]+)/i);
        if (link) text = link[1];
        var opts = {
            gender: this.pick(filters, "Genere", "girls"),
            category: this.pick(filters, "Categoria", ""),
            isNew: this.pick(filters, "Mostra", "") === "new",
        };
        if (!text) return this.page(page, opts);
        // L'API non cerca per nome: si guardano le prime 5 pagine (300 dirette)
        // del genere scelto e si tengono i nomi che contengono il testo.
        if (page > 1) return { list: [], hasNextPage: false };
        var self = this;
        var pages = await Promise.all([1, 2, 3, 4, 5].map(function (p) {
            return self.models(p, opts).catch(function () { return { raw: [] }; });
        }));
        var q = text.toLowerCase();
        var hits = [];
        pages.forEach(function (r) {
            r.raw.forEach(function (m) {
                if (m && m.username && m.username.toLowerCase().indexOf(q) !== -1) hits.push(self.card(m));
            });
        });
        if (!hits.length) {
            throw new Error("Nessuna modella in diretta con «" + text + "» nel nome tra le 300 più viste. Se è offline o in privato non compare.");
        }
        return { list: hits, hasNextPage: false };
    }

    user(url) {
        var raw = String(url || "");
        var id = (raw.match(/#id=(\d+)/) || ["", ""])[1];
        var name = (raw.split("#")[0].split("?")[0].match(/([A-Za-z0-9_-]+)\/?$/) || ["", ""])[1];
        return { name: name, id: id };
    }

    // La modella: dalla lista vista da meno di 2 minuti (i link del video non
    // cambiano), altrimenti la si cerca tra le dirette per avere lo stato fresco.
    async model(u) {
        var key = u.name.toLowerCase();
        var known = this.seen[key];
        if (known && Date.now() - (known._at || 0) < 120000) return known;
        var self = this;
        var fresh = null;
        var genders = ["girls", "couples", "trans", "men"];
        for (var g = 0; g < genders.length && !fresh; g++) {
            var pages = await Promise.all([1, 2, 3].map(function (p) {
                return self.models(p, { gender: genders[g] }).catch(function () { return { raw: [] }; });
            }));
            pages.forEach(function (r) {
                r.raw.forEach(function (m) {
                    if (!fresh && m && (String(m.username).toLowerCase() === key || (u.id && String(m.id) === u.id))) fresh = m;
                });
            });
        }
        if (fresh) {
            fresh._at = Date.now();
            this.seen[key] = fresh;
        }
        return fresh || known || null;
    }

    async getDetail(url) {
        var u = this.user(url);
        if (!u.name) throw new Error("Link di Stripchat non riconosciuto.");
        var m = await this.model(u);
        var status = m ? String(m.status || "off") : "off";
        var live = !!(m && status === "public" && m.stream && m.stream.url);
        var statusText = STATUS_TEXT[status] || (m ? "Non in diretta pubblica" : "Offline (o non tra le dirette più viste)");
        var lines = [statusText];
        if (m && m.viewersCount) lines.push(m.viewersCount + " spettatori");
        if (m && m.languages && m.languages.length) lines.push("Lingue: " + m.languages.join(", "));
        return {
            name: u.name,
            imageUrl: m ? this.thumb(m) : undefined,
            link: "/" + u.name + (m && m.id ? "#id=" + m.id : ""),
            description: lines.join("\n\n"),
            genre: ["Diretta"],
            status: live ? 0 : 5,
            chapters: [{ name: live ? "▶ Diretta" : "Diretta (" + statusText.toLowerCase() + ")", url: "/" + u.name + (m && m.id ? "#id=" + m.id : "") }],
        };
    }

    async getVideoList(url) {
        var u = this.user(url);
        var m = await this.model(u);
        if (!m || m.status !== "public" || !m.stream) {
            var st = m ? (STATUS_TEXT[m.status] || "non in diretta pubblica") : "offline";
            throw new Error(u.name + ": " + st.toLowerCase() + ". Riprova più tardi o scegli un'altra stanza.");
        }
        var urls = m.stream.urls || {};
        var headers = this.playerHeaders(u.name);
        var out = [], seen = {};
        var add = function (u2, label) {
            if (!u2 || seen[u2]) return;
            seen[u2] = true;
            out.push({ url: u2, originalUrl: u2, quality: label, headers: headers });
        };
        // Prima la qualità più alta.
        var keys = Object.keys(urls).filter(function (k) { return k !== "original"; }).sort(function (a, b) {
            return (parseInt(b, 10) || 0) - (parseInt(a, 10) || 0);
        });
        var origLabel = "Originale";
        Object.keys(urls).forEach(function (k) {
            if (k !== "original" && urls[k] === urls.original) origLabel = "Originale · " + k;
        });
        add(urls.original, origLabel);
        keys.forEach(function (k) { add(urls[k], k); });
        add(m.stream.url, "Diretta");
        if (!out.length) throw new Error("Non trovo il video della diretta di " + u.name + ". Prova dalla Webview.");
        return out;
    }

    getFilterList() {
        var options = function (pairs) {
            return pairs.map(function (p) { return { type_name: "SelectOption", name: p[1], value: p[0] }; });
        };
        return [
            {
                type_name: "HeaderFilter",
                name: "Solo dirette pubbliche. Scrivi il nome di una modella (si cerca tra le 300 più viste del genere scelto) o incolla il link della sua stanza.",
            },
            { type_name: "SelectFilter", name: "Genere", state: 0, values: options(GENDERS) },
            { type_name: "SelectFilter", name: "Categoria", state: 0, values: options(CATEGORIES) },
            { type_name: "SelectFilter", name: "Mostra", state: 0, values: options([["", "Tutte"], ["new", "Solo nuove"]]) },
        ];
    }

    getSourcePreferences() {
        return [];
    }
}
