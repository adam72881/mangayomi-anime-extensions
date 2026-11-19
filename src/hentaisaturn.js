const mangayomiSources = [
    {
        "name": "HentaiSaturn",
        "lang": "it",
        "baseUrl": "https://www.hentaisaturn.tv",
        "apiUrl": "",
        "iconUrl": "https://www.google.com/s2/favicons?sz=64&domain=hentaisaturn.tv",
        "typeSource": "single",
        "isNsfw": true,
        "itemType": 1,
        "version": "1.0.0",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/hentaisaturn.js",
    },
];

const DEFAULT_BASE = "https://www.hentaisaturn.tv";
const PREF_BASE = "hentaisaturn_base_url";
const PREF_QUALITY = "hentaisaturn_quality";
const PREF_SERVER = "hentaisaturn_server";

// Generi con personaggi minorenni: le serie che li hanno non mostrano episodi,
// e la ricerca per queste parole non restituisce niente.
const BLOCKED = ["loli", "shota", "lolicon", "shotacon"];

// Id del modulo /filter di HentaiSaturn, letti il 19 novembre 2026.
// Loli e Shota (personaggi minorenni) non ci sono di proposito: vedi BLOCKED.
const GENRES = [
    ["1", "3D"],
    ["2", "Ahegao"],
    ["3", "Anal"],
    ["4", "BDSM"],
    ["5", "Big Boobs"],
    ["6", "Blow Job"],
    ["7", "Bondage"],
    ["8", "Boob Job"],
    ["9", "Censored"],
    ["10", "Comedy"],
    ["11", "Cosplay"],
    ["12", "Creampie"],
    ["13", "Dark Skin"],
    ["14", "Facial"],
    ["15", "Fantasy"],
    ["16", "Filmed"],
    ["17", "Foot Job"],
    ["18", "Futanari"],
    ["19", "Gangbang"],
    ["20", "Glasses"],
    ["21", "Hand Job"],
    ["22", "Harem"],
    ["25", "Horror"],
    ["26", "Incest"],
    ["27", "Inflation"],
    ["29", "Lactation"],
    ["31", "Maid"],
    ["32", "Masturbation"],
    ["33", "Milf"],
    ["34", "Mind Break"],
    ["35", "Mind Control"],
    ["36", "Monster"],
    ["37", "NTR"],
    ["38", "Nurse"],
    ["39", "Orgy"],
    ["40", "Plot"],
    ["41", "POV"],
    ["42", "Pregnant"],
    ["43", "Public Sex"],
    ["44", "Rape"],
    ["45", "Reverse Rape"],
    ["46", "Rimjob"],
    ["48", "Scat"],
    ["49", "School Girl"],
    ["52", "Softcore"],
    ["53", "Swimsuit"],
    ["54", "Teacher"],
    ["55", "Tentacle"],
    ["56", "Threesome"],
    ["57", "Toys"],
    ["58", "Trap"],
    ["59", "Tsundere"],
    ["60", "Ugly Bastard"],
    ["61", "Uncensored"],
    ["62", "Vanilla"],
    ["63", "Virgin"],
    ["64", "Watersports"],
    ["65", "X-Ray"],
    ["66", "Yaoi"],
    ["67", "Yuri"],
];

const STUDIOS = [
    ["124", "37c-Binetsu"],
    ["99", "A.C.G.T."],
    ["45", "Active"],
    ["149", "Adult Source Media"],
    ["37", "Alice Soft"],
    ["119", "Amour"],
    ["98", "ANIK"],
    ["90", "Animac"],
    ["89", "AniMan"],
    ["76", "Animax"],
    ["111", "Antechinus"],
    ["88", "An♥Tekinus"],
    ["16", "APPP"],
    ["64", "ark"],
    ["55", "Arms"],
    ["14", "Asahi Production"],
    ["153", "AtoriE"],
    ["15", "Blue Eyes"],
    ["74", "Bomb! Cute! Bomb!"],
    ["39", "BOOTLEG"],
    ["87", "BreakBottle"],
    ["1", "Bunny Walker"],
    ["107", "Bunnywalker"],
    ["146", "Celeb"],
    ["94", "Central Park Media"],
    ["151", "Chaos Project"],
    ["75", "CherryLips"],
    ["8", "ChiChinoya"],
    ["4", "CHIPPAI"],
    ["5", "ChuChu"],
    ["17", "Circle Tribute"],
    ["23", "Collaboration Works"],
    ["46", "Collaboration Works petit"],
    ["115", "COME ON"],
    ["127", "Comic Media"],
    ["136", "Cosmos"],
    ["50", "Cotton Doll"],
    ["70", "Cranberry"],
    ["101", "Creators in Pack TOKYO"],
    ["53", "Crimson"],
    ["38", "D3"],
    ["61", "Daiei"],
    ["25", "Digital Works"],
    ["19", "Discovery"],
    ["63", "E&G Films"],
    ["42", "Echo"],
    ["33", "EDGE"],
    ["147", "Elias"],
    ["91", "erozuki"],
    ["110", "Ether Kitten"],
    ["69", "Fancy Realize Media"],
    ["77", "Five Ways"],
    ["133", "Flavors Soft"],
    ["93", "Front Line"],
    ["96", "Frontier Works"],
    ["123", "G-Lam"],
    ["117", "Godoy"],
    ["137", "GodoyG"],
    ["22", "GoHands"],
    ["58", "GOLD BEAR"],
    ["57", "Green Bunny"],
    ["95", "GRIZZLY"],
    ["52", "Half H.P Studio"],
    ["83", "HiLLS"],
    ["62", "Himajin Planning"],
    ["67", "Hoods Entertainment"],
    ["85", "Horipro"],
    ["116", "Hot Bear"],
    ["114", "Irawias"],
    ["142", "Jellyfish"],
    ["73", "Juicy Mango"],
    ["30", "Jumondo"],
    ["24", "Kinakonoyama"],
    ["126", "King Bee"],
    ["56", "Kitty Films"],
    ["60", "Kitty Media"],
    ["79", "L."],
    ["3", "Lilix"],
    ["35", "Lune Pictures"],
    ["138", "Lyrics"],
    ["9", "Magic Bus"],
    ["131", "Magin Label"],
    ["48", "Majin petit"],
    ["104", "Marigold"],
    ["10", "Mary Jane"],
    ["43", "Media Blasters"],
    ["92", "Media Notes"],
    ["40", "Mediabank"],
    ["125", "Milky"],
    ["7", "Milky Animation Label"],
    ["120", "Mousou Senka"],
    ["6", "MS Pictures"],
    ["28", "Natural High"],
    ["78", "Nihikime no Dozeu"],
    ["34", "Nur"],
    ["47", "NuTech Digital"],
    ["143", "Nyan Pollution"],
    ["132", "Office Takeout"],
    ["65", "Oz"],
    ["11", "Pashmina"],
    ["106", "Peak Hunt"],
    ["97", "Phoenix Entertainment"],
    ["2", "Pink Pineapple"],
    ["13", "Pixy"],
    ["108", "Pixy Soft"],
    ["148", "Poly Animation"],
    ["27", "PoRO"],
    ["12", "PoRO petit"],
    ["100", "PrimeTime"],
    ["140", "QPOLA Corp."],
    ["152", "Quad"],
    ["31", "Queen Bee"],
    ["134", "Rabbit Gate"],
    ["144", "Raiose"],
    ["130", "ROJIURA JACK"],
    ["51", "SAKURAPRIN Animation"],
    ["128", "Schoolzone"],
    ["145", "Sconosciuto"],
    ["36", "Selfish"],
    ["71", "Seven"],
    ["122", "Shadow Prod. Co."],
    ["72", "Shinkuukan"],
    ["20", "Show-Ten"],
    ["105", "Showten"],
    ["141", "SoftCell"],
    ["84", "SPEED"],
    ["150", "Studio 1st"],
    ["21", "Studio 9 Maiami"],
    ["103", "Studio DEEN"],
    ["41", "Studio Eromatick"],
    ["68", "Studio Fantasia"],
    ["81", "Studio Hokiboshi"],
    ["139", "Studio LEO"],
    ["80", "Studio Zealot"],
    ["86", "Suiseisha"],
    ["32", "Suzuki Mirano"],
    ["59", "Suzuki Mirano petit"],
    ["26", "T-Rex"],
    ["102", "TNK"],
    ["82", "Toranoana"],
    ["135", "Torudaya"],
    ["54", "Union Cho"],
    ["66", "Valkyria"],
    ["121", "Vanilla"],
    ["44", "WHITE BEAR"],
    ["129", "Y.O.U.C."],
    ["109", "ZIZ"],
    ["29", "ZIZ Entertainment"],
];

const SORTS = [
    ["", "Standard"],
    ["recent", "Ultime aggiunte"],
    ["az", "Lista A-Z"],
    ["za", "Lista Z-A"],
    ["oldest", "Più vecchi (anno)"],
    ["newest", "Più recenti (anno)"],
    ["most_viewed", "Più visti"],
    ["least_viewed", "Meno visti"],
    ["best_rated", "Meglio valutati"],
    ["worst_rated", "Peggio valutati"],
];

const STATES = [
    ["0", "In corso"],
    ["1", "Finito"],
    ["2", "Non rilasciato"],
    ["3", "Droppato"],
];

const TYPES = [
    ["3", "OVA"],
    ["4", "Special"],
    ["5", "ONA"],
];

const AUDIO = [
    ["jp", "Giapponese"],
    ["it", "Italiano"],
    ["en", "Inglese"],
    ["kr", "Coreano"],
    ["ch", "Cinese"],
];

// Come AnimeSaturn: la playlist di play.hentaisaturn.tv risponde 200 solo con il
// Referer https://play.hentaisaturn.tv/ (verificato il 19 novembre 2026), altrimenti
// 403 {"ok":false}. Il file decodificato parte senza Referer.
const REFERER_MSG =
    "Il player di HentaiSaturn consegna il link del file solo se la richiesta porta il Referer di play.hentaisaturn.tv. " +
    "Su telefono e computer l'estensione lo invia e poi il video parte. " +
    "Sulla TV Tizen il Referer viene tolto, quindi l'episodio non si apre.";

function base64Decode(input) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = String(input).replace(/[^A-Za-z0-9+\/]/g, "");
    var out = "";
    for (var i = 0; i < str.length; i += 4) {
        var a = chars.indexOf(str.charAt(i));
        var b = chars.indexOf(str.charAt(i + 1));
        var c = i + 2 < str.length ? chars.indexOf(str.charAt(i + 2)) : -1;
        var d = i + 3 < str.length ? chars.indexOf(str.charAt(i + 3)) : -1;
        if (a < 0 || b < 0) break;
        out += String.fromCharCode((a << 2) | (b >> 4));
        if (c >= 0) out += String.fromCharCode(((b & 15) << 4) | (c >> 2));
        if (d >= 0) out += String.fromCharCode(((c & 3) << 6) | d);
    }
    return out;
}

function xorText(raw, key) {
    var src = "";
    var k = String(key || "");
    if (!k) return "";
    for (var i = 0; i < raw.length; i++) {
        src += String.fromCharCode(raw.charCodeAt(i) ^ k.charCodeAt(i % k.length));
    }
    return src;
}

function checkedOn(state) {
    return state === true || state === 1;
}

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
        return (v && String(v).length ? String(v) : DEFAULT_BASE).replace(/\/+$/, "");
    }

    qualityPref() {
        var v = this.getPreference(PREF_QUALITY);
        return v && String(v).length ? String(v) : "max";
    }

    serverPref() {
        var v = this.getPreference(PREF_SERVER);
        return v && String(v).length ? String(v) : "";
    }

    async doc(path) {
        var url = String(path).indexOf("http") === 0 ? path : this.getBaseUrl() + path;
        var res = await this.client.get(url);
        if (!res || res.statusCode >= 400) {
            throw new Error("Il sito ha risposto con errore " + (res ? res.statusCode : ""));
        }
        return { doc: new Document(res.body), html: res.body || "" };
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

    textValue(filters, name) {
        if (!filters || !filters.length) return "";
        for (var i = 0; i < filters.length; i++) {
            var f = filters[i];
            if (!f || f.type_name !== "TextFilter" || f.name !== name) continue;
            return f.state ? String(f.state).trim() : "";
        }
        return "";
    }

    checkedValues(filters, name) {
        var out = [];
        if (!filters || !filters.length) return out;
        for (var i = 0; i < filters.length; i++) {
            var f = filters[i];
            if (!f || f.type_name !== "GroupFilter" || f.name !== name || !f.state) continue;
            for (var j = 0; j < f.state.length; j++) {
                var c = f.state[j];
                if (c && checkedOn(c.state) && c.value) out.push(String(c.value));
            }
        }
        return out;
    }

    hasNext(doc) {
        var a = doc.selectFirst('a[rel="next"]');
        return !!(a && a.getHref);
    }

    absUrl(u) {
        var s = String(u || "").trim();
        if (s.indexOf("//") === 0) return "https:" + s;
        return s;
    }

    pathOf(href) {
        var s = String(href || "");
        var i = s.indexOf("://");
        if (i !== -1) {
            var rest = s.substring(i + 3);
            var slash = rest.indexOf("/");
            s = slash === -1 ? "/" : rest.substring(slash);
        }
        return s.split("?")[0].split("#")[0];
    }

    seriesPath(href) {
        var path = this.pathOf(href);
        var m = path.match(/\/(?:hentai|episode)\/([^/]+)/i);
        return m ? "/hentai/" + m[1] : path;
    }

    watchPath(url) {
        var path = this.pathOf(url);
        var m = path.match(/\/(?:hentai|episode)\/([^/]+)\/(ep-[^/]+)/i);
        return m ? m[1] + "/" + m[2] : "";
    }

    // Schede: a.hs-card[href="/hentai/<slug>"] con h3.hs-card__title.
    parseList(pageDoc) {
        var doc = pageDoc.doc || pageDoc;
        var list = [];
        var seen = {};
        for (var item of doc.select("a.hs-card")) {
            var link = this.seriesPath(item.attr("href") || "");
            if (link.indexOf("/hentai/") !== 0 || seen[link]) continue;
            var nameEl = item.selectFirst(".hs-card__title");
            var name = nameEl && nameEl.text ? nameEl.text.trim() : "";
            var img = item.selectFirst("img");
            var imageUrl = img ? this.absUrl(img.attr("src") || img.attr("data-src") || "") : "";
            if (!name && img) name = (img.attr("alt") || "").trim();
            if (!name) continue;
            seen[link] = true;
            list.push({ name: name, imageUrl: imageUrl, link: link });
        }
        return { list: list, hasNextPage: list.length > 0 && this.hasNext(doc) };
    }

    async getPopular(page) {
        return this.parseList(await this.doc("/filter/" + page + "?sort=most_viewed"));
    }

    async getLatestUpdates(page) {
        return this.parseList(await this.doc("/newest/" + page));
    }

    normName(s) {
        return String(s || "").toLowerCase().replace(/&amp;/g, "&").replace(/[^a-z0-9]+/g, "");
    }

    genreFor(text) {
        var key = this.normName(text);
        if (!key) return "";
        for (var i = 0; i < GENRES.length; i++) {
            if (this.normName(GENRES[i][1]) === key) return GENRES[i][0];
        }
        return "";
    }

    studioIds(text) {
        var q = this.normName(text);
        if (!q) return null;
        var exact = [];
        var partial = [];
        for (var i = 0; i < STUDIOS.length; i++) {
            var n = this.normName(STUDIOS[i][1]);
            if (n === q) exact.push(STUDIOS[i][0]);
            else if (q.length >= 3 && n.indexOf(q) !== -1) partial.push(STUDIOS[i][0]);
        }
        if (exact.length) return exact;
        if (partial.length && partial.length <= 20) return partial;
        if (partial.length > 20) {
            throw new Error("Troppi studi contengono «" + text.trim() + "». Scrivi il nome per intero.");
        }
        return [];
    }

    pushMulti(q, name, values) {
        for (var i = 0; i < values.length; i++) {
            if (values[i] == null || values[i] === "") continue;
            q.push(name + "[]=" + encodeURIComponent(values[i]));
        }
    }

    async search(query, page, filters) {
        var sort = this.filterValue(filters, "Ordine");
        var dub = this.filterValue(filters, "Lingua");
        var states = this.checkedValues(filters, "Stato");
        var types = this.checkedValues(filters, "Tipo");
        var years = this.checkedValues(filters, "Anno");
        var audio = this.checkedValues(filters, "Audio");
        var genres = this.checkedValues(filters, "Generi");
        var studioText = this.textValue(filters, "Studio");
        var text = query ? String(query).trim() : "";
        if (this.isBlocked([text])) return { list: [], hasNextPage: false };
        if (!genres.length && text) {
            var asGenre = this.genreFor(text);
            if (asGenre) {
                genres = [asGenre];
                text = "";
            }
        }
        var studios = studioText ? this.studioIds(studioText) : null;
        var any = !!(text || sort || dub || states.length || types.length ||
            years.length || audio.length || genres.length || studioText);
        if (!any) return this.getPopular(page);
        if (studios && studios.length === 0) return { list: [], hasNextPage: false };

        var q = [];
        if (text) q.push("key=" + encodeURIComponent(text));
        this.pushMulti(q, "categories", genres);
        this.pushMulti(q, "years", years);
        this.pushMulti(q, "states", states);
        this.pushMulti(q, "types", types);
        this.pushMulti(q, "languages", audio);
        if (studios) this.pushMulti(q, "studios", studios);
        if (dub !== "") q.push("dub=" + encodeURIComponent(dub));
        if (sort !== "") q.push("sort=" + encodeURIComponent(sort));
        var qs = q.length ? "?" + q.join("&") : "";
        return this.parseList(await this.doc("/filter/" + page + qs));
    }

    cleanText(s) {
        return String(s || "")
            .replace(/\u00a0/g, " ")
            .replace(/[ \t]+\n/g, "\n")
            .replace(/\n{3,}/g, "\n\n")
            .replace(/[ \t]{2,}/g, " ")
            .trim();
    }

    metaText(link) {
        if (!link || !link.getHref) return "";
        var v = link.selectFirst("span.font-semibold");
        var t = v && v.text ? v.text.trim() : "";
        if (t) return t;
        v = link.selectFirst("span.font-medium");
        return v && v.text ? v.text.trim() : "";
    }

    isBlocked(words) {
        for (var i = 0; i < words.length; i++) {
            var w = String(words[i] || "").toLowerCase();
            for (var j = 0; j < BLOCKED.length; j++) {
                if (new RegExp("\\b" + BLOCKED[j] + "\\b").test(w)) return true;
            }
        }
        return false;
    }

    infoValue(doc, name) {
        var a = doc.selectFirst('.hs-info-row a[href*="' + name + '="]');
        return a && a.text ? a.text.trim() : "";
    }

    async getDetail(url) {
        var series = this.seriesPath(url);
        if (series.indexOf("/hentai/") !== 0) series = this.pathOf(url);
        var doc = (await this.doc(series)).doc;

        var h1 = doc.selectFirst("h1");
        var name = h1 && h1.text ? h1.text.trim() : "";

        var story = "";
        for (var sec of doc.select("section")) {
            var h2 = sec.selectFirst("h2");
            if (!h2 || !h2.text || h2.text.trim() !== "Trama") continue;
            var body = sec.selectFirst("div");
            story = this.cleanText(body && body.text ? body.text : "");
            break;
        }

        var genre = [];
        for (var g of doc.select('a.hs-chip[href*="categories="]')) {
            var t = g.text ? g.text.trim() : "";
            if (t && genre.indexOf(t) === -1) genre.push(t);
        }

        var status = 5;
        var st = doc.selectFirst('.hs-info-row a[href*="states="]');
        var code = st ? ((st.attr("href") || "").match(/states=(\d+)/) || [])[1] : "";
        if (code === "0") status = 0;
        else if (code === "1") status = 1;
        else if (code === "3") status = 3;

        var studios = [];
        for (var s of doc.select('.hs-info-row a[href*="studios="]')) {
            var sn = s.text ? s.text.trim() : "";
            if (sn && studios.indexOf(sn) === -1) studios.push(sn);
        }
        var tipo = this.infoValue(doc, "types");
        var audio = this.infoValue(doc, "languages");

        var lines = [];
        if (tipo) lines.push("Tipo: " + tipo);
        if (audio) lines.push("Lingua: " + audio);
        var description = lines.join("\n");
        if (story) description = description ? description + "\n\n" + story : story;

        var poster = doc.selectFirst(".hs-dposter img");
        var imageUrl = poster ? this.absUrl(poster.attr("src") || "") : "";
        if (!imageUrl) {
            var og = doc.selectFirst('meta[property="og:image"]');
            imageUrl = og ? this.absUrl(og.attr("content") || "") : "";
        }

        var chapters = [];
        if (this.isBlocked(genre)) {
            description = "Questa serie ha generi con personaggi minorenni (Loli/Shota): l'estensione non mostra gli episodi.";
        } else {
            var seen = {};
            for (var a of doc.select("a.ep-tile")) {
                var watch = this.watchPath(a.attr("href") || "");
                if (!watch) continue;
                var epUrl = "/episode/" + watch;
                if (seen[epUrl]) continue;
                seen[epUrl] = true;
                var title = (a.attr("title") || "").trim();
                if (!title) {
                    var num = (watch.match(/ep-(\d+(?:\.\d+)?)/i) || [])[1] || "";
                    title = num ? "Episodio " + num : "Episodio";
                }
                chapters.push({ name: title, url: epUrl });
            }
            chapters.reverse();
        }

        return {
            name: name,
            link: series,
            imageUrl: imageUrl,
            description: description || "Nessuna descrizione disponibile.",
            genre: genre,
            status: status,
            author: studios.join(", "),
            chapters: chapters,
        };
    }

    async watchApi(path) {
        var res = await this.client.get(this.getBaseUrl() + "/api/watch/" + path, {
            "Accept": "application/json",
        });
        var body = res && res.body ? String(res.body) : "";
        if (!res || res.statusCode >= 400 || body.charAt(0) !== "{") return null;
        try { return JSON.parse(body); } catch (e) { return null; }
    }

    async videosFromServer(server) {
        var name = (server && server.name) || "HentaiSaturn";
        var link = server && server.link ? String(server.link) : "";
        if (!link) return [];
        var embed = link.match(/^(https?:\/\/[^/]+)\/embed\/(\d+)\?([^#]+)/i);
        if (embed && server.embed !== false) {
            var playlist = embed[1] + "/embed/" + embed[2] + "/playlist?" + embed[3];
            var token = "";
            var tm = embed[3].match(/(?:^|&)token=([^&]+)/);
            if (tm) {
                try { token = decodeURIComponent(tm[1]); } catch (e) { token = tm[1]; }
            }
            var res = await this.client.get(playlist, { "Referer": embed[1] + "/" });
            var body = res && res.body ? String(res.body) : "";
            if (!res || res.statusCode === 403 || body.indexOf('"d"') === -1) return "referer";
            var data;
            try { data = JSON.parse(body); } catch (e) { return []; }
            var src = xorText(base64Decode(data.d || ""), token);
            if (!/^https?:\/\//i.test(src)) return [];
            var tracks = xorText(base64Decode(data.t || ""), token);
            var videos = await this.expandMedia(src, name);
            this.attachSubs(videos, tracks, name);
            return videos;
        }
        // Streamtape dà la pagina del suo player (/e/…): la legge l'estrattore di Mangayomi.
        if (/streamtape\./i.test(link)) {
            if (typeof streamTapeExtractor !== "function") return [];
            var st = await streamTapeExtractor(link, name);
            return Array.isArray(st) ? st : [];
        }
        if (/\.(mp4|m3u8|webm)(\?|$)/i.test(link)) return this.expandMedia(link, name);
        return [];
    }

    attachSubs(videos, tracks, name) {
        if (!tracks || tracks.indexOf("http") !== 0) return;
        if (!/\.(vtt|webvtt)(\?|$)/i.test(tracks)) return;
        for (var i = 0; i < videos.length; i++) {
            videos[i].subtitles = [{ file: tracks, label: name }];
        }
    }

    async expandMedia(url, name) {
        var lower = url.split("?")[0].toLowerCase();
        if (lower.indexOf(".m3u8") === -1) {
            return [this.video(url, name + " · MP4")];
        }
        var res;
        try { res = await this.client.get(url); } catch (e) { res = null; }
        var body = res && res.statusCode < 400 && res.body ? String(res.body) : "";
        if (body.indexOf("#EXTM3U") === -1) return [this.video(url, name + " · Auto")];
        if (body.indexOf("#EXT-X-STREAM-INF") === -1) return [this.video(url, name + " · Auto")];
        var lines = body.split(/\r?\n/);
        var out = [];
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].indexOf("#EXT-X-STREAM-INF") !== 0) continue;
            var next = "";
            for (var j = i + 1; j < lines.length; j++) {
                if (lines[j] && lines[j].charAt(0) !== "#") { next = lines[j].trim(); break; }
            }
            if (!next) continue;
            var hm = lines[i].match(/RESOLUTION=\d+x(\d+)/i);
            var label = hm ? hm[1] + "p" : "Auto";
            out.push(this.video(this.resolveUrl(url, next), name + " · " + label));
        }
        if (!out.length) out.push(this.video(url, name + " · Auto"));
        return out;
    }

    resolveUrl(base, rel) {
        if (/^https?:\/\//i.test(rel)) return rel;
        if (rel.indexOf("//") === 0) return "https:" + rel;
        var root = base.split("?")[0];
        if (rel.charAt(0) === "/") {
            var m = root.match(/^(https?:\/\/[^/]+)/i);
            return m ? m[1] + rel : rel;
        }
        return root.replace(/[^/]+$/, "") + rel;
    }

    video(url, quality) {
        return { url: url, originalUrl: url, quality: quality, headers: {} };
    }

    async getVideoList(url) {
        var path = this.watchPath(url);
        if (!path) throw new Error("Impossibile ricavare l'episodio");
        var data = await this.watchApi(path);
        var servers = data && data.servers && data.servers.length ? data.servers : [];
        if (!servers.length && data && data.videoUrl) {
            servers = [{ name: "HentaiSaturn", link: data.videoUrl, embed: true }];
        }
        if (!servers.length) {
            var page = await this.doc("/episode/" + path);
            var frame = page.doc.selectFirst('iframe[src*="embed"]');
            var src = frame ? frame.attr("src") : "";
            if (src) servers = [{ name: "Server principale", link: src, embed: true }];
        }
        var videos = [];
        var needReferer = false;
        for (var i = 0; i < servers.length; i++) {
            var got;
            try { got = await this.videosFromServer(servers[i]); }
            catch (e) { got = []; }
            if (got === "referer") needReferer = true;
            else if (got && got.length) videos = videos.concat(got);
        }
        videos = videos.filter(function (v) {
            return v && v.url && v.url.indexOf("youtube/") !== 0 && !/youtube\.com|youtu\.be/i.test(v.url);
        });
        if (!videos.length) {
            if (needReferer) throw new Error(REFERER_MSG);
            throw new Error("Nessuno stream trovato per questo episodio");
        }
        return this.sortVideos(videos);
    }

    sortVideos(videos) {
        var server = this.serverPref().toLowerCase();
        var quality = this.qualityPref();
        var want = parseInt(quality, 10);
        function heightOf(v) {
            var m = String(v.quality || "").match(/(\d{3,4})p/);
            return m ? parseInt(m[1], 10) : 0;
        }
        function rank(v) {
            var label = String(v.quality || "").toLowerCase();
            var serverRank = server && label.indexOf(server) !== -1 ? 0 : 1;
            var h = heightOf(v);
            var qRank = 0;
            if (quality === "auto") qRank = label.indexOf("auto") !== -1 ? -100000 : (h ? -h : 1);
            else if (!want) qRank = h ? -h : 1;
            else if (h === want) qRank = -100000;
            else if (!h) qRank = 80000;
            else qRank = Math.abs(h - want);
            return serverRank * 1000000 + qRank;
        }
        return videos.slice().sort(function (a, b) { return rank(a) - rank(b); });
    }

    options(pairs, anyLabel) {
        var out = [];
        if (anyLabel) out.push({ type_name: "SelectOption", name: anyLabel, value: "" });
        for (var i = 0; i < pairs.length; i++) {
            out.push({ type_name: "SelectOption", name: pairs[i][1], value: pairs[i][0] });
        }
        return out;
    }

    checks(pairs) {
        var out = [];
        for (var i = 0; i < pairs.length; i++) {
            out.push({ type_name: "CheckBox", name: pairs[i][1], value: pairs[i][0] });
        }
        return out;
    }

    yearPairs() {
        var y = new Date().getFullYear();
        if (!y || y < 2020) y = 2026;
        var out = [];
        for (var i = y; i >= 1960; i--) out.push([String(i), String(i)]);
        return out;
    }

    getFilterList() {
        return [
            {
                type_name: "HeaderFilter",
                name: "I filtri si combinano, anche con il testo. Generi, anno, stato, tipo e audio: escono le serie che ne hanno almeno uno. Lingua è Doppiato ITA o Sub ITA. Studio: scrivi il nome, per esempio Pink Pineapple.",
            },
            { type_name: "SelectFilter", name: "Ordine", state: 0, values: this.options(SORTS) },
            {
                type_name: "SelectFilter",
                name: "Lingua",
                state: 0,
                values: [
                    { type_name: "SelectOption", name: "Tutte", value: "" },
                    { type_name: "SelectOption", name: "Doppiato ITA", value: "1" },
                    { type_name: "SelectOption", name: "Sub ITA", value: "0" },
                ],
            },
            { type_name: "GroupFilter", name: "Stato", state: this.checks(STATES) },
            { type_name: "GroupFilter", name: "Tipo", state: this.checks(TYPES) },
            { type_name: "GroupFilter", name: "Audio", state: this.checks(AUDIO) },
            { type_name: "GroupFilter", name: "Anno", state: this.checks(this.yearPairs()) },
            { type_name: "GroupFilter", name: "Generi", state: this.checks(GENRES) },
            { type_name: "TextFilter", name: "Studio", state: "" },
        ];
    }

    getSourcePreferences() {
        return [
            {
                key: PREF_BASE,
                editTextPreference: {
                    title: "Dominio HentaiSaturn",
                    summary: "Cambialo se il sito cambia indirizzo (es. https://www.hentaisaturn.tv)",
                    value: DEFAULT_BASE,
                    dialogTitle: "Dominio HentaiSaturn",
                    dialogMessage: "URL base, senza slash finale",
                },
            },
            {
                key: PREF_QUALITY,
                listPreference: {
                    title: "Qualità preferita",
                    summary: "Va per prima quando un episodio ha più qualità. Le altre restano nel player.",
                    valueIndex: 0,
                    entries: ["Massima disponibile", "1080p", "720p", "480p", "360p"],
                    entryValues: ["max", "1080", "720", "480", "360"],
                },
            },
            {
                key: PREF_SERVER,
                listPreference: {
                    title: "Server preferito",
                    summary: "Va per primo. Gli altri server restano nel player.",
                    valueIndex: 0,
                    entries: ["Qualsiasi", "HentaiSaturn", "Streamtape"],
                    entryValues: ["", "HentaiSaturn", "Streamtape"],
                },
            },
        ];
    }
}
