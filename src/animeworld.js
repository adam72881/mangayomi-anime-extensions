const mangayomiSources = [
    {
        "name": "AnimeWorld",
        "lang": "it",
        "baseUrl": "https://www.animeworld.ac",
        "apiUrl": "",
        "iconUrl": "https://www.google.com/s2/favicons?sz=64&domain=animeworld.ac",
        "typeSource": "single",
        "isNsfw": false,
        "itemType": 1,
        "version": "1.3.0",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/animeworld.js",
    },
];

const DEFAULT_BASE = "https://www.animeworld.ac";
const PREF_BASE = "animeworld_base_url";
const UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

// id numerico del form /filter (name="genre") -> etichetta italiana.
// Verificati sulla pagina live: /filter?genre=<id> insieme a sort, status e dub.
const GENRES = [
    ["3", "Arti Marziali"], ["5", "Avanguardia"], ["2", "Avventura"], ["1", "Azione"],
    ["47", "Bambini"], ["4", "Commedia"], ["6", "Demoni"], ["7", "Drammatico"],
    ["8", "Ecchi"], ["9", "Fantasy"], ["10", "Gioco"], ["11", "Harem"],
    ["43", "Hentai"], ["13", "Horror"], ["49", "Isekai"], ["14", "Josei"],
    ["16", "Magia"], ["18", "Mecha"], ["19", "Militari"], ["21", "Mistero"],
    ["20", "Musicale"], ["22", "Parodia"], ["23", "Polizia"], ["24", "Psicologico"],
    ["46", "Romantico"], ["26", "Samurai"], ["28", "Sci-Fi"], ["27", "Scolastico"],
    ["29", "Seinen"], ["25", "Sentimentale"], ["30", "Shoujo"], ["31", "Shoujo Ai"],
    ["32", "Shounen"], ["33", "Shounen Ai"], ["37", "Soprannaturale"],
    ["34", "Slice of Life"], ["35", "Spazio"], ["36", "Sport"], ["12", "Storico"],
    ["38", "Superpoteri"], ["39", "Thriller"], ["40", "Vampiri"], ["48", "Veicoli"],
    ["41", "Yaoi"], ["42", "Yuri"],
];

// name="sort" sulla pagina /filter (radio 0-7).
const SORTS = [
    ["0", "Standard"],
    ["1", "Ultime aggiunte"],
    ["2", "Lista A-Z"],
    ["3", "Lista Z-A"],
    ["4", "Più vecchi"],
    ["5", "Più recenti"],
    ["6", "Più visti"],
    ["7", "Meglio valutati"],
];

// name="status" sulla pagina /filter.
// In Mangayomi: 0 ongoing, 1 complete, 3 canceled, 5 unknown.
const STATUSES = [
    ["0", "In corso"],
    ["1", "Finito"],
    ["2", "Non rilasciato"],
    ["3", "Droppato"],
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
        return {
            "User-Agent": UA,
            "Referer": referer || this.getBaseUrl() + "/",
        };
    }

    async doc(path) {
        var url = path.indexOf("http") === 0 ? path : this.getBaseUrl() + path;
        var res = await this.client.get(url, this.headers());
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

    hasNext(html, page) {
        var raw = html ? String(html) : "";
        var m = raw.match(/paginationMaxPage\s*=\s*parseInt\("(\d+)"\)/);
        if (m) return Number(page) < parseInt(m[1], 10);
        var next = String(Number(page) + 1);
        return new RegExp("[?&]page=" + next + "(?:&|\"|')").test(raw);
    }

    parseList(pageDoc, page) {
        var doc = pageDoc.doc || pageDoc;
        var html = pageDoc.html || "";
        var list = [];
        for (var item of doc.select("div.film-list div.item")) {
            var poster = item.selectFirst("a.poster");
            var nameEl = item.selectFirst("a.name");
            var a = poster || nameEl;
            if (!a) continue;
            var link = a.getHref;
            if (!link) continue;
            var name = nameEl ? nameEl.text.trim() : "";
            var img = item.selectFirst("img");
            var imageUrl = img ? img.attr("src") || img.attr("data-src") || "" : "";
            if (!name && img) name = img.attr("alt") || "";
            if (!name) continue;
            list.push({ name: name, imageUrl: imageUrl, link: link });
        }
        return { list: list, hasNextPage: list.length > 0 && this.hasNext(html, page) };
    }

    async getPopular(page) {
        return this.parseList(await this.doc("/filter?sort=6&page=" + page), page);
    }

    // sort=5 è «Più recenti» (data di uscita). sort=3 è Lista Z-A, non le novità.
    async getLatestUpdates(page) {
        return this.parseList(await this.doc("/filter?sort=5&page=" + page), page);
    }

    genreFor(text) {
        var key = String(text).trim().toLowerCase();
        for (var i = 0; i < GENRES.length; i++) {
            if (GENRES[i][1].toLowerCase() === key) return GENRES[i][0];
        }
        return "";
    }

    async search(query, page, filters) {
        var sort = this.filterValue(filters, "Ordine");
        var status = this.filterValue(filters, "Stato");
        var genre = this.filterValue(filters, "Genere");
        var dub = this.filterValue(filters, "Lingua");
        // La ricerca del sito guarda i titoli: «azione» trovava 4 anime. Se il testo
        // è il nome di un genere si apre quel genere.
        if (!genre && query) {
            var asGenre = this.genreFor(query);
            if (asGenre) {
                genre = asGenre;
                query = "";
            }
        }
        if ((!filters || !filters.length) && !genre) {
            if (query && query.length)
                return this.parseList(
                    await this.doc("/search?keyword=" + encodeURIComponent(query) + "&page=" + page),
                    page,
                );
            return this.getPopular(page);
        }

        var q = [];
        if (query && query.length) q.push("keyword=" + encodeURIComponent(query));
        if (sort !== "") q.push("sort=" + encodeURIComponent(sort));
        if (status !== "") q.push("status=" + encodeURIComponent(status));
        if (genre !== "") q.push("genre=" + encodeURIComponent(genre));
        if (dub !== "") q.push("dub=" + encodeURIComponent(dub));
        q.push("page=" + page);
        return this.parseList(await this.doc("/filter?" + q.join("&")), page);
    }

    async getDetail(url) {
        var doc = (await this.doc(url)).doc;
        var info = doc.selectFirst("div.widget.info");

        var description = "";
        var descEl = info ? info.selectFirst("div.desc") : doc.selectFirst("div.desc");
        if (descEl) description = descEl.text.trim();

        var genre = [];
        var genreRoot = info || doc;
        for (var g of genreRoot.select('a[href*="/genre/"]')) {
            var t = g.text.trim();
            if (t && genre.indexOf(t) === -1) genre.push(t);
        }

        // Lo stato di pubblicazione sta nel widget (a[href*="status="]),
        // non nel primo dl.meta né nel menu «segna come».
        var status = 5;
        var st = info ? info.selectFirst('a[href*="status="]') : null;
        if (st) {
            var href = st.attr("href") || "";
            var code = "";
            var cm = href.match(/status=(\d+)/);
            if (cm) code = cm[1];
            var label = st.text.trim();
            if (code === "0" || label === "In corso") status = 0;
            else if (code === "1" || label === "Finito" || label === "Terminato") status = 1;
            else if (code === "3" || label === "Droppato") status = 3;
        }

        var chapters = [];
        var seen = {};
        for (var li of doc.select("li.episode")) {
            var a = li.selectFirst("a");
            if (!a) continue;
            var href = a.getHref;
            if (!href) continue;
            var num = a.attr("data-episode-num") || a.attr("data-num") || a.text.trim();
            var key = a.attr("data-id") || href;
            if (seen[key]) continue;
            seen[key] = true;
            chapters.push({ name: "Episodio " + num, url: href });
        }
        chapters.reverse();

        return {
            link: url,
            description: description || "Nessuna descrizione disponibile.",
            genre: genre,
            status: status,
            chapters: chapters,
        };
    }

    async getVideoList(url) {
        var raw = String(url);
        try { raw = decodeURIComponent(raw); } catch (e) {}
        raw = raw.split("?")[0].split("#")[0].replace(/\/+$/, "");
        var parts = raw.split("/").filter(function (s) {
            return s.length > 0;
        });
        var code = parts[parts.length - 1];
        if (!code) throw new Error("Impossibile ricavare l'ID episodio da " + url);

        var referer = this.getBaseUrl() + "/play/" + parts.slice(-2).join("/");
        var h = this.headers(referer);
        var res = await this.client.get(
            this.getBaseUrl() + "/api/episode/info?id=" + encodeURIComponent(code) + "&alt=0",
            h,
        );
        var json = JSON.parse(res.body);

        var grabber = json && json.grabber;
        var stream = "";
        if (typeof grabber === "string") stream = grabber;
        else if (grabber && typeof grabber === "object")
            stream =
                grabber.src || grabber.url || grabber["1080p"] ||
                grabber["720p"] || grabber["480p"] || "";
        if (!stream) throw new Error("Nessuno stream trovato per questo episodio");

        return [{ url: stream, originalUrl: stream, quality: "AnimeWorld", headers: h }];
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
                name: "Ordine, stato, lingua e genere si combinano, anche con il testo. «Più recenti» sono le uscite più nuove; «Ultime aggiunte» quelle appena caricate.",
            },
            {
                type_name: "SelectFilter",
                name: "Ordine",
                state: 0,
                values: this.options(SORTS),
            },
            {
                type_name: "SelectFilter",
                name: "Stato",
                state: 0,
                values: this.options(STATUSES, "Tutti"),
            },
            {
                type_name: "SelectFilter",
                name: "Lingua",
                state: 0,
                values: [
                    { type_name: "SelectOption", name: "Qualsiasi", value: "" },
                    { type_name: "SelectOption", name: "Sub ITA", value: "0" },
                    { type_name: "SelectOption", name: "Doppiato", value: "1" },
                ],
            },
            {
                type_name: "SelectFilter",
                name: "Genere",
                state: 0,
                values: this.options(GENRES, "Tutti"),
            },
        ];
    }

    getSourcePreferences() {
        return [
            {
                key: PREF_BASE,
                editTextPreference: {
                    title: "Dominio AnimeWorld",
                    summary:
                        "Cambialo quando il sito cambia indirizzo (es. https://www.animeworld.ac)",
                    value: DEFAULT_BASE,
                    dialogTitle: "Dominio AnimeWorld",
                    dialogMessage: "URL base, senza slash finale",
                },
            },
        ];
    }
}
