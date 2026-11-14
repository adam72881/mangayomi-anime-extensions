const mangayomiSources = [
    {
        "name": "JAV Guru",
        "lang": "en",
        "baseUrl": "https://jav.guru",
        "apiUrl": "",
        "iconUrl": "https://www.google.com/s2/favicons?sz=64&domain=jav.guru",
        "typeSource": "single",
        "isNsfw": true,
        "itemType": 1,
        "version": "1.0.0",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/javguru.js",
    },
];

// JAV Guru (jav.guru), estensione a sé. Le liste sono l'HTML del sito:
//   recenti  / e /page/N/
//   più visti  /most-watched-rank/ (pannelli today, week, month, alltime)
//   ricerca  /?s= e /page/N/?s=
//   categorie e tag  /category/<nome>/ e /tag/<nome>/
// Il player è quello già letto da Link universale: iframe_url in base64 e i
// pezzi data-* invertiti, come fa lo script della pagina. Non è un controllo
// anti-bot e non si aggira Cloudflare, un paywall o la verifica dell'età.
const BASE = "https://jav.guru";
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const VIDEO_EXT = "m3u8|mp4|webm|mkv|mov|m4v";

const NOT_THE_VIDEO = /\/tmb\/|\/plain\/|rs:fi(?:t|ll)|\/gifs?\/|thumb|preview|sprite|poster|teaser|trailer|\/pics\/|\/vp\/\d+\/|\/p\d{2,4}-\d{2,4}\.(?:mp4|webm)/i;
const AD_HOSTS = /a-ads\.com|doubleclick|googlesyndication|googletagmanager|google-analytics|facebook\.com|twitter\.com|disqus|recaptcha|hcaptcha|cloudflare|wingsmob|exoclick|juicyads|trafficjunky|adsterra|popads|histats|gsrv\.dev|tsyndicate|magsrv|realsrv|ad-delivery|adnxs|adtng|\bvast\b|mayzaent\.com|pemsrv\.com/i;
const NOT_VIDEO_KEY = /image|img|thumb|poster|preview|mediabook|trailer|teaser|gif|sprite|avatar|banner/i;

// Player che Mangayomi sa già aprire (estrattori dell'app). Stessi di Link universale.
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

// Categorie e tag del sito, solo adulti. Non ci sono loli, teen, schoolgirl,
// shotacon, rape e le altre categorie di minori o non consensuali.
const CATEGORIES = [
    ["", "Tutte"],
    ["cat:english-subbed", "Sub inglese"],
    ["cat:jav", "JAV"],
    ["cat:decensored", "Senza mosaico"],
    ["cat:amateur", "Amateur"],
    ["cat:idol", "Idol"],
    ["cat:4k", "4K"],
    ["cat:FC2", "FC2"],
    ["tag:creampie", "Creampie"],
    ["tag:big-tits", "Big tits"],
    ["tag:married", "Married"],
    ["tag:beautiful-girl", "Beautiful Girl"],
    ["tag:blowjob", "Blowjob"],
    ["tag:mature-woman", "Mature Woman"],
    ["tag:slender", "Slender"],
    ["tag:slut", "Slut"],
    ["tag:pov", "POV"],
    ["tag:3p", "3P"],
    ["tag:boobs", "Boobs fetish"],
    ["tag:cuckold", "Cuckold"],
    ["tag:squirting", "Squirting"],
    ["tag:cowgirl", "Cowgirl"],
    ["tag:drama", "Drama"],
    ["tag:titty-fuck", "Titty fuck"],
    ["tag:handjob", "Handjob"],
    ["tag:cosplay", "Cosplay"],
    ["tag:lesbian", "Lesbian"],
    ["tag:kimono", "Kimono"],
    ["tag:pantyhose", "Pantyhose"],
    ["tag:bukkake", "Bukkake"],
    ["tag:deep-throat", "Deep Throat"],
    ["tag:masturbation", "Masturbation"],
    ["tag:orgy", "Orgy"],
    ["tag:solowork", "Solowork"],
];

const PERIODS = [
    ["today", "Oggi"],
    ["week", "Settimana"],
    ["month", "Mese"],
    ["alltime", "Di sempre"],
];

// Slug esatti delle categorie da non mostrare. «girl» sul sito è Loli,
// «girl+mini» è Teen. «beautiful-girl» e «young-wife» non c'entrano e restano.
const BLOCKED_SLUGS = {
    "girl": 1,
    "girl+mini": 1,
    "loli": 1,
    "lolicon": 1,
    "lolita": 1,
    "shota": 1,
    "shotacon": 1,
    "schoolgirl": 1,
    "schoolgirls": 1,
    "school-girl": 1,
    "school-girls": 1,
    "underage": 1,
    "preteen": 1,
    "pre-teen": 1,
    "jailbait": 1,
    "child": 1,
    "children": 1,
    "infant": 1,
    "minor": 1,
    "rape": 1,
    "raped": 1,
    "noncon": 1,
    "non-con": 1,
    "kidnap": 1,
    "kidnapping": 1,
    "abduction": 1,
    "young": 1,
};

function blockedSlug(slug) {
    var s = String(slug || "").toLowerCase().replace(/%20|\s+/g, "+");
    try { s = decodeURIComponent(s); } catch (e) {}
    s = s.toLowerCase().replace(/\s+/g, "+");
    return !!BLOCKED_SLUGS[s];
}

function blockedLabel(name) {
    return /^(loli|lolita|shotacon|shota|schoolgirls?|teens?|underage|pre-?teens?|jailbait|raped?|non-?con|child|children|infant|minor)$/i.test(String(name || "").trim());
}

function blockedTitle(title) {
    return /\blolis?\b|\blolitas?\b|\bshotas?\b|\bshotacon\b|\bunderage\b|\bpre-?teens?\b|\bjailbait\b|\bschool\s*girls?\b|\byoung\s+teens?\b|\bteens?\b|\brapes?\b|\braped\b|\bnon-?consensual\b|\bchild\s*porn/i.test(String(title || ""));
}

function hostOf(url) {
    var m = String(url).match(/^https?:\/\/([^\/?#:]+)/i);
    return m ? m[1].toLowerCase() : "";
}

function originOf(url) {
    var m = String(url).match(/^(https?:\/\/[^\/?#]+)/i);
    return m ? m[1] : "";
}

function decodeEntities(s) {
    return String(s || "")
        .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">").replace(/&#8211;/g, "–").replace(/&#8217;|&#8216;/g, "’")
        .replace(/&#8220;|&#8221;/g, '"').replace(/&#8230;/g, "…").replace(/&#038;/g, "&")
        .replace(/&#(\d+);/g, function (_, n) { return String.fromCharCode(parseInt(n, 10)); })
        .replace(/&#x([0-9a-f]+);/gi, function (_, h) { return String.fromCharCode(parseInt(h, 16)); })
        .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

function unescapeJs(s) {
    return String(s || "")
        .replace(/\\u002[fF]/g, "/").replace(/\\u0026/g, "&").replace(/\\u003[dD]/g, "=")
        .replace(/\\\//g, "/");
}

function resolveUrl(href, base) {
    href = String(href || "").trim()
        .replace(/&#x([0-9a-f]+);/gi, function (_, h) { return String.fromCharCode(parseInt(h, 16)); })
        .replace(/&#(\d+);/g, function (_, n) { return String.fromCharCode(parseInt(n, 10)); })
        .replace(/&amp;/g, "&");
    if (!href || /^(javascript|mailto|tel|data|blob|about):/i.test(href) || href.charAt(0) === "#") return "";
    href = href.replace(/[^\x21-\x7e]/g, function (ch) { return encodeURIComponent(ch); });
    if (/^https?:\/\//i.test(href)) return href;
    if (href.indexOf("//") === 0) return "https:" + href;
    var origin = originOf(base) || BASE;
    if (href.charAt(0) === "/") return origin + href;
    var dir = String(base).split("#")[0].split("?")[0];
    dir = dir.slice(0, dir.lastIndexOf("/") + 1);
    if (dir.length <= origin.length) dir = origin + "/";
    return dir + href;
}

// Il CDN delle miniature risponde con una pagina, non con il JPEG. Lo stesso
// file su jav.guru, con lo User-Agent, è l'immagine. Non si aggira il CDN.
function coverUrl(src, pageUrl) {
    var abs = resolveUrl(src, pageUrl || (BASE + "/"));
    if (!abs) return "";
    var path = abs.replace(/^https?:\/\/[^\/?#]+/i, "");
    if (/^\/wp-content\/uploads\//i.test(path.split("?")[0]) && hostOf(abs) !== "jav.guru") {
        return BASE + path;
    }
    return abs;
}

function pageTitle(html) {
    var m = String(html || "").match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return m ? decodeEntities(m[1]) : "";
}

function isGate(html, status) {
    var text = String(html || "");
    var title = pageTitle(text);
    if (title.length < 90 && /just a moment|attention required|access denied|checking your browser|ddos protection|verifica del browser/i.test(title)) return true;
    // La pagina del player porta lo script di Cloudflare insieme al video.
    // Se il video c'è, non è una pagina di controllo.
    if (/class="inside-article"|class="rank-item"|class="infoleft"|iframe_url|cid:\s*['"]|eval\(function\(p,a,c,k/i.test(text.slice(0, 200000))) return false;
    var head = text.slice(0, 30000);
    if ((status === 403 || status === 503 || status === 429) && /cf-chl-|challenge-platform|just a moment|captcha/i.test(head)) return true;
    if (/cf-chl-|challenge-platform|__cf_chl|cdn-cgi\/challenge/i.test(head)) return true;
    return false;
}

function isAgeWall(html) {
    var text = String(html || "");
    var title = pageTitle(text);
    var wall = /verify your age|age verification|verifica dell.et|age restricted|yoti|verify-my-age|agekey/i.test(title);
    if (!wall) {
        var n = (text.slice(0, 50000).match(/verify your age|age verification|yoti/gi) || []).length;
        wall = n >= 2;
    }
    if (!wall) return false;
    return !/class="inside-article"|class="rank-item"|class="infoleft"/.test(text);
}

function cleanLink(url) {
    var raw = String(url || "").trim();
    var last = raw.lastIndexOf("http");
    if (last > 0) raw = raw.slice(last);
    if (raw.charAt(0) === "/") raw = BASE + raw;
    return raw.split("#")[0];
}

function pathOf(url) {
    var abs = resolveUrl(url, BASE + "/");
    if (!abs) return "";
    return abs.replace(/^https?:\/\/[^\/?#]+/i, "").split("#")[0] || "/";
}

function hasNext(html) {
    return /class="next page-numbers"|rel=["']next["']/i.test(String(html || ""));
}

function tagSlugs(html) {
    var out = [];
    var seen = {};
    var re = /\/tag\/([^"'?#\/\s]+)/gi;
    var m;
    while ((m = re.exec(String(html || ""))) !== null) {
        var s = m[1].toLowerCase();
        try { s = decodeURIComponent(s).toLowerCase(); } catch (e) {}
        if (seen[s]) continue;
        seen[s] = true;
        out.push(s);
    }
    return out;
}

function tagLabels(html) {
    var out = [];
    var re = /<a\b[^>]*\/tag\/[^"']+["'][^>]*>([\s\S]*?)<\/a>/gi;
    var m;
    while ((m = re.exec(String(html || ""))) !== null) {
        out.push(decodeEntities(m[1].replace(/<[^>]+>/g, " ")));
    }
    return out;
}

function cardTitle(chunk) {
    var tag = chunk.match(/<a\b[^>]*class=["'][^"']*rank-thumb-link[^"']*["'][^>]*>/i)
        || chunk.match(/<h2[^>]*>\s*<a\b[^>]*>/i)
        || chunk.match(/<h3[^>]*>\s*<a\b[^>]*>/i);
    var title = "";
    if (tag) {
        var attr = tag[0].match(/\btitle=["']([^"']+)["']/i);
        if (attr) title = attr[1];
    }
    if (!title) {
        var text = chunk.match(/<h[23][^>]*>\s*<a\b[^>]*>([\s\S]*?)<\/a>/i);
        title = text ? text[1] : "";
    }
    return decodeEntities(String(title).replace(/<[^>]+>/g, " "));
}

function cardImage(chunk) {
    var tag = chunk.match(/<img\b[^>]*>/i);
    if (!tag) return "";
    var t = tag[0];
    var data = t.match(/\bdata-(?:src|original|lazy-src)=["']([^"']+)["']/i);
    var src = t.match(/\bsrc=["']([^"']+)["']/i);
    var u = src ? src[1] : "";
    if (!u || /data:|logo|placeholder|blank|1x1|sprite/i.test(u)) u = data ? data[1] : u;
    return u || "";
}

function listingCards(html) {
    var text = String(html || "");
    var idxs = [];
    var re = /class="inside-article"|<article class="rank-item"/g;
    var m;
    while ((m = re.exec(text)) !== null) idxs.push(m.index);
    var out = [];
    var seen = {};
    for (var i = 0; i < idxs.length; i++) {
        var chunk = text.slice(idxs[i], idxs[i + 1] || Math.min(text.length, idxs[i] + 7000));
        var linkM = chunk.match(/href="(https?:\/\/(?:www\.)?jav\.guru\/\d+\/[^"#]+|\/\d+\/[^"#]+)"/i);
        if (!linkM) continue;
        var path = pathOf(linkM[1]);
        if (!/^\/\d+\//.test(path) || seen[path]) continue;
        var title = cardTitle(chunk);
        var slugs = tagSlugs(chunk);
        var labels = tagLabels(chunk);
        if (!title || blockedTitle(title) || slugs.some(blockedSlug) || labels.some(blockedLabel)) continue;
        seen[path] = true;
        out.push({
            name: title,
            imageUrl: coverUrl(cardImage(chunk), BASE + path),
            link: path,
        });
    }
    return out;
}

function panelHtml(html, id) {
    var text = String(html || "");
    var start = text.indexOf('id="' + id + '"');
    if (start < 0) return "";
    var next = text.indexOf('id="content-', start + 12);
    return next < 0 ? text.slice(start) : text.slice(start, next);
}

function qualityOf(url, objectText) {
    var all = String(url).match(/(?:2160|1440|1080|720|540|480|360|240|144)[pP]/g) || [];
    if (all.length > 1 && /\.m3u8/i.test(url)) return 0;
    var m = String(url).match(/(?:^|[^0-9])(2160|1440|1080|720|540|480|360|240|144)[pP](?:[^0-9a-z]|_|$)/) ||
        String(url).match(/[\/_-](2160|1440|1080|720|540|480|360|240)(?:[^0-9]|$)/);
    if (m) return parseInt(m[1], 10);
    if (/[_\/-](hd|high)[_.\/-]|VideoUrlHigh/i.test(url + " " + objectText)) return 720;
    var near = String(objectText || "").match(/["']?(?:quality|label|res|resolution|height)["']?\s*[:=]\s*["']?(\d{3,4})/i);
    var q = near ? parseInt(near[1], 10) : 0;
    return [144, 240, 360, 480, 540, 576, 720, 1080, 1440, 2160].indexOf(q) !== -1 ? q : 0;
}

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

function metaContent(html, names) {
    for (var i = 0; i < names.length; i++) {
        var n = names[i].replace(/[:.]/g, "\\$&");
        var re1 = new RegExp('<meta[^>]+(?:property|name|itemprop)=["\']' + n + '["\'][^>]*content=["\']([^"\']*)', "i");
        var re2 = new RegExp('<meta[^>]+content=["\']([^"\']*)["\'][^>]*(?:property|name|itemprop)=["\']' + n + '["\']', "i");
        var found = html.match(re1) || html.match(re2);
        if (found && found[1].trim()) return decodeEntities(found[1]);
    }
    return "";
}

// Scompatta il packer del player (eval(function(p,a,c,k,e,d)…)). È codice
// compresso, lo stesso che il browser esegue. Copiato da Link universale.
function unpackAll(html) {
    var out = "";
    var re = /eval\(function\(p,a,c,k,e,[rd]\)\{[\s\S]*?\}\('([\s\S]*?)',\s*(\d+),\s*(\d+),\s*'([\s\S]*?)'\.split\('\|'\)/g;
    var found;
    while ((found = re.exec(html)) !== null) {
        var p = found[1].replace(/\\'/g, "'"), a = parseInt(found[2], 10), c = parseInt(found[3], 10), k = found[4].split("|");
        var enc = function (n) {
            return (n < a ? "" : enc(Math.floor(n / a))) + ((n = n % a) > 35 ? String.fromCharCode(n + 29) : n.toString(36));
        };
        var dict = {};
        while (c--) dict[enc(c)] = k[c] || enc(c);
        out += "\n" + p.replace(/\b\w+\b/g, function (w) { return dict[w] !== undefined ? dict[w] : w; });
    }
    return out;
}

function base64Decode(input) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = String(input).replace(/[^A-Za-z0-9+\/]/g, "");
    var out = "";
    for (var i = 0; i < str.length; i += 4) {
        var a = chars.indexOf(str.charAt(i)), b = chars.indexOf(str.charAt(i + 1));
        var c = i + 2 < str.length ? chars.indexOf(str.charAt(i + 2)) : -1;
        var d = i + 3 < str.length ? chars.indexOf(str.charAt(i + 3)) : -1;
        out += String.fromCharCode((a << 2) | (b >> 4));
        if (c >= 0) out += String.fromCharCode(((b & 15) << 4) | (c >> 2));
        if (d >= 0) out += String.fromCharCode(((c & 3) << 6) | d);
    }
    return out;
}

// Indirizzo del player: iframe_url in base64, oppure i data-* concatenati e
// invertiti (cid / base / rtype / keys). È lo script della pagina, non un anti-bot.
function hiddenPlayerUrls(html) {
    var out = [];
    var add = function (u) {
        if (u && /^https?:\/\//i.test(u) && out.indexOf(u) === -1) out.push(u);
    };
    var re = /["']iframe_url["']\s*:\s*["']([A-Za-z0-9+/=]{16,})["']/g;
    var found;
    while ((found = re.exec(html)) !== null && out.length < 6) add(base64Decode(found[1]));
    var cfg = html.match(/cid:\s*['"]([^'"]+)['"][\s\S]{0,400}?base:\s*['"]([^'"]+)['"][\s\S]{0,240}?rtype:\s*['"]([^'"]+)['"][\s\S]{0,240}?keys:\s*\[([^\]]+)\]/);
    if (cfg) {
        var names = cfg[4].match(/['"]([^'"]+)['"]/g) || [];
        var parts = [];
        var ok = true;
        for (var i = 0; i < names.length; i++) {
            var name = names[i].replace(/['"]/g, "");
            var attr = html.match(new RegExp("\\b" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*=\\s*[\"']([^\"']+)[\"']", "i"));
            if (!attr) { ok = false; break; }
            parts.push(attr[1]);
        }
        if (ok && parts.length) {
            var rev = parts.join("").split("").reverse().join("");
            var base = cfg[2];
            add(base + (base.indexOf("?") === -1 ? "?" : "&") + cfg[3] + "r=" + rev);
        }
    }
    return out;
}

class DefaultExtension extends MProvider {
    constructor() {
        super();
        this.client = new Client();
    }

    getHeaders(url) {
        return { "User-Agent": UA };
    }

    headers(referer) {
        return {
            "User-Agent": UA,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9,it;q=0.8",
            "Referer": referer || (BASE + "/"),
        };
    }

    playerHeaders(referer) {
        return {
            "User-Agent": UA,
            "Referer": referer || (BASE + "/"),
            "Accept-Language": "en-US,en;q=0.9",
        };
    }

    async fetchHtml(url, referer) {
        var res;
        try {
            res = await this.client.get(url, this.headers(referer));
        } catch (e) {
            throw new Error("JAV Guru non risponde. Controlla la rete e tocca Riprova.");
        }
        var body = String(res.body || "");
        var status = res.statusCode || 0;
        if (isGate(body, status)) {
            throw new Error("JAV Guru chiede un controllo del browser. Tocca Webview, aspetta che il sito si apra, poi tocca Riprova.");
        }
        if (isAgeWall(body)) {
            throw new Error("JAV Guru chiede la verifica dell'età. Tocca Webview, completala, poi tocca Riprova.");
        }
        if (status >= 400) throw new Error("JAV Guru ha risposto con errore " + status + ".");
        return body;
    }

    async load(url) {
        var html = await this.fetchHtml(url, BASE + "/");
        return { html: html, list: listingCards(html), hasNextPage: hasNext(html) };
    }

    async pageList(path, page) {
        var url = BASE + path;
        if (page > 1) {
            if (path.indexOf("?") !== -1) url = BASE + "/page/" + page + "/" + path.slice(path.indexOf("?"));
            else url = BASE + path.replace(/\/+$/, "") + "/page/" + page + "/";
        }
        var got = await this.load(url);
        return { list: got.list, hasNextPage: got.hasNextPage && got.list.length > 0 };
    }

    async getPopular(page) {
        if (page > 1) return { list: [], hasNextPage: false };
        var html = await this.fetchHtml(BASE + "/most-watched-rank/", BASE + "/");
        var list = listingCards(panelHtml(html, "content-today"));
        if (!list.length) list = listingCards(html).slice(0, 30);
        return { list: list, hasNextPage: false };
    }

    async getLatestUpdates(page) {
        return this.pageList(page > 1 ? "/page/" + page + "/" : "/", 1);
    }

    pick(filters, name) {
        var f = (filters || []).filter(function (x) { return x && x.name === name; })[0];
        if (!f || !f.values) return "";
        var v = f.values[f.state || 0];
        return v && v.value ? v.value : "";
    }

    async search(query, page, filters) {
        var text = String(query || "").trim();
        var pasted = text.match(/https?:\/\/(?:www\.)?jav\.guru\/\S+/i);
        if (!pasted && /^\/\d+\//.test(text)) pasted = [BASE + text];
        if (pasted) return this.openUrl(pasted[0].replace(/[)\].,;]+$/, ""), page);

        var cat = this.pick(filters, "Categoria");
        var period = this.pick(filters, "Classifica") || "today";
        if (text) {
            var q = "/?s=" + encodeURIComponent(text);
            return this.pageList(q, page);
        }
        if (cat.indexOf("cat:") === 0) return this.pageList("/category/" + cat.slice(4) + "/", page);
        if (cat.indexOf("tag:") === 0) return this.pageList("/tag/" + cat.slice(4) + "/", page);
        if (page > 1) return { list: [], hasNextPage: false };
        var rank = await this.fetchHtml(BASE + "/most-watched-rank/", BASE + "/");
        return { list: listingCards(panelHtml(rank, "content-" + period)), hasNextPage: false };
    }

    async openUrl(url, page) {
        var abs = cleanLink(url);
        if (/\/\d+\//.test(pathOf(abs)) && page === 1 && !/\/page\/\d+\//.test(abs)) {
            var one = await this.detailCard(abs);
            return { list: one ? [one] : [], hasNextPage: false };
        }
        if (page > 1 && !/\/page\/\d+\//.test(abs)) {
            abs = abs.replace(/\/?(\?|$)/, function (_, q) { return "/page/" + page + "/" + q; });
        }
        var got = await this.load(abs);
        return { list: got.list, hasNextPage: got.hasNextPage && got.list.length > 0 };
    }

    async detailCard(url) {
        var detail = await this.getDetail(url);
        return { name: detail.name, imageUrl: detail.imageUrl, link: detail.link };
    }

    field(html, label) {
        var re = new RegExp("<li[^>]*>\\s*<strong>[\\s\\S]{0,80}?" + label + "[\\s\\S]{0,40}?<\\/strong>([\\s\\S]*?)<\\/li>", "i");
        var m = String(html || "").match(re);
        if (!m) return "";
        return decodeEntities(m[1].replace(/<[^>]+>/g, " "));
    }

    async getDetail(url) {
        var abs = cleanLink(url);
        var path = pathOf(abs);
        if (!/^\/\d+\//.test(path)) throw new Error("Link di JAV Guru non riconosciuto.");
        var html = await this.fetchHtml(abs, BASE + "/");
        var h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        var title = decodeEntities(h1 ? h1[1].replace(/<[^>]+>/g, " ") : "") || pageTitle(html).replace(/\s*[⋆•].*$/, "").trim();
        var info = html.match(/class="infoleft"[\s\S]*?<\/ul>/i);
        var infoHtml = info ? info[0] : "";
        var slugs = tagSlugs(infoHtml);
        var labels = tagLabels(infoHtml);
        if (blockedTitle(title) || slugs.some(blockedSlug) || labels.some(blockedLabel)) {
            throw new Error("Questo video è in una categoria esclusa (minori o contenuto non consensuale) e non viene aperto.");
        }
        var shot = html.match(/class="large-screenshot"[\s\S]{0,1200}?<img\b[^>]*>/i);
        var image = coverUrl(shot ? cardImage(shot[0]) : "", abs);
        if (!image) {
            var og = metaContent(html, ["og:image"]);
            image = coverUrl(og, abs);
        }
        var lines = [];
        ["Code", "Release Date", "Category", "Director", "Studio", "Label", "Series", "Actress", "Actor"].forEach(function (label) {
            var value = this.field(infoHtml, label);
            if (value) lines.push(label + ": " + value);
        }, this);
        var views = html.match(/class="javstats"[\s\S]{0,200}?([\d.,]+\s*views)/i);
        var posted = html.match(/class="thedate"[\s\S]{0,200}?Posted:\s*([^<]+)/i);
        if (posted) lines.push("Posted: " + decodeEntities(posted[1]));
        if (views) lines.push(decodeEntities(views[1]));
        if (labels.length) lines.push("Tags: " + labels.join(", "));
        var genres = [];
        labels.forEach(function (name) {
            if (name && genres.indexOf(name) === -1) genres.push(name);
        });
        var cats = infoHtml.match(/rel="category tag">([^<]+)/gi) || [];
        cats.forEach(function (c) {
            var name = decodeEntities(c.replace(/^[^>]*>/, ""));
            if (name && genres.indexOf(name) === -1 && !blockedLabel(name)) genres.push(name);
        });
        var actress = this.field(infoHtml, "Actress");
        return {
            name: title,
            imageUrl: image || undefined,
            link: path,
            description: lines.join("\n"),
            author: actress || undefined,
            genre: genres,
            status: 1,
            chapters: [{ name: "Video", url: path }],
        };
    }

    video(url, label, quality, referer) {
        var isHls = /\.m3u8(\?|$)/i.test(url);
        var name = label + (quality ? " " + quality + "p" : isHls ? " Auto" : "");
        return {
            url: url,
            originalUrl: url,
            quality: name.trim(),
            headers: this.playerHeaders(referer),
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
        var kvs = /\b(video_url|video_alt_url\d*)\s*:\s*'(?:function\/0\/)?(https?:\/\/[^']+)'/g;
        while ((m = kvs.exec(text)) !== null) {
            if (seen[m[2]] || NOT_THE_VIDEO.test(m[2])) continue;
            seen[m[2]] = true;
            var lab = text.match(new RegExp(m[1] + "_text\\s*:\\s*'(\\d{3,4})"));
            out.push({ url: m[2], quality: lab ? parseInt(lab[1], 10) : qualityOf(m[2], "") });
        }
        var tagRe = /<(?:video|source)\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
        while ((m = tagRe.exec(html)) !== null) {
            var s = resolveUrl(m[1], pageUrl);
            if (!s || seen[s] || /^blob:/i.test(m[1]) || NOT_THE_VIDEO.test(s)) continue;
            seen[s] = true;
            out.push({ url: s, quality: qualityOf(s, m[0]) });
        }
        return out;
    }

    declaredCandidates(html, pageUrl) {
        var text = unescapeJs(html);
        var out = [];
        var add = function (u, q) {
            u = resolveUrl(u, pageUrl);
            if (!u || NOT_THE_VIDEO.test(u) || /\.(jpe?g|png|gif|webp|svg|vtt|srt|css|js|html?|php)(\?|$)/i.test(u.split("#")[0]) && !/\.php\?.*(video|file|id)=/i.test(u)) return;
            if (u === pageUrl || out.some(function (o) { return o.url === u; })) return;
            out.push({ url: u, quality: q || qualityOf(u, "") });
        };
        var cu = text.match(/"contentUrl"\s*:\s*"([^"]+)"/i);
        if (cu) add(cu[1]);
        var ogv = metaContent(html, ["og:video:secure_url", "og:video:url", "og:video"]);
        if (ogv && /\/(get|stream|video|media|play|file|dl|download)[\/_?-]/i.test(ogv)) add(ogv);
        var src = /(?:sources\s*:\s*\[|setup\s*\(|new\s+Plyr|videojs\s*\()[\s\S]{0,3000}/gi, block;
        while ((block = src.exec(text)) !== null) {
            var fr = /["']?(?:file|src)["']?\s*:\s*["']((?:https?:)?\/\/[^"']+|\/[^"']+)["']([^}]{0,200})/gi, f;
            while ((f = fr.exec(block[0])) !== null) {
                if (/\.(jpe?g|png|gif|webp|vtt|srt)(\?|$)/i.test(f[1])) continue;
                var lab = f[2].match(/["']?(?:label|res|quality|size)["']?\s*:\s*["']?(\d{3,4})/i);
                add(f[1], lab ? parseInt(lab[1], 10) : 0);
            }
        }
        var loose = /["'](?:file|src|videoUrl|video_url|contentUrl|hls2)["']\s*:\s*["']((?:https?:)?\/\/[^"']+)["']/gi, one;
        while ((one = loose.exec(text)) !== null) {
            if (NOT_VIDEO_KEY.test(keyBefore(text, one.index))) continue;
            if (AD_HOSTS.test(one[1])) continue;
            if (!new RegExp("\\.(" + VIDEO_EXT + ")(\\?|$)", "i").test(one[1]) && !/\/(get_file|stream|media|playlist|videoplayback)\b/i.test(one[1])) continue;
            add(one[1]);
        }
        return out;
    }

    async videosFromHtml(html, pageUrl, depth) {
        var videos = [];
        html = String(html || "") + unpackAll(html);
        var direct = this.directCandidates(html, pageUrl).concat(this.declaredCandidates(html, pageUrl));
        for (var i = 0; i < direct.length; i++) {
            videos.push(this.video(direct[i].url, hostOf(pageUrl).replace(/^www\./, ""), direct[i].quality, pageUrl));
        }
        if (depth >= 2) return videos;

        var frames = [];
        hiddenPlayerUrls(html).forEach(function (u) {
            u = resolveUrl(u, pageUrl);
            if (u && !AD_HOSTS.test(u) && frames.indexOf(u) === -1) frames.push(u);
        });
        var re = /<iframe\b[^>]*?\b(?:data-lazy-src|data-src|src)\s*=\s*["']([^"']+)["']/gi;
        var m;
        while ((m = re.exec(html)) !== null) {
            var f = resolveUrl(m[1], pageUrl);
            if (f && !AD_HOSTS.test(f) && !/youtube\.com|youtu\.be|about:blank/i.test(f) && frames.indexOf(f) === -1) frames.push(f);
        }
        var b64re = /\bdata-(?:embed|src|link|url|video|server|href|player|iframe)\s*=\s*["']([A-Za-z0-9+\/=_-]{16,})["']/gi, b;
        while ((b = b64re.exec(html)) !== null) {
            var dec = "";
            try { dec = base64Decode(b[1].replace(/-/g, "+").replace(/_/g, "/")); } catch (e) { dec = ""; }
            if (/^https?:\/\/[^\s"'<>]+$/.test(dec) && !AD_HOSTS.test(dec) && frames.indexOf(dec) === -1) frames.unshift(dec);
        }
        var text = unescapeJs(html);
        var hostRe = /https?:\/\/[^\s"'<>\\]*(?:dood|streamtape|filemoon|streamwish|mp4upload|ok\.ru\/videoembed|sendvid|voe\.sx|sibnet|streamlare)[^\s"'<>\\]*/gi;
        while ((m = hostRe.exec(text)) !== null) {
            if (frames.indexOf(m[0]) === -1 && !AD_HOSTS.test(m[0])) frames.push(m[0]);
        }

        var self = this;
        var list = frames.slice(0, 6);
        if (!list.length) return videos;
        // Si aspettano i server partiti insieme. Il primo indirizzo non basta:
        // alcuni rispondono 403, e il player buono arriva un attimo dopo.
        var collected = await new Promise(function (resolve) {
            var results = [], pending = list.length, done = false, timer = null;
            var finish = function () {
                if (done) return;
                done = true;
                if (timer && typeof clearTimeout === "function") clearTimeout(timer);
                resolve(results);
            };
            if (typeof setTimeout === "function") timer = setTimeout(finish, 20000);
            list.forEach(function (f) {
                self.videosFromFrame(f, pageUrl, depth).catch(function () { return []; }).then(function (got) {
                    if (done) return;
                    if (got && got.length) results = results.concat(got);
                    pending -= 1;
                    if (pending === 0) finish();
                });
            });
        });
        return videos.concat(collected);
    }

    async videosFromFrame(frameUrl, referer, depth) {
        for (var i = 0; i < KNOWN_HOSTS.length; i++) {
            if (!KNOWN_HOSTS[i][0].test(hostOf(frameUrl))) continue;
            try {
                var list = await KNOWN_HOSTS[i][1](frameUrl);
                if (list && list.length) return list.map(function (v) { v._score = 5; return v; });
            } catch (e) {}
            break;
        }
        var html = await this.fetchHtml(frameUrl, referer);
        return this.videosFromHtml(html, frameUrl, depth + 1);
    }

    async expandHls(entry) {
        if (!/\.m3u8(\?|$)/i.test(entry.url)) return [entry];
        var res;
        try {
            res = await this.client.get(entry.url, entry.headers);
        } catch (e) {
            return [];
        }
        var body = String(res.body || "");
        var status = res.statusCode || 0;
        // Un master che risponde 403 o con HTML non è il video. Si prova un altro server.
        if (status >= 400 || !/#EXTM3U/i.test(body) || /just a moment|cf-chl-/i.test(body.slice(0, 2000))) return [];
        if (!/#EXT-X-STREAM-INF/i.test(body)) {
            return [{
                url: entry.url,
                originalUrl: entry.url,
                quality: "Auto · " + hostOf(entry.url).replace(/^www\./, ""),
                headers: entry.headers,
            }];
        }
        var lines = body.split(/\r?\n/);
        var variants = [];
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].indexOf("#EXT-X-STREAM-INF:") !== 0) continue;
            var next = (lines[i + 1] || "").trim();
            if (!next || next.charAt(0) === "#") continue;
            var resm = lines[i].match(/RESOLUTION=(\d+)x(\d+)/i);
            var h = resm ? parseInt(resm[2], 10) : 0;
            var url = resolveUrl(next, entry.url);
            if (!url || variants.some(function (v) { return v.url === url; })) continue;
            variants.push({ h: h, url: url });
        }
        if (!variants.length) return [entry];
        variants.sort(function (a, b) { return b.h - a.h; });
        var host = hostOf(entry.url).replace(/^www\./, "");
        var out = variants.map(function (v) {
            return {
                url: v.url,
                originalUrl: v.url,
                quality: (v.h ? v.h + "p" : "HLS") + " · " + host,
                headers: entry.headers,
            };
        });
        out.push({
            url: entry.url,
            originalUrl: entry.url,
            quality: "Auto · " + host,
            headers: entry.headers,
        });
        return out;
    }

    async getVideoList(url) {
        var link = cleanLink(url);
        var detailHtml = await this.fetchHtml(link, BASE + "/");
        var info = detailHtml.match(/class="infoleft"[\s\S]*?<\/ul>/i);
        var infoHtml = info ? info[0] : "";
        var h1 = detailHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        var title = decodeEntities(h1 ? h1[1].replace(/<[^>]+>/g, " ") : "");
        if (blockedTitle(title) || tagSlugs(infoHtml).some(blockedSlug) || tagLabels(infoHtml).some(blockedLabel)) {
            throw new Error("Questo video è in una categoria esclusa (minori o contenuto non consensuale) e non viene aperto.");
        }
        var videos = await this.videosFromHtml(detailHtml, link, 0);
        videos.sort(function (a, b) { return (b._score || 0) - (a._score || 0); });
        var seen = {};
        videos = videos.filter(function (v) {
            var k = String(v.url).split("?")[0].replace(/\/+$/, "");
            if (seen[k]) return false;
            seen[k] = true;
            return true;
        });
        if (!videos.length) {
            throw new Error("Nessun video in questa pagina. Se il sito ha chiesto un controllo, aprilo dalla Webview e tocca Riprova.");
        }
        var expanded = [];
        for (var i = 0; i < videos.length && !expanded.length; i++) {
            expanded = await this.expandHls(videos[i]);
        }
        if (!expanded.length) {
            throw new Error("Il player non si apre da questa rete. Se il sito ha chiesto un controllo, aprilo dalla Webview e tocca Riprova.");
        }
        expanded.forEach(function (v) { delete v._score; });
        return expanded;
    }

    getFilterList() {
        var options = function (pairs) {
            return pairs.map(function (p) { return { type_name: "SelectOption", name: p[1], value: p[0] }; });
        };
        return [
            {
                type_name: "HeaderFilter",
                name: "Cerca un codice o un titolo, oppure lascia vuoto e scegli Categoria. Classifica (oggi, settimana, mese) vale con la ricerca vuota e Categoria su Tutte. Le categorie di minori e quelle non consensuali non ci sono.",
            },
            { type_name: "SelectFilter", name: "Categoria", state: 0, values: options(CATEGORIES) },
            { type_name: "SelectFilter", name: "Classifica", state: 0, values: options(PERIODS) },
        ];
    }

    getSourcePreferences() {
        return [];
    }
}
