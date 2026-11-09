const mangayomiSources = [
    {
        "name": "Link universale",
        "lang": "it",
        "baseUrl": "https://duckduckgo.com",
        "apiUrl": "",
        "iconUrl": "https://raw.githubusercontent.com/adam72881/mangayomi-anime-extensions/main/icons/linkuniversale.png",
        "typeSource": "single",
        "isNsfw": true,
        "itemType": 1,
        "version": "1.0.0",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/linkuniversale.js",
    },
];

const PREF_HISTORY = "linkuni_history";
const PREF_NEXT = "linkuni_next_pages";
const HISTORY_MAX = 60;
const VIDEO_EXT = "m3u8|mp4|webm|mkv|mov|m4v";

// Anteprime, miniature animate e pubblicità: sono mp4 veri, ma non il video.
const NOT_THE_VIDEO = /\/plain\/|rs:fi(?:t|ll)|\/gifs?\/|thumb|preview|sprite|poster|teaser|\/pics\//i;
const AD_HOSTS = /a-ads\.com|doubleclick|googlesyndication|googletagmanager|google-analytics|facebook\.com|twitter\.com|disqus|recaptcha|hcaptcha|cloudflare|wingsmob|exoclick|juicyads|trafficjunky|adsterra|popads|histats/i;

// Player esterni che Mangayomi sa già leggere (estrattori integrati nell'app).
const KNOWN_HOSTS = [
    [/dood|ds2play|ds2video|d0000d|d000d|dooood|vidply/i, function (u) { return doodExtractor(u, "Dood"); }],
    [/streamtape|stape|strtape|streamta\.|tapecontent/i, function (u) { return streamTapeExtractor(u, "StreamTape"); }],
    [/filemoon|moonplayer|kerapoxy|smdfs/i, function (u) { return filemoonExtractor(u, "Filemoon ", ""); }],
    [/streamwish|wishembed|swdyu|wishfast|awish|dwish|sfastwish|strwish|embedwish|playerwish/i, function (u) { return streamWishExtractor(u, "StreamWish "); }],
    [/mp4upload/i, function (u) { return mp4UploadExtractor(u, null, "Mp4Upload ", ""); }],
    [/ok\.ru|odnoklassniki/i, function (u) { return okruExtractor(u); }],
    [/sendvid/i, function (u) { return sendVidExtractor(u, null, "SendVid "); }],
    [/yourupload/i, function (u) { return yourUploadExtractor(u, null, "YourUpload", ""); }],
    [/sibnet/i, function (u) { return sibnetExtractor(u, "Sibnet "); }],
    [/streamlare/i, function (u) { return streamlareExtractor(u, "Streamlare ", ""); }],
    [/vidbom|vidbam|vadbom/i, function (u) { return vidBomExtractor(u); }],
    [/voe\.sx|voe-|voeunblock|voe\./i, function (u) { return voeExtractor(u, "Voe "); }],
];

function hostOf(url) {
    var m = String(url).match(/^https?:\/\/([^\/?#:]+)/i);
    return m ? m[1].toLowerCase() : "";
}

function originOf(url) {
    var m = String(url).match(/^(https?:\/\/[^\/?#]+)/i);
    return m ? m[1] : "";
}

// Stesso sito anche tra www., m. e it. (es. it.pornhub.com e www.pornhub.com).
function siteOf(url) {
    var parts = hostOf(url).split(".");
    return parts.slice(-2).join(".");
}

function resolveUrl(href, base) {
    href = String(href || "").trim().replace(/&amp;/g, "&");
    if (!href || /^(javascript|mailto|tel|data|blob|about):/i.test(href) || href.charAt(0) === "#") return "";
    if (/^https?:\/\//i.test(href)) return href;
    if (href.indexOf("//") === 0) return "https:" + href;
    var origin = originOf(base);
    if (href.charAt(0) === "/") return origin + href;
    var dir = String(base).split("#")[0].split("?")[0];
    dir = dir.slice(0, dir.lastIndexOf("/") + 1);
    if (dir.length <= origin.length) dir = origin + "/";
    return dir + href;
}

function cleanLink(url) {
    var raw = String(url || "").trim();
    try { raw = decodeURIComponent(raw); } catch (e) {}
    // Mangayomi a volte antepone il baseUrl a un link già assoluto.
    var last = raw.lastIndexOf("http");
    if (last > 0) raw = raw.slice(last);
    return raw;
}

function decodeEntities(s) {
    return String(s || "")
        .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">").replace(/&#8211;/g, "–").replace(/&#8217;/g, "’")
        .replace(/&#(\d+);/g, function (_, n) { return String.fromCharCode(parseInt(n, 10)); })
        .replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

// Toglie gli escape tipici dei JSON dentro l'HTML (https:\/\/…, \u0026).
function unescapeJs(s) {
    return String(s || "")
        .replace(/\\u002[fF]/g, "/").replace(/\\u0026/g, "&").replace(/\\u003[dD]/g, "=")
        .replace(/\\\//g, "/");
}

function metaContent(html, names) {
    for (var i = 0; i < names.length; i++) {
        var n = names[i].replace(/[:.]/g, "\\$&");
        var re1 = new RegExp('<meta[^>]+(?:property|name|itemprop)=["\']' + n + '["\'][^>]*content=["\']([^"\']*)', "i");
        var re2 = new RegExp('<meta[^>]+content=["\']([^"\']*)["\'][^>]*(?:property|name|itemprop)=["\']' + n + '["\']', "i");
        var m = html.match(re1) || html.match(re2);
        if (m && m[1].trim()) return decodeEntities(m[1]);
    }
    return "";
}

function pageTitle(html) {
    var t = metaContent(html, ["og:title", "twitter:title"]);
    if (t) return t;
    var m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return m ? decodeEntities(m[1]) : "";
}

function qualityOf(url, objectText) {
    // Playlist con più qualità nel nome (es. multi=…144p…480p…): è l'«Auto».
    var all = String(url).match(/(?:2160|1440|1080|720|540|480|360|240|144)[pP]/g) || [];
    if (all.length > 1 && /\.m3u8/i.test(url)) return 0;
    var m = String(url).match(/(?:^|[^0-9])(2160|1440|1080|720|540|480|360|240|144)[pP](?:[^0-9a-z]|_|$)/) ||
        String(url).match(/[\/_-](2160|1440|1080|720|540|480|360|240)(?:[^0-9]|$)/);
    if (m) return parseInt(m[1], 10);
    if (/[_\/-](hd|high)[_.\/-]|VideoUrlHigh/i.test(url + " " + objectText)) return 720;
    var near = String(objectText || "").match(/["']?(?:quality|label|res|resolution|height)["']?\s*[:=]\s*["']?(\d{3,4})/i);
    return near ? parseInt(near[1], 10) : 0;
}

// Nome dell'attributo o della chiave appena prima del link: dice se è il video
// o un'immagine/anteprima (og:image, data-mediabook, <img src>, poster…).
function keyBefore(text, index) {
    var before = text.slice(Math.max(0, index - 160), index);
    var k = before.match(/([\w:.-]+)["']?\s*[:=]\s*["']?$/);
    var key = k ? k[1] : "";
    if (/^src$/i.test(key)) {
        var tag = before.slice(before.lastIndexOf("<"));
        if (/^<img\b/i.test(tag)) return "img";
    }
    if (/^content$/i.test(key)) {
        var meta = before.slice(before.lastIndexOf("<"));
        var prop = meta.match(/(?:property|name|itemprop)=["']([^"']+)/i);
        if (prop) return prop[1];
    }
    return key;
}

function objectAround(text, start, end) {
    var open = text.lastIndexOf("{", start);
    var close = text.indexOf("}", end);
    if (open === -1 || start - open > 600) open = Math.max(0, start - 200);
    if (close === -1 || close - end > 600) close = Math.min(text.length, end + 200);
    return text.slice(open, close);
}

const NOT_VIDEO_KEY = /image|img|thumb|poster|preview|mediabook|trailer|teaser|gif|sprite|avatar|banner/i;

function base64Decode(input) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = String(input).replace(/[^A-Za-z0-9+\/]/g, "");
    var out = "";
    for (var i = 0; i < str.length; i += 4) {
        var a = chars.indexOf(str.charAt(i)), b = chars.indexOf(str.charAt(i + 1));
        var c = chars.indexOf(str.charAt(i + 2)), d = chars.indexOf(str.charAt(i + 3));
        out += String.fromCharCode((a << 2) | (b >> 4));
        if (c >= 0) out += String.fromCharCode(((b & 15) << 4) | (c >> 2));
        if (d >= 0) out += String.fromCharCode(((c & 3) << 6) | d);
    }
    return out;
}

class DefaultExtension extends MProvider {
    constructor() {
        super();
        this.client = new Client();
        this.prefs = new SharedPreferences();
    }

    headers(referer) {
        var h = { "Accept-Language": "it-IT,it;q=0.9,en;q=0.8" };
        if (referer) h["Referer"] = referer;
        return h;
    }

    async fetchHtml(url, referer) {
        var res = await this.client.get(url, this.headers(referer));
        if (res.statusCode >= 400) throw new Error("Il sito ha risposto con errore " + res.statusCode);
        return String(res.body || "");
    }

    // ---------- Cronologia dei link aperti ----------

    readJson(key, fallback) {
        try {
            var v = this.prefs.getString(key, "");
            return v ? JSON.parse(v) : fallback;
        } catch (e) {
            return fallback;
        }
    }

    history() {
        return this.readJson(PREF_HISTORY, []);
    }

    remember(item) {
        var list = this.history().filter(function (x) { return x.link !== item.link; });
        list.unshift({ name: item.name, imageUrl: item.imageUrl || "", link: item.link });
        this.prefs.setString(PREF_HISTORY, JSON.stringify(list.slice(0, HISTORY_MAX)));
    }

    historyPage(query) {
        var list = this.history();
        if (query) {
            var q = query.toLowerCase();
            list = list.filter(function (x) {
                return String(x.name).toLowerCase().indexOf(q) !== -1 || String(x.link).toLowerCase().indexOf(q) !== -1;
            });
        }
        if (!list.length) {
            list = [{
                name: "Incolla nella ricerca il link di un video o di un sito",
                imageUrl: "",
                link: "https://duckduckgo.com/",
            }];
        }
        return { list: list, hasNextPage: false };
    }

    async getPopular(page) {
        return this.historyPage("");
    }

    async getLatestUpdates(page) {
        return this.historyPage("");
    }

    // ---------- Ricerca = link incollato ----------

    async search(query, page, filters) {
        var text = String(query || "").trim();
        var urlMatch = text.match(/https?:\/\/\S+/i);
        if (!urlMatch && /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(text)) urlMatch = ["https://" + text];
        if (!urlMatch) return this.historyPage(text);

        var start = urlMatch[0].replace(/[)\].,;]+$/, "");
        var nextPages = this.readJson(PREF_NEXT, {});
        var url = page > 1 ? nextPages[start + "#" + page] : start;
        if (!url) return { list: [], hasNextPage: false };

        var html = await this.fetchHtml(url, originOf(url) + "/");
        var list = [];
        if (page === 1 && this.looksLikeVideoPage(url, html)) {
            var self = {
                name: "▶ " + (pageTitle(html) || url),
                imageUrl: resolveUrl(metaContent(html, ["og:image", "twitter:image"]), url),
                link: url,
            };
            list.push(self);
            this.remember({ name: self.name.replace(/^▶ /, ""), imageUrl: self.imageUrl, link: url });
        }

        var seen = {};
        seen[url.split("#")[0]] = true;
        var cards = this.cardsOf(html, url);
        for (var i = 0; i < cards.length; i++) {
            if (seen[cards[i].link]) continue;
            seen[cards[i].link] = true;
            list.push(cards[i]);
        }

        var next = this.nextPageOf(html, url);
        if (next) {
            nextPages[start + "#" + (page + 1)] = next;
            var keys = Object.keys(nextPages);
            if (keys.length > 200) for (var k = 0; k < keys.length - 200; k++) delete nextPages[keys[k]];
            this.prefs.setString(PREF_NEXT, JSON.stringify(nextPages));
        }
        if (!list.length && page === 1) {
            list.push({ name: pageTitle(html) || url, imageUrl: "", link: url });
        }
        return { list: list, hasNextPage: !!next && cards.length > 0 };
    }

    looksLikeVideoPage(url, html) {
        if (this.saturnPath(url)) return true;
        if (/og:type["'][^>]*content=["'][^"']*video|content=["']video[^"']*["'][^>]*og:type/i.test(html)) return true;
        if (/<video[\s>]/i.test(html)) return true;
        if (/<iframe[^>]+src=["'][^"']*(dood|streamtape|filemoon|streamwish|mp4upload|ok\.ru|sendvid|voe|sibnet|streamlare|\/embed)/i.test(html)) return true;
        return this.directCandidates(html, url).length > 0;
    }

    // Schede con immagine che portano ad altre pagine dello stesso sito.
    cardsOf(html, pageUrl) {
        var out = [];
        var site = siteOf(pageUrl);
        var re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
        var m;
        while ((m = re.exec(html)) !== null) {
            var attrs = m[1], inner = m[2];
            if (!/<img\b/i.test(inner)) continue;
            var hrefM = attrs.match(/\bhref\s*=\s*["']([^"']+)["']/i);
            if (!hrefM) continue;
            var link = resolveUrl(hrefM[1], pageUrl).split("#")[0];
            if (!link || siteOf(link) !== site || /[{}]/.test(link)) continue;
            var path = link.replace(/^https?:\/\/[^\/]+/, "");
            if (path === "" || path === "/" || /\.(jpe?g|png|gif|webp|svg|css|js)(\?|$)/i.test(path)) continue;
            if (/\/(login|signup|register|premium|upload|privacy|terms|dmca|contact|logout|account)(\/|\?|$)/i.test(path)) continue;

            var img = inner.match(/<img\b[^>]*>/i)[0];
            var src = "";
            var lazy = ["data-src", "data-original", "data-lazy-src", "data-mediumthumb", "data-thumb_url", "data-thumb", "data-image", "src"];
            for (var j = 0; j < lazy.length && !src; j++) {
                var am = img.match(new RegExp("\\b" + lazy[j] + "\\s*=\\s*[\"']([^\"']+)[\"']", "i"));
                if (am && !/^data:/i.test(am[1])) src = am[1];
            }
            if (!src) {
                var ss = img.match(/\bsrcset\s*=\s*["']([^\s"',]+)/i);
                if (ss) src = ss[1];
            }
            var title = "";
            var tm = attrs.match(/\btitle\s*=\s*["']([^"']+)["']/i);
            if (tm) title = tm[1];
            if (!title) {
                var alt = img.match(/\balt\s*=\s*["']([^"']+)["']/i);
                if (alt) title = alt[1];
            }
            if (!title) title = inner.replace(/<[^>]+>/g, " ");
            title = decodeEntities(title);
            if (!title || title.length < 2) continue;
            out.push({ name: title, imageUrl: src ? resolveUrl(src, pageUrl) : "", link: link });
        }
        return out;
    }

    nextPageOf(html, pageUrl) {
        var m = html.match(/<link[^>]+rel=["']next["'][^>]*href=["']([^"']+)/i) ||
            html.match(/<a[^>]+rel=["']next["'][^>]*href=["']([^"']+)/i) ||
            html.match(/<a[^>]+href=["']([^"']+)["'][^>]*rel=["']next["']/i);
        if (!m) {
            var re = /<a\b([^>]*)>([\s\S]{0,200}?)<\/a>/gi, a;
            while ((a = re.exec(html)) !== null) {
                var label = decodeEntities(a[2].replace(/<[^>]+>/g, " ")) + " " + (a[1].match(/(?:title|aria-label|class)=["']([^"']*)/i) || ["", ""])[1];
                if (/^\s*(›|»|>|next|successiv|avanti|pagina successiva)|\bnext\b|page_next|pagination-next/i.test(label)) {
                    var h = a[1].match(/\bhref\s*=\s*["']([^"'#][^"']*)["']/i);
                    if (h) { m = [null, h[1]]; break; }
                }
            }
        }
        if (!m) return "";
        var next = resolveUrl(m[1], pageUrl);
        return next && next !== pageUrl ? next : "";
    }

    // ---------- Scheda ----------

    async getDetail(url) {
        var link = cleanLink(url);
        var html = await this.fetchHtml(link, originOf(link) + "/");
        var title = pageTitle(html) || link;
        var image = resolveUrl(metaContent(html, ["og:image", "twitter:image"]), link);
        var description = metaContent(html, ["og:description", "description", "twitter:description"]);

        var chapters = this.episodesOf(html, link);
        if (!chapters.length) chapters = [{ name: "Video", url: link }];

        this.remember({ name: title, imageUrl: image, link: link });
        return {
            name: title,
            imageUrl: image || undefined,
            link: link,
            description: (description ? description + "\n\n" : "") + "Link: " + link,
            genre: [hostOf(link)],
            status: 5,
            chapters: chapters,
        };
    }

    // Link agli episodi nella stessa pagina («Episodio 3», «Ep. 3», /ep-3 …).
    episodesOf(html, pageUrl) {
        var site = siteOf(pageUrl);
        var found = {};
        var list = [];
        var re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
        var m;
        while ((m = re.exec(html)) !== null) {
            var hrefM = m[1].match(/\bhref\s*=\s*["']([^"']+)["']/i);
            if (!hrefM) continue;
            var link = resolveUrl(hrefM[1], pageUrl).split("#")[0];
            if (!link || siteOf(link) !== site) continue;
            var label = decodeEntities(m[2].replace(/<[^>]+>/g, " ")) + " " +
                ((m[1].match(/\btitle\s*=\s*["']([^"']+)/i) || ["", ""])[1]);
            var n = label.match(/\b(?:episodio|episode|ep\.?)\s*(\d+(?:[.,]\d+)?)/i) ||
                link.match(/[\/_-](?:episodio|episode|ep)[-_]?(\d+(?:\.\d+)?)(?:[\/?#]|$)/i);
            if (!n) continue;
            var num = parseFloat(String(n[1]).replace(",", "."));
            if (found[link]) continue;
            found[link] = true;
            list.push({ name: "Episodio " + n[1], url: link, _n: num });
        }
        // Solo gli episodi di questa serie: il link contiene lo slug della pagina.
        var slug = (pageUrl.split("?")[0].replace(/^https?:\/\/[^\/]+/, "").replace(/\/+$/, "").match(/\/([^\/]{3,})$/) || ["", ""])[1];
        var own = slug ? list.filter(function (e) { return e.url.indexOf(slug) !== -1; }) : [];
        if (own.length >= 2) list = own;
        else if (!slug) return [];
        if (list.length < 2) return [];
        // Un solo link per numero: il sito spesso lo ripete (pulsante e riquadro).
        var byNum = {};
        var unique = list.filter(function (e) {
            if (byNum[e._n]) return false;
            byNum[e._n] = true;
            return true;
        });
        unique.sort(function (a, b) { return b._n - a._n; });
        return unique.map(function (e) { return { name: e.name, url: e.url }; });
    }

    // ---------- Video ----------

    async getVideoList(url) {
        var link = cleanLink(url);
        var videos = [];

        if (new RegExp("\\.(" + VIDEO_EXT + ")(\\?|$)", "i").test(link)) {
            videos.push(this.video(link, "Link diretto", 0, originOf(link) + "/"));
            return videos;
        }

        var saturn = this.saturnPath(link);
        if (saturn) {
            var sv = await this.saturnVideos(link, saturn);
            if (sv.length) return sv;
        }

        var html = await this.fetchHtml(link, originOf(link) + "/");
        videos = videos.concat(await this.videosFromHtml(html, link, 0));

        var seen = {};
        videos = videos.filter(function (v) {
            if (seen[v.url]) return false;
            seen[v.url] = true;
            return true;
        });
        videos.sort(function (a, b) { return (b._score || 0) - (a._score || 0); });
        videos.forEach(function (v) { delete v._score; });
        if (!videos.length) {
            throw new Error("Nessun video trovato in questa pagina. Il sito probabilmente carica il player in un modo che l'estensione non sa ancora leggere.");
        }
        return videos;
    }

    video(url, label, quality, referer) {
        var isHls = /\.m3u8(\?|$)/i.test(url);
        var name = label + (quality ? " " + quality + "p" : isHls ? " Auto" : "") + (isHls ? " (HLS)" : "");
        return {
            url: url,
            originalUrl: url,
            quality: name,
            headers: this.headers(referer),
            _score: isHls && !quality ? 100000 : quality * 10 + (isHls ? 1 : 2),
        };
    }

    directCandidates(html, pageUrl) {
        var text = unescapeJs(html);
        var out = [];
        var seen = {};
        var re = new RegExp("(?:https?:)?\\/\\/[^\\s\"'<>\\\\()]+?\\.(?:" + VIDEO_EXT + ")(?:\\?[^\\s\"'<>\\\\()]*)?(?=[\\s\"'<>\\\\()]|$)", "gi");
        var m;
        while ((m = re.exec(text)) !== null) {
            var u = resolveUrl(m[0].replace(/&amp;/g, "&"), pageUrl);
            if (!u || seen[u] || NOT_THE_VIDEO.test(u)) continue;
            if (NOT_VIDEO_KEY.test(keyBefore(text, m.index))) continue;
            seen[u] = true;
            out.push({ url: u, quality: qualityOf(u, objectAround(text, m.index, m.index + m[0].length)) });
        }
        // <video src> / <source src> con percorso relativo.
        var tagRe = /<(?:video|source)\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
        while ((m = tagRe.exec(html)) !== null) {
            var s = resolveUrl(m[1], pageUrl);
            if (!s || seen[s] || /^blob:/i.test(m[1]) || NOT_THE_VIDEO.test(s)) continue;
            seen[s] = true;
            out.push({ url: s, quality: qualityOf(s, m[0]) });
        }
        return out;
    }

    async videosFromHtml(html, pageUrl, depth) {
        var videos = [];
        var direct = this.directCandidates(html, pageUrl);
        for (var i = 0; i < direct.length; i++) {
            videos.push(this.video(direct[i].url, hostOf(pageUrl).replace(/^www\./, ""), direct[i].quality, pageUrl));
        }
        if (depth >= 2) return videos;

        var frames = [];
        var re = /<iframe\b[^>]*?\b(?:data-src|src)\s*=\s*["']([^"']+)["']/gi;
        var m;
        while ((m = re.exec(html)) !== null) {
            var f = resolveUrl(m[1], pageUrl);
            if (f && !AD_HOSTS.test(f) && !/youtube\.com|youtu\.be/i.test(f) && frames.indexOf(f) === -1) frames.push(f);
        }
        // Link a player noti scritti negli script (non solo iframe).
        var text = unescapeJs(html);
        var hostRe = /https?:\/\/[^\s"'<>\\]*(?:dood|streamtape|filemoon|streamwish|mp4upload|ok\.ru\/videoembed|sendvid|voe\.sx|sibnet|streamlare)[^\s"'<>\\]*/gi;
        while ((m = hostRe.exec(text)) !== null) {
            if (frames.indexOf(m[0]) === -1) frames.push(m[0]);
        }

        for (var k = 0; k < frames.length && k < 8; k++) {
            try {
                videos = videos.concat(await this.videosFromFrame(frames[k], pageUrl, depth));
            } catch (e) {}
        }
        return videos;
    }

    async videosFromFrame(frameUrl, referer, depth) {
        for (var i = 0; i < KNOWN_HOSTS.length; i++) {
            if (!KNOWN_HOSTS[i][0].test(hostOf(frameUrl))) continue;
            try {
                var list = await KNOWN_HOSTS[i][1](frameUrl);
                if (list && list.length) {
                    return list.map(function (v) { v._score = 5; return v; });
                }
            } catch (e) {}
            break;
        }
        var saturnEmbed = frameUrl.match(/saturncdn\.[a-z]+\/embed\/(\d+)\?token=(\w+)&expires=(\d+)/i);
        if (saturnEmbed) return this.saturnEmbed(frameUrl, saturnEmbed);

        var html = await this.fetchHtml(frameUrl, referer);
        return this.videosFromHtml(html, frameUrl, depth + 1);
    }

    // ---------- AnimeSaturn ----------
    // Il player si carica da /api/watch/<serie>/ep-N; il link del file è
    // codificato (base64 + XOR con il token), come fa il player del sito.

    saturnPath(url) {
        var m = String(url).match(/^https?:\/\/(?:www\.)?animesaturn\.[a-z]+\/(?:anime|episode)\/([^\/?#]+)\/(ep-[^\/?#]+)/i);
        return m ? m[1] + "/" + m[2] : "";
    }

    async saturnVideos(link, path) {
        var origin = originOf(link);
        var res = await this.client.get(origin + "/api/watch/" + path, this.headers(origin + "/anime/" + path));
        var data = JSON.parse(res.body);
        if (!data || !data.ok) return [];
        var out = [];
        var servers = data.servers && data.servers.length ? data.servers : [{ name: "AnimeSaturn", link: data.videoUrl, embed: true }];
        for (var i = 0; i < servers.length; i++) {
            var s = servers[i];
            var target = s.link || (s.current ? data.videoUrl : "");
            if (!target) continue;
            try {
                var found;
                var e = target.match(/saturncdn\.[a-z]+\/embed\/(\d+)\?token=(\w+)&expires=(\d+)/i);
                if (e) found = await this.saturnEmbed(target, e);
                else if (s.embed === false) found = [this.video(target, s.name || "AnimeSaturn", 0, origin + "/")];
                else found = await this.videosFromFrame(target, origin + "/", 0);
                found.forEach(function (v) { v.quality = (s.name || "AnimeSaturn") + " – " + v.quality; });
                out = out.concat(found);
            } catch (err) {}
        }
        out.forEach(function (v) { delete v._score; });
        return out;
    }

    async saturnEmbed(embedUrl, m) {
        var origin = originOf(embedUrl);
        var res = await this.client.get(
            origin + "/embed/" + m[1] + "/playlist?token=" + m[2] + "&expires=" + m[3],
            this.headers(embedUrl),
        );
        var data = JSON.parse(res.body);
        var key = m[2];
        var raw = base64Decode(data.d || "");
        var src = "";
        for (var i = 0; i < raw.length; i++) {
            src += String.fromCharCode(raw.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        if (!/^https?:\/\//i.test(src)) return [];
        return [this.video(src, "AnimeSaturn", 0, origin + "/")];
    }

    getFilterList() {
        return [
            {
                type_name: "HeaderFilter",
                name: "Incolla nella ricerca il link di un video, di una serie o di un sito. Senza link, la ricerca cerca tra i link già aperti.",
            },
        ];
    }

    getSourcePreferences() {
        return [];
    }
}
