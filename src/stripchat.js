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
        "version": "1.3.12",
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
const VERSION = "1.3.12";
const API = "https://go.stripchat.com/api/models";
const PER_PAGE = 60;
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

const GENDERS = [
    ["girls", "Ragazze"],
    ["couples", "Coppie"],
    ["trans", "Trans"],
    ["men", "Uomini"],
];

// Categorie provate (10/11/2026): tag=girls/<nome> cambia davvero l'elenco.
// Ignorate dal sito: featured / recommended («In evidenza» = ordine normale
// dell'elenco, cioè Popolari), hd, stockings.
const CATEGORIES = [
    ["", "Tutte"],
    ["outdoor", "All'aperto"],
    ["mobile", "Da telefono"],
    ["vr", "VR"],
    ["interactive-toys", "Giocattoli interattivi"],
    ["lovense", "Lovense"],
    ["cam2cam", "Cam2cam"],
    ["cheapest-privates", "Privati economici"],
    ["milfs", "MILF"],
    ["mature", "Mature"],
    ["granny", "Over 60"],
    ["asian", "Asiatiche"],
    ["latin", "Latine"],
    ["ebony", "Ebony"],
    ["white", "Bianche"],
    ["blondes", "Bionde"],
    ["brunettes", "More"],
    ["redheads", "Rosse"],
    ["big-tits", "Tette grandi"],
    ["small-tits", "Tette piccole"],
    ["big-ass", "Sedere grande"],
    ["curvy", "Curvy"],
    ["bbw", "BBW"],
    ["athletic", "Atletiche"],
    ["petite", "Minute"],
    ["hairy", "Pelose"],
    ["tattoos", "Tatuate"],
    ["piercings", "Piercing"],
    ["glasses", "Con gli occhiali"],
    ["lingerie", "Lingerie"],
    ["cosplay", "Cosplay"],
    ["office", "Ufficio"],
    ["shower", "Doccia"],
    ["oil-show", "Show con l'olio"],
    ["dancing", "Balli"],
    ["striptease", "Striptease"],
    ["smoking", "Fumo"],
    ["foot-fetish", "Piedi"],
    ["masturbation", "Masturbazione"],
    ["fingering", "Ditalino"],
    ["dildo-or-vibrator", "Dildo e vibratori"],
    ["squirt", "Squirt"],
    ["blowjob", "Pompini"],
    ["deepthroat", "Deepthroat"],
    ["anal", "Anal"],
    ["double-penetration", "Doppia penetrazione"],
    ["fisting", "Fisting"],
    ["ahegao", "Ahegao"],
    ["spanking", "Sculacciate"],
    ["bdsm", "BDSM"],
    ["roleplay", "Giochi di ruolo"],
    ["lesbians", "Lesbiche"],
    ["group-sex", "Sesso di gruppo"],
];

// Paesi provati: tag=girls/<paese> dà davvero modelle di quel Paese o lingua.
// Non si combina con la Categoria (due etichette insieme: il sito le ignora).
const COUNTRIES = [
    ["", "Tutti"],
    ["italian", "Italiane"],
    ["spanish", "Spagnole"],
    ["french", "Francesi"],
    ["german", "Tedesche"],
    ["romanian", "Rumene"],
    ["russian", "Russe"],
    ["ukrainian", "Ucraine"],
    ["colombian", "Colombiane"],
    ["brazilian", "Brasiliane"],
    ["american", "Americane"],
    ["japanese", "Giapponesi"],
    ["chinese", "Cinesi"],
    ["indian", "Indiane"],
    ["arab", "Arabe"],
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
        var body = String(res.body || "");
        // Verifica dell'età obbligatoria per legge (in Italia): la fa la persona
        // nella Webview, non si aggira.
        if ((res.statusCode === 401 || res.statusCode === 403 || res.statusCode === 451 || !/^\s*[\[{]/.test(body)) && /verify your age|age[ _-]?verif|ageverif|visitors in italy|yoti|agekey|face ?scan|age_gate|agegate/i.test(body.slice(0, 200000))) {
            throw new Error("Stripchat chiede la verifica dell'età (obbligatoria in Italia). Tocca Webview, completala, poi torna qui e tocca Riprova.");
        }
        if (res.statusCode >= 400) throw new Error("Stripchat ha risposto con errore " + res.statusCode + ". Tocca Riprova.");
        try {
            return JSON.parse(body);
        } catch (e) {
            throw new Error("Stripchat ha risposto con una pagina invece che con l'elenco: probabilmente chiede una verifica (età o sicurezza). Tocca Webview, completala e poi tocca Riprova.");
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
        return m.snapshotUrl || m.popularSnapshotUrl || m.previewUrlThumbBig || m.previewUrl || m.previewUrlThumbSmall || m.avatarUrl || "";
    }

    card(m) {
        m._at = Date.now();
        this.seen[String(m.username).toLowerCase()] = m;
        var viewers = m.viewersCount ? " · " + m.viewersCount + " spettatori" : "";
        return { name: m.username + viewers, imageUrl: this.thumb(m), link: "/" + m.username + "#id=" + m.id };
    }

    async models(page, opts) {
        var extra = opts.country || opts.category;
        var tag = (opts.gender || "girls") + (extra ? "/" + extra : "");
        var url = API + "?limit=" + PER_PAGE + "&offset=" + ((page - 1) * PER_PAGE) + "&tag=" + encodeURIComponent(tag).replace(/%2F/g, "/");
        if (opts.isNew) url += "&isNew=true";
        var data = await this.json(url);
        var list = (data && data.models) || [];
        return { raw: list, total: (data && data.total) || 0 };
    }

    // Solo le dirette che si aprono: pubbliche e con il video. Sotto «Ragazze» il
    // sito mette anche molte coppie: si tolgono, se restano abbastanza ragazze.
    watchable(list, gender) {
        var ok = list.filter(function (m) { return m && m.username && m.status === "public" && m.stream && m.stream.url; });
        if (gender === "girls") {
            var girls = ok.filter(function (m) { return !m.gender || m.gender === "female"; });
            if (girls.length >= 10) ok = girls;
        }
        return ok;
    }

    async page(page, opts) {
        var self = this;
        var r;
        // Ragazze senza Paese/Categoria: il sito mescola molte coppie. Due pagine del
        // sito per ogni pagina dell'app, così dopo averle tolte restano ~40 ragazze.
        if ((opts.gender || "girls") === "girls" && !opts.country && !opts.category) {
            var both = await Promise.all([this.models(page * 2 - 1, opts), this.models(page * 2, opts)]);
            r = { raw: both[0].raw.concat(both[1].raw), total: both[1].total || both[0].total, last: both[1].raw.length };
        } else {
            r = await this.models(page, opts);
            r.last = r.raw.length;
        }
        var seenIds = {};
        var cards = this.watchable(r.raw, opts.gender || "girls").filter(function (m) {
            if (seenIds[m.id]) return false;
            seenIds[m.id] = true;
            return true;
        }).map(function (m) { return self.card(m); });
        return { list: cards, hasNextPage: r.last >= PER_PAGE };
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
        var show = this.pick(filters, "Mostra", "");
        if (show === "fav" || show === "fav_all") return this.favorites(page, show === "fav_all");
        var opts = {
            gender: this.pick(filters, "Genere", "girls"),
            category: this.pick(filters, "Categoria", ""),
            country: this.pick(filters, "Paese", ""),
            isNew: show === "new",
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
            self.watchable(r.raw, "").forEach(function (m) {
                if (m.username.toLowerCase().indexOf(q) !== -1) hits.push(self.card(m));
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

    // Il sito ha anche ita.stripchat.com, ed è lì che resta la Webview dopo il
    // login: Mangayomi tiene i cookie dell'ultimo indirizzo visitato e toglie
    // quelli dell'altro, quindi login (e Cloudflare) valgono su uno solo dei due.
    // Si provano tutti e due e si ricorda quello che funziona.
    siteHosts() {
        var all = ["https://ita.stripchat.com", "https://www.stripchat.com", BASE];
        var first = this._site;
        if (first && all.indexOf(first) !== -1) {
            return [first].concat(all.filter(function (h) { return h !== first; }));
        }
        return all;
    }

    // window.__PRELOADED_STATE__ = {…} della pagina: l'oggetto preso contando
    // le graffe (dopo può esserci «;» o altro codice nello stesso <script>).
    preloadedState(body) {
        this._stateError = "";
        // Il nome compare anche nel codice della pagina («"__PRELOADED_STATE__" in
        // window»): serve il punto in cui gli viene dato il valore.
        var re = /__PRELOADED_STATE__["']?\]?\s*=(?!=)\s*/g, m, start = -1;
        while ((m = re.exec(body)) !== null) {
            var after = body.slice(re.lastIndex, re.lastIndex + 12);
            if (after.charAt(0) === "{") { start = re.lastIndex; break; }
            var jp = after.match(/^JSON\.parse\(\s*(["'])/);
            if (jp) {
                var q = jp[1], k = re.lastIndex + jp[0].length, str = "";
                while (k < body.length && body.charAt(k) !== q) {
                    if (body.charAt(k) === "\\") { str += body.substr(k, 2); k += 2; } else { str += body.charAt(k); k++; }
                }
                try { return JSON.parse(JSON.parse('"' + str.replace(/\\'/g, "'").replace(/^"|([^\\])"/g, '$1\\"') + '"')); } catch (e) {
                    this._stateError = "stato JSON.parse non leggibile";
                    return null;
                }
            }
        }
        if (start === -1) {
            this._stateError = "stato senza valore nella pagina";
            return null;
        }
        var depth = 0, inStr = false, esc = false;
        for (var j = start; j < body.length; j++) {
            var ch = body.charAt(j);
            if (inStr) {
                if (esc) esc = false;
                else if (ch === "\\") esc = true;
                else if (ch === '"') inStr = false;
            } else if (ch === '"') inStr = true;
            else if (ch === "{") depth++;
            else if (ch === "}" && --depth === 0) {
                var raw = body.slice(start, j + 1);
                try { return JSON.parse(raw); } catch (e) {}
                // Oggetto JavaScript, non JSON puro: i valori tipici del codice minimizzato.
                try {
                    return JSON.parse(this.jsToJson(raw));
                } catch (e2) {
                    this._stateError = "stato non leggibile (" + String(e2.message || e2).slice(0, 40) + ")";
                    return null;
                }
            }
        }
        return null;
    }

    // Oggetto JavaScript del codice minimizzato → JSON: nomi senza virgolette,
    // stringhe con apici singoli, !0/!1, undefined e void 0.
    jsToJson(raw) {
        var out = "", i = 0, n = raw.length;
        while (i < n) {
            var ch = raw.charAt(i);
            if (ch === '"' || ch === "'") {
                var q = ch, j = i + 1, str = "";
                while (j < n && raw.charAt(j) !== q) {
                    if (raw.charAt(j) === "\\") { str += raw.substr(j, 2); j += 2; continue; }
                    str += raw.charAt(j) === '"' ? '\\"' : raw.charAt(j);
                    j++;
                }
                if (q === "'") str = str.replace(/\\'/g, "'");
                out += '"' + str + '"';
                i = j + 1;
                continue;
            }
            var word = raw.slice(i).match(/^[A-Za-z_$][\w$]*/);
            if (word) {
                var w = word[0], rest = raw.slice(i + w.length).match(/^\s*:/);
                if (rest && /[{,]\s*$/.test(out)) out += '"' + w + '"';
                else if (w === "undefined") out += "null";
                else if (w === "void" && /^\s+0/.test(raw.slice(i + 4))) { out += "null"; i = i + 4 + raw.slice(i + 4).match(/^\s+0/)[0].length; continue; }
                else out += w;
                i += w.length;
                continue;
            }
            if (ch === "!" && (raw.charAt(i + 1) === "0" || raw.charAt(i + 1) === "1")) {
                out += raw.charAt(i + 1) === "0" ? "true" : "false";
                i += 2;
                continue;
            }
            out += ch;
            i++;
        }
        return out;
    }

    // Come il sito descrive chi sta guardando, per capire perché il login non si vede.
    userInfo(d) {
        var u = d.user;
        var keys = Object.keys(d).slice(0, 10).join(",");
        if (!u || typeof u !== "object") return "chiavi: " + keys;
        var me = u.user || u.me || u.current || u;
        var info = function (o) {
            return "id=" + (o && o.id !== undefined ? (o.id ? "sì" : String(o.id)) : "no") + " username=" + (o && o.username ? "sì" : "no") + " isGuest=" + (o ? String(o.isGuest) : "-") + (o && o.isLogged !== undefined ? " isLogged=" + o.isLogged : "");
        };
        return "user{" + Object.keys(u).slice(0, 12).join(",") + "} " + info(me) + " — chiavi: " + keys;
    }

    loggedUser(data) {
        var me = data && data.user && (data.user.user || data.user.me || data.user);
        return me && (me.id || me.username) && me.isGuest !== true ? me : null;
    }

    // L'elenco più lungo di modelle (oggetti con username e id) nei dati della pagina.
    stateModels(data, me) {
        var best = [];
        var walk = function (x, depth) {
            if (!x || typeof x !== "object" || depth > 8) return;
            if (Array.isArray(x)) {
                var models = x.filter(function (o) { return o && typeof o === "object" && o.username && o.id && (!me || o.username !== me.username); });
                if (models.length > best.length && models.length >= x.length / 2) best = models;
                x.forEach(function (o) { walk(o, depth + 1); });
                return;
            }
            Object.keys(x).forEach(function (k) { walk(x[k], depth + 1); });
        };
        walk(data, 0);
        return best;
    }

    // Pagina senza __PRELOADED_STATE__: modelle dai dati JSON sparsi nella
    // pagina («"username":"…"» con il loro id) o, in mancanza, dalle schede.
    htmlModels(body) {
        var text = body.replace(/\\"/g, '"').replace(/\\u002[fF]/g, "/");
        var out = [], seen = {};
        // Le schede hanno oggetti dentro oggetti: per ogni «"username":"…"» si
        // prende l'«"id":…» più vicino prima, nello stesso oggetto.
        var re = /["']?\busername["']?\s*:\s*["']([A-Za-z0-9_-]+)["']/g, m;
        while ((m = re.exec(text)) !== null) {
            var before = text.slice(Math.max(0, m.index - 1500), m.index);
            var ids = before.match(/["']?\bid["']?\s*:\s*\d+/g);
            var after = text.slice(m.index, m.index + 1500);
            var id = ids ? ids[ids.length - 1].match(/(\d+)$/)[1] : (after.match(/["']?\bid["']?\s*:\s*(\d+)/) || [])[1];
            if (!id || seen[m[1].toLowerCase()]) continue;
            seen[m[1].toLowerCase()] = true;
            out.push({ id: id, username: m[1], status: (after.match(/["']?\bstatus["']?\s*:\s*["'](\w+)["']/) || [])[1] });
        }
        if (out.length) return out;
        var cards = /<a\b[^>]*>/g, a;
        while ((a = cards.exec(body)) !== null) {
            if (!/class="[^"]*model[^"]*"/i.test(a[0])) continue;
            var name = (a[0].match(/href="(?:https?:\/\/[^"\/]+)?\/([A-Za-z0-9_-]{2,})"/) || [])[1];
            if (!name || seen[name.toLowerCase()] || /^(favorites|girls|couples|men|trans|login|signup|tags)$/i.test(name)) continue;
            seen[name.toLowerCase()] = true;
            out.push({ id: "", username: name });
        }
        return out;
    }

    // Per capire dove il sito mette i preferiti quando non li trovo.
    pageHints(body) {
        var title = (body.match(/<title>([^<]{0,40})/i) || ["", "senza titolo"])[1];
        var apis = {};
        (body.match(/\/api\/front\/[A-Za-z0-9_\/{}-]+/g) || []).forEach(function (x) { apis[x] = 1; });
        var globals = {};
        (body.match(/window\.__?[A-Za-z_]+__?\s*=/g) || []).forEach(function (x) { globals[x.replace(/\s*=$/, "")] = 1; });
        var bits = [];
        var as = /__PRELOADED_STATE__["']?\]?\s*=(?!=)/.exec(body);
        if (as) bits.push("valore «" + body.slice(as.index + as[0].length, as.index + as[0].length + 70).replace(/\s+/g, " ") + "»");
        else bits.push("nomi «" + (body.match(/window\.__[A-Z_]+__/g) || []).filter(function (x, i, a) { return a.indexOf(x) === i; }).slice(0, 4).join(" ") + "»");
        // Solo dove «username» ha un valore scritto (non il codice della pagina).
        var um, ure = /username["']?\s*:\s*["']/g, k = 0;
        while ((um = ure.exec(body)) !== null && k < 2) {
            bits.push("«" + body.slice(Math.max(0, um.index - 15), um.index + 30).replace(/\s+/g, " ") + "»");
            k++;
        }
        return (this._stateError ? this._stateError + ", " : "") + bits.join(" ") + " — " + title + ", " + Math.round(body.length / 1024) + "KB, username×" + (body.match(/username/g) || []).length +
            ", model-list×" + (body.match(/model-list/g) || []).length +
            (Object.keys(globals).length ? ", " + Object.keys(globals).slice(0, 4).join(" ") : "") +
            (Object.keys(apis).length ? ", " + Object.keys(apis).slice(0, 4).join(" ") : "");
    }

    // Chi è loggato, dai dati della pagina /favorites. Da ospite user è null
    // (provato il 10/11/2026 su ita.stripchat.com): i preferiti non sono schede
    // nell'HTML, il sito li chiede dopo all'API.
    viewerFrom(data) {
        var client = data && data.configV3 && data.configV3.initialClient;
        var user = client && client.user;
        if (!user || typeof user !== "object") return null;
        var id = user.id || (user.user && user.user.id);
        if (!id) return null;
        return { id: String(id), username: user.username || (user.user && user.user.username) || "" };
    }

    jwtFrom(data) {
        var client = data && data.configV3 && data.configV3.initialClient;
        var token = client && client.jwtToken;
        return typeof token === "string" ? token : "";
    }

    // Stesse intestazioni della pagina: il sito manda il token dell'accesso
    // (initialClient.jwtToken) come Authorization. Senza, l'API dei preferiti
    // risponde vuota (ospite, 200) o «invalid token» (401). Non si inventa.
    apiHeaders(origin, token) {
        var headers = {
            "Referer": origin + "/favorites",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
        };
        if (token) headers.Authorization = token;
        return headers;
    }

    async apiJson(url, headers) {
        var res = await this.client.get(url, headers);
        var body = String(res.body || "");
        var data = null;
        try { data = JSON.parse(body); } catch (e) {}
        return { status: res.statusCode, data: data, body: body };
    }

    // Schede dei preferiti. Senza il cookie di accesso l'API risponde 200 con
    // models vuoto (provato). Con l'accesso, le schede stanno in
    // /models/favorites; l'id utente, se c'è, si legge da config o dalla pagina.
    async favoriteModels(origin, viewer, token, page) {
        var headers = this.apiHeaders(origin, token);
        var offset = (page - 1) * PER_PAGE;
        var listed = await this.apiJson(origin + "/api/front/models/favorites?limit=" + PER_PAGE + "&offset=" + offset, headers);
        if (listed.status === 401 || listed.status === 403) return { auth: false, models: [], more: false };
        var models = (listed.data && listed.data.models) || [];
        var total = (listed.data && listed.data.totalCount) || models.length;
        if (page === 1) {
            var off = await this.apiJson(origin + "/api/front/models/favorites/offline?limit=" + PER_PAGE + "&offset=0", headers);
            ((off.data && off.data.models) || []).forEach(function (m) {
                if (m && m.username) models.push(m);
            });
        }
        var cfg = await this.apiJson(origin + "/api/front/v3/config/initial?requestPath=%2Ffavorites", headers);
        var apiUser = cfg.data && cfg.data.initial && cfg.data.initial.client && cfg.data.initial.client.user;
        var auth = !!(viewer && viewer.id) || !!(apiUser && (apiUser.id || apiUser.username));
        if (!models.length && viewer && viewer.id) {
            var idsRes = await this.apiJson(origin + "/api/front/users/" + encodeURIComponent(viewer.id) + "/favorites", headers);
            if (idsRes.status === 401 || idsRes.status === 403) return { auth: false, models: [], more: false };
            var ids = [];
            var bag = idsRes.data || {};
            var rawIds = bag.modelIds || bag.favoriteIds || bag.ids || [];
            if (Array.isArray(rawIds)) {
                rawIds.forEach(function (x) {
                    var id = x && typeof x === "object" ? (x.id || x.modelId) : x;
                    if (id) ids.push(String(id));
                });
            }
            var slice = ids.slice(offset, offset + PER_PAGE);
            if (slice.length) {
                var q = slice.map(function (id) { return "favoriteIds[]=" + encodeURIComponent(id); }).join("&");
                var batch = await this.apiJson(origin + "/api/front/models/favorites?" + q, headers);
                models = (batch.data && batch.data.models) || [];
                if (!models.length) {
                    var self = this;
                    var oneByOne = await Promise.all(slice.map(function (id) {
                        return self.apiJson(origin + "/api/front/models/" + encodeURIComponent(id), headers).catch(function () { return { data: null }; });
                    }));
                    oneByOne.forEach(function (r) {
                        if (r.data && r.data.username && r.data.id) models.push(r.data);
                    });
                }
                total = ids.length;
            }
        }
        return { auth: auth, models: models, more: total > offset + PER_PAGE };
    }

    // Nomi dei cookie che Mangayomi ha messo sulla richiesta. I valori non si
    // leggono e non si scrivono da nessuna parte.
    cookieNames(res) {
        var headers = (res && res.request && res.request.headers) || {};
        var raw = "";
        Object.keys(headers).forEach(function (k) {
            if (String(k).toLowerCase() === "cookie") raw = String(headers[k] || "");
        });
        var names = [];
        raw.split(";").forEach(function (part) {
            var name = part.split("=")[0].trim();
            if (name && names.indexOf(name) === -1) names.push(name);
        });
        return names;
    }

    cookieSummary(names) {
        var other = names.filter(function (n) { return n.indexOf("ABTest_") !== 0; });
        var ab = names.length - other.length;
        var shown = other.slice(0, 12);
        if (ab) shown.push("ABTest×" + ab);
        if (other.length > 12) shown.push("+" + (other.length - 12));
        return names.length + (shown.length ? " (" + shown.join(", ") + ")" : "");
    }

    sessionCookie(names) {
        return names.some(function (n) {
            return n.indexOf("ABTest_") !== 0 && /session|auth|jwt|token/i.test(n);
        });
    }

    // Preferite con l'account. Il login della Webview è un cookie di sessione:
    // Mangayomi 0.9.95 lo copia solo al cambio di indirizzo, come nome=valore.
    // L'API /models/favorites usa quel cookie. Se la pagina non ha l'utente, il
    // cookie non è partito: è un limite dell'app, non si inventa un token.
    async favorites(page, includeOffline) {
        var hosts = this.siteHosts();
        var notes = [];
        var found = null;
        var authed = false;
        for (var h = 0; h < hosts.length && !found; h++) {
            var origin = hosts[h];
            var note = { host: origin.replace("https://", ""), status: "nessuna risposta", bytes: 0, user: "null", jwt: "no", cookies: [], api: "" };
            var res;
            try {
                res = await this.client.get(origin + "/favorites", {
                    "Referer": origin + "/",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
                });
            } catch (e) {
                notes.push(note);
                continue;
            }
            var body = String(res.body || "");
            note.status = String(res.statusCode);
            note.bytes = body.length;
            note.cookies = this.cookieNames(res);
            if (res.statusCode === 403 || res.statusCode === 503 || /<title>\s*(just a moment|attention required)/i.test(body)) {
                note.api = "Cloudflare";
                notes.push(note);
                continue;
            }
            var state = this.preloadedState(body);
            var viewer = this.viewerFrom(state);
            var token = this.jwtFrom(state);
            note.user = viewer ? "sì" : "null";
            note.jwt = token ? "sì" : "no";
            var got;
            try {
                got = await this.favoriteModels(origin, viewer, token, page);
            } catch (e) {
                note.api = "API muta";
                notes.push(note);
                continue;
            }
            note.api = got.auth ? "accesso" : "ospite";
            notes.push(note);
            if (got.models.length) found = { origin: origin, models: got.models, more: got.more };
            else if (got.auth) authed = true;
        }
        if (!found) {
            var lines = notes.map(function (n) {
                return n.host + " HTTP " + n.status + ", " + Math.round(n.bytes / 1024) + "KB, user=" + n.user + ", jwt=" + n.jwt + ", cookie " + this.cookieSummary(n.cookies) + (n.api ? ", " + n.api : "");
            }, this);
            var anySession = notes.some(function (n) { return this.sessionCookie(n.cookies); }, this);
            var anyUser = notes.some(function (n) { return n.user === "sì"; });
            var cf = notes.length && notes.every(function (n) { return n.api === "Cloudflare" || n.status === "nessuna risposta"; });
            if (authed) throw new Error("Preferiti Stripchat " + VERSION + ": accesso visto ma elenco vuoto. " + lines.join(" | "));
            if (cf) throw new Error("Stripchat " + VERSION + " chiede una verifica (Cloudflare). Tocca Webview, aspetta la pagina, poi Riprova. " + lines.join(" | "));
            var limit = (!anyUser && !anySession)
                ? " Mangayomi 0.9.95 copia i cookie della Webview solo quando cambia l'indirizzo, e solo come nome=valore: il cookie di accesso non è tra quelli inviati. Dopo il login apri un'altra pagina di Stripchat nella Webview e tocca Riprova. È un limite dell'app."
                : " Il sito non ha riconosciuto l'accesso in questa richiesta.";
            throw new Error("Preferiti Stripchat " + VERSION + ". " + lines.join(" | ") + "." + limit);
        }
        this._site = found.origin;
        var gotModels = found.models;
        var more = found.more;
        // L'API dei preferiti dà hlsPlaylist, non stream.url. watchable() vuole
        // status public e uno stream: si copia la playlist lì, senza cambiare
        // il criterio.
        gotModels.forEach(function (o) {
            if (o && (!o.stream || !o.stream.url) && o.hlsPlaylist) o.stream = { url: o.hlsPlaylist };
        });
        var open = {};
        this.watchable(gotModels, "").forEach(function (o) { open[String(o.username).toLowerCase()] = o; });
        var online = [];
        var rest = [];
        var seenIds = {};
        gotModels.forEach(function (o) {
            if (!o || !o.username) return;
            var key = String(o.username).toLowerCase();
            if (seenIds[key]) return;
            seenIds[key] = true;
            if (open[key]) online.push(open[key]);
            else rest.push(o);
        });
        if (online.some(function (o) { return o.viewersCount; })) {
            online.sort(function (a, b) { return (b.viewersCount || 0) - (a.viewersCount || 0); });
        }
        if (!includeOffline && !online.length) {
            if (page > 1) return { list: [], hasNextPage: false };
            throw new Error("Nessuna delle tue preferite è in diretta adesso. Prova «Le mie preferite (anche offline)».");
        }
        var self = this;
        var show = includeOffline ? online.concat(rest) : online;
        var list = show.map(function (o) {
            var key = String(o.username).toLowerCase();
            var live = !!open[key];
            var known = self.seen[key];
            var c = known ? self.card(known) : { name: o.username, imageUrl: self.thumb(o), link: "/" + o.username + (o.id ? "#id=" + o.id : "") };
            if (!known) self.seen[key] = Object.assign({ _at: 0 }, o);
            c.name = (live ? "● " : "") + String(c.name).replace(/^● /, "");
            return c;
        });
        return { list: list, hasNextPage: !!more };
    }

    // Video da numero della modella, quando non è tra le dirette dell'elenco
    // (es. una preferita poco vista): gli indirizzi che usa il sito.
    async streamById(id) {
        var tries = [
            "https://edge-hls.saawsedge.com/hls/" + id + "/master/" + id + "_auto.m3u8",
            "https://edge-hls.saawsedge.com/hls/" + id + "/master/" + id + "_480p.m3u8",
            "https://edge-hls.doppiocdn.com/hls/" + id + "/master/" + id + "_auto.m3u8",
        ];
        for (var i = 0; i < tries.length; i++) {
            try {
                var res = await this.client.get(tries[i], { "Referer": BASE + "/", "Origin": BASE, "User-Agent": UA });
                if (res.statusCode < 400 && String(res.body || "").indexOf("#EXTM3U") !== -1) return tries[i];
            } catch (e) {}
        }
        return "";
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
        if ((!m || !m.stream) && (u.id || (m && m.id))) {
            var hid = u.id || m.id;
            var earlyHeaders = this.playerHeaders(u.name);
            var earlyNote = "";
            try {
                var early = await this.publicVideos(hid, u.name, earlyHeaders, m && m.gender);
                earlyNote = early.note;
                if (early.videos.length) return early.videos;
            } catch (e) {}
            var direct = await this.streamById(hid);
            if (direct) return [{ url: direct, originalUrl: direct, quality: this.withNote("Diretta", earlyNote), headers: earlyHeaders }];
        }
        if (!m || m.status !== "public" || !m.stream) {
            var st = m ? (STATUS_TEXT[m.status] || "non in diretta pubblica") : "offline";
            throw new Error(u.name + ": " + st.toLowerCase() + ". Riprova più tardi o scegli un'altra stanza.");
        }
        var headers = this.playerHeaders(u.name);
        var id = (m && m.id) || u.id;
        // L'API partner elenca solo 240p e 480p. La pagina pubblica della stanza
        // elenca anche 720p e 1080p quando il sito le offre a tutti: si usano
        // solo quelle, e solo se il pezzo video risponde. Il file «source»
        // indovinato (_160p) punta a una playlist che risponde 404: non si usa
        // e non si decifra.
        var out = [];
        var note = "";
        if (id) {
            try {
                var offered = await this.publicVideos(id, u.name, headers, m && m.gender);
                out = offered.videos;
                note = offered.note;
            } catch (e) {
                out = [];
                note = "preset della stanza non letti";
            }
        }
        if (!out.length) {
            var urls = m.stream.urls || {};
            var seen = {};
            var add = function (u2, label) {
                if (!u2 || seen[u2]) return;
                seen[u2] = true;
                out.push({ url: u2, originalUrl: u2, quality: label, headers: headers });
            };
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
            if (out.length) out[0].quality = this.withNote(out[0].quality, note);
        }
        if (!out.length) throw new Error("Non trovo il video della diretta di " + u.name + ". Prova dalla Webview.");
        return out;
    }

    withNote(label, note) {
        if (!note) return label;
        return label + " (" + note + ")";
    }

    cleanPresets(list) {
        var names = [];
        (list || []).forEach(function (name) {
            if (/^\d+p\d*$/.test(name) && names.indexOf(name) === -1) names.push(name);
        });
        names.sort(function (a, b) {
            var pa = a.match(/^(\d+)p(\d+)?$/), pb = b.match(/^(\d+)p(\d+)?$/);
            var ra = (parseInt(pa[1], 10) * 1000) + (pa[2] ? parseInt(pa[2], 10) : 0);
            var rb = (parseInt(pb[1], 10) * 1000) + (pb[2] ? parseInt(pb[2], 10) : 0);
            return rb - ra;
        });
        return names;
    }

    // Preset pubblici: prima l'API /api/front/models (presets + hlsPlaylist),
    // poi la pagina della stanza se la modella non è tra le prime. Il cam
    // /v2/models/username/…/cam da qui risponde 418, non si usa.
    async presetInfo(name, gender) {
        var want = String(name || "").toLowerCase();
        var tag = gender === "male" ? "men" : (gender === "maleFemale" || gender === "females") ? "couples" : gender === "tranny" ? "trans" : "girls";
        var tags = tag === "girls" ? ["girls"] : [tag, "girls"];
        for (var t = 0; t < tags.length; t++) {
            var pages = await Promise.all([0, 60, 120].map(function (offset) {
                return this.apiJson("https://ita.stripchat.com/api/front/models?limit=60&offset=" + offset + "&primaryTag=" + tags[t], {
                    "Referer": "https://ita.stripchat.com/",
                    "Accept": "application/json, text/plain, */*",
                    "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
                }).catch(function () { return { data: null }; });
            }, this));
            for (var p = 0; p < pages.length; p++) {
                var models = (pages[p].data && pages[p].data.models) || [];
                for (var i = 0; i < models.length; i++) {
                    if (!models[i] || String(models[i].username).toLowerCase() !== want) continue;
                    var presets = models[i].presets || (models[i].broadcastSettings && models[i].broadcastSettings.presets) || [];
                    return { presets: this.cleanPresets(presets), hls: models[i].hlsPlaylist || "", source: "api" };
                }
            }
        }
        var page;
        try {
            page = await this.client.get("https://ita.stripchat.com/" + encodeURIComponent(name), {
                "Referer": "https://ita.stripchat.com/",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
                "User-Agent": UA,
            });
        } catch (e) {
            return { presets: [], hls: "", source: "" };
        }
        var text = String((page && page.body) || "").replace(/\\u0022/g, '"').replace(/\\\//g, "/");
        if (!page || page.statusCode >= 400 || text.indexOf("broadcastSettings") === -1) return { presets: [], hls: "", source: "" };
        var found = text.match(/"broadcastSettings"\s*:\s*\{[\s\S]{0,900}?"presets"\s*:\s*\[([^\]]*)\]/);
        var names = [];
        if (found) {
            var re = /"(\d+p\d*)"/g, mm;
            while ((mm = re.exec(found[1])) !== null) {
                if (names.indexOf(mm[1]) === -1) names.push(mm[1]);
            }
        }
        var hls = (text.match(/https:\/\/edge-hls\.[^"'\s]+\/master\/\d+_\d+p\d*\.m3u8/) || [""])[0];
        return { presets: this.cleanPresets(names), hls: hls, source: names.length ? "page" : "" };
    }

    // Qualità pubbliche. L'API /api/front/models dà presets e hlsPlaylist senza
    // aprire l'HTML. Si tiene una qualità solo se playable() trova pezzi video
    // veri. Niente suffisso _160p e niente decifratura. Se l'HD non si apre, il
    // ripiego a 480p dice il motivo.
    async publicVideos(id, name, headers, gender) {
        var info = await this.presetInfo(name, gender);
        var names = info.presets;
        if (!names.length) return { videos: [], note: "preset della stanza non letti" };
        var best = parseInt(names[0], 10) || 0;
        if (best <= 480) return { videos: [], note: "la stanza trasmette solo " + names[0] };
        var out = [];
        for (var i = 0; i < names.length && i < 6; i++) {
            var url = info.hls && /_\d+p\d*\.m3u8/.test(info.hls)
                ? info.hls.replace(/_\d+p\d*\.m3u8/, "_" + names[i] + ".m3u8")
                : "https://edge-hls.doppiocdn.media/hls/" + id + "/master/" + id + "_" + names[i] + ".m3u8";
            if (await this.playable(url, headers)) {
                out.push({ url: url, originalUrl: url, quality: names[i], headers: headers });
            }
        }
        if (out.length && (parseInt(out[0].quality, 10) || 0) > 480) return { videos: out, note: "" };
        var hd = names.filter(function (n) { return (parseInt(n, 10) || 0) > 480; });
        return { videos: [], note: "HD in elenco (" + hd.join(", ") + ") ma la playlist non si apre" };
    }

    // Il sito può dare all'account una diretta con i nomi dei pezzi nascosti
    // («#EXT-X-MOUFLON:FILE/URI» e al posto del pezzo un finto «media.mp4»):
    // il player resta a girare. Quella si scarta e resta la diretta normale.
    async playable(url, headers) {
        try {
            var body = String((await this.client.get(url, headers)).body || "");
            if (body.indexOf("#EXT-X-STREAM-INF") !== -1) {
                var next = body.split(/\r?\n/).filter(function (l) { return l && l.charAt(0) !== "#"; })[0];
                if (!next) return false;
                url = /^https?:/i.test(next) ? next : url.replace(/[^\/]*$/, "") + next;
                body = String((await this.client.get(url, headers)).body || "");
            }
            var segs = body.split(/\r?\n/).filter(function (l) { return l && l.charAt(0) !== "#"; });
            return segs.length > 0 && !/#EXT-X-MOUFLON:(FILE|URI)/.test(body) && !segs.some(function (l) { return /(^|\/)media\.mp4(\?|$)/.test(l); });
        } catch (e) {
            return false;
        }
    }

    getFilterList() {
        var options = function (pairs) {
            return pairs.map(function (p) { return { type_name: "SelectOption", name: p[1], value: p[0] }; });
        };
        return [
            {
                type_name: "HeaderFilter",
                name: "Solo dirette che si aprono. Paese e Categoria non si combinano: se scegli un Paese vale quello. «Le mie preferite» vuole il login: tocca Webview e accedi a Stripchat.",
            },
            { type_name: "SelectFilter", name: "Genere", state: 0, values: options(GENDERS) },
            { type_name: "SelectFilter", name: "Paese", state: 0, values: options(COUNTRIES) },
            { type_name: "SelectFilter", name: "Categoria", state: 0, values: options(CATEGORIES) },
            {
                type_name: "SelectFilter",
                name: "Mostra",
                state: 0,
                values: options([
                    ["", "Tutte"],
                    ["new", "Solo nuove"],
                    ["fav", "Le mie preferite (account)"],
                    ["fav_all", "Le mie preferite (anche offline)"],
                ]),
            },
        ];
    }

    getSourcePreferences() {
        return [];
    }
}
