# Mangayomi Anime Extensions

Estensioni anime e video per l'app [Mangayomi](https://github.com/kodjodevf/mangayomi) (iOS / Android / desktop).

🔞 Alcune sorgenti sono per soli maggiorenni.

> 🇬🇧 **English** — Anime and video extensions for Mangayomi: an Italian anime source (AnimeWorld) and three 18+ video sources (HentaiWorld, HypnoTube, PMVHaven). Add this anime repository in Mangayomi (**Settings → Browse → anime repository**):
>
> `https://raw.githubusercontent.com/adam72881/mangayomi-anime-extensions/main/anime_index.json`
>
> One-tap install link (open it on the device where Mangayomi is installed):
> `mangayomi://add-repo?repo_name=adam72881&repo_url=https://github.com/adam72881/mangayomi-anime-extensions&anime_url=https://raw.githubusercontent.com/adam72881/mangayomi-anime-extensions/main/anime_index.json`
>
> | Source | Site | Language | Highlights |
> |---|---|---|---|
> | AnimeWorld | animeworld.ac | IT (sub/dub) | sort, status, dub filter, 45 genres, episode air dates and thumbnails (AniList) |
> | HentaiWorld 🔞 | hentaiworld.me | IT/EN subs, IT dub | multi-select genres and languages, episode thumbnails and dates |
> | HypnoTube 🔞 | hypnotube.com | EN | channels, sorts, search, playlists; 720p with a (free) account |
> | PMVHaven 🔞 | pmvhaven.com | EN | tag filters with every sort, trending, playlists, HLS quality picker (360p–2160p) |
> | Link universale 🔞 | any site | any | paste a video, series or site link: finds the video (direct mp4/HLS, common embed players), episodes and the site's video list |
>
> No Cloudflare/anti-bot bypass: logins only use your own account.

## Link universale

Sorgente per i siti che non hanno un'estensione. Nella **ricerca** incolla un link:

- **link di un video** → la voce «▶ titolo» in cima apre il video (con le qualità trovate nella pagina);
- **link di una serie** (es. una pagina anime) → la scheda mostra gli episodi;
- **link di un sito** (es. la home) → la lista dei video/serie della pagina, e scorrendo le pagine successive.

I link aperti restano in **Popolari**; scrivendo una parola senza link cerchi tra quelli.
Provata con AnimeSaturn, HentaiWorld, Pornhub, xVideos, xHamster, Eporner, RedTube e YouPorn (questi ultimi due solo 360p).
Non funziona con i siti protetti da Cloudflare o anti-bot (es. SpankBang) né con i player che si costruiscono solo nel browser.

## Installazione

In Mangayomi: **Impostazioni → Browse → repository anime**, incolla:

```
https://raw.githubusercontent.com/adam72881/mangayomi-anime-extensions/main/anime_index.json
```

Poi in **Browse → Anime Extensions** installa le sorgenti che vuoi. Per gli aggiornamenti: refresh del repository e tocca aggiorna.

## Ultime novità

- **Link universale 1.0.0** — nuova sorgente: incolli nella ricerca il link di un video, di una serie o di un sito e la apre come le altre (vedi sotto).
- **PMVHaven 1.6.0** — categoria Estremi (solo i video segnati dal sito come contenuto estremo).
- **HentaiWorld 2.8.0** — Raccolta → Estremi come classifica (più generi estremi insieme, i più rari pesano di più), con Scat, Watersports e Horror.
- **AnimeWorld 1.5.0** — «Più recente» uguale agli «Ultimi Episodi» della home del sito.
- **HentaiWorld 2.5.0** — «Più recente» uguale agli «Episodi usciti recentemente» della home del sito.
- **HypnoTube 1.4.1** — niente più doppioni scorrendo le playlist; «Casuale» va avanti in ordine invece di ripetere le pagine.
- **PMVHaven 1.5.2** — Qualità preferita con tutte le scelte del player: 4K, 2K, 1080p… e «Massima disponibile».
- **AnimeWorld 1.4.0 / HentaiWorld 2.4.0 / HypnoTube 1.4.0** — date e miniature degli episodi, generi e lingue a spunta su HentaiWorld, qualità preferita su HypnoTube.
- **PMVHaven 1.5.0 / HypnoTube 1.3.0 / AnimeWorld 1.3.0** — filtri e ordini sistemati: HMV + Più visti mostra davvero HMV, categorie e ordini funzionano insieme, Blacked su HypnoTube, genere cercando il nome su AnimeWorld.
- **PMVHaven 1.4.2** — categoria Blacked (al posto di Blackedraw): 941 playlist invece di 6; la lista playlist si ferma alla fine dei risultati.
- **HentaiWorld 2.2.0** — cercando il nome di un genere (es. «yuri») si apre tutto il genere, non solo i titoli con quella parola.
- **HypnoTube 1.2.1 / PMVHaven 1.4.1** — accesso salvato nelle impostazioni della sorgente: HypnoTube dà il 720p vero (basta l'account gratuito), PMVHaven apre Il mio profilo senza WebView.
- **HypnoTube 1.1.9 / PMVHaven 1.3.1** — playlist «in corso», così l'aggiornamento della libreria le controlla anche se salti le serie finite; HypnoTube mostra tutte le qualità che manda il sito.
- **PMVHaven 1.3.0** — scegli la qualità (360p…1080p, Auto, Originale); di default 720p, che carica a pezzi e non si blocca più ogni pochi secondi.
- **1 novembre 2026 — Repo dedicato.** Le estensioni hanno ora un repo tutto loro. Se avevi il vecchio indirizzo (`it-ext-repo/mangayomi/...`), sostituiscilo con quello qui sopra.
- **PMVHaven 1.2.0** — un solo filtro Ordine per video e playlist; categoria **Mai visti** per nascondere i video già aperti.
- **HypnoTube 1.1.8 / PMVHaven 1.1.9** — **Popular a sorpresa**: Popolari cambia ordine o categoria a ogni apertura (si spegne dalle impostazioni della sorgente).

Tutte le versioni: [CHANGELOG](CHANGELOG.md) · Stato tecnico e come continuare: [HANDOFF](HANDOFF.md)

## Sorgenti

| Sorgente | Versione | Sito | Lingua | Contenuto |
|---|---|---|---|---|
| **AnimeWorld** | 1.5.0 | animeworld.ac | IT | Anime sub/dub ITA: ordine, stato, lingua, 45 generi |
| **HentaiWorld** | 2.8.0 | hentaiworld.me | IT | Hentai 18+: Sub ITA / Sub ENG / Dub ITA, generi, stato, trama |
| **HypnoTube** | 1.4.1 | hypnotube.com | EN | Video 18+: categorie, ordini, ricerca, playlist, profili |
| **PMVHaven** | 1.6.0 | pmvhaven.com | EN | PMV 18+: qualità a scelta, ordini, categorie, ricerca, playlist, profili, «Mai visti» |

Se un sito cambia dominio: apri le impostazioni della sorgente e aggiorna il campo **Dominio**.

## Struttura

| File | Cosa |
|---|---|
| `anime_index.json` | Indice che legge l'app |
| `src/*.js` | Codice delle sorgenti (JavaScript, `DefaultExtension extends MProvider`) |
| `CHANGELOG.md` | Novità di ogni versione |
| `HANDOFF.md` | Stato del lavoro, dettagli tecnici e limiti dell'app |

Ogni modifica a un file `src/*.js` richiede di alzare `version` **sia nel file sia in `anime_index.json`**, altrimenti l'app non scarica il codice nuovo.

---

Le estensioni **manga** (Mihon / Tachimanga) sono in un repo separato: [manga-ita-extensions](https://github.com/adam72881/manga-ita-extensions) («Manga ITA»).
