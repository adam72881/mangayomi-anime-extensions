# Mangayomi Anime Extensions

Estensioni anime e video per l'app [Mangayomi](https://github.com/kodjodevf/mangayomi) (iOS / Android / desktop).

🔞 Alcune sorgenti sono per soli maggiorenni.

## Installazione

In Mangayomi: **Impostazioni → Browse → repository anime**, incolla:

```
https://raw.githubusercontent.com/adam72881/mangayomi-anime-extensions/main/anime_index.json
```

Poi in **Browse → Anime Extensions** installa le sorgenti che vuoi. Per gli aggiornamenti: refresh del repository e tocca aggiorna.

## Sorgenti

| Sorgente | Sito | Lingua | Contenuto |
|---|---|---|---|
| **AnimeWorld** | animeworld.ac | IT | Anime sub/dub ITA: ordine, stato, lingua, 45 generi |
| **HentaiWorld** | hentaiworld.me | IT | Hentai 18+: Sub ITA / Sub ENG / Dub ITA, generi, stato, trama |
| **HypnoTube** | hypnotube.com | EN | Video 18+: categorie, ordini, ricerca, playlist, profili |
| **PMVHaven** | pmvhaven.com | EN | PMV 18+: ordini, categorie, ricerca, playlist, profili, «Mai visti» |

Se un sito cambia dominio: apri le impostazioni della sorgente e aggiorna il campo **Dominio**.

## Struttura

| File | Cosa |
|---|---|
| `anime_index.json` | Indice che legge l'app |
| `src/*.js` | Codice delle sorgenti (JavaScript, `DefaultExtension extends MProvider`) |
| `HANDOFF.md` | Stato del lavoro, dettagli tecnici e limiti dell'app |

Ogni modifica a un file `src/*.js` richiede di alzare `version` **sia nel file sia in `anime_index.json`**, altrimenti l'app non scarica il codice nuovo.

---

Le estensioni **manga** (Mihon / Tachimanga) sono in un repo separato: [manga-ita-extensions](https://github.com/adam72881/manga-ita-extensions) («Manga ITA»).
