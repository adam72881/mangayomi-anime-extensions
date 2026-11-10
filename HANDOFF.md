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
| `src/animeworld.js` | AnimeWorld (animeworld.ac) | 1.5.0 |
| `src/hentaiworld.js` | HentaiWorld (hentaiworld.me) | 2.8.0 |
| `src/hypnotube.js` | HypnoTube (hypnotube.com) | 1.4.1 |
| `src/pmvhaven.js` | PMVHaven (pmvhaven.com) | 1.6.0 |
| `src/chaturbate.js` | Chaturbate (dirette) | 1.2.0 |
| `src/stripchat.js` | Stripchat (dirette) | 1.1.0 |
| `src/linkuniversale.js` | Link universale (qualsiasi sito) | 1.4.18 |

## Limiti di Mangayomi v0.9.95

- In `manga_details_view.dart` l’autore è solo testo, senza `onTap`. Non si può aprire la sua lista toccando il nome.
- Il chip di un genere ha «Browse in source» (`_selectGenre` valore 1 in `manga_info_header.dart`): apre `/mangaHome` con `(source, false)` e **non passa il termine** a `search()`.
- Toccare il titolo apre la ricerca globale, non la ricerca della sorgente.
- `getFilterList()` parte all’ingresso nella sorgente e di nuovo solo con **Reset** (`manga_home_screen.dart`). Il filtro Profili non si aggiorna riaprendo il foglio: serve Reset oppure uscire e rientrare nella sorgente.
- I tab Popolari e Recenti non ricevono i filtri. Tipo, Profili e «Il mio profilo» valgono nella ricerca.
- I cookie della WebView vengono salvati (`MClient.setCookie` in `webview.dart`) e allegati alle richieste dell’estensione. Il `localStorage` no.

## Link universale — 1.4.11

Regressione del salvataggio. Dalla 1.1.0 alla 1.4.8 il campo è `linkuni_add_site`. `sites()` — chiamato da `getFilterList` all’ingresso nella sorgente — legge quel testo con `get()` e, se è diverso da `linkuni_last_added`, accoda l’origine (`https://` se manca, slash finale tolto, `originOf` oppure il testo). Il filtro Sito usa proprio quell’elenco restituito. `getSourcePreferences` non chiama `get()`. La 1.4.9 ha spostato la copia dentro `getSourcePreferences` (`takeAddedSites`) e la 1.4.10 ha cambiato la chiave in `linkuni_add_site_v2` e ha scartato gli indirizzi che non passano una regex sull’host: il filtro non riceveva più il sito. Ripristinato il ciclo 1.4.8. Se il campo originale è vuoto si legge ancora `linkuni_add_site_v2`, così un link scritto lì non si perde. I siti già in `linkuni_saved_sites` restano. Prova sul codice: `getSourcePreferences` non chiama `get()`; dopo il conferma sul campo, `getFilterList` ha `https://Nuovo.Example` tra le opzioni di Sito insieme a un sito già salvato. Non è una prova sull’iPhone. La schermata impostazioni già aperta non ricostruisce le voci: era già così nella 1.1.0.

## Link universale — 1.4.10

Salva un sito, di nuovo. Il contratto di Mangayomi v0.9.95, riprodotto senza l'app: una sola istanza JS (`getCachedExtensionService`), `setString`/`setPreferenceSetting` in `dbWriteQueue` (invisibili finché la coda non gira), `findFirst` sulla riga con id più basso, la schermata mostra la riga già salvata e non quella appena calcolata se la chiave esiste. `ShioriSettingRow` mostra al massimo 3 righe; `ShioriValueRow` sulla riga fa vedere solo il sito selezionato, l'elenco si apre toccandola.

Sequenza provata: la prima apertura crea la riga vuota del campo; dopo che quella riga c'è, si scrive `https://Nuovo.Example/video/1/`; si chiude e si riapre. «Sito principale» ha `https://nuovo.example` (prima voce) e il testo «I tuoi siti: nuovo.example»; «I tuoi siti attivi» lo contiene. La schermata già aperta no: è la fotografia di prima del OK (57 voci, senza il sito nuovo). Se il OK viene accodato prima dell'inserimento della riga vuota, Isar tiene due righe e `get()` legge quella vuota: il sito non compare finché non si riscrive il link (aggiorna la prima riga) e si riapre. Il campo è `linkuni_add_site_v2`; se è vuoto si legge ancora `linkuni_add_site`. Nessun `sites()` / `applyRename()` dentro `getSourcePreferences`. Non è una prova sull'iPhone e non si sa quale versione o quale URL avesse Adam.

## Link universale — 1.4.9

Salva un sito: il testo confermato finiva solo nella preferenza `linkuni_add_site` (`EditTextPreference.value`, letto da `getPreferenceValue`). L'elenco `linkuni_saved_sites` si aggiornava dentro `sites()`, chiamato da `getFilterList` / liste. Tornando dalle impostazioni della sorgente già aperta, `manga_home_screen.dart` non richiama `getFilterList` né invalida Popolari: il sito non entrava nell'elenco e riaprendo le impostazioni `getSourcePreferences` leggeva ancora l'elenco vecchio. Ora `getSourcePreferences` copia il testo nell'elenco prima di costruire Sito principale e I tuoi siti attivi, con `_readingPrefs` così un `get()` sulla chiave non ancora salvata non richiama `sites()` né `applyRename`. Un indirizzo tolto non rientra da solo finché non si riscrive. Se è salvato ma senza spunta, il riassunto lo dice. Normalizzazione: schema facoltativo, slash finale, più indirizzi separati da spazio o virgola, stesso host una volta (https se c'è anche http). Gli altri siti già salvati restano.

WebView: `JsExtensionService.sourceBaseUrl` è `source.baseUrl` (v0.9.95 e main), la lista apre solo quello, la scheda apre `baseUrl + link.getUrlWithoutDomain` (percorso, query e frammento). `baseUrl` resta il ponte: cambiarlo in xHamster manderebbe la scheda di un altro sito su xHamster e varrebbe per tutti. `tagLink` aggiunge `&m=<host del sito principale>`. `404.html` porta ancora al contenuto (`#lu=`) e ricorda `m` in `localStorage.lu_main`. `index.html`, se `lu_main` c'è, fa `location.replace` verso quel sito prima dell'elenco. La prima WebView della lista, se `lu_main` non c'è ancora, resta l'elenco: l'app non passa la preferenza e i cookie di `MClient` non sono sulla prima richiesta della WebView.

Immagini: tolta la preferenza `linkuni_image_referer`. `getHeaders` manda solo lo User-Agent. Mangayomi lo chiede una volta con il baseUrl (`getHeaders` in `service.dart`) e lo tiene in `_sourceHeadersCache`: un Referer per sito non esiste. `coverUrl` per `/wp-content/uploads/` resta. Il 10 novembre 2026 `https://jav.guru/wp-content/uploads/2026/11/1start663pl-550x374.jpg` con quello UA è `200 image/jpeg` (51579 byte, `ffd8`).

Categorie: `getFilterList` è sincrono e l'app lo richiama all'ingresso e con Reset, non quando si cambia «Sito». Niente richiesta in più: si leggono i link `<a>` e le coppie JSON `label`/`href` della pagina già scaricata. Vale il gruppo più numeroso con percorso `/categories|category|genre(s)|categorie|generi|c/<nome>` (almeno 3), stesso sito, senza tag, modelle, canali, pubblicità, link esterni. Cache `linkuni_nav` per origine; una home-elenco senza categorie svuota solo quella origine. Il filtro mostra la cache del sito principale. In ricerca, se «Sito» è un altro, l'URL di categoria non si usa. Paginazione: `nextPageOf` più `pageLinkTemplate` con `{#}`. Provato il 10 novembre 2026: xHamster home → 40 categorie (`/categories/…`), la pagina amateur ha la pagina 2; jav.guru home → 7 (`/category/…`), amateur ha `/page/2/`. La home mobile di HellPorno non ha categorie: il filtro non compare. Non è un elenco universale.

## Link universale — 1.4.8

Miniature jav.guru: la lista e la scheda START-663 puntano a `cdn.javmiku.com/wp-content/uploads/...`. Con le intestazioni reali delle copertine (`getHeaders` vuoto: Mangayomi per le estensioni JS non aggiunge uno User-Agent, `custom_extended_image_provider.dart` manda solo quelle intestazioni, e `MClient` aggiunge lo UA solo se ci sono già cookie per quell'host) la risposta è `403 text/html` «Just a moment», non un JPEG. Lo stesso path su `https://jav.guru` con lo User-Agent è `200 image/jpeg` (copertina 95923 byte, `ffd8ff`). Senza User-Agent anche l'origine è HTML. `coverUrl` sposta `/wp-content/uploads/` sull'origine della pagina; `getHeaders` manda lo UA iPhone già usato dalle altre estensioni. Il CDN, anche con UA, da questa rete resta HTML: non si aggira. xHamster con UA iPhone ha ancora ~54 schede e non è una pagina-gate; una pagina «Just a moment» / anti-bot senza elenco ora fa eccezione in `fetchHtml` (`isGatePage`) invece di una lista vuota. `getSourcePreferences` non chiama `get()`. Video jav.guru (1.4.7) invariato.

## Link universale — 1.4.7

`hiddenPlayerUrls`: `iframe_url` in base64 se è un http, e il player che concatena `data-*` e li inverte (`cid`/`base`/`rtype`/`keys`, jav.guru → `searcho/?xr=`). Si seguono come iframe (profondità già 2: la pagina `searcho` costruisce `xr`, il redirect arriva al player, `unpackAll` trova il master `.m3u8`). Verificato il 9 novembre 2026 su START-663: playlist `#EXTM3U` 1920×1080, Referer `jav.guru` accettato. Non si decifra altro e non si aggira Cloudflare. JavGuru in `READY`. `getSourcePreferences` invariato sul divieto di `get()`.

## Link universale — 1.4.6

Aggiunti: `https://bdsmstreak.com` (ricerca `/search?q=`, mp4 su cdn, JPEG) e `https://www.analvids.com` (ricerca `/search/{parola}`, mp4 `ftyp`). `getSourcePreferences` non è stato toccato nel suo divieto: niente `get()`, `sites()`, `applyRename`.

Non aggiunti (9 novembre 2026): Cloudflare o «Checking browser» su MissAV, Supjav, Jable, OneJav, JavDB, JavLibrary, 141jav, javcl, javfull, javgg.net, boundhub, kink.com, hogtied, fetishpapa, hardkinks. Paywall o solo trailer: Brazzers, ManyVids, Clips4Sale, JapanHDV, Jav321 (anteprima DMM). JavGG.com ha il link mp4 ma il file risponde 403. Player solo JavaScript: Javtiful, HPJAV, JavMost, JavHay. jav.guru: indirizzo offuscato, non decodificato. SpankingTube escluso (keyword del sito con «young teen»). PornFidelity escluso (marchio «teen»). Tokyo-Hot: pagina di età e taglio non consensuale. BdsmBoard è un forum, non un tube.

## Link universale — 1.4.5

Aggiunti a `READY`: BravoPorn, HomeMovies (`/search?q=&mode=search&type=videos`), YourAmateur (`searchgate.php?q=`). Prova: schede, due JPEG (`ffd8`), ricerca con la parola nei titoli, mp4 con `ftyp`.

Filtro Categoria: da `linkuni_nav` (riempito alla prima home), solo in ricerca; indice 0 = Tutte. `linkuni_saved_on_<hash>` nasconde i siti salvati senza cancellarli (`linkuni_saved_off`). `diagnose()` nel messaggio «nessun video» e, se Diagnostica è accesa, anche sulla lista vuota. `getSourcePreferences` continua a non chiamare `get()`.

Ricontrollo 9 novembre 2026 (IP Ohio), non tolti: Eporner = muro età di legge; Xozilla = Cloudflare; Porntrex = 403; XXXBunker = Traffic Verification; xnxx home senza schede (`/best` ha i video). Provati e non aggiunti: quasi tutti gli altri candidati sono Cloudflare, non hanno il file in pagina (DrTuber, NuVid, KeezMovies, Porn.com, Porn555, JavHay, JavMost, RealGF) o la ricerca non contiene la parola (xCum, HellMoms, PornPlus 403 sulla ricerca, Fapality il mp4 risponde 410). Hentai aggregatori non aggiunti.

## Link universale — 1.4.4

Crash all'apertura (1.4.2 e 1.4.3): `getSourcePreferences` chiamava `applyRename` → `setting()` → `prefs.get()` → `getSourcePreferenceEntry` → di nuovo `getSourcePreferences` (vedi `extension_preferences_service.dart`: se la chiave non è già salvata, `getPreferenceValue` ricostruisce l'elenco dal codice). Stack overflow, l'app si chiude. `getSourcePreferences` non deve chiamare `get()`, `sites()` né `applyRename`. `applyRename` ha un lucchetto `_readingPrefs` per lo stesso motivo. `getString`/`setString` sono un altro archivio e non richiamano `getSourcePreferences`.

## Link universale — 1.4.3

Siti aggiunti a `READY` dopo prova (home, 2 miniature JPEG, ricerca con la parola dentro i risultati, almeno un mp4/m3u8): AlphaPorno, PornDroids, PornGem, MegaTube, HellPorno, TrendyPorn, AnyPorn, YesPorn (`function/0/`), ThisVid, TokyoMotion (`search_type=videos`, mp4 solo con Referer della pagina), XXXFiles. Sono 50.

Non aggiunti (9 novembre 2026, IP della VM in Ohio): jav.guru (liste e ricerca sì; il player è un token spezzato e rovesciato, non si ricostruisce); Cloudflare/anti-bot su supjav, missav, jable, spankbang, 4tube, xgroovy, fuq, porzo, 4kporn, fullporner, noodlemagazine, gotporn, pornoxo, pornhd, pornwatchers, yourlust, xozilla, sleazyneasy (la ricerca); porntrex e whoreshub 403; porntop embed con `{video_id}`; iceporn senza file in pagina; alotporn la ricerca non filtra; eporner e porndoe mostrano la verifica di legge dell'Ohio (account/blocco), non un pulsante «ho 18 anni». crazyshit.com resta fuori (shock).

## Link universale — 1.4.2

- **Miniature:** `pickImage` assegna un punteggio e scarta segnaposto (`blank-tile`, `placeholder`, `18plus`, svg, classe `size-helper` / `img_18plus`). `data-original` batte il `src` vuoto. `badImageTag` guarda solo `class`, non l'intero tag (se no `placeholder.png` nel `src` scartava anche `data-original`). I riquadri `div.video-thumb` / `thumb-block` / `video-item` / `videobox` si leggono anche quando il titolo e l'immagine non sono nello stesso `<a>`.
- **Età:** `pageIsAgeWall` = testo di verifica (titolo o almeno 3 volte «verify your age» / «verifica dell'età») e meno di 4 schede vere, e la pagina non sembra già un video. Cookie semplice (`document.cookie` / `create_cookie` con nome età e valore `1`/`yes`/`18`) → una richiesta con quell'header. Modulo stesso sito senza password, e-mail o captcha → invio. `hardAgeCheck` (account, e-mail, documento, Yoti, Veriff…) non si tocca: messaggio e WebView. Le schede rimaste con quel titolo si tolgono.
- **KVS:** `video_url` accetta il prefisso `function/0/`. Gli URL con `trailer` si scartano (`NOT_THE_VIDEO`).
- **Ricerca:** il modulo tiene gli `input hidden` e il primo `<option>` delle `<select>` (es. `search_type=videos`).
- **Altro:** `linkuni_quality` (default massima), durata/data da JSON-LD in descrizione, filtro Ordine sulla ricerca, categoria se il nome coincide con un link di categoria visto in home, `linkuni_debug`, rinomina `indirizzo | nome` in `linkuni_names`. crazyshit.com non è in `READY` (shock).

## Link universale — 1.2.1

- **1.4.1 — immagini:** `resolveUrl` codifica i caratteri fuori da ASCII stampabile. `getHeaders()` restituisce `Referer: <sito principale>/` solo con l'interruttore `linkuni_image_referer` (default spento): Mangayomi carica copertine e miniature con le intestazioni della sorgente, calcolate una volta e tenute in memoria (`_sourceHeadersCache` in `utils/headers.dart`), quindi un Referer per sito non è possibile e dopo un cambio serve riavviare l'app. Segnalato dall'utente: miniature grigie su jav.guru (da qui il sito risponde con la verifica Cloudflare, non provabile). Le immagini passano da `MClient` come le richieste dell'estensione.
- **1.4.0 — Webview:** Mangayomi apre nella Webview `source.baseUrl` (lista, errore) oppure `baseUrl + link.getUrlWithoutDomain` (scheda), e per le estensioni JS `baseUrl` è fisso (`sourceBaseUrl` in `javascript/service.dart`). Quindi `baseUrl` = pagina ponte su GitHub Pages, **ramo `gh-pages`** di questo repo (`index.html`, `404.html`, `.nojekyll`): tutti i link che l'estensione dà all'app finiscono con `#lu=<host>` (`tagLink`, tolto da `cleanLink`); l'app apre `<ponte>/<percorso>?<query>#lu=<host>`, GitHub serve `404.html`, che fa `location.replace("https://<host><percorso><query>")` e ricorda l'host in localStorage. `index.html` = elenco dei siti (recenti, poi `READY` copiato a mano: **se cambi `READY`, rigenera `index.html`** con lo script in scratchpad `pages/`). Provato con Playwright.
- **1.3.3:** `pickImage()` ha un ripiego: qualsiasi attributo `data-*|poster|srcset|content` con un'immagine, o `background(-image): url(...)`; vale anche per `<a>` senza `<img>`. Le intestazioni delle immagini in Mangayomi sono fisse per sorgente (`headers.dart`): niente Referer per sito; provato che le miniature dei siti `READY` si scaricano anche senza Referer.
- **1.3.1:** `pickImage()` sceglie tra tutte le `<img>` della scheda la prima non segnaposto (svg, 18plus, logo, blank, data:), attributi lazy prima di `src` (PornDig metteva prima l'icona 18+ con alt «Verify your age»). Nomi ripetuti 3+ volte nella pagina → titolo da un altro link o dallo slug. Copertina scheda: og:image, poi `thumbnailUrl`, `<video poster>`, `poster:`/`preview_url:`. Script `imgcheck.js` in scratchpad controlla immagini/titoli dei siti `READY`. Dall'Italia alcuni siti (Pornhub ecc.) possono chiedere la verifica dell'età: non si aggira, si fa nella WebView.
- **1.3.0:** interruttore `linkuni_random_site` (default spento). `sectionListing` a pagina 1 estrae un sito da `sites()` diverso dall'ultimo (`getString("linkuni_random_pick_<kind>")`), fino a 3 tentativi se errore o lista vuota; le pagine dopo usano quello salvato. La logica per sito è in `siteSection(site, kind, page)`.
- **1.2.3:** PornHat in `READY` è `it.pornhat.com` (provato). crazyshit.com non si aggiunge (sito shock: violenza e incidenti reali).
- **1.2.2:** in `READY` anche fetishshrine, ah-me, perfectgirls.xxx, pornmz, xfreehd (provati). Provati e non vanno: analdin, pornomovies (verifica), fapvid (verifica sui video), yeptube/vivatube (niente video), hclips, vjav, porndoe (solo JavaScript), hotmovs, pornktube (502).

- **1.2.1:** `unpackAll()` scompatta `eval(function(p,a,c,k,e,d)…)` e il testo scompattato si aggiunge all'HTML prima di cercare i video. `declaredCandidates()`: `contentUrl`, `og:video` con percorso tipo /get|stream|video…, e `file|src` dentro `sources:[`, `setup(`, `new Plyr`, `videojs(` anche senza estensione. `embedUrl` e `og:video`/`twitter:player` che sono pagine → letti come iframe. `fetchHtml` riconosce le pagine di verifica (403/503/429, titolo Loading/Just a moment/…, cf-chl, captcha) e chiede di passare dalla WebView (i cookie della WebView vanno all'estensione). Gruppi delle schede: solo i pezzi con una cifra diventano «*» (prima «category», «pornstar», «channel» finivano nello stesso gruppo). I «consigliati» della home si tolgono dai risultati solo se restano almeno 6 schede-video.
- Non si fa: pagine di verifica (si passa dalla WebView), link cifrati apposta (HentaiStream), siti solo JavaScript (txxx, hdzog, tubepornclassic, beeg, PornTube, porntop), DrTuber/Nuvid (`/player_config_json/` risponde `[]`).

## Link universale — 1.2.0

- **Siti già pronti (1.2.0):** costante `READY` ([url, nome]). multiSelect `linkuni_ready_<hash degli url>`, di partenza tutti spuntati tranne quelli in `getString("linkuni_ready_off")` (aggiornato a ogni lettura, così una nuova versione con siti in più non riaccende quelli spenti). `allSites()` = siti propri + pronti accesi; «Sito principale» ha chiave `linkuni_main_<hash di allSites>`.
- **Prove (9 novembre 2026):** script in scratchpad `batch.js <sito> <parola>` (Popolari, Recenti, ricerca, scheda, video). Non vanno: 4tube, noodlemagazine, gotporn, pornoxo, sxyprn, SpankBang, hanime.tv, fux, pornerbros, boundhub, animeunity (403/anti-bot); txxx, hdzog, tubepornclassic, beeg (app JavaScript, la pagina è vuota); DrTuber/Nuvid (video da `/player_config_json/` che risponde `[]`); porntop (embed con `{video_id}` da JavaScript); HentaiStream (link del video cifrato apposta, non si decifra).

- **Siti salvati (1.1.0):** impostazione `linkuni_add_site` (testo). `sites()` aggiunge i link nuovi (solo l'origine) a `getString("linkuni_saved_sites")`, ricordando l'ultimo testo in `linkuni_last_added` per non riaggiungere un sito tolto. Mangayomi salva la preferenza la prima volta e poi non ne aggiorna più le scelte (`getSourcePreferenceEntry`), quindi «Sito principale» (listPreference) e «Togli siti» (multiSelect) hanno chiave `linkuni_main_<hash>` / `linkuni_remove_<hash>` dell'elenco: cambia l'elenco, cambia la chiave. Il principale scelto è copiato in `linkuni_main_site`. `getSourcePreferences()` non chiama `get()`.
- **Popolari/Recenti:** link della home con testo «Più visti / Most viewed / Video migliori / Best / Top rated…» o «Più nuovi / Newest / Latest…» (priorità nell'ordine, esclusi utenti, categorie, album…), in cache `linkuni_sections`; se la pagina non ha schede prova `/best`, `/most-viewed`… o `/new`, `/latest-updates`…; Recenti vuoto → Popolari.
- **Ricerca nel sito:** filtro «Sito». Modulo GET della home con `q|s|k|search|keyword…`, ricerca JS `'/x?key=' + encodeURIComponent`, poi indirizzi comuni (`/search/{q}`, `?s=`, `/video/search?search=`, `?k=`, `/archive?search=`…). Accettato se almeno 2 schede contengono la parola (o 1 su ≤3); salvato in `linkuni_search_patterns`.
- **Schede:** `<a>` con `<img>`; `<article>/<li>` con immagine e link a parte (preferito quello non categoria); JSON nella pagina con `pageURL|url|link` + `title` + `thumbURL|image…` (xHamster). Ordine: prima il gruppo di link più numeroso, poi `SIDE_PATH` (categorie, tag, canali, album…). Titoli deboli («1080p», durate) sostituiti dal testo di un altro link alla stessa pagina. Pagina dopo: `rel=next`, «Next/›/Prossimo», link a pagina+1, oppure `"next":N` nel JSON → `?page=N`; gli href con entità (`&#x3D;`) vengono decodificati.
- **Video:** KVS `video_url`/`video_alt_url*` con `*_text`; AnimeWorld `/play/<serie>/<id>` → `/api/episode/info?id=` (`grabber`). Episodi anche da `data-episode-num` e link con solo il numero sotto la pagina della serie.

- Niente catalogo proprio: `search()` con un URL (anche senza `https://`) legge la pagina. In cima «▶ titolo» se la pagina sembra avere un video (og:type video, `<video>`, iframe di player, mp4/m3u8 trovati, o AnimeSaturn), poi le schede `<a>` con `<img>` dello stesso sito (ultimi due pezzi del dominio). Pagina successiva da `rel=next` o link «›/Next/Successiva», salvata in `getString("linkuni_next_pages")` (chiave `link#pagina`).
- Popolari/Recenti = cronologia (`getString("linkuni_history")`, max 60), scritta da `search` e `getDetail`. Testo senza link = filtro sulla cronologia.
- `getDetail`: og:title/og:image/og:description. Episodi = link «Episodio N / Ep N / …/ep-N» dello stesso sito; se almeno 2 contengono lo slug della pagina tengo solo quelli (altrimenti la home prende episodi di serie diverse); nessuno = un solo episodio «Video» con il link della pagina.
- `getVideoList`: link diretto → subito. AnimeSaturn (`/anime|episode/<serie>/ep-N`): `GET /api/watch/<serie>/ep-N` → `servers[].link` = `play.saturncdn.net/embed/<id>?token=&expires=` → `GET /embed/<id>/playlist?token=&expires=` → `d` = base64 XOR token = mp4 (come fa il loro player). Altrimenti: mp4/m3u8/webm nell'HTML (tolti `\/`), scartando quelli dopo chiavi/attributi immagine o anteprima (`og:image`, `data-mediabook`, `<img src>`, poster…) e gli URL `NOT_THE_VIDEO`; qualità dal nome dell'URL o da quality/label/height nello stesso oggetto JSON; m3u8 con più qualità nel nome = «Auto», messo primo. Poi fino a 8 iframe (niente pubblicità/YouTube) e link a player noti negli script: estrattori integrati di Mangayomi (`doodExtractor`, `streamTapeExtractor`, `voeExtractor`, `filemoonExtractor`, `streamWishExtractor`, `mp4UploadExtractor`, `okruExtractor`…), altrimenti si legge l'iframe (profondità 2).
- Limiti visti: SpankBang 403 (protezione, non si aggira); RedTube/YouPorn solo 360p (le altre qualità passano da `/media/mp4?s=` che vuole i cookie del browser); Eporner un mp4 senza qualità.

## AnimeWorld — 1.2.0, completo

Verificato dall’utente. Ordine (sort 0–7, Più recenti = 5), Stato, Lingua (Sub/Dub ITA), 45 generi. Non modificare.

## HentaiWorld — 2.8.0, completo

- **Raccolta Estremi (2.7.0):** `EXTREME` = bdsm, mind-break, tentacle, inflation, ugly-bastard, gangbang, monster, scat, watersports, horror (2.8.0) (serie per genere circa 89, 64, 139, 35, 113, 272, 196, 26, 110, …; esclusi bondage/x-ray/ahegao, troppo larghi). `extremeListing` legge tutte le pagine di ogni genere (`sort=views`, con stato/lingua del filtro, circa 50 richieste in parallelo), punteggio = somma di 100/serie_del_genere per ogni genere della serie (i rari pesano di più), parità = posizione migliore nei più visti. Cache un giorno in `getString("hentaiworld_extreme_cache")` (chiave con i filtri).

- **Più recente (2.5.0):** `/api/episodes?page=N&per_page=30` (JSON: `episodes[]` con `media_slug`, `media_title`, `thumbnail`, `created_at`), la stessa che usa la home. Una voce per serie; gli slug già mostrati nelle pagine precedenti sono in `getString("hentaiworld_latest_seen")`. `sort=latest` dell'archivio = serie per data di aggiunta, non per ultimo episodio. `getDetail` restituisce `imageUrl` da `og:image` (locandina) per sostituire la miniatura orizzontale.

- **Episodi (2.3.0):** miniatura da `article.episode-item img`; data da `"uploadDate"` (JSON-LD) nella pagina `/watch/<slug>`, letta in parallelo per i primi 24 episodi.
- **Filtri (2.4.0):** `genre[]` e `language[]` multipli = OR (Yuri 189 + Milf 153 → 317 = unione). Nessun parametro per escludere. Anche `status[]`, `year[]`, `type[]` esistono nel modulo del sito.

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

## HypnoTube — paginazione (1.4.1)

«Casuale» (liste, playlist, ricerca): a pagina 1 si sceglie una pagina di partenza e la si salva con `setString` (`hypnotube_list_random`, `hypnotube_playlist_random`, `hypnotube_search_random`, formato `percorso|pagina`), poi pagina N = partenza + N - 1. Lo stato va salvato e non tenuto in memoria perché l'app può ricreare l'estensione tra una pagina e l'altra. Playlist: gli id già mostrati per la stessa lista (`hypnotube_playlist_seen`, chiave `pl|testo|ordine`, ultimi 600) vengono saltati; con ricerca/categoria, pagina > 1 vuota = fine lista (prima ripiegava su `/playlists/` e mescolava).

## HypnoTube — ordini dentro canali e ricerca (1.3.0)

Canale: `/channels/<id>/<slug>/` + `views/`, `rating/`, `longest/` (+ `pageN.html`); `most-viewed/`, `top-rated/` lì sono ignorati. Ricerca: `/search/videos/<q>/` + `newest/`, `views/`, `rating/`, `longest/`; la pagina ordinata va chiesta dopo la pausa di 10 s (`paceSearch`), altrimenti torna vuota. Tabelle `CHANNEL_SORT` e `SEARCH_SORT`. «blacked» al posto di «Blackedraw» (12 video).

## Più recente = novità della home (verificato)

- AnimeWorld 1.5.0: `/updated?page=N` (= «Ultimi Episodi» della home; i link sono agli episodi `/play/<serie>/<ep>`, si tiene `/play/<serie>`, una volta sola anche tra pagine: `getString("animeworld_latest_seen")`). Prima `/filter?sort=5` = serie per data di uscita.
- HentaiWorld 2.5.0: `/api/episodes` (vedi sezione HentaiWorld).
- HypnoTube: `/most-recent/` = «Latest Video Content» della home (stessi video, stesso ordine). PMVHaven: `sort=-uploadDate` e `-releaseDate` danno lo stesso ordine della home.

## AnimeWorld — episodi (1.4.0)

Nessuna data/miniatura nella pagina e nessun server alternativo (oggi solo «AnimeWorld Server»; `alt=1` dà lo stesso file; la sezione `div#download` usata da altre estensioni non esiste più). Date e miniature da AniList: id da `a[href*="anilist.co/anime/"]`, POST `https://graphql.anilist.co` con `airingSchedules(mediaId, sort: EPISODE_DESC, notYetAired: false)` (ultimi 50) e `streamingEpisodes` («Episode N - Titolo», miniature Crunchyroll). Senza dati: copertina `div.thumb img`. Jikan (MyAnimeList) dal container non risponde.

## Stato delle schede (Mangayomi 0.9.95)

Mangayomi legge `status` così: 0 in corso, 1 finito, 2 in pausa, 3 cancellato, 4 pubblicazione finita, altro sconosciuto. L'opzione «salta le serie finite» dell'aggiornamento libreria salta solo 1. Video singoli = 1, playlist (PMVHaven, HypnoTube) = 0, AnimeWorld/HentaiWorld dallo stato del sito.

- **HypnoTube qualità (1.1.9):** la pagina video ha `sources: [{src, size}]` per Plyr; senza accesso c'è solo 480 (`_m.mp4`), Plyr dichiara `options: [720, 480]`. `getVideoList` restituisce tutte le sources, la più alta per prima, con fallback su `<source>`.

## Accesso salvato (HypnoTube 1.2.1, PMVHaven 1.4.1)

**Due archivi diversi in Mangayomi:** `new SharedPreferences().get(key)` legge le impostazioni della sorgente (`getSourcePreferences`); `getString/setString` è un archivio interno separato. Utente/password si leggono con `get()` (`settingValue`), la sessione salvata sta in `getString/setString` (`readPref`/`writePref`). In 1.2.0/1.4.0 le credenziali si leggevano con `getString` e risultavano sempre vuote.

Attenzione (Mangayomi `MCookieManager`): se la richiesta ha già un header `Cookie`, l'app **non** aggiunge i cookie della WebView. Quindi il cookie del login salvato va gestito dall'estensione, e senza credenziali non si manda nessun Cookie proprio (PMVHaven) per lasciare valido l'accesso dalla WebView.

- **HypnoTube:** POST `/login` form `ahd_username`, `ahd_password`, `Submit=Login` con `new Client({followRedirects:false})`. Riuscito = 302 verso `/my-profile` + `Set-Cookie: PHPSESSID` (Max-Age 3 giorni), salvato in `hypnotube_session`. Loggato = c'è `href=".../logout"` nella pagina. `getVideoList` rifà il login una volta se la pagina non è da loggato. Verificato su sito vero con un account gratuito: da loggato `sources` ha 480 (`_m.mp4`, 640×360) e 720 (`.mp4`, 1280×720, verificato con ffprobe).
- **PMVHaven:** Better Auth. POST `/api/auth/sign-in/email` JSON `{email, password, rememberMe:true}`; errore = 401 `INVALID_EMAIL_OR_PASSWORD`; successo = cookie `better-auth.session_token` / `__Secure-better-auth.session_token` (+ `session_data`), salvati in `pmvhaven_session`. Login solo da `myProfile` quando `/api/auth/session` non dà un utente. Nessun captcha. Successo **non** verificato con un account vero (verificati solo l'errore e la lettura dei cookie).

## PMVHaven — 1.6.0, profilo confermato da Adam

**Estremi (1.6.0):** `includeExtreme=true` su `/api/videos` e `/api/videos/search` = solo video con `hasExtremeContent` (2.468; `excludeExtreme=true` li toglie). Si combina con tags/sort/durationMin. `/api/videos/trending` non ha il campo: con Estremi + Di tendenza si usa `/api/videos?sort=-views&includeExtreme=true`.

**Filtri video (1.5.0), verificati sull'API:**
- `/api/videos?tags=X` filtra **solo con `expandTags=false`** (altrimenti allarga ai tag simili e restituisce tutto). Più tag: `tags=a,b&tagMode=AND&expandTags=false`. Con questo tutti i sort funzionano: `-releaseDate`, `releaseDate`, `-bayesianRating`, `-views`, `-likes`, `-duration`, `duration`, e `durationMin`.
- `/api/videos?q=` ignora `q`; `/api/videos/search?q=` cerca nel testo: sort validi `-uploadDate`, `uploadDate`, `-views`, `-likes`, `-bayesianRating`; **la durata non si ordina** (si ordina la pagina). `q` + `tags` insieme: il sito ignora `q`, quindi con un testo vale solo il testo.
- `trending=true` su `/api/videos` è ignorato. Tendenza vera: `/api/videos/trending?period=24h&limit=100` (7d/30d → 500; `page` ignorato).
- Nomi di tag esatti: egirls (non egirl), captions, stockings, high heels. Preset: sissy+hypno, egirls+pmv, lingerie, chastity, bnwo. Playlist: testo in `PLAYLIST_TEXT` (scelto per pertinenza dei nomi).

- **Playlist per categoria (1.4.2):** `/api/playlists/search?q=` cerca nel **nome** della playlist (Elasticsearch, `meta.total`/`hasMore`). Conteggi verificati: blacked 941, gooning 950, poppers 1117, pmv 7141, hypno 1421, sissy 1496, bnwo 1268, stocking 29 (stockings 12), heel 71 (heels 33), lingerie 19. Oltre l'ultima pagina la risposta è vuota: si restituisce lista vuota (prima ripartiva dalle playlist recenti, all'infinito).

- **Qualità (1.3.0):** `/api/videos/{id}` dà `hlsVariants` (playlist .m3u8 per 360p…2160p), `hlsMasterPlaylistUrl` e `videoUrl` (mp4 originale, anche 1–2 GB). `getVideoList` restituisce tutte le varianti + Auto (master) + Originale, con in testa quella della preferenza `pmvhaven_quality` (default 720; «max» = la più alta, aggiunta in fondo alla lista perché l'app salva la posizione della voce scelta). Il capitolo ora salva l'id del video, non l'mp4; un URL mp4 vecchio dà solo «Originale».

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

- **1.4.12 (10 novembre 2026):** `READY` + sexu.com, pornrewind.com. Provati e scartati: fpo.xxx, hdtube.porn, javbangers (lista e miniature sì, i link video rispondono 403/404), mylust (alcune qualità 410), tubev.sex (qualità dubbie 250p/100p), iceporn, javtiful, pornhits, pornxp, pornheed, pornjam, pornburst, xxxvideo.link, porntn (nessun video), bdsmx.tube, javfinder, javmost, vxxx, manysex, sexo.com (lista vuota), 4kporn, fapcat, fuqer, porndish, yourlust (verifica anti-bot), bdsmdoe (502). theporndude.com risponde 403.

- **1.4.13 — attenzione ai test:** da questo ambiente cloud ogni richiesta esce con un IP diverso (6 IP su 6 richieste). I siti KVS (fpo.xxx, javbangers…) legano `get_file` all'IP della pagina, quindi da qui il video risponde 403 ma sul telefono (un IP solo) funziona. Per provarli serve pagina e video sulla stessa connessione: `python3 -I scratchpad/kvs/same_ip.py <host>` (requests.Session, tunnel riusato). Aggiunti fpo.xxx, javbangers, tubev.sex. `NOT_THE_VIDEO` scarta `/vp/<n>/` e `/p320-180.mp4` (anteprime TubeV). Video doppi tolti per URL senza query; `qualityOf` ignora numeri fuori 144–2160. hdtube.porn: 404 anche con lo stesso IP; mylust: link variabili, alcuni 410.

- **1.4.14:** `withLazyList(html,url)`: se ci sono meno di 6 schede «da video» (numero o slug lungo nel link) cerca nello script `fetch('…ajax|load|list|more|page…')`, `$.get`, `axios.get`, fa la richiesta (stesso sito, Referer pagina) e aggiunge l'HTML (JSON → campo html/content/data/items). Usata in `listing` e in `getDetail`. `getDetail`: pagina senza video e con 3+ schede → le schede diventano episodi (categorie, attrici). `videosFromHtml`: attributi `data-embed|src|link|url|video|server|href|player|iframe` in base64 che decodificano in un URL → iframe da seguire (javhd.today: cloudwish.xyz e mycloudz.cc, packer + JW Player → master.m3u8 trovato; da qui il CDN non risponde, IP che cambia). Bandierine: nomi `xx-YY` / `xxxx-YY` e immagini `/flags/` scartati.

- **1.4.15:** `isJavSite(url)` (host con jav, tokyomotion, avhwa, sextb, 7mmtv, missav, supjav, mythav). `getFilterList`: «Sito» = siti non JAV, «Sito JAV» = «— (usa «Sito»)» + siti JAV, sempre state 0. `siteFromFilters`: Sito JAV > 0 vince; poi Sito se state > 0; altrimenti `sites()[0]` (sito principale, anche JAV).

- **1.4.16:** `CATEGORIES` ([nome, parole]) → filtro «Categoria» uguale per tutti i siti (value = indice). `categoryChoice(filters)`; `categoryUrlFor(site, words)`: categorie in cache `PREF_NAV`, poi home e `/categories/` (`noteCategories`), poi link della home con ultimo pezzo = parola (`/big-tits/`, `-12`); nessuna → ricerca della parola; con testo → testo + parola. L'URL della categoria per le pagine dopo è in `PREF_NEXT` (`cat:<sito>|<parola>`). `dropSideCards()` in `listing`: con ≥6 schede non-categoria toglie quelle con `SIDE_PATH`, `isCategoryPath` o percorso di una sola parola-trattino senza query. «Sito» e «Sito JAV» hanno «—» come prima voce (state 0); `siteFromFilters`: JAV > 0, poi Sito > 0 (indice − 1), poi `sites()[0]`. `resolveUrl` corregge `hhttps://`. La vecchia `categoryPick` (URL del sito principale) resta per compatibilità ma il filtro non ne produce più.

- **1.4.17 — velocità:** `fetchPage(url)` tiene in memoria la pagina del video 3 minuti (scheda e player la chiedono a pochi secondi). `getDetail` con un solo episodio = la pagina stessa chiama `startPrefetch(link)` (promessa di `resolveVideos` in `this._prefetch`, 4 minuti); `getVideoList` aspetta quella promessa al massimo 12 s, altrimenti `resolveVideos` da capo. `videosFromHtml`: iframe in parallelo, risultato dopo 1,2 s dal primo player che dà video o comunque dopo 9 s (`setTimeout` esiste in flutter_qjs: `javascript_runtime.dart` `_setupSetTimeout`). `base64Decode`: `charAt` oltre la fine dava `indexOf("") = 0` → caratteri nulli in coda (rompeva i server base64 di javhd.today).

- **1.4.18 (revisione del codice):** `video()` usa `playerHeaders()` = headers + `User-Agent: UA` (in Mangayomi 0.9.95 il player riceve solo `video.headers`: `playback_media.dart` → `Media(url, httpHeaders)`; senza UA mpv manda il suo). `sites()` = memo 1,5 s di `computeSites()`; `debugOn()` memo 3 s. `cardsOf` = memo (ultime 4 pagine, confronto url+html, restituisce copie) di `computeCards`. `categoryUrlFor` = cache 3 giorni in `getString("linkuni_cat_urls")` (anche risultato vuoto) di `findCategoryUrl`. `searchUrl`: moduli insieme, poi gruppi di 4 in parallelo. `siteSection`: `kindTries` in parallelo. `getWithRetry` (1 nuovo tentativo dopo 700 ms, poi messaggio chiaro) in `fetchHtml`. `normCatUrl` non toglie più la barra finale (causava 404 e ricerca fallita su pornid/pornwhite/fetishshrine/porntrex); listing di categoria in try → ricerca normale. `saturnVideos` JSON protetto. `siteOf` gestisce co.uk/com.co ecc. FapSter tolto da `READY` (rimanda a fhgte.com o 404).

## Chaturbate — 1.0.0 (10 novembre 2026)

- Estensione separata (l'utente la voleva fuori da Link universale). `baseUrl` = chaturbate.com, link relativi `/<nome>/`: la Webview apre la stanza vera.
- Elenco: `GET /api/ts/roomlist/room-list/?limit=60&offset=…` con `genders=f|c|t|m`, `hashtags=`, `keywords=`, `new_cams=true` (Recenti). JSON `rooms[]` (username, img, num_users) e `total_count`. Popolari = genders=f.
- Diretta: `GET /api/chatvideocontext/<nome>/` → `room_status` (public/private/hidden/group/away/offline) e `hls_source` (master llhls.m3u8 con token). 404 = stanza inesistente. Video con Referer, Origin e User-Agent.
- Provato il 10/11/2026: liste, pagine, hashtag, coppie, ricerca, link incollato, scheda, master.m3u8 risponde 200. Stripchat: da qui Cloudflare con captcha già sulla home (403), non provabile.

- **Chaturbate 1.1.0 — account:** login nella Webview (baseUrl = chaturbate.com); i cookie della Webview passano all'estensione (`MClient` → `getCookiesPref`). Seguite: stessa `room-list` con `follow=true` (+ `offline=true`), come fa il sito (`r[showType]=!0`, showType «follow»/«offline» da `followed-cams`). Senza login il sito ignora `follow` e manda la lista normale con `is_following: false` → messaggio «accedi». Preferenza `cb_popular_follow`. Non provato con un account vero.

## Stripchat — 1.0.0 (10 novembre 2026)

- stripchat.com da qui = Cloudflare con captcha (403). **go.stripchat.com/api/models** (API partner) risponde senza Cloudflare: `?limit=60&offset=&tag=<genere>[/<categoria>]&isNew=true` → `models[]` con `username, id, status, viewersCount, snapshotUrl, previewUrlThumbBig, stream{url, urls{240p,480p,original}}`. `tag=girls/<x>` provato per milfs, mature, asian, latin, ebony, white, big-tits, small-tits, curvy, bbw, petite, hairy, squirt, anal, lovense, bdsm. `username=` è ignorato: la ricerca guarda le prime 5 pagine. Link `/<nome>#id=<id>`; la scheda usa la modella vista in lista (< 2 min) o la cerca nelle prime 3 pagine di ogni genere.
- Video: master `edge-hls.saawsedge.com/hls/<id>/master/<id>_480p.m3u8` con righe `#EXT-X-MOUFLON:PSCH:v2:…` (ignorate dal player); la variante `playlistType=standard` ha pezzi mp4 normali, scaricati con 200 `video/mp4`. Non c'è decifratura nel codice.
- Account Stripchat: non fatto (serve l'API del sito principale, dietro Cloudflare: non provabile da qui).

- **Chaturbate 1.2.0:** `countries=IT` della room-list risponde vuoto (total null); `hashtags=italian` sì (11 stanze, il Paese è spesso nascosto). Elenchi filtrati su `current_show === "public"` (tranne seguite offline). Qualità separate non fatte: master LL-HLS con audio in `#EXT-X-MEDIA TYPE=AUDIO` a parte; in Mangayomi 0.9.95 le tracce audio esterne si prendono solo dal primo video (`firstVideoForTracks` = `_firstVid`), quindi una variante da sola resterebbe muta.
- **Stripchat 1.1.0:** `tag=girls/<paese>` provati (italian 17/20 dall'Italia; british, korean, thai ignorati). Due tag insieme (`girls/italian/milfs`, ecc.) = ignorati → Paese ha la precedenza. `watchable()`: status public + stream; sotto girls tolte `maleFemale` se restano ≥ 10; senza Paese/Categoria due pagine API per pagina dell'app. Preferite: GET `/favorites` con i cookie della Webview → `window.__PRELOADED_STATE__`, utente da `data.user`, elenco = array più lungo di oggetti con username+id (non provato, Cloudflare). `streamById(id)`: `edge-hls.saawsedge.com/hls/<id>/master/<id>_auto.m3u8` (provato 200), poi `_480p`, poi doppiocdn.
