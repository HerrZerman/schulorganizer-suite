# SternWerk Elternapp - TODO

## Projektstruktur & Setup
- [x] Datenmodell und TypeScript-Typen definieren
- [x] App-Logo generieren
- [x] Branding in app.config.ts konfigurieren
- [x] Theme-Farben anpassen (Erwachsenen-orientiert)

## Dashboard (Home Screen)
- [x] Kinder-Liste mit Cards implementieren
- [x] Kind-Card mit Avatar, Name, Klasse, Sterne-Stand
- [x] Letzte Aktivität anzeigen
- [x] "Kind hinzufügen" Button
- [ ] Navigation zu Kind-Detail

## Freigaben-Screen
- [x] Liste wartender Wünsche
- [x] Wunsch-Card mit Kind-Info, Titel, Kosten, aktueller Stand
- [x] "Freigeben" Button (grün)
- [x] "Ablehnen" Button (grau)
- [x] Verlauf genehmigter/abgelehnter Wünsche
- [ ] Status-Update an Kinderapp (später)

## Aufgaben-Screen
- [x] Aufgaben-Liste nach Datum gruppiert
- [x] Filter nach Kind
- [x] "Neue Aufgabe" Modal
- [x] Aufgabe erstellen (Kind, Titel, Fach, Fälligkeitsdatum, Sterne)
- [ ] Aufgabe bearbeiten
- [x] Aufgabe löschen (Long-Press)
- [ ] Sync mit Kinderapp (später)

## Hefte-Galerie
- [x] Hefte-Grid (2 Spalten)
- [x] Filter nach Kind und Fach
- [x] Heft-Card mit Foto-Preview, Kind, Fach, Datum, Thema, Status
- [x] Heft-Detail-Ansicht mit großem Foto
- [ ] Pinch-to-Zoom für Fotos
- [x] Status-Badges (Verstanden, Schwierig)
- [x] Notizen-Feld für Eltern

## Profil-Screen
- [ ] Kinder-Verwaltung (Hinzufügen, Bearbeiten, Löschen)
- [ ] Sterne-Regeln konfigurieren
- [ ] Push-Benachrichtigungen Einstellungen
- [ ] Wochenbericht/Statistiken
- [ ] Daten exportieren
- [x] Daten löschen

## Navigation
- [x] Bottom Tab Bar mit 5 Tabs
- [x] Tab-Icons konfigurieren
- [x] Haptic Feedback für Tabs

## Datenverwaltung
- [x] AsyncStorage Helper-Funktionen
- [x] Kinder CRUD-Operationen
- [x] Wünsche CRUD-Operationen
- [x] Aufgaben CRUD-Operationen
- [x] Hefte Lese-Operationen
- [ ] Daten-Sync zwischen Eltern- und Kinderapp (später)

## Testing & Optimierungen
- [ ] Unit-Tests für Datenlogik
- [ ] Manuelle Tests aller Flows
- [ ] Performance-Optimierungen
- [ ] Accessibility-Checks

## Dokumentation
- [ ] README.md aktualisieren
- [ ] Projektstruktur-Dokumentation
- [ ] Kommentare in Code (Deutsch)
