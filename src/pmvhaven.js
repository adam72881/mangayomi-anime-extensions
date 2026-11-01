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
        "version": "1.1.7",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/pmvhaven.js",
    },
];

const DEFAULT_BASE = "https://pmvhaven.com";
const PREF_BASE = "pmvhaven_base_url";
const PREF_PROFILES = "pmvhaven_recent_profiles";
const UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

// Ordini video della home (sort di /api/videos). «Più visti» sul sito è disabilitato in UI ma l'API risponde.
const VIDEO_ORDERS = [
    ["-releaseDate", "Più recenti"],
    ["releaseDate", "Più vecchi"],
    ["-bayesianRating", "Più votati"],
    ["-views", "Più visti"],
    ["-likes", "Più apprezzati"],
    ["-duration", "Più lunghi"],
    ["duration", "Più corti"],
    ["random", "Casuale"],
];

// Ordini della pagina Playlist, valori uguali a playlistSortOptions del sito.
const PLAYLIST_ORDERS = [
    ["-createdAt", "Più recenti"],
    ["createdAt", "Più vecchi"],
    ["-views", "Più visti"],
    ["-bayesianRating", "Valutazione più alta"],
    ["-likes", "Più apprezzati"],
    ["random", "Casuale"],
];

// Pill e tag rapidi della home. Raccomandato richiede il login (personalizedOnly vuoto).
const SECTIONS = [
    ["", "Tutti i video"],
    ["trending", "Di tendenza"],
    ["popular", "Popolare"],
    ["tag:HMV", "HMV"],
    ["tag:TikTok", "TikTok"],
    ["tag:Hypno", "Ipnosi"],
    ["tag:Korean BJ", "BJ coreano"],
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

    rememberProfile(name) {
        name = this.cleanLine(name);
        if (!name) return;
        try {
            var prefs = new SharedPreferences();
            var raw = prefs.getString(PREF_PROFILES, "") || "";
            var list = [name];
            var parts = String(raw).split("\n");
            for (var i = 0; i < parts.length && list.length < 3; i++) {
                var s = parts[i].trim();
                if (s && s.toLowerCase() !== name.toLowerCase()) list.push(s);
            }
            prefs.setString(PREF_PROFILES, list.join("\n"));
        } catch (e) {}
    }

    recentProfiles() {
        var raw = "";
        try { raw = new SharedPreferences().getString(PREF_PROFILES, "") || ""; } catch (e) {}
        var out = [];
        var seen = {};
        var parts = String(raw).split("\n");
        for (var i = 0; i < parts.length && out.length < 3; i++) {
            var s = parts[i].trim();
            var key = s.toLowerCase();
            if (!s || seen[key]) continue;
            seen[key] = true;
            out.push(s);
        }
        return out;
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
            var name = this.cleanLine(v && v.title);
            if (!v || !v._id || !name) continue;
            var item = {
                name: name,
                imageUrl: this.httpUrl(v.thumbnailUrl || v.thumbnail),
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
            var name = this.cleanLine(p && p.name);
            if (!p || !p._id || !name) continue;
            list.push({
                name: name,
                imageUrl: this.httpUrl(p.thumbnailUrl || p.thumbnail),
                link: "/playlists/" + p._id,
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

    async loadQuery(path, page, random, maxRandom) {
        var join = path.indexOf("?") >= 0 ? "&" : "?";
        if (!random) return this.api(path + join + "page=" + page);
        var cap = maxRandom || 0;
        if (cap) {
            var n = 1 + Math.floor(Math.random() * cap);
            var picked = await this.api(path + join + "page=" + n);
            var rows = picked.data || picked.videos || [];
            if (Array.isArray(rows) && rows.length) return picked;
            return this.api(path + join + "page=1");
        }
        var first = await this.api(path + join + "page=1");
        var total = this.totalPages(first);
        var n2 = 1 + Math.floor(Math.random() * total);
        if (n2 === 1) return first;
        return this.api(path + join + "page=" + n2);
    }

    async getPopular(page) {
        return this.toList(await this.api("/api/videos?sort=-views&page=" + page));
    }

    async getLatestUpdates(page) {
        return this.toList(await this.api("/api/videos?sort=-uploadDate&page=" + page));
    }

    orderQuery(order) {
        if (!order || order === "random") return { sort: "-releaseDate", random: order === "random" };
        return { sort: order, random: false };
    }

    playlistId(raw) {
        var s = String(raw || "");
        var m = s.match(/\/playlists\/([a-f0-9]{24})/i);
        if (m) return m[1];
        m = s.match(/playlist:([a-f0-9]{24})/i) || s.match(/playlist%3A([a-f0-9]{24})/i);
        if (m) return m[1];
        return "";
    }

    playlistVideos(json) {
        var d = json && json.data;
        var pag = (json && (json.pagination || json.meta)) || {};
        if (Array.isArray(d)) return { info: {}, videos: d, pagination: pag };
        var info = d && typeof d === "object" ? d : (json || {});
        var vids = info.videoDetails;
        if (!Array.isArray(vids) || !vids.length) {
            if (Array.isArray(info.videos) && info.videos[0] && info.videos[0]._id) vids = info.videos;
            else vids = [];
        }
        if (!pag.page && info.pagination) pag = info.pagination;
        return { info: info, videos: vids, pagination: pag };
    }

    loginItem() {
        return {
            list: [{
                name: "Accedi dalla WebView di Mangayomi per vedere il profilo",
                imageUrl: "",
                link: "pmv:login",
            }],
            hasNextPage: false,
        };
    }

    profileStamp(value) {
        if (typeof value === "number" && isFinite(value)) return value;
        var n = Date.parse(String(value || ""));
        return isFinite(n) ? n : 0;
    }

    async myProfile(page) {
        var session = null;
        try { session = await this.api("/api/auth/session"); } catch (e) {}
        var user = session && (session.user || (session.data && session.data.user));
        var id = user && (user.id || user._id);
        if (!id) return this.loginItem();

        var favJson = {};
        var postJson = {};
        try {
            favJson = await this.api("/api/user/favorites?page=1&limit=50&sortBy=added&sortOrder=desc");
        } catch (e1) {}
        try {
            postJson = await this.api("/api/users/" + encodeURIComponent(id) + "/posts?page=1&limit=50");
        } catch (e2) {}

        var byId = {};
        var favs = favJson.favorites || favJson.videos || [];
        if (!favs.length && Array.isArray(favJson.data)) favs = favJson.data;
        for (var i = 0; i < favs.length; i++) {
            var rawFav = favs[i] || {};
            var fav = rawFav.video && rawFav.video._id ? rawFav.video : rawFav;
            if (!fav._id) continue;
            var favAt = this.profileStamp(rawFav.favoritedAt || rawFav.addedAt || fav.uploadDate || fav.releaseDate);
            byId[fav._id] = {
                id: fav._id,
                name: this.cleanLine(fav.title) || "Video",
                imageUrl: this.httpUrl(fav.thumbnailUrl || fav.thumbnail),
                at: favAt,
            };
        }
        var posts = postJson.data || postJson.posts || [];
        for (var p = 0; p < posts.length; p++) {
            var post = posts[p] || {};
            if (!post.isRepost) continue;
            var vid = post.videoId;
            var video = vid && typeof vid === "object" ? vid : (post.video || {});
            var vidId = video._id || (typeof vid === "string" ? vid : "");
            if (!vidId) continue;
            var at = this.profileStamp(post.createdAt);
            var prev = byId[vidId];
            if (prev && prev.at >= at) continue;
            byId[vidId] = {
                id: vidId,
                name: this.cleanLine(video.title) || (prev && prev.name) || "Video",
                imageUrl: this.httpUrl(video.thumbnailUrl || video.thumbnail) || (prev && prev.imageUrl) || "",
                at: at || (prev && prev.at) || 0,
            };
        }
        var rows = [];
        for (var key in byId) rows.push(byId[key]);
        rows.sort(function (a, b) { return b.at - a.at; });
        var size = 24;
        var start = (page > 1 ? page - 1 : 0) * size;
        var slice = rows.slice(start, start + size);
        var list = [];
        for (var n = 0; n < slice.length; n++) {
            list.push({ name: slice[n].name, imageUrl: slice[n].imageUrl, link: slice[n].id });
        }
        return { list: list, hasNextPage: start + size < rows.length };
    }

    async search(query, page, filters) {
        var tipo = this.filterValue(filters, "Tipo") || "video";
        if (tipo === "profile") return this.myProfile(page);
        var text = query && String(query).trim() ? String(query).trim() : "";
        var profile = this.filterValue(filters, "Profili");
        var who = text.charAt(0) === "@" ? text.slice(1).trim() : (profile ? String(profile).trim() : "");
        if (who) {
            var specP = this.orderQuery(this.filterValue(filters, "Ordine video") || "-releaseDate");
            var byPath = "/api/videos?uploader=" + encodeURIComponent(who);
            if (!specP.random) byPath += "&sort=" + encodeURIComponent(specP.sort);
            return this.toList(await this.loadQuery(byPath, page, specP.random, specP.random ? 10 : 0), 0);
        }
        var preset = this.filterValue(filters, "Preset sessione");
        var principale = this.filterValue(filters, "Categorie principali");
        var tag = this.filterValue(filters, "Categoria");
        var section = this.filterValue(filters, "Sezione");
        var vOrder = this.filterValue(filters, "Ordine video") || "-releaseDate";
        var pOrder = this.filterValue(filters, "Ordine playlist") || "-createdAt";
        if (tipo === "playlist") {
            var qpl = text || preset || principale || tag || "";
            var randomPl = pOrder === "random";
            var psort = randomPl ? "-createdAt" : pOrder;
            var plist = qpl
                ? "/api/playlists/search?q=" + encodeURIComponent(qpl) + "&sort=" + encodeURIComponent(psort)
                : "/api/playlists?isPublic=true&limit=24&sort=" + encodeURIComponent(psort);
            var plOut = this.toPlaylists(await this.loadQuery(plist, page, randomPl, randomPl ? 10 : 0));
            if (!plOut.list.length && qpl) {
                plOut = this.toPlaylists(await this.loadQuery(
                    "/api/playlists?isPublic=true&limit=24&sort=" + encodeURIComponent(psort),
                    1,
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
        var spec = this.orderQuery(vOrder);
        var random = spec.random;
        var path;
        if (section === "trending") {
            path = "/api/videos?trending=true&sort=-views";
        } else if (section === "popular") {
            path = "/api/videos?sort=-likes";
        } else if (section.indexOf("tag:") === 0) {
            path = "/api/videos?tags=" + encodeURIComponent(section.slice(4));
            if (!random) path += "&sort=" + encodeURIComponent(spec.sort);
        } else if (q) {
            path = "/api/videos/search?q=" + encodeURIComponent(q);
            if (!random) path += "&sort=" + encodeURIComponent(spec.sort);
            if (minSec) path += "&durationMin=" + minSec;
        } else {
            path = "/api/videos?sort=" + encodeURIComponent(spec.sort);
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

    // Solo cifre: dateFormat fa int.parse e un valore non intero manda in errore tutta la riga.
    millisString(value) {
        var n;
        if (typeof value === "number") n = value;
        else if (typeof value === "string" && /^\d+$/.test(value.trim())) n = Number(value.trim());
        else if (typeof value === "string") n = Date.parse(value.trim());
        else return "";
        if (!isFinite(n)) return "";
        var s = String(Math.round(n));
        return /^\d+$/.test(s) ? s : "";
    }

    httpUrl(value) {
        if (typeof value !== "string") return "";
        var s = value.trim();
        if (!/^https?:\/\//i.test(s)) return "";
        if (/[\u0000-\u001F]/.test(s)) return "";
        return s;
    }

    stripSurrogates(s) {
        var out = "";
        for (var i = 0; i < s.length; i++) {
            var c = s.charCodeAt(i);
            if (c >= 0xD800 && c <= 0xDBFF) {
                var n = s.charCodeAt(i + 1);
                if (n >= 0xDC00 && n <= 0xDFFF) {
                    out += s.charAt(i) + s.charAt(i + 1);
                    i++;
                }
                continue;
            }
            if (c >= 0xDC00 && c <= 0xDFFF) continue;
            out += s.charAt(i);
        }
        return out;
    }

    cleanBlock(value) {
        if (typeof value !== "string") return "";
        return this.stripSurrogates(value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")).trim();
    }

    cleanLine(value) {
        return this.cleanBlock(value).replace(/\s+/g, " ").trim();
    }

    videoId(item) {
        if (!item || typeof item !== "object") return "";
        var id = item._id;
        if (typeof id === "string" && id.trim()) return id.trim();
        if (id && typeof id === "object" && typeof id.$oid === "string" && id.$oid.trim()) return id.$oid.trim();
        return "";
    }

    chapterExtras(ch, dateValue, thumb) {
        var date = this.millisString(dateValue);
        if (date) ch.dateUpload = date;
        var url = this.httpUrl(thumb);
        if (url) ch.thumbnailUrl = url;
        return ch;
    }

    videoChapter(url, dateValue, thumb) {
        return this.chapterExtras({ name: "Episodio 1", url: url }, dateValue, thumb);
    }

    async getDetail(url) {
        var raw = String(url);
        if (raw.indexOf("pmv:login") !== -1) {
            return {
                link: "pmv:login",
                description: "Accedi dalla WebView di Mangayomi per vedere il profilo.",
                genre: [],
                status: 5,
                chapters: [],
            };
        }
        var id = raw.split("?")[0].split("#")[0].replace(/\/+$/, "")
            .split("/").filter(function (s) {
                return s.length > 0;
            }).pop();
        var pid = this.playlistId(raw);
        if (pid) {
            // Una sola richiesta: fetchAll scarica migliaia di video e può superare il timeout.
            var pl = await this.api("/api/playlists/" + pid + "?page=1&limit=50");
            var parsed = this.playlistVideos(pl);
            var d = parsed.info;
            var chapters = [];
            for (var i = 0; i < parsed.videos.length; i++) {
                var item = parsed.videos[i];
                var vid = this.videoId(item);
                if (!vid) continue;
                var ch = {
                    name: "Episodio " + (chapters.length + 1) + " - " + (this.cleanLine(item.title) || "Video"),
                    url: vid,
                };
                this.chapterExtras(ch, item.uploadDate, item.thumbnailUrl || item.thumbnail);
                chapters.push(ch);
            }
            var who = this.cleanLine(d.ownerUsername);
            if (!who && typeof d.owner === "string") who = this.cleanLine(d.owner);
            var about = [];
            var plot = this.cleanBlock(d.description);
            if (plot) about.push(plot);
            var detail = {
                link: "/playlists/" + pid,
                description: about.join("\n\n") || this.cleanLine(d.name) || "Playlist",
                genre: [],
                status: 1,
                chapters: chapters,
            };
            if (who) {
                detail.author = who;
                this.rememberProfile(who);
            }
            return detail;
        }

        var json = await this.api("/api/videos/" + id);
        var v = json.data || json.video || json;

        var genre = [];
        var main = Array.isArray(v.top5Tags) ? v.top5Tags.slice(0, 3) : [];
        var rest = Array.isArray(v.tags) ? v.tags : [];
        var pushGenre = function (value) {
            var s = this.cleanLine(value);
            if (s && genre.indexOf(s) === -1) genre.push(s);
        }.bind(this);
        for (var g = 0; g < main.length && genre.length < 3; g++) pushGenre(main[g]);
        for (var r = 0; r < rest.length && genre.length < 20; r++) pushGenre(rest[r]);
        var uploader = this.cleanLine(v.uploader);
        if (uploader) genre.unshift("@" + uploader);

        var head = [];
        var duration = this.cleanLine(v.duration);
        if (duration) head.push("Durata " + duration);
        var likes = Number(v.likes);
        var dislikes = Number(v.dislikes);
        if (isFinite(likes) && isFinite(dislikes) && likes + dislikes > 0) {
            head.push("Voto " + Math.round((100 * likes) / (likes + dislikes)) + "%");
        }
        if (v.views != null) head.push(this.formatCount(v.views) + " visualizzazioni");

        var body = [];
        var plot = this.cleanBlock(v.description);
        if (plot) body.push(plot);
        var music = this.cleanLine(v.music);
        if (music) body.push("♪ " + music);
        var description = head.join(" · ");
        if (body.length) description = description ? description + "\n\n" + body.join("\n") : body.join("\n");

        var play = this.httpUrl(v.videoUrl) || String(id || "");
        var detail = {
            link: String(id || ""),
            description: description || "PMVHaven",
            genre: genre,
            status: 1,
            chapters: [this.videoChapter(play, v.uploadDate, v.thumbnailUrl || v.thumbnail)],
        };
        if (uploader) {
            detail.author = uploader;
            this.rememberProfile(uploader);
        }
        return detail;
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

    profileOptions() {
        var values = [{ type_name: "SelectOption", name: "Nessuno", value: "" }];
        var names = this.recentProfiles();
        for (var i = 0; i < names.length; i++) {
            values.push({ type_name: "SelectOption", name: names[i], value: names[i] });
        }
        return values;
    }

    getFilterList() {
        return [
            {
                type_name: "HeaderFilter",
                name: "Video: Sezione e Ordine video. Playlist: Ordine playlist. La categoria resta i tag.",
            },
            {
                type_name: "SelectFilter",
                name: "Tipo",
                state: 0,
                values: [
                    { type_name: "SelectOption", name: "Video", value: "video" },
                    { type_name: "SelectOption", name: "Playlist", value: "playlist" },
                    { type_name: "SelectOption", name: "Il mio profilo", value: "profile" },
                ],
            },
            { type_name: "SelectFilter", name: "Profili", state: 0, values: this.profileOptions() },
            { type_name: "SelectFilter", name: "Sezione", state: 0, values: this.options(SECTIONS, "") },
            { type_name: "SelectFilter", name: "Ordine video", state: 0, values: this.options(VIDEO_ORDERS, "") },
            { type_name: "SelectFilter", name: "Ordine playlist", state: 0, values: this.options(PLAYLIST_ORDERS, "") },
            { type_name: "SelectFilter", name: "Preset sessione", state: 0, values: this.options(PRESETS, "Nessuno") },
            { type_name: "SelectFilter", name: "Categorie principali", state: 0, values: this.options(PRINCIPALI, "Nessuna") },
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
