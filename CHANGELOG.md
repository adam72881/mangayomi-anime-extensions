# Novità

## Stripchat 1.3.16

- Le copertine sono l'anteprima della diretta, non la foto profilo.
- Popolare resta il blocco Featured della home. Più recente resta l'elenco consigli.
- Se i preferiti sono vuoti, il messaggio dice se manca il cookie di sessione. Si prova prima stripchat.com, poi il sito italiano.

## Stripchat 1.3.15

- Popolare è la sezione Featured della home (blocco `topStreamsModels`). Più recente è «Today's Recommendations», l'elenco di `/girls/recommended`.
- I preferiti in diretta usano l'API che il sito apre su `/favorites`, con l'ordine del sito. Non si scartano più se manca il link del video.

## Stripchat 1.3.14

- Popolare, Più recente, ricerca e filtri mostrano solo chi è in diretta pubblica. Le stanze spente o in show privato non compaiono. Resta il filtro da 720p in su.

## Stripchat 1.3.13

- Popolare segue l’ordine della griglia in evidenza, Più recente i consigli. I pulsanti non cambiano nome.
- Dagli elenchi (non dai preferiti) escono solo le stanze con preset da 720p in su. Nel player, se l’HD è uno spot, resta il 480p con la scritta che l’HD è protetto dal sito.
- «Le mie preferite (account)» tiene chi ha stato public, anche se manca il link del video. In privato o in gruppo compaiono solo nell’elenco completo, con lo stato nel nome.

## Stripchat 1.3.12

- «Le mie preferite (account)» mostra solo chi è in diretta e si può aprire. Le altre stanno in «Le mie preferite (anche offline)». Se nessuna è in diretta, il messaggio lo dice.

## Chaturbate 1.3.4

- Tolta la scelta della qualità. La diretta parte sempre dalla più alta che il sito offre, e nel player restano anche le altre, con l'audio collegato. Se l'elenco delle qualità non si legge, si usa un link nuovo della diretta.

## Stripchat 1.3.11

- **Preferiti:** se la Webview è loggata ma l'elenco non esce, il messaggio dice versione, sito, stato HTTP, dimensione della pagina, se l'utente c'è, se c'è il token, e solo i nomi dei cookie (mai i valori). Su iPhone Mangayomi copia quei cookie solo quando cambia l'indirizzo.
- **Qualità:** le qualità si leggono dall'elenco pubblico del sito. Se la stanza ha il 1080p e il video si apre, parte quello. Se no, accanto a 480p c'è il motivo (la stanza non va oltre, oppure l'HD c'è ma la playlist non si apre, oppure i preset non si sono letti).

## Stripchat 1.3.10

- Tolta l'impostazione «Ho fatto il login: cerca l'HD». Non dava qualità in più: i link dell'account vengono scartati, e l'HD pubblico arriva già da solo.

## Stripchat 1.3.9

- **La diretta non resta più a 480p quando il sito offre di più gratis.** L'elenco pubblico della stanza indica 720p o 1080p per chi trasmette così, e quelle qualità partono per prime. Se il sito offre solo 480p e 240p, resta così. La qualità più alta nascosta, quella che non si apre, non si usa.
- **Preferiti:** il filtro «Le mie preferite» legge l'elenco dall'API del sito, con l'accesso fatto nella Webview. Senza login dice di entrare, invece di un elenco vuoto.

## Stripchat 1.3.8

- **Preferiti:** l'estensione ora legge i dati della pagina. Se il sito non dice chiaramente che hai fatto il login, l'estensione cerca lo stesso le preferite. Se il sito ti vede come ospite, il messaggio mostra come ti descrive, per capire se il login non arriva all'estensione.

## Stripchat 1.3.7

- **Preferiti:** l'estensione leggeva il punto sbagliato della pagina, cioè un pezzo di codice che nomina i dati, invece dei dati veri. Ora cerca il punto in cui la pagina li scrive.

## Stripchat 1.3.6

- Se i preferiti non si leggono, il messaggio ora è più corto e mostra la versione e un pezzo dei dati della pagina, così si capisce cosa sistemare.

## Stripchat 1.3.5

- **Preferiti:** i dati della pagina sono scritti come codice JavaScript compatto, con i nomi dei campi senza virgolette. Ora l'estensione li converte prima di leggerli.

## Stripchat 1.3.4

- **Preferiti:** la pagina dei preferiti ha i dati, ma scritti come codice JavaScript e non come dati puri, e le schede hanno oggetti uno dentro l'altro. Ora l'estensione li legge tutti e due.

## Stripchat 1.3.3

- **La diretta restava a girare con «Ho fatto il login: cerca l'HD» attivo:** per l'account il sito dà una diretta con i pezzi del video nascosti, che il player non può aprire. Ora l'estensione la controlla prima e, se è così, usa la diretta normale.
- **Preferiti:** la pagina del sito non ha più i dati dove li cercavo. Ora l'estensione li cerca anche nei dati sparsi nella pagina e nelle schede delle modelle. Se non li trova, il messaggio dice cosa contiene la pagina, così si può sistemare.

## Stripchat 1.3.2

- **Preferiti:** il sito rispondeva «406» perché la richiesta non diceva di volere una pagina web, come fa un browser. Ora lo dice. Se c'è ancora un errore, il messaggio mostra anche il titolo della pagina ricevuta.

## Stripchat 1.3.1

- **Preferiti dopo il login:** la Webview resta su ita.stripchat.com, mentre l'estensione cercava i preferiti su stripchat.com, dove l'accesso non c'era. Ora prova tutti e due gli indirizzi e ricorda quello che funziona (vale anche per l'HD con l'account).
- I dati della pagina dei preferiti si leggono in modo più robusto. Se non ci riesce, il messaggio dice cosa ha risposto ogni indirizzo.

## Chaturbate 1.3.3

- **La diretta resta a caricare all'infinito:** il link della diretta ora vale per una sola apertura. L'estensione lo apriva per leggere le qualità e al player arrivava già scaduto (errore 403). In **Auto** il link passa intatto al player; con una qualità scelta l'estensione usa i link delle singole qualità, che restano validi.

## Stripchat 1.3.0

- **Molte più categorie** (provate una per una): All'aperto, Da telefono, VR, Giocattoli interattivi, Cam2cam, Privati economici, Over 60, Bionde, More, Rosse, Sedere grande, Atletiche, Tatuate, Piercing, Con gli occhiali, Lingerie, Cosplay, Ufficio, Doccia, Show con l'olio, Balli, Striptease, Fumo, Piedi, Masturbazione, Ditalino, Dildo e vibratori, Pompini, Deepthroat, Doppia penetrazione, Fisting, Ahegao, Sculacciate, Giochi di ruolo, Lesbiche, Sesso di gruppo (oltre a quelle di prima).
- «In evidenza» non è una categoria del sito: è l'ordine normale dell'elenco, cioè **Popolari**.

## Chaturbate 1.3.2

- **Seguite e verifica dopo il login sulla versione italiana**: la Webview finisce su it.chaturbate.com, mentre l'estensione chiedeva tutto a chaturbate.com. Se su un indirizzo il sito chiede ancora la verifica o non riconosce il login, ora l'estensione prova l'altro (chaturbate.com ↔ it.chaturbate.com) e ricorda quello che funziona.

## Chaturbate 1.3.1 / Stripchat 1.2.1

- Dall'Italia i siti chiedono la **verifica dell'età** (obbligatoria per legge: Yoti, Face Scan, AgeKey). Prima l'estensione diceva solo «ha risposto in modo inatteso»; ora spiega cosa fare: tocca **Webview**, completa la verifica, torna indietro e tocca **Riprova**. La verifica non si aggira; il sito la chiede di nuovo dopo un po' di inattività.

## Stripchat 1.2.0

- Nuova impostazione **«Ho fatto il login: cerca l'HD»**. Dopo il login nella Webview, per ogni diretta chiede al sito i dati della stanza con il tuo account (come la pagina della stanza) e, se il sito ti dà qualità più alte (720p, 1080p…), le mette in cima nel player con «· account». Se non te le dà, restano 480p e 240p.
- Usa solo i link che il sito restituisce al tuo account. Non provato con un account vero.

## Chaturbate 1.3.0

- **Impostazione Qualità**: Auto (consigliata), 1080p, 720p, 480p, 360p, 240p.
  - **Auto**: il player prende la più alta (di solito 1080p), come prima.
  - **Una qualità**: parte quella (o la più vicina sotto), e nel player trovi anche tutte le altre, ognuna con l'audio collegato (su Chaturbate l'audio è un flusso a parte).
  - Se una diretta resta muta o si blocca, torna su Auto.

## Chaturbate 1.2.1

- Il nome del video dice la qualità più alta della diretta (es. «Diretta · fino a 1080p»). Il player la sceglie già da solo.

## Stripchat 1.1.0

- **Filtro Paese**: Italiane, Spagnole, Francesi, Tedesche, Rumene, Russe, Ucraine, Colombiane, Brasiliane, Americane, Giapponesi, Cinesi, Indiane, Arabe (provati uno per uno). Non si combina con la Categoria: se scegli un Paese vale quello.
- **Solo dirette che si aprono**: niente stanze senza video nell'elenco. Sotto «Ragazze» niente più coppie mescolate, e ~50 ragazze per pagina.
- **Le mie preferite (account)** in Filtro → Mostra: dopo il login nella Webview legge la pagina dei preferiti del sito. Le preferite in diretta stanno in cima con «●». Non provato con un account vero.
- Il video si trova anche per le modelle poco viste (preferite comprese).

## Chaturbate 1.2.0

- Hashtag **Italiane (#italian)** in cima al filtro (il filtro per Paese dell'API del sito non risponde).
- **Solo dirette che si aprono** negli elenchi (le seguite offline restano tutte).
- Qualità: resta «Auto», che prende già la più alta (720p). Le qualità separate avrebbero il video muto: su Chaturbate l'audio è un flusso a parte.

## Stripchat 1.0.0

- Nuova estensione per le **dirette** di Stripchat, dall'API pubblica per i partner del sito (niente Cloudflare).
  - **Popolari**: le dirette più viste. **Recenti**: le modelle nuove.
  - **Filtri**: Genere (ragazze, coppie, trans, uomini), Categoria (MILF, Asiatiche, Latine, Tette grandi, Squirt, Lovense, BDSM…), Solo nuove.
  - **Ricerca per nome** tra le 300 dirette più viste del genere scelto; incollando il link di una stanza si apre quella.
  - Video in più qualità (originale, 480p, 240p); miniatura = istantanea della diretta.

## Chaturbate 1.1.0

- **Account**: tocca **Webview** (si apre Chaturbate) e fai il login: l'app salva l'accesso.
  - Filtro **Mostra → Le mie seguite (in diretta)** e **(offline)**.
  - Impostazione **Popolari = le stanze che segui**.
  - Senza login lo dice chiaramente invece di mostrare la lista normale.

## Chaturbate 1.0.0

- Nuova estensione per le **dirette** di Chaturbate.
  - **Popolari**: le camgirl in diretta, prima quelle con più spettatori.
  - **Recenti**: le camgirl nuove sul sito.
  - **Ricerca** per parola o nome; incollando il link di una stanza si apre quella.
  - **Filtri**: Genere (ragazze, coppie, trans, uomini, tutti), Hashtag (squirt, milf, asian, lovense, tette grandi…), Solo nuove.
  - La scheda dice se la stanza è in diretta, in show privato o offline; **▶ Diretta** apre il video.
  - **Webview** apre direttamente Chaturbate.

## Link universale 1.4.18

- **Video più affidabili nel player**: il player ora si presenta al server del video come un browser. Prima si presentava come «libmpv», e molti server video lo rallentavano o lo rifiutavano (rotellina infinita).
- **Ricerca riparata su FetishShrine, PornID, PornWhite, Porntrex e simili**: le categorie ricordate perdevano la barra finale dell'indirizzo (es. `/categories/milf/` → `/categories/milf`, che dà «non trovato») e l'errore bloccava tutta la ricerca. Ora l'indirizzo resta com'è e, se una categoria non si apre, si passa alla ricerca normale.
- **Più veloce**:
  - l'elenco dei siti e l'interruttore Diagnostica non si rileggono più dalle impostazioni più volte per ogni azione;
  - le schede di una pagina si analizzano una volta sola (prima fino a 3);
  - il filtro Categoria ricorda per 3 giorni quale pagina usare su ogni sito (o che non c'è): niente più download di home e /categories a ogni ricerca;
  - la prima ricerca su un sito nuovo prova gli indirizzi a gruppi in parallelo invece che uno alla volta.
- **Connessione che salta**: l'estensione riprova una volta da sola; se non va, un messaggio chiaro al posto dell'errore tecnico.
- AnimeSaturn: una risposta strana del sito non blocca più il video.
- Domini come *.co.uk o *.com.co riconosciuti correttamente.
- FapSter tolto dai siti pronti: molti video ora rimandano a un altro sito o non esistono più.

## Link universale 1.4.17

- **Più veloce ad aprire i video**:
  - il video si cerca già mentre guardi la scheda: quando tocchi Guarda di solito è pronto;
  - la pagina del video si scarica una volta sola (prima due: scheda e player);
  - i server del player si aprono tutti insieme; appena uno risponde si aspettano gli altri al massimo 1,2 secondi (prima uno dopo l'altro, fino a ~15 secondi su javhd.today).
- **javhd.today**: ora ci sono tutti e due i server nella lista dei video (mycloudz e cloudwish). Se uno resta a caricare, scegli l'altro dal player.
- Corretto un errore nella lettura dei server scritti in base64: l'indirizzo finiva con caratteri nulli e il server non si apriva.

## Link universale 1.4.16

- **Filtro Categoria per tutti i siti**: le stesse 27 categorie (MILF, Anal, BDSM, Giapponesi, Lesbiche, Tette grandi…) qualunque sito scegli. L'estensione apre la pagina di quella categoria sul sito (xHamster, Eporner, xVideos, Porntrex, YouJizz, javhd.today…); se il sito non ne ha una, cerca la parola. Con un testo nella ricerca, cerca testo + categoria.
- **Solo video nelle liste**: se la pagina ha almeno 6 video, le schede di categorie, attrici e canali spariscono (javhd.today mostrava categorie come «Big Tits» o «Massage» al posto dei video).
- **«Sito» e «Sito JAV» partono entrambi da «—»**: scegline uno e lascia l'altro su «—». Senza scelta vale il sito principale; se scegli in tutti e due vale «Sito JAV».
- Link scritti male dal sito («hhttps://…») corretti.

## Link universale 1.4.15

- **Filtro «Sito JAV»**: i siti JAV stanno in un elenco a parte, sotto «Sito». Scegline uno per cercare lì; lasciato su «—» vale «Sito». Se non tocchi niente si cerca nel sito principale.
- Sono JAV i siti con «jav» nel nome (anche quelli salvati da te, es. javhd.today) più TokyoMotion.

## Link universale 1.4.14

- **Siti che caricano i video dopo** (la pagina arriva vuota e lo script li chiede con una seconda richiesta, es. javhd.today): l'estensione fa la stessa richiesta e mostra i video veri invece delle sole categorie.
- **Aprire una categoria, un'attrice o una ricerca** non dà più «Nessun file mp4/HLS»: la scheda mostra i video che contiene come episodi.
- **Server del player scritti in base64** nella pagina (pulsanti «Server 1 / Server 2»): l'estensione li legge e apre il player del server.
- Niente più bandierine delle lingue («chi-CN», «en-US») tra i video.

## Link universale 1.4.13

- Tre siti pronti in più con i video funzionanti: **FPO.xxx**, **JavBangers** (JAV) e **TubeV**.
- I video di anteprima che partono passando il dito sulle schede (es. «p320-180.mp4») non finiscono più nella lista delle qualità.
- Lo stesso video non compare due volte nella lista, e niente etichette di qualità sbagliate come «100p».
- Niente video pubblicitari tra le qualità (server di pubblicità comuni esclusi).

## Link universale 1.4.12

- Due siti pronti in più, provati con liste, ricerca, miniature e video: Sexu (480p) e PornRewind.

## Link universale 1.4.11

- **Salva un sito torna al flusso che c’era fino alla 1.4.8.** Il campo è di nuovo `linkuni_add_site`. All’ingresso nella sorgente il filtro Sito riceve il sito scritto lì, insieme a quelli già salvati. La 1.4.9 e la 1.4.10 lo copiavano nel modo sbagliato e la 1.4.10 cambiava anche la chiave del campo.
- Un link rimasto nel campo della 1.4.10 viene ancora letto. Miniature, video e il divieto di leggere le preferenze dentro la costruzione delle impostazioni restano.

## Link universale 1.4.10

- **Salva un sito, di nuovo.** Dopo OK la schermata già aperta non cambia: Mangayomi non ricostruisce le altre righe. Si chiudono le impostazioni e si riaprono. Allora «Sito principale» scrive «I tuoi siti: …» e, toccando la riga, il sito è in elenco; «I tuoi siti attivi» lo elenca. Se dopo la riapertura il campo è di nuovo vuoto e il sito non c'è, si riscrive il link e si riapre una volta ancora: l'app può aver tenuto una riga vuota davanti a quella con l'indirizzo.
- Il campo nuovo non cancella i siti già salvati. Quelli della versione precedente, se il campo vecchio li contiene ancora, entrano nell'elenco da soli.

## Link universale 1.4.9

- **Salva un sito.** Confermare il link non aggiornava l'elenco: il testo restava nel campo e «Sito principale» / «I tuoi siti attivi» / il filtro Sito continuavano a leggere la lista vecchia, finché la sorgente non veniva riletta. Ora il link entra nell'elenco quando si riaprono le impostazioni. Rientra nel filtro Sito quando si esce e si rientra nella sorgente (o con Reset). Un indirizzo senza https, con uno slash finale, o ripetuto, conta una volta sola. I siti già salvati non si cancellano. Se il sito c'è ma è nascosto, il riassunto lo dice invece di sembrare non salvato.
- **WebView.** L'app apre sempre l'indirizzo fisso della sorgente: non si può far partire il globo direttamente su xHamster senza rompere la scheda degli altri siti. Quando il sito principale è già stato visto da una scheda, il ponte non mostra più l'elenco e apre quel sito. La scheda di un video resta la pagina di quel video.
- **Immagini.** Tolta l'impostazione «Immagini: presentati come il sito principale». Lo User-Agent c'è sempre; un Referer diverso per ogni sito l'app non lo manda. Le copertine di JavGuru restano quelle del sito, non del CDN.
- **Categorie.** Nel filtro Categoria, dopo aver aperto il sito, compaiono le categorie trovate nella pagina (non un elenco inventato e non quelle di un altro sito). Se la pagina non le ha, il filtro non c'è. Vale per la ricerca: Popolari e Recenti non ricevono filtri. Cambiare «Sito» nel foglio non ricarica le categorie finché non si preme Reset o si rientra.

## Link universale 1.4.8

- **JavGuru: le miniature e la copertina non restano più grigie.** Il sito indica un indirizzo su un altro server che all'app risponde con una pagina HTML, non con una foto. Ora si usa la stessa immagine sul sito stesso, e la richiesta della copertina porta uno User-Agent: senza, Mangayomi riceve di nuovo HTML e la miniatura resta grigia.
- **xHamster e gli altri, dopo la WebView:** se la pagina è ancora una verifica (o solo «serve JavaScript», senza elenco), non esce più «Nessun risultato». Il messaggio dice di completare la verifica nella WebView e toccare Riprova.

## Link universale 1.4.7

- **JavGuru: i video partono nell'app.** Il player è scritto nella pagina in base64 e poi a pezzi invertiti: l'estensione lo ricostruisce, come farebbe il sito, e legge l'HLS (fino a 1080p). Se un server del video chiede Cloudflare o un paywall, quel server si salta; gli altri restano. JavGuru è anche tra i siti pronti.

## Link universale 1.4.6

- Due siti pronti in più, controllati (lista, JPEG, ricerca, mp4): **Bdsmstreak** (BDSM consensuale: femdom, bondage) e **AnalVids** (hardcore). I pronti sono 55.
- I grandi siti JAV (MissAV, Supjav, Jable, JavBus, OneJav…) da questa rete sono dietro Cloudflare, paywall o un player senza file in pagina. Non sono stati aggiunti e non è stato decodificato nulla. jav.guru resta fuori dai pronti: le liste si aprono, il video no.

## Link universale 1.4.5

- Tre siti pronti in più, controllati (lista, miniature JPEG, ricerca, mp4): BravoPorn, HomeMovies, YourAmateur. Ora sono 53.
- **Categoria** nella ricerca: dopo aver aperto il sito almeno una volta, nel filtro compaiono le categorie della home. «Tutte» lascia la ricerca com'è; sceglierne una e cercare senza testo apre quella lista.
- **I tuoi siti attivi**: togli la spunta per nasconderli senza cancellarli. Il preferito resta «Sito principale».
- Se manca il video o, con Diagnostica accesa, la lista è vuota, il messaggio dice il motore riconosciuto (KVS, WordPress, xVideos, JSON).
- Ricontrollo dei 50 precedenti, da questa rete: Eporner mostra la verifica età dell'Ohio, Xozilla è Cloudflare, Porntrex risponde 403, XXXBunker una pagina «Traffic Verification», la home di xnxx non ha schede (le liste /best sì). Non li ho tolti: sul telefono, se uno resta vuoto, togli la spunta.

## Link universale 1.4.4

- Corretto: aprendo Link universale l'app si chiudeva. Era un ciclo nelle impostazioni introdotto con la 1.4.2. Miniature, verifica dell'età e siti pronti restano quelli della 1.4.3.

## Link universale 1.4.3

- 11 siti già pronti in più, controllati (lista, miniature, titoli, ricerca e video): AlphaPorno, PornDroids, PornGem, MegaTube, HellPorno, TrendyPorn, AnyPorn, YesPorn, ThisVid, TokyoMotion, XXXFiles. Ora sono 50.

## Link universale 1.4.2

- **Miniature.** Se la scheda ha prima un riquadro vuoto o l'icona «18+» e poi la foto vera, ora esce la foto. Vale anche per le immagini in `data-original` e per i siti che mettono il titolo e la miniatura uno accanto all'altra.
- **Verifica dell'età.** Non compaiono più schede intitolate «Verify your age». Se la pagina è solo la conferma «ho 18 anni» (un cookie o un modulo dello stesso sito, senza captcha), l'estensione la supera. Se invece chiede account, e-mail o un documento, lo dice e non la aggira: si fa dalla WebView.
- **Qualità preferita** nelle impostazioni: parte quella, se il video ce l'ha.
- Nella scheda, **durata e data** quando il sito le scrive.
- Nella ricerca, filtro **Ordine** (più recenti, più visti, più votati, più lunghi) se il sito ha quella lista. Scrivere il nome esatto di una categoria apre la categoria.
- **Rinomina un sito** (`indirizzo | nome`). Il sito di Popolari e Recenti resta «Sito principale».
- **Diagnostica** (spenta): sul titolo si vede come è stata letta la pagina.

## Link universale 1.4.1

- Immagini con spazi o caratteri speciali nell'indirizzo: ora vengono codificate e si caricano.
- Nuova impostazione **Immagini: presentati come il sito principale** (spenta di partenza): per i siti che danno le miniature solo alle proprie pagine. Vale per un sito alla volta; dopo averla accesa o dopo aver cambiato sito principale va chiusa e riaperta l'app.

## Link universale 1.4.0

- **Webview apre il sito giusto**, non più DuckDuckGo:
  - dalla scheda di un video, **Webview** apre quel video sul suo sito;
  - dalla lista o da una schermata di errore, **Webview** apre l'elenco dei siti (quelli aperti di recente in cima, poi i siti pronti e una casella per scrivere un indirizzo).
- Serve per superare la verifica dell'età o anti-bot: falla nella Webview, torna indietro e tocca Riprova.
- I video salvati in libreria con le versioni precedenti continuano a funzionare; per avere Webview sul sito giusto vanno riaperti dalla lista.

## Link universale 1.3.3

- Miniature anche sui siti che non usano una normale immagine: sfondo CSS (`background-image`), attributi `data-…`, `poster`, `<source srcset>`.

## Link universale 1.3.2

- Titoli puliti: niente più codici come «&colon;» o «&lpar;» al posto di due punti e parentesi (PornOne).

## Link universale 1.3.1

- **Immagini e titoli delle liste**: su alcuni siti (PornDig) al posto della miniatura usciva l'icona «18+» e come titolo «Verify your age». Ora prende la miniatura vera, saltando segnaposto, loghi e icone, e il titolo vero. Le etichette ripetute su tante schede («SHORTS», «In process») vengono sostituite dal titolo.
- **Copertina nella scheda** anche quando il sito non la dichiara: usa l'immagine del player.

## Link universale 1.3.0

- Nuova impostazione **Sito a sorpresa**: a ogni apertura Popolari e Recenti mostrano un sito a caso tra quelli attivi (i tuoi e quelli pronti spuntati), mai lo stesso due volte di fila. Scorrendo si resta sullo stesso sito. Se il sito estratto non risponde ne prova un altro.

## Link universale 1.2.3

- Tra i siti già pronti PornHat ora è la versione italiana (it.pornhat.com), con i titoli in italiano.

## Link universale 1.2.2

- Altri 5 siti già pronti: FetishShrine (fetish e BDSM), Ah-Me, PerfectGirls, PornMZ, xFreeHD. Ora sono 39.

## Link universale 1.2.1

- Regole generali più ampie per i siti mai provati: player «compressi» (packer), video dichiarati nella pagina (`contentUrl`, `embedUrl`, `og:video`), sorgenti di JW Player / Video.js / Plyr anche senza «.mp4» nel nome, iframe caricati in ritardo.
- Sito con verifica anti-bot (pagina «Loading…», «Just a moment», errore 403/503): il messaggio dice di aprire il sito una volta nella WebView di Mangayomi e superare la verifica; poi l'estensione usa gli stessi cookie.
- Ricerca: i link a pornostar, canali e categorie non finiscono più sopra i video (YouPorn, Tube8); niente feed RSS tra i risultati.

## Link universale 1.2.0

- **Impostazioni → Siti già pronti**: 34 siti provati uno per uno (lista, ricerca e video), già attivi: Pornhub, xHamster, xVideos, xnxx, Eporner, Porntrex, HQporner, PornDig, PornOne, Xozilla, PornHat, TNAFlix, EMPFlix, YouJizz, AnySex, 3movs, SunPorno, SexVid, PornID, OK.xxx, PornWhite, xBabe, Fapster, PornGo, Porn300, XXXBunker, ZBporn, BravoTube, YouPorn, RedTube, Tube8 (questi ultimi cinque solo 360p), AnimeSaturn, AnimeWorld, HentaiWorld. Togli la spunta a quelli che non vuoi.
- **Sito principale** si sceglie tra tutti, anche quelli pronti.
- Ricerca più precisa: legge anche i moduli con l'indirizzo pronto (`/search/%QUERY%/`), il campo «what» e gli indirizzi tipo `/videos/s=`; scarta la home ripetuta e toglie dai risultati i «consigliati» della home.
- Liste: prima il gruppo di link che sembrano video; niente link «Deutsch»/cambio lingua né la pagina stessa; titoli «Screenshot…» sostituiti dal titolo vero; anteprime `/tmb/` scartate.

## Link universale 1.1.0

- **Impostazioni → ➕ Salva un sito**: scrivi il link della pagina principale di un sito e lo trovi nell'elenco. **Sito principale** sceglie quello di Popolari e Recenti; **Togli siti** li elimina.
- **Popolari** e **Recenti** usano le liste «Più visti» e «Più recenti» del sito (trovate da sola), altrimenti la home.
- **Ricerca** con una parola: scegli il sito nel filtro **Sito**, l'estensione scopre da sola come cerca quel sito (e lo ricorda).
- Liste più pulite: prima i video, poi categorie, tag, album; niente pubblicità e redirect; titoli veri al posto di «1080p».
- Legge anche le liste costruite con JavaScript (xHamster), le schede «a riquadro» (HentaiWorld), i player KVS con le qualità (Porntrex e simili) e gli episodi di AnimeWorld.

## Link universale 1.0.0

- Nuova sorgente **Link universale**: incolla nella ricerca il link di un video, di una serie o di un sito.
  - Trova il video nella pagina: mp4 e HLS diretti (con la qualità), player in iframe, e i player esterni che Mangayomi sa già leggere (Dood, StreamTape, Voe, Filemoon, StreamWish, Mp4Upload, ok.ru…). Salta anteprime e miniature animate.
  - **AnimeSaturn**: episodi della serie e video dal player del sito.
  - Link di un sito: lista dei video/serie della pagina, con le pagine successive.
  - I link aperti restano in **Popolari**.

## PMVHaven 1.6.0

- Nuova voce **Categorie principali → Estremi**: solo i video che il sito stesso segna come «contenuto estremo» (circa 2.470). Funziona con tutti gli ordini, con Categoria, Sezione, Preset, Durata minima e con la ricerca per testo. Con «Di tendenza» mostra gli estremi più visti. Tra le playlist cerca quelle con «extreme» nel nome.

## HentaiWorld 2.8.0

- **Raccolta → Estremi** ora include anche **Watersports** e **Horror** (dove stanno i classici più violenti come Shion, Bible Black, Violence Gekiga). In cima: Tsuma Netori, Naedoko Demon's Ground, Kisaku Spirit, Juurin Oukoku, Shion, Kazama Mana, Goblin no Suana, Bondage Game…

## HentaiWorld 2.7.0

- **Raccolta → Estremi** ora ha anche **Scat**, ed è una **classifica**: prima le serie con più generi estremi insieme, e i generi più rari pesano di più (Scat vale molto più di Gangbang). In cima finiscono titoli come Tsuma Netori, Kisaku Spirit, Bondage Game, Night Shift Nurses; Euphoria è a inizio seconda pagina.
- Si combina con **Lingua** e **Stato**. La prima apertura richiede qualche secondo (legge le liste dei generi), poi il risultato resta per un giorno.

## HentaiWorld 2.6.0

- Nuovo filtro **Raccolta → Estremi**: BDSM, Mind Break, Tentacle, Inflation, Ugly Bastard, Gangbang e Monster insieme, dai più visti. Si combina con lingua, stato, ordine e altri generi.

## AnimeWorld 1.5.0

- **«Più recente» come «Ultimi Episodi» della home del sito**: gli anime nell'ordine dei loro episodi più nuovi, una volta sola ciascuno (anche scorrendo). Prima erano gli anime ordinati per data di uscita, e non combaciavano con la home.

## HentaiWorld 2.5.0

- **«Più recente» come la home del sito** («Episodi usciti recentemente»): le serie nell'ordine dei loro episodi più nuovi, una volta sola ciascuna. Prima erano le serie ordinate per data di aggiunta al sito, e non combaciavano.
- Nella lista c'è la miniatura dell'ultimo episodio, come sul sito; aprendo la scheda la copertina diventa la locandina della serie.

## HypnoTube 1.4.1

- **Niente più doppioni scorrendo le playlist.** Le playlist già mostrate non si ripetono (il sito ne aggiunge di nuove mentre scorri e quelle viste scivolano alla pagina dopo).
- **Ordine Casuale** (playlist, video e ricerca): a ogni apertura parte da una pagina a caso e poi va avanti in ordine. Prima ogni pagina ne pescava un'altra a caso e ricomparivano le stesse.
- Playlist con ricerca o categoria: se il sito non risponde a una pagina successiva la lista finisce lì, invece di mescolare le playlist generali ai risultati.

## PMVHaven 1.5.2

- **Qualità preferita**: si possono scegliere anche **2160p (4K)** e **1440p (2K)**. Se il video non le ha, parte la più alta disponibile sotto quella scelta.

## PMVHaven 1.5.1

- **Qualità preferita → «Massima disponibile (fino a 4K)»**: parte sempre la qualità più alta del video (2160p, 1440p…).
- Nel player le qualità sopra il 1080p si chiamano **2160p (4K)** e **1440p (2K)**.
- Corretto: senza scelta la qualità predefinita era 480p invece di 720p.

## AnimeWorld 1.4.0 · HentaiWorld 2.4.0 · HypnoTube 1.4.0

- **Date e miniature degli episodi.** HentaiWorld: miniatura e data di uscita vere per ogni episodio. AnimeWorld: data di uscita da AniList (anime recenti), e per molti anime già finiti anche titolo e miniatura dell'episodio; dove mancano, la copertina.
- **HentaiWorld: generi e lingue a spunta.** Puoi sceglierne più di uno (es. Yuri + Milf, oppure Sub ITA + Dub ITA): escono le serie che ne hanno almeno uno. Il sito non permette «tutti insieme» né di escludere un genere.
- **HypnoTube: Qualità preferita** (720p o 480p) nelle impostazioni della sorgente.
- AnimeWorld: i server alternativi (Streamtape, Filemoon…) non si possono aggiungere: il sito oggi offre solo il suo server.

## PMVHaven 1.5.0 · HypnoTube 1.3.0 · AnimeWorld 1.3.0

**PMVHaven**
- **Sezioni HMV, TikTok, Ipnosi, BJ coreano**: ora mostrano davvero quei video. Prima il sito ignorava il tag e, per esempio, HMV + Più visti dava la classifica generale.
- **Categorie e preset** filtrano per tag del sito, quindi **tutti gli ordini funzionano** (più visti, più lunghi, più corti, voti…). Categoria principale, Categoria, Sezione e Preset si sommano (es. Gooning + Blonde).
- Tag corretti: Egirl, Caption, Stockings e Heels ora trovano i video (prima 0–47 risultati).
- **Di tendenza**: usa la vera tendenza del sito (ultime 24 ore, 100 video) e rispetta l'Ordine scelto.
- Nuova voce **Ordine → Predefinito**: l'ordine naturale della sezione (tendenza, popolare, recenti).
- Ricerca per testo: le date ordinano bene; «Più lunghi/Più corti» ordinano la pagina (il sito non ordina la ricerca per durata).
- Playlist: parole di ricerca più pertinenti (es. Egirl PMV 38 su 40 pertinenti invece di 1 su 40).

**HypnoTube**
- L'**Ordine** ora vale anche dentro canali, categorie principali, ricerca e preset (prima era ignorato). Nella ricerca un ordine diverso da Predefinito aggiunge circa 10 secondi, per non farsi bloccare dal sito.
- **Blackedraw → Blacked**: da 12 video a circa 22 pagine.
- Nuova voce **Ordine → Predefinito** (ricerca per pertinenza, liste per recenti).

**AnimeWorld**
- Cercando il nome di un genere (es. «azione», «isekai») si apre il genere: prima «azione» trovava 4 anime.

## PMVHaven 1.4.2

- Categoria **Blackedraw → Blacked**: in Playlist da 6 a 941 risultati (40 pagine), nei video da 621 a 8734.
- **Stockings** e **Heels** cercano «stocking» e «heel»: più risultati sia nelle playlist sia nei video.
- Playlist: arrivati in fondo ai risultati la lista si ferma, invece di ricominciare con le playlist recenti che non c'entravano.

## HentaiWorld 2.2.0

- **Ricerca per genere**: se scrivi il nome di un genere (es. «yuri», «big boobs», «milf») si apre tutto quel genere, non solo i titoli che contengono la parola. Prima «yuri» trovava 1 titolo, ora tutte le serie Yuri (10 pagine). Ordine, stato e lingua scelti nei filtri restano validi.

## HypnoTube 1.2.1 · PMVHaven 1.4.1

- Corretto: utente/email e password scritti nelle impostazioni della sorgente non venivano letti, quindi l'accesso salvato non partiva.

## HypnoTube 1.2.0 · PMVHaven 1.4.0

- **Accesso salvato** nelle impostazioni della sorgente (campi utente/email e password). L'estensione entra da sola quando serve e tiene la sessione; se la sessione scade rientra da sola.
- **HypnoTube**: con l'accesso (basta l'account gratuito) arriva il **720p vero** (1280×720) oltre al 480p (che in realtà è 640×360). Se l'accesso non riesce, il video parte lo stesso e la qualità lo segnala.
- **PMVHaven**: l'accesso serve per **Tipo → Il mio profilo** (preferiti e repost) senza passare dalla WebView.
- Campi vuoti = tutto come prima (vale l'accesso fatto nella WebView).
- La password resta solo sul telefono, nelle impostazioni di Mangayomi, in chiaro: usane una che non usi altrove.

## HypnoTube 1.1.9 · PMVHaven 1.3.1

- **Playlist «in corso»**: con la nuova opzione di Mangayomi «salta le serie finite», le playlist vengono comunque aggiornate e ricevono i video nuovi. I singoli video restano «finiti» e vengono saltati.
- **HypnoTube**: legge tutte le qualità che manda il sito, dalla più alta. Senza accesso il sito dà solo 480p; se con il tuo account compare il 720p, puoi sceglierlo nel player.

## PMVHaven 1.3.0

- **Scelta della qualità**: 1080p, 720p, 480p, 360p (anche 1440p/2160p quando il sito le ha), Auto e Originale mp4.
- Nuova impostazione **Qualità preferita** (di default 720p): è quella che parte quando apri un video.
- Niente più caricamenti continui: le qualità HLS caricano il video a pezzi invece di scaricare l'mp4 originale (spesso centinaia di MB).
- I video aggiunti alla libreria con le versioni precedenti mostrano solo l'Originale finché non aggiorni la scheda (trascina giù).

## Riorganizzazione (1 novembre 2026)

- Le estensioni hanno un repo tutto loro: **mangayomi-anime-extensions** (prima erano nel ramo `mangayomi` di `it-ext-repo`).
- Nuovo indirizzo per Mangayomi: `https://raw.githubusercontent.com/adam72881/mangayomi-anime-extensions/main/anime_index.json`.
- Nessun cambiamento alle sorgenti: stesse versioni.

## PMVHaven 1.2.0

- Un solo filtro **Ordine**, valido sia per i video sia per le playlist.
- Nuova categoria principale **Mai visti**: nasconde i video già aperti (gli ultimi 500).

## PMVHaven 1.1.9 · HypnoTube 1.1.8

- **Popular a sorpresa** (impostazione, accesa di default): ogni volta che apri Popolari esce un ordine o una categoria diversa. Spenta, Popolari mostra i più visti.

## PMVHaven 1.1.6 – 1.1.8 · HypnoTube 1.1.7

- Filtro **Profili**: gli ultimi 3 autori aperti, da scegliere con un tocco.
- PMVHaven: **Tipo → Il mio profilo** mostra preferiti e repost del tuo account (serve l'accesso dalla WebView).

## PMVHaven 1.1.3 – 1.1.5 · HypnoTube 1.1.4 – 1.1.6

- Sezioni e ordini come sul sito (tendenza, popolari, più votati, più lunghi, casuale…).
- Nella scheda: autore e `@nome` come primo genere per cercare i suoi video; trama con durata, voti e visualizzazioni.
- Capitolo «Episodio 1» con miniatura: niente più avviso «couldn't be auto-numbered».
- Date in millisecondi: niente più riquadro grigio sugli episodi.

## HypnoTube 1.1.0 – 1.1.2 · PMVHaven 1.1.0 – 1.1.1

- Ricerca funzionante su HypnoTube (con 10 secondi tra una ricerca e l'altra, per non farsi bloccare dal sito).
- Playlist, preset di sessione, categorie principali (Gooning, Blackedraw, Poppers), durata minima.
- Popolari e Recenti finalmente diversi su entrambe.

## PMVHaven 1.0.0 – 1.0.1 · HypnoTube 1.0.0

- Prime versioni: liste, categorie, ricerca e video mp4 diretti.
- PMVHaven 1.0.1: Popolari corretto (`sort=-views`), Recenti per data di caricamento.

## AnimeWorld 1.2.0 · HentaiWorld 2.1.0

- AnimeWorld: filtro **Ordine** (Più recenti, Ultime aggiunte, Più visti, Meglio valutati…), **Stato** in corso/finito, tag cliccabili.
- HentaiWorld: filtri del sito (ordine, stato, genere, lingua **Sub ITA / Sub ENG / Dub ITA**), trama e generi nella scheda.

## HentaiWorld 2.0.0

- Passa al sito italiano **hentaiworld.me**, con video mp4 diretti.

## AnimeWorld 1.0.0 – 1.1.0 · HentaiWorld 1.0.x

- Prime versioni: AnimeWorld (generi, Sub/Dub ITA) e HentaiWorld (prima su hentaiworld.cc, poi sostituito).
