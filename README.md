# Mangayomi Anime Extensions

Estensioni anime e video per l'app [Mangayomi](https://github.com/kodjodevf/mangayomi) (iOS / Android / desktop).

🔞 Alcune sorgenti sono per soli maggiorenni.

## Installazione

In Mangayomi: **Impostazioni → Browse → repository anime**, incolla:

```
https://raw.githubusercontent.com/adam72881/mangayomi-anime-extensions/main/anime_index.json
```

Poi in **Browse → Anime Extensions** installa le sorgenti che vuoi. Per gli aggiornamenti: refresh del repository e tocca aggiorna.

## Ultime novità

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
| **AnimeWorld** | 1.2.0 | animeworld.ac | IT | Anime sub/dub ITA: ordine, stato, lingua, 45 generi |
| **HentaiWorld** | 2.2.0 | hentaiworld.me | IT | Hentai 18+: Sub ITA / Sub ENG / Dub ITA, generi, stato, trama |
| **HypnoTube** | 1.2.1 | hypnotube.com | EN | Video 18+: categorie, ordini, ricerca, playlist, profili |
| **PMVHaven** | 1.4.2 | pmvhaven.com | EN | PMV 18+: qualità a scelta, ordini, categorie, ricerca, playlist, profili, «Mai visti» |

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
