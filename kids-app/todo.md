# Project TODO - SchulOrganizer Suite

## Kinderapp: "Mein SchulOrganizer"

### Phase 1: Grundstruktur & Navigation
- [x] App-Konfiguration anpassen (Name, Logo, Branding)
- [x] Theme-Farben definieren (Pastell-Palette)
- [x] Tab-Navigation erstellen (Home, Hefte, Aufgaben, Termine, Profil)
- [x] Icon-Mappings hinzufügen)
- [x] ScreenContainer für alle Screens

### Phase 2: Home Screen
- [x] Header mit Avatar und Sterne-Counter
- [x] 4 große Kacheln (Hefte, Aufgaben, Termine, Shop)
- [x] Navigation zu den jeweiligen Screens

### Phase 3: Hefte-Feature
- [x] Hefte-Übersicht mit Grid-Layout
- [x] Foto-Upload (Kamera + Galerie)
- [x] Fach-Filter (Mathe, Deutsch, Sachkunde, etc.)
- [x] Hefte-Detail-Screen mit Foto-Anzeige
- [x] "Verstanden" Button mit Sterne-Belohnung
- [x] Lokale Speicherung (AsyncStorage)

### Phase 4: Aufgaben & Termine
- [x] Aufgaben-Liste mit Checkboxen
- [x] Neue Aufgabe hinzufügen (Modal)
- [x] Aufgabe abhaken → Sterne verdienen
- [x] Termine-Kalender (Monatsansicht)
- [x] Neuer Termin hinzufügen
- [ ] Erinnerungen (Push Notifications)

### Phase 5: Belohnungssystem
- [x] Sterne-Counter (global, persistent)
- [x] Sterne verdienen bei Aktionen)
- [x] Wunschliste erstellen
- [x] Wunsch hinzufügen (Modal)
- [x] Wunsch einlösen (Freigabe-Status)
- [x] Sterne-Shop Screen

### Phase 6: Profil & Einstellungen
- [x] Profil-Screen mit Avatar
- [ ] Theme-Wechsler (Standard, Huntrix, Kaninchen-Land)
- [ ] Hintergrund-Auswahl
- [x] Statistik-Anzeige (Sterne, Aufgaben)

### Phase 7: Datenmodell & State Management
- [x] TypeScript Interfaces definieren
- [x] AsyncStorage Helper-Funktionen
- [ ] Context für globalen State (Sterne, Profil)
- [ ] Daten-Persistierung

---

## Elternapp: "SternWerk"

### Phase 1: Projekt-Setup
- [ ] Neues Expo-Projekt initialisieren
- [ ] Branding anpassen (Name, Logo)
- [ ] Theme-Farben (Professionell: Navy, Mint, Coral)

### Phase 2: Dashboard
- [ ] Kind-Profil-Karte
- [ ] Übersichts-Statistiken (Aufgaben, Sterne, Themen)
- [ ] Freigaben-Bereich
- [ ] Navigation (Dashboard, Kinder, Regeln, Berichte)

### Phase 3: Freigaben & Kontrolle
- [ ] Wunsch-Freigaben (Approve/Reject)
- [ ] Spielzeit-Freigaben
- [ ] Push-Benachrichtigungen bei Anfragen

### Phase 4: Sterne-Verwaltung
- [ ] Sterne-Regeln definieren (pro Aktivität)
- [ ] Bonus-Sterne vergeben
- [ ] Limits festlegen (pro Tag/Woche)

### Phase 5: Lerninsights
- [ ] Schwierige Themen anzeigen
- [ ] Extra-Übungen-Verlauf
- [ ] Wochenbericht (Text-Übersicht)

---

## Backend & Sync (Optional für MVP)

### Phase 1: Backend-Setup
- [ ] Datenbank-Schema definieren (Drizzle ORM)
- [ ] User-Auth (Eltern + Kind-Accounts)
- [ ] API-Endpunkte (tRPC)

### Phase 2: Cloud-Sync
- [ ] Offline-First Sync-Strategie
- [ ] Konflikt-Auflösung
- [ ] Foto-Upload zu S3
- [ ] Push Notifications Setup

### Phase 3: KI-Features (V1, nicht MVP)
- [ ] OCR-Integration (Tesseract oder Cloud)
- [ ] Handschrifterkennung
- [ ] Thema-Erkennung (LLM)
- [ ] Übungs-Generator (LLM)

---

## Testing & Dokumentation

### Testing
- [ ] Unit Tests für Kernlogik
- [ ] Integration Tests für Sync
- [ ] E2E Tests für User-Flows
- [ ] Test auf iOS (Simulator + Device)
- [ ] Test auf Android (Emulator + Device)
- [ ] Test auf Tablet (iPad, Android Tablet)

### Dokumentation
- [ ] README.md (Setup, Installation)
- [ ] Architektur-Diagramm
- [ ] API-Dokumentation
- [ ] Datenmodell-Dokumentation
- [ ] User-Guide (Eltern)
- [ ] User-Guide (Kinder)
- [ ] Datenschutz-Konzept (DSGVO)

### GitHub
- [ ] Repository erstellen
- [ ] .gitignore konfigurieren
- [ ] Commit-Konventionen
- [ ] Branch-Strategie (main, develop, feature/*)
- [ ] CI/CD Pipeline (GitHub Actions)

---

## Deployment & Launch

### App Store Vorbereitung
- [ ] App Store Screenshots (5-10 Stück)
- [ ] App Store Beschreibung (DE + EN)
- [ ] Privacy Policy erstellen
- [ ] Terms of Service erstellen
- [ ] App Store Metadata

### Legal & Compliance
- [ ] Markenrechts-Prüfung (App-Name)
- [ ] DSGVO-Compliance prüfen
- [ ] Datenschutzerklärung
- [ ] Impressum

### Launch
- [ ] Beta-Testing (TestFlight, Google Play Beta)
- [ ] Feedback sammeln
- [ ] Bugfixes
- [ ] App Store Submission (iOS)
- [ ] Google Play Submission (Android)

---

## Aktueller Status
- [x] Anforderungen analysiert
- [x] Design-Konzept erstellt
- [x] Logo generiert (realistisch)
- [x] Kinderapp initialisiert
- [ ] Navigation implementieren (NEXT)

### Neue Features (User-Request)
- [x] Foto-Upload für Aufgaben (Beweis für Eltern, z.B. aufgeräumtes Zimmer)
- [x] Foto-Upload für Termine (z.B. Sportereignis-Foto)
- [x] Foto-Galerie in Aufgaben-Detail-Ansicht
- [x] Foto-Galerie in Termin-Detail-Ansicht

## Smartwatch-Version (Garett Kids)

### Phase 1: Grundfunktionen
- [ ] Smartwatch-App initialisieren (React Native für Android)
- [ ] UI für kleinen Bildschirm (240x240px)
- [ ] Aufgaben-Liste (nur Text, Checkboxen)
- [ ] Termine-Liste (nur Text, Datum)
- [ ] Sterne-Counter anzeigen

### Phase 2: Sync-Funktionalität
- [ ] Bluetooth-Sync zwischen Smartphone und Smartwatch
- [ ] Google Calendar Integration für Termine
- [ ] Bidirektionale Sync (Aufgaben abhaken auf Uhr → Smartphone)
- [ ] Sterne-Sync (Smartphone → Smartwatch)

### Phase 3: Kamera-Integration
- [ ] Foto-Aufnahme auf Smartwatch (falls Kamera vorhanden)
- [ ] Foto-Transfer via Bluetooth zum Smartphone
- [ ] Foto als Beweis zu Aufgabe hinzufügen

### Phase 4: Testing & Deployment
- [ ] APK für Garett Smartwatch bauen
- [ ] Installation via ADB testen
- [ ] Bluetooth-Verbindung testen
- [ ] Sync-Performance optimieren

### Phase 5: APK-Transfer & Installation
- [ ] Smartwatch-APK in Smartphone-App einbetten (assets/)
- [ ] "Smartwatch verbinden"-Screen in Elternapp
- [ ] Bluetooth-Pairing-Dialog
- [ ] APK-Transfer via Bluetooth
- [ ] Installation-Anleitung (Schritt-für-Schritt)
- [ ] Automatische Verbindungs-Prüfung
- [ ] GitHub: Beide Apps in Monorepo organisieren

### Automatische Bild-Suche für Wünsche
- [x] Image Search API integrieren (Pixabay)
- [x] Automatische Bildsuche beim Hinzufügen eines Wunsches
- [x] Bild-Auswahl-Dialog (3-5 Vorschläge)
- [x] Fallback: Manueller Foto-Upload (Bild entfernen)
- [x] Bild-Anzeige in Wunschliste


## 🐛 Bugfixes & Verbesserungen (User-Feedback)

### 1. UI-Design verbessern
- [x] Home Screen: Kacheln größer und farbiger machen
- [ ] Hefte Screen: Grid-Layout mit größeren Bildern
- [ ] Aufgaben Screen: Checkboxen größer und deutlicher
- [ ] Termine Screen: Kalender übersichtlicher gestalten
- [ ] Shop Screen: Produktbilder prominenter anzeigen
- [ ] Profil Screen: Statistiken visueller darstellen
- [x] Generelle UI-Verbesserungen basierend auf Screenshots (Home)

### 2. Foto-Upload reparieren
- [ ] Foto-Upload in Hefte testen und fixen
- [ ] Foto-Upload in Aufgaben testen und fixen
- [ ] Foto-Upload in Termine testen und fixen
- [ ] Kamera-Permissions prüfen
- [ ] Galerie-Permissions prüfen
- [ ] Fehlerbehandlung bei fehlgeschlagenen Uploads

### 3. Kategorien-System überarbeiten- [x] Termine: Kategorien ändern von Schulfächern zu: Schule, Arzt, Mama, Papa, Freundin, Hobby, Sport, etc.
- [ ] Aufgaben: Kategorien ändern zu: Haushalt, Schule, Hobby, Familie, etc.
- [ ] Hefte: Nur Schulfächer (Mathe, Deutsch, etc.) - bleibt so
- [ ] Kontakt-Fotos für Kategorien (z.B. Foto von Mama, Papa, Arzt) - TODO: Später- [x] Icon-Auswahl für Kategorien
### 4. Eltern-Kontrolle implementieren
- [ ] Kind kann KEINE Aufgaben selbst erstellen (nur Eltern)
- [ ] Kind kann KEINE Kategorien bei Heften hinzufügen (nur Eltern)
- [ ] Kind kann nur: Hefte fotografieren, Aufgaben abhaken, Termine ansehen
- [ ] Elternapp: Aufgaben für Kind erstellen
- [ ] Elternapp: Kategorien verwalten
- [ ] Elternapp: Mehrere Kinder unterstützen
- [ ] Elternapp: Proben/Tests fotografieren (für Nachhilfelehrer)
- [ ] Elternapp: Hefte-Galerie ansehen (alle Fotos vom Kind)

### 5. Bildgenerator fixen
- [ ] Pixabay API-Key prüfen
- [ ] Fehlerbehandlung bei API-Aufruf
- [ ] Fallback: Emoji-Icons wenn Bildsuche fehlschlägt
- [ ] Test mit echten Suchanfragen (Nintendo Switch, T-Shirt, etc.)

### 6. Wunschlisten-System erweitern
- [ ] Kind kann Wünsche erstellen (z.B. "Pferd" - 5 Sterne)
- [ ] Eltern können Wünsche anpassen (z.B. "Pferd bis 15€" - 15 Sterne)
- [ ] Eltern können Wünsche ablehnen
- [ ] Eltern können Wünsche genehmigen
- [ ] Eltern können Sterne-Preis ändern
- [ ] Eltern können Beschreibung hinzufügen (z.B. "nur bis 15€")
- [ ] Notifications: Kind wird benachrichtigt wenn Eltern Wunsch bearbeitet haben

### 7. App-Zeit-Steuerung (Bonus-Feature)
- [ ] Recherche: Google Family Link API
- [ ] Recherche: Android Digital Wellbeing API
- [ ] Konzept: Sterne gegen App-Zeit tauschen (z.B. 20 Sterne = 20 Min TikTok)
- [ ] Integration mit Family Link (falls möglich)
- [ ] Fallback: Timer in der App (Eltern müssen manuell freigeben)
- [ ] Elternapp: App-Zeit-Regeln festlegen
- [ ] Kinderapp: Verbleibende App-Zeit anzeigen
- [ ] Notifications: "Deine TikTok-Zeit läuft in 5 Min ab"
