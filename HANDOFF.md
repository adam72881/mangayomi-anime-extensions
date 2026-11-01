# Passaggio di consegne — moduli Mangayomi (branch `mangayomi`)

Stato al 1 novembre 2026. Continuare dai file in `src/`, non riscriverli.
AnimeWorld e HentaiWorld non si toccano. Niente bypass di Cloudflare o anti-bot, niente User-Agent diverso da quello già nel file, niente filtri che escludono contenuti.

URL da incollare in Mangayomi (Impostazioni → Browse → repository anime):

```
https://raw.githubusercontent.com/adam72881/it-ext-repo/mangayomi/anime_index.json
```

Ogni modifica a un `.js` alza `version` sia in `mangayomiSources` del file sia in `anime_index.json`, altrimenti l'app non scarica il codice nuovo. Commit e push diretti su `mangayomi`.

## Versioni

| File | Sorgente | Versione |
|---|---|---|
| `src/animeworld.js` | AnimeWorld (animeworld.ac) | 1.2.0 |
| `src/hentaiworld.js` | HentaiWorld (hentaiworld.me) | 2.1.0 |
| `src/hypnotube.js` | HypnoTube (hypnotube.com) | 1.1.6 |
| `src/pmvhaven.js` | PMVHaven (pmvhaven.com) | 1.1.5 |

User-Agent fisso, in entrambi i moduli nuovi: iPhone Safari 17.

## AnimeWorld — 1.2.0, completo

Verificato dall'utente. Ordine (sort 0–7, Più recenti = 5), Stato, Lingua (Sub/Dub ITA), 45 generi, tag cliccabili. Non modificare.

## HentaiWorld — 2.1.0, completo

Verificato. Pagine `/archive` con `search=`, `sort=`, `genre=`, `status=`, `language=sub_ita|sub_eng|dub_ita`. Trama da `div.entry > p`, episodi da `#episodes-grid article.episode-item`, mp4 da `videoUrl` in `/watch/`. Non modificare.

## HypnoTube — 1.1.6

### Cosa funziona

- Popolari `/most-viewed/`, Recenti `/most-recent/`. Pagina 2 diversa dalla 1.
- Ordine video: Recenti, Più visti, Più votati, Più commentati, Più lunghi, Più votati della settimana (`/top-rated/week/`), del mese (`/top-rated/month/`), Casuale (una `pageN.html` a caso).
- Categorie in cima al filtro, solo canali che esistono: Music PMV, Hypnosis, Sissy Training, Captions, Chastity, Asian.
- Categorie principali: Gooning = canale `91/gooning`; Poppers e Blackedraw = ricerca del sito.
- Preset: Sissy Hypno (`sissy hypno caption`), Egirl PMV (`egirl`), Lingerie e Tacchi (`lingerie stockings heels`), Chastity (`chastity caption`), BNWO (`bnwo`).
- Durata minima letta da `span.time`. Se il filtro svuoterebbe la pagina, resta la pagina intera.
- Ricerca: POST `searchgate.php` con `q` codificato una sola volta (spazio → `+`). Il server rimanda all'URL, anche con spazi (`/search/videos/sissy hypno caption/`). Se la pagina è l'age-gate, stessa POST JSON del sito (`timeZone`, `languages`) e GET con Referer `searchgate.php`. Pagina N = `pageN.html` con Referer della pagina 1.
- Scheda: `Episodio 1`, generi = primi 3 tag (`div.tags-block`) più `a.link12`. Il menu «Categories» non c'è. Stats in cima alla trama, esempio `Durata 07:04 · Voto 93% · 7.2M visualizzazioni`.
- Playlist: `/playlists/`, Più visti `/playlists/views/`, Più votati `/playlists/rating/`, Casuale una pagina a caso. Scheda `/playlist/<id>/<slug>/` con `Episodio N - titolo` e miniatura se c'è un'immagine http.
- `getVideoList` prende l'mp4 della pagina.
- Scheda: `author` è il nome su `a.name_normal` (es. GoonRitual) e il primo genere è `@nome`. L'autore in app non è cliccabile; se il tag arriva a `search()`, `@nome` apre `/user/<slug>/` (prima ricerca account, type=members).

### Attesa e sessione (1.1.5)

I 10 secondi valgono solo tra due ricerche: il POST di searchgate e il GET della pagina N. Se il sito risponde «Search error», si aspetta 10 secondi e si riprova una volta. Liste, schede, playlist e `getVideoList` non aspettano.

Senza cookie la lista e la scheda arrivano sull'age-gate (HTML «Checking access», zero video). Una POST all'age-gate salva `PHPSESSID` e le chiamate successive lo rimandano: un controllo, poi una GET.

Tempi misurati prima (1.1.4, senza cookie) e dopo (sessione riusata, stessa prova, prima che l'IP venisse limitato):

| Funzione | Prima | Dopo |
|---|---|---|
| getPopular | 1065 ms, 0 video (age-gate) | 1346 ms, 20 video |
| getLatestUpdates | 355 ms, 0 video (age-gate) | 426 ms, 20 video |
| getDetail | 1004 ms, pagina del gate | 686 ms, scheda vera |
| search «sissy» | 10496 ms, 0 video | non rimisurata: vedi problemi aperti |

Una lista aperta subito dopo una ricerca è tornata in 720 ms, senza i 10 secondi. `getVideoList` sulla stessa scheda: 637 ms, mp4 di `media.hypnotube.com`.

### Tolto

- Più lunghi sulle playlist: il sito non ha un URL (`/playlists/` ha solo Newest, Top Rated, Most Viewed). La voce resta l'elenco recenti.
- Capitolo «Simili»: Mangayomi lo riprodurrebbe come episodio. I tag sono generi e, toccati, arrivano a `search()`.

## PMVHaven — 1.1.5

### Cosa funziona

API pubblica, nessun login. `tags=` sulla lista non filtra in modo affidabile (`tags=gooning` e `tags=poppers` hanno gli stessi id). Categoria, preset e categorie principali usano `/api/videos/search?q=`.

- Sezioni video, come le pill della home: Tutti (`sort=-releaseDate`), Di tendenza (`trending=true&sort=-views`), Popolare (`sort=-likes`), tag HMV, TikTok, Hypno, Korean BJ.
- Ordine video: Più recenti `-releaseDate`, Più vecchi, Più votati `-bayesianRating`, Più visti `-views`, Più apprezzati `-likes`, Più lunghi `-duration`, Più corti, Casuale (pagine 1–10: oltre, l'API restituisce liste vuote).
- Categorie principali: Gooning, Blackedraw, Poppers. In cima a Categoria i termini verificati (PMV, Hypno, Sissy, Egirl, Blonde, BNWO, Caption, Ahegao, Stockings, Heels, Lingerie, e gli altri già nel filtro).
- Preset via `q=`: Sissy Hypno, Egirl PMV, Lingerie, Chastity, BNWO.
- Durata minima: `durationMin` in secondi (10 / 20 / 45 minuti).
- Scheda video: `Episodio 1`, trama che inizia con durata, voto like/(like+dislike) e visualizzazioni. `author` è `uploader` e il primo genere è `@uploader` (niente «Di …» in trama: in Mangayomi l'autore è solo testo; il tag, se arriva a `search()`, usa lo stesso filtro). Poi i primi 3 di `top5Tags` e gli altri tag. `getVideoList` → mp4.
- Barra `@nome`: `GET /api/videos?uploader=<nome>`, lo stesso filtro della pagina profilo (`/api/videos?uploader=<id>` dopo `/api/users/by-username/`). Verificato: nightlyload e Interceptor, i primi video sono i loro.
- Playlist: link `/playlists/<id>`. Ordine: Più recenti `-createdAt`, Più vecchi, Più visti `-views`, Valutazione più alta `-bayesianRating`, Più apprezzati `-likes`, Casuale (pagine 1–10). Scheda: una sola richiesta `GET /api/playlists/<id>?page=1&limit=50`, episodi da `data.videoDetails`.

### Controllo righe grigie

236 playlist (recenti, visti, valutazione, pagine avanti), 4880 episodi via `getDetail`: nessun campo rifiutato da Mangayomi. Si salta solo il video senza id. Titolo, trama, generi e autore diventano stringhe; `dateUpload` solo se è una stringa di cifre; `thumbnailUrl` solo se è un URL http.

### Tolto, e perché

- **A-Z e Z-A.** `sort=name` mette nelle prime pagine solo nomi null o fatti di spazi (pagina 1: 24/24 null; pagina 2: metà spazi). Non c'è un modo pulito di mostrarli in fondo senza scartare pagine intere. Le due voci non sono nel filtro.
- **Più video.** Il sito manda `sort=-videoCount`, ma la prima pagina è identica a Più recenti (stessi id, e la prima playlist ha 1 video). Nessun altro parametro ordina per lunghezza. Voce tolta.
- **Raccomandato.** La home lo chiede con `personalizedOnly=true`. Senza login l'API restituisce 0 video. Non è nel filtro.

## Cause trovate

- **`dateUpload` in millisecondi, solo cifre.** In Mangayomi `chapter_list_tile_widget.dart` chiama `dateFormat`, e `lib/utils/date.dart` fa `int.parse`. Una data ISO, un decimale o un oggetto fanno eccezione e Flutter disegna il riquadro grigio su ogni episodio. Il valore va omesso oppure è `String` di un intero (es. `1750423603000`).
- **`fetchAll=true` troppo pesante.** Su una playlist grande (S Tier, migliaia di video) la risposta pesa decine di MB e la scheda va in timeout. La scheda chiede una pagina da 50.
- **Rate limit della ricerca HypnoTube.** Il sito vuole circa 10 secondi tra una ricerca e l'altra. Sotto quella soglia `searchgate` rimanda all'age-gate o risponde «Search error». Un GET diretto di `/search/videos/...` senza il POST del form dà «Search error». Non insistere con molte ricerche dallo stesso IP: il controllo resta su «Checking access» anche dopo decine di secondi.

## Problemi aperti

- La pagina 2 della ricerca HypnoTube non è stata rimisurata in questa consegna: le prove ripetute hanno fatto scattare l'age-gate sull'IP. La sequenza è quella della 1.1.1 (searchgate, poi `pageN.html`), con l'attesa solo tra le due richieste. Da riverificare da una rete pulita, una ricerca e una pagina N, a 10 secondi di distanza.
- Un episodio già salvato nell'app con la data ISO vecchia resta grigio: l'aggiornamento della scheda non riscrive `dateUpload` se il capitolo esiste già. Togliere la serie dalla libreria e riaprirla.
- HypnoTube non ha la data sul video dentro una playlist: quegli episodi non hanno `dateUpload`.
- Casuale, su PMVHaven, non usa `totalPages` dell'API (le pagine alte sono vuote) e pesca solo tra le prime 10.
- I tab Popolari e Recenti dell'app non ricevono i filtri. Il tipo Playlist vale nella ricerca.

## API di Mangayomi (promemoria)

- `getPopular(page)`, `getLatestUpdates(page)`, `search(query, page, filters)` → `{ list: [{name, imageUrl, link}], hasNextPage }`
- `getDetail(url)` → `{ link, description, genre: [], status, chapters }` (status: 0 in corso, 1 finito, 3 cancellato, 5 sconosciuto)
- `getVideoList(url)` → `[{ url, originalUrl, quality, headers }]`
- `getFilterList()` → `SelectFilter` con `state` = indice dell'opzione
- Mangayomi a volte antepone il baseUrl all'URL del capitolo (`https://sito/https://cdn/...mp4`): in `getVideoList` tenere dall'ultimo `http`.
- Un genere toccato arriva a `search()` come testo.
- Il nome capitolo senza numero fa scattare "couldn't be auto-numbered": usare `Episodio 1`.

## Come verificare

1. `node --check src/<file>.js` e `node -e "JSON.parse(require('fs').readFileSync('anime_index.json','utf8'))"`
2. HTTP reale con lo User-Agent del file. Non aggirare Cloudflare e non cambiare User-Agent.
3. HypnoTube: una ricerca, poi almeno 10 secondi prima della successiva. Non ripetere searchgate in raffica.
4. Push su `mangayomi`. In app: Browse → refresh repository → aggiorna la sorgente.
