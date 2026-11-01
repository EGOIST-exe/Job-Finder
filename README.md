# Jobkompass · Job-Finder

Spielerische Berufsorientierung von **EGOIST**. Eine deutsche, responsive Website für GitHub Pages – ohne Backend, npm-Abhängigkeiten, API-Schlüssel oder Anmeldung.

- **552 Berufsideen in 30 Berufsfeldern**, durchsuchbar nach Titel, Beschreibung und Bereich.
- **27 Quizschritte**: 16 Fragen als MBTI-Impuls (je 4 pro Achse, bis zu 4 Antworten), 8 Interessenssituationen mit je 6 Antworten, persönliche Interessen, 10 Prioritäten und 6 optionale Arbeitsumgebungen.
- Erklärbares Matching: **60 % Interessen, 25 % Arbeitswünsche, maximal 15 % MBTI**.
- Alle 16 MBTI-Typen; ausgeglichene Achsen bleiben als `X` offen. Ein bekannter Typ kann optional angegeben werden.
- Merkliste, fortsetzbares Quiz und Export der Ergebnisse bzw. Merkliste als Textdatei.
- Lokale Speicherung, Tastaturbedienung, mobile Layouts und reduzierte Animation bei entsprechender Systemeinstellung.

## Lokal starten

Node.js 22 oder neuer, empfohlen Node.js 24:

```sh
npm run dev
```

Vorschau: [http://127.0.0.1:4173](http://127.0.0.1:4173). Kein `npm install` nötig. JavaScript-Module benötigen einen HTTP-Server; `index.html` nicht direkt über `file://` öffnen.

```sh
npm test
npm run build
```

`dist/` enthält die fertige statische Seite. Alle Asset-Pfade sind relativ, sodass auch der GitHub-Pages-Unterpfad `/Job-Finder/` funktioniert.

## Auf GitHub Pages veröffentlichen

Der Workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) prüft und baut Pull Requests. Bei einem Push auf `main` oder manuellem Start veröffentlicht er die Seite.

1. Änderungen in das Repository `EGOIST-exe/Job-Finder` pushen.
2. Im Repository **Settings → Pages → Build and deployment → Source: GitHub Actions** einstellen.
3. Unter **Actions → Deploy Jobkompass to GitHub Pages** den erfolgreichen Deploy prüfen; bei Bedarf über **Run workflow** starten.

Die vorgesehene URL ist `https://egoist-exe.github.io/Job-Finder/`. Sie ist erst nach Aktivierung von Pages und einem erfolgreichen Deploy verfügbar. GitHub-Voraussetzungen zur Sichtbarkeit und zum Tarif beachten: [GitHub Pages mit eigenen Workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Inhalt und Berechnung

- `data.js`: redaktioneller Berufekatalog, Interessensprofile, Kategorien und Quizfragen.
- `matching.js`: reine Funktionen für Auswertung, Rangfolge und Prüfung gespeicherter Antworten.
- `app.js`: Oberfläche, Routing, Filter, Dialoge, Speicherung und Export.
- `styles.css`: Design und responsive Darstellung. Die Illustration und Icons sind lokale SVGs; es werden keine externen Schriften geladen.

Die Interessensprofile orientieren sich an sechs Richtungen: praktisch, forschend, kreativ, sozial, unternehmerisch und strukturierend. Ausgewählte Interessen werden stärker gewichtet als einzelne Situationsantworten. Die Ähnlichkeit zu einem Beruf wird als gewichteter Mittelwert seiner Interessensmerkmale berechnet. Werte und Umgebungen zählen als Übereinstimmungsanteile; falls beide gewählt wurden, werden sie gleich gewichtet. Der MBTI-Impuls nutzt die höchste Buchstabenübereinstimmung mit den pro Berufsfeld hinterlegten Typen. Ausgeglichene Achsen werden ausgelassen. Fehlende Faktoren werden aus dem Gesamtwert entfernt; verbleibende Gewichte werden neu normiert.

Der Orientierungswert ist **keine Eignungsbewertung, Erfolgswahrscheinlichkeit oder wissenschaftlich validierte Diagnose**. Die Profile sind vereinfachte redaktionelle Annahmen, teilweise auf Ebene des Berufsfelds. Es gibt keine Filterung nach Persönlichkeitstyp. Abschlüsse, Fähigkeiten und individuelle Voraussetzungen werden nicht bewertet. Tätigkeiten, Bezeichnungen und Zugangswege sollten für den konkreten Beruf in [BERUFENET](https://web.arbeitsagentur.de/berufenet/) und aktuellen Stellenanzeigen geprüft werden.

## Datenschutz

Antworten, Fortschritt und Merkliste liegen unter `jobkompass:v1` im `localStorage` des Browsers. Über **Datenschutz → Alle lokalen Daten löschen** lassen sie sich entfernen. Kein Tracking, keine externen KI-Anfragen. Der Hostinganbieter verarbeitet die üblichen technischen Verbindungsdaten. Bei externer Veröffentlichung gegebenenfalls eigene Betreiberangaben ergänzen.
