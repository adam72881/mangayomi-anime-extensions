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
        "version": "1.1.1",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/pmvhaven.js",
    },
];

const DEFAULT_BASE = "https://pmvhaven.com";
const PREF_BASE = "pmvhaven_base_url";
const UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

// L'API ordina con prefisso "-" (decrescente). week/month = più votati nella finestra.
const ORDERS = [
    ["-uploadDate", "Recenti"],
    ["-views", "Più visti"],
    ["-bayesianRating", "Più votati"],
    ["-duration", "Più lunghi"],
    ["week", "Più votati della settimana"],
    ["month", "Più votati del mese"],
    ["random", "Casuale"],
    ["uploadDate", "Più vecchi"],
    ["views", "Meno visti"],
];

const DURATIONS = [
    ["600", "10+ minuti"],
    ["1200", "20+ minuti"],
    ["2700", "45+ minuti"],
];

// In cima al filtro, solo termini verificati con /api/videos/search?q=
const FRONT_TAGS = [
    ["gooning", "Gooning"],
    ["Blackedraw", "Blackedraw"],
    ["poppers", "Poppers"],
    ["pmv", "PMV"],
    ["hypno", "Hypno"],
    ["sissy", "Sissy"],
    ["egirl", "Egirl"],
    ["blonde", "Blonde"],
    ["bnwo", "BNWO"],
    ["caption", "Caption"],
    ["ahegao", "Ahegao"],
    ["stockings", "Stockings"],
    ["heels", "Heels"],
    ["lingerie", "Lingerie"],
    ["chastity", "Chastity"],
    ["asian", "Asian"],
    ["public", "Public"],
];

const PRINCIPALI = [
    ["gooning", "Gooning"],
    ["Blackedraw", "Blackedraw"],
    ["poppers", "Poppers"],
];

// Lingerie e Tacchi usa solo "lingerie": la query con tre parole non è pertinente.
const PRESETS = [
    ["sissy hypno caption", "Sissy Hypno"],
    ["pmv egirl blonde", "Egirl PMV"],
    ["lingerie", "Lingerie e Tacchi"],
    ["chastity caption", "Chastity"],
    ["bnwo", "BNWO"],
];

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
function rememberTag(pair) {
    NAME2TAG[pair[0].toLowerCase()] = pair[0];
    NAME2TAG[pair[1].toLowerCase()] = pair[0];
}
for (var _i = 0; _i < TAGS.length; _i++) rememberTag(TAGS[_i]);
for (var _j = 0; _j < FRONT_TAGS.length; _j++) rememberTag(FRONT_TAGS[_j]);

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

    toList(json, minSec) {
        var vids = json.videos || [];
        if (!vids.length && Array.isArray(json.data) && json.data[0] && json.data[0].title) vids = json.data;
        var list = [];
        var raw = [];
        for (var i = 0; i < vids.length; i++) {
            var v = vids[i];
            if (!v || !v._id || !v.title) continue;
            var item = {
                name: v.title,
                imageUrl: v.thumbnailUrl || v.thumbnail || "",
                link: v._id,
            };
            raw.push(item);
            if (minSec && v.durationSeconds != null && Number(v.durationSeconds) < minSec) continue;
            list.push(item);
        }
        if (minSec && !list.length) list = raw;
        var hasNext = json.pagination ? !!json.pagination.hasNext : list.length > 0;
        return { list: list, hasNextPage: hasNext };
    }

    toPlaylists(json) {
        var rows = json.data || json.playlists || [];
        var list = [];
        for (var i = 0; i < rows.length; i++) {
            var p = rows[i];
            if (!p || !p._id || !p.name) continue;
            list.push({
                name: p.name,
                imageUrl: p.thumbnailUrl || p.thumbnail || "",
                link: "playlist:" + p._id,
            });
        }
        var hasNext = false;
        if (json.meta) hasNext = !!(json.meta.hasMore || (json.meta.page && json.meta.totalPages && json.meta.page < json.meta.totalPages));
        else if (json.pagination) hasNext = !!json.pagination.hasNext;
        return { list: list, hasNextPage: hasNext };
    }

    totalPages(json) {
        var p = json.pagination || json.meta || {};
        var n = parseInt(p.totalPages, 10);
        return n > 0 ? n : 1;
    }

    since(days) {
        return new Date(Date.now() - days * 86400000).toISOString();
    }

    formatCount(raw) {
        var n = Number(raw);
        if (!isFinite(n)) return "";
        if (n >= 1000000) {
            var m = n / 1000000;
            return (m >= 10 ? String(Math.round(m)) : String(Math.round(m * 10) / 10)) + "M";
        }
        if (n >= 1000) {
            var k = n / 1000;
            return (k >= 10 ? String(Math.round(k)) : String(Math.round(k * 10) / 10)) + "K";
        }
        return String(Math.round(n));
    }

    orderedTags() {
        var seen = {};
        var out = [];
        function push(pair) {
            var key = pair[0].toLowerCase();
            if (seen[key]) return;
            seen[key] = true;
            out.push(pair);
        }
        for (var i = 0; i < FRONT_TAGS.length; i++) push(FRONT_TAGS[i]);
        for (var j = 0; j < TAGS.length; j++) push(TAGS[j]);
        return out;
    }

    async loadQuery(path, page, random) {
        var join = path.indexOf("?") >= 0 ? "&" : "?";
        if (!random) return this.api(path + join + "page=" + page);
        var first = await this.api(path + join + "page=1");
        var total = this.totalPages(first);
        var n = 1 + Math.floor(Math.random() * total);
        if (n === 1) return first;
        return this.api(path + join + "page=" + n);
    }

    async getPopular(page) {
        return this.toList(await this.api("/api/videos?sort=-views&page=" + page));
    }

    async getLatestUpdates(page) {
        return this.toList(await this.api("/api/videos?sort=-uploadDate&page=" + page));
    }

    orderQuery(order) {
        var sort = order || "-uploadDate";
        var extra = "";
        if (sort === "week") {
            sort = "-bayesianRating";
            extra = "&uploadDateFrom=" + encodeURIComponent(this.since(7));
        } else if (sort === "month") {
            sort = "-bayesianRating";
            extra = "&uploadDateFrom=" + encodeURIComponent(this.since(30));
        } else if (sort === "random") {
            sort = "-uploadDate";
        }
        return { sort: sort, extra: extra, random: order === "random" };
    }

    playlistSort(order) {
        if (order === "-views") return "-views";
        if (order === "views") return "views";
        if (order === "-bayesianRating") return "-bayesianRating";
        if (order === "-likes") return "-likes";
        if (order === "uploadDate") return "createdAt";
        return "-createdAt";
    }

    async search(query, page, filters) {
        var tipo = this.filterValue(filters, "Tipo") || "video";
        var text = query && String(query).trim() ? String(query).trim() : "";
        var preset = this.filterValue(filters, "Preset sessione");
        var principale = this.filterValue(filters, "Categorie principali");
        var tag = this.filterValue(filters, "Categoria");
        var order = this.filterValue(filters, "Ordine") || "-uploadDate";
        if (tipo === "playlist") {
            var qpl = text || preset || principale || tag || "";
            var psort = this.playlistSort(order);
            var plist = qpl
                ? "/api/playlists/search?q=" + encodeURIComponent(qpl) + "&sort=" + encodeURIComponent(psort)
                : "/api/playlists?isPublic=true&limit=24&sort=" + encodeURIComponent(psort);
            var plOut = this.toPlaylists(await this.loadQuery(plist, page, order === "random"));
            if (!plOut.list.length && qpl) {
                plOut = this.toPlaylists(await this.loadQuery(
                    "/api/playlists/search?q=" + encodeURIComponent(qpl),
                    page,
                    false,
                ));
            }
            if (!plOut.list.length) {
                plOut = this.toPlaylists(await this.loadQuery(
                    "/api/playlists?isPublic=true&limit=24&sort=-createdAt",
                    page,
                    false,
                ));
            }
            return plOut;
        }

        var minSec = parseInt(this.filterValue(filters, "Durata minima") || "0", 10) || 0;
        if (text) {
            var known = NAME2TAG[text.toLowerCase()];
            if (known) {
                tag = known;
                text = "";
            }
        }
        var q = preset || principale || text || tag || "";
        var spec = this.orderQuery(order);
        var random = spec.random;
        var path;
        // Senza un ordine esplicito la ricerca resta per rilevanza: sort=-uploadDate
        // spinge in cima video recenti che non c'entrano col testo.
        var scoped = !!(preset || principale || tag);
        var explicitSort = order && order !== "-uploadDate" && order !== "random";
        if (q) {
            path = "/api/videos/search?q=" + encodeURIComponent(q);
            if (scoped || explicitSort) path += "&sort=" + encodeURIComponent(spec.sort) + spec.extra;
            if (minSec) path += "&durationMin=" + minSec;
        } else {
            path = "/api/videos?sort=" + encodeURIComponent(spec.sort) + spec.extra;
            if (minSec) path += "&durationMin=" + minSec;
        }
        var json = await this.loadQuery(path, page, random);
        var out = this.toList(json, minSec);
        if (!out.list.length && q) {
            out = this.toList(await this.loadQuery(
                "/api/videos/search?q=" + encodeURIComponent(q),
                page,
                false,
            ), 0);
        }
        return out;
    }

    async getDetail(url) {
        var raw = String(url);
        var id = raw.split("?")[0].split("#")[0].replace(/\/+$/, "")
            .split("/").filter(function (s) {
                return s.length > 0;
            }).pop();
        if (raw.indexOf("playlist:") !== -1 || String(id).indexOf("playlist:") === 0) {
            var pid = String(id).replace(/^playlist:/, "");
            // fetchAll=true mette videoDetails, ma su una playlist grande è tutto il catalogo
            // (migliaia di video, decine di MB) e l'app non arriva a mostrarli. Stessi campi, a pagine.
            var chapters = [];
            var d = {};
            var pageN = 1;
            while (chapters.length < 100 && pageN <= 4) {
                var pl = await this.api("/api/playlists/" + pid + "?page=" + pageN + "&limit=50");
                d = pl.data || pl;
                var vids = d.videoDetails || [];
                if (!vids.length && pageN === 1 && Array.isArray(d.videos) && d.videos[0] && d.videos[0]._id) {
                    vids = d.videos;
                }
                for (var i = 0; i < vids.length && chapters.length < 100; i++) {
                    var item = vids[i];
                    if (!item || !item._id) continue;
                    var ch = {
                        name: "Episodio " + (chapters.length + 1) + " - " + (item.title || "Video"),
                        url: item._id,
                        thumbnailUrl: item.thumbnailUrl || item.thumbnail || "",
                    };
                    if (item.uploadDate) ch.dateUpload = String(item.uploadDate);
                    chapters.push(ch);
                }
                var pag = pl.pagination || {};
                var more = !!pag.hasMore || (pag.totalPages && pag.page && pag.page < pag.totalPages);
                if (!more || !vids.length) break;
                pageN++;
            }
            var about = [];
            if (d.ownerUsername || d.owner) about.push("Di " + (d.ownerUsername || d.owner));
            if (d.description) about.push(String(d.description));
            return {
                link: "playlist:" + pid,
                description: about.join("\n\n") || d.name || "Playlist",
                genre: [],
                status: 1,
                chapters: chapters,
            };
        }

        var json = await this.api("/api/videos/" + id);
        var v = json.data || json.video || json;

        var genre = [];
        var main = Array.isArray(v.top5Tags) ? v.top5Tags.slice(0, 3) : [];
        var rest = Array.isArray(v.tags) ? v.tags : [];
        for (var g = 0; g < main.length && genre.length < 3; g++) {
            if (main[g] && genre.indexOf(main[g]) === -1) genre.push(main[g]);
        }
        for (var r = 0; r < rest.length && genre.length < 20; r++) {
            if (rest[r] && genre.indexOf(rest[r]) === -1) genre.push(rest[r]);
        }

        var head = [];
        if (v.duration) head.push("Durata " + v.duration);
        var likes = Number(v.likes);
        var dislikes = Number(v.dislikes);
        if (isFinite(likes) && isFinite(dislikes) && likes + dislikes > 0) {
            head.push("Voto " + Math.round((100 * likes) / (likes + dislikes)) + "%");
        }
        if (v.views != null) head.push(this.formatCount(v.views) + " visualizzazioni");

        var body = [];
        if (v.description && String(v.description).trim()) body.push(String(v.description).trim());
        if (v.uploader) body.push("Di " + v.uploader);
        if (v.music && typeof v.music === "string" && v.music.trim()) body.push("♪ " + v.music.trim());
        var description = head.join(" · ");
        if (body.length) description = description ? description + "\n\n" + body.join("\n") : body.join("\n");

        return {
            link: id,
            description: description || "PMVHaven",
            genre: genre,
            status: 1,
            chapters: [{
                name: "Episodio 1",
                url: v.videoUrl || id,
                thumbnailUrl: v.thumbnailUrl || v.thumbnail || "",
            }],
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
                name: "Preset, poi Categorie principali, poi il testo o la categoria. La categoria usa la ricerca.",
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
            { type_name: "SelectFilter", name: "Categoria", state: 0, values: this.options(this.orderedTags(), "Tutte") },
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
