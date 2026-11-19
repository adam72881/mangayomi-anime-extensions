const mangayomiSources = [
    {
        "name": "HentaiWorld",
        "lang": "it",
        "baseUrl": "https://www.hentaiworld.me",
        "apiUrl": "",
        "iconUrl": "https://www.google.com/s2/favicons?sz=64&domain=hentaiworld.me",
        "typeSource": "single",
        "isNsfw": true,
        "itemType": 1,
        "version": "2.9.0",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/hentaiworld.js",
    },
];

// HentaiWorld italiano (hentaiworld.me): API /api/episodes con video_url mp4
// diretti. ITA ed ENG sono serie separate (slug con -sub-eng / senza suffisso).
const DEFAULT_BASE = "https://www.hentaiworld.me";
const PREF_BASE = "hentaiworld_me_base_url";
const PER_PAGE = 20;
const LATEST_SEEN = "hentaiworld_latest_seen";

// Raccolta «Estremi»: lascia fuori i generi troppo larghi (Bondage, X-Ray, Ahegao:
// oltre 200 serie ciascuno). Il sito unisce i generi in OR e non sa ordinare per
// «quanti ne ha»: la classifica la calcola extremeListing.
const EXTREME = ["bdsm", "mind-break", "tentacle", "inflation", "ugly-bastard", "gangbang", "monster", "scat", "watersports", "horror"];
const EXTREME_CACHE = "hentaiworld_extreme_cache";
const EXTREME_TTL = 24 * 3600 * 1000;

// slug usati da /archive?genre=<slug> (59 generi, pagina archivio live).
const GENRES = [
    ["3d", "3D"], ["ahegao", "Ahegao"], ["anal", "Anal"], ["bdsm", "BDSM"],
    ["big-boobs", "Big Boobs"], ["blow-job", "Blow Job"], ["bondage", "Bondage"],
    ["boob-job", "Boob Job"], ["censored", "Censored"], ["comedy", "Comedy"],
    ["cosplay", "Cosplay"], ["creampie", "Creampie"], ["dark-skin", "Dark Skin"],
    ["facial", "Facial"], ["fantasy", "Fantasy"], ["filmed", "Filmed"],
    ["foot-job", "Foot Job"], ["futanari", "Futanari"], ["gangbang", "Gangbang"],
    ["glasses", "Glasses"], ["hand-job", "Hand Job"], ["harem", "Harem"],
    ["horror", "Horror"], ["incest", "Incest"], ["inflation", "Inflation"],
    ["lactation", "Lactation"], ["maid", "Maid"], ["masturbation", "Masturbation"],
    ["milf", "Milf"], ["mind-break", "Mind Break"], ["mind-control", "Mind Control"],
    ["monster", "Monster"], ["nekomimi", "Nekomimi"], ["ntr", "NTR"],
    ["nurse", "Nurse"], ["orgy", "Orgy"], ["plot", "Plot"], ["pov", "POV"],
    ["pregnant", "Pregnant"], ["public-sex", "Public Sex"], ["rimjob", "Rimjob"],
    ["scat", "Scat"], ["school-girl", "School Girl"], ["softcore", "Softcore"],
    ["swimsuit", "Swimsuit"], ["teacher", "Teacher"], ["tentacle", "Tentacle"],
    ["threesome", "Threesome"], ["toys", "Toys"], ["trap", "Trap"],
    ["tsundere", "Tsundere"], ["ugly-bastard", "Ugly Bastard"],
    ["uncensored", "Uncensored"], ["vanilla", "Vanilla"], ["virgin", "Virgin"],
    ["watersports", "Watersports"], ["x-ray", "X-Ray"], ["yaoi", "Yaoi"],
    ["yuri", "Yuri"],
];

// name="sort" sull'archivio. Non esiste la voce «Più recenti»:
// le serie più recenti sono «Ultime aggiunte» (sort=latest).
const SORTS = [
    ["latest", "Ultime aggiunte"],
    ["a-z", "Lista A-Z"],
    ["z-a", "Lista Z-A"],
    ["views", "Più visti"],
    ["views-low", "Meno visti"],
    ["rating-high", "Voto maggiore"],
    ["rating-low", "Voto minore"],
];

const STATUSES = [
    ["In corso", "In corso"],
    ["Finito", "Finito"],
    ["Non rilasciato", "Non rilasciato"],
    ["Droppato", "Droppato"],
];

const UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function langOf(slug) {
    slug = String(slug || "");
    if (slug.indexOf("-sub-eng") !== -1) return "eng";
    if (slug.indexOf("-dub-ita") !== -1) return "dubita";
    return "ita"; // senza suffisso (o -sub-ita) = italiano
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
        if (!v || !v.length || v.indexOf("hentaiworld.to") !== -1) v = DEFAULT_BASE;
        return v.replace(/\/+$/, "");
    }

    headers(referer) {
        return {
            "User-Agent": UA,
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
            "X-Requested-With": "XMLHttpRequest",
            "Referer": referer || this.getBaseUrl() + "/",
        };
    }

    // Valori spuntati di un GroupFilter di CheckBox.
    checkedValues(filters, name) {
        var out = [];
        if (!filters || !filters.length) return out;
        for (var i = 0; i < filters.length; i++) {
            var f = filters[i];
            if (!f || f.type_name !== "GroupFilter" || f.name !== name || !Array.isArray(f.state)) continue;
            for (var j = 0; j < f.state.length; j++) {
                var c = f.state[j];
                if (c && c.state === true && c.value) out.push(String(c.value));
            }
        }
        return out;
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

    slugOf(url) {
        var raw = String(url).split("?")[0].split("#")[0];
        try { raw = decodeURIComponent(raw); } catch (e) {}
        var parts = raw.replace(/\/+$/, "").split("/").filter(function (s) {
            return s.length > 0;
        });
        return parts.length ? parts[parts.length - 1] : "";
    }

    // Schede archivio (sito rifatto a novembre 2026): div.ar-item > a.ar[href="/hentai/<slug>"],
    // titolo in b.ar-title. La pagina successiva c'è se esiste a[rel=next].
    parseArchive(doc) {
        var list = [];
        var seen = {};
        for (var a of doc.select("a.ar")) {
            var slug = this.slugOf(a.attr("href") || "");
            if (!slug || seen[slug]) continue;
            var t = a.selectFirst(".ar-title");
            var name = t ? t.text.trim() : "";
            if (!name) continue;
            seen[slug] = true;
            var img = a.selectFirst("img");
            var imageUrl = img ? img.attr("src") || img.attr("data-src") || "" : "";
            list.push({ name: name, imageUrl: imageUrl, link: "/hentai/" + slug });
        }
        return { list: list, hasNextPage: !!doc.selectFirst('a[rel="next"]') };
    }

    genreFor(text) {
        var key = String(text).trim().toLowerCase().replace(/[\s_]+/g, "-");
        for (var i = 0; i < GENRES.length; i++) {
            if (GENRES[i][0] === key || GENRES[i][1].toLowerCase().replace(/\s+/g, "-") === key) return GENRES[i][0];
        }
        return "";
    }

    // Classifica «Estremi»: legge tutte le pagine di ogni genere estremo (dai più
    // visti) e ordina le serie per quanti generi estremi hanno insieme, poi per
    // posizione nei più visti. Tipo Euphoria (BDSM + Scat + …) finisce in cima.
    // Risultato tenuto per un giorno: la prima apertura richiede qualche secondo.
    async extremeListing(page, extra) {
        var size = 20;
        var key = "x4|" + extra;
        var cache = null;
        try { cache = JSON.parse(this.readStore(EXTREME_CACHE) || "null"); } catch (e) {}
        if (!cache || cache.key !== key || !(Date.now() - cache.at < EXTREME_TTL) || !(cache.items || []).length) {
            var self = this;
            var byLink = {};
            var found = {};
            await Promise.all(EXTREME.map(async function (g) {
                found[g] = [];
                for (var p = 1; p <= 20; p++) {
                    var params = "genre%5B%5D=" + g + "&sort=views" + (extra ? "&" + extra : "");
                    var res;
                    try { res = await self.archive(params, p); } catch (e) { break; }
                    for (var i = 0; i < res.list.length; i++) {
                        var it = res.list[i];
                        var rank = (p - 1) * PER_PAGE + i;
                        var cur = byLink[it.link];
                        if (!cur) byLink[it.link] = cur = { name: it.name, imageUrl: it.imageUrl, link: it.link, score: 0, rank: rank };
                        if (rank < cur.rank) cur.rank = rank;
                        found[g].push(cur);
                    }
                    if (!res.hasNextPage) break;
                }
            }));
            // Un genere che hanno in pochi pesa di più: Scat (circa 26 serie) vale molto
            // più di Gangbang (circa 270). Così le serie tipo Euphoria salgono in cima.
            for (var g2 in found) {
                var weight = 100 / Math.max(found[g2].length, 10);
                for (var f = 0; f < found[g2].length; f++) found[g2][f].score += weight;
            }
            var items = [];
            for (var l in byLink) items.push(byLink[l]);
            items.sort(function (a, b) { return b.score - a.score || a.rank - b.rank; });
            cache = { key: key, at: Date.now(), items: items };
            this.writeStore(EXTREME_CACHE, JSON.stringify(cache));
        }
        var start = (page - 1) * size;
        var slice = cache.items.slice(start, start + size);
        return {
            list: slice.map(function (it) { return { name: it.name, imageUrl: it.imageUrl, link: it.link }; }),
            hasNextPage: start + size < cache.items.length,
        };
    }

    async archive(params, page) {
        var q = params && params.length ? params + "&page=" + page : "page=" + page;
        return this.parseArchive(await this.doc("/archive?" + q));
    }

    async doc(path) {
        var url = path.indexOf("http") === 0 ? path : this.getBaseUrl() + path;
        var h = this.headers(this.getBaseUrl() + "/");
        h["Accept"] = "text/html,application/xhtml+xml";
        var res = await this.client.get(url, h);
        return new Document(res.body);
    }

    async getPopular(page) {
        return this.archive("sort=views", page);
    }

    // Il sito non ha «Più recenti»: l'ordine recente è sort=latest (Ultime aggiunte).
    // Come la home del sito («Episodi usciti recentemente»): /api/episodes dà gli
    // episodi dal più nuovo, con la loro serie. Ogni serie compare una volta sola,
    // nel punto del suo episodio più recente. «sort=latest» dell'archivio invece
    // ordina le serie per data di aggiunta al sito, e non combaciava.
    async getLatestUpdates(page) {
        var per = 30;
        var res = await this.client.get(
            this.getBaseUrl() + "/api/episodes?page=" + page + "&per_page=" + per,
            this.headers(this.getBaseUrl() + "/"),
        );
        // Ora /api/episodes risponde con l'HTML delle schede: a.card-ep[href="/watch/<serie>-episode-N"].
        var data = JSON.parse(res.body) || {};
        var cards = new Document("<div>" + (data.html || "") + "</div>").select("a.card-ep");
        var shown = page > 1 ? this.readStore(LATEST_SEEN).split(" ") : [];
        var seen = {};
        for (var k = 0; k < shown.length; k++) if (shown[k]) seen[shown[k]] = true;
        var list = [];
        for (var i = 0; i < cards.length; i++) {
            var slug = this.slugOf(cards[i].attr("href") || "").replace(/-episode-[0-9.]+$/, "");
            if (!slug || seen[slug]) continue;
            seen[slug] = true;
            shown.push(slug);
            var t = cards[i].selectFirst(".card-title");
            var img = cards[i].selectFirst("img");
            var thumb = img ? img.attr("src") || "" : "";
            list.push({
                name: (t && t.text.trim()) || slug,
                imageUrl: /^https?:\/\//.test(thumb) ? thumb : "",
                link: "/hentai/" + slug,
            });
        }
        this.writeStore(LATEST_SEEN, shown.slice(-400).join(" "));
        return { list: list, hasNextPage: !!data.has_more };
    }

    readStore(key) {
        try { return String(new SharedPreferences().getString(key, "") || ""); } catch (e) { return ""; }
    }

    writeStore(key, value) {
        try { new SharedPreferences().setString(key, value); } catch (e) {}
    }

    decodeHtml(text) {
        return String(text)
            .replace(/&#0*39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
    }

    async search(query, page, filters) {
        var genres = this.checkedValues(filters, "Generi");
        var sort = this.filterValue(filters, "Ordine");
        var status = this.filterValue(filters, "Stato");
        var langs = this.checkedValues(filters, "Lingua");
        if (this.filterValue(filters, "Raccolta") === "extreme") {
            var extra = [];
            if (status) extra.push("status%5B%5D=" + encodeURIComponent(status));
            for (var x = 0; x < langs.length; x++) extra.push("language%5B%5D=" + encodeURIComponent(langs[x]));
            return this.extremeListing(page, extra.join("&"));
        }
        if ((!filters || !filters.length) && !(query && query.length))
            return this.getPopular(page);

        // La ricerca del sito guarda solo i titoli: se il testo è il nome di un
        // genere (es. «yuri», «big boobs»), si apre quel genere.
        if (!genres.length && query) {
            var asGenre = this.genreFor(query);
            if (asGenre) {
                genres = [asGenre];
                query = "";
            }
        }

        var parts = [];
        if (query && query.length) parts.push("search=" + encodeURIComponent(query));
        for (var g = 0; g < genres.length; g++) parts.push("genre%5B%5D=" + encodeURIComponent(genres[g]));
        if (sort) parts.push("sort=" + encodeURIComponent(sort));
        if (status) parts.push("status%5B%5D=" + encodeURIComponent(status));
        for (var l = 0; l < langs.length; l++) parts.push("language%5B%5D=" + encodeURIComponent(langs[l]));
        return this.archive(parts.join("&"), page);
    }

    async getDetail(url) {
        var slug = this.slugOf(url);
        var doc = await this.doc("/hentai/" + slug);

        var plot = doc.selectFirst(".dt-plot .more-text") || doc.selectFirst(".dt-plot p");
        var description = plot ? plot.text.trim() : "";

        var genre = [];
        for (var g of doc.select("a.dt-genre")) {
            var t = g.text.trim();
            if (t && genre.indexOf(t) === -1) genre.push(t);
        }

        var status = 5;
        for (var tag of doc.select(".dt-tag")) {
            var label = tag.text.trim();
            if (label === "In corso") status = 0;
            else if (label === "Finito" || label === "Terminato") status = 1;
            else if (label === "Droppato") status = 3;
        }

        // Episodi: div.ep-item[data-ep] > a[href="/watch/..."]; la data è nel <time datetime>.
        var chapters = [];
        var seen = {};
        var items = doc.select(".ep-item");
        for (var k = 0; k < items.length; k++) {
            var card = items[k];
            var a = card.selectFirst('a[href*="/watch/"]');
            if (!a) continue;
            var href = a.attr("href") || "";
            if (!href || seen[href]) continue;
            seen[href] = true;
            var num = card.attr("data-ep") || String(chapters.length + 1);
            var ep = { name: "Episodio " + num, url: href, _n: parseFloat(num) || 0 };
            var img = card.selectFirst("img");
            var thumb = img ? (img.attr("src") || img.attr("data-src") || "") : "";
            if (/^https?:\/\//.test(thumb)) ep.thumbnailUrl = thumb;
            var time = card.selectFirst("time");
            var ms = time ? Date.parse(time.attr("datetime") || "") : NaN;
            if (isFinite(ms)) ep.dateUpload = String(ms);
            chapters.push(ep);
        }
        chapters.sort(function (a, b) { return b._n - a._n; });
        for (var c = 0; c < chapters.length; c++) delete chapters[c]._n;

        var langName = { eng: "SUB ENG", dubita: "DUB ITA", ita: "SUB ITA" }[langOf(slug)] || "";
        if (langName) {
            description = description
                ? description + "\n\nLingua: " + langName
                : "Lingua: " + langName;
        }

        // Copertina della serie (da «Più recente» arriva la miniatura dell'episodio).
        var og = doc.selectFirst('meta[property="og:image"]');
        var cover = og ? og.attr("content") || "" : "";

        return {
            imageUrl: /^https?:\/\//.test(cover) ? cover : undefined,
            link: "/hentai/" + slug,
            description: description || "Nessuna descrizione disponibile.",
            genre: genre,
            status: status,
            chapters: chapters,
        };
    }

    async getVideoList(url) {
        var raw = String(url);
        try {
            raw = decodeURIComponent(raw);
        } catch (e) {}
        // Se Mangayomi ha anteposto il baseUrl a un URL assoluto, tieni l'ultimo http.
        var lastHttp = raw.lastIndexOf("http");
        if (lastHttp > 0) raw = raw.slice(lastHttp);

        // Caso 1: l'URL è già (o contiene) il mp4 diretto.
        var m = raw.match(/https?:\/\/[^\s'"]+\.mp4[^\s'"]*/);
        var mp4 = m ? m[0] : "";

        // Caso 2: è lo slug di un episodio -> leggi la pagina /watch e prendi il mp4.
        if (!mp4) {
            var slug = raw.split("?")[0].split("#")[0].replace(/\/+$/, "")
                .split("/").filter(function (s) {
                    return s.length > 0;
                }).pop();
            var res = await this.client.get(
                this.getBaseUrl() + "/watch/" + slug,
                this.headers(this.getBaseUrl() + "/"),
            );
            var w = res.body.match(/videoUrl\s*=\s*['"]([^'"]+\.mp4[^'"]*)['"]/);
            if (!w) w = res.body.match(/https?:\/\/[^\s'"]+\.mp4[^\s'"]*/);
            if (w) mp4 = w[1] || w[0];
        }

        if (!mp4) throw new Error("Nessuno stream trovato per questo episodio");

        return [
            {
                url: mp4,
                originalUrl: mp4,
                quality: "HentaiWorld",
                headers: { "User-Agent": UA, "Referer": this.getBaseUrl() + "/" },
            },
        ];
    }

    options(pairs, anyLabel) {
        var out = [];
        if (anyLabel) out.push({ type_name: "SelectOption", name: anyLabel, value: "" });
        for (var i = 0; i < pairs.length; i++) {
            out.push({
                type_name: "SelectOption",
                name: pairs[i][1],
                value: pairs[i][0],
            });
        }
        return out;
    }

    getFilterList() {
        return [
            {
                type_name: "HeaderFilter",
                name: "Generi e lingue a spunta: escono le serie che ne hanno almeno uno (il sito non permette «tutti insieme» né di escludere). Ordine e stato si combinano.",
            },
            {
                type_name: "SelectFilter",
                name: "Ordine",
                state: 0,
                values: this.options(SORTS, "Standard"),
            },
            {
                type_name: "SelectFilter",
                name: "Stato",
                state: 0,
                values: this.options(STATUSES, "Tutti"),
            },
            {
                type_name: "SelectFilter",
                name: "Raccolta",
                state: 0,
                values: [
                    { type_name: "SelectOption", name: "Nessuna", value: "" },
                    { type_name: "SelectOption", name: "Estremi: prima chi ne ha di più (BDSM, Mind Break, Tentacle, Inflation, Ugly Bastard, Gangbang, Monster, Scat, Watersports, Horror)", value: "extreme" },
                ],
            },
            {
                type_name: "GroupFilter",
                name: "Lingua",
                state: [["sub_ita", "Sub ITA"], ["sub_eng", "Sub ENG"], ["dub_ita", "Dub ITA"]].map(function (x) {
                    return { type_name: "CheckBox", name: x[1], value: x[0] };
                }),
            },
            {
                type_name: "GroupFilter",
                name: "Generi",
                state: GENRES.map(function (x) {
                    return { type_name: "CheckBox", name: x[1], value: x[0] };
                }),
            },
        ];
    }

    getSourcePreferences() {
        return [
            {
                key: PREF_BASE,
                editTextPreference: {
                    title: "Dominio HentaiWorld",
                    summary:
                        "Cambialo quando il sito cambia indirizzo (es. https://www.hentaiworld.me)",
                    value: DEFAULT_BASE,
                    dialogTitle: "Dominio HentaiWorld",
                    dialogMessage: "URL base, senza slash finale",
                },
            },
        ];
    }
}
