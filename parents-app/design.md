# Design-Konzept: SternWerk - Elternapp

## Zielgruppe
Eltern von Grundschulkindern (Klasse 1-4), die die "Mein SchulOrganizer" Kinderapp nutzen. Primär auf Smartphone (iOS/Android) im Hochformat (9:16).

## Design-Prinzipien

### 1. Übersichtlich & Effizient
- **Klare Informationshierarchie** - Wichtigste Infos sofort sichtbar
- **Schneller Zugriff** - Häufige Aktionen (Freigaben, Aufgaben) prominent platziert
- **Multi-Kind-Verwaltung** - Einfacher Wechsel zwischen Kindern
- **Minimaler Aufwand** - Wenige Taps für Hauptfunktionen

### 2. Vertrauenswürdig & Professionell
- **Beruhigende Farben** - Warme, professionelle Palette (keine grellen Kinderfarben)
- **Klare Typografie** - Gut lesbar, erwachsenengerecht
- **Datenschutz-Fokus** - Transparenz über Datennutzung
- **Eltern-Kontrolle** - Volle Kontrolle über Freigaben und Einstellungen

### 3. Motivierend & Positiv
- **Fortschritts-Visualisierung** - Erfolge der Kinder sichtbar machen
- **Positive Sprache** - Fokus auf Erfolge statt Defizite
- **Wertschätzung** - Anerkennung der Elternleistung

---

## Farbpalette (Erwachsenen-orientiert)

| Farbe | Hex | Verwendung |
|-------|-----|------------|
| **Tiefblau** | `#1E3A8A` | Primärfarbe, Vertrauen |
| **Warmes Orange** | `#F97316` | Akzente, Call-to-Actions |
| **Sanftes Grün** | `#10B981` | Erfolg, Freigaben |
| **Neutrales Grau** | `#6B7280` | Sekundärtext |
| **Helles Beige** | `#FEF3C7` | Hintergrund-Highlights |
| **Weiß** | `#FFFFFF` | Hintergrund, Cards |
| **Dunkelgrau** | `#1F2937` | Haupttext |
| **Hellgrau** | `#F3F4F6` | Hintergrund-Flächen |

---

## Screen-Struktur

### 1. Dashboard (Home Screen)
**Zweck:** Schneller Überblick über alle Kinder und deren Status

**Layout:**
```
┌─────────────────────────────────┐
│  SternWerk          [⚙️]        │ ← Header mit Einstellungen
├─────────────────────────────────┤
│  Meine Kinder                   │
├─────────────────────────────────┤
│  ┌─────────────────────────────┐│
│  │ 👧 Emma (Klasse 3)          ││
│  │ 127 ⭐ | 3 Wünsche warten   ││ ← Kind-Card (tappable)
│  │ Letzte Aktivität: vor 2h    ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ 👦 Max (Klasse 1)           ││
│  │ 85 ⭐ | Alle Aufgaben ✓     ││
│  │ Letzte Aktivität: vor 5h    ││
│  └─────────────────────────────┘│
│                                 │
│  [+ Kind hinzufügen]            │
├─────────────────────────────────┤
│  🏠  ✓  ✏️  📚  👤             │ ← Bottom Tab Bar
└─────────────────────────────────┘
```

**Elemente:**
- **Kind-Cards:** Avatar/Emoji, Name, Klasse, Sterne-Stand, Status-Info
- **Schnellzugriff:** Tap auf Card öffnet Kind-Detail
- **Plus-Button:** Neues Kind hinzufügen

---

### 2. Freigaben-Screen (Wunsch-Verwaltung)
**Zweck:** Wünsche der Kinder genehmigen oder ablehnen

**Layout:**
```
┌─────────────────────────────────┐
│  ← Freigaben                    │
├─────────────────────────────────┤
│  Wartende Wünsche (3)           │
├─────────────────────────────────┤
│  ┌─────────────────────────────┐│
│  │ 👧 Emma                     ││
│  │ 🎮 Playstation Spiel        ││
│  │ Kosten: 200 ⭐              ││
│  │ Aktuell: 127 ⭐ (noch 73)   ││
│  │                             ││
│  │ [Ablehnen] [Freigeben]      ││ ← Buttons
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ 👧 Emma                     ││
│  │ 🎬 Kinobesuch               ││
│  │ Kosten: 100 ⭐              ││
│  │ Aktuell: 127 ⭐ ✓           ││
│  │                             ││
│  │ [Ablehnen] [Freigeben]      ││
│  └─────────────────────────────┘│
├─────────────────────────────────┤
│  Genehmigte Wünsche (5)         │
│  [Verlauf anzeigen]             │
└─────────────────────────────────┘
```

**Elemente:**
- **Wunsch-Cards:** Kind-Info, Wunsch-Titel, Kosten, aktueller Stand
- **Action-Buttons:** Ablehnen (grau), Freigeben (grün)
- **Verlauf:** Liste genehmigter/abgelehnter Wünsche

---

### 3. Aufgaben-Screen (Aufgaben erstellen)
**Zweck:** Neue Aufgaben für Kinder erstellen und verwalten

**Layout:**
```
┌─────────────────────────────────┐
│  ← Aufgaben          [+ Neu]    │
├─────────────────────────────────┤
│  [Alle Kinder ▼]                │ ← Filter
├─────────────────────────────────┤
│  Heute - 19.01.2026             │
├─────────────────────────────────┤
│  ☐ Zimmer aufräumen             │
│     👧 Emma  |  +10 ⭐          │
│  ☑ Hausaufgaben Mathe           │
│     👦 Max  |  +5 ⭐            │
├─────────────────────────────────┤
│  Morgen - 20.01.2026            │
├─────────────────────────────────┤
│  ☐ Rucksack packen              │
│     👧 Emma  |  +3 ⭐           │
└─────────────────────────────────┘
```

**Aufgabe erstellen Modal:**
```
┌─────────────────────────────────┐
│  Neue Aufgabe                   │
├─────────────────────────────────┤
│  Für welches Kind?              │
│  [👧 Emma ▼]                    │
│                                 │
│  Aufgabe                        │
│  [_________________]            │
│                                 │
│  Fach (optional)                │
│  [Mathe ▼]                      │
│                                 │
│  Fällig am                      │
│  [Heute ▼]                      │
│                                 │
│  Sterne-Belohnung               │
│  [- 5 +]                        │
│                                 │
│  [Abbrechen]  [Erstellen]       │
└─────────────────────────────────┘
```

**Elemente:**
- **Aufgaben-Liste:** Gruppiert nach Datum, Kind-Avatar, Checkbox
- **Plus-Button:** Öffnet Aufgabe-erstellen Modal
- **Filter:** Nach Kind filtern
- **Swipe-Actions:** Bearbeiten, Löschen

---

### 4. Hefte-Galerie Screen
**Zweck:** Fotografierte Schulhefte aller Kinder anzeigen

**Layout:**
```
┌─────────────────────────────────┐
│  ← Hefte              🔍        │
├─────────────────────────────────┤
│  [Alle Kinder ▼] [Alle Fächer ▼]│ ← Filter
├─────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐│
│  │ [Foto]      │ │ [Foto]      ││
│  │ 👧 Emma     │ │ 👦 Max      ││
│  │ Mathe 🧮    │ │ Deutsch 📝  ││
│  │ 19.01.2026  │ │ 18.01.2026  ││
│  │ Plus bis 20 │ │ Buchstaben  ││
│  │ ✓ Verstanden│ │ ⚠️ Schwierig││
│  └─────────────┘ └─────────────┘│
│  ┌─────────────┐ ┌─────────────┐│
│  │ [Foto]      │ │ [Foto]      ││
│  │ ...         │ │ ...         ││
└─────────────────────────────────┘
```

**Heft-Detail Screen:**
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
│  👧 Emma | 📅 19.01.2026        │
│  📚 Mathe | Klasse 3            │
│                                 │
│  Status: ✓ Verstanden           │
│  Sterne verdient: +5 ⭐         │
│                                 │
│  Notizen (optional):            │
│  [_____________________]        │
│                                 │
│  [Schließen]                    │
└─────────────────────────────────┘
```

**Elemente:**
- **Hefte-Grid:** 2 Spalten, Foto-Preview, Kind-Avatar, Fach, Datum, Thema, Status
- **Filter:** Nach Kind und Fach
- **Detail-Ansicht:** Großes Foto, Metadaten, Notizen-Feld
- **Status-Badges:** Verstanden (grün), Schwierig (orange)

---

### 5. Profil-Screen (Einstellungen)
**Zweck:** App-Einstellungen, Kinder verwalten, Statistiken

**Layout:**
```
┌─────────────────────────────────┐
│  ← Profil                       │
├─────────────────────────────────┤
│  Kinder-Verwaltung              │
│  [Kinder bearbeiten]            │
│                                 │
│  Sterne-Regeln                  │
│  [Belohnungen konfigurieren]    │
│                                 │
│  Benachrichtigungen             │
│  [Push-Einstellungen]           │
│                                 │
│  Statistiken                    │
│  [Wochenbericht anzeigen]       │
│                                 │
│  Datenschutz                    │
│  [Daten exportieren]            │
│  [Daten löschen]                │
│                                 │
│  Über SternWerk                 │
│  Version 1.0.0                  │
└─────────────────────────────────┘
```

**Elemente:**
- **Kinder-Verwaltung:** Kinder hinzufügen, bearbeiten, löschen
- **Sterne-Regeln:** Belohnungen pro Aktivität anpassen
- **Benachrichtigungen:** Push-Einstellungen für Freigaben
- **Statistiken:** Wochenbericht mit Fortschritt
- **Datenschutz:** Export und Löschung

---

## Interaktions-Design

### Touch-Feedback
- **Buttons:** Scale 0.97 + Haptic (Light)
- **Cards:** Opacity 0.8 beim Drücken
- **Swipe-Actions:** Haptic (Medium) beim Aktivieren

### Animationen
- **Screen-Transitions:** Slide (300ms, easeInOut)
- **Modal:** Fade + Scale from bottom (250ms)
- **Liste:** Fade-In (200ms)

### Haptics
- **Button-Tap:** Light Impact
- **Freigabe erteilen:** Success Notification
- **Ablehnung:** Warning Notification

---

## Typografie

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| **Headline** | System | 24px | Bold | #1F2937 |
| **Titel** | System | 18px | Semibold | #1F2937 |
| **Body** | System | 16px | Regular | #1F2937 |
| **Caption** | System | 14px | Regular | #6B7280 |
| **Button** | System | 16px | Semibold | White |

---

## Icon-System

### Haupt-Navigation (Tab Bar)
- 🏠 Dashboard
- ✓ Freigaben
- ✏️ Aufgaben
- 📚 Hefte
- 👤 Profil

### Status-Icons
- ⭐ Sterne
- ✓ Verstanden
- ⚠️ Schwierig
- 🔔 Benachrichtigung
- ⚙️ Einstellungen

---

## Datenmodell (Übersicht)

### Child (Kind)
- id, name, avatar, grade, totalStars, lastActivity

### RewardWish (Wunsch)
- id, childId, title, starPrice, status (pending, approved, rejected, fulfilled)

### Task (Aufgabe)
- id, childId, title, subject, done, starsAwarded, dueDate, createdBy (parent)

### NoteEntry (Heft)
- id, childId, subject, topic, photoUri, understood, starsEarned, date

---

## Offline-Fähigkeit

Die App funktioniert **vollständig offline**:
- Alle Daten lokal in AsyncStorage
- Sync mit Kinderapp über lokales Netzwerk (später)
- Keine Cloud-Abhängigkeit

---

## Datenschutz & Sicherheit

### Eltern-Kontrolle
- **Volle Kontrolle** über Freigaben
- **Transparenz** über Datennutzung
- **Lokale Speicherung** bevorzugt

### DSGVO-Konform
- **Minimalprinzip** - nur nötige Daten
- **Lokale Verarbeitung** bevorzugt
- **Daten löschen** jederzeit möglich

---

## Nächste Schritte

1. ✅ Design-Konzept erstellt
2. ⏳ Datenmodell und TypeScript-Typen definieren
3. ⏳ App-Logo generieren und Branding konfigurieren
4. ⏳ Dashboard mit Mehrfach-Kinder-Ansicht implementieren
5. ⏳ Freigaben-Screen implementieren
6. ⏳ Aufgaben-Screen implementieren
7. ⏳ Hefte-Galerie implementieren
8. ⏳ Testing und Optimierungen
