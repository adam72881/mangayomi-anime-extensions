# Passaggio di consegne — moduli Mangayomi (branch `mangayomi`)

Stato al 1 novembre 2026, app **Mangayomi v0.9.95**. Continuare dai file in `src/`, non riscriverli.
AnimeWorld e HentaiWorld non si toccano. Niente bypass di Cloudflare o anti-bot, niente User-Agent diverso da quello già nel file, niente filtri che escludono contenuti.

URL da incollare in Mangayomi (Impostazioni → Browse → repository anime):

```
https://raw.githubusercontent.com/adam72881/it-ext-repo/mangayomi/anime_index.json
```

Ogni modifica a un `.js` alza `version` sia in `mangayomiSources` del file sia in `anime_index.json`. Commit e push diretti su `mangayomi`.

User-Agent fisso di HypnoTube e PMVHaven: iPhone Safari 17.

## Versioni

| File | Sorgente | Versione |
|---|---|---|
| `src/animeworld.js` | AnimeWorld (animeworld.ac) | 1.2.0 |
| `src/hentaiworld.js` | HentaiWorld (hentaiworld.me) | 2.1.0 |
| `src/hypnotube.js` | HypnoTube (hypnotube.com) | 1.1.7 |
| `src/pmvhaven.js` | PMVHaven (pmvhaven.com) | 1.1.8 |

## Limiti di Mangayomi v0.9.95

- In `manga_details_view.dart` l’autore è solo testo, senza `onTap`. Non si può aprire la sua lista toccando il nome.
- Il chip di un genere ha «Browse in source» (`_selectGenre` valore 1 in `manga_info_header.dart`): apre `/mangaHome` con `(source, false)` e **non passa il termine** a `search()`.
- Toccare il titolo apre la ricerca globale, non la ricerca della sorgente.
- `getFilterList()` parte all’ingresso nella sorgente e di nuovo solo con **Reset** (`manga_home_screen.dart`). Il filtro Profili non si aggiorna riaprendo il foglio: serve Reset oppure uscire e rientrare nella sorgente.
- I tab Popolari e Recenti non ricevono i filtri. Tipo, Profili e «Il mio profilo» valgono nella ricerca.
- I cookie della WebView vengono salvati (`MClient.setCookie` in `webview.dart`) e allegati alle richieste dell’estensione. Il `localStorage` no.

## AnimeWorld — 1.2.0, completo

Verificato dall’utente. Ordine (sort 0–7, Più recenti = 5), Stato, Lingua (Sub/Dub ITA), 45 generi. Non modificare.

## HentaiWorld — 2.1.0, completo

Verificato. Pagine `/archive` con `search=`, `sort=`, `genre=`, `status=`, `language=sub_ita|sub_eng|dub_ita`. Trama da `div.entry > p`, episodi da `#episodes-grid article.episode-item`, mp4 da `videoUrl` in `/watch/`. Non modificare.

## HypnoTube — 1.1.7

- Popolari `/most-viewed/`, Recenti `/most-recent/`. Pagina 2 diversa dalla 1.
- Ordine: Recenti, Più visti, Più votati, Più commentati, Più lunghi, settimana (`/top-rated/week/`), mese (`/top-rated/month/`), Casuale.
- Categorie in cima, solo canali esistenti: Music PMV, Hypnosis, Sissy Training, Captions, Chastity, Asian. Categorie principali: Gooning = canale `91/gooning`; Poppers e Blackedraw = ricerca.
- Preset: Sissy Hypno, Egirl PMV (`egirl`), Lingerie e Tacchi, Chastity, BNWO. Durata minima da `span.time` (se svuota la pagina, la pagina resta).
- Ricerca: POST `searchgate.php`, `q` codificato una sola volta (spazio → `+`). Se la risposta è l’age-gate, POST JSON del sito (`timeZone`, `languages`) e GET con Referer `searchgate.php`. Pagina N = `pageN.html`. Tra due ricerche passano 10 secondi; «Search error» aspetta 10 secondi e riprova una volta. Liste, schede, playlist e `getVideoList` non aspettano.
- Senza cookie la lista finisce sull’age-gate. Una POST all’age-gate salva `PHPSESSID` e le chiamate dopo lo riusano.
- Scheda: `author` è il nome di `a.name_normal`. Il primo genere è `@nome`. In barra, `@nome` cerca gli account (`type=members`) e apre `/user/<slug>/`. La pagina utente non ha un ordine.
- Generi dopo `@nome`: primi 3 tag (`div.tags-block`) più `a.link12`. Stats in cima alla trama. Capitolo `Episodio 1` con miniatura `og:image` se è un URL http. `getVideoList` → mp4.
- Playlist: `/playlists/`, Più visti `/playlists/views/`, Più votati `/playlists/rating/`, Casuale. Scheda `/playlist/<id>/<slug>/` con `Episodio N - titolo` e miniatura http. Più lunghi non esiste: resta l’elenco recenti. In playlist non c’è una data sull’episodio.
- Filtro **Profili**: `getDetail` salva l’uploader in `SharedPreferences` (`hypnotube_recent_profiles`), ultimi 3, senza doppioni, il più recente per primo. Voce «Nessuno» più quei nomi. Sceglierne uno equivale a `@nome`.

## PMVHaven — 1.1.8, profilo confermato da Adam

`tags=` sulla lista non filtra (`gooning` e `poppers` hanno gli stessi id). Categoria, preset e categorie principali usano `/api/videos/search?q=`.

- Sezioni: Tutti (`-releaseDate`), Di tendenza (`trending=true&sort=-views`), Popolare (`-likes`), tag HMV, TikTok, Hypno, Korean BJ.
- Ordine video: recenti, vecchi, votati `-bayesianRating`, visti `-views`, apprezzati `-likes`, lunghi, corti, Casuale (solo pagine 1–10: oltre sono vuote).
- Categorie principali: Gooning, Blackedraw, Poppers. In cima a Categoria i termini verificati (PMV, Hypno, Sissy, Egirl, Blonde, BNWO, Caption, Ahegao, Stockings, Heels, Lingerie, e il resto del filtro).
- Preset: Sissy Hypno, Egirl PMV, Lingerie, Chastity, BNWO. Durata minima `durationMin` (10 / 20 / 45 minuti).
- Scheda video: `author` = `uploader` (niente «Di …» in trama). Primo genere `@uploader`, poi 3 `top5Tags` e gli altri tag. Trama con durata, voto like/(like+dislike) e visualizzazioni. Capitolo `Episodio 1` con `thumbnailUrl` http e `dateUpload` solo se è una stringa di cifre (millisecondi). `getVideoList` → mp4.
- Barra `@nome`: `GET /api/videos?uploader=<nome>`, unito all’ordine video (`sort`) quando non è Casuale. Verificato con nightlyload e Interceptor.
- Filtro **Profili**: stessi ultimi 3 di `getDetail`, chiave `pmvhaven_recent_profiles`. Sceglierne uno equivale a `@nome` e usa lo stesso `sort`.
- **Tipo = Il mio profilo** (confermato sull’account gloria7288): `GET /api/auth/session`, poi `GET /api/users/{id}/favorites?sortBy=added&sortOrder=desc` e i repost di `GET /api/users/{id}/posts` (`isRepost`). Si uniscono, si tolgono i doppioni per id (`id` o `_id`, anche video annidato) e i più recenti stanno prima. Senza cookie di login la lista dice di accedere dalla WebView. I Mi piace a cuore non hanno un elenco: `/api/videos/{id}/like` è solo il toggle. `/api/user/favorites` non è la lista della scheda profilo.
- Playlist: link `/playlists/<id>`. Ordine: recenti, vecchi, visti, valutazione, apprezzati, Casuale (pagine 1–10). Scheda: `GET /api/playlists/<id>?page=1&limit=50`, episodi da `data.videoDetails`, miniatura http, data in millisecondi. `fetchAll=true` non si usa: su una playlist grande la risposta è decine di MB e va in timeout.
- 236 playlist e 4880 episodi controllati: nessun campo che faccia scattare il riquadro grigio. Si salta solo il video senza id. Una data ISO già salvata nell’app resta grigia finché non si toglie la serie e la si riapre (`dateFormat` fa `int.parse`).

### Tolto

- **A-Z e Z-A.** `sort=name` riempie le prime pagine di nomi null o di soli spazi.
- **Più video.** `sort=-videoCount` restituisce la stessa prima pagina di Più recenti.
- **Raccomandato.** `personalizedOnly=true` senza login restituisce 0 video.

## Come verificare

1. `node --check src/<file>.js` e il parse di `anime_index.json`.
2. HTTP con lo User-Agent del file. Non aggirare Cloudflare e non cambiare User-Agent.
3. HypnoTube: almeno 10 secondi tra una ricerca e la successiva. Non ripetere `searchgate` in raffica.
4. Push su `mangayomi`. In app: Browse → refresh repository → aggiorna la sorgente.
