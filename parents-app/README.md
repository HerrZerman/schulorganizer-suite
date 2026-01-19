# 🌟 SternWerk - Elternapp

Eine professionelle Mobile-App für Eltern, um den Lernfortschritt ihrer Grundschulkinder zu verfolgen und zu unterstützen. Teil des **schulorganizer-suite** Projekts.

![Logo](./assets/images/icon.png)

---

## 🎯 Features

### 📊 **Dashboard mit Mehrfach-Kinder-Ansicht**
- Übersicht über alle Kinder mit Avatar, Name, Klasse
- Sterne-Stand und Fortschritt auf einen Blick
- Anzahl wartender Wünsche
- Aufgaben-Status (heute)
- Letzte Aktivität
- Kind hinzufügen mit Emoji-Avatar

### ✅ **Wunsch-Freigaben**
- Liste wartender Wünsche aus dem Sterne-Shop der Kinderapp
- Wunsch-Details mit Kosten und aktuellem Sterne-Stand
- Fortschrittsbalken für jeden Wunsch
- Freigeben oder Ablehnen mit optionaler Notiz
- Verlauf genehmigter/abgelehnter Wünsche

### ✏️ **Aufgaben erstellen**
- Neue Aufgaben für Kinder erstellen
- Aufgaben nach Datum gruppiert (Heute, Morgen, Später)
- Filter nach Kind
- Fach-Zuordnung (optional)
- Sterne-Belohnung konfigurierbar (1-20 ⭐)
- Aufgaben abhaken und löschen

### 📚 **Hefte-Galerie**
- Grid-Ansicht aller fotografierten Schulhefte
- Filter nach Kind und Fach
- Foto-Preview mit Metadaten (Kind, Fach, Datum, Thema)
- Status-Badges (Verstanden, Schwierig)
- Detail-Ansicht mit großem Foto
- Notizen für Eltern hinzufügen

### 👤 **Profil & Einstellungen**
- Kinder-Verwaltung (Coming Soon)
- Sterne-Regeln konfigurieren (Coming Soon)
- Push-Benachrichtigungen (Coming Soon)
- Wochenbericht/Statistiken (Coming Soon)
- Daten exportieren (Coming Soon)
- Alle Daten löschen (DSGVO-konform)

---

## 🎨 Design-Highlights

- **Erwachsenen-orientierte Farbpalette** (Tiefblau, Warmes Orange, Sanftes Grün)
- **Professionelles Design** - Vertrauenswürdig und übersichtlich
- **Große Touch-Bereiche** für einfache Bedienung
- **Klare Informationshierarchie** - Wichtigste Infos sofort sichtbar
- **Haptic Feedback** für alle Interaktionen
- **Offline-First**: Alle Daten werden lokal gespeichert (AsyncStorage)

---

## 🚀 Installation & Start

### Voraussetzungen
- Node.js 22+ und pnpm installiert
- Expo Go App auf deinem Smartphone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### 1. Repository klonen
```bash
git clone https://github.com/HerrZerman/schulorganizer-suite.git
cd schulorganizer-suite/parents-app
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
│   ├── index.tsx          # Dashboard (Kinder-Übersicht)
│   ├── freigaben.tsx      # Wunsch-Freigaben
│   ├── aufgaben.tsx       # Aufgaben erstellen
│   ├── hefte.tsx          # Hefte-Galerie
│   └── profil.tsx         # Profil & Einstellungen
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

theme.config.js            # Farb-Palette (Erwachsenen-orientiert)
design.md                  # Design-Konzept und Spezifikation
todo.md                    # TODO-Liste und Feature-Tracking
```

---

## 🎨 Farb-Palette

| Farbe | Verwendung | Light | Dark |
|-------|------------|-------|------|
| **Primary** | Hauptfarbe, Vertrauen | `#1E3A8A` | `#3B82F6` |
| **Accent** | Call-to-Actions | `#F97316` | `#FB923C` |
| **Success** | Freigaben, Erfolg | `#10B981` | `#34D399` |
| **Warning** | Wichtige Hinweise | `#F97316` | `#FB923C` |
| **Error** | Ablehnungen, Fehler | `#EF4444` | `#F87171` |
| **Star** | Sterne | `#FFD700` | `#FFC700` |

---

## 📊 Datenmodell

### **Child** (Kind)
```typescript
{
  id: string;
  name: string;
  avatar: string;        // Emoji
  grade: number;         // 1-4
  totalStars: number;
  theme: ThemeName;
  createdAt: Date;
  lastActivity?: Date;
}
```

### **RewardWish** (Wunsch)
```typescript
{
  id: string;
  childId: string;
  title: string;
  starPrice: number;
  status: WishStatus;    // active, pending, approved, rejected, fulfilled
  createdAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  parentNote?: string;
}
```

### **Task** (Aufgabe)
```typescript
{
  id: string;
  childId: string;
  title: string;
  subject?: SubjectType;
  done: boolean;
  starsAwarded: number;
  dueDate?: Date;
  createdAt: Date;
  createdBy: "child" | "parent";
}
```

### **NoteEntry** (Heft)
```typescript
{
  id: string;
  childId: string;
  subject: SubjectType;
  topic: string;
  photoUri: string;
  understood: boolean;
  starsEarned: number;
  date: Date;
  createdAt: Date;
  parentNote?: string;
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

---

## 🔄 Workflow

### Typischer Nutzungsablauf:

1. **Dashboard**: Übersicht über alle Kinder und deren Status
2. **Freigaben**: Wartende Wünsche genehmigen oder ablehnen
3. **Aufgaben**: Neue Aufgaben für Kinder erstellen
4. **Hefte**: Fotografierte Schulhefte anschauen und Notizen hinzufügen
5. **Profil**: Einstellungen verwalten

---

## 🎯 Roadmap (Coming Soon)

### **Phase 1: Erweiterte Verwaltung**
- [ ] Kinder bearbeiten und löschen
- [ ] Sterne-Regeln konfigurieren
- [ ] Push-Benachrichtigungen für Freigaben
- [ ] Wochenbericht mit Statistiken

### **Phase 2: Daten-Sync**
- [ ] Sync zwischen Eltern- und Kinderapp
- [ ] Cloud-Backup (optional)
- [ ] Multi-Gerät-Support

### **Phase 3: Erweiterte Features**
- [ ] Daten exportieren (JSON/PDF)
- [ ] Aufgaben bearbeiten
- [ ] Pinch-to-Zoom für Hefte-Fotos
- [ ] Dark Mode Optimierungen

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

Dieses Projekt ist Teil des **schulorganizer-suite** Projekts und dient zu Demonstrationszwecken.

---

## 👨‍👩‍👧‍👦 Für Eltern

Diese App wurde entwickelt, um Eltern dabei zu helfen, den Lernfortschritt ihrer Kinder zu verfolgen und zu unterstützen. Das Sterne-System motiviert Kinder spielerisch und fördert Selbstständigkeit.

**Wichtig:**
- Alle Daten werden **lokal** auf dem Gerät gespeichert (keine Cloud)
- **Keine Werbung**, keine In-App-Käufe
- **DSGVO-konform** (keine Datenübertragung ohne Zustimmung)
- Volle Kontrolle über Freigaben und Einstellungen

---

## 🤝 Kontakt & Support

Bei Fragen oder Problemen:
- GitHub Issues: https://github.com/HerrZerman/schulorganizer-suite/issues
- E-Mail: [Kontakt-E-Mail]

---

**Developer:** HopeApps  
**Owner:** Umut Zerman  
**Repository:** https://github.com/HerrZerman/schulorganizer-suite

---

**Viel Erfolg beim Unterstützen Ihrer Kinder! 🌟📚**
