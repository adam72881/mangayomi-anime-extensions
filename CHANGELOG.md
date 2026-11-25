# Novità

## Gofile 1.44.0

- **«Consigliati»: +6 termini (belle ragazze / balli).** Aggiunti 女神 (dea), 女神范 (stile da dea), 性感舞 e 热舞 (balli sexy), 诱惑 (seduzione), 颜值 (bella presenza). Sono i più vicini allo stile Douyin che danno risultati veri sui nostri host. Menu da 58 a 64 termini.

## Gofile 1.43.0

- **«Consigliati»: 7 termini in più (esibizionismo/pubblico + sissy).** Aggiunti 人前露出 (esibizionismo in pubblico), 露出挑战 (sfida esibizionismo), 户外露出 e 户外 (all'aperto), 街拍 (scatti per strada), 全裸 (nudo integrale) e sissy (crossdresser). Menu da 51 a 58 termini.

## Gofile 1.42.1

- **Bunkr «in manutenzione»: messaggio più chiaro.** Quando un video Bunkr non parte perché il suo server è temporaneamente in manutenzione, ora l'estensione lo dice («temporaneamente non disponibile, riprova più tardi») invece di «il file non è più disponibile» (che faceva pensare fosse sparito). Gli altri video dello stesso album di solito funzionano lo stesso.

## Gofile 1.42.0

- **La ricerca parte già su «Tutti».** Prima «Cosa cerco» era preimpostato su «Album su Bunkr»; ora parte su **«Tutti» (Bunkr + Erome + findr)**, così ogni ricerca (e ogni termine «Consigliati») dà subito il massimo. Puoi sempre cambiarlo con l'altra sorgente quando vuoi.

## Gofile 1.41.0

- **«Consigliati» più ricco (17 termini in più, da 34 a 51).** Aggiunti termini "combo" centrati sullo stile gambe/calze/tacchi: 黑丝高跟 (calze nere + tacchi), 高跟丝袜, 高跟美腿, 黑丝长腿, 长腿丝袜, 大长腿, 白丝高跟, 肉丝高跟, 性感美腿, 腿控, 丝袜诱惑, 包臀裙, 蕾丝, 吊带, 制服诱惑, 粉丝袜, 黑色丝袜. Come gli altri, seguono la sorgente scelta in «Cosa cerco» (su «Tutti» o «findr» rendono di più).

## Gofile 1.40.1

- **«Consigliati» ora segue «Cosa cerco».** Prima un termine consigliato cercava solo su findr; adesso usa il motore che scegli: «Album su Bunkr», «Tutti», «findr», «Erome»… Con «Gofile-douga» o «Bunkr: ultimi» (che non cercano per parola) passa automaticamente a «Tutti», così il termine non viene ignorato.

## Gofile 1.40.0

- **Nuovo filtro «Consigliati».** Nei filtri c'è un menu con 34 termini di ricerca già pronti (in cinese, con la traduzione accanto: calze, piedi, tacchi, cosplay, modelle, uniformi, ecc.). Scegline uno senza scrivere niente e cerca automaticamente su **findr** (tutti gli host insieme). Comodo per trovare subito il tipo di contenuto senza dover scrivere il termine cinese a mano.

## Gofile 1.39.0

- **Recenti più veloce, con le copertine prima.** Appena la prima pagina di un album Bunkr ha un video, titolo e copertina si salvano subito; le pagine dopo continuano in seguito. Un dominio Bunkr che non risponde si lascia dopo 9 secondi, così non blocca l'elenco. I link turbo.cr della lista condivisa compaiono in Recenti.

## Gofile 1.38.2

- **Si vede dove si ferma la lettura Gofile.** Se la WebView non risponde, la Diagnosi dice `gf-null`, `gf-err` o `gf-nojson` con i secondi, non solo «attesa 1s · ripeti». Se lo script parte, accanto al numero di file ci sono le tappe (`gf-api:2[start,token,wt,fetch1,api-ok]`). Tolto `import()`, che su iPhone può impedire allo script di partire. Se la lettura nuova non torna nulla, si riprova una volta col metodo di prima (`gf-old:N`).

## Gofile 1.38.1

- **Le cartelle Gofile vive si aprono.** Lo script nella WebView usava async/await e su iPhone moriva senza rispondere: la scheda diceva «vuota» e la Diagnosi restava su «attesa 1s · ripeti», senza `gf-api` né `gf-dom`. Ora lo script è solo con Promise e chiama sempre la risposta. Se l'API non arriva in 15 secondi si leggono le righe della pagina. Ogni richiesta ha un tetto di 9 secondi. Una cartella che non esiste o è scaduta lo dice, non risulta vuota.

## Gofile 1.38.0

- **Lettura cartelle Gofile più robusta.** La lettura via API ora: crea un suo token se quello del sito non è ancora pronto (prima a volte partiva troppo presto e falliva), aspetta che il generatore del token del sito sia caricato, manda la lingua giusta e riprova se il sito risponde «troppe richieste». Inoltre distingue i casi: cartella **inesistente/scaduta** → «non esiste più» (chiaro), protetta da **password** → messaggio apposito, invece del generico «vuota».
- Nota tecnica: due link provati di recente (kV9aOGC5, r8e5hWus) erano **cartelle morte lato Gofile**, quindi non apribili da nessuna app — non era un difetto dell'estensione.

## Gofile 1.37.0

- **Gofile-douga: niente più link morti.** Alcuni video non si aprivano perché la cartella Gofile era scaduta/rotta (lo stesso sito la segna «broken»). Ora quelle voci vengono nascoste dall'elenco, così quello che vedi è apribile.
- **La «Diagnosi» mostra la versione giusta.** Prima scriveva sempre «1.31.5» anche dopo gli aggiornamenti: era un numero rimasto fermo. Ora riporta la versione reale, così si capisce al volo quale versione hai sul telefono.

## Gofile 1.36.0

- **Nuovo filtro «Bunkr: ultimi (novità)».** In «Cosa cerco» c'è una voce che mostra gli **ultimi album Bunkr veri** (in ordine di data, da freebunkr.com), così hai sempre roba nuova e diversa — non più solo i soliti album più grossi. Nota: questa lista non distingue video da foto, quindi ogni tanto può capitare un album di sole foto (aprendolo risulta senza video). Le altre voci Bunkr restano solo-video.

## Gofile 1.35.0

- **Gofile-douga più pulito nei filtri.** In «Cosa cerco» ora c'è una sola voce «Gofile-douga». L'ordine (novità / più visti 12h / 24h / 3 giorni) si sceglie da un filtro separato «Ordine Gofile-douga» qui sotto, invece di avere quattro voci tutte in fila.

## Gofile 1.34.0

- **Cartelle Gofile «vuote» forzate ad aprirsi.** Alcune cartelle (soprattutto grandi, es. molti video da Gofile-douga) dicevano «Nessun file trovato» anche se i video c'erano: la pagina di Gofile non riusciva a disegnarle in tempo. Ora l'estensione chiede i file **direttamente all'API di Gofile** dentro la WebView (come fa il sito), così arrivano tutti in una volta, e usa il link di download diretto per la riproduzione. Se l'API non risponde, ricade sul metodo di prima: nel caso peggiore resta tutto com'era.

## Gofile 1.33.0

- **Gofile-douga con ordinamenti.** Nel filtro «Cosa cerco» ora ci sono quattro voci Gofile-douga: «novità», «più visti (12h)», «più visti (24h)» e «più visti (3 giorni)». Così hai molti più video diversi da guardare, non solo gli ultimi. (Nota: Bunkr, Erome e findr offrono solo «recenti» — i loro indici pubblici non supportano altri ordinamenti.)

## Gofile 1.32.0

- **Nuova fonte: Gofile-douga.** Nei filtri «Cosa cerco» c'è «Gofile-douga (novità Gofile)»: sfoglia le novità di video Gofile raccolte da gofile-douga.com (classifica dei link Gofile di tendenza). Non cerca per parola — si scorre e basta — e ogni risultato si apre come un normale link Gofile. Resta attivo il filtro di sicurezza sui titoli.

## Gofile 1.31.5

- **Togliere un link 🌐 non chiede un secondo OK.** La spunta in «Togli i link» e l'OK di quel riquadro mettono subito in coda la rimozione dalla lista condivisa. Resta il token, e resta «Annulla ultima rimozione».

## Gofile 1.31.4

- **La prima apertura ha i video, su ogni sito.** La lettura poteva riuscire e l'archivio non mostrarla ancora: la scheda usciva con l'indirizzo nudo e «Nessun file trovato», e i file comparivano solo ricaricando. Ora la lista si disegna con quello appena letto. Se la prima risposta non ha né titolo né schede (e non è un 404), si aspetta un secondo e si riprova, poi gli altri domini Bunkr, la modalità avanzata e la WebView.
- **Diagnosi.** Se i file non ci sono, in fondo alla scheda c'è una riga con versione, host, stato HTTP, lunghezza e titolo della pagina, senza cookie. La versione c'è su ogni scheda.
- **Togliere dalla lista condivisa.** La scrittura su GitHub partiva dalle impostazioni, che su iPhone non aspettano la risposta, e il tentativo restava bloccato: il file non cambiava. Ora parte aprendo Popolari, Recenti o una scheda, riprova una volta se GitHub risponde 409, e se fallisce lo dice. Una riga «link | nome» si riconosce anche se il dominio Bunkr non è lo stesso.

## Gofile 1.31.3

- **Gli episodi ci sono alla prima apertura.** Bunkr mette già tutti i video nella prima pagina, con un indirizzo tipo `/f/Titolo---Nome.mp4`. Quel link veniva scartato (si accettavano solo lettere e cifre), quindi la scheda restava vuota e i video uscivano solo ricaricando. Ora si leggono da quella pagina. Se la prima risposta è la verifica e non un album, si riprova subito con il cookie, poi con la modalità avanzata e la WebView. Una lettura vuota che non è un 404 non viene salvata.
- **Date e nomi.** La data è quella del file (prima era il 13 settembre 2020 su ogni riga). Il nome è «52 - titolo», corto e senza caratteri invisibili.

## Gofile 1.31.2

- **Gli episodi ci sono alla prima apertura:** una lettura senza file non resta più in memoria, e i video già nella prima pagina dell'album si usano subito (le pagine dopo partono insieme). Prima la scheda tornava grigia e i video uscivano solo ricaricando. Ogni episodio ha nome, indirizzo, data in millisecondi, scanlator e miniatura, tutti stringhe.
- **Erome parte sull'iPhone:** il video porta Referer, Origin e User-Agent, e non si ferma più sul controllo che mostrava il messaggio della TV.

## Gofile 1.31.1

- **turbo.cr si apre alla prima:** gli album turbo (da findr o incollati direttamente) a volte dicevano «Nessun file trovato» alla prima apertura e si vedevano solo ricaricando. Ora la lettura ritenta da sola qualche volta nello stesso giro, così l'album si apre subito senza dover trascinare in basso. Se proprio turbo.cr non risponde, lo dice chiaramente («riprova tra qualche secondo») invece di sembrare vuoto.

## Gofile 1.31.0

- **turbo.cr aperto:** ora si aprono anche gli album e i video di turbo.cr (il provider più usato da findr, prima scartato). Il video si ottiene dall'indirizzo firmato del sito, in chiaro e senza WebView. Di conseguenza la ricerca e l'home di findr sono molto più piene e veloci.

## Gofile 1.30.1

- **Album e Video Bunkr ora diversi anche a ricerca vuota:** prima, senza testo, «Album su Bunkr» e «Video su Bunkr» mostravano la stessa lista. Ora «Album» mostra gli ultimi album (con video), «Video» gli ultimi video singoli.
- **findr non mostra più la pagina vuota:** gli ultimi album di findr sono spesso di provider non apribili (es. turbo), quindi l'home restava vuota. Ora scorre più pagine finché trova abbastanza album apribili (Bunkr, Gofile, pixeldrain, filester).

## Gofile 1.30.0

- **Ricerca vuota, home del sito:** se il testo è vuoto (o solo spazi) e scegli un filtro in «Cosa cerco», compaiono gli ultimi album di quel sito. Con una parola la ricerca resta quella di prima. Un link incollato si apre ancora subito.
- **Da dove arrivano:** Album e Video su Bunkr usano gli album di bunkrsearch (60 a pagina). Erome usa la pagina Explore. findr usa gli album più recenti. «Tutti» alterna i tre, senza doppioni, e mostra chi risponde. Vale solo il filtro sui minori.

## Gofile 1.29.0

- **findr.to nella ricerca:** nel filtro «Cosa cerco» c'è «findr (tutti i servizi)». «Bunkr + Erome» diventa «Tutti (Bunkr + Erome + findr)»: i tre partono insieme e i risultati si alternano, senza doppioni. Se uno non risponde restano gli altri. All'inizio il filtro resta «Album su Bunkr».
- **Gli album di findr si aprono come le schede già note:** un album diventa la scheda del suo link (Bunkr, Gofile, pixeldrain o filester). Un file senza album si apre dal suo link. Se findr non risponde, compare «findr.to non risponde: forse è bloccato dall'operatore». Vale solo il filtro sui minori già usato da Bunkr ed Erome.
- **Salva anche da findr:** le righe «Salva sul telefono» e «Salva nella lista condivisa» compaiono anche sulle schede aperte da findr.

## Gofile 1.28.0

- **Salva dalla ricerca:** in cima alla scheda di un album Bunkr, di un video Bunkr o di un album Erome ci sono due righe. «💾 Salva sul telefono» mette il link solo tra i link di questo telefono (Popolari). «🌐 Salva nella lista condivisa» scrive solo il file condiviso, col titolo dell'album, e lo trovi in Recenti sul telefono e sulla TV. Le due azioni non si mescolano: se un link è già in un elenco, quella riga diventa «✓ Già …» e l'altra resta da salvare.
- **Toccando la riga compare il messaggio:** «✅ Salvato sul telefono: lo trovi in Popolari», «✅ Aggiunto alla lista condivisa: lo trovi in Recenti», «Serve il token nelle impostazioni», oppure l'errore di GitHub. Se è già salvato, il messaggio lo dice e non rifà l'azione. Le righe non sono episodi numerati e non spostano «Riprendi».
- **Un solo filtro, su Bunkr e su Erome:** la ricerca e la scheda scartano solo termini inequivocabili di minori (underage, minor, child, kid, loli, shota, preteen, jailbait e un'età scritta sotto i 18). Teen, 18yo, 19yo, young, school, barely, leak, hidden e caught restano. I link già in Popolari o in Recenti non si toccano.

## Gofile 1.27.4

- **Bunkr ed Erome insieme:** nel filtro «Cosa cerco» c'è «Bunkr + Erome (album)». Cerca gli album sui due siti in parallelo e alterna i risultati, senza doppioni. Se uno non risponde restano i risultati dell'altro; l'errore compare solo se non risponde nessuno. All'inizio il filtro resta «Album su Bunkr».
- **Le miniature sono indirizzi interi:** copertine di ricerca, scheda ed episodi (Bunkr e Erome) usano un indirizzo http completo. Rispondono come immagine anche senza un riferimento alla pagina, quindi non serve un'intestazione diversa per ogni sito.

## Gofile 1.27.3

- **Ricerca album su Erome, solo se la scegli:** nel filtro «Cosa cerco» c'è «Album su Erome», oltre a Bunkr. All'inizio resta «Album su Bunkr». I risultati sono album con almeno un video, da aprire come schede.
- **Titoli esclusi:** in ricerca e nell'album si scartano i titoli che indicano minori oppure riprese non consensuali (leak, telecamere nascoste, e simili). Se apri un album con un titolo di quel tipo, compare «Contenuto non disponibile».
- **I video Erome partono dal telefono:** serve il riferimento alla pagina di Erome. Sulla TV, che non lo manda, compare «I video Erome non partono sulla TV: servono sul telefono». Un link erome.com/a/… incollato si può salvare.

## Gofile 1.27.2

- **La ricerca guarda solo Bunkr:** una parola cerca sempre su bunkrsearch.link, anche se hai schede salvate con lo stesso nome. Il filtro parte su «Album su Bunkr». «Le mie schede» non è più nel filtro: i link salvati restano in Popolari e Recenti.
- **Una parola non diventa più una scheda Gofile finta:** «HopeHeaven» non apre più un link gofile.io inventato. Un link incollato (Gofile, Bunkr, filester, pixeldrain) si apre ancora subito.
- **Se il sito di ricerca non risponde, lo dice:** quando bunkrsearch.link non risponde o non dà una pagina valida, compare «Il sito di ricerca Bunkr (bunkrsearch.link) non risponde: forse è bloccato dall'operatore», invece di una lista vuota.

## Gofile 1.27.1

- **Ricerca Bunkr solo video:** «Album su Bunkr» ora mostra solo gli album che contengono video (niente più album di sole foto); «Video su Bunkr» mostra i singoli video. I risultati non hanno doppioni tra una pagina e l'altra.

## Gofile 1.27.0

- **Ricerca su Bunkr (album e video):** nella ricerca, con il filtro «Cosa cerco» scegli «Album su Bunkr» o «Video su Bunkr» e cerca per parola/nome: l'estensione usa un indice pubblico (API diretta, veloce, senza WebView) e mostra i risultati con copertina, da aprire come schede. Il filtro resta su «Le mie schede» per la ricerca tra i link salvati, come prima.

## Gofile 1.26.4

- **Nelle liste delle impostazioni si vede il nome, non l'indirizzo:** in «Togli i link», «Aggiungi alla lista condivisa» e «Nome…», un link senza nome che gli hai dato ora mostra il titolo letto dal sito (es. «asuna_love») invece dell'indirizzo, così lo riconosci. Solo se non c'è nemmeno quello appare l'indirizzo.

## Gofile 1.26.3

- **Il link caricato nel documento si toglie dal telefono:** quando aggiungi un link alla lista condivisa (e la scrittura va a buon fine), il link viene tolto dai salvati del telefono. Così si «sposta» da Popolari a Recenti, senza restare doppio. Se la scrittura fallisce, il link resta sul telefono.

## Gofile 1.26.2

- **Popolari e Recenti di nuovo separati:** in «Popolari» solo i link salvati su questo telefono, in «Recenti» quelli della lista condivisa (il documento). «Togli i link» continua a vedere tutto (🌐 = lista condivisa), così puoi togliere anche quelli del documento. Popolari non aspetta più la rete: si apre subito.

## Gofile 1.26.1

- **Popolari mostra anche la lista condivisa:** le schede sono i link del telefono più quelli del file (senza doppioni). Si aprono subito dalla copia salvata, come Recenti; il resto si aggiorna in sottofondo.
- **«Togli i link» vede anche i link 🌐 del file:** si tolgono solo se c'è il token e solo dopo «Conferma rimozione». «Annulla ultima rimozione» li rimette. Senza token restano dov'erano. Un OK a vuoto non cancella nulla.
- **«Aggiungi alla lista condivisa» elenca tutti i link del telefono:** quelli già nel file sono segnati «✓ già condiviso» e non vengono riscritti. Il titolo dice quanti sono davvero («3 nella lista condivisa · N su questo telefono»), non solo l'ultimo invio.
- **L'indirizzo del file non è più un'impostazione:** è sempre quello del repository. Se sul telefono c'era un altro indirizzo, si butta e la lista si riscarica.

## Gofile 1.26.0

- **Il token GitHub non si vede più per intero:** la casella resta vuota per incollarne uno nuovo (o «-» per toglierlo). Nel titolo c'è solo «Token ✓ (…ultime 4)» oppure «Token: non impostato». Quello già salvato sul telefono viene tenuto e continua a servire per aggiornare la lista.
- **Togliere un link chiede conferma:** segnare un link non lo cancella. Compare «Conferma rimozione (N)» e solo scrivendo OK si toglie. «Annulla ultima rimozione» rimette l'ultimo elenco tolto. Un OK a vuoto non cancella nulla.
- **Lo stato si legge dal titolo:** quante voci ha la lista condivisa, se il token c'è, e se l'ultimo invio è andato a buon fine o con quale errore. Sulla TV, che non mostra le spiegazioni sotto la voce, le istruzioni essenziali stanno nel titolo.
- **L'invio non si perde se GitHub risponde 409:** i link scelti restano in attesa finché la scrittura riesce. Se il file è cambiato nel frattempo, si rilegge e si riprova una volta. L'invio parte anche aprendo Recenti o la ricerca, oltre a Popolari.

## Gofile 1.25.2

- **Gli episodi Bunkr si aprono di nuovo:** dalla 1.25.1 un limite di 12 secondi sulla pagina Bunkr scattava prima che il telefono ricevesse la risposta (su iPhone quel timer può anche scattare subito, se non è disponibile). L'episodio usciva con «nessuna risposta» da tutti i domini, anche quando Bunkr rispondeva. Ora la pagina usata per il video aspetta la risposta vera, come prima della 1.25.1. Un timer nostro non viene mai contato come «nessuna risposta» e non segna il dominio come bloccato.
- **Recenti resta immediato:** la lista si apre ancora subito dalla copia salvata. Il limite di attesa resta solo sul primo scaricamento della lista condivisa, quando non c'è ancora una copia, e solo se il timer del telefono funziona.

## Gofile 1.25.1

- **Recenti si apre subito:** la lista mostra le schede immediatamente dalla copia salvata della lista condivisa, che si aggiorna in sottofondo. Gli album Bunkr non ancora letti si leggono dopo, in sottofondo o quando apri la scheda, invece di far aspettare tutta la lista.
- **Album Bunkr più veloci:** si prova prima la «modalità avanzata» con una sola richiesta (tutti i file insieme); la lettura a pagine resta come ripiego, con al massimo 20 pagine e solo sul dominio che ha già risposto. Ogni richiesta a Bunkr ha un tempo massimo (12–15 s), così un dominio bloccato dall'operatore non fa aspettare minuti.

## Gofile 1.25.0

- **Estensione segnata +18:** Gofile è ora marcata come NSFW, così compare solo quando è attiva la modalità adulti (prima si vedeva sempre, anche sulla TV). Se vuoi vederla, attiva la modalità contenuti per adulti nelle impostazioni di Mangayomi.

## Gofile 1.24.2

- **Le impostazioni rileggono il documento:** aprendo le impostazioni ora parte una rilettura della lista condivisa in sottofondo, così riaprendole la voce «ℹ️ Stato» mostra i link presenti nel documento anche senza passare prima da Popolari/Recenti.

## Gofile 1.24.1

- **La lista condivisa si aggiorna subito:** aprendo Popolari, Recenti o la ricerca l'estensione rilegge il documento forzando la versione aggiornata (prima restava la vecchia per via della cache di GitHub di ~5 minuti e di una cache interna). Così i link appena aggiunti compaiono senza aspettare.

## Gofile 1.24.0

- **Popolari e Recenti separati:** in «Popolari» ora ci sono solo i link che hai salvato tu sul telefono; in «Recenti» quelli della lista condivisa (il documento). La ricerca guarda comunque in entrambi, e ogni scheda si apre da tutte e due.

## Gofile 1.23.4

- **Stato della lista condivisa che si aggiorna davvero:** le scritte sotto «Token» e «Lista condivisa» non si aggiornavano (bug noto di Mangayomi #1196 sui riepiloghi a chiave fissa), facendo sembrare il token non impostato anche quando funzionava. Ora c'è una riga «ℹ️ Stato lista condivisa» che si aggiorna sempre (token a posto o no, link presenti nel documento, ultimo esito). Le altre due voci restano solo per inserire token e indirizzo.

## Gofile 1.23.3

- **Scrittura sulla lista condivisa corretta (errore 400):** alla richiesta di scrittura mancava l'intestazione `Content-Type: application/json`, così GitHub la rifiutava con errore 400 e nessun link veniva aggiunto. Ora l'aggiunta funziona. Migliorati anche i messaggi d'errore per codice (401/403 = token/permesso, 404 = repo/file, ecc.).

## Gofile 1.23.2

- **Il token GitHub ora resta salvato:** le caselle «Token GitHub» e «Lista condivisa (URL)» venivano ridisegnate vuote, e Mangayomi azzerava il valore salvato (per questo il token risultava sempre «non impostato»). Ora mostrano il valore attuale e lo conservano. Dopo l'aggiornamento, reinserisci il token una volta.

## Gofile 1.23.1

- **Token più affidabile al momento di scrivere:** la copia interna del token viene rinfrescata subito prima di aggiungere i link, così un token appena inserito viene usato correttamente. Se qualcosa non va, il messaggio sotto «➕ Aggiungi alla lista condivisa» dice esattamente cosa: «Manca il token», «GitHub ha risposto 401/403» (token sbagliato o senza permesso), oppure «Aggiunti N link. ✓».

## Gofile 1.23.0

- **Vedi cosa c'è nella lista condivisa:** la voce «📄 Lista condivisa» ora elenca i link presenti nel documento (per nome), così sai se ci sono. Toccandola puoi comunque cambiare l'indirizzo del file. Dopo aver aggiunto dei link, compaiono subito nell'elenco (senza aspettare la cache di GitHub).

## Gofile 1.22.2

- **La lista dei link da spuntare compare sempre:** «➕ Aggiungi alla lista condivisa» (con l'elenco dei link del telefono da spuntare) ora si vede anche prima di mettere il token, con un avviso di metterlo. Prima appariva solo dopo aver inserito il token, e non era chiaro dove scegliere i link.

## Gofile 1.22.1

- **Corretto il crash all'apertura di Gofile:** la 1.22.0 leggeva le impostazioni (URL/token della lista condivisa) mentre costruiva la pagina delle impostazioni, mandando l'app in loop fino a chiudersi. Ora quei valori si leggono in modo sicuro e l'app non si chiude più. L'aggiunta dei link alla lista condivisa continua a funzionare.

## Gofile 1.22.0

- **Aggiungi link alla lista condivisa da dentro Mangayomi:** nelle impostazioni, dopo aver messo un token GitHub («🔑 Token GitHub»), compare «➕ Aggiungi alla lista condivisa»: spunti i link salvati che vuoi mettere nel file condiviso e vengono scritti su GitHub quando riapri Popolari. Così prepari la lista dal telefono (con la tastiera) e la TV la legge. Nota: i link aggiunti a un repo pubblico sono pubblici — per uso privato usa un repo privato o un Gist segreto.

## Gofile 1.21.0

- **Lista condivisa (per la TV):** l'estensione può leggere un file di testo con i link (un link per riga), così sulla TV — dove digitare è scomodo — i link compaiono da soli. Basta modificare il file da telefono/PC. Di default legge un file nel repo (`links/gofile.txt`), ma nelle impostazioni («📄 Lista condivisa») puoi mettere il tuo (anche un Gist). Valgono gli stessi formati di «Salva un link» (anche `link | nome` per le raccolte; righe con `#` ignorate). I link locali e quelli della lista convivono.

## Gofile 1.20.0

- **Lettura album Bunkr finalizzata.** Tolta la riga di diagnostica temporanea. Il metodo in uso è quello più veloce che funziona sul telefono: la WebView apre l'album e scarica dall'interno la lista completa dei file (modalità avanzata); l'HTTP paginato resta come ripiego. I video si aprono prendendo il link firmato dalla pagina del singolo file solo al momento della riproduzione.

## Gofile 1.19.3

- **Le schede vecchie ora si rileggono dopo un aggiornamento:** una scheda già salvata restava in cache e non veniva più riletta, quindi i miglioramenti (es. album Bunkr completi) non avevano effetto finché non toglievi e rimettevi il link — e a volte nemmeno così. Ora, dopo un aggiornamento che cambia il modo di leggere, le schede vengono rilette una volta da sole. È il motivo per cui l'album Bunkr restava bloccato a 100.

## Gofile 1.19.2

- **Diagnostica temporanea per gli album Bunkr:** nella descrizione della scheda compare una riga «diag ▸ …» che mostra cosa riesce a leggere la WebView (se vede la lista, se la richiesta parte, lo stato della risposta, quanti file estrae). Serve a capire perché su alcuni telefoni l'album grande resta a 100. Verrà tolta una volta risolto.

## Gofile 1.19.1

- **Album Bunkr grandi: lettura ancora più affidabile.** Anche la WebView poteva perdere la query della modalità avanzata. Ora la WebView apre la pagina normale dell'album (superando l'eventuale verifica Cloudflare) e scarica la lista completa dei file dall'interno della pagina con una fetch del browser (che manda davvero la query e i cookie). Così gli album grandi mostrano tutti i video anche sul telefono.

## Gofile 1.19.0

- **Album Bunkr grandi, ora davvero tutti i video (via WebView):** sul telefono la pagina «avanzata» di Bunkr non si scaricava via HTTP (le richieste con query a volte vengono fermate), così gli album grandi restavano a 100. Ora l'estensione apre l'album nella WebView nascosta (come fa per Gofile), legge la lista completa dei file e prende tutti i video. L'HTTP paginato resta come ripiego dove la WebView non c'è.

## Gofile 1.18.1

- **Il link non sparisce più dopo averlo tolto e rimesso:** se toglievi un link e poi rimettevi lo stesso identico link, ricompariva la vecchia spunta «da togliere» e il link rimesso spariva di nuovo all'uscita. Ora la casella «Togli i link» cambia chiave dopo ogni rimozione, quindi una vecchia spunta non può più ritornare.

## Gofile 1.18.0

- **Album Bunkr: tutti i video in una richiesta (modalità avanzata):** invece di leggere l'album pagina per pagina (che sul telefono spesso si fermava a 100), l'estensione usa la «modalità avanzata» di Bunkr (`?advanced=1`), che carica tutti i file in una sola pagina. Un album da 1077 file ora apre tutti i 1077 video in meno di un secondo. La vecchia lettura paginata resta come ripiego. (Grazie all'idea di usare la vista avanzata invece della paginazione.)

## Gofile 1.17.2

- **Album Bunkr: ripiego sugli altri domini e messaggio chiaro:** se le pagine successive di un album grande non arrivano dal dominio principale, ora l'estensione le riprova sugli altri domini Bunkr. Se proprio non si riescono a leggere (blocco o limite di rete), invece di fermarsi in silenzio a 100 lo dice chiaramente e suggerisce di cambiare rete.

## Gofile 1.17.1

- **Album Bunkr grandi, lettura più affidabile sul telefono:** la 1.17.0 leggeva le pagine dell'album in parallelo riusando la logica di fallback dei domini, che su Android poteva far saltare le pagine dopo la prima (restavano 100 video). Ora le pagine successive si leggono una alla volta, sullo stesso dominio, fermandosi quando non c'è più nulla di nuovo.

## Gofile 1.17.0

- **Album Bunkr grandi, tutti i video:** gli album Bunkr sono paginati a 100 file per pagina. Prima l'estensione leggeva solo la prima pagina (massimo 100 video). Ora legge tutte le pagine dell'album, così un album con 1077 file mostra tutti i suoi video, non solo 100.

## Gofile 1.16.2

- **pixeldrain, messaggio chiaro se è bloccato:** se il telefono riceve una pagina di blocco invece dei dati (in Italia pixeldrain.com è spesso bloccato dall'operatore), prima la scheda diceva «non trovata» come se il file fosse sparito. Ora distingue i due casi e spiega che pixeldrain non risponde dal telefono, suggerendo di cambiare rete o aprirlo nel browser.

## Gofile 1.16.1

- **Correzione pixeldrain:** nella 1.16.0 la scheda pixeldrain si creava ma all'apertura dava «Gofile: link non valido» e 0 episodi (mancava il riconoscimento del percorso interno `/pd/`). Ora si apre correttamente e mostra il video.

## Gofile 1.16.0

- **Anche pixeldrain:** in «➕ Salva un link» puoi mettere link `pixeldrain.com/u/…` (un file) e `pixeldrain.com/l/…` (una lista, che diventa una scheda con tutti i video come episodi). Titolo e copertina arrivano dall'API; il video si scarica dall'indirizzo diretto, senza permessi a tempo. API pubblica in chiaro come Gofile e filester: niente WebView e niente da aggirare.

## Gofile 1.15.2

- **Tutti i domini di filester:** oltre a `.me` e `.gg` ora vanno anche `filester.si` e qualsiasi altro mirror futuro (stesso file, stessa API). Non serve più aggiungerli uno a uno.

## Gofile 1.15.1

- **Anche i link `filester.gg`:** `filester.gg` è un mirror di `filester.me` (stessi file e stessa API). Prima i link `.gg` non venivano riconosciuti e restavano tra i salvati senza aprirsi. Ora funzionano come i `.me`.

## Gofile 1.15.0

- **Anche filester.me:** in «➕ Salva un link» puoi mettere anche link `filester.me/d/…`. Diventano una scheda con il video, con titolo e copertina dalla pagina, e funzionano nelle raccolte con lo stesso nome. filester ha un'API pubblica in chiaro (come Gofile), quindi non serve WebView e niente da aggirare: il permesso del video si prende fresco a ogni apertura.

## Gofile 1.14.2

- **Link incapsulati che portano a un altro sito:** alcuni link (es. capistock) non contengono un file Gofile ma un sito di streaming (es. hgcloud) con il video protetto. Prima non si salvavano, senza spiegazione. Ora la scheda si salva e dice chiaro che quel link non porta a Gofile e non si può aprire. L'estensione apre i file Gofile e gli album Bunkr, non lo streaming protetto di altri siti.

## Gofile 1.14.1

- **Link incapsulati tagliati nell'incollare:** sull'iPhone un link lungo (capistock) a volte si taglia quando lo incolli. Prima restava una scheda che non apriva nessun video (titolo tipo «di»). Ora l'estensione lo riconosce: la scheda si chiama «Link incompleto» e dice di toglierlo e reincollarlo per intero.
- **Video incapsulati che restano a caricare:** il link Gofile «direct» rimbalza verso un altro server, e alcuni lettori perdevano il permesso nel rimbalzo. Ora l'estensione risolve da sola l'indirizzo finale, così il lettore fa una sola richiesta e il video parte.

## Gofile 1.14.0

- **Rinominare insieme i link aggiunti insieme:** se incolli più link in «➕ Salva un link» (per esempio 5 link della stessa creator), la voce qui sotto diventa **«✏️ Nome dei link aggiunti insieme»** e il nome che scrivi va a **tutti**, così finiscono in un'unica raccolta. Se hai aggiunto un solo link, resta «Nome dell'ultimo link» come prima.

## Gofile 1.13.1

- **Link incapsulati (es. capistock): la scheda non scade più.** Il parametro `t=` di quelle pagine è la scadenza della pagina del sito, non del file. Il link Gofile che c'è dentro continua a rispondere con il Referer giusto anche dopo che il `t=` è passato, finché il file resta su Gofile. Quindi basta salvare il link una volta: la scheda funziona anche dopo. La 1.13.0 lo bloccava quando il `t=` era passato.

## Gofile 1.13.0

- **Link «incapsulati»:** alcune pagine, per esempio `capistock.com/ember?em=…&t=…`, contengono dentro il parametro `em=` un link diretto a un file Gofile. Ora si possono salvare in «➕ Salva un link» o incollare nella ricerca come gli altri link: diventano una scheda con quel video, e funzionano anche nelle raccolte con lo stesso nome.
- Quel file risponde solo alle richieste che arrivano da quella pagina, quindi l'estensione fa come il suo lettore. La **scadenza** del link (`t=`) viene rispettata: un link scaduto non si apre, e la scheda chiede di prenderne uno nuovo dal sito.

## Gofile 1.12.5

- **Video Bunkr più rapidi ad aprirsi:** un dominio Bunkr bloccato dall'operatore può far aspettare il telefono a lungo prima di arrendersi. Ora un dominio che non risponde, o che dà una pagina di blocco, viene saltato per 24 ore: l'estensione va subito su quello che funziona, anche per gli episodi salvati con l'indirizzo `bunkr.cr`.

## Gofile 1.12.4

- **Più link con un nome solo:** in «➕ Salva un link» puoi incollare più link e alla fine `| Nome` (es. `link link link | Asuna`): prendono tutti quel nome e finiscono nella stessa raccolta.
- **Link Gofile con un solo video:** Gofile li apre direttamente nel suo lettore, senza la lista dei file, e l'estensione diceva «Nessun file trovato». Ora prende il video dal lettore della pagina, con nome e miniatura. Il titolo della scheda è il nome del file senza estensione.

## Gofile 1.12.3

- La scritta «Per: …» sotto «✏️ Nome dell'ultimo link» ora segue davvero l'ultimo link salvato. Prima Mangayomi mostrava quella della prima volta. Il nome andava comunque al link giusto.

## Gofile 1.12.2

- Se salvi di nuovo un link che c'era già, diventa l'ultimo: «✏️ Nome dell'ultimo link» vale per lui. Il nome che aveva resta, se non ne scrivi uno nuovo.
- Lo stesso album Bunkr con domini diversi (bunkr.cr, bunkr.si…) ora è un link solo: i doppioni già salvati vengono uniti. L'indirizzo mostrato usa il dominio che funziona.

## Gofile 1.12.1

- Il messaggio per Bunkr non raggiungibile non consiglia più VPN o DNS: dice solo quali domini sono stati provati.

## Gofile 1.12.0

- **Copertine di nuovo visibili:** quelle composte (ritaglio delle bande e collage della 1.7–1.11) erano immagini «data:», e Mangayomi, salvando la scheda, ci mette davanti l'indirizzo del sito: sul telefono la copertina risultava rotta. Ora la copertina è di nuovo la miniatura del primo video, con un indirizzo http. L'impostazione «Copertina» è stata tolta, e le copertine rotte già salvate vengono sistemate da sole.
- **Bunkr sul telefono:** se un dominio Bunkr non risponde o è bloccato dall'operatore (arriva un'altra pagina al posto di Bunkr), l'estensione prova da sola gli altri (bunkr.si, .fi, .ph, .ws, .site, .pk) e ricorda quello che funziona. Album e video si aprono dal dominio che risponde. «Non trovata» compare solo se Bunkr dice davvero che l'album non c'è. Se tutti i domini sono bloccati, la scheda lo spiega. Gli album segnati per errore «non trovata» vengono riletti.
- Più veloce: la WebView di Gofile non prepara più copertine.

## Gofile 1.11.0

- **Copertine Bunkr come quelle di Gofile:** anche gli album Bunkr hanno la copertina da 4, 2 o 1 video, secondo l'impostazione «Copertina». Il collage delle raccolte miste ora usa anche le miniature di Bunkr. Le immagini di Bunkr non si possono rielaborare da un'altra pagina, ma la WebView apre direttamente l'indirizzo di una miniatura, cioè lo stesso server, e lì si possono comporre. Le copertine degli album salvati con la 1.10 vengono rifatte una volta.

## Gofile 1.10.0

- **Anche Bunkr:** in «➕ Salva un link» puoi mettere anche link Bunkr, sia album (`bunkr…/a/…`) sia singoli video (`/f/…`, `/v/…`), su qualsiasi dominio bunkr. Un album diventa una scheda con i suoi video come episodi. Funzionano anche le raccolte: link Gofile e Bunkr con lo stesso nome finiscono nella stessa scheda.
- Per Bunkr non serve la WebView: la pagina dell'album ha già nomi, miniature e link dei file, e un album da 72 video si legge in meno di mezzo secondo. Il video si apre con la firma che dà lo stesso Bunkr al suo lettore (`glb-apisign.cdn.cr/sign`); niente Referer né cookie.
- La copertina degli album Bunkr è la miniatura del primo video così com'è: Bunkr non permette di rielaborarla per ritagliarla o farne un collage. Nelle raccolte miste il collage usa le miniature di Gofile.

## Gofile 1.9.0

- **Raccolte:** i link salvati con lo **stesso nome** diventano una scheda sola, con i video di tutti i link come episodi. Maiuscole e spazi non contano. Serve per esempio per tanti link con un video solo della stessa creator o della stessa categoria. La copertina della raccolta prende le miniature dai video di link diversi. Un link senza nome resta una scheda a sé.
- **Più veloce:**
  - le liste dei video vengono **ricordate**: Popolari legge una volta sola i link nuovi, lista e copertina insieme, poi schede e raccolte si aprono subito;
  - la scheda rilegge i link quando la **trascini in basso**, oppure da sola dopo 6 ore, per l'aggiornamento della libreria;
  - lo script si ferma appena la pagina mostra tutti i file, circa 1 s invece di 2,5;
  - si leggono 3 link alla volta;
  - quando si rilegge la scheda, la copertina non viene rifatta.

## Gofile 1.8.0

- **Copertina con più video:** nuova impostazione **«Copertina»**: 4 video in griglia 2×2 (predefinita), 2 video uno sopra l'altro, oppure 1 video. Le miniature vengono prese sparse nella cartella (la prima, l'ultima e quelle in mezzo), e a ognuna si tolgono le bande nere.
- Cambiando l'impostazione, le copertine vengono rifatte una volta, la prossima volta che apri Popolari. Le copertine della 1.7 diventano da 4 video.

## Gofile 1.7.0

- **Copertina piena:** la miniatura di Gofile è un quadrato con bande nere. Ora la WebView toglie le bande e la allarga fino a riempire tutta la copertina verticale (400×600). La copertina viene creata insieme alla lettura della cartella; per i link già salvati viene rifatta una volta sola. Se l'immagine non si riesce a fare, resta la miniatura di prima.

## Gofile 1.6.0

- **«✏️ Nome dell'ultimo link»** al posto di «Rinomina link». Sotto il titolo c'è scritto a quale link si riferisce («Per: …»); scrivi solo il nome e premi OK. Vale anche se hai appena salvato il link nella stessa visita. Il trattino `-` toglie il nome. Per gli altri link: rimettili in «Salva un link» con `link | nome nuovo`.
- Riaprendo le impostazioni, quello che hai scritto (link nuovi, nomi, link da togliere) è già applicato: non serve passare da Popolari.

## Gofile 1.5.0

- **«✏️ Rinomina link»**, una voce a parte nelle impostazioni. Toccandola si vede l'elenco di tutti i link, numerati dal più nuovo. I link senza nome si vedono come link («gofile.io/d/… (senza nome)»). Scrivi il numero e il nome (`2 | Vacanze`) e premi OK; il solo numero toglie il nome. Va bene anche `link | nome`. Riaprendo, la casella è vuota.
- In Popolari e in «Togli i link» i link più nuovi sono in cima.

## Gofile 1.4.0

- **Impostazioni come in Link universale, due voci sole:**
  - **«➕ Salva un link»:** scrivi `link | nome` (il nome è facoltativo) e premi OK. Sotto il titolo c'è l'elenco dei tuoi link. Riaprendo le impostazioni la casella è di nuovo vuota per il link dopo. Se rimetti un link già salvato con un altro nome, cambia solo il nome;
  - **«Togli i link»:** spunta i link da togliere e premi OK. Spariscono la prossima volta che apri la sorgente.
- I link messi con le versioni 1.1–1.3 vengono recuperati da soli.
- Corretto un problema della 1.3.0: per mostrare le impostazioni l'estensione leggeva le preferenze, e Mangayomi per rispondere richiamava le impostazioni. Il risultato poteva essere un ciclo e una pagina vuota.

## Gofile 1.3.0

- Nelle impostazioni si vedono solo le coppie «Link / Nome» già usate più **una vuota**. Compili Link 1 (e se vuoi Nome 1), salvi, esci e rientri: compaiono Link 2 e Nome 2, e così via fino a 15.

## Gofile 1.2.0

- Nelle impostazioni ora ci sono **riquadri separati e in ordine**: «Link 1» e «Nome 1», «Link 2» e «Nome 2»… fino a 15. Il nome è facoltativo; se manca si usa il nome della cartella. Il vecchio campo unico, dove non si poteva andare a capo, è stato tolto: i link vanno rimessi nei riquadri nuovi.
- Le schede in Popolari seguono l'ordine dei riquadri. Un riquadro vuoto o un link ripetuto vengono saltati.

## Gofile 1.1.1

- Ora compare nella lista delle estensioni anche se il filtro lingue mostra solo l'italiano (prima era «Tutte»), e anche su versioni di Mangayomi precedenti alla 0.9.96. Lì, aprendo una scheda, l'estensione dice che serve la 0.9.96.

## Gofile 1.1.0

- **Nome della scheda:** nelle impostazioni, dopo il link, puoi scrivere il nome (`https://gofile.io/d/XXXX Il mio pack`). La scheda si chiama subito così.
- **Copertine da sole:** la prima volta che apri Popolari, l'estensione carica titolo e copertina di ogni link nuovo, una cartella alla volta, e li salva. Le volte dopo l'elenco è immediato. Se Gofile in quel momento non risponde, riprova la volta dopo.
- Se Gofile non risponde, se la cartella non esiste più o se ha la password, la scheda lo dice subito invece di aspettare.

## Gofile 1.0.0 (nuova)

- Per guardare le **tue cartelle Gofile** dentro Mangayomi. Nelle impostazioni dell'estensione metti i link `https://gofile.io/d/…`, uno per riga: ogni link diventa una scheda in Popolari, e i video della cartella sono gli episodi, con miniatura. Per aprire un link al volo, incollalo nella ricerca.
- La lista la disegna il sito di Gofile: l'estensione apre la pagina nella **WebView nascosta di Mangayomi** (`evaluateJavascriptViaWebview`, serve la 0.9.96) e legge le righe, come nel browser. Il video parte con il cookie `accountToken` di quella stessa visita.
- Limiti:
  - la scheda si apre in circa 5–10 secondi;
  - le sottocartelle vanno aggiunte come link a parte;
  - i file senza anteprima non si possono aprire da qui;
  - cartelle protette da password o scadute mostrano un messaggio;
  - sulla TV Tizen non funziona, perché lì non c'è la WebView.

## PMVHaven 1.7.0

- **Asiatiche:** nuovo filtro in ricerca. Tutte, Cinese, Coreano o Giapponese. Restano solo i video il cui titolo ha caratteri cinesi (han), coreani (hangul) o giapponesi (hiragana/katakana). Non usa la ricerca «asian» del sito, perché quella trova soprattutto titoli in inglese.
- Cinese = han senza kana né hangul (un titolo giapponese scritto solo in kanji finisce qui). Giapponese = c'è hiragana o katakana. Coreano = c'è hangul.
- Si può combinare con ordine, sezione, categoria, preset e durata. Le pagine si riempiono da più ricerche del sito e si fermano quando i titoli finiscono. Popolari, Ultimi, Cerca, Profili, Il mio profilo e la riproduzione restano come prima.
- Non entrano titoli di minori, non consensuali, violenza, zoofilia o shock.

## JAV Guru 1.1.0

- **Popolari:** prima erano solo i 30 video di oggi, senza pagina 2. Ora è la classifica di tutti i più visti del sito. Ogni pagina ne legge due del sito (circa 40 video: quelle con un tag escluso non si mostrano) e si continua finché il sito ha pagine.
- **Categorie:** nel filtro ci sono le 7 categorie del sito e tutti i tag della lista (515). Sceglierne una mostra i suoi video, con le pagine dopo.
- **Classifica** (ricerca vuota, categoria su Tutte): più visti, più piaciuti e più commentati, con le pagine dopo. Oggi, settimana, mese e di sempre restano i 30 video del sito, senza un'altra pagina.
- Non ci sono le categorie di minori, quelle non consensuali, la violenza, la zoofilia e lo shock. Recenti, ricerca, scheda e video non cambiano.

## HentaiSaturn 1.0.1

- La trama ora è in cima alla descrizione, e tipo e lingua vanno in fondo. Prima Mangayomi mostrava solo «Tipo / Lingua» e la trama sembrava mancare finché non si espandeva il testo. Le serie Loli/Shota mostrano invece il messaggio del blocco.

## HentaiSaturn 1.0.0 (nuova, 18+)

- Estensione per **hentaisaturn.tv**, lo stesso motore di AnimeSaturn.
- **Popolari:** i più visti. **Recenti:** le ultime serie aggiunte. Tutte e due hanno le pagine successive.
- **Ricerca e filtri del sito:** testo, Ordine (Ultime aggiunte, A-Z, Z-A, anno, Più/Meno visti, Meglio/Peggio valutati), Lingua (Doppiato ITA / Sub ITA), Stato, Tipo (OVA, Special, ONA), Audio, Anno, Generi e Studio (si scrive il nome). Se scrivi il nome di un genere nella ricerca, cerca quel genere.
- **Scheda:** trama, generi, stato, tipo, lingua, studio, copertina ed episodi dall'ultimo al primo.
- **Video:** server HentaiSaturn (mp4, con il Referer del suo player come in AnimeSaturn) e Streamtape come riserva, tramite l'estrattore di Mangayomi. Sulla TV Tizen il server HentaiSaturn non si apre, perché lì il Referer viene tolto.
- **Personaggi minorenni:** i generi Loli e Shota non sono nei filtri. Le serie che li hanno non mostrano episodi, e cercare quelle parole non dà risultati.

## HentaiWorld 2.9.0

- **Il sito è stato rifatto (novembre 2026) e l'estensione diceva «Nessun risultato».** Aggiornata alle nuove pagine:
  - Popolari, Ricerca e filtri leggono le nuove schede dell'archivio (`a.ar`, `.ar-title`). La pagina successiva si riconosce da `rel="next"`;
  - Recenti: `/api/episodes` ora manda l'HTML delle schede invece dell'elenco JSON. Si leggono le schede degli episodi e si apre la serie;
  - scheda della serie: trama (`.dt-plot`), generi (`a.dt-genre`), stato (`.dt-tag`), episodi (`.ep-item[data-ep]`). La data di ogni episodio ora è nella scheda stessa, quindi non serve più aprire tutte le pagine degli episodi e la scheda si apre più in fretta;
  - filtro Stato: il sito ora vuole `status[]`.
- La riproduzione non cambia: la pagina dell'episodio ha ancora il link mp4.

## PMVHaven 1.6.6

- **Video simili e playlist: ora a fine video si passa al successivo.** Gli episodi arrivano a Mangayomi dall'ultimo al primo, come in AnimeWorld. Con l'ordine opposto, «Episodio 1» veniva preso per l'ultimo: il pulsante ⏭ restava spento e non partiva il successivo. Sulle schede già aperte, trascina in basso per aggiornarle.

## PMVHaven 1.6.5

- **Video simili dopo il video:** sotto «Episodio 1» ci sono altri 10 video con gli stessi tag (Episodio 2–11): prima i due tag principali insieme, poi solo il primo. Così, quando il video finisce, il player passa da solo al successivo, sul telefono con «Riproduci automaticamente il prossimo episodio» e sulla TV con il conto alla rovescia. Nelle impostazioni c'è **«Video simili dopo il video»**: Popolari e recenti (predefinito), Solo popolari, Solo recenti, Spento. I recenti cambiano spesso: se tieni dei video in libreria, con «Solo popolari» arrivano meno aggiornamenti. Le playlist non cambiano: hanno già i loro episodi.
- **Preferiti spostati tra i tag:** il pulsante della 1.6.4 era un «episodio» senza numero, e Mangayomi lo metteva in testa all'elenco: «Inizia» avrebbe aggiornato i preferiti invece di aprire il video. Ora è il primo tag della scheda, «☆ Aggiungi ai preferiti: <titolo>» (o «★ Togli dai preferiti: <titolo>»). Toccalo e scegli di cercare nella sorgente: l'estensione aggiorna i preferiti e mostra il risultato. Serve Mangayomi 0.9.96. Da ospite il tag non c'è.

## PMVHaven 1.6.4

- Preferiti dalla scheda del video, come «episodio» (sostituito nella 1.6.5).

## PMVHaven 1.6.3 / HypnoTube 1.4.5

- **Login sulla TV Samsung (app Mangayomi per Tizen):** lì il cookie della risposta di login non si può leggere. Ora, se il sito ha accettato il login ma il cookie non si vede, l'estensione chiede al sito se sei collegato: PMVHaven con la sessione, HypnoTube cercando il link «logout» nella home. Su telefono non cambia niente.

## HypnoTube 1.4.4

- **Popolari a sorpresa**: quando pesca un canale, ora lo apre ordinato per più visti (`/channels/<id>/<nome>/views/`). Prima usava l'ordine predefinito del canale, cioè i più recenti, e i primi video erano uguali a Ultimi. Provato con il canale «captions»: nessun video in comune con Ultimi.

## JAV Guru 1.0.1

- Si scarta il clip di prova da 10 secondi (Big Buck Bunny su test-videos.co.uk) che alcuni server mettono al posto del filmato.
- Si preferisce il master su premilkyway/javclan: parte con lo User-Agent di Chrome, senza Cookie né Referer. Non si aggira Cloudflare né la verifica dell'età.

## JAV Guru 1.0.0 (nuova)

- Estensione a sé per jav.guru. JAV Guru resta anche in Link universale.
- **Popolari**: classifica di oggi. **Recenti**: gli ultimi video della home, con le pagine dopo.
- **Ricerca**: codice o titolo. Con la ricerca vuota, **Categoria** (Sub inglese, JAV, senza mosaico, Amateur, Idol, 4K, FC2 e i tag più usati) e **Classifica** (oggi, settimana, mese, di sempre).
- Scheda con titolo, copertina, codice, data, studio, attrice e tag. Il video usa gli stessi player di Link universale (fino a 1080p).
- Non ci sono le categorie di minori né quelle non consensuali (loli, teen, schoolgirl, shotacon, rape). Se un video è in una di queste, non viene aperto.
- Se il sito chiede il controllo del browser o la verifica dell'età, l'estensione lo dice: tocca Webview. Non le aggira.

## PMVHaven 1.6.2

- Preset **Poppers + Blacked / BBC / BNWO**: tutti i video con il tag Poppers e almeno uno fra Blacked, BBC e BNWO, senza doppioni (circa 314 video, prima 102). Funzionano tutti gli ordini, anche Casuale. Resta anche **Poppers + Blacked (solo)**.

## Link universale 1.4.23

- La pagina successiva non è più il primo video il cui titolo contiene «next». Vale il pulsante della paginazione, `rel=next`, `/page/2/`, `/pagina/2/`, `?page=2` e `?paged=2`.
- Se la miniatura ha solo la durata e il titolo sta nel link accanto, la scheda usa quel titolo.

## Link universale 1.4.22

- **Raccolta → Gooning** nei filtri: cerca PMV, goon, hypno ed edging insieme su 10 siti (xHamster, Pornhub, xVideos, xnxx, Eporner, Porntrex, PornOne, YouJizz, Xozilla, SunPorno). Mostra tutto in un elenco unico, un sito per volta, con il nome del sito su ogni video.
- Ogni pagina usa una parola diversa (pmv, goon, hypno, edging), poi si ricomincia con le pagine successive dei siti. Restano solo i video con titoli da gooning (PMV, HMV, goon, compilation, edging, hypno, JOI…). Se scrivi un testo, lo cerca su quei siti.

## PMVHaven 1.6.1 / HypnoTube 1.4.2

- Nuovi preset in **Preset sessione**: **Poppers + Blacked** e **Poppers + BBC** (più video). Su PMVHaven devono esserci tutti e due i tag (102 e 295 video). Su HypnoTube è una ricerca con le due parole.

## BongaCams 1.0.0 (nuova)

- Dirette di BongaCams. **Popolare** mostra le ragazze con più spettatori, dalla più seguita. **Più recente** mostra le stanze nuove.
- Filtri: **Genere** (ragazze, coppie, trans, uomini), **Tag** (chi parla italiano, spagnolo, inglese… e Squirt, Lovense, BDSM, Fumo) e **Ordine** (più spettatori, in evidenza, nuove).
- Ricerca per nome tra le stanze in diretta, oppure incolla il link di una stanza.
- Video senza account fino a 1080p, con audio. Il player parte al massimo da 1080p e nel player trovi le altre qualità.
- Solo stanze in show pubblico. Se il sito chiede il controllo del browser o la verifica dell'età, l'estensione lo dice: tocca Webview.

## Stripchat 1.3.20

- **Popolare = più spettatori:** ragazze in diretta ordinate dalla più seguita, per esempio 5.861 spettatori, poi 3.473 e così via. L'elenco viene dall'API pubblica di Stripchat, quindi si carica senza login e senza la Webview.

## Chaturbate 1.3.5

- **Dirette che non partivano:** nelle stanze che trasmettono in 4K (2160p) il player partiva dal 4K, troppo pesante per il telefono. Ora parte al massimo da 1080p; il 4K resta sceglibile nel player.
- Se l'elenco delle qualità non si legge, l'estensione riprova con un link nuovo invece di passare subito al link «Auto», che sull'iPhone resta a girare.

## Link universale 1.4.21

- **Niente più caricamento infinito:** se un sito non finisce di caricare l'elenco in 35 secondi (la ricerca in 60), compare un errore che dice dove si è fermato. Mostra la richiesta in attesa e l'ultima risposta del sito, con codice, dimensione, tempo e titolo della pagina. Serve a capire perché Pornhub dal telefono resta a caricare finché non si apre la Webview.

## Link universale 1.4.20

- **MegaTube:** alcuni risultati della ricerca davano errore 404 perché il sito li scrive senza «/» finale. Ora, se la pagina non esiste, l'estensione riprova con la barra.
- Ho provato tutti i 63 siti pronti (elenco, ricerca, scheda e video): funzionano. Da verificare sul telefono Eporner, HQporner e PornMZ, che dal server di prova non lasciano scaricare il video.

## Link universale 1.4.19

- **Nuovi siti hentai pronti:** HentaiMama, Hentaigasm, HentaiStream e HentaiFreak (elenco, ricerca, episodi e video provati). Si aggiungono a HentaiWorld.
- I siti WordPress con il tema DooPlay caricano il player solo quando scegli il server. Ora l'estensione lo chiede da sola, e questo aiuta anche altri siti anime e hentai fatti così.
- hentaihaven.xxx, hanime.tv, ohentai.org e muchohentai.com hanno una verifica anti-bot: si aprono solo dalla Webview.

## Stripchat 1.3.19

- La ricerca usa la stessa chiamata del sito. Se non risponde, compare un errore.
- Più recente mostra i consigli di oggi, nell'ordine del sito. Se non arrivano, compare un errore.
- Se il sito non riconosce l'accesso, in cima all'elenco c'è la versione, l'indirizzo e user=no.

## Stripchat 1.3.18

- Preferiti: prima si chiede la config del sito su ita.stripchat.com, poi su stripchat.com. Se lo stesso cookie c'è due volte, si tiene l'ultimo valore non vuoto.
- Popolare è solo il blocco «in evidenza», nell'ordine del sito. Se quel blocco non arriva, compare un errore invece di un altro elenco.

## Stripchat 1.3.17

- L'estensione usa stripchat.com per la Webview e per tutte le richieste. Il sito italiano si usa solo se stripchat.com non risponde.

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
