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
        "version": "1.3.3",
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
    ["italian", "Italiane (#italian)"],
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

    headers(origin) {
        return { "Referer": (origin || BASE) + "/", "Accept-Language": "it-IT,it;q=0.9,en;q=0.8" };
    }

    // Il sito ha anche la versione italiana it.chaturbate.com, ed è lì che la
    // Webview finisce dopo la verifica e il login. Mangayomi salva i cookie
    // dell'ultimo indirizzo visitato e cancella quelli dell'altro: se la verifica
    // o il login valgono solo su uno dei due, sull'altro il sito li chiede di
    // nuovo. Si provano tutti e due e si ricorda quello che funziona.
    hosts() {
        var first = this._host || BASE;
        var other = first === BASE ? "https://it.chaturbate.com" : BASE;
        return [first, other];
    }

    // path = "/api/…". check(data) facoltativo: false = risposta non buona su
    // questo indirizzo (es. seguite senza login), si prova l'altro.
    async json(path, check) {
        var hosts = this.hosts();
        var lastError = null, lastData;
        for (var i = 0; i < hosts.length; i++) {
            try {
                var data = await this.jsonFrom(hosts[i] + path, hosts[i]);
                lastData = data;
                if (check && data && !check(data)) continue;
                this._host = hosts[i];
                return data;
            } catch (e) {
                lastError = e;
            }
        }
        if (lastData !== undefined) return lastData;
        throw lastError;
    }

    async jsonFrom(url, origin) {
        var res;
        try {
            res = await this.client.get(url, this.headers(origin));
        } catch (e) {
            throw new Error("Chaturbate non risponde (problema di connessione). Controlla la rete e tocca Riprova.");
        }
        var body = String(res.body || "");
        // Verifica dell'età obbligatoria per legge (in Italia: Yoti, Face Scan,
        // AgeKey). Non si aggira: la fa la persona nella Webview, poi l'app usa
        // lo stesso accesso. Il sito la chiede di nuovo dopo un po' di inattività.
        if ((res.statusCode === 401 || res.statusCode === 403 || res.statusCode === 451 || !/^\s*[\[{]/.test(body)) && /verify your age|age[ _-]?verif|ageverif|visitors in italy|yoti|agekey|face ?scan|age_gate|agegate/i.test(body.slice(0, 200000)) ||
            /^\s*\{/.test(body) && /"(?:code|error|detail|status)"\s*:\s*"[^"]*age[ _-]?verif/i.test(body.slice(0, 2000))) {
            throw new Error("Chaturbate chiede la verifica dell'età (obbligatoria in Italia). Tocca Webview, scegli un metodo (Yoti, Face Scan o AgeKey) e completala, poi torna qui e tocca Riprova. Dopo un po' di inattività il sito la chiede di nuovo.");
        }
        if (res.statusCode === 403 || res.statusCode === 429 || /<title>\s*(just a moment|attention required)/i.test(body)) {
            throw new Error("Chaturbate chiede una verifica. Tocca Webview, superala e poi tocca Riprova.");
        }
        if (res.statusCode === 404) return null;
        if (res.statusCode >= 400) throw new Error("Chaturbate ha risposto con errore " + res.statusCode + ". Tocca Riprova.");
        try {
            return JSON.parse(body);
        } catch (e) {
            throw new Error("Chaturbate ha risposto con una pagina invece che con l'elenco: probabilmente chiede una verifica (età o sicurezza). Tocca Webview, completala e poi tocca Riprova.");
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
        var url = "/api/ts/roomlist/room-list/?limit=" + PER_PAGE + "&offset=" + ((page - 1) * PER_PAGE);
        if (opts.gender && !opts.follow) url += "&genders=" + opts.gender;
        if (opts.hashtag) url += "&hashtags=" + encodeURIComponent(opts.hashtag);
        if (opts.keywords) url += "&keywords=" + encodeURIComponent(opts.keywords);
        if (opts.newCams) url += "&new_cams=true";
        // Stanze seguite: stessa lista con follow=true (offline=true per quelle
        // non in diretta). Funziona solo con l'accesso fatto nella Webview: i
        // cookie della Webview passano all'estensione. Senza accesso il sito
        // ignora follow e manda la lista normale, con is_following falso.
        if (opts.follow) url += "&follow=true" + (opts.offline ? "&offline=true" : "");
        // Seguite: se su un indirizzo il login non risulta (is_following falso),
        // si prova l'altro.
        var data = await this.json(url, opts.follow ? function (d) {
            var r = (d && d.rooms) || [];
            return !r.length || r.some(function (x) { return x.is_following; });
        } : null);
        var rooms = (data && data.rooms) || [];
        if (opts.follow && page === 1) {
            if (rooms.length && !rooms.some(function (r) { return r.is_following; })) {
                throw new Error("Per vedere le stanze che segui devi accedere al tuo account: tocca Webview (si apre Chaturbate), fai il login, poi torna qui e tocca Riprova.");
            }
            if (!rooms.length) {
                throw new Error(opts.offline ? "Non segui ancora nessuna stanza." : "Nessuna delle stanze che segui è in diretta adesso. Prova «Le mie seguite (offline)».");
            }
        }
        // Solo le stanze che si aprono (diretta pubblica); le seguite offline restano tutte.
        var list = rooms.filter(function (r) {
            return r && r.username && (opts.offline || !r.current_show || r.current_show === "public");
        }).map(function (r) {
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

    setting(key) {
        try { return new SharedPreferences().get(key); } catch (e) { return null; }
    }

    // Popolari: le camgirl in diretta, prima quelle con più spettatori; oppure,
    // se l'hai scelto nelle impostazioni, le stanze che segui.
    async getPopular(page) {
        if (this.setting("cb_popular_follow") === true) return this.rooms(page, { follow: true });
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
        var show = this.pick(filters, "Mostra", "");
        return this.rooms(page, {
            gender: gender,
            hashtag: hashtag,
            keywords: text,
            newCams: show === "new",
            follow: show === "follow" || show === "follow_off",
            offline: show === "follow_off",
        });
    }

    user(url) {
        var raw = String(url || "").split("#")[0];
        var m = raw.match(/(?:chaturbate\.com)?\/?([A-Za-z0-9_]+)\/?$/);
        return m ? m[1] : "";
    }

    async context(user) {
        var ctx = await this.json("/api/chatvideocontext/" + user + "/");
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
        var headers = { "Referer": BASE + "/" + user + "/", "Origin": BASE, "User-Agent": UA };
        var wanted = String(this.setting("cb_quality") || "auto");
        // Il link principale (llhls.m3u8?token=…) vale UNA sola apertura: se lo
        // apre l'estensione, al player arriva un 403 e la diretta gira a vuoto.
        // In Auto va passato al player intatto; i link delle singole qualità
        // invece restano validi.
        var auto = {
            url: src,
            originalUrl: src,
            quality: "Auto",
            // Il player senza User-Agent si presenta come «libmpv»: meglio come la pagina.
            headers: headers,
        };
        if (wanted === "auto") return [auto];
        var master = "";
        try {
            master = String((await this.client.get(src, headers)).body || "");
        } catch (e) {}
        var variants = this.variants(master, src);
        if (!variants.length || !variants[0].audio) return [await this.freshAuto(user, auto)];

        // Qualità scelta: il video di quella qualità e l'audio, che su Chaturbate
        // è un flusso a parte. L'app collega l'audio del PRIMO video a tutti:
        // stesso audio per ogni qualità, e niente «Auto» nella lista (avrebbe
        // l'audio doppio).
        var target = parseInt(wanted, 10) || 1080;
        var first = variants.filter(function (v) { return v.height <= target; })[0] || variants[variants.length - 1];
        var ordered = [first].concat(variants.filter(function (v) { return v !== first; }));
        var audio = first.audio;
        return ordered.map(function (v) {
            return {
                url: v.url,
                originalUrl: v.url,
                quality: v.height + "p" + (v.fps >= 50 ? "60" : ""),
                headers: headers,
                audios: [{ file: audio, label: "Audio" }],
            };
        });
    }

    // Il link letto per le qualità è ormai usato: per il player ne serve uno nuovo.
    async freshAuto(user, auto) {
        var ctx = await this.context(user);
        if (!ctx.hls_source) throw new Error(user + " ha appena chiuso la diretta.");
        auto.url = auto.originalUrl = String(ctx.hls_source);
        return auto;
    }

    // Le qualità del file principale della diretta, dalla più alta: indirizzo del
    // video e dell'audio (#EXT-X-MEDIA TYPE=AUDIO dello stesso gruppo).
    variants(master, src) {
        var origin = (src.match(/^https?:\/\/[^\/]+/) || [""])[0];
        var abs = function (u) { return /^https?:\/\//i.test(u) ? u : origin + (u.charAt(0) === "/" ? "" : "/") + u; };
        var audios = {};
        var am = /#EXT-X-MEDIA:([^\n]*TYPE=AUDIO[^\n]*)/g, a;
        while ((a = am.exec(master)) !== null) {
            var g = (a[1].match(/GROUP-ID="([^"]+)"/) || ["", ""])[1];
            var u = (a[1].match(/URI="([^"]+)"/) || ["", ""])[1];
            if (g && u && !audios[g]) audios[g] = abs(u);
        }
        var lines = master.split(/\r?\n/);
        var out = [];
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].indexOf("#EXT-X-STREAM-INF:") !== 0) continue;
            var info = lines[i];
            var next = (lines[i + 1] || "").trim();
            if (!next || next.charAt(0) === "#") continue;
            var res = info.match(/RESOLUTION=\d+x(\d+)/);
            out.push({
                height: res ? parseInt(res[1], 10) : 0,
                fps: parseFloat((info.match(/FRAME-RATE=([\d.]+)/) || ["", "0"])[1]) || 0,
                bandwidth: parseInt((info.match(/BANDWIDTH=(\d+)/) || ["", "0"])[1], 10) || 0,
                url: abs(next),
                audio: audios[(info.match(/AUDIO="([^"]+)"/) || ["", ""])[1]] || "",
            });
        }
        out.sort(function (x, y) { return y.height - x.height || y.fps - x.fps || y.bandwidth - x.bandwidth; });
        return out;
    }

    getFilterList() {
        var options = function (pairs) {
            return pairs.map(function (p) { return { type_name: "SelectOption", name: p[1], value: p[0] }; });
        };
        return [
            {
                type_name: "HeaderFilter",
                name: "Scrivi un nome o una parola, oppure incolla il link di una stanza. «Le mie seguite» vuole l'accesso: tocca Webview e fai il login su Chaturbate.",
            },
            { type_name: "SelectFilter", name: "Genere", state: 0, values: options(GENDERS) },
            { type_name: "SelectFilter", name: "Hashtag", state: 0, values: options(HASHTAGS) },
            {
                type_name: "SelectFilter",
                name: "Mostra",
                state: 0,
                values: options([
                    ["", "Tutte"],
                    ["new", "Solo nuove"],
                    ["follow", "Le mie seguite (in diretta)"],
                    ["follow_off", "Le mie seguite (offline)"],
                ]),
            },
        ];
    }

    getSourcePreferences() {
        return [
            {
                key: "cb_quality",
                listPreference: {
                    title: "Qualità",
                    summary: "Auto: il player prende la più alta (spesso 1080p). Se scegli una qualità, nel player trovi anche le altre. Se una diretta resta muta o si blocca, torna su Auto.",
                    valueIndex: 0,
                    entries: ["Auto (consigliata)", "1080p", "720p", "480p", "360p", "240p"],
                    entryValues: ["auto", "1080", "720", "480", "360", "240"],
                },
            },
            {
                key: "cb_popular_follow",
                switchPreferenceCompat: {
                    title: "Popolari = le stanze che segui",
                    summary: "Serve l'accesso: apri la sorgente, tocca Webview (si apre Chaturbate), fai il login e torna indietro. Il login resta salvato nell'app.",
                    value: false,
                },
            },
        ];
    }
}
