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
| `src/hypnotube.js` | HypnoTube (hypnotube.com) — 1.0.0 |
| `src/pmvhaven.js` | PMVHaven (pmvhaven.com) — 1.0.1 |

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

### HypnoTube — ⚠️ DA SISTEMARE (lavoro interrotto qui)
Bug segnalati dall'utente:
1. **Popolari e Recenti sono uguali.** Causa trovata: `/videos/month/` (usato per Popolari) restituisce lo stesso
   contenuto di `/videos/`. I percorsi veri del sito (verificati) sono:
   - Recenti: `/most-recent/` (uguale a `/videos/`)
   - Popolari: `/most-viewed/` (risultati diversi, verificato) — anche `/most-viewed/month/`
   - Più votati: `/top-rated/` (20 video, verificato)
   - Altri: `/most-discussed/`, `/longest/`
   - Paginazione: `<base>pageN.html` (es. `/most-viewed/page2.html`) — da verificare sulle nuove basi.
   → Cambiare `getPopular` in `/most-viewed/`, `getLatestUpdates` in `/most-recent/`, e il filtro "Ordine"
   in: Recenti `/most-recent/`, Più visti `/most-viewed/`, Più votati `/top-rated/`, Più commentati
   `/most-discussed/`, Più lunghi `/longest/`.
2. **La ricerca restituisce 0 risultati.** `/search/<q>/` esiste (titolo "Search: sissy") ma nella risposta
   statica non ci sono link `/video/` (solo card dei channel). Il sito offre anche `/search/<q>/newest/`,
   `/search/<q>/rating/`, `/search/<q>/views/`. **Da indagare**: forse i risultati arrivano via JS/AJAX
   o con un markup diverso. Guardare la pagina di ricerca nel browser / gli script.
3. **Le categorie (channels) mostrano gli stessi video?** Verificato: `/channels/11/hypnosis/` e
   `/channels/37/audio/` danno risultati diversi da `/videos/`, ma con molti video in comune (stesso ordine
   per data). Probabilmente il percorso è giusto; ricontrollare dopo aver sistemato l'ordine.
4. **Avviso "1 chapter(s) couldn't be auto-numbered"**: in `getDetail` il capitolo si chiama
   `"Guarda il video"`. Rinominarlo `"Episodio 1"`.
5. **Tra i generi della scheda compare "Categories"** (link di menu): filtrare i link `/channels/` del menu,
   tenendo solo quelli del video (o escludere testi come "Categories").

Dopo le modifiche: `version` → `1.0.1` in `src/hypnotube.js` **e** in `anime_index.json`.

### PMVHaven — ⚠️ DA SISTEMARE
API pubblica (nessun login) — endpoint verificati:
- Lista: `GET /api/videos?sort=<s>&page=N` → `{ videos, pagination:{hasNext,totalPages} }`, 32 per pagina
  - ordinamento con prefisso `-` = decrescente: Popolari `sort=-views`, Recenti `sort=-uploadDate`
- Ricerca: `GET /api/videos/search?q=<testo>&page=N` (funziona, paginata, 20 per pagina)
- Singolo video: `GET /api/videos/<id>` → `{ data: {...videoUrl, tags, ...} }`
- Tag popolari: `GET /api/tags/popular` (70 tag)
- I POST sono bloccati (401); `/api/search`, `/api/categories` danno 401 — non servono.

Bug segnalati dall'utente:
1. **Filtrare per tag restituisce sempre gli stessi video.** Con `?tags=<tag>` il `pagination.total` cambia
   (es. blowjob 21354, bdsm 833) ma l'ordine dei primi risultati sembra uguale al default. **Da verificare**:
   confrontare gli `_id` dei risultati con e senza `tags=`; provare ad aggiungere anche `sort=-uploadDate`
   o `sort=-views`; se `tags=` non filtra davvero, usare la ricerca `/api/videos/search?q=<tag>` come ripiego.
2. **Aggiungere al filtro "Categoria" in cima tre voci principali che funzionino:** `gooning`, `Blackedraw`,
   `poppers`. Verificare per ciascuna quale chiamata dà risultati pertinenti (`?tags=` oppure ricerca `q=`)
   e usare quella.
3. Il capitolo si chiama `"Guarda il video"` → rinominare `"Episodio 1"` (stesso avviso di HypnoTube).

Dopo le modifiche: `version` → `1.0.2` in `src/pmvhaven.js` e in `anime_index.json`.

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
3. **HypnoTube** e **PMVHaven** "fatti bene", con categorie, tag, filtri, ricerca funzionante,
   recenti e popolari — **in corso, vedi bug sopra**.
4. Su PMVHaven: categorie principali in evidenza nel filtro: **gooning, Blackedraw, poppers**.

## Altro progetto nello stesso repo (contesto)

- Branch `main` / `hentai-zone-dev` / `hentai-ita-dev` / `hentai-archive-dev`: estensioni Keiyoushi
  (Mihon/Tachimanga) pubblicate su `https://raw.githubusercontent.com/adam72881/it-ext-repo/repo/index.min.json`.
- PR a Keiyoushi `keiyoushi/extensions-source#20586` (Hentai Zone + Hentai ITA): CI verde, in attesa di review.
