const mangayomiSources = [
    {
        "name": "Link universale",
        "lang": "it",
        "baseUrl": "https://adam72881.github.io/mangayomi-anime-extensions",
        "apiUrl": "",
        "iconUrl": "https://raw.githubusercontent.com/adam72881/mangayomi-anime-extensions/main/icons/linkuniversale.png",
        "typeSource": "single",
        "isNsfw": true,
        "itemType": 1,
        "version": "1.4.22",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/linkuniversale.js",
    },
];

// Pagina ponte (GitHub Pages, ramo gh-pages). Mangayomi, per le estensioni JS,
// apre sempre source.baseUrl (pulsante della lista) oppure baseUrl + percorso
// del link (scheda): non chiama un metodo dell'estensione. baseUrl resta il
// ponte, così l'identità della sorgente e gli aggiornamenti non cambiano e la
// scheda di un altro sito arriva comunque al sito vero. Il frammento è
// #lu=<host del contenuto>&m=<host del sito principale>. 404.html porta al
// contenuto e ricorda m; index.html, se m è già noto, sostituisce subito la
// pagina con il sito principale senza mostrare l'elenco.
const BRIDGE = "https://adam72881.github.io/mangayomi-anime-extensions";
const PREF_HISTORY = "linkuni_history";
const PREF_NEXT = "linkuni_next_pages";
const PREF_ADD = "linkuni_add_site";
const STORE_SAVED = "linkuni_saved_sites";
const STORE_LAST_ADDED = "linkuni_last_added";
const STORE_MAIN = "linkuni_main_site";
const STORE_READY_OFF = "linkuni_ready_off";
const PREF_RANDOM = "linkuni_random_site";
const PREF_QUALITY = "linkuni_quality";
const PREF_DEBUG = "linkuni_debug";
const PREF_RENAME = "linkuni_rename";
const PREF_NAV = "linkuni_nav";
const STORE_CAT_URLS = "linkuni_cat_urls";
const STORE_NAMES = "linkuni_names";
const STORE_LAST_RENAME = "linkuni_last_rename";
const STORE_SAVED_OFF = "linkuni_saved_off";
const STORE_ADD_NOTE = "linkuni_add_note";
const STORE_DISMISS = "linkuni_add_dismissed";
const STORE_RANDOM = "linkuni_random_pick_";

// Siti provati: lista, ricerca e video funzionano senza fare niente.
const READY = [
    ["https://www.pornhub.com", "Pornhub"],
    ["https://xhamster.com", "xHamster"],
    ["https://www.xvideos.com", "xVideos"],
    ["https://www.xnxx.com", "xnxx"],
    ["https://www.eporner.com", "Eporner"],
    ["https://www.porntrex.com", "Porntrex"],
    ["https://hqporner.com", "HQporner"],
    ["https://www.porndig.com", "PornDig"],
    ["https://pornone.com", "PornOne"],
    ["https://www.xozilla.com", "Xozilla"],
    ["https://it.pornhat.com", "PornHat (italiano)"],
    ["https://www.tnaflix.com", "TNAFlix"],
    ["https://www.empflix.com", "EMPFlix"],
    ["https://www.youjizz.com", "YouJizz"],
    ["https://www.anysex.com", "AnySex"],
    ["https://www.3movs.com", "3movs"],
    ["https://www.sunporno.com", "SunPorno"],
    ["https://www.sexvid.xxx", "SexVid"],
    ["https://www.pornid.xxx", "PornID"],
    ["https://ok.xxx", "OK.xxx"],
    ["https://www.pornwhite.com", "PornWhite"],
    ["https://xbabe.com", "xBabe"],
    ["https://www.porngo.com", "PornGo"],
    ["https://www.porn300.com", "Porn300"],
    ["https://www.xxxbunker.com", "XXXBunker"],
    ["https://www.fetishshrine.com", "FetishShrine (fetish, BDSM)"],
    ["https://bdsmstreak.com", "Bdsmstreak (BDSM)"],
    ["https://www.analvids.com", "AnalVids (hardcore)"],
    ["https://www.ah-me.com", "Ah-Me"],
    ["https://www.perfectgirls.xxx", "PerfectGirls"],
    ["https://www.pornmz.com", "PornMZ"],
    ["https://www.xfreehd.com", "xFreeHD"],
    ["https://www.alphaporno.com", "AlphaPorno"],
    ["https://www.porndroids.com", "PornDroids"],
    ["https://www.porngem.com", "PornGem"],
    ["https://www.megatube.xxx", "MegaTube"],
    ["https://hellporno.com", "HellPorno"],
    ["https://www.trendyporn.com", "TrendyPorn"],
    ["https://anyporn.com", "AnyPorn"],
    ["https://yesporn.vip", "YesPorn"],
    ["https://www.thisvid.com", "ThisVid"],
    ["https://www.tokyomotion.net", "TokyoMotion"],
    ["https://jav.guru", "JavGuru"],
    ["https://www.xxxfiles.com", "XXXFiles"],
    ["https://www.bravoporn.com", "BravoPorn"],
    ["https://www.homemoviestube.com", "HomeMovies"],
    ["https://www.youramateurporn.com", "YourAmateur"],
    ["https://www.sexu.com", "Sexu (480p)"],
    ["https://www.pornrewind.com", "PornRewind"],
    ["https://www.fpo.xxx", "FPO.xxx"],
    ["https://www.javbangers.com", "JavBangers"],
    ["https://www.tubev.sex", "TubeV"],
    ["https://zbporn.com", "ZBporn (360p)"],
    ["https://www.bravotube.net", "BravoTube (360p)"],
    ["https://www.youporn.com", "YouPorn (360p)"],
    ["https://www.redtube.com", "RedTube (360p)"],
    ["https://www.tube8.com", "Tube8 (360p)"],
    ["https://www.animesaturn.net", "AnimeSaturn"],
    ["https://www.animeworld.ac", "AnimeWorld"],
    ["https://www.hentaiworld.me", "HentaiWorld"],
    ["https://hentaimama.io", "HentaiMama"],
    ["https://hentaigasm.com", "Hentaigasm"],
    ["https://hentaistream.com", "HentaiStream"],
    ["https://hentaifreak.org", "HentaiFreak"],
];
const PREF_SEARCH = "linkuni_search_patterns";
const PREF_SECTIONS = "linkuni_sections";
const HISTORY_MAX = 60;
const VIDEO_EXT = "m3u8|mp4|webm|mkv|mov|m4v";
// Mangayomi, per le estensioni JS, carica le copertine solo con getHeaders().
// Se manca lo User-Agent non ne aggiunge uno: alcuni siti rispondono con
// HTML (403) e la miniatura resta grigia. È lo stesso identikit già usato
// dalle altre estensioni di questo repo, non un bypass di Cloudflare.
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

// Anteprime, miniature animate e pubblicità: sono mp4 veri, ma non il video.
// Anteprime al passaggio del dito: /vp/50/p320-180.mp4 (TubeV e simili).
const NOT_THE_VIDEO = /\/tmb\/|\/plain\/|rs:fi(?:t|ll)|\/gifs?\/|thumb|preview|sprite|poster|teaser|trailer|\/pics\/|\/vp\/\d+\/|\/p\d{2,4}-\d{2,4}\.(?:mp4|webm)/i;
const AD_HOSTS = /a-ads\.com|doubleclick|googlesyndication|googletagmanager|google-analytics|facebook\.com|twitter\.com|disqus|recaptcha|hcaptcha|cloudflare|wingsmob|exoclick|juicyads|trafficjunky|adsterra|popads|histats|gsrv\.dev|tsyndicate|magsrv|realsrv|ad-delivery|adnxs|adtng|\bvast\b/i;

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

// Pagine di servizio, pubblicità e redirect: non sono video né serie.
function isContentPath(path) {
    // Cambio lingua: /es/, /pt-br/
    if (/^\/[a-z]{2}(-[a-z]{2})?\/?$/i.test(path.split("?")[0])) return false;
    return !/\/(login|signup|register|premium|upload|privacy|terms|dmca|contact|logout|account|out|go|redirect|click|ads?|rss|feed|feeds)(\/|\?|$)|[?&]utm_|\/ff\/out/i.test(path);
}

// Testi che non sono titoli: qualità, durata, «HD», contatori.
function weakTitle(t) {
    return !t || t.length < 4 || ageJunkTitle(t) || /^(screenshot|thumbnail|thumb|image|preview|poster|immagine|anteprima|18\+)\b/i.test(t.trim()) || /^(\d{3,4}p|hd|4k|vr|new|\d+(:\d+)+|\d+\s*(min|sec|views?)?)(\s*(cc|hd|4k|vr))*$/i.test(t.trim());
}

// Titoli della pagina di conferma età: non sono video.
function ageJunkTitle(t) {
    return /^(verify your age|age verification|confirm your age|age restricted|adults only|i am 18|i'm 18|enter site|verifica( la tua)? et[aà]|conferma( la tua)? et[aà]|ho 18 anni|sono maggiorenne)\b/i.test(String(t || "").trim());
}

function ageWallText(html) {
    var title = pageTitle(html);
    if (title.length < 100 && /verify your age|age verification|verifica dell.et|verifica la tua et|conferma la tua et|age restricted|verify user ages|agegate/i.test(title)) return true;
    var n = (String(html).slice(0, 50000).match(/verify your age|age verification|verifica dell.et|verifica la tua et/gi) || []).length;
    return n >= 3;
}

// Verifica vera (account, e-mail, documento, servizio esterno): non si aggira.
function hardAgeCheck(html) {
    return /yoti|veriff|ondato|au10tix|ageid|getyoti|verify-my-age|idscan|credit card|carta d'identit|documento d'identit|crea un account|create an account|confirm your email|conferma la tua e-mail|openModalAgeVer|government identification|upload your id/i.test(String(html).slice(0, 80000));
}

// Cookie che il sito scrive quando si clicca «ho 18 anni» (valore corto, niente sessione).
function simpleAgeCookie(html) {
    var nameOk = /age|adult|discl|verify|mature|nsfw|gate|enter/i;
    var valueOk = /^(1|2|true|yes|ok|18|on)$/i;
    var re = /document\.cookie\s*=\s*["']([A-Za-z0-9_\-]{2,40})=([^;"'\s]{1,24})/g;
    var m;
    while ((m = re.exec(html)) !== null) {
        if (nameOk.test(m[1]) && valueOk.test(m[2])) return m[1] + "=" + m[2];
    }
    var re2 = /(?:create_cookie|setCookie|Cookies\.set)\(\s*["']([A-Za-z0-9_\-]{2,40})["']\s*,\s*["']?([A-Za-z0-9_\-]{1,12})/g;
    while ((m = re2.exec(html)) !== null) {
        if (nameOk.test(m[1]) && valueOk.test(m[2])) return m[1] + "=" + m[2];
    }
    return "";
}

function siteFamily(html) {
    var h = String(html || "");
    if (/video_url\s*:|kt_player|\/get_file\//i.test(h)) return "kvs";
    if (/wp-content\/uploads/i.test(h) && /<article\b/i.test(h)) return "wordpress";
    if (/thumb-block|html5player/i.test(h)) return "xv";
    if (/"thumbURL"\s*:|"pageURL"\s*:/i.test(h)) return "json";
    return "html";
}

function twoDigits(n) {
    n = String(n);
    return n.length < 2 ? "0" + n : n;
}

function humanDuration(raw) {
    var s = String(raw || "").trim();
    var iso = s.match(/^P(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?|(\d+)D)/i);
    if (iso && (iso[1] || iso[2] || iso[3])) {
        var h = parseInt(iso[1] || "0", 10), m = parseInt(iso[2] || "0", 10), sec = parseInt(iso[3] || "0", 10);
        if (h) return h + ":" + twoDigits(m) + ":" + twoDigits(sec);
        return m + ":" + twoDigits(sec);
    }
    if (/^\d+$/.test(s)) {
        var n = parseInt(s, 10);
        if (n > 0 && n < 60 * 60 * 12) return Math.floor(n / 60) + ":" + twoDigits(n % 60);
    }
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(s)) return s;
    return "";
}

function humanDate(raw) {
    var m = String(raw || "").match(/(\d{4})-(\d{2})-(\d{2})/);
    return m ? m[3] + "/" + m[2] + "/" + m[1] : "";
}

function videoFacts(html) {
    var text = unescapeJs(html);
    var dur = "", date = "";
    var dm = text.match(/"duration"\s*:\s*"([^"]+)"/i) ||
        html.match(/itemprop=["']duration["'][^>]*content=["']([^"']+)/i) ||
        html.match(/content=["']([^"']+)["'][^>]*itemprop=["']duration["']/i) ||
        html.match(/(?:property|name)=["'](?:video:duration|og:video:duration)["'][^>]*content=["']([^"']+)/i);
    if (dm) dur = humanDuration(dm[1]);
    var dt = text.match(/"(?:uploadDate|datePublished)"\s*:\s*"([^"]+)"/i) ||
        html.match(/<time[^>]*datetime=["']([^"']+)/i);
    if (dt) date = humanDate(dt[1]);
    return { duration: dur, date: date };
}

// Raccolta «Gooning»: PMV, goon, hypno ed edging su più siti insieme.
const GOON_SITES = [
    "https://xhamster.com", "https://www.pornhub.com", "https://www.xvideos.com", "https://www.xnxx.com",
    "https://www.eporner.com", "https://www.porntrex.com", "https://pornone.com", "https://www.youjizz.com",
    "https://www.xozilla.com", "https://www.sunporno.com",
];
// Titoli che sono davvero da gooning: tiene fuori i video qualsiasi che i siti
// mettono tra i risultati (consigliati, popolari).
const GOON_TITLE = /pmv|hmv|goon|hypno|trance|edg(e|ing)|cock ?hero|compil|mix\b|tribute|\bjoi\b|\bcei\b|beat|bambi|sissy|brainwash|mindless/i;
const GOON_WORDS = ["pmv", "goon", "hypno", "edging"];
const SIDE_PATH = /\/(c|cat|cats|category|categories|tags?|channels?|pornstars?|models?|studios?|genres?|generi|genere|users?|members?|playlists?|search|albums?|photos?|gallery|galleries|pics)(\/|\?|$)|[?&](genre|tag|category|cat)=/i;

// Prima i video/le serie, poi categorie, tag, canali ecc. Tra i video, prima il
// gruppo di link più numeroso (es. /video-…/ su Eporner, non le /cat/).
function orderCards(cards) {
    var side = SIDE_PATH;
    var shape = function (c) {
        var p = c.link.replace(/^https?:\/\/[^\/]+/, "").split("?")[0].split("/").filter(Boolean);
        // «video-AbC123xyZ» e «video-Qq9…» sono lo stesso gruppo; «category» e «channel» no.
        return (p[0] || "").replace(/(?=[0-9a-z]*\d)[0-9a-z]{6,}$/i, "*").replace(/\d+/g, "#") + "/" + p.length;
    };
    // Peso di un gruppo: quante schede ha, il doppio se i link sembrano video
    // (un numero d'identificazione o un titolo lungo nel percorso).
    var weight = {};
    cards.forEach(function (c) {
        var path = c.link.replace(/^https?:\/\/[^\/]+/, "");
        var videoLike = /\d{3,}|[a-z0-9]+(?:[-_][a-z0-9]+){3,}/i.test(path) ? 2 : 1;
        var k = shape(c);
        weight[k] = (weight[k] || 0) + videoLike;
    });
    var groups = Object.keys(weight).sort(function (a, b) { return weight[b] - weight[a]; });
    var top = groups[0];
    return cards.map(function (c, i) {
        var path = c.link.replace(/^https?:\/\/[^\/]+/, "");
        return { c: c, i: i, side: side.test(path) ? 1 : 0, main: shape(c) === top && weight[top] >= 6 ? 0 : 1 };
    }).sort(function (a, b) {
        return a.main - b.main || a.side - b.side || a.i - b.i;
    }).map(function (x) { return x.c; });
}

function badImageUrl(src) {
    var u = String(src || "").trim();
    if (!u || /^(?:javascript|data|blob|about):/i.test(u)) return true;
    if (/\.svg(?:\?|$)/i.test(u)) return true;
    return /18plus|placeholder|blank[-_.]|\/blank\b|spacer|pixel\.|loading\.|lazy\.gif|missing_thumb|no[-_]?thumb|no[-_]?image|transparent|1x1|age[-_]?verif|\/logo|sprite|\/flags?\//i.test(u);
}

function badImageTag(tag) {
    var cls = (String(tag || "").match(/\bclass\s*=\s*["']([^"']+)/i) || ["", ""])[1];
    return /\b(?:size-helper|img_18plus|placeholder|logo|avatar|agegate)\b/i.test(cls);
}

// Punteggio di una miniatura: i segnaposto (tile grigio, icona 18+) valgono
// meno di zero e vengono scartati. Tra le altre vince la più «da foto».
function imageScore(src, tag) {
    if (badImageUrl(src) || badImageTag(tag)) return -1;
    var score = 10;
    var path = String(src).split("?")[0];
    if (/\.(?:jpe?g|webp|avif)$/i.test(path)) score += 6;
    else if (/\.png$/i.test(path)) score += 3;
    else if (/\.gif$/i.test(path)) score += 1;
    if (/thumb|poster|cover|upload|\/media\/|cdn|image/i.test(src)) score += 3;
    if (/\/static\/images\//i.test(src)) score -= 6;
    if (/[?&]prev=/.test(src)) score -= 3;
    if (tag && /\b(?:hidden|thumb_preview)\b/i.test(tag)) score -= 5;
    if (/\.mp4(?:\?|$)/i.test(path) && !/\/plain\/|rs:fit/i.test(src)) score -= 4;
    return score;
}

function bestOfSrcset(value) {
    var parts = String(value || "").split(",");
    var best = "", bestW = -1;
    for (var i = 0; i < parts.length; i++) {
        var bit = parts[i].trim().split(/\s+/);
        if (!bit[0]) continue;
        var w = parseInt(String(bit[1] || "").replace(/w$/i, ""), 10);
        if (isNaN(w)) w = 0;
        if (w >= bestW) { bestW = w; best = bit[0]; }
    }
    return best;
}

// L'immagine vera di una scheda. Non la prima <img>: sui siti che mettono
// prima un tile vuoto o l'icona «18+» quella è grigia o è la verifica dell'età.
function pickImage(html) {
    var tags = html.match(/<img\b[^>]*>/gi) || [];
    var attrs = ["data-src", "data-original", "data-lazy-src", "data-lazy", "data-mediumthumb", "data-thumb_url", "data-thumb", "data-image", "data-poster", "src"];
    var best = { tag: "", src: "", score: -1 };
    var consider = function (tag, src) {
        var score = imageScore(src, tag);
        if (score > best.score) best = { tag: tag, src: src, score: score };
    };
    for (var t = 0; t < tags.length; t++) {
        for (var j = 0; j < attrs.length; j++) {
            var m = tags[t].match(new RegExp("\\b" + attrs[j] + "\\s*=\\s*[\"']([^\"']+)[\"']", "i"));
            if (m) consider(tags[t], m[1]);
        }
        var ss = tags[t].match(/\b(?:data-)?srcset\s*=\s*["']([^"']+)["']/i);
        if (ss) consider(tags[t], bestOfSrcset(ss[1]));
    }
    if (best.score < 0) {
        var any = html.match(/\b(?:data-[\w-]+|poster|srcset|content)\s*=\s*["']((?:https?:)?\/\/[^"'\s,]+?\.(?:jpe?g|png|webp|avif)[^"'\s,]*|\/[^"'\s,]+?\.(?:jpe?g|png|webp|avif)[^"'\s,]*)/i) ||
            html.match(/background(?:-image)?\s*:\s*url\(\s*(?:&quot;|["'])?([^"')&]+)/i);
        if (any) consider(tags[0] || "", any[1]);
    }
    return { tag: best.tag || tags[0] || "", src: best.score >= 0 ? best.src : "" };
}

// Categorie del filtro, uguali per tutti i siti: [nome, parole da cercare sul sito].
const CATEGORIES = [
    ["Amatoriali", ["amateur", "amatoriali", "homemade"]],
    ["Anal", ["anal"]],
    ["Asiatiche", ["asian"]],
    ["BBW", ["bbw"]],
    ["BDSM", ["bdsm"]],
    ["Bionde", ["blonde"]],
    ["Bondage", ["bondage"]],
    ["Creampie", ["creampie"]],
    ["Ebony", ["ebony"]],
    ["Femdom", ["femdom"]],
    ["Feticismo", ["fetish"]],
    ["Gangbang", ["gangbang", "gang bang"]],
    ["Giapponesi", ["japanese"]],
    ["Hardcore", ["hardcore"]],
    ["Hentai", ["hentai"]],
    ["Latine", ["latina"]],
    ["Lesbiche", ["lesbian"]],
    ["Massaggio", ["massage"]],
    ["Mature", ["mature"]],
    ["MILF", ["milf"]],
    ["Orge", ["orgy"]],
    ["Pompini", ["blowjob"]],
    ["POV", ["pov"]],
    ["Rosse", ["redhead"]],
    ["Squirting", ["squirt"]],
    ["Tette grandi", ["big tits", "big boobs"]],
    ["Threesome", ["threesome"]],
];

// Siti JAV (giapponesi/asiatici): vanno nel filtro «Sito JAV», separati dagli altri.
// Basta «jav» nel nome del sito, più i siti pronti JAV che non lo hanno.
function isJavSite(url) {
    var h = hostOf(url);
    return /jav|tokyomotion|avhwa|sextb|7mmtv|missav|supjav|mythav/i.test(h);
}

// Schede che non sono video: categorie (/categories/x, /c/x, /big-tits/),
// attrici, canali, tag. Se nella pagina ci sono almeno 6 video, si tolgono.
function isSideCard(c) {
    var link = String(c.link).split("#")[0];
    var path = link.replace(/^https?:\/\/[^\/]+/, "");
    if (SIDE_PATH.test(path) || isCategoryPath(path)) return true;
    return link.indexOf("?") === -1 && /^\/[a-z]+(?:-[a-z]+){0,2}\/?$/i.test(path);
}

function dropSideCards(cards) {
    var videos = cards.filter(function (c) { return !isSideCard(c); });
    return videos.length >= 6 ? videos : cards;
}

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
    // Domini come jav.com.co o sito.co.uk: il nome è il terzo pezzo da destra.
    if (parts.length >= 3 && /^(co|com|net|org|ac|gov|ne|or)$/.test(parts[parts.length - 2]) && parts[parts.length - 1].length === 2) {
        return parts.slice(-3).join(".");
    }
    return parts.slice(-2).join(".");
}

// WordPress spesso mette i file su un CDN. Se quel CDN risponde con una
// pagina di verifica, la stessa path sul sito della pagina è il JPEG.
function coverUrl(src, pageUrl) {
    var abs = resolveUrl(src, pageUrl);
    if (!abs) return "";
    var path = abs.replace(/^https?:\/\/[^\/?#]+/i, "");
    if (/^\/wp-content\/uploads\//i.test(path.split("?")[0]) && hostOf(abs) !== hostOf(pageUrl)) {
        var origin = originOf(pageUrl);
        if (origin) return origin + path;
    }
    return abs;
}

// Pagina che non è un elenco: verifica, anti-bot, solo «serve JavaScript».
// Non va restituita come lista vuota.
function isGatePage(html) {
    var title = pageTitle(html);
    if (title.length < 90 && /just a moment|attention required|access denied|checking your browser|please enable javascript|one moment please|ddos protection|verifica del browser/i.test(title)) return true;
    var text = String(html);
    // Il beacon di Cloudflare sta anche nelle pagine vere: conta solo se non c'è un elenco.
    var catalog = /"thumbURL"|"pageURL"|wp-content\/uploads|<img\b[^>]+src=["']https?:\/\/[^"']+\.(?:jpe?g|png|webp)/i.test(text.slice(0, 120000));
    if (!catalog && /cf-chl-|challenge-platform|__cf_chl|cdn-cgi\/challenge/i.test(text.slice(0, 20000))) return true;
    if (!catalog && /javascript is required|please enable javascript/i.test(text.slice(0, 30000))) return true;
    return false;
}

function resolveUrl(href, base) {
    href = String(href || "").trim()
        .replace(/&#x([0-9a-f]+);/gi, function (_, h) { return String.fromCharCode(parseInt(h, 16)); })
        .replace(/&#(\d+);/g, function (_, n) { return String.fromCharCode(parseInt(n, 10)); })
        .replace(/&amp;/g, "&");
    if (!href || /^(javascript|mailto|tel|data|blob|about):/i.test(href) || href.charAt(0) === "#") return "";
    // Link scritti male dal sito: «hhttps://…», «/https://…».
    var absIn = href.match(/https?:\/\/[^\s"'<>]+$/i);
    if (absIn && absIn.index > 0 && absIn.index <= 3) href = absIn[0];
    // Spazi e caratteri non ASCII negli indirizzi (frequenti nelle immagini):
    // l'app non li carica se non sono codificati.
    href = href.replace(/[^\x21-\x7e]/g, function (ch) { return encodeURIComponent(ch); });
    if (/^https?:\/\//i.test(href)) return href;
    if (href.indexOf("//") === 0) return "https:" + href;
    var origin = originOf(base);
    if (href.charAt(0) === "/") return origin + href;
    var dir = String(base).split("#")[0].split("?")[0];
    dir = dir.slice(0, dir.lastIndexOf("/") + 1);
    if (dir.length <= origin.length) dir = origin + "/";
    return dir + href;
}

function tagLink(url, mainHost) {
    var clean = String(url || "").split("#")[0];
    var host = hostOf(clean);
    if (!host) return clean;
    var frag = "#lu=" + host;
    var main = hostOf(mainHost || "");
    if (main) frag += "&m=" + main;
    return clean + frag;
}

function tagList(res, mainHost) {
    res.list.forEach(function (c) { c.link = tagLink(c.link, mainHost); });
    return res;
}

// Indirizzo di un sito, da un testo libero: con o senza schema, con slash,
// virgole o più link. Stesso host una volta sola (https al posto di http).
function normalizeSiteInput(text) {
        var parts = String(text || "").replace(/[\u200b\u200c\u200d\ufeff]/g, "").split(/[\s,;]+/);
    var out = [];
    var at = {};
    for (var i = 0; i < parts.length; i++) {
        var x = parts[i].trim().replace(/^[<"'\u00ab\u00bb]+|[>"'\u00ab\u00bb),.;]+$/g, "").replace(/\/+$/, "");
        if (!x || /^(javascript|mailto|tel|data):/i.test(x)) continue;
        if (x.indexOf("//") === 0) x = "https:" + x;
        else if (!/^https?:\/\//i.test(x)) x = "https://" + x;
        var origin = originOf(x);
        var auth = (origin.match(/^https?:\/\/([^\/?#]+)/i) || ["", ""])[1].toLowerCase();
        var name = auth.split(":")[0];
        if (!name || name.indexOf(".") < 1 || auth.length > 253 || !/^[a-z0-9.-]+(?::\d{2,5})?$/.test(auth)) continue;
        var key = auth;
        var proto = /^http:/i.test(origin) ? "http://" : "https://";
        var norm = proto + key;
        if (at[key]) {
            if (proto === "https://" && out[at[key] - 1].indexOf("http://") === 0) out[at[key] - 1] = norm;
            continue;
        }
        at[key] = out.length + 1;
        out.push(norm);
    }
    return out;
}

function normCatUrl(abs) {
    var origin = originOf(abs);
    if (!origin) return "";
    var host = hostOf(origin);
    if (!host) return "";
    var proto = /^http:/i.test(origin) ? "http://" : "https://";
    var rest = String(abs).slice(origin.length).split("#")[0];
    // La barra finale resta com'è sul sito: /categories/milf/ e
    // /categories/milf non sono sempre la stessa pagina (spesso la seconda è 404).
    var path = (rest.split("?")[0] || "/").replace(/\/{2,}$/, "/") || "/";
    var q = "";
    var qm = rest.match(/\?([^#]*)/);
    if (qm && qm[1]) {
        var keep = [];
        qm[1].split("&").forEach(function (p) {
            var k = p.split("=")[0] || "";
            try { k = decodeURIComponent(k.replace(/\+/g, " ")); } catch (e) {}
            if (!k || /^(utm_|fbclid$|gclid$|ref$|order|orderby|order_by|sort|sortby|sort_by|direction)$/i.test(k)) return;
            keep.push(p);
        });
        if (keep.length) q = "?" + keep.join("&");
    }
    return proto + host + path + q;
}

// Percorso di una categoria: /categories/nome, /category/nome, /genre/nome, /c/Nome.
// Non tag, modelle, canali, pagine, numeri.
function isCategoryPath(path) {
    var parts = String(path || "").split("?")[0].split("/").filter(Boolean);
    if (parts.length !== 2) return false;
    if (/^(page|\d+)$/i.test(parts[0]) || /^(page|\d+)$/i.test(parts[1])) return false;
    if (/^(tags?|pornstars?|models?|channels?|studios?|users?|members?|search|photos?|pics|gifs?|albums?|playlists?|live|cams?)$/i.test(parts[0])) return false;
    if (/^(categories|category|cats|cat|genres|genre|generi|genere|categorie|categoria)$/i.test(parts[0])) return parts[1].length > 1 && /[a-zà-ù]/i.test(parts[1]);
    if (/^c$/i.test(parts[0])) return parts[1].length > 1 && parts[1].length <= 48 && /[a-zà-ù]/i.test(parts[1]);
    return false;
}

var CAT_LABEL_SKIP = /^(home|login|log ?in|sign ?in|sign ?up|register|signup|premium|upload|live|cams?|photos?|pics|gifs?|blog|forum|categories|category|categorie|categoria|generi|genres?|tags?|pornstars?|models?|channels?|studios?|more|menu|search|cerca|all|tutte|tutti|18\+|advertise|ads?|dmca|privacy|terms|contact|language|lingua|english|italiano|español|deutsch|français|português)$/i;

// Categorie dal HTML già scaricato. Servono almeno tre link con la stessa
// forma di percorso: un link solo non basta e non si inventa un elenco.
function jsonUnescape(s) {
    return String(s || "").replace(/\\\//g, "/").replace(/\\u([0-9a-f]{4})/gi, function (_, h) {
        return String.fromCharCode(parseInt(h, 16));
    }).replace(/\\"/g, '"');
}

function collectCategories(html, site) {
    var text = String(html || "");
    var origin = originOf(site) || String(site || "");
    var groups = {};
    var push = function (label, href) {
        label = decodeEntities(jsonUnescape(label).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
        label = label.replace(/\s*[\(\[]\d{1,7}[\)\]]\s*$/, "").replace(/\s+\d{1,7}$/, "").trim();
        if (label.length < 2 || label.length > 32 || !/[a-zà-ù]/i.test(label) || CAT_LABEL_SKIP.test(label)) return;
        var link = resolveUrl(jsonUnescape(href), origin + "/");
        if (!link || AD_HOSTS.test(link) || siteOf(link) !== siteOf(origin)) return;
        var path = link.replace(/^https?:\/\/[^\/?#]+/i, "");
        if (!isCategoryPath(path)) return;
        var url = normCatUrl(link);
        if (!url) return;
        var seg = path.split("?")[0].split("/").filter(Boolean)[0].toLowerCase();
        if (!groups[seg]) groups[seg] = [];
        groups[seg].push({ name: label, url: url });
    };
    var re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
    var m, seen = 0;
    while ((m = re.exec(text)) !== null && seen < 5000) {
        seen++;
        var href = (m[1].match(/\bhref\s*=\s*["']([^"'#][^"']*)["']/i) || ["", ""])[1];
        if (!href || /^(javascript|mailto|tel|data):/i.test(href)) continue;
        push(m[2], href);
    }
    var pair = /"(?:label|name|title)"\s*:\s*"((?:\\.|[^"\\]){2,40})"\s*,\s*"(?:href|url|link)"\s*:\s*"((?:\\.|[^"\\])+)"/g;
    var rev = /"(?:href|url|link)"\s*:\s*"((?:\\.|[^"\\])+)"\s*,\s*"(?:label|name|title)"\s*:\s*"((?:\\.|[^"\\]){2,40})"/g;
    var jm;
    while ((jm = pair.exec(text)) !== null && seen < 8000) { seen++; push(jm[1], jm[2]); }
    while ((jm = rev.exec(text)) !== null && seen < 8000) { seen++; push(jm[2], jm[1]); }
    var best = [];
    Object.keys(groups).forEach(function (k) {
        var uniq = [];
        var byUrl = {}, byName = {};
        groups[k].forEach(function (c) {
            var nk = c.name.toLowerCase();
            if (byUrl[c.url] || byName[nk]) return;
            byUrl[c.url] = true;
            byName[nk] = true;
            uniq.push(c);
        });
        if (uniq.length > best.length) best = uniq;
    });
    return best.length >= 3 ? best.slice(0, 40) : [];
}

function cleanLink(url) {
    var raw = String(url || "").trim().replace(/#lu=[^#]*$/, "");
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
        .replace(/&agrave;/g, "à").replace(/&egrave;/g, "è").replace(/&eacute;/g, "é").replace(/&igrave;/g, "ì")
        .replace(/&ograve;/g, "ò").replace(/&ugrave;/g, "ù").replace(/&nbsp;/g, " ")
        .replace(/&colon;/g, ":").replace(/&lpar;/g, "(").replace(/&rpar;/g, ")").replace(/&comma;/g, ",")
        .replace(/&excl;/g, "!").replace(/&quest;/g, "?").replace(/&period;/g, ".").replace(/&hellip;/g, "…")
        .replace(/&ndash;/g, "–").replace(/&mdash;/g, "—").replace(/&rsquo;|&lsquo;/g, "’")
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
    var q = near ? parseInt(near[1], 10) : 0;
    // Numeri vicini che non sono una qualità (100, 1794…): meglio nessuna etichetta.
    return [144, 240, 360, 480, 540, 576, 720, 1080, 1440, 2160].indexOf(q) !== -1 ? q : 0;
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

// Scompatta il codice «packer» (eval(function(p,a,c,k,e,d)…)): è solo codice
// compresso, il browser lo esegue così com'è. Serve a leggere il player.
function unpackAll(html) {
    var out = "";
    var re = /eval\(function\(p,a,c,k,e,[rd]\)\{[\s\S]*?\}\('([\s\S]*?)',\s*(\d+),\s*(\d+),\s*'([\s\S]*?)'\.split\('\|'\)/g;
    var m;
    while ((m = re.exec(html)) !== null) {
        var p = m[1].replace(/\\'/g, "'"), a = parseInt(m[2], 10), c = parseInt(m[3], 10), k = m[4].split("|");
        var enc = function (n) {
            return (n < a ? "" : enc(Math.floor(n / a))) + ((n = n % a) > 35 ? String.fromCharCode(n + 29) : n.toString(36));
        };
        var dict = {};
        while (c--) dict[enc(c)] = k[c] || enc(c);
        out += "\n" + p.replace(/\b\w+\b/g, function (w) { return dict[w] !== undefined ? dict[w] : w; });
    }
    return out;
}

// Indirizzi del player scritti in base64, o ricostruiti invertendo i pezzi
// data-* come fa lo script della pagina (jav.guru). Non è un anti-bot.
function hiddenPlayerUrls(html) {
    var out = [];
    var add = function (u) {
        if (u && /^https?:\/\//i.test(u) && out.indexOf(u) === -1) out.push(u);
    };
    var re = /["']iframe_url["']\s*:\s*["']([A-Za-z0-9+/=]{16,})["']/g;
    var m;
    while ((m = re.exec(html)) !== null && out.length < 6) add(base64Decode(m[1]));
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

function base64Decode(input) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = String(input).replace(/[^A-Za-z0-9+\/]/g, "");
    var out = "";
    for (var i = 0; i < str.length; i += 4) {
        var a = chars.indexOf(str.charAt(i)), b = chars.indexOf(str.charAt(i + 1));
        // charAt oltre la fine dà "" e indexOf("") è 0: senza questo controllo
        // in fondo comparivano caratteri nulli (indirizzi dei server rotti).
        var c = i + 2 < str.length ? chars.indexOf(str.charAt(i + 2)) : -1;
        var d = i + 3 < str.length ? chars.indexOf(str.charAt(i + 3)) : -1;
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

    // Intestazioni delle copertine. Mangayomi le chiede una volta, con il
    // baseUrl della sorgente, e le riusa per ogni immagine (headers.dart):
    // non esiste un Referer diverso per ogni sito. Lo User-Agent serve perché
    // senza, alcuni siti rispondono con HTML e la miniatura resta grigia.
    getHeaders(url) {
        return { "User-Agent": UA };
    }

    headers(referer) {
        var h = { "Accept-Language": "it-IT,it;q=0.9,en;q=0.8" };
        if (referer) h["Referer"] = referer;
        return h;
    }

    assertReachable(res, body, url) {
        // Pagina di verifica anti-bot: la fa la persona nella WebView, poi i
        // cookie della WebView valgono anche per l'estensione.
        if (res.statusCode === 403 || res.statusCode === 503 || res.statusCode === 429 ||
            (body.length < 4000 && /<title>\s*(loading|just a moment|attention required|checking|verifica|ddos)/i.test(body)) ||
            /cf-chl-|challenge-platform\/h\/|captcha-delivery|g-recaptcha|hcaptcha\.com/i.test(body.slice(0, 20000)) && body.length < 30000) {
            throw new Error("Il sito " + hostOf(url) + " chiede una verifica (anti-bot). Tocca Webview, scegli il sito dall'elenco, supera la verifica e poi tocca Riprova.");
        }
        if (res.statusCode >= 400) throw new Error("Il sito ha risposto con errore " + res.statusCode);
    }

    diagnose(html, what) {
        var fam = siteFamily(html);
        var engine = fam === "kvs" ? "motore KVS (video_url / get_file)" :
            fam === "wordpress" ? "motore WordPress" :
            fam === "xv" ? "motore tipo xVideos/xnxx" :
            fam === "json" ? "motore a JSON nella pagina" :
            "pagina HTML generica";
        var why = what === "nessun video" ?
            "Nessun file mp4/HLS in pagina (" + engine + "). Se parte nel browser, tocca Webview." :
            "Nessuna scheda (" + engine + "). " + (ageWallText(html) ? "Sembra una verifica dell'età: tocca Webview." : "Non ho trovato titoli con una miniatura.");
        if (this.debugOn()) why += " Diagnostica: " + fam + ".";
        return why;
    }

    ageWallMessage(url, html) {
        var host = hostOf(url);
        if (hardAgeCheck(html)) {
            return "Il sito " + host + " chiede una verifica dell'età vera (account, e-mail o documento), non il pulsante «ho 18 anni». L'estensione non la aggira. Tocca Webview se vuoi farla lì, poi tocca Riprova.";
        }
        return "Il sito " + host + " mostra la conferma dell'età al posto dell'elenco. Tocca Webview, conferma «ho 18 anni» e poi tocca Riprova.";
    }

    // Poche schede vere e il testo della verifica: non è un elenco.
    pageIsAgeWall(html, url) {
        if (this.looksLikeVideoPage(url, html)) return false;
        if (!ageWallText(html)) return false;
        var cards = [];
        try { cards = this.cardsOf(html, url); } catch (e) {}
        var good = cards.filter(function (c) { return !ageJunkTitle(c.name); });
        return good.length < 4;
    }

    async openAgeGate(url, html, referer) {
        if (hardAgeCheck(html)) return "";
        var cookie = simpleAgeCookie(html);
        if (cookie) {
            var h = this.headers(referer || (originOf(url) + "/"));
            h["Cookie"] = cookie;
            var res = await this.client.get(url, h);
            var body = String(res.body || "");
            this.assertReachable(res, body, url);
            if (!this.pageIsAgeWall(body, url)) return body;
        }
        var via = await this.submitAgeForm(url, html, referer);
        if (via && !this.pageIsAgeWall(via, url)) return via;
        return "";
    }

    // Modulo dello stesso sito con il pulsante «ho 18 anni», senza login né captcha.
    async submitAgeForm(url, html, referer) {
        var forms = html.match(/<form\b[\s\S]*?<\/form>/gi) || [];
        for (var i = 0; i < forms.length; i++) {
            var f = forms[i];
            var text = f.replace(/<[^>]+>/g, " ");
            if (!/\b(18|enter|agree|confirm|continua|entra|maggiorenn)\b/i.test(text)) continue;
            if (/password|e-?mail|captcha|yoti|veriff|credit|username/i.test(f)) continue;
            var action = (f.match(/action\s*=\s*["']([^"']*)["']/i) || ["", ""])[1];
            var target = resolveUrl(action || url, url) || url;
            if (!target || siteOf(target) !== siteOf(url)) continue;
            var method = ((f.match(/method\s*=\s*["']?(\w+)/i) || ["", "get"])[1] || "get").toLowerCase();
            var h = this.headers(referer || (originOf(url) + "/"));
            try {
                var res;
                if (method === "post") {
                    var bits = [];
                    var ins = f.match(/<input\b[^>]*>/gi) || [];
                    for (var k = 0; k < ins.length; k++) {
                        var n = (ins[k].match(/name\s*=\s*["']([^"']+)["']/i) || ["", ""])[1];
                        if (!n) continue;
                        var v = (ins[k].match(/value\s*=\s*["']([^"']*)["']/i) || ["", ""])[1];
                        bits.push(encodeURIComponent(n) + "=" + encodeURIComponent(v));
                    }
                    h["Content-Type"] = "application/x-www-form-urlencoded";
                    res = await this.client.post(target, h, bits.join("&"));
                } else {
                    res = await this.client.get(target, h);
                }
                var body = String(res && res.body || "");
                if (res && res.statusCode < 400 && body && !this.pageIsAgeWall(body, target)) return body;
            } catch (e) {}
        }
        return "";
    }

    // Una connessione che salta (rete del telefono, server lento) si riprova una
    // volta; poi un messaggio chiaro invece dell'errore tecnico dell'app.
    async getWithRetry(url, headers) {
        var started = Date.now();
        this._waiting = { url: url, at: started };
        try {
            var res = await this.client.get(url, headers);
            this.noteResponse(url, res, started);
            return res;
        } catch (e) {
            await new Promise(function (resolve) {
                if (typeof setTimeout === "function") setTimeout(resolve, 700); else resolve();
            });
            try {
                var again = await this.client.get(url, headers);
                this.noteResponse(url, again, started);
                return again;
            } catch (e2) {
                throw new Error("Il sito " + hostOf(url) + " non risponde (problema di connessione). Controlla la rete e tocca Riprova.");
            }
        }
    }

    async fetchHtml(url, referer) {
        var res = await this.getWithRetry(url, this.headers(referer));
        var body = String(res.body || "");
        this.assertReachable(res, body, url);
        if (isGatePage(body) && !this.looksLikeVideoPage(url, body)) {
            throw new Error("Il sito " + hostOf(url) + " chiede ancora una verifica. Tocca Webview, completala e poi tocca Riprova. Non è una lista vuota.");
        }
        if (!this.pageIsAgeWall(body, url)) return body;
        var opened = await this.openAgeGate(url, body, referer);
        if (opened) return opened;
        throw new Error(this.ageWallMessage(url, body));
    }

    // Pagina del video: la scheda e il player la chiedono tutti e due a pochi
    // secondi di distanza. Si tiene in memoria 3 minuti (l'istanza dell'estensione
    // resta viva tra scheda e player), così si scarica una volta sola.
    async fetchPage(url) {
        this._pages = this._pages || {};
        var key = String(url).split("#")[0];
        var hit = this._pages[key];
        if (hit && Date.now() - hit.at < 180000) return hit.html;
        var html;
        try {
            html = await this.fetchHtml(key, originOf(key) + "/");
        } catch (e) {
            // Alcuni siti scrivono nei risultati il link senza «/» finale, che
            // dà 404 mentre con la barra c'è la pagina (megatube.xxx).
            if (!/errore 404/.test(String(e && e.message)) || !/\/[^\/?.]+$/.test(key)) throw e;
            html = await this.fetchHtml(key + "/", originOf(key) + "/");
        }
        this._pages[key] = { at: Date.now(), html: html };
        var keys = Object.keys(this._pages);
        if (keys.length > 30) delete this._pages[keys[0]];
        return html;
    }

    // Il video si cerca già mentre guardi la scheda: quando tocchi Guarda è pronto.
    startPrefetch(link) {
        this._prefetch = this._prefetch || {};
        var key = String(link).split("#")[0];
        if (this._prefetch[key] && Date.now() - this._prefetch[key].at < 240000) return;
        var job = this.resolveVideos(key).catch(function () { return null; });
        this._prefetch[key] = { at: Date.now(), job: job };
        var keys = Object.keys(this._prefetch);
        if (keys.length > 10) delete this._prefetch[keys[0]];
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
                link: BRIDGE + "/",
            }];
        }
        return { list: list, hasNextPage: false };
    }

    // ---------- Siti salvati nelle impostazioni ----------

    // Siti salvati: «Salva un sito» li aggiunge, «Togli siti» li toglie.
    // Mangayomi tiene fissa una lista di scelte una volta creata: per questo le
    // due liste hanno una chiave nuova ogni volta che l'elenco cambia.
    savedSites() {
        return this.readJson(STORE_SAVED, []);
    }

    listKey(prefix, sites) {
        var h = 0, str = sites.join("|");
        for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
        return prefix + (h >>> 0).toString(36);
    }

    setting(key) {
        try {
            return this.prefs.get(key);
        } catch (e) {
            return null;
        }
    }

    // Le schermate chiedono l'elenco dei siti più volte nella stessa azione;
    // ogni volta erano 6–8 letture delle impostazioni dall'app. Vale 1,5 s.
    sites() {
        var memo = this._sitesMemo;
        if (memo && Date.now() - memo.at < 1500) return memo.list.slice();
        var list = this.computeSites();
        this._sitesMemo = { at: Date.now(), list: list };
        return list.slice();
    }

    debugOn() {
        var memo = this._debugMemo;
        if (memo && Date.now() - memo.at < 3000) return memo.on;
        var on = this.setting(PREF_DEBUG) === true;
        this._debugMemo = { at: Date.now(), on: on };
        return on;
    }

    computeSites() {
        this.applyRename();
        var saved = this.savedSites();
        // Stesso flusso della 1.1.0–1.4.8: il testo confermato in «Salva un sito»
        // entra nell'elenco quando la sorgente legge i siti (filtro Sito, Popolari).
        // get() sta qui, non in getSourcePreferences: lì richiamerebbe se stesso.
        var added = String(this.setting(PREF_ADD) || "").trim();
        if (!added) added = String(this.setting("linkuni_add_site_v2") || "").trim();
        if (added && added !== this.prefs.getString(STORE_LAST_ADDED, "")) {
            added.split(/[\s,;]+/).forEach(function (x) {
                x = x.trim().replace(/\/+$/, "");
                if (!x) return;
                if (!/^https?:\/\//i.test(x)) x = "https://" + x;
                x = originOf(x) || x;
                if (saved.indexOf(x) === -1) saved.push(x);
            });
            this.prefs.setString(STORE_LAST_ADDED, added);
            this.prefs.setString(STORE_SAVED, JSON.stringify(saved));
        }
        if (saved.length) {
            var remove = this.setting(this.listKey("linkuni_remove_", saved));
            if (remove && remove.length) {
                saved = saved.filter(function (x) { return remove.indexOf(x) === -1; });
                this.prefs.setString(STORE_SAVED, JSON.stringify(saved));
                if (remove.indexOf(originOf(this.prefs.getString(STORE_LAST_ADDED, "")) || "-") !== -1) {
                    this.prefs.setString(STORE_LAST_ADDED, "");
                }
            }
        }
        var urls = READY.map(function (r) { return r[0]; });
        var on = this.setting(this.listKey("linkuni_ready_", urls));
        if (on && typeof on.length === "number") {
            this.prefs.setString(STORE_READY_OFF, JSON.stringify(urls.filter(function (u) { return on.indexOf(u) === -1; })));
        }
        var active = saved;
        if (saved.length) {
            var savedOn = this.setting(this.listKey("linkuni_saved_on_", saved));
            if (savedOn && typeof savedOn.length === "number") {
                this.prefs.setString(STORE_SAVED_OFF, JSON.stringify(saved.filter(function (u) { return savedOn.indexOf(u) === -1; })));
            }
            var savedOff = this.readJson(STORE_SAVED_OFF, []);
            active = saved.filter(function (u) { return savedOff.indexOf(u) === -1; });
        }
        var all = this.allSites(active);
        var mainChoice = this.setting(this.listKey("linkuni_main_", all));
        if (mainChoice && all.indexOf(mainChoice) !== -1) this.prefs.setString(STORE_MAIN, mainChoice);
        var chosen = this.prefs.getString(STORE_MAIN, "");
        if (all.indexOf(chosen) > 0) all = [chosen].concat(all.filter(function (x) { return x !== chosen; }));
        return all;
    }

    // I tuoi siti, poi quelli già provati che non hai spento.
    allSites(saved) {
        var off = this.readJson(STORE_READY_OFF, []);
        var all = saved.slice();
        READY.forEach(function (r) {
            if (off.indexOf(r[0]) === -1 && all.indexOf(r[0]) === -1) all.push(r[0]);
        });
        return all;
    }

    siteName(url) {
        var names = this.readJson(STORE_NAMES, {});
        if (names[url]) return names[url];
        for (var i = 0; i < READY.length; i++) if (READY[i][0] === url) return READY[i][1];
        return hostOf(url).replace(/^www\./, "");
    }

    applyRename() {
        // get() mentre siamo dentro getSourcePreferences richiama getSourcePreferences:
        // ciclo infinito e l'app si chiude. Le preferenze si leggono solo da fuori.
        if (this._readingPrefs) return;
        this._readingPrefs = true;
        try { this._applyRename(); }
        finally { this._readingPrefs = false; }
    }

    _applyRename() {
        var ren = String(this.setting(PREF_RENAME) || "").trim();
        if (!ren || ren === this.prefs.getString(STORE_LAST_RENAME, "")) return;
        var parts = ren.split("|");
        if (parts.length >= 2) {
            var raw = parts[0].trim();
            if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;
            var u = originOf(raw);
            var name = parts.slice(1).join("|").trim().slice(0, 40);
            if (u && name) {
                var names = this.readJson(STORE_NAMES, {});
                names[u] = name;
                this.prefs.setString(STORE_NAMES, JSON.stringify(names));
            }
        }
        this.prefs.setString(STORE_LAST_RENAME, ren);
    }

    siteFromFilters(filters) {
        var sites = this.sites();
        var normal = sites.filter(function (x) { return !isJavSite(x); });
        var jav = sites.filter(function (x) { return isJavSite(x); });
        var idx = 0, javIdx = 0, sawNormal = false;
        (filters || []).forEach(function (f) {
            if (!f || f.type_name !== "SelectFilter") return;
            if (f.name === "Sito") { idx = f.state || 0; sawNormal = true; }
            if (f.name === "Sito JAV") javIdx = f.state || 0;
        });
        // «Sito JAV» scelto (non «—») vince; poi «Sito» se l'hai cambiato;
        // se non hai toccato niente, il sito principale (anche se è JAV).
        if (javIdx > 0 && jav[javIdx - 1]) return jav[javIdx - 1];
        if (sawNormal && idx > 0 && normal[idx - 1]) return normal[idx - 1];
        return sites[0] || "";
    }

    orderKind(filters) {
        var names = ["", "latest", "views", "rated", "longest"];
        var idx = 0;
        (filters || []).forEach(function (f) {
            if (f && f.type_name === "SelectFilter" && f.name === "Ordine") idx = f.state || 0;
        });
        return names[idx] || "";
    }

    kindWords(kind) {
        if (kind === "views") return ["più visti", "most viewed", "most watched", "più visualizzati"];
        if (kind === "rated") return ["top rated", "più votati", "highest rated", "best rated", "meglio votati"];
        if (kind === "longest") return ["più lunghi", "longest", "long videos", "longest videos"];
        if (kind === "latest") {
            return ["più nuovi", "più recenti", "newest", "new videos", "latest", "most recent", "recenti", "ultimi episodi",
                "ultime uscite", "nuovi", "new", "recent", "ultimi"];
        }
        return ["più visti", "most viewed", "più visualizzati", "video migliori", "best videos", "best", "migliori",
            "top rated", "più votati", "most popular", "popolari", "popular", "di tendenza", "trending", "hottest", "più bollenti", "top"];
    }

    kindTries(kind) {
        if (kind === "views") return ["/most-viewed", "/most-watched", "/views"];
        if (kind === "rated") return ["/top-rated", "/best-rated", "/rated"];
        if (kind === "longest") return ["/longest", "/long-videos"];
        if (kind === "latest") return ["/new", "/newest", "/latest", "/latest-updates", "/recent", "/videos", "/hits"];
        return ["/best", "/most-viewed", "/most-popular", "/popular", "/trending", "/top-rated", "/videos"];
    }

    // Cache per origine. Il formato vecchio era un array: si rilegge, ma si
    // tengono solo URL che sono ancora categorie di QUESTO sito.
    catsOf(entry, site) {
        var list = [];
        if (entry && entry.cats && entry.cats.length) list = entry.cats;
        else if (entry && entry.length && entry[0] && entry[0].url) list = entry;
        var out = [], seen = {};
        for (var i = 0; i < list.length; i++) {
            var c = list[i];
            if (!c || !c.url || !c.name) continue;
            if (siteOf(c.url) !== siteOf(site)) continue;
            var path = String(c.url).replace(/^https?:\/\/[^\/?#]+/i, "");
            if (!isCategoryPath(path)) continue;
            var url = normCatUrl(c.url);
            var nk = String(c.name).toLowerCase();
            if (!url || seen[url] || seen[nk]) continue;
            seen[url] = true;
            seen[nk] = true;
            out.push({ name: String(c.name).slice(0, 32), url: url });
            if (out.length >= 40) break;
        }
        return out;
    }

    // Aggiorna la cache solo con categorie vere trovate nella pagina già
    // scaricata. Una home che è un elenco e non ha categorie cancella la
    // cache di quel sito: non si lasciano quelle di prima, né di un altro sito.
    noteCategories(site, html, pageUrl) {
        var key = originOf(site);
        if (!key) return;
        var found = collectCategories(html, key);
        var cache = this.readJson(PREF_NAV, {});
        if (found.length) {
            cache[key] = { site: key, at: Date.now(), cats: found };
            this.prefs.setString(PREF_NAV, JSON.stringify(cache));
            return;
        }
        var path = String(pageUrl || "").replace(/^https?:\/\/[^\/?#]+/i, "").split("?")[0];
        var home = !path || path === "/";
        var prev = this.catsOf(cache[key], key);
        var catalog = /thumbURL|pageURL|wp-content\/uploads|<img\b[^>]+src=/i.test(String(html).slice(0, 100000));
        if (home && catalog && prev.length) {
            cache[key] = { site: key, at: Date.now(), cats: [] };
            this.prefs.setString(PREF_NAV, JSON.stringify(cache));
        }
    }

    // Categoria scelta nel filtro: le sue parole, o null.
    categoryChoice(filters) {
        var words = null;
        (filters || []).forEach(function (f) {
            if (!f || f.type_name !== "SelectFilter" || f.name !== "Categoria") return;
            var opt = (f.values || [])[f.state || 0];
            var i = opt && opt.value !== "" ? parseInt(opt.value, 10) : NaN;
            if (!isNaN(i) && CATEGORIES[i]) words = CATEGORIES[i][1];
        });
        return words;
    }

    // La pagina di una categoria sul sito: dalle categorie già viste (o dalla
    // home e da /categories), oppure un link della home che finisce con la
    // parola (/big-tits/, /c/big-tits-12/). Niente: stringa vuota.
    async categoryUrlFor(site, words) {
        // Risultato ricordato 3 giorni, anche «nessuna pagina»: prima ogni
        // ricerca di categoria riscaricava home e /categories.
        var origin0 = originOf(site) || site;
        var store = this.readJson(STORE_CAT_URLS, {});
        var ck = origin0 + "|" + words[0];
        if (store[ck] && Date.now() - store[ck].at < 3 * 86400000) return store[ck].url;
        var found = await this.findCategoryUrl(site, words);
        store[ck] = { at: Date.now(), url: found };
        var keys = Object.keys(store);
        if (keys.length > 200) delete store[keys[0]];
        this.prefs.setString(STORE_CAT_URLS, JSON.stringify(store));
        return found;
    }

    async findCategoryUrl(site, words) {
        var origin = originOf(site) || site;
        var slugs = words.map(function (w) { return w.toLowerCase().replace(/[^a-z0-9]+/g, "-"); });
        var match = function (name, url) {
            var n = String(name).toLowerCase(), last = String(url).split("?")[0].replace(/\/+$/, "").split("/").pop().toLowerCase();
            for (var i = 0; i < words.length; i++) {
                if (n === words[i] || n === words[i] + "s" || last === slugs[i] || last === slugs[i] + "s" || new RegExp("^" + slugs[i] + "s?-\\d+$").test(last)) return true;
            }
            return false;
        };
        var cats = this.catsOf(this.readJson(PREF_NAV, {})[origin], origin);
        for (var i = 0; i < cats.length; i++) if (match(cats[i].name, cats[i].url)) return cats[i].url;
        var pages = [origin + "/", origin + "/categories/"];
        for (var p = 0; p < pages.length; p++) {
            var html = "";
            try { html = await this.fetchHtml(pages[p], origin + "/"); } catch (e) { continue; }
            try { this.noteCategories(origin, html, pages[p]); } catch (e) {}
            cats = this.catsOf(this.readJson(PREF_NAV, {})[origin], origin);
            for (var j = 0; j < cats.length; j++) if (match(cats[j].name, cats[j].url)) return cats[j].url;
            var re = /\bhref\s*=\s*["']([^"'#]+)["']/gi, m;
            while ((m = re.exec(html)) !== null) {
                var u = resolveUrl(m[1], pages[p]);
                if (!u || siteOf(u) !== siteOf(origin) || u.indexOf("?") !== -1) continue;
                var path = u.replace(/^https?:\/\/[^\/]+/, "");
                if (path.split("/").filter(Boolean).length > 2 || /\/(search|tags?|pornstars?|models?)\//i.test(path)) continue;
                if (match("", u)) return u;
            }
        }
        return "";
    }

    categoryPick(filters, site) {
        var picked = "";
        (filters || []).forEach(function (f) {
            if (!f || f.type_name !== "SelectFilter" || f.name !== "Categoria") return;
            var idx = f.state || 0;
            if (!idx) return;
            var opt = (f.values || [])[idx];
            if (opt && opt.value) picked = String(opt.value);
        });
        if (!picked || siteOf(picked) !== siteOf(site)) return "";
        if (!isCategoryPath(picked.replace(/^https?:\/\/[^\/?#]+/i, ""))) return "";
        return picked;
    }

    categoryMatch(site, text) {
        var cats = this.catsOf(this.readJson(PREF_NAV, {})[originOf(site)], site);
        var want = String(text || "").trim().toLowerCase();
        for (var i = 0; i < cats.length; i++) {
            if (String(cats[i].name).toLowerCase() === want) return cats[i].url;
        }
        return "";
    }

    sortLink(html, pageUrl, kind) {
        var words = this.kindWords(kind);
        var re = /<a\b([^>]*)>([\s\S]{0,200}?)<\/a>/gi, m;
        while ((m = re.exec(html)) !== null) {
            var label = decodeEntities(m[2].replace(/<[^>]+>/g, " ")).toLowerCase();
            if (!label || label.length > 30) continue;
            var ok = false;
            for (var w = 0; w < words.length; w++) {
                if (label === words[w] || label.indexOf(words[w] + " ") === 0) { ok = true; break; }
            }
            if (!ok) continue;
            var h = (m[1].match(/\bhref\s*=\s*["']([^"'#][^"']*)["']/i) || ["", ""])[1];
            if (!h) continue;
            var link = resolveUrl(h, pageUrl);
            if (!link || siteOf(link) !== siteOf(pageUrl)) continue;
            if (link.split("#")[0].replace(/\/+$/, "") === String(pageUrl).split("#")[0].replace(/\/+$/, "")) continue;
            return link;
        }
        return "";
    }

    orderByPreferredQuality(videos) {
        var wanted = String(this.setting(PREF_QUALITY) || "max");
        if (!videos.length || wanted === "max") return videos;
        var target = parseInt(wanted, 10);
        if (!target) return videos;
        var qOf = function (v) {
            var m = String(v.quality).match(/(\d{3,4})\s*p/i);
            return m ? parseInt(m[1], 10) : 0;
        };
        var best = -1, bestQ = -1;
        for (var i = 0; i < videos.length; i++) {
            var q = qOf(videos[i]);
            if (q && q <= target && q > bestQ) { bestQ = q; best = i; }
        }
        if (best < 0) {
            var above = 100000;
            for (var j = 0; j < videos.length; j++) {
                var q2 = qOf(videos[j]);
                if (q2 && q2 < above) { above = q2; best = j; }
            }
        }
        if (best > 0) videos.unshift(videos.splice(best, 1)[0]);
        return videos;
    }

    // Link della home con testo tipo «Più visti» / «Newest»: le liste del sito.
    async sectionUrl(site, kind) {
        var key = PREF_SECTIONS;
        var cache = this.readJson(key, {});
        var id = site + "#" + kind;
        if (cache[id] !== undefined) return cache[id] || site + "/";
        var html = await this.fetchHtml(site + "/", site + "/");
        // In ordine di preferenza: «Più visti» batte «Di tendenza», ecc.
        var words = this.kindWords(kind);
        this.noteCategories(site, html, site + "/");
        var found = "", best = words.length;
        var re = /<a\b([^>]*)>([\s\S]{0,300}?)<\/a>/gi, m;
        while ((m = re.exec(html)) !== null) {
            var label = decodeEntities(m[2].replace(/<[^>]+>/g, " ")).toLowerCase();
            if (!label || label.length > 30) continue;
            var rank = -1;
            for (var w = 0; w < words.length && w < best; w++) {
                if (label === words[w] || label.indexOf(words[w] + " ") === 0 || label.indexOf("video " + words[w]) === 0) { rank = w; break; }
            }
            if (rank === -1) continue;
            var h = m[1].match(/\bhref\s*=\s*["']([^"'#][^"']*)["']/i);
            if (!h) continue;
            var link = resolveUrl(h[1], site + "/");
            if (!link || siteOf(link) !== siteOf(site) || link.replace(/\/+$/, "") === site) continue;
            var path = link.replace(/^https?:\/\/[^\/]+/, "");
            if (SIDE_PATH.test(path) || /\/(creators?|community|forum|blog|gifs?|contest_hub)(\/|\?|$)/i.test(path)) continue;
            if (!isContentPath(path)) continue;
            found = link;
            best = rank;
        }
        cache[id] = found;
        this.prefs.setString(key, JSON.stringify(cache));
        return found || site + "/";
    }

    // Ultima risposta ricevuta: serve a spiegare un caricamento che non finisce.
    noteResponse(url, res, started) {
        var body = String(res.body || "");
        this._waiting = null;
        this._last = {
            url: url,
            text: res.statusCode + ", " + Math.round(body.length / 1024) + "KB, " + Math.round((Date.now() - started) / 1000) + "s, «" +
                ((body.match(/<title[^>]*>([^<]{0,50})/i) || ["", body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 50)])[1]).trim() + "»",
        };
    }

    // Elenco o ricerca che non finiscono: dopo 35 secondi un errore che dice
    // dove si è fermato, invece della pagina che carica per sempre.
    async timed(job, ms) {
        ms = ms || 35000;
        var self = this;
        this._waiting = null;
        this._last = null;
        if (typeof setTimeout !== "function") return job;
        var late = {};
        var timer = new Promise(function (resolve) { setTimeout(function () { resolve(late); }, ms); });
        var done = await Promise.race([job, timer]);
        if (done !== late) return done;
        var parts = [];
        if (self._waiting) parts.push("in attesa da " + Math.round((Date.now() - self._waiting.at) / 1000) + "s di " + String(self._waiting.url).replace(/^https?:\/\//, "").slice(0, 60));
        if (self._last) parts.push("ultima risposta " + String(self._last.url).replace(/^https?:\/\//, "").slice(0, 50) + ": " + self._last.text);
        throw new Error("Il sito non ha finito di caricare in " + Math.round(ms / 1000) + " secondi (" + (parts.join("; ") || "nessuna risposta") + "). Tocca Riprova o mandami questo messaggio.");
    }

    async getPopular(page) {
        return tagList(await this.timed(this.sectionListing("popular", page)), this.sites()[0] || "");
    }

    async getLatestUpdates(page) {
        return tagList(await this.timed(this.sectionListing("latest", page)), this.sites()[0] || "");
    }

    async sectionListing(kind, page) {
        var sites = this.sites();
        if (!sites.length) return this.historyPage("");
        if (this.setting(PREF_RANDOM) !== true) return this.siteSection(sites[0], kind, page);

        // Sito a sorpresa: a ogni apertura (pagina 1) un sito a caso tra quelli
        // attivi; le pagine dopo restano sullo stesso sito.
        var key = STORE_RANDOM + kind;
        if (page > 1) return this.siteSection(this.prefs.getString(key, "") || sites[0], kind, page);
        var last = this.prefs.getString(key, "");
        var pool = sites.filter(function (x) { return x !== last; });
        if (!pool.length) pool = sites.slice();
        var error = null;
        for (var t = 0; t < 3 && pool.length; t++) {
            var pick = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
            try {
                var res = await this.siteSection(pick, kind, 1);
                if (res.list.length) {
                    this.prefs.setString(key, pick);
                    return res;
                }
            } catch (e) {
                error = e;
            }
        }
        if (error) throw error;
        return this.siteSection(sites[0], kind, 1);
    }

    async siteSection(site, kind, page) {
        var url = await this.sectionUrl(site, kind);
        var res = await this.listing(url, page, false);
        if (res.list.length || page > 1) return res;
        // Home senza schede (costruita da JavaScript): provo le pagine più comuni.
        var tries = this.kindTries(kind);
        var cache = this.readJson(PREF_SECTIONS, {});
        var self = this;
        // Tutte insieme, vince la prima dell'elenco che ha almeno 4 schede.
        var got = await Promise.all(tries.map(function (t) {
            return self.listing(site + t, 1, false).catch(function () { return null; });
        }));
        for (var i = 0; i < tries.length; i++) {
            var r = got[i];
            if (r && r.list.length >= 4) {
                cache[site + "#" + kind] = site + tries[i];
                this.prefs.setString(PREF_SECTIONS, JSON.stringify(cache));
                return r;
            }
        }
        return kind === "latest" ? this.siteSection(site, "popular", page) : res;
    }

    // ---------- Ricerca: link incollato, ricerca nel sito o nella cronologia ----------

    async search(query, page, filters) {
        return tagList(await this.timed(this.searchPlain(query, page, filters), 60000), this.sites()[0] || "");
    }

    async searchPlain(query, page, filters) {
        var text = String(query || "").trim();
        var urlMatch = text.match(/https?:\/\/\S+/i);
        if (!urlMatch && /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(text)) urlMatch = ["https://" + text];
        if (urlMatch) return this.listing(urlMatch[0].replace(/[)\].,;]+$/, ""), page, true);
        if (this.goonPick(filters)) return this.gooning(text, page);

        var site = this.siteFromFilters(filters);
        if (!site) return this.historyPage(text);
        var order = this.orderKind(filters);
        var catPick = this.categoryPick(filters, site);
        var catWords = this.categoryChoice(filters);
        if (catWords && !text) {
            var key = "cat:" + site + "|" + catWords[0];
            var catUrl = page > 1 ? (this.readJson(PREF_NEXT, {})[key] || "") : await this.categoryUrlFor(site, catWords);
            if (page === 1) {
                var np = this.readJson(PREF_NEXT, {});
                np[key] = catUrl;
                this.prefs.setString(PREF_NEXT, JSON.stringify(np));
            }
            if (catUrl) {
                try {
                    var byCat = await this.listing(catUrl, page, false);
                    if (byCat.list.length || page > 1) return byCat;
                } catch (e) {
                    if (/Webview|verifica|anti-bot/i.test(String(e && e.message))) throw e;
                }
            }
            text = catWords[0];
        } else if (catWords && text) {
            text = text + " " + catWords[0];
        }
        if (!text) {
            if (catPick) return this.listing(catPick, page, false);
            if (order) return this.siteSection(site, order, page);
            return this.listing(site + "/", page, false);
        }
        if (!order) {
            var cat = this.categoryMatch(site, text);
            if (cat) {
                // Una categoria rotta (404) non deve far fallire la ricerca.
                try {
                    var catRes = await this.listing(cat, page, false);
                    if (catRes.list.length >= 4) return catRes;
                } catch (e) {
                    if (/Webview|verifica|anti-bot/i.test(String(e && e.message))) throw e;
                }
            }
        }
        var first = await this.searchUrl(site, text);
        if (order && first) {
            try {
                var sortedPage = await this.fetchHtml(first, site + "/");
                var alt = this.sortLink(sortedPage, first, order);
                if (alt) first = alt;
            } catch (e) {
                if (/Webview|verifica|anti-bot/i.test(String(e && e.message))) throw e;
            }
        }
        if (!first) return { list: [], hasNextPage: false };
        var res = await this.listing(first, page, false);
        // Molti siti mettono sopra i risultati i video della home («consigliati»).
        var home = await this.homeLinks(site);
        // …ma solo se ne restano abbastanza: su alcuni siti i risultati sono
        // davvero anche in home (YouPorn), e toglierli lascerebbe solo i canali.
        var kept = res.list.filter(function (c) { return !home[c.link]; });
        var videoLike = function (l) {
            return l.filter(function (c) { return !SIDE_PATH.test(c.link.replace(/^https?:\/\/[^\/]+/, "")); }).length;
        };
        if (videoLike(kept) >= Math.max(6, videoLike(res.list) / 2)) res.list = kept;
        return res;
    }

    goonPick(filters) {
        var on = false;
        (filters || []).forEach(function (f) {
            if (!f || f.type_name !== "SelectFilter" || f.name !== "Raccolta") return;
            var opt = (f.values || [])[f.state || 0];
            if (opt && opt.value === "goon") on = true;
        });
        return on;
    }

    // Una parola per pagina (pmv, goon, hypno, edging, poi di nuovo pmv con la
    // pagina dopo dei siti), cercata su tutti i siti insieme. I risultati si
    // alternano un sito per volta. Con un testo si cerca quello su questi siti.
    async gooning(text, page) {
        var self = this;
        var word = text || GOON_WORDS[(page - 1) % GOON_WORDS.length];
        var sitePage = text ? page : Math.floor((page - 1) / GOON_WORDS.length) + 1;
        var enabled = this.sites();
        var sites = GOON_SITES.filter(function (x) { return enabled.indexOf(x) !== -1; });
        if (!sites.length) sites = GOON_SITES;
        var late = {};
        var perSite = await Promise.all(sites.map(function (site) {
            var job = (async function () {
                var first = sitePage > 1 ?
                    (self.readJson(PREF_NEXT, {})["goon:" + site + "|" + word] || "") :
                    await self.searchUrl(site, word);
                if (!first) return [];
                if (sitePage === 1) {
                    var np = self.readJson(PREF_NEXT, {});
                    np["goon:" + site + "|" + word] = first;
                    self.prefs.setString(PREF_NEXT, JSON.stringify(np));
                }
                var res = await self.listing(first, sitePage, false);
                var home = await self.homeLinks(site);
                var name = self.siteName(site);
                return res.list.filter(function (c) {
                    if (home[c.link] || SIDE_PATH.test(String(c.link).replace(/^https?:\/\/[^\/]+/, ""))) return false;
                    return text ? true : GOON_TITLE.test(c.name);
                }).map(function (c) {
                    c.name = c.name + " · " + name;
                    return c;
                });
            })().catch(function () { return []; });
            var timer = new Promise(function (resolve) {
                if (typeof setTimeout === "function") setTimeout(function () { resolve(late); }, 20000);
            });
            return Promise.race([job, timer]).then(function (r) { return r === late ? [] : r; });
        }));
        var list = [], seen = {};
        for (var i = 0; ; i++) {
            var any = false;
            perSite.forEach(function (l) {
                if (i >= l.length) return;
                any = true;
                if (seen[l[i].link]) return;
                seen[l[i].link] = true;
                list.push(l[i]);
            });
            if (!any) break;
        }
        if (!list.length && page === 1) throw new Error("Nessun sito ha risposto per «" + word + "». Tocca Riprova.");
        return { list: list, hasNextPage: text ? list.length > 0 : true };
    }

    async homeLinks(site) {
        this._home = this._home || {};
        if (!this._home[site]) {
            var set = {};
            try {
                this.cardsOf(await this.fetchHtml(site + "/", site + "/"), site + "/").forEach(function (c) { set[c.link] = true; });
            } catch (e) {}
            this._home[site] = set;
        }
        return this._home[site];
    }

    // Come cerca il sito: il modulo di ricerca della home, altrimenti gli
    // indirizzi più comuni. Quello che funziona resta salvato per il sito.
    async searchUrl(site, text) {
        var cache = this.readJson(PREF_SEARCH, {});
        var q = encodeURIComponent(text);
        var qPlus = q.replace(/%20/g, "+");
        var qDash = text.toLowerCase().replace(/[^a-z0-9\u00c0-\u024f]+/g, "-").replace(/^-|-$/g, "");
        var fill = function (pattern) {
            return pattern.replace("{q}", qPlus).replace("{dash}", qDash).replace("{path}", q);
        };
        if (cache[site]) return fill(cache[site]);

        var patterns = [];
        var home = "";
        var formCount = 0;
        try {
            home = await this.fetchHtml(site + "/", site + "/");
            var forms = home.match(/<form\b[\s\S]*?<\/form>/gi) || [];
            for (var i = 0; i < forms.length; i++) {
                var f = forms[i];
                // action che finisce con «=» (es. /videos/s=): la parola va in fondo.
                var act = f.match(/<form\b[^>]*\baction\s*=\s*["']([^"']*=)["']/i);
                if (act) {
                    patterns.push(resolveUrl(act[1], site + "/") + "{path}");
                    continue;
                }
                if (/method\s*=\s*["']?post/i.test(f)) continue;
                // Modulo con l'indirizzo pronto: data-url=".../search/%QUERY%/"
                var tpl = f.match(/\bdata-url\s*=\s*["']([^"']*%QUERY%[^"']*)["']/i);
                if (tpl) {
                    patterns.push(resolveUrl(tpl[1], site + "/").replace("%QUERY%", "{path}"));
                    continue;
                }
                var input = f.match(/<input\b[^>]*\bname\s*=\s*["'](q|s|k|search|query|keyword|keywords|search_query|term|searchTerm|text|what|search_text|searchQuery)["'][^>]*>/i);
                if (!input) continue;
                var action = (f.match(/<form\b[^>]*\baction\s*=\s*["']([^"']*)["']/i) || ["", ""])[1];
                var target = resolveUrl(action || "/", site + "/") || site + "/";
                if (siteOf(target) !== siteOf(site)) continue;
                var extra = [];
                var hins = f.match(/<input\b[^>]*>/gi) || [];
                for (var hi = 0; hi < hins.length; hi++) {
                    if (!/type\s*=\s*["']?hidden/i.test(hins[hi])) continue;
                    var hn = (hins[hi].match(/\bname\s*=\s*["']([^"']+)["']/i) || ["", ""])[1];
                    var hv = (hins[hi].match(/\bvalue\s*=\s*["']([^"']*)["']/i) || ["", ""])[1];
                    if (!hn || !hv || hn === input[1]) continue;
                    extra.push(encodeURIComponent(hn) + "=" + encodeURIComponent(hv));
                }
                var selects = f.match(/<select\b[\s\S]*?<\/select>/gi) || [];
                for (var si = 0; si < selects.length; si++) {
                    var sn = (selects[si].match(/\bname\s*=\s*["']([^"']+)["']/i) || ["", ""])[1];
                    if (!sn || sn === input[1]) continue;
                    var so = selects[si].match(/<option\b[^>]*\bselected\b[^>]*\bvalue\s*=\s*["']([^"']*)["']/i) ||
                        selects[si].match(/<option\b[^>]*\bvalue\s*=\s*["']([^"']*)["']/i);
                    if (so && so[1]) extra.push(encodeURIComponent(sn) + "=" + encodeURIComponent(so[1]));
                }
                patterns.push(target.split("?")[0] + "?" + input[1] + "={q}" + (extra.length ? "&" + extra.join("&") : ""));
            }
            // Ricerca costruita da JavaScript: '/filter?key=' + encodeURIComponent(q)
            var js = home.match(/["'](\/[\w\/.-]*\?(?:key|q|s|k|search|query|keyword|term)=)["']\s*\+\s*encodeURIComponent/i);
            if (js) patterns.push(site + js[1] + "{q}");
            formCount = patterns.length;
        } catch (e) {
            if (/verifica/.test(String(e && e.message))) throw e;
        }
        patterns = patterns.concat([
            site + "/search/{path}",
            site + "/search?q={q}",
            site + "/?s={q}",
            site + "/search?search={q}",
            site + "/search?keyword={q}",
            site + "/archive?search={q}",
            site + "/?search={q}",
            site + "/video/search?search={q}",
            site + "/?k={q}",
            site + "/search/{dash}/",
            site + "/tag/{dash}/",
        ]);
        // La pagina giusta ha schede che parlano della parola cercata e non è
        // la home ripetuta. Vince la prima molto buona, altrimenti la migliore.
        var homeLinks = {};
        try {
            this.cardsOf(home || "", site + "/").slice(0, 12).forEach(function (c) { homeLinks[c.link] = true; });
        } catch (e) {}
        var word = text.toLowerCase().split(" ")[0];
        var best = null;
        var self = this;
        // Prima i moduli del sito, poi gli indirizzi comuni a gruppi di 4 in
        // parallelo (prima uno alla volta: fino a 15 richieste in fila).
        var tryOne = function (j) {
            var url = fill(patterns[j]);
            return self.client.get(url, self.headers(site + "/")).then(function (res) {
                if (res.statusCode >= 400) return null;
                var found = self.cardsOf(String(res.body || ""), url);
                if (!found.length) return null;
                var same = found.filter(function (c) { return homeLinks[c.link]; }).length;
                if (same >= 6 && same >= found.length / 2) return null;
                var hits = found.filter(function (c) {
                    return (c.name + " " + c.link).toLowerCase().indexOf(word) !== -1;
                }).length;
                return { score: hits / found.length + (j < formCount && found.length >= 3 ? 0.3 : 0), index: j, url: url };
            }).catch(function () { return null; });
        };
        var groups = [];
        if (formCount) groups.push(patterns.slice(0, formCount).map(function (_, i) { return i; }));
        for (var g = formCount; g < patterns.length; g += 4) {
            var grp = [];
            for (var gi = g; gi < Math.min(g + 4, patterns.length); gi++) grp.push(gi);
            groups.push(grp);
        }
        for (var gIdx = 0; gIdx < groups.length; gIdx++) {
            var results = await Promise.all(groups[gIdx].map(tryOne));
            var good = null;
            results.forEach(function (r) {
                if (!r) return;
                if (!best || r.score > best.score) best = r;
                if (r.score >= 0.5 && (!good || r.index < good.index)) good = r;
            });
            if (good) { best = good; break; }
        }
        if (best && best.score >= 0.15) {
            cache[site] = patterns[best.index];
            this.prefs.setString(PREF_SEARCH, JSON.stringify(cache));
            return best.url;
        }
        throw new Error("Non ho trovato come cerca questo sito. Puoi incollare nella ricerca il link della pagina dei risultati.");
    }

    // Pagine che caricano i video dopo, con una seconda richiesta dello script
    // (es. fetch('?ajax=1') su javhd.today): se le schede-video sono poche, la
    // si fa anche qui e si aggiunge il suo HTML. Risposta JSON: campo html/content.
    async withLazyList(html, url) {
        // Schede che sembrano video: un numero o un titolo lungo nel link (le
        // categorie tipo /big-tits/ non contano).
        var videoCards = this.cardsOf(html, url).filter(function (c) {
            var path = c.link.split("#")[0].replace(/^https?:\/\/[^\/]+/, "");
            return !SIDE_PATH.test(path) && /\d{3,}|[a-z0-9]+(?:[-_][a-z0-9]+){3,}/i.test(path);
        });
        if (videoCards.length >= 6) return html;
        var m = html.match(/\b(?:fetch|\$\.get|\$\.ajax|axios\.get)\(\s*\{?\s*(?:url\s*:\s*)?["'`]([^"'`]*(?:ajax|load|list|more|page)[^"'`]*)["'`]/i);
        if (!m) return html;
        var target = m[1].charAt(0) === "?" ? url.split("?")[0] + m[1] : resolveUrl(m[1], url);
        if (!target || siteOf(target) !== siteOf(url) || /[{}$]/.test(target)) return html;
        try {
            var res = await this.client.get(target, { "Referer": url });
            if (res.statusCode >= 400) return html;
            var body = String(res.body || "");
            if (/^\s*[{[]/.test(body)) {
                try {
                    var data = JSON.parse(body);
                    var part = data && (data.html || data.content || data.data || data.items);
                    if (typeof part === "string") body = part;
                } catch (e) {}
            }
            return html + "\n" + body;
        } catch (e) {
            return html;
        }
    }

    async listing(start, page, withSelf) {
        var nextPages = this.readJson(PREF_NEXT, {});
        var url = page > 1 ? nextPages[start + "#" + page] : start;
        if (!url) return { list: [], hasNextPage: false };

        var html = await this.fetchHtml(url, originOf(url) + "/");
        try { this.noteCategories(originOf(url) || url, html, url); } catch (e) {}
        html = await this.withLazyList(html, url);
        var list = [];
        if (withSelf && page === 1 && this.looksLikeVideoPage(url, html)) {
            var self = {
                name: "▶ " + (pageTitle(html) || url),
                imageUrl: coverUrl(metaContent(html, ["og:image", "twitter:image"]), url),
                link: url,
            };
            list.push(self);
            this.remember({ name: self.name.replace(/^▶ /, ""), imageUrl: self.imageUrl, link: url });
        }

        var seen = {};
        seen[url.split("#")[0]] = true;
        seen[url.split("#")[0].replace(/\/+$/, "")] = true;
        seen[url.split("#")[0].replace(/\/?$/, "/")] = true;
        var cards = dropSideCards(this.cardsOf(html, url));
        for (var i = 0; i < cards.length; i++) {
            if (seen[cards[i].link]) continue;
            seen[cards[i].link] = true;
            list.push(cards[i]);
        }

        var next = this.nextPageOf(html, url, page);
        if (next) {
            nextPages[start + "#" + (page + 1)] = next;
            var keys = Object.keys(nextPages);
            if (keys.length > 300) for (var k = 0; k < keys.length - 300; k++) delete nextPages[keys[k]];
            this.prefs.setString(PREF_NEXT, JSON.stringify(nextPages));
        }
        if (!list.length && page === 1 && withSelf) {
            list.push({ name: pageTitle(html) || url, imageUrl: "", link: url });
        }
        if (!list.length && page === 1 && this.debugOn()) {
            throw new Error(this.diagnose(html, "nessuna scheda"));
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

    // Le stesse schede servono più volte per la stessa pagina (lista, schede
    // «video», verifica età): si calcolano una volta. Copie, perché chi le usa
    // poi modifica il link.
    cardsOf(html, pageUrl) {
        this._cardsMemo = this._cardsMemo || [];
        for (var i = 0; i < this._cardsMemo.length; i++) {
            var e = this._cardsMemo[i];
            if (e.url === pageUrl && e.html === html) {
                return e.list.map(function (c) { return { name: c.name, imageUrl: c.imageUrl, link: c.link }; });
            }
        }
        var list = this.computeCards(html, pageUrl);
        this._cardsMemo.unshift({ url: pageUrl, html: html, list: list.map(function (c) { return { name: c.name, imageUrl: c.imageUrl, link: c.link }; }) });
        if (this._cardsMemo.length > 4) this._cardsMemo.pop();
        return list;
    }

    // Schede con immagine che portano ad altre pagine dello stesso sito.
    computeCards(html, pageUrl) {
        var out = [];
        var site = siteOf(pageUrl);
        var re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
        var m;
        // Il titolo spesso sta in un altro link verso la stessa pagina.
        var titles = {};
        var tr = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi, t2;
        while ((t2 = tr.exec(html)) !== null) {
            var hh = t2[1].match(/\bhref\s*=\s*["']([^"']+)["']/i);
            if (!hh) continue;
            var key = resolveUrl(hh[1], pageUrl).split("#")[0];
            var cand = decodeEntities((t2[1].match(/\btitle\s*=\s*["']([^"']+)["']/i) || ["", ""])[1]) ||
                decodeEntities(t2[2].replace(/<[^>]+>/g, " "));
            if (!weakTitle(cand) && cand.length < 200 && (!titles[key] || cand.length > titles[key].length)) titles[key] = cand;
        }
        while ((m = re.exec(html)) !== null) {
            var attrs = m[1], inner = m[2];
            if (!/<img\b/i.test(inner) && !pickImage(m[0]).src) continue;
            var hrefM = attrs.match(/\bhref\s*=\s*["']([^"']+)["']/i);
            if (!hrefM) continue;
            var link = resolveUrl(hrefM[1], pageUrl).split("#")[0];
            if (!link || siteOf(link) !== site || /[{}]/.test(link)) continue;
            var path = link.replace(/^https?:\/\/[^\/]+/, "");
            if (path === "" || path === "/" || /\.(jpe?g|png|gif|webp|svg|css|js)(\?|$)/i.test(path)) continue;
            if (!isContentPath(path)) continue;

            var picked = pickImage(inner);
            if (!picked.src) picked = pickImage(m[0]);
            var img = picked.tag;
            var src = picked.src;
            var title = "";
            var tm = attrs.match(/\btitle\s*=\s*["']([^"']+)["']/i);
            if (tm) title = tm[1];
            if (!title) {
                var alt = attrs.match(/\balt\s*=\s*["']([^"']+)["']/i) || img.match(/\balt\s*=\s*["']([^"']+)["']/i);
                if (alt) title = alt[1];
            }
            title = decodeEntities(title);
            if (weakTitle(title)) title = titles[link] || decodeEntities(inner.replace(/<[^>]+>/g, " "));
            if (!title || title.length < 2) continue;
            out.push({ name: title, imageUrl: src ? coverUrl(src, pageUrl) : "", link: link });
        }
        var all = this.mergeCards(this.mergeCards(out, this.containerCardsOf(html, pageUrl)), this.jsonCardsOf(html, pageUrl));
        // Cambio lingua (de.sito.com/stessa-pagina) e link alla pagina stessa.
        var here = hostOf(pageUrl), herePath = pageUrl.replace(/^https?:\/\/[^\/]+/, "").split("#")[0].replace(/\/+$/, "");
        all = all.filter(function (c) {
            var p = c.link.replace(/^https?:\/\/[^\/]+/, "").replace(/\/+$/, "");
            return p !== herePath;
        });
        // Bandierine delle lingue: «chi-CN», «en-US», immagini /flags/.
        all = all.filter(function (c) {
            return !/^[a-z]{2,4}[-_][a-z]{2}$/i.test(String(c.name).trim()) && !/\/flags?\//i.test(c.imageUrl || "");
        });
        all = all.filter(function (c) {
            return !(hostOf(c.link) !== here && /^[a-z]{2}(-[a-z]{2})?\./.test(hostOf(c.link)) && /^(deutsch|english|español|espanol|français|francais|italiano|português|portugues|русский|日本語|中文|nederlands|polski|türkçe|[a-z]{2})$/i.test(c.name.trim()));
        });
        // Lo stesso «titolo» su tante schede è un'etichetta (SHORTS, In process…):
        // al suo posto il titolo di un altro link alla stessa pagina, o le parole del link.
        var count = {};
        all.forEach(function (c) { count[c.name] = (count[c.name] || 0) + 1; });
        all.forEach(function (c) {
            if (count[c.name] < 3) return;
            var other = titles[c.link];
            if (other && other !== c.name && (count[other] || 0) < 3) { c.name = other; return; }
            var parts = c.link.replace(/^https?:\/\/[^\/]+/, "").split("?")[0].split("/").filter(Boolean);
            var slug = parts.filter(function (x) { return /[a-z]{3,}[-_][a-z]/i.test(x); }).pop();
            if (slug) {
                slug = slug.replace(/\.html?$/i, "").replace(/[-_]+/g, " ").trim();
                c.name = slug.charAt(0).toUpperCase() + slug.slice(1);
            } else {
                c._untitled = true;
            }
        });
        // Le schede rimaste senza titolo vanno in fondo.
        var untitled = all.filter(function (c) { return c._untitled; });
        all = orderCards(all.filter(function (c) { return !c._untitled; })).concat(untitled);
        all.forEach(function (c) { delete c._untitled; });
        // «Verify your age» non è un video: se il titolo non si è potuto sostituire, si toglie.
        all = all.filter(function (c) { return !ageJunkTitle(c.name); });
        if (this.debugOn()) {
            var fam = siteFamily(html);
            all.forEach(function (c) { c.name += " · " + fam; });
        }
        return all;
    }

    // Riquadri <div class="video-thumb">: il link del titolo e l'immagine sono fratelli.
    divBlocks(html) {
        var out = [];
        var re = /<div\b[^>]*class=["'][^"']*\b(?:video-thumb|thumb-block|video-item|videobox)\b[^"']*["'][^>]*>/gi;
        var m;
        while ((m = re.exec(html)) !== null && out.length < 80) {
            var i = m.index + m[0].length, depth = 1, start = i;
            while (i < html.length && depth > 0 && i - start < 8000) {
                var open = html.indexOf("<div", i);
                var close = html.indexOf("</div", i);
                if (close === -1) break;
                if (open !== -1 && open < close) { depth++; i = open + 4; }
                else { depth--; i = close + 5; }
            }
            if (depth === 0) out.push(html.slice(start, i - 5));
        }
        return out;
    }

    // Schede dove il link copre il riquadro e l'immagine sta accanto
    // (<article>/<li> con <img> e un <a> senza immagine dentro).
    containerCardsOf(html, pageUrl) {
        var out = [];
        var site = siteOf(pageUrl);
        var boxes = [];
        var re = /<(article|li)\b[^>]*>([\s\S]*?)<\/\1>/gi, m;
        while ((m = re.exec(html)) !== null) boxes.push(m[2]);
        this.divBlocks(html).forEach(function (b) { boxes.push(b); });
        for (var bi = 0; bi < boxes.length; bi++) {
            var box = boxes[bi];
            if (box.length > 8000) continue;
            var img = box.match(/<img\b[^>]*>/i);
            if (!img) continue;
            var a = null, ar = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi, x;
            while ((x = ar.exec(box)) !== null) {
                var h = x[1].match(/\bhref\s*=\s*["']([^"'#][^"']*)["']/i);
                if (!h) continue;
                var link = resolveUrl(h[1], pageUrl).split("#")[0];
                var path = link.replace(/^https?:\/\/[^\/]+/, "");
                if (!link || siteOf(link) !== site || path.length < 2 || !isContentPath(path)) continue;
                var cand = { link: link, attrs: x[1], text: decodeEntities(x[2].replace(/<[^>]+>/g, " ")) };
                if (!a) a = cand;
                if (!SIDE_PATH.test(path)) { a = cand; break; }
            }
            if (!a) continue;
            var src = pickImage(box).src;
            var head = box.match(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/i);
            var title = decodeEntities((a.attrs.match(/\btitle\s*=\s*["']([^"']+)/i) || ["", ""])[1]) ||
                (head ? decodeEntities(head[1].replace(/<[^>]+>/g, " ")) : "") ||
                decodeEntities((img[0].match(/\balt\s*=\s*["']([^"']+)/i) || ["", ""])[1]) || a.text;
            title = title.replace(/^(guarda|copertina di|poster di|watch)\s+/i, "");
            if (weakTitle(title)) continue;
            out.push({ name: title, imageUrl: src ? coverUrl(src, pageUrl) : "", link: a.link });
        }
        return out;
    }

    // Siti che costruiscono la lista con JavaScript (es. xHamster): le schede
    // stanno in un JSON nella pagina, con link, titolo e miniatura.
    jsonCardsOf(html, pageUrl) {
        var text = unescapeJs(html);
        var site = siteOf(pageUrl);
        var out = [];
        var re = /"(?:pageURL|pageUrl|page_url|url|link|href|permalink|watchUrl|videoLink)"\s*:\s*"([^"]+)"/g;
        var m;
        while ((m = re.exec(text)) !== null) {
            var link = resolveUrl(m[1], pageUrl).split("#")[0];
            if (!link || siteOf(link) !== site || /[{}]/.test(link)) continue;
            var path = link.replace(/^https?:\/\/[^\/]+/, "");
            if (path.length < 4 || !isContentPath(path) || new RegExp("\\.(" + VIDEO_EXT + "|jpe?g|png|gif|webp|svg|css|js)(\\?|$)", "i").test(path)) continue;
            var obj = objectAround(text, m.index, m.index + m[0].length);
            var t = obj.match(/"(?:title|name|videoTitle)"\s*:\s*"((?:[^"\\]|\\.){2,200})"/);
            var img = obj.match(/"(?:thumbURL|thumbUrl|thumb|thumbnail|thumbnailUrl|thumb_url|imageURL|imageUrl|image|poster|cover|preview_url)"\s*:\s*"(https?:[^"]+|\/[^"]+)"/);
            if (!t || !img) continue;
            var title = decodeEntities(t[1].replace(/\\u([0-9a-fA-F]{4})/g, function (_, h) {
                return String.fromCharCode(parseInt(h, 16));
            }).replace(/\\(.)/g, "$1"));
            out.push({ name: title, imageUrl: coverUrl(img[1], pageUrl), link: link });
        }
        return out;
    }

    mergeCards(a, b) {
        var seen = {};
        var out = [];
        a.concat(b).forEach(function (c) {
            if (seen[c.link]) return;
            seen[c.link] = true;
            out.push(c);
        });
        return out;
    }

    nextPageOf(html, pageUrl, page) {
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
        if (!m) {
            // Numeri di pagina: un link a pagina+1 dello stesso percorso.
            var want = (page || 1) + 1;
            var base = pageUrl.split("?")[0].replace(/\/(page\/)?\d+\/?$/, "").replace(/\/+$/, "");
            var basePath = base.replace(/^https?:\/\/[^\/]+/, "");
            var re2 = /\bhref\s*=\s*["']([^"'#]+)["']/gi, l;
            while ((l = re2.exec(html)) !== null) {
                var u = resolveUrl(l[1], pageUrl);
                if (!u || siteOf(u) !== siteOf(pageUrl)) continue;
                var p = u.replace(/^https?:\/\/[^\/]+/, "");
                var ok = new RegExp("[?&](page|p|pg|paged)=" + want + "(&|$)").test(p) ||
                    new RegExp("\\/(page\\/)?" + want + "\\/?(\\?|$)").test(p);
                if (ok && p.indexOf(basePath) === 0) { m = [null, l[1]]; break; }
            }
        }
        if (!m && new RegExp('"(?:next|nextPage|next_page)"\\s*:\\s*"?' + ((page || 1) + 1) + '\\b').test(html)) {
            var bare = pageUrl.replace(/([?&])page=\d+&?/, "$1").replace(/[?&]$/, "");
            m = [null, bare + (bare.indexOf("?") === -1 ? "?" : "&") + "page=" + ((page || 1) + 1)];
        }
        if (!m) {
            var tpl = html.match(/"pageLinkTemplate"\s*:\s*"((?:\\.|[^"\\])+)"/);
            if (tpl && /\{#\}|\{page\}|%page%/i.test(tpl[1])) {
                m = [null, tpl[1].replace(/\\\//g, "/").replace(/\{#\}|\{page\}|%page%/gi, String((page || 1) + 1))];
            }
        }
        if (!m) return "";
        var next = resolveUrl(m[1], pageUrl);
        return next && next !== pageUrl ? next : "";
    }

    // ---------- Scheda ----------

    async getDetail(url) {
        var link = cleanLink(url);
        var html = await this.fetchPage(link);
        var title = pageTitle(html) || link;
        var image = coverUrl(metaContent(html, ["og:image", "twitter:image", "thumbnailUrl"]), link);
        if (!image) {
            var shot = html.match(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+\/wp-content\/uploads\/[^"']+)["']/i);
            var poster = shot || unescapeJs(html).match(/"thumbnailUrl"\s*:\s*\[?\s*"([^"]+)"/i) ||
                html.match(/<video\b[^>]*\bposter\s*=\s*["']([^"']+)["']/i) ||
                unescapeJs(html).match(/\b(?:poster|preview_url|image)\s*:\s*["']((?:https?:)?\/\/[^"']+\.(?:jpe?g|png|webp)[^"']*)["']/i);
            if (poster) image = coverUrl(poster[1], link);
        }
        var description = metaContent(html, ["og:description", "description", "twitter:description"]);
        var facts = videoFacts(html);
        var notes = [];
        if (facts.duration) notes.push("Durata: " + facts.duration);
        if (facts.date) notes.push("Data: " + facts.date);
        if (this.debugOn()) notes.push("Parser: " + siteFamily(html));
        if (notes.length) description = (description ? description + "\n\n" : "") + notes.join("\n");

        var chapters = this.episodesOf(html, link);
        var pathOnly = link.split("#")[0].replace(/^https?:\/\/[^\/]+/, "");
        var videoish = this.looksLikeVideoPage(link, html) ||
            /\/(video|videos|watch|v|embed|view_video|movie|play)[\/.?_-]|\d{4,}/i.test(pathOnly) ||
            /jwplayer|videojs|video-js|flowplayer|plyr|kt_player|html5player|data-embed=|<iframe\b[^>]*(player|embed)/i.test(html);
        if (!chapters.length && !videoish) {
            // Una categoria, un'attrice, una ricerca: niente video da far partire,
            // ma tanti video dentro. Diventano gli episodi della scheda.
            var inside = this.cardsOf(await this.withLazyList(html, link), link).filter(function (c) {
                return !SIDE_PATH.test(c.link.replace(/^https?:\/\/[^\/]+/, "")) && c.link.split("#")[0] !== link;
            });
            if (inside.length >= 3) {
                chapters = inside.slice(0, 80).map(function (c) { return { name: c.name, url: c.link }; });
                if (!image && inside[0].imageUrl) image = inside[0].imageUrl;
            }
        }
        if (!chapters.length) chapters = [{ name: facts.duration ? "Video · " + facts.duration : "Video", url: link }];

        if (chapters.length === 1 && String(chapters[0].url).split("#")[0] === link.split("#")[0]) {
            try { this.startPrefetch(link); } catch (e) {}
        }
        this.remember({ name: title, imageUrl: image, link: link });
        return {
            name: title,
            imageUrl: image || undefined,
            link: tagLink(link),
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
            var n = m[1].match(/\bdata-(?:episode-num|episode|ep|episode-number|number)\s*=\s*["'](\d+(?:\.\d+)?)["']/i) ||
                label.match(/\b(?:episodio|episode|ep\.?)\s*(\d+(?:[.,]\d+)?)/i) ||
                link.match(/[\/_-](?:episodio|episode|ep)[-_]?(\d+(?:\.\d+)?)(?:[\/?#]|$)/i);
            // Solo il numero («1», «2»…) in un link sotto la pagina della serie.
            if (!n && /^\s*\d{1,4}\s*$/.test(label) && link.indexOf(pageUrl.split("?")[0].replace(/\/+$/, "") + "/") === 0) n = [null, label.trim()];
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
        var pre = this._prefetch && this._prefetch[link.split("#")[0]];
        if (pre && Date.now() - pre.at < 240000) {
            var ready = await Promise.race([
                pre.job,
                new Promise(function (resolve) {
                    if (typeof setTimeout === "function") setTimeout(function () { resolve(null); }, 12000);
                }),
            ]);
            if (ready && ready.length) return ready;
        }
        return this.resolveVideos(link);
    }

    async resolveVideos(url) {
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

        var aw = link.match(/^(https?:\/\/(?:www\.)?animeworld\.[a-z]+)\/play\/[^\/]+\/([^\/?#]+)/i);
        if (aw) {
            try {
                var info = await this.client.get(aw[1] + "/api/episode/info?id=" + aw[2] + "&alt=0", this.headers(link));
                var g = JSON.parse(info.body).grabber;
                var stream = typeof g === "string" ? g : g && (g.src || g.url || "");
                if (stream) return [this.video(stream, "AnimeWorld", 0, link)].map(function (v) { delete v._score; return v; });
            } catch (e) {}
        }

        var html = await this.fetchPage(link);
        videos = videos.concat(await this.videosFromHtml(html, link, 0));

        // Stesso file con parametri diversi (?rnd=…, ?v=…): uno solo, quello
        // con l'etichetta di qualità se c'è.
        videos.sort(function (a, b) { return (b._score || 0) - (a._score || 0); });
        var seen = {};
        videos = videos.filter(function (v) {
            var k = String(v.url).split("?")[0].replace(/\/+$/, "");
            if (seen[k]) return false;
            seen[k] = true;
            return true;
        });
        videos.sort(function (a, b) { return (b._score || 0) - (a._score || 0); });
        videos.forEach(function (v) { delete v._score; });
        videos = this.orderByPreferredQuality(videos);
        if (!videos.length) {
            throw new Error(this.diagnose(html, "nessun video"));
        }
        return videos;
    }

    // Intestazioni per il player. Senza User-Agent il player di Mangayomi si
    // presenta come «libmpv», e molti server video lo rallentano o lo rifiutano.
    playerHeaders(referer) {
        var h = this.headers(referer);
        h["User-Agent"] = UA;
        return h;
    }

    video(url, label, quality, referer) {
        var isHls = /\.m3u8(\?|$)/i.test(url);
        var name = label + (quality ? " " + quality + "p" : isHls ? " Auto" : "") + (isHls ? " (HLS)" : "");
        return {
            url: url,
            originalUrl: url,
            quality: name,
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
        // Player KVS (molti siti tube): video_url / video_alt_url con l'etichetta della qualità.
        // «function/0/» è il prefisso del player KVS: il file vero sta dopo.
        var kvs = /\b(video_url|video_alt_url\d*)\s*:\s*'(?:function\/0\/)?(https?:\/\/[^']+)'/g;
        while ((m = kvs.exec(text)) !== null) {
            if (seen[m[2]]) continue;
            seen[m[2]] = true;
            var lab = text.match(new RegExp(m[1] + "_text\\s*:\\s*'(\\d{3,4})"));
            out.push({ url: m[2], quality: lab ? parseInt(lab[1], 10) : qualityOf(m[2], "") });
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

    // Video senza «.mp4» nel nome: contentUrl del JSON-LD, og:video, e le
    // sorgenti dei player (sources/file/src in JW Player, Video.js, Plyr…).
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
        // Sorgente dichiarata anche fuori dal blocco del player (JSON-LD, KVS, WordPress).
        var loose = /["'](?:file|src|videoUrl|video_url|contentUrl)["']\s*:\s*["']((?:https?:)?\/\/[^"']+)["']/gi, one;
        while ((one = loose.exec(text)) !== null) {
            if (NOT_VIDEO_KEY.test(keyBefore(text, one.index))) continue;
            if (AD_HOSTS.test(one[1])) continue;
            if (!new RegExp("\\.(" + VIDEO_EXT + ")(\\?|$)", "i").test(one[1]) && !/\/(get_file|stream|media|playlist|videoplayback)\b/i.test(one[1])) continue;
            add(one[1]);
        }
        return out;
    }

    // Siti WordPress col tema DooPlay (molti siti hentai e anime): il player
    // non è nella pagina, arriva da admin-ajax.php quando si sceglie il server.
    async ajaxPlayers(html, pageUrl) {
        var ajax = (html.match(/https?:\/\/[^"'\s]+\/wp-admin\/admin-ajax\.php/) || [resolveUrl("/wp-admin/admin-ajax.php", pageUrl)])[0].replace(/\\\//g, "/");
        var h = { "Referer": pageUrl, "X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded" };
        var calls = [];
        var gp = html.match(/action\s*:\s*["']get_player_contents["']\s*,\s*a\s*:\s*["']?(\d+)/);
        if (gp) calls.push({ body: "action=get_player_contents&a=" + gp[1] + "&i=1", kind: "list" });
        var opt = /<li\b[^>]*\bdata-type\s*=\s*["'](\w+)["'][^>]*\bdata-post\s*=\s*["'](\d+)["'][^>]*\bdata-nume\s*=\s*["'](\w+)["']/gi, o;
        while ((o = opt.exec(html)) !== null && calls.length < 4) {
            if (o[3] === "trailer") continue;
            calls.push({ body: "action=doo_player_ajax&post=" + o[2] + "&nume=" + o[3] + "&type=" + o[1], kind: "doo" });
        }
        if (!calls.length) return [];
        var self = this;
        var found = await Promise.all(calls.map(function (c) {
            return self.client.post(ajax, h, c.body).then(function (res) {
                var body = String(res.body || "");
                var out = [];
                var add = function (u) {
                    u = resolveUrl(decodeEntities(String(u || "")).replace(/\\\//g, "/"), pageUrl);
                    if (u && !AD_HOSTS.test(u)) out.push(u);
                };
                if (c.kind === "doo") {
                    try { add(JSON.parse(body).embed_url); } catch (e) {}
                }
                var plain = body.replace(/\\\//g, "/").replace(/\\"/g, '"');
                var re = /<iframe\b[^>]*?\bsrc\s*=\s*["']([^"']+)/gi, m;
                while ((m = re.exec(plain)) !== null) add(m[1]);
                return out;
            }).catch(function () { return []; });
        }));
        return [].concat.apply([], found);
    }

    async videosFromHtml(html, pageUrl, depth) {
        var videos = [];
        html = html + unpackAll(html);
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
            if (f && !AD_HOSTS.test(f) && !/youtube\.com|youtu\.be/i.test(f) && frames.indexOf(f) === -1) frames.push(f);
        }
        // Server del player scritti in base64 negli attributi (data-embed="aHR0cHM6…"):
        // il pulsante del server li decodifica e li mette nell'iframe.
        var b64re = /\bdata-(?:embed|src|link|url|video|server|href|player|iframe)\s*=\s*["']([A-Za-z0-9+\/=_-]{16,})["']/gi, b;
        while ((b = b64re.exec(html)) !== null) {
            var dec = "";
            try { dec = base64Decode(b[1].replace(/-/g, "+").replace(/_/g, "/")); } catch (e) { dec = ""; }
            if (/^https?:\/\/[^\s"'<>]+$/.test(dec) && !AD_HOSTS.test(dec) && frames.indexOf(dec) === -1) frames.unshift(dec);
        }
        // Player dichiarati nei dati della pagina (JSON-LD embedUrl, og:video che è una pagina).
        var decl = unescapeJs(html).match(/"embedUrl"\s*:\s*"([^"]+)"/i);
        var ogv = metaContent(html, ["og:video:secure_url", "og:video:url", "og:video", "twitter:player"]);
        [decl ? decl[1] : "", ogv].forEach(function (u) {
            u = resolveUrl(u, pageUrl);
            if (u && u !== pageUrl && !new RegExp("\\.(" + VIDEO_EXT + ")(\\?|$)", "i").test(u) && !AD_HOSTS.test(u) && frames.indexOf(u) === -1) frames.push(u);
        });
        // Link a player noti scritti negli script (non solo iframe).
        var text = unescapeJs(html);
        var hostRe = /https?:\/\/[^\s"'<>\\]*(?:dood|streamtape|filemoon|streamwish|mp4upload|ok\.ru\/videoembed|sendvid|voe\.sx|sibnet|streamlare)[^\s"'<>\\]*/gi;
        while ((m = hostRe.exec(text)) !== null) {
            if (frames.indexOf(m[0]) === -1) frames.push(m[0]);
        }

        (await this.ajaxPlayers(html, pageUrl)).forEach(function (u) {
            if (frames.indexOf(u) === -1) frames.unshift(u);
        });

        // Tutti i player insieme. Appena uno dà un video si aspettano gli altri
        // al massimo 1,2 secondi; in ogni caso non oltre 9 secondi in tutto.
        // Prima si aprivano uno dopo l'altro: ~15 s prima che partisse il player.
        var self = this;
        var list = frames.slice(0, 8);
        if (!list.length) return videos;
        var collected = await new Promise(function (resolve) {
            var results = [], pending = list.length, done = false, graceSet = false;
            var finish = function () {
                if (done) return;
                done = true;
                resolve(results);
            };
            var timer = typeof setTimeout === "function" ? setTimeout : null;
            if (timer) timer(finish, 9000);
            list.forEach(function (f) {
                self.videosFromFrame(f, pageUrl, depth).catch(function () { return []; }).then(function (got) {
                    if (done) return;
                    if (got && got.length) {
                        results = results.concat(got);
                        if (!graceSet && timer) { graceSet = true; timer(finish, 1200); }
                    }
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
        var data = null;
        try {
            var res = await this.client.get(origin + "/api/watch/" + path, this.headers(origin + "/anime/" + path));
            data = JSON.parse(res.body);
        } catch (e) {
            return [];
        }
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
        var self = this;
        var sites = this.sites();
        var filters = [{
            type_name: "HeaderFilter",
            name: sites.length ?
                "Scegli un sito in «Sito» oppure in «Sito JAV» (lascia l'altro su «—»); senza scelta vale il sito principale. Categoria vale per tutti i siti. «Raccolta → Gooning» cerca PMV, goon, hypno ed edging su più siti insieme. Puoi anche incollare un link." :
                "Aggiungi i tuoi siti nelle impostazioni della sorgente. Intanto puoi incollare nella ricerca il link di un video o di un sito.",
        }];
        if (sites.length) {
            filters.push({
                type_name: "SelectFilter",
                name: "Raccolta",
                state: 0,
                values: [
                    { type_name: "SelectOption", name: "—", value: "" },
                    { type_name: "SelectOption", name: "Gooning: PMV, goon, hypno, edging (più siti insieme)", value: "goon" },
                ],
            });
            var normal = sites.filter(function (x) { return !isJavSite(x); });
            var jav = sites.filter(function (x) { return isJavSite(x); });
            if (normal.length) {
                filters.push({
                    type_name: "SelectFilter",
                    name: "Sito",
                    state: 0,
                    values: [{ type_name: "SelectOption", name: "— (sito principale)", value: "" }].concat(normal.map(function (x) {
                        return { type_name: "SelectOption", name: self.siteName(x), value: x };
                    })),
                });
            }
            if (jav.length) {
                filters.push({
                    type_name: "SelectFilter",
                    name: "Sito JAV",
                    state: 0,
                    values: [{ type_name: "SelectOption", name: "—", value: "" }].concat(jav.map(function (x) {
                        return { type_name: "SelectOption", name: self.siteName(x), value: x };
                    })),
                });
            }
            filters.push({
                type_name: "SelectFilter",
                name: "Ordine",
                state: 0,
                values: [
                    { type_name: "SelectOption", name: "Predefinito", value: "" },
                    { type_name: "SelectOption", name: "Più recenti", value: "latest" },
                    { type_name: "SelectOption", name: "Più visti", value: "views" },
                    { type_name: "SelectOption", name: "Più votati", value: "rated" },
                    { type_name: "SelectOption", name: "Più lunghi", value: "longest" },
                ],
            });
            // Le stesse categorie per tutti i siti: sul sito scelto l'estensione
            // cerca la pagina di quella categoria, altrimenti cerca la parola.
            filters.push({
                type_name: "SelectFilter",
                name: "Categoria",
                state: 0,
                values: [{ type_name: "SelectOption", name: "Tutte", value: "" }].concat(CATEGORIES.map(function (c, i) {
                    return { type_name: "SelectOption", name: c[0], value: String(i) };
                })),
            });
        }
        return filters;
    }

    getSourcePreferences() {
        var self = this;
        // Non chiamare get() / sites() / applyRename qui: Mangayomi, per leggere
        // una preferenza, richiama questo metodo. Un get() interno è un ciclo.
        var saved = this.savedSites();
        var all = this.allSites(saved);
        var urls = READY.map(function (r) { return r[0]; });
        var off = this.readJson(STORE_READY_OFF, []);
        var prefs = [];
        if (all.length) {
            var main = all.indexOf(this.prefs.getString(STORE_MAIN, ""));
            prefs.push({
                key: this.listKey("linkuni_main_", all),
                listPreference: {
                    title: "Sito principale",
                    summary: "Quello di Popolari e Recenti, e il primo nel filtro «Sito» della ricerca.",
                    valueIndex: main < 0 ? 0 : main,
                    entries: all.map(function (x) { return self.siteName(x); }),
                    entryValues: all,
                },
            });
        }
        prefs.push({
            key: this.listKey("linkuni_ready_", urls),
            multiSelectListPreference: {
                title: "Siti già pronti",
                summary: "Siti provati che funzionano da soli. Quelli spuntati compaiono nel filtro «Sito»; (360p) = solo quella qualità.",
                entries: READY.map(function (r) { return r[1]; }),
                entryValues: urls,
                values: urls.filter(function (u) { return off.indexOf(u) === -1; }),
            },
        });
        prefs.push({
            key: PREF_RANDOM,
            switchPreferenceCompat: {
                title: "Sito a sorpresa",
                summary: "A ogni apertura Popolari e Recenti mostrano un sito a caso tra quelli attivi (i tuoi e quelli pronti spuntati), invece del sito principale.",
                value: false,
            },
        });
        prefs.push({
            key: PREF_QUALITY,
            listPreference: {
                title: "Qualità preferita",
                summary: "Quella che parte quando apri un video, se il sito la offre. Le altre restano nel player.",
                valueIndex: 0,
                entries: ["Massima disponibile", "1080p", "720p", "480p", "360p"],
                entryValues: ["max", "1080", "720", "480", "360"],
            },
        });
        prefs.push({
            key: PREF_DEBUG,
            switchPreferenceCompat: {
                title: "Diagnostica",
                summary: "Spiegazione quando una lista o un video non esce, e il motore riconosciuto (KVS, WordPress, xVideos, JSON) accanto al titolo. Lasciala spenta.",
                value: false,
            },
        });
        prefs.push({
            key: PREF_RENAME,
            editTextPreference: {
                title: "Rinomina un sito",
                summary: "Scrivi indirizzo | nome (es. jav.guru | JAV Guru). Il sito principale, qui sopra, è quello di Popolari e Recenti.",
                value: "",
                dialogTitle: "Rinomina un sito",
                dialogMessage: "Indirizzo del sito, una barra verticale, il nome da mostrare.",
            },
        });
        prefs.push({
            key: PREF_ADD,
            editTextPreference: {
                title: "➕ Salva un sito",
                summary: saved.length ?
                    "I tuoi siti: " + saved.map(function (x) { return self.siteName(x); }).join(", ") + ". Scrivi il link della pagina principale di un altro sito per aggiungerlo." :
                    "Un sito che non è tra quelli pronti: scrivi il link della pagina principale, poi apri la sorgente.",
                value: "",
                dialogTitle: "Salva un sito",
                dialogMessage: "Link della pagina principale. Puoi metterne più di uno separati da spazio.",
            },
        });
        if (saved.length) {
            var savedOff = this.readJson(STORE_SAVED_OFF, []);
            prefs.push({
                key: this.listKey("linkuni_saved_on_", saved),
                multiSelectListPreference: {
                    title: "I tuoi siti attivi",
                    summary: "Togli la spunta per nasconderli senza cancellarli. Quello di Popolari e Recenti è «Sito principale», qui sopra.",
                    entries: saved.map(function (x) { return self.siteName(x); }),
                    entryValues: saved,
                    values: saved.filter(function (u) { return savedOff.indexOf(u) === -1; }),
                },
            });
            prefs.push({
                key: this.listKey("linkuni_remove_", saved),
                multiSelectListPreference: {
                    title: "Togli i tuoi siti",
                    summary: "Spunta i siti da togliere. Spariscono la prossima volta che apri la sorgente.",
                    entries: saved.map(function (x) { return self.siteName(x); }),
                    entryValues: saved,
                    values: [],
                },
            });
        }
        return prefs;
    }
}
