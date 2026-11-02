# Passaggio di consegne — Mangayomi Anime Extensions (repo `adam72881/mangayomi-anime-extensions`, branch `main`)

Stato al 1 novembre 2026, app **Mangayomi v0.9.95**. Continuare dai file in `src/`, non riscriverli.
AnimeWorld e HentaiWorld non si toccano. Niente bypass di Cloudflare o anti-bot, niente User-Agent diverso da quello già nel file, niente filtri che escludono contenuti.

Novità di ogni versione: [CHANGELOG.md](CHANGELOG.md).

URL da incollare in Mangayomi (Impostazioni → Browse → repository anime):

```
https://raw.githubusercontent.com/adam72881/mangayomi-anime-extensions/main/anime_index.json
```

Ogni modifica a un `.js` alza `version` sia in `mangayomiSources` del file sia in `anime_index.json`. Commit e push diretti su `main` di questo repo.

User-Agent fisso di HypnoTube e PMVHaven: iPhone Safari 17.

## Versioni

| File | Sorgente | Versione |
|---|---|---|
| `src/animeworld.js` | AnimeWorld (animeworld.ac) | 1.2.0 |
| `src/hentaiworld.js` | HentaiWorld (hentaiworld.me) | 2.2.0 |
| `src/hypnotube.js` | HypnoTube (hypnotube.com) | 1.2.1 |
| `src/pmvhaven.js` | PMVHaven (pmvhaven.com) | 1.4.2 |

## Limiti di Mangayomi v0.9.95

- In `manga_details_view.dart` l’autore è solo testo, senza `onTap`. Non si può aprire la sua lista toccando il nome.
- Il chip di un genere ha «Browse in source» (`_selectGenre` valore 1 in `manga_info_header.dart`): apre `/mangaHome` con `(source, false)` e **non passa il termine** a `search()`.
- Toccare il titolo apre la ricerca globale, non la ricerca della sorgente.
- `getFilterList()` parte all’ingresso nella sorgente e di nuovo solo con **Reset** (`manga_home_screen.dart`). Il filtro Profili non si aggiorna riaprendo il foglio: serve Reset oppure uscire e rientrare nella sorgente.
- I tab Popolari e Recenti non ricevono i filtri. Tipo, Profili e «Il mio profilo» valgono nella ricerca.
- I cookie della WebView vengono salvati (`MClient.setCookie` in `webview.dart`) e allegati alle richieste dell’estensione. Il `localStorage` no.

## AnimeWorld — 1.2.0, completo

Verificato dall’utente. Ordine (sort 0–7, Più recenti = 5), Stato, Lingua (Sub/Dub ITA), 45 generi. Non modificare.

## HentaiWorld — 2.2.0, completo

- **Ricerca per genere (2.2.0):** `/archive?search=` cerca solo nei titoli (e per sottostringa: «yuri» trova «Ayuri»). Se il testo cercato è uno slug o un nome di `GENRES` e nessun genere è scelto nei filtri, `search()` usa `genre=<slug>` al posto di `search=`. `search` e `genre` insieme danno 0 risultati, quindi non si combinano.

Verificato. Pagine `/archive` con `search=`, `sort=`, `genre=`, `status=`, `language=sub_ita|sub_eng|dub_ita`. Trama da `div.entry > p`, episodi da `#episodes-grid article.episode-item`, mp4 da `videoUrl` in `/watch/`. Non modificare.

## HypnoTube — 1.1.8

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
- **Popular a sorpresa** (impostazione, accesa di default): a `page=1` sceglie un ordine di lista (`/most-viewed/`, recenti, votati, lunghi, settimana, mese, casuale) o, più di rado, un canale in cima al filtro. Non usa la ricerca a 10 secondi. La scelta resta per `page>1`; alla riapertura (`page=1`) ne esce un’altra. Spento, Popolari torna a `/most-viewed/`.

## Stato delle schede (Mangayomi 0.9.95)

Mangayomi legge `status` così: 0 in corso, 1 finito, 2 in pausa, 3 cancellato, 4 pubblicazione finita, altro sconosciuto. L'opzione «salta le serie finite» dell'aggiornamento libreria salta solo 1. Video singoli = 1, playlist (PMVHaven, HypnoTube) = 0, AnimeWorld/HentaiWorld dallo stato del sito.

- **HypnoTube qualità (1.1.9):** la pagina video ha `sources: [{src, size}]` per Plyr; senza accesso c'è solo 480 (`_m.mp4`), Plyr dichiara `options: [720, 480]`. `getVideoList` restituisce tutte le sources, la più alta per prima, con fallback su `<source>`.

## Accesso salvato (HypnoTube 1.2.1, PMVHaven 1.4.1)

**Due archivi diversi in Mangayomi:** `new SharedPreferences().get(key)` legge le impostazioni della sorgente (`getSourcePreferences`); `getString/setString` è un archivio interno separato. Utente/password si leggono con `get()` (`settingValue`), la sessione salvata sta in `getString/setString` (`readPref`/`writePref`). In 1.2.0/1.4.0 le credenziali si leggevano con `getString` e risultavano sempre vuote.

Attenzione (Mangayomi `MCookieManager`): se la richiesta ha già un header `Cookie`, l'app **non** aggiunge i cookie della WebView. Quindi il cookie del login salvato va gestito dall'estensione, e senza credenziali non si manda nessun Cookie proprio (PMVHaven) per lasciare valido l'accesso dalla WebView.

- **HypnoTube:** POST `/login` form `ahd_username`, `ahd_password`, `Submit=Login` con `new Client({followRedirects:false})`. Riuscito = 302 verso `/my-profile` + `Set-Cookie: PHPSESSID` (Max-Age 3 giorni), salvato in `hypnotube_session`. Loggato = c'è `href=".../logout"` nella pagina. `getVideoList` rifà il login una volta se la pagina non è da loggato. Verificato su sito vero con un account gratuito: da loggato `sources` ha 480 (`_m.mp4`, 640×360) e 720 (`.mp4`, 1280×720, verificato con ffprobe).
- **PMVHaven:** Better Auth. POST `/api/auth/sign-in/email` JSON `{email, password, rememberMe:true}`; errore = 401 `INVALID_EMAIL_OR_PASSWORD`; successo = cookie `better-auth.session_token` / `__Secure-better-auth.session_token` (+ `session_data`), salvati in `pmvhaven_session`. Login solo da `myProfile` quando `/api/auth/session` non dà un utente. Nessun captcha. Successo **non** verificato con un account vero (verificati solo l'errore e la lettura dei cookie).

## PMVHaven — 1.4.2, profilo confermato da Adam

- **Playlist per categoria (1.4.2):** `/api/playlists/search?q=` cerca nel **nome** della playlist (Elasticsearch, `meta.total`/`hasMore`). Conteggi verificati: blacked 941, gooning 950, poppers 1117, pmv 7141, hypno 1421, sissy 1496, bnwo 1268, stocking 29 (stockings 12), heel 71 (heels 33), lingerie 19. Oltre l'ultima pagina la risposta è vuota: si restituisce lista vuota (prima ripartiva dalle playlist recenti, all'infinito).

- **Qualità (1.3.0):** `/api/videos/{id}` dà `hlsVariants` (playlist .m3u8 per 360p…2160p), `hlsMasterPlaylistUrl` e `videoUrl` (mp4 originale, anche 1–2 GB). `getVideoList` restituisce tutte le varianti + Auto (master) + Originale, con in testa quella della preferenza `pmvhaven_quality` (default 720). Il capitolo ora salva l'id del video, non l'mp4; un URL mp4 vecchio dà solo «Originale».

`tags=` sulla lista non filtra (`gooning` e `poppers` hanno gli stessi id). Categoria, preset e categorie principali usano `/api/videos/search?q=`.

- Sezioni: Tutti (`-releaseDate`), Di tendenza (`trending=true&sort=-views`), Popolare (`-likes`), tag HMV, TikTok, Hypno, Korean BJ.
- Un solo filtro **Ordine** per video e playlist. Video: `-releaseDate`, `releaseDate`, `-bayesianRating`, `-views`, `-likes`, `-duration`, `duration`, Casuale (pagine 1–10). Playlist: `-createdAt`, `createdAt`, `-bayesianRating`, `-views`, `-likes`. Più lunghi sulle playlist usa `-views` e poi ordina la pagina per numero di video; Più corti usa `createdAt` e ordina per il conteggio crescente. Casuale è una pagina a caso tra 1 e 10, e se è vuota torna ai recenti. Non esce una lista vuota.
- Categorie principali: Gooning, Blacked (era Blackedraw: 6 playlist contro 941), Poppers e, in più, **Mai visti**. Mai visti non è una ricerca: nasconde i video già aperti. `getDetail` salva l’id in `SharedPreferences` (`pmvhaven_seen_ids`), ultimi 500, il più recente per primo. Vale nella ricerca, non nei tab Popolari e Recenti, che non ricevono i filtri. In cima a Categoria i termini verificati (PMV, Hypno, Sissy, Egirl, Blonde, BNWO, Caption, Ahegao, Stockings, Heels, Lingerie, e il resto del filtro).
- Preset: Sissy Hypno, Egirl PMV, Lingerie, Chastity, BNWO. Durata minima `durationMin` (10 / 20 / 45 minuti).
- Scheda video: `author` = `uploader` (niente «Di …» in trama). Primo genere `@uploader`, poi 3 `top5Tags` e gli altri tag. Trama con durata, voto like/(like+dislike) e visualizzazioni. Capitolo `Episodio 1` con `thumbnailUrl` http e `dateUpload` solo se è una stringa di cifre (millisecondi). `getVideoList` → mp4.
- Barra `@nome`: `GET /api/videos?uploader=<nome>`, unito all’ordine video (`sort`) quando non è Casuale. Verificato con nightlyload e Interceptor.
- Filtro **Profili**: stessi ultimi 3 di `getDetail`, chiave `pmvhaven_recent_profiles`. Sceglierne uno equivale a `@nome` e usa lo stesso `sort`.
- **Popular a sorpresa** (impostazione, accesa di default): a `page=1` sceglie un ordine dell’API (recenti, vecchi, votati, visti, apprezzati, lunghi, corti, casuale) o, più di rado, una categoria in cima al filtro (`/api/videos/search?q=`). La scelta è salvata e riusata per `page>1`; alla riapertura ne esce un’altra, diversa. Spento, Popolari resta `sort=-views`.
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
4. Push su `main`. In app: Browse → refresh repository → aggiorna la sorgente.
