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
        "version": "1.3.6",
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
const VERSION = "1.3.6";
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
        return m.snapshotUrl || m.popularSnapshotUrl || m.previewUrlThumbBig || m.previewUrl || m.avatarUrl || "";
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
        if (show === "fav") return this.favorites(page);
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
        var first = this._site || "https://ita.stripchat.com";
        return [first, first === BASE ? "https://ita.stripchat.com" : BASE];
    }

    // window.__PRELOADED_STATE__ = {…} della pagina: l'oggetto preso contando
    // le graffe (dopo può esserci «;» o altro codice nello stesso <script>).
    preloadedState(body) {
        this._stateError = "";
        var i = body.indexOf("__PRELOADED_STATE__");
        if (i === -1) return null;
        var start = body.indexOf("{", i);
        if (start === -1) return null;
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
                var models = x.filter(function (o) { return o && typeof o === "object" && o.username && o.id && o.username !== me.username; });
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
        var at = body.indexOf("__PRELOADED_STATE__");
        if (at !== -1) bits.push("inizio «" + body.slice(at + 19, at + 19 + 70).replace(/\s+/g, " ") + "»");
        var um, ure = /username/g, k = 0;
        while ((um = ure.exec(body)) !== null && k < 2) {
            bits.push("«" + body.slice(Math.max(0, um.index - 15), um.index + 30).replace(/\s+/g, " ") + "»");
            k++;
        }
        return (this._stateError ? this._stateError + ", " : "") + bits.join(" ") + " — " + title + ", " + Math.round(body.length / 1024) + "KB, username×" + (body.match(/username/g) || []).length +
            ", model-list×" + (body.match(/model-list/g) || []).length +
            (Object.keys(globals).length ? ", " + Object.keys(globals).slice(0, 4).join(" ") : "") +
            (Object.keys(apis).length ? ", " + Object.keys(apis).slice(0, 4).join(" ") : "");
    }

    // Preferite con l'account: dopo il login nella Webview i cookie passano
    // all'estensione e la pagina /favorites del sito ha l'elenco nei suoi dati.
    async favorites(page) {
        if (page > 1) return { list: [], hasNextPage: false };
        var hosts = this.siteHosts();
        var best = null, notes = [], blocked = false, guest = false;
        for (var h = 0; h < hosts.length && !best; h++) {
            var res;
            try {
                // Senza «Accept» da pagina web il sito risponde 406.
                res = await this.client.get(hosts[h] + "/favorites", {
                    "Referer": hosts[h] + "/",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
                });
            } catch (e) {
                notes.push(hosts[h].replace("https://", "") + ": nessuna risposta");
                continue;
            }
            var body = String(res.body || "");
            if (res.statusCode === 403 || res.statusCode === 503 || /<title>\s*(just a moment|attention required)/i.test(body)) {
                blocked = true;
                notes.push(hosts[h].replace("https://", "") + ": Cloudflare");
                continue;
            }
            var d = this.preloadedState(body);
            var me = d ? this.loggedUser(d) : null;
            if (d && !me) { guest = true; continue; }
            var models = d ? this.stateModels(d, me) : this.htmlModels(body);
            if (models.length) {
                best = models;
                this._site = hosts[h];
                break;
            }
            notes.push(hosts[h].replace("https://", "") + ": " + res.statusCode + ", " + (d ? "dati letti, nessun elenco, " : "") + this.pageHints(body));
        }
        if (!best) {
            if (guest) throw new Error("Per vedere le tue preferite devi accedere: tocca Webview (si apre Stripchat), fai il login, poi torna qui e tocca Riprova.");
            if (blocked) throw new Error("Stripchat chiede una verifica (Cloudflare). Tocca Webview, aspetta che si apra la pagina, poi torna qui e tocca Riprova.");
            // Il messaggio sul telefono si taglia dopo poche righe: solo l'ultimo indirizzo.
            throw new Error("Preferiti Stripchat " + VERSION + ": " + notes[notes.length - 1]);
        }
        var self = this;
        var seenIds = {};
        var list = [];
        best.forEach(function (o) {
            var key = String(o.username).toLowerCase();
            if (seenIds[key]) return;
            seenIds[key] = true;
            var live = o.status === "public" || o.isLive === true || o.isOnline === true;
            var known = self.seen[String(o.username).toLowerCase()];
            var c = known ? self.card(known) : { name: o.username, imageUrl: self.thumb(o), link: "/" + o.username + (o.id ? "#id=" + o.id : "") };
            if (!known) self.seen[String(o.username).toLowerCase()] = Object.assign({ _at: 0 }, o);
            c.name = (live ? "● " : "") + c.name.replace(/^● /, "");
            c._live = live;
            list.push(c);
        });
        list.sort(function (a, b) { return (b._live ? 1 : 0) - (a._live ? 1 : 0); });
        list.forEach(function (c) { delete c._live; });
        return { list: list, hasNextPage: false };
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
            var direct = await this.streamById(u.id || m.id);
            if (direct) return [{ url: direct, originalUrl: direct, quality: "Diretta", headers: this.playerHeaders(u.name) }];
        }
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
        if (this.setting("sc_account_hd") === true) {
            try {
                var hd = await this.accountStreams(u.name, headers);
                // Le qualità date al tuo account vanno prima, se sono più alte.
                var extra = hd.filter(function (v) { return !seen[v.url]; });
                extra.forEach(function (v) { seen[v.url] = true; });
                if (extra.length) out = extra.concat(out);
            } catch (e) {}
        }
        return out;
    }

    setting(key) {
        try { return new SharedPreferences().get(key); } catch (e) { return null; }
    }

    // Con il login fatto nella Webview: i dati della diretta che il sito dà al
    // TUO account (stessa richiesta della pagina della stanza, con i tuoi
    // cookie). Si usano solo i link del video che il sito restituisce lì; se per
    // il tuo account non ci sono qualità più alte, non cambia niente.
    // Non provato con un account vero: da qui stripchat.com è dietro Cloudflare.
    async accountStreams(user, headers) {
        var found = [];
        var pages = [];
        this.siteHosts().forEach(function (h) {
            pages.push(h + "/api/front/v2/models/username/" + encodeURIComponent(user) + "/cam");
            pages.push(h + "/" + encodeURIComponent(user));
        });
        for (var i = 0; i < pages.length; i++) {
            var res;
            try {
                res = await this.client.get(pages[i], { "Referer": BASE + "/" + user, "Accept": i % 2 ? "text/html,application/xhtml+xml,*/*;q=0.8" : "application/json, text/plain, */*", "Accept-Language": "it-IT,it;q=0.9,en;q=0.8" });
            } catch (e) {
                continue;
            }
            if (res.statusCode >= 400) continue;
            var text = String(res.body || "").replace(/\\u002[fF]/g, "/").replace(/\\\//g, "/");
            var re = /https?:\/\/[^"'\s<>\\]+?\.m3u8[^"'\s<>\\]*/g, m;
            while ((m = re.exec(text)) !== null) {
                if (found.indexOf(m[0]) === -1) found.push(m[0]);
            }
            if (found.length) break;
        }
        // Ogni file trovato: le sue qualità (video e audio insieme, come su Stripchat).
        var out = [];
        for (var j = 0; j < found.length && j < 4; j++) {
            var master;
            try {
                master = await this.client.get(found[j], headers);
            } catch (e) {
                continue;
            }
            var body = String(master.body || "");
            if (master.statusCode >= 400 || body.indexOf("#EXTM3U") === -1) continue;
            var lines = body.split(/\r?\n/);
            var any = false;
            for (var k = 0; k < lines.length; k++) {
                if (lines[k].indexOf("#EXT-X-STREAM-INF:") !== 0) continue;
                var next = (lines[k + 1] || "").trim();
                if (!next || next.charAt(0) === "#") continue;
                var name = (lines[k].match(/NAME="([^"]+)"/) || ["", ""])[1];
                var h = (lines[k].match(/RESOLUTION=\d+x(\d+)/) || ["", ""])[1];
                var label = name || (h ? h + "p" : "Diretta");
                var abs = /^https?:/i.test(next) ? next : found[j].replace(/[^\/]*$/, "") + next;
                out.push({ url: abs, originalUrl: abs, quality: label + " · account", headers: headers, _h: parseInt(label, 10) || parseInt(h, 10) || 0 });
                any = true;
            }
            if (!any) out.push({ url: found[j], originalUrl: found[j], quality: "Diretta · account", headers: headers, _h: 0 });
        }
        // Solo se c'è davvero qualcosa sopra il 480p pubblico.
        var best = out.reduce(function (a, v) { return Math.max(a, v._h); }, 0);
        out.sort(function (a, b) { return b._h - a._h; });
        out.forEach(function (v) { delete v._h; });
        if (best <= 480 || !(await this.playable(out[0].url, headers))) return [];
        return out;
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
                values: options([["", "Tutte"], ["new", "Solo nuove"], ["fav", "Le mie preferite (account)"]]),
            },
        ];
    }

    getSourcePreferences() {
        return [
            {
                key: "sc_account_hd",
                switchPreferenceCompat: {
                    title: "Ho fatto il login: cerca l'HD",
                    summary: "Dopo il login nella Webview, per ogni diretta chiede al sito le qualità date al tuo account (720p, 1080p…) e le mette in cima nel player. Senza account lascialo spento.",
                    value: false,
                },
            },
        ];
    }
}
