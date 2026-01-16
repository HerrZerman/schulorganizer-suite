# 📚 Mein SchulOrganizer - Kinderapp

Eine kindgerechte App für Grundschüler (Klasse 1-4) zum Organisieren von Schulheften, Aufgaben und Terminen mit einem motivierenden Belohnungssystem.

![Logo](./assets/images/icon.png)

---

## 🎯 Features

### ✅ **Hefte-Verwaltung**
- Fotografiere deine Schulhefte mit der Kamera oder wähle Fotos aus der Galerie
- Organisiere Hefte nach Fächern (Mathe, Deutsch, Sachkunde, etc.)
- Markiere Hefte als "Verstanden" und verdiene **5 Sterne** ⭐
- Übersichtliches Grid-Layout mit Fach-Tags und Datum

### 📝 **Aufgaben-Tracker**
- Erstelle To-Do-Listen für Hausaufgaben
- Hake Aufgaben ab und verdiene **5 Sterne** pro Aufgabe
- Fortschrittsbalken zeigt deinen Tagesfortschritt
- Fach-Zuordnung mit farbigen Tags

### 📅 **Termin-Kalender**
- Füge wichtige Termine hinzu (Tests, Sport, Arzttermine)
- Kategorisiere Termine nach Art (Schule, Sport, Freizeit, Arzt)
- Einfache Kalender-Ansicht mit heutigem Datum

### ⭐ **Sterne-Shop**
- Sammle Sterne durch erledigte Aufgaben und verstandene Hefte
- Erstelle deine eigene Wunschliste
- Löse Wünsche gegen Sterne ein (mit Eltern-Freigabe)
- Fortschrittsbalken zeigt, wie nah du an deinem Ziel bist

### 👤 **Profil & Statistiken**
- Personalisiere deinen Avatar (Emoji-Auswahl)
- Sehe deine Gesamt-Sterne und erledigte Aufgaben
- Wechsle Themes und Hintergründe (coming soon)

---

## 🎨 Design-Highlights

- **Kindgerechte Pastellfarben** (Hellblau, Mint, Gelb, Coral)
- **Große Touch-Bereiche** für kleine Finger
- **Klare Icons** und intuitive Navigation
- **Motivierende Feedback-Elemente** (Haptic Feedback, Sterne-Animationen)
- **Offline-First**: Alle Daten werden lokal gespeichert (AsyncStorage)

---

## 🚀 Installation & Start

### Voraussetzungen
- Node.js 22+ und pnpm installiert
- Expo Go App auf deinem Smartphone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### 1. Repository klonen
```bash
git clone <repository-url>
cd kids
```

### 2. Dependencies installieren
```bash
pnpm install
```

### 3. Development Server starten
```bash
pnpm dev
```

### 4. App auf dem Smartphone öffnen
- Scanne den QR-Code mit der Expo Go App
- Oder öffne im Browser: `http://localhost:8081`

---

## 📱 App-Struktur

```
app/
├── (tabs)/
│   ├── index.tsx          # Home Screen (Dashboard)
│   ├── hefte.tsx          # Hefte-Übersicht mit Foto-Upload
│   ├── aufgaben.tsx       # Aufgaben-Liste mit Checkboxen
│   ├── termine.tsx        # Termin-Kalender
│   └── profil.tsx         # Profil & Statistiken
├── shop.tsx               # Sterne-Shop (außerhalb Tabs)
└── _layout.tsx            # Root Layout

components/
├── screen-container.tsx   # SafeArea-Wrapper
└── ui/
    └── icon-symbol.tsx    # Icon-Mappings

lib/
├── storage.ts             # AsyncStorage Helper-Funktionen
└── utils.ts               # Utility-Funktionen

types/
└── models.ts              # TypeScript Interfaces

theme.config.js            # Farb-Palette (Pastell-Farben)
```

---

## 🎨 Farb-Palette

| Farbe | Verwendung | Light | Dark |
|-------|------------|-------|------|
| **Primary** | Mathe, Hauptfarbe | `#A8D8EA` | `#7CB8D1` |
| **Secondary** | Termine, Musik | `#FFE5A0` | `#E6C878` |
| **Accent** | Aufgaben, Erfolg | `#B8E6D5` | `#95D4BE` |
| **German** | Deutsch-Fach | `#FFB4A2` | `#E69580` |
| **Science** | Sachkunde | `#FFD4E5` | `#E6B8CC` |
| **Star** | Sterne | `#FFD700` | `#FFC700` |

---

## 📊 Datenmodell

### **ChildProfile**
```typescript
{
  id: string;
  name: string;
  avatar: string;        // Emoji
  grade: number;         // 1-4
  theme: ThemeName;
}
```

### **NoteEntry** (Hefte)
```typescript
{
  id: string;
  subject: SubjectType;  // mathe, deutsch, sachkunde, etc.
  topic: string;
  photoUri: string;
  understood: boolean;
  starsEarned: number;
  date: Date;
}
```

### **Task** (Aufgaben)
```typescript
{
  id: string;
  title: string;
  subject?: SubjectType;
  done: boolean;
  starsAwarded: number;
  dueDate?: Date;
}
```

### **Event** (Termine)
```typescript
{
  id: string;
  title: string;
  date: Date;
  category: EventCategory; // schule, sport, freizeit, arzt
  reminder?: boolean;
}
```

### **RewardWish** (Wünsche)
```typescript
{
  id: string;
  title: string;
  starPrice: number;
  status: WishStatus;    // active, pending, approved, fulfilled
}
```

---

## 🧪 Tests

```bash
# Alle Tests ausführen
pnpm test

# Tests im Watch-Mode
pnpm test:watch
```

**Test-Coverage:**
- ✅ Sterne-Logik (Hinzufügen, Entfernen, Minimum 0)
- ✅ Task-Logik (Toggle, Zählen)
- ✅ Basic Storage-Funktionen

---

## 🔄 Workflow

### Typischer Nutzungsablauf:

1. **Morgens**: Kind fotografiert Hausaufgaben aus dem Schulheft
2. **Nachmittags**: Kind hakt erledigte Aufgaben ab → verdient Sterne
3. **Abends**: Kind markiert verstandene Hefte → verdient Sterne
4. **Wochenende**: Kind löst Wünsche im Sterne-Shop ein (mit Eltern-Freigabe)

---

## 🎯 Roadmap (Coming Soon)

### **Phase 1: KI-Features** (Backend-Integration)
- [ ] OCR-Texterkennung für fotografierte Hefte
- [ ] KI-Übungsgenerator basierend auf Heften
- [ ] Handschrifterkennung
- [ ] Thema-Erkennung

### **Phase 2: Elternapp**
- [ ] Dashboard mit Kind-Übersicht
- [ ] Freigaben für Wünsche
- [ ] Sterne-Regeln konfigurieren
- [ ] Wochenbericht (PDF)

### **Phase 3: Erweiterte Features**
- [ ] 6 Theme-Pakete (Huntrix, Kaninchen-Land, Weltraum, Dino, Einhorn, Baustelle)
- [ ] Whitelist-Spielmodus (nur freigegebene Apps/Spiele)
- [ ] Push-Benachrichtigungen für Termine
- [ ] Cloud-Sync zwischen Geräten
- [ ] Mehrsprachigkeit (Deutsch, Englisch, Türkisch)

---

## 🛠️ Tech Stack

- **Framework**: React Native (Expo SDK 54)
- **Routing**: Expo Router 6
- **Styling**: NativeWind 4 (Tailwind CSS)
- **State**: AsyncStorage (lokal)
- **TypeScript**: 5.9
- **Testing**: Vitest
- **Icons**: MaterialIcons + SF Symbols

---

## 📄 Lizenz

Dieses Projekt ist ein Prototyp und dient zu Demonstrationszwecken.

---

## 👨‍👩‍👧‍👦 Für Eltern

Diese App wurde entwickelt, um Kindern spielerisch beim Lernen und Organisieren zu helfen. Das Sterne-System motiviert ohne Druck und fördert Selbstständigkeit.

**Wichtig:**
- Alle Daten werden **lokal** auf dem Gerät gespeichert (keine Cloud)
- **Keine Werbung**, keine In-App-Käufe
- **DSGVO-konform** (keine Datenübertragung)
- Eltern-Freigabe für Wunsch-Einlösungen

---

## 🤝 Kontakt & Support

Bei Fragen oder Problemen:
- GitHub Issues: [Repository-Link]
- E-Mail: [Kontakt-E-Mail]

---

**Viel Spaß beim Lernen! 🌟📚**
