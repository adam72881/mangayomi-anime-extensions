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
        "version": "1.1.5",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/hypnotube.js",
    },
];

const DEFAULT_BASE = "https://hypnotube.com";
const PREF_BASE = "hypnotube_base_url";
const UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

// value = tratto di path dopo l'origine (paginazione: <base>pageN.html).
const ORDERS = [
    ["most-recent", "Recenti"],
    ["most-viewed", "Più visti"],
    ["top-rated", "Più votati"],
    ["most-discussed", "Più commentati"],
    ["longest", "Più lunghi"],
    ["top-rated/week", "Più votati della settimana"],
    ["top-rated/month", "Più votati del mese"],
    ["random", "Casuale"],
];

// Minuti. Value vuoto = nessun filtro. Si applica sulla durata in lista.
const DURATIONS = [
    ["10", "10+ minuti"],
    ["20", "20+ minuti"],
    ["45", "45+ minuti"],
];

// Canali già presenti in CHANNELS, messi in cima al filtro.
const PREFERRED_CHANNELS = [
    "23/music-pmv",
    "11/hypnosis",
    "28/sissy-training",
    "4/captions",
    "6/chastity",
    "2/asian",
];

// value con "/" = canale. Altrimenti è il testo di ricerca, codificato una sola volta.
const PRINCIPALI = [
    ["91/gooning", "Gooning"],
    ["poppers", "Poppers"],
    ["Blackedraw", "Blackedraw"],
];

const PRESETS = [
    ["sissy hypno caption", "Sissy Hypno"],
    ["egirl", "Egirl PMV"],
    ["lingerie stockings heels", "Lingerie e Tacchi"],
    ["chastity caption", "Chastity"],
    ["bnwo", "BNWO"],
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
        var h = {
            "User-Agent": UA,
            "Referer": referer || this.getBaseUrl() + "/",
        };
        var cookie = this.cookieHeader();
        if (cookie) h["Cookie"] = cookie;
        return h;
    }

    cookieHeader() {
        var c = this._cookie;
        if (!c) return "";
        var bits = [];
        for (var k in c) if (c[k]) bits.push(k + "=" + c[k]);
        return bits.join("; ");
    }

    rememberCookies(res) {
        var raw = this.headerOf(res, "set-cookie");
        if (!raw) return;
        var m = String(raw).match(/PHPSESSID=([^;\s,]+)/);
        if (!m) return;
        if (!this._cookie) this._cookie = {};
        this._cookie.PHPSESSID = m[1];
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
        return new Document(await this.getPage(url, this.headers()));
    }

    // base finisce con "/"; pagina N>1 -> base + "pageN.html".
    paged(base, page) {
        return page > 1 ? base + "page" + page + ".html" : base;
    }

    norm(s) {
        return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
    }

    minutesOf(text) {
        var m = String(text || "").trim().match(/(\d+):(\d+)(?::(\d+))?/);
        if (!m) return null;
        if (m[3] != null) return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
        return parseInt(m[1], 10);
    }

    formatCount(raw) {
        var n = parseInt(String(raw || "").replace(/[^\d]/g, ""), 10);
        if (!isFinite(n)) return String(raw || "").trim();
        if (n >= 1000000) {
            var m = n / 1000000;
            return (m >= 10 ? String(Math.round(m)) : String(Math.round(m * 10) / 10)) + "M";
        }
        if (n >= 1000) {
            var k = n / 1000;
            return (k >= 10 ? String(Math.round(k)) : String(Math.round(k * 10) / 10)) + "K";
        }
        return String(n);
    }

    // Un solo passaggio: spazio -> "+", il resto con encodeURIComponent.
    formBody(query, type) {
        var q = String(query || "").trim().replace(/\s+/g, " ");
        var enc = "";
        for (var i = 0; i < q.length; i++) {
            var c = q.charAt(i);
            enc += c === " " ? "+" : encodeURIComponent(c);
        }
        return "q=" + enc + "&type=" + type;
    }

    headerOf(res, name) {
        var h = res && res.headers;
        if (!h) return "";
        if (typeof h.get === "function") {
            var v = h.get(name);
            return v ? String(v) : "";
        }
        var keys = Object.keys(h);
        for (var i = 0; i < keys.length; i++) {
            if (String(keys[i]).toLowerCase() === name) {
                var val = h[keys[i]];
                return Array.isArray(val) ? String(val[0] || "") : String(val || "");
            }
        }
        return "";
    }

    maxPage(doc) {
        var max = 1;
        var links = doc.select('a[href*="page"]');
        for (var i = 0; i < links.length; i++) {
            var href = String(links[i].getHref || "");
            var m = href.match(/page(\d+)\.html/);
            if (m) max = Math.max(max, parseInt(m[1], 10));
        }
        return max;
    }

    channelByName(query) {
        var n = this.norm(query);
        if (!n) return "";
        for (var i = 0; i < CHANNELS.length; i++) {
            if (this.norm(CHANNELS[i][1]) === n) return CHANNELS[i][0];
        }
        for (var j = 0; j < PRINCIPALI.length; j++) {
            if (PRINCIPALI[j][0].indexOf("/") > 0 && this.norm(PRINCIPALI[j][1]) === n) return PRINCIPALI[j][0];
        }
        return "";
    }

    orderedChannels() {
        var rank = {};
        for (var i = 0; i < PREFERRED_CHANNELS.length; i++) rank[PREFERRED_CHANNELS[i]] = i;
        var front = [];
        var rest = [];
        for (var j = 0; j < CHANNELS.length; j++) {
            var at = rank[CHANNELS[j][0]];
            if (at == null) rest.push(CHANNELS[j]);
            else front[at] = CHANNELS[j];
        }
        var out = [];
        for (var k = 0; k < front.length; k++) if (front[k]) out.push(front[k]);
        return out.concat(rest);
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
            if (!name) {
                var titleEl = item.selectFirst("span.title");
                if (titleEl) name = titleEl.text.trim();
            }
            if (!name) continue;
            var timeEl = item.selectFirst("span.time");
            list.push({
                name: name,
                imageUrl: imageUrl,
                link: link,
                _minutes: timeEl ? this.minutesOf(timeEl.text) : null,
            });
        }
        var next = doc.selectFirst('a[href*="page"]');
        return { list: list, hasNextPage: !!next && list.length > 0 };
    }

    parsePlaylists(doc) {
        var list = [];
        for (var item of doc.select("div.playlist-item")) {
            var a = item.selectFirst('a[href*="/playlist/"]');
            if (!a) continue;
            var link = a.getHref;
            if (!link) continue;
            var titleEl = item.selectFirst("h4.title");
            var name = titleEl ? titleEl.text.trim() : (a.attr("title") || "");
            if (!name || name === "Favorite") continue;
            var img = item.selectFirst("img");
            var imageUrl = img ? img.attr("src") || "" : "";
            list.push({ name: name, imageUrl: imageUrl, link: link });
        }
        var next = doc.selectFirst('a[href*="page"]');
        return { list: list, hasNextPage: !!next && list.length > 0 };
    }

    applyDuration(parsed, minMinutes) {
        var src = parsed.list || [];
        var list = [];
        if (!minMinutes) {
            for (var i = 0; i < src.length; i++) {
                list.push({ name: src[i].name, imageUrl: src[i].imageUrl, link: src[i].link });
            }
            return { list: list, hasNextPage: parsed.hasNextPage };
        }
        var known = false;
        for (var j = 0; j < src.length; j++) {
            if (src[j]._minutes == null) {
                list.push(src[j]);
                continue;
            }
            known = true;
            if (src[j]._minutes >= minMinutes) list.push(src[j]);
        }
        if (known && !list.length) list = src.slice();
        var out = [];
        for (var k = 0; k < list.length; k++) {
            out.push({ name: list[k].name, imageUrl: list[k].imageUrl, link: list[k].link });
        }
        return { list: out, hasNextPage: parsed.hasNextPage };
    }

    async listing(base, page, random) {
        if (!random) return this.parseList(await this.doc(this.paged(base, page)));
        var first = await this.doc(base);
        var max = this.maxPage(first);
        var n = 1 + Math.floor(Math.random() * max);
        if (n === 1) return this.parseList(first);
        return this.parseList(await this.doc(base + "page" + n + ".html"));
    }

    isGate(html) {
        return /Checking access|JavaScript is required/.test(String(html || ""));
    }

    hasCards(html) {
        return /class="item-col col/.test(String(html || "")) || /playlist-item/.test(String(html || ""));
    }

    // Il form risponde con l'URL già pronto (anche con spazi). Non ricodificarlo.
    decodePath(path) {
        path = String(path || "");
        if (/%[0-9A-Fa-f]{2}/.test(path)) {
            try { path = decodeURIComponent(path); } catch (e) {}
        }
        return path;
    }

    pathOf(loc) {
        var base = this.getBaseUrl();
        var path = "";
        if (loc.indexOf(base) === 0) path = loc.slice(base.length);
        else {
            var m = String(loc).match(/https?:\/\/[^/]+(\/.*)$/);
            path = m ? m[1] : String(loc || "");
        }
        if (/%[0-9A-Fa-f]{2}/.test(path)) {
            try { path = decodeURIComponent(path); } catch (e) {}
        }
        return path;
    }

    returnPath(html) {
        var m = String(html || "").match(/returnPath = "([^"]+)"/);
        if (!m) return "";
        return m[1].replace(/\\\//g, "/");
    }

    // Lo spazio nell'URL diventa %20 una volta sola, qui.
    urlFor(path) {
        if (path.indexOf("http") === 0) return path.replace(/ /g, "%20");
        return this.getBaseUrl() + path.replace(/ /g, "%20");
    }

    sleep(ms) {
        return new Promise(function (resolve) {
            var timer = typeof setTimeout === "function" ? setTimeout : globalThis.setTimeout;
            if (typeof timer === "function") timer(resolve, ms);
            else {
                var end = Date.now() + ms;
                while (Date.now() < end) {}
                resolve();
            }
        });
    }

    // 10 secondi solo tra due ricerche: il POST di searchgate e la pagina N.
    // Liste, schede, playlist e getVideoList non passano di qui.
    async paceSearch() {
        var last = this._lastSearchAt || 0;
        var wait = last ? 10000 - (Date.now() - last) : 0;
        if (wait > 0) await this.sleep(wait);
        this._lastSearchAt = Date.now();
    }

    async passGate(path) {
        this._gateAttempted = true;
        path = this.decodePath(path || "/");
        if (path.indexOf("age-gate") !== -1) {
            var nested = path.match(/[?&]return=([^&]+)/);
            path = nested ? this.decodePath(nested[1]) : "/";
        }
        if (!path || path.charAt(0) !== "/") path = "/" + (path || "");
        var gateHeaders = this.headers();
        gateHeaders["Content-Type"] = "application/json";
        gateHeaders["Accept"] = "application/json";
        gateHeaders["Origin"] = this.getBaseUrl();
        var res = await this.client.post(
            this.getBaseUrl() + "/age-gate?return=" + encodeURIComponent(path),
            gateHeaders,
            { timeZone: "UTC", languages: ["en"] },
        );
        this.rememberCookies(res);
        var body = res && res.body ? String(res.body) : "";
        if (/"blocked"\s*:\s*true/.test(body)) return false;
        this._sessionReady = true;
        return true;
    }

    async ensureSession() {
        if (this._sessionReady) return;
        if (this._sessionPromise) {
            await this._sessionPromise;
            return;
        }
        if (this._gateAttempted) return;
        this._sessionPromise = this.passGate("/");
        try { await this._sessionPromise; }
        finally { this._sessionPromise = null; }
    }

    // Una GET. Il controllo di accesso si fa una volta per sessione, poi si riusa il cookie.
    async getPage(url, headers) {
        await this.ensureSession();
        var h = headers || this.headers();
        var cookie = this.cookieHeader();
        if (cookie) h["Cookie"] = cookie;
        var res = await this.client.get(url, h);
        this.rememberCookies(res);
        var html = res && res.body ? String(res.body) : "";
        var loc = this.headerOf(res, "location");
        if (!this.isGate(html) && !/age-gate/.test(loc)) return html;
        if (this._gateRetried) return html;
        this._gateRetried = true;
        this._sessionReady = false;
        await this.passGate(this.pathOf(url) || "/");
        h = this.headers();
        res = await this.client.get(url, h);
        this.rememberCookies(res);
        return res && res.body ? String(res.body) : "";
    }

    async openGated(path) {
        if (!path) return "";
        if (path.charAt(0) !== "/") path = "/" + path;
        var gateHeaders = this.headers();
        gateHeaders["Content-Type"] = "application/json";
        gateHeaders["Accept"] = "application/json";
        gateHeaders["Origin"] = this.getBaseUrl();
        var gated = await this.client.post(
            this.getBaseUrl() + "/age-gate?return=" + encodeURIComponent(path),
            gateHeaders,
            { timeZone: "UTC", languages: ["en"] },
        );
        this.rememberCookies(gated);
        var getHeaders = this.headers();
        getHeaders["Referer"] = this.getBaseUrl() + "/searchgate.php";
        return this.searchGet(this.urlFor(path), getHeaders);
    }

    // GET della stessa ricerca: niente attesa. L'attesa sta solo prima di searchgate e della pagina N.
    async searchGet(url, headers) {
        var res = await this.client.get(url, headers);
        this.rememberCookies(res);
        var html = res && res.body ? String(res.body) : "";
        if (/Search error/.test(html)) {
            await this.sleep(10000);
            this._lastSearchAt = Date.now();
            res = await this.client.get(url, headers);
            this.rememberCookies(res);
            html = res && res.body ? String(res.body) : "";
        }
        return html;
    }

    // Stessa sequenza della 1.1.1: POST searchgate, poi l'URL del server.
    // I 10 secondi sono solo tra due ricerche (questo POST e la pagina N).
    async loadSearch(query, type, page, random) {
        var headers = this.headers();
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        headers["Origin"] = this.getBaseUrl();
        await this.paceSearch();
        var posted = await this.client.post(
            this.getBaseUrl() + "/searchgate.php",
            headers,
            this.formBody(query, type),
        );
        this.rememberCookies(posted);
        var html = posted && posted.body ? String(posted.body) : "";
        if (/Search error/.test(html)) {
            await this.sleep(10000);
            this._lastSearchAt = Date.now();
            headers = this.headers();
            headers["Content-Type"] = "application/x-www-form-urlencoded";
            headers["Origin"] = this.getBaseUrl();
            posted = await this.client.post(
                this.getBaseUrl() + "/searchgate.php",
                headers,
                this.formBody(query, type),
            );
            this.rememberCookies(posted);
            html = posted && posted.body ? String(posted.body) : "";
        }
        var path = this.decodePath(this.pathOf(this.headerOf(posted, "location")) || this.returnPath(html));
        if (!path) {
            var canon = html.match(/rel="canonical"\s+href="([^"]+)"/);
            if (canon) path = this.decodePath(this.pathOf(canon[1]));
        }
        if (path && (this.isGate(html) || !this.hasCards(html))) {
            html = await this.openGated(path);
            if (!this.returnPath(html)) {
                var canon2 = html.match(/rel="canonical"\s+href="([^"]+)"/);
                if (canon2) path = this.pathOf(canon2[1]);
            }
        }
        var want = page > 1 ? page : 0;
        if (random && path) {
            var max = this.maxPage(new Document(html));
            want = 1 + Math.floor(Math.random() * Math.max(1, max));
        }
        if (want > 1 && path) {
            var base = path.charAt(path.length - 1) === "/" ? path : path + "/";
            var pagePath = base + "page" + want + ".html";
            await this.paceSearch();
            var pageHeaders = this.headers();
            pageHeaders["Referer"] = this.urlFor(base);
            var pageHtml = await this.searchGet(this.urlFor(pagePath), pageHeaders);
            if (!this.hasCards(pageHtml)) pageHtml = await this.openGated(pagePath);
            if (this.hasCards(pageHtml)) html = pageHtml;
        }
        return new Document(html);
    }

    async getPopular(page) {
        return this.applyDuration(await this.listing("/most-viewed/", page, false), 0);
    }

    async getLatestUpdates(page) {
        return this.applyDuration(await this.listing("/most-recent/", page, false), 0);
    }

    channelLabel(value) {
        for (var i = 0; i < CHANNELS.length; i++) {
            if (CHANNELS[i][0] === value) return CHANNELS[i][1];
        }
        for (var j = 0; j < PRINCIPALI.length; j++) {
            if (PRINCIPALI[j][0] === value) return PRINCIPALI[j][1];
        }
        return String(value || "");
    }

    async playlistListing(base, page, random) {
        if (!random) return this.parsePlaylists(await this.doc(this.paged(base, page)));
        var first = await this.doc(base);
        var max = this.maxPage(first);
        var n = 1 + Math.floor(Math.random() * max);
        var doc = n === 1 ? first : await this.doc(base + "page" + n + ".html");
        var parsed = this.parsePlaylists(doc);
        if (!parsed.list.length) return this.parsePlaylists(first);
        return parsed;
    }

    async search(query, page, filters) {
        var tipo = this.filterValue(filters, "Tipo") || "video";
        var preset = this.filterValue(filters, "Preset sessione");
        var principale = this.filterValue(filters, "Categorie principali");
        var channel = this.filterValue(filters, "Categoria");
        var order = this.filterValue(filters, "Ordine") || "most-recent";
        if (tipo === "playlist") {
            var qpl = (query && String(query).trim()) || preset || "";
            if (!qpl && principale) qpl = this.channelLabel(principale);
            if (!qpl && channel) qpl = this.channelLabel(channel);
            if (qpl) {
                var found = this.parsePlaylists(await this.loadSearch(qpl, "playlists", page, false));
                if (found.list.length) return found;
            }
            var basePl = "/playlists/";
            if (!qpl && order === "most-viewed") basePl = "/playlists/views/";
            else if (!qpl && order === "top-rated") basePl = "/playlists/rating/";
            // Più lunghi, più commentati, settimana e mese non hanno una pagina playlist: si resta su /playlists/.
            return this.playlistListing(basePl, page, !qpl && order === "random");
        }

        var minMinutes = parseInt(this.filterValue(filters, "Durata minima") || "0", 10) || 0;
        var random = order === "random";
        var text = query && String(query).trim() ? String(query).trim() : "";
        if (text) {
            var mapped = this.channelByName(text);
            if (mapped) {
                channel = mapped;
                text = "";
            }
        }

        var parsed;
        if (preset) {
            parsed = this.parseList(await this.loadSearch(preset, "videos", page, random));
        } else if (principale) {
            if (principale.indexOf("/") > 0) {
                parsed = await this.listing("/channels/" + principale + "/", page, random);
            } else {
                parsed = this.parseList(await this.loadSearch(principale, "videos", page, random));
            }
        } else if (text) {
            parsed = this.parseList(await this.loadSearch(text, "videos", page, random));
        } else if (channel) {
            parsed = await this.listing("/channels/" + channel + "/", page, random);
        } else {
            var path = "/" + (random ? "most-recent" : order) + "/";
            parsed = await this.listing(path, page, random);
        }
        return this.applyDuration(parsed, minMinutes);
    }

    chapterThumb(ch, thumb) {
        if (typeof thumb !== "string") return ch;
        var s = thumb.trim();
        if (/^https?:\/\//i.test(s) && !/[\u0000-\u001F]/.test(s)) ch.thumbnailUrl = s;
        return ch;
    }

    async getDetail(url) {
        var raw = String(url);
        var lastHttp = raw.lastIndexOf("http");
        if (lastHttp > 0) raw = raw.slice(lastHttp);
        var doc = await this.doc(raw);
        if (raw.indexOf("/playlist/") !== -1) {
            var parsed = this.parseList(doc);
            var h1 = doc.selectFirst("h1");
            var chapters = [];
            for (var i = 0; i < parsed.list.length; i++) {
                var ch = {
                    name: "Episodio " + (i + 1) + " - " + parsed.list[i].name,
                    url: parsed.list[i].link,
                };
                this.chapterThumb(ch, parsed.list[i].imageUrl);
                chapters.push(ch);
            }
            return {
                link: raw,
                description: (h1 ? h1.text.trim() : "Playlist") + (chapters.length ? " · " + chapters.length + " video" : ""),
                genre: [],
                status: 1,
                chapters: chapters,
            };
        }

        var description = "";
        var d = doc.selectFirst("div.main-description") || doc.selectFirst(".video-description");
        if (d) description = d.text.trim();
        if (!description) {
            var meta = doc.selectFirst('meta[name="description"]');
            if (meta) description = (meta.attr("content") || "").trim();
        }

        var stats = doc.select(".stats-list .sub-label");
        var duration = stats.length ? String(stats[0].text || "").trim() : "";
        var views = stats.length > 1 ? String(stats[1].text || "").trim() : "";
        var voteEl = doc.selectFirst("li.li-vote-percent");
        var vote = voteEl ? String(voteEl.text || "").trim() : "";
        var head = [];
        if (duration) head.push("Durata " + duration);
        if (vote) head.push("Voto " + (vote.indexOf("%") >= 0 ? vote : vote + "%"));
        if (views) head.push(this.formatCount(views) + " visualizzazioni");
        if (head.length) description = head.join(" · ") + "\n\n" + (description || "");

        var genre = [];
        var blocks = doc.select("div.tags-block");
        if (blocks.length) {
            var tags = blocks[0].select("a");
            for (var t = 0; t < tags.length && genre.length < 3; t++) {
                var name = tags[t].text.trim();
                if (name && genre.indexOf(name) === -1) genre.push(name);
            }
        }
        for (var g of doc.select("a.link12")) {
            var label = g.text.trim();
            if (label && label !== "Categories" && genre.indexOf(label) === -1) genre.push(label);
        }

        var og = doc.selectFirst('meta[property="og:image"]');
        var chapter = { name: "Episodio 1", url: raw };
        this.chapterThumb(chapter, og ? og.attr("content") : "");
        return {
            link: raw,
            description: description || "Nessuna descrizione.",
            genre: genre,
            status: 1,
            chapters: [chapter],
        };
    }

    async getVideoList(url) {
        var raw = String(url);
        try { raw = decodeURIComponent(raw); } catch (e) {}
        var lastHttp = raw.lastIndexOf("http");
        if (lastHttp > 0) raw = raw.slice(lastHttp);
        var pageUrl = raw.indexOf("http") === 0 ? raw : this.getBaseUrl() + raw;

        var html = await this.getPage(pageUrl, this.headers());
        var s = String(html || "").match(/<source[^>]+src="([^"]+\.mp4[^"]*)"/);
        if (!s) s = String(html || "").match(/https?:\/\/media\.hypnotube\.com\/[^\s'"]+\.mp4[^\s'"]*/);
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
                name: "Preset, poi Categorie principali, poi il testo, poi la categoria. Durata e Casuale si applicano ai video.",
            },
            {
                type_name: "SelectFilter",
                name: "Tipo",
                state: 0,
                values: [
                    { type_name: "SelectOption", name: "Video", value: "video" },
                    { type_name: "SelectOption", name: "Playlist", value: "playlist" },
                ],
            },
            { type_name: "SelectFilter", name: "Preset sessione", state: 0, values: this.options(PRESETS, "Nessuno") },
            { type_name: "SelectFilter", name: "Categorie principali", state: 0, values: this.options(PRINCIPALI, "Nessuna") },
            { type_name: "SelectFilter", name: "Ordine", state: 0, values: this.options(ORDERS, "") },
            { type_name: "SelectFilter", name: "Durata minima", state: 0, values: this.options(DURATIONS, "Tutte") },
            { type_name: "SelectFilter", name: "Categoria", state: 0, values: this.options(this.orderedChannels(), "Tutte") },
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
