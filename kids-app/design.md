# Design-Konzept: Mein SchulOrganizer (Kinderapp)

## Zielgruppe
Grundschulkinder (Klasse 1-4, Alter 6-10 Jahre) auf Handy und Tablet (iOS/Android)

## Design-Prinzipien

### 1. Kindgerecht & Sicher
- **Große Touch-Bereiche** (min. 60x60px) für kleine Finger
- **Klare, einfache Sprache** ohne Fremdwörter
- **Visuelle Hierarchie** mit Icons und Farben statt viel Text
- **Keine Ablenkungen** - fokussiert auf Lernen und Organisation
- **Geschlossenes System** - keine externen Links oder Chat-Funktionen

### 2. Motivierend & Belohnend
- **Gamification** durch Sterne-System
- **Sofortiges Feedback** bei jeder Aktion (Haptics, Animationen)
- **Fortschrittsanzeige** sichtbar auf jedem Screen
- **Positive Verstärkung** durch freundliche Maskottchen

### 3. Intuitiv & Selbsterklärend
- **Konsistente Navigation** mit Bottom Tab Bar
- **Icon + Text Labels** für besseres Verständnis
- **Farbcodierung** pro Fach (Mathe = blau, Deutsch = orange, etc.)
- **Einfache Gesten** (Tap, Swipe) - keine komplexen Interaktionen

---

## Farbpalette (Pastell, kindgerecht)

| Farbe | Hex | Verwendung |
|-------|-----|------------|
| **Hellblau** | `#A8D8EA` | Mathe, Primärfarbe |
| **Warmes Gelb** | `#FFE5A0` | Termine, Highlights |
| **Mint Grün** | `#B8E6D5` | Aufgaben, Erfolg |
| **Soft Rosa** | `#FFD4E5` | Sachkunde, Akzente |
| **Coral Orange** | `#FFB4A2` | Deutsch, Wichtig |
| **Lavendel** | `#D4C5F9` | Profil, Settings |
| **Weiß** | `#FFFFFF` | Hintergrund, Cards |
| **Dunkelgrau** | `#4A4A4A` | Text (Primär) |
| **Hellgrau** | `#9E9E9E` | Text (Sekundär) |

---

## Screen-Struktur

### 1. Home Screen (Dashboard)
**Zweck:** Schneller Überblick über den Tag

**Layout:**
```
┌─────────────────────────────────┐
│  [Avatar]  Max      127 ⭐      │ ← Header mit Profil + Sterne
├─────────────────────────────────┤
│                                 │
│   ┌───────────┐  ┌───────────┐ │
│   │  📷 Hefte │  │ ✅ Aufgaben│ │ ← Große Kacheln (2x2 Grid)
│   └───────────┘  └───────────┘ │
│                                 │
│   ┌───────────┐  ┌───────────┐ │
│   │ 📅 Termine│  │ ⭐ Shop   │ │
│   └───────────┘  └───────────┘ │
│                                 │
├─────────────────────────────────┤
│  🏠  📚  ✅  📅  👤             │ ← Bottom Tab Bar
└─────────────────────────────────┘
```

**Elemente:**
- **Header:** Avatar (rund, 60px), Name, Sterne-Counter (animiert)
- **Kacheln:** 4 Hauptfunktionen, je 150x150px, abgerundete Ecken (20px)
- **Icons:** Große, farbige Icons (48x48px) mit Text-Label
- **Tab Bar:** 5 Tabs (Home, Hefte, Aufgaben, Termine, Profil)

---

### 2. Hefte-Screen (Foto-Archiv)
**Zweck:** Fotografierte Hefte anzeigen und verwalten

**Layout:**
```
┌─────────────────────────────────┐
│  ← Meine Hefte        🔍 [+]    │ ← Header mit Suche + Add
├─────────────────────────────────┤
│  [Filter: Alle ▼] [Mathe] [Dt] │ ← Filter-Chips
├─────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐│
│  │ [Foto]      │ │ [Foto]      ││
│  │ Mathe 🧮    │ │ Deutsch 📝  ││
│  │ 15.01.2026  │ │ 14.01.2026  ││
│  │ Plus bis 20 │ │ Buchstaben  ││
│  │ [Verstanden]│ │ [Verstanden]││
│  └─────────────┘ └─────────────┘│
│  ┌─────────────┐ ┌─────────────┐│
│  │ [Foto]      │ │ [Foto]      ││
│  │ ...         │ │ ...         ││
└─────────────────────────────────┘
```

**Elemente:**
- **Karten:** 2 Spalten, Card mit Foto-Preview (120x160px)
- **Fach-Tag:** Farbcodiert (Mathe=blau, Deutsch=orange)
- **Datum:** Klein, grau, unterhalb des Fachs
- **Thema:** Fett, schwarz, 1-2 Zeilen
- **Button:** "Verstanden ✓" (grün, 100% Breite)
- **Plus-Button:** Floating Action Button (rechts unten, 56x56px, rund)

---

### 3. Hefte-Detail Screen
**Zweck:** Einzelnes Heft im Detail mit Lernhilfen

**Layout:**
```
┌─────────────────────────────────┐
│  ← Mathe - Plus bis 20          │
├─────────────────────────────────┤
│  ┌─────────────────────────────┐│
│  │                             ││
│  │     [Großes Foto]           ││ ← Foto (Pinch-to-Zoom)
│  │                             ││
│  └─────────────────────────────┘│
│                                 │
│  📅 15.01.2026  |  Klasse 3     │
│  📝 Extrahierter Text:          │
│  "Rechne: 12+5=__, 8+7=__..."   │
│                                 │
│  ┌─────────────────────────────┐│
│  │ 💡 Erklär mir das           ││
│  │ 📊 Zeig Beispiele           ││
│  │ ✏️ Mach 5 Übungen           ││
│  │ 🎯 Quiz starten             ││
│  └─────────────────────────────┘│
│                                 │
│  [Verstanden ✓]  [Schwierig ⚠️] │
└─────────────────────────────────┘
```

**Elemente:**
- **Foto:** Vollbild-Ansicht mit Zoom-Funktion
- **Metadaten:** Datum, Klasse, Fach (Icons + Text)
- **OCR-Text:** Grauer Kasten mit extrahiertem Text
- **Lernhilfe-Buttons:** 4 Optionen, je mit Icon + Text
- **Action-Buttons:** Grün (Verstanden) + Orange (Schwierig)

---

### 4. Aufgaben-Screen (To-Do Liste)
**Zweck:** Hausaufgaben und Alltags-Aufgaben verwalten

**Layout:**
```
┌─────────────────────────────────┐
│  ← Aufgaben           [+ Neu]   │
├─────────────────────────────────┤
│  Heute - 15.01.2026             │
├─────────────────────────────────┤
│  ☐ Mathe Seite 12 rechnen       │ ← Checkbox + Text
│     📚 Mathe  |  +5 ⭐          │
│  ☑ Deutsch Wörter lernen        │ ← Erledigt (durchgestrichen)
│     📝 Deutsch  |  +3 ⭐        │
│  ☐ Zimmer aufräumen             │
│     🏠 Alltag  |  +10 ⭐        │
├─────────────────────────────────┤
│  Morgen - 16.01.2026            │
├─────────────────────────────────┤
│  ☐ HSU Plakat malen             │
│     🌍 Sachkunde  |  +8 ⭐      │
└─────────────────────────────────┘
```

**Elemente:**
- **Gruppierung:** Nach Datum (Heute, Morgen, Diese Woche)
- **Checkbox:** Große Touch-Area (44x44px), animiert beim Abhaken
- **Aufgabe:** Text (max. 2 Zeilen), Fach-Icon, Sterne-Belohnung
- **Swipe-Actions:** Links (Löschen), Rechts (Bearbeiten)
- **Plus-Button:** Header rechts, öffnet "Neue Aufgabe" Modal

---

### 5. Termine-Screen (Kalender)
**Zweck:** Schultermine und Events anzeigen

**Layout:**
```
┌─────────────────────────────────┐
│  ← Termine        [+ Neu]       │
├─────────────────────────────────┤
│  [< Januar 2026 >]              │ ← Monats-Switcher
├─────────────────────────────────┤
│  Mo Di Mi Do Fr Sa So           │
│   1  2  3  4  5  6  7           │
│   8  9 10 11 12 13 14           │
│  15 16 17 18 19 20 21           │ ← 15 = Heute (markiert)
│  22 23 24 25 26 27 28           │
│  29 30 31                       │
├─────────────────────────────────┤
│  Heute - 15.01.2026             │
├─────────────────────────────────┤
│  🔔 09:00 - Mathetest           │
│  🎨 14:00 - Kunstprojekt        │
└─────────────────────────────────┘
```

**Elemente:**
- **Kalender:** Monatsansicht mit Dots für Termine
- **Heute:** Farblich hervorgehoben (blauer Kreis)
- **Termin-Liste:** Unterhalb des Kalenders, gruppiert nach Tag
- **Icons:** Kategorie-Icons (Schule, Sport, Freizeit)
- **Spracheingabe:** Mikrofon-Button für "Termin diktieren"

---

### 6. Sterne-Shop Screen
**Zweck:** Wünsche anzeigen und mit Sternen "kaufen"

**Layout:**
```
┌─────────────────────────────────┐
│  ← Sterne Shop                  │
├─────────────────────────────────┤
│  Deine Sterne: 127 ⭐           │ ← Großer Counter
│  Diese Woche: +42 ⭐            │
├─────────────────────────────────┤
│  Meine Wünsche                  │
├─────────────────────────────────┤
│  ┌─────────────────────────────┐│
│  │ 🎮 Playstation Spiel        ││
│  │ Kosten: 200 ⭐              ││
│  │ Noch 73 ⭐ sammeln!         ││
│  │ [Einlösen] (grau)           ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ 🎬 Kinobesuch               ││
│  │ Kosten: 100 ⭐              ││
│  │ ✅ Genug Sterne!            ││
│  │ [Einlösen] (grün)           ││
│  └─────────────────────────────┘│
│                                 │
│  [+ Neuer Wunsch]               │
└─────────────────────────────────┘
```

**Elemente:**
- **Sterne-Counter:** Animiert, groß, prominent
- **Wunsch-Karten:** Icon, Titel, Kosten, Fortschrittsbalken
- **Einlösen-Button:** Grau (nicht genug) oder Grün (bereit)
- **Freigabe:** "Warte auf Mama/Papa" Status nach Einlösung

---

### 7. Profil-Screen
**Zweck:** Einstellungen, Theme-Wechsel, Profil-Daten

**Layout:**
```
┌─────────────────────────────────┐
│  ← Profil                       │
├─────────────────────────────────┤
│       [Großer Avatar]           │
│          Max                    │
│       Klasse 3                  │
├─────────────────────────────────┤
│  🎨 Theme ändern                │
│  🖼️ Hintergrund wählen          │
│  🔔 Erinnerungen                │
│  📊 Meine Statistik             │
│  ❓ Hilfe                       │
└─────────────────────────────────┘
```

**Elemente:**
- **Avatar:** Groß, rund, editierbar (Foto oder Emoji)
- **Theme-Galerie:** Huntrix, Kaninchen-Land, Dino, Einhorn, etc.
- **Hintergrund:** Galerie-Foto oder App-Wallpaper
- **Statistik:** Sterne pro Woche, Aufgaben erledigt, Hefte-Count

---

## Interaktions-Design

### Touch-Feedback
- **Buttons:** Scale 0.97 + Haptic (Light)
- **Karten:** Opacity 0.7 beim Drücken
- **Checkboxen:** Bounce-Animation + Haptic (Medium)
- **Sterne:** Glitzer-Animation beim Verdienen

### Animationen
- **Screen-Transitions:** Slide (300ms, easeInOut)
- **Modal:** Fade + Scale from bottom (250ms)
- **Liste:** Staggered Fade-In (50ms delay pro Item)
- **Sterne-Counter:** Count-Up Animation (1s)

### Haptics
- **Button-Tap:** Light Impact
- **Aufgabe abhaken:** Medium Impact
- **Sterne verdienen:** Success Notification
- **Fehler:** Error Notification

---

## Typografie

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| **Headline** | System | 28px | Bold | #4A4A4A |
| **Titel** | System | 20px | Semibold | #4A4A4A |
| **Body** | System | 16px | Regular | #4A4A4A |
| **Caption** | System | 14px | Regular | #9E9E9E |
| **Button** | System | 16px | Semibold | White |

**Line-Height:** 1.4x für bessere Lesbarkeit

---

## Icon-System

### Haupt-Navigation (Tab Bar)
- 🏠 Home
- 📚 Hefte
- ✅ Aufgaben
- 📅 Termine
- 👤 Profil

### Fächer (Farbcodiert)
- 🧮 Mathe (Blau)
- 📝 Deutsch (Orange)
- 🌍 Sachkunde/HSU (Rosa)
- 🎨 Kunst (Lavendel)
- 🎵 Musik (Gelb)
- ⚽ Sport (Grün)

### Aktionen
- ➕ Hinzufügen
- 🔍 Suchen
- ⭐ Sterne
- ✓ Verstanden
- ⚠️ Schwierig
- 💡 Erklärung
- 🎯 Quiz

---

## Theme-System (Skins)

### Standard-Theme (Default)
- Pastell-Farben wie oben definiert
- Helle Hintergründe
- Freundliche Maskottchen (Kaninchen, Hund, Katze)

### Huntrix-Theme
- Dunklere Farben (Fantasy-Style)
- Hero-Icons statt Tier-Maskottchen
- Abenteuer-Ästhetik

### Kaninchen-Land
- Viele Kaninchen-Illustrationen
- Grün-dominierte Palette
- Wiesen-Hintergrund

### Weitere Themes (später)
- Paw Patrol-inspiriert (Hunde-Rettung)
- Weltraum (Sterne, Planeten)
- Dino (Prähistorisch)
- Einhorn (Magisch, glitzernd)
- Baustelle (Fahrzeuge, Bauarbeiter)

**Technische Umsetzung:**
- Theme-Config in JSON
- Farben + Icons + Hintergrund pro Theme
- Wechsel ohne App-Neustart
- Themes als In-App-Purchase (später)

---

## Accessibility

### Für Kinder mit Leseschwäche
- **Vorlesen-Funktion** für alle Texte (TTS)
- **Große Schrift** einstellbar (120%, 150%)
- **Hoher Kontrast** Modus

### Für Kinder mit motorischen Einschränkungen
- **Große Touch-Bereiche** (min. 60x60px)
- **Keine Zeitlimits** bei Interaktionen
- **Alternative Eingaben** (Sprache statt Tippen)

### Für Kinder mit Konzentrationsschwäche
- **Fokus-Modus** (nur eine Aufgabe sichtbar)
- **Weniger Animationen** (Reduced Motion)
- **Klare Struktur** ohne Ablenkungen

---

## Offline-Fähigkeit

Die App muss **vollständig offline** funktionieren:
- Alle Daten lokal in AsyncStorage/SQLite
- Fotos lokal gespeichert
- OCR + KI optional (Server-Sync wenn online)
- Sync im Hintergrund wenn Verbindung besteht

---

## Datenschutz & Sicherheit

### Eltern-Kontrolle
- **Kein offener Browser** ohne Whitelist
- **Keine Chats** mit Fremden
- **Keine persönlichen Daten** nach außen
- **Eltern-PIN** für sensible Einstellungen

### DSGVO-Konform
- **Minimalprinzip** - nur nötige Daten
- **Lokale Verarbeitung** bevorzugt
- **Opt-In für Cloud** - Eltern entscheiden
- **Daten löschen** jederzeit möglich

---

## Nächste Schritte

1. ✅ Design-Konzept erstellt
2. ⏳ Navigation + Tab Bar implementieren
3. ⏳ Home Screen mit Kacheln
4. ⏳ Hefte-Screen mit Foto-Upload
5. ⏳ Aufgaben-Screen mit Checkboxen
6. ⏳ Sterne-System + Shop
7. ⏳ Theme-Switcher
8. ⏳ Backend-Integration (optional)
