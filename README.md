# Spritzenetiketten
Daten zu Spritzenetiketten nach [Empfehlung der DIVI](https://www.divi.de/service/spritzenetiketten) im JSON Datenformat.

Die Daten beziehen sich lediglich auf Aspekte der Darstellung und sind dafür gedacht eine Datengrundlage für Anwendungen zu bieten, die Etiketten nach dieser Empfehlung erstellen.

## Datenumfang
- [X] 23 Wirkstoffgruppen
- [X] 157 Wirkstoffe
- [X] 628 Etiketten-Varianten für Große, Kleine, Add-on und Leitungsetiketten
- [X] Stil und Farben für Hintergrund und Text
- [X] Variationen der Schriftgröße
- [X] Tall Man Lettering
- [ ] DSEC Information (In Arbeit, bisher nur Leitungsetiketten)

## Schema
Für die JSON-Dateien gibt es in `schema/` die entsprechenden [JSON-Schema](json-schema.org) Dateien. Dort ist auch der Aufbau der Daten beschrieben.

## Text
- `<tag inhalt>`: `inhalt` soll besonders formatiert werden. `tag` gibt die Art der Formatierung vor.
- `<tag,tag inhalt`: `inhalt` soll anhand beider `tag`s formatiert werden.
- `<farbe ...>`: Textfarbe. Farbauswahl ist unter der `namedColors` Eigenschaft definiert
- `<var ...>`: Variabel. Darzustellen als weißer Platzhalter für handschriftliche Eintragungen. Länge des Platzhalters soll von Länge des `inhalt`s abhängig sein. Beispiel: `<var ----->` soll einen Platzhalter in der Länge von circa 5 Buchstaben beschreiben.
- `<check ...>`: Kontrollkästchen. Soll als Kontrollkästchen zum handschriftlich Ankreuzen dargestellt werden. Hintergrund entsprechend weiß.
- `<bold ...>`: Fettgedruckt.
- `<sub ...>`: Tiefgestellt.

## Anmerkungen
- Wirkstoffgruppen sind in den verschiedenen Dokumenten der DIVI Empfehlung nicht einheitlich benannt. Hier wurde jeweils eine Auswahl getroffen.
- Je nach Dokument der Empfehlung sollen entweder für die ganze Gruppe Hypnotika oder nur für einzelne Varianten die Ziffern in rot gefärbt werden. In diesen Daten ist Zweiteres dargestellt.

## Details
|Gruppe|Wirkstoffe|Varianten|
|---|---|---|
|**Gesamt**|157|628||Hypnotika|8|41|
|Benzodiazepine|6|25|
|Benzodiazepin-Antagonisten|1|3|
|Muskelrelaxantien|7|29|
|Muskelrelaxans-Antagonisten|2|5|
|Opioide|12|71|
|Opioid-Antagonisten|1|3|
|Vasopressoren|8|41|
|Vasodilatatoren|13|56|
|Lokalanästhetika|5|35|
|Anticholinergika|4|12|
|Cholinergika|2|7|
|Antiemetika|7|23|
|Antikoagulantien|9|33|
|Koagulantien|2|5|
|Antiarrhythmika|10|43|
|Antikonvulsiva|4|14|
|Bronchodilatatoren|6|29|
|Elektrolyte|13|38|
|Hormone|12|45|
|Inodilatatoren|5|12|
|Sonstige|20|58|

