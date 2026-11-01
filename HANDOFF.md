# Passaggio di consegne — moduli Mangayomi (branch `mangayomi`)

Documento per chi riprende il lavoro (persona o altra IA). Stato al 1 novembre 2026.

> **Istruzione per chi riprende:** continua il lavoro già fatto, **non ricominciare da zero e non riscrivere
> i moduli**. Parti dai file esistenti in `src/` sul branch `mangayomi` e correggi solo i bug elencati nelle
> sezioni «DA SISTEMARE» (HypnoTube e PMVHaven). AnimeWorld e HentaiWorld sono completi: non toccarli.

## Cos'è questo branch

Branch orfano `mangayomi` del repo `adam72881/it-ext-repo`. Contiene **solo** sorgenti per l'app
[Mangayomi](https://github.com/kodjodevf/mangayomi) (JavaScript, classe `DefaultExtension extends MProvider`).
Non c'entra con il resto del repo (estensioni Keiyoushi/Tachimanga, branch `main` e `*-dev`).

URL da incollare in Mangayomi (Impostazioni → Browse → repository anime):

```
https://raw.githubusercontent.com/adam72881/it-ext-repo/mangayomi/anime_index.json
```

### File

| File | Cosa |
|---|---|
| `anime_index.json` | Indice delle sorgenti. **Ogni modifica a un `.js` richiede di alzare `version` sia qui sia nel `mangayomiSources` del file**, altrimenti l'app non scarica il codice nuovo. |
| `src/animeworld.js` | AnimeWorld (animeworld.ac) — 1.2.0 |
| `src/hentaiworld.js` | HentaiWorld (hentaiworld.me, sito italiano) — 2.1.0 |
| `src/hypnotube.js` | HypnoTube (hypnotube.com) — 1.1.4 |
| `src/pmvhaven.js` | PMVHaven (pmvhaven.com) — 1.1.3 |

## API di Mangayomi (promemoria)

- `getPopular(page)`, `getLatestUpdates(page)`, `search(query, page, filters)` → `{ list: [{name, imageUrl, link}], hasNextPage }`
- `getDetail(url)` → `{ link, description, genre: [], status, chapters: [{name, url}] }` (status: 0 in corso, 1 finito, 3 cancellato, 5 sconosciuto)
- `getVideoList(url)` → `[{ url, originalUrl, quality, headers, subtitles? }]`
- `getFilterList()` → `SelectFilter { type_name, name, state, values: [{type_name:"SelectOption", name, value}] }`, `HeaderFilter`
- HTTP: `new Client().get(url, headers)` → `.body`; HTML: `new Document(body)`, `.select()`, `.selectFirst()`, `.text`, `.attr()`, `.getHref`
- **Insidie note:**
  - Mangayomi a volte **antepone il baseUrl** agli URL di capitolo (`https://sito/https://cdn/...mp4`): in `getVideoList` tenere sempre dall'ultimo `http` (`raw.slice(raw.lastIndexOf("http"))`).
  - Un tag genere toccato nella scheda arriva a `search()` come **testo**: mappare nome→valore filtro per renderlo cliccabile.
  - Le preferenze (es. dominio) restano salvate: se cambi il default, cambia anche la `key`.
  - Il nome capitolo senza numero causa l'avviso "couldn't be auto-numbered": usare nomi tipo `Episodio 1`.

## Stato per sorgente

### AnimeWorld — ✅ completo (fatto e verificato dall'utente)
Ordine (sort 0–7, Più recenti = 5), Stato, Lingua (Sub/Dub ITA), 45 generi, tag cliccabili.

### HentaiWorld — ✅ completo (fatto dall'utente, verificato)
Usa le pagine `/archive` con `search=`, `sort=`, `genre=`, `status=`, `language=sub_ita|sub_eng|dub_ita`.
Trama da `div.entry > p`, episodi da `#episodes-grid article.episode-item`, video mp4 da `videoUrl` nella pagina `/watch/`.

### HypnoTube — ✅ 1.1.0 (verificato con HTTP reale, richieste in sequenza)
Popolari `/most-viewed/`, Recenti `/most-recent/`. Pagina 2 di entrambi: 20 video, 0 in comune con la pagina 1,
e Popolari/Recenti hanno 0 id in comune tra loro.
Ordine: Recenti, Più visti, Più votati, Più commentati, Più lunghi, Più votati della settimana (`/top-rated/week/`),
Più votati del mese (`/top-rated/month/`), Casuale (pagina a caso tra i link `pageN.html`).
Settimana e mese sono liste diverse dal «Più votati» generale (overlap 0 e 4 su 20).
Ricerca: il GET diretto di `/search/videos/<q>/` risponde «Search error» oppure rimanda all'age-gate.
Funziona il POST del form `searchgate.php` (`q` codificato una sola volta, spazi come `+`): il server
restituisce l'URL (anche con spazi, es. `/search/videos/sissy hypno caption/`). Se quella pagina è il
controllo di accesso, si rifà la stessa POST JSON che fa lo script del sito (`timeZone` + `languages`,
niente coordinate e niente User-Agent diverso) e si apre l'URL con Referer `searchgate.php`.
Prove: sissy 18/20 titoli, hypno 20/20, poppers 19/20, «sissy hypno caption» 20 risultati.
Dalla 1.1.1 ogni ricerca (e la pagina successiva) aspetta almeno 10 secondi dalla precedente; se arriva «Search error» si aspetta 10 secondi e si riprova una volta.
1.1.3: filtri separati. Video = Sezione (tutti, tendenza `trending=true&sort=-views`, popolare `sort=-likes`, tag HMV/TikTok/Hypno/Korean BJ) e Ordine video (`-releaseDate`, `releaseDate`, `-bayesianRating`, `-views`, `-likes`, `-duration`, `duration`, casuale). Playlist = Ordine playlist del sito (`-createdAt`, `createdAt`, `-views`, `-bayesianRating`, `-likes`, `name`, `-name`, `-videoCount`, casuale sulle pagine 1–10). Link playlist `/playlists/<id>`; getDetail una sola chiamata `?page=1&limit=50` e legge `data.videoDetails`. Raccomandato (`personalizedOnly`) senza login restituisce 0 video e non è nel filtro. HypnoTube 1.1.4: playlist Più visti `/playlists/views/`, Casuale una pagina a caso; Più lunghi non esiste sul sito e resta l’elenco recenti.
Pagina 2 della ricerca: dopo la pagina 1, GET di `pageN.html` con Referer della pagina 1; se è vuota si
ripete il controllo di accesso su quel path. Esito: 20 video, 0 in comune con la pagina 1
(«The Best Sissy Maker Ever» contro «BBC Photography…»).
Categorie: Hypnosis e Audio si sovrappongono 5/20; Gooning e Popolari 0/20.
Scheda: capitolo `Episodio 1`. Generi = primi 3 tag del video (`div.tags-block`) più i link `a.link12`
(le categorie del video). Il menu «Categories» non c'è più.
Stats verificate: `Durata 07:04 · Voto 93% · 7.2M visualizzazioni`. `getVideoList` → 206 `video/mp4`.
Durata minima: legge `span.time` in lista; se il filtro toglierebbe tutto, la pagina resta quella originale.
In cima a Categoria, solo canali esistenti: Music PMV, Hypnosis, Sissy Training, Captions, Chastity, Asian.
Non esistono come canale (non aggiunti lì): Egirl, BNWO, ahegao, stockings, heels, lingerie, Public.
Categorie principali: Gooning = canale `91/gooning`; Poppers = ricerca (20/20 titoli); Blackedraw = ricerca
del sito, 12 video (non tutti hanno la parola nel titolo: è la pagina che il sito restituisce).
Preset: Sissy Hypno = `sissy hypno caption`; Egirl PMV = `egirl` (la query a tre parole sul sito restituisce
1 solo video, `egirl` ne dà 20 di cui 14 col termine nel titolo); Lingerie e Tacchi = `lingerie stockings heels`
(20 risultati); Chastity = `chastity caption`; BNWO = `bnwo` (20).
Playlist pubbliche: sì. Lista `/playlists/` (pagina 2 diversa, 0 id in comune), ricerca tipo playlist
(`sissy` → 20 playlist), scheda `/playlist/<id>/<slug>/` con episodi `Episodio N - titolo` (CocoTranse: 7;
il primo stream risponde). Non c'è una data sul video in playlist.
Simili: Mangayomi non ha un campo «correlati». I 2–3 tag principali sono generi e, toccati, arrivano a
`search()` come testo. Un capitolo «Simili» verrebbe riprodotto come episodio: non è stato aggiunto.

### PMVHaven — ✅ 1.1.0 (verificato sull'API pubblica)
`tags=` sulla lista **non** filtra in modo affidabile: `tags=gooning` e `tags=poppers` hanno gli stessi
`_id` (totale 1865) e i video non hanno quel tag; `tags=hypno` si sovrappone 31/32 a quel set.
`tags=blowjob` invece è diverso (27/32 col tag). Per categoria, preset e «Categorie principali» si usa
`/api/videos/search?q=` **senza** `sort=-uploadDate` (quel sort toglieva i risultati pertinenti).
Rilevanza sulla prima pagina (tag o titolo): blowjob 20/20, hypno 15/20, sissy 16/20, gooning 13/20,
Blackedraw 16/20, poppers 18/20, pmv 18/20, egirl 20/20, bnwo 15/20, caption 16/20, ahegao 20/20,
stockings 20/20, heels 17/20, lingerie 19/20, chastity 20/20, asian 15/20, public 20/20, blonde 19/20.
Tutti questi sono in cima al filtro, dopo Gooning, Blackedraw e Poppers. Il resto dei tag è rimasto.
In cima a Categoria non c'era un tag «PMV», «Egirl», «Caption», «Stockings», «Heels», «Lingerie»,
«Chastity», «Public», «Poppers», «Blackedraw»: esistono come ricerca `q=` e sono stati aggiunti solo così.
Ordine: Recenti `-uploadDate`, Più visti `-views`, Più votati `-bayesianRating`, Più lunghi `-duration`
(i primi durano ore: 19956 s, …), settimana e mese = `-bayesianRating` + `uploadDateFrom` a 7 e 30 giorni
(date 2026-10-27…31 e 2026-10-13…15, con oggi 2026-11-01). Casuale = pagina a caso su `totalPages`.
Durata minima: `durationMin` in secondi (10/20/45 min). I 45+ della prova sono tutti ≥ 3135 s, pagina piena.
Scheda: `Episodio 1`. Esempio reale: `Durata 4:22 · Voto 83% · 1.5M visualizzazioni`. Voto = like/(like+dislike).
Generi: primi 3 di `top5Tags`, poi gli altri tag. Un genere toccato rifà la ricerca `q=`. Niente capitolo «Simili».
`getVideoList` → 206 `video/mp4`.
Preset (tutti via `q=`): Sissy Hypno = `sissy hypno caption` (20/20 sissy); Egirl PMV = `pmv egirl blonde`
(11/20 egirl); Lingerie e Tacchi = solo `lingerie` (la query `lingerie stockings heels` era 2/12, non pertinente;
`lingerie` è 19/20); Chastity = `chastity caption` (12/20 chastity, le caption ci sono in quasi tutti);
BNWO = `bnwo` (15/20).
Playlist pubbliche: sì. `GET /api/playlists?isPublic=true` (pagina 2 con 0 id in comune),
`GET /api/playlists/search?q=`, scheda `GET /api/playlists/<id>?fetchAll=true`.
Episodi `Episodio N - titolo` con `dateUpload` = `uploadDate` quando c'è. Lo stream dell'episodio risponde.
Tipo Video/Playlist è un SelectFilter separato. I tab Popolari/Recenti dell'app non ricevono i filtri:
il tipo Playlist vale nella ricerca/filtri.

## Come verificare (senza l'app)

1. `node --check src/<file>.js` e `node -e "JSON.parse(require('fs').readFileSync('anime_index.json','utf8'))"`
2. Per la logica: caricare il file con stub dei globali (`MProvider`, `Client`, `Document`,
   `SharedPreferences`) in Node e chiamare i metodi con risposte reali salvate con `curl`.
3. Per i siti: `curl -sS -L -A "<UA iPhone>"` sulle pagine/API e confrontare i risultati.
   **Non** provare a aggirare Cloudflare o controlli anti-bot e non variare lo User-Agent per "testare"
   protezioni: usare solo le richieste che fa il sito stesso.
4. Commit sul branch `mangayomi`, `git push origin mangayomi`. L'utente aggiorna da Mangayomi
   (Browse → refresh repository → aggiorna la sorgente).

## Cosa ha chiesto l'utente (in ordine)

1. Moduli Mangayomi per siti italiani: **AnimeWorld** e **HentaiWorld** — fatti.
2. Filtri come sul sito: categorie/generi, lingua (Sub ITA / Sub ENG / Dub ITA), ordine (incl. "Più recenti"),
   stato (in corso/finito), trama, generi cliccabili nella scheda — fatti per AnimeWorld e HentaiWorld.
3. **HypnoTube** e **PMVHaven** con categorie, tag, filtri, ricerca, recenti e popolari — fatti in 1.1.0.
4. Su PMVHaven: categorie principali **gooning, Blackedraw, poppers** — filtro dedicato, più le stesse voci in cima a Categoria.
5. Preset sessione, durata minima, ordine casuale / più lunghi / più votati di settimana e mese, riga stats in scheda, playlist pubbliche. Nessuna esclusione di contenuti aggiunta.

## Altro progetto nello stesso repo (contesto)

- Branch `main` / `hentai-zone-dev` / `hentai-ita-dev` / `hentai-archive-dev`: estensioni Keiyoushi
  (Mihon/Tachimanga) pubblicate su `https://raw.githubusercontent.com/adam72881/it-ext-repo/repo/index.min.json`.
- PR a Keiyoushi `keiyoushi/extensions-source#20586` (Hentai Zone + Hentai ITA): CI verde, in attesa di review.
