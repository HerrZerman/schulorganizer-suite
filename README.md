# 🎓 SchulOrganizer Suite

Ein zusammenhängendes Lern- und Organisationssystem für Grundschulkinder und ihre Eltern.

**Developer:** HopeApps  
**Owner:** Umut Zerman

---

## 📱 Apps

### 1. **Kinderapp: "Mein SchulOrganizer"** (`kids-app/`)
Die Haupt-App für Kinder (Smartphone/Tablet).

**Features:**
- 📚 **Hefte**: Schulhefte fotografieren und organisieren
- ✅ **Aufgaben**: Checkliste mit Sterne-Belohnung
- 📅 **Termine**: Kalender mit Erinnerungen
- ⭐ **Sterne-Shop**: Wünsche mit automatischer Bildsuche
- 📸 **Foto-Beweise**: Für Aufgaben und Termine
- 🎨 **6 Themes**: Huntrix, Kaninchen, Weltraum, Dino, Einhorn, Baustelle

**Tech Stack:** React Native (Expo SDK 54), TypeScript, NativeWind (Tailwind CSS)

[→ Zur Kinderapp-Dokumentation](kids-app/README_DE.md)

---

### 2. **Elternapp: "SternWerk"** (`parents-app/`)
Die Kontroll- und Verwaltungs-App für Eltern.

**Features:**
- 📊 Dashboard mit Kind-Übersicht
- ✅ Freigaben für Wünsche
- ⭐ Sterne-Regeln verwalten
- 📈 Wochenbericht (PDF)
- 🔔 Push-Benachrichtigungen

**Status:** 🚧 In Entwicklung

---

### 3. **Smartwatch-App** (`smartwatch-app/`)
Schlanke Version für Garett Kinder-Smartwatches.

**Features:**
- ✅ Aufgaben-Liste (abhaken)
- ⭐ Sterne-Counter
- 📅 Termine-Übersicht
- 📸 Foto-Beweise (falls Kamera vorhanden)
- 🔄 Bluetooth-Sync mit Smartphone

**Status:** 🚧 In Entwicklung

---

## 🚀 Quick Start

### Kinderapp starten:
```bash
cd kids-app
pnpm install
pnpm dev
```

Dann:
- **iOS**: Expo Go App auf iPhone installieren und QR-Code scannen
- **Android**: Expo Go App auf Android installieren und QR-Code scannen
- **Web**: Browser öffnet sich automatisch

---

## 📂 Projektstruktur

```
schulorganizer-suite/
├── README.md                    # Diese Datei
├── kids-app/                    # Kinderapp (React Native)
│   ├── app/                     # Screens & Navigation
│   ├── components/              # UI-Komponenten
│   ├── lib/                     # Helper-Funktionen
│   ├── types/                   # TypeScript Interfaces
│   ├── docs/                    # Dokumentation & Screenshots
│   └── README_DE.md             # Kinderapp-Anleitung
├── parents-app/                 # Elternapp (React Native)
│   └── README.md
└── smartwatch-app/              # Smartwatch-App (React Native)
    └── README.md
```

---

## 🎨 Screenshots

### Kinderapp

<table>
  <tr>
    <td><img src="kids-app/docs/screenshots/01-home-screen.png" width="200"/></td>
    <td><img src="kids-app/docs/screenshots/02-hefte-screen.png" width="200"/></td>
    <td><img src="kids-app/docs/screenshots/03-aufgaben-screen.png" width="200"/></td>
  </tr>
  <tr>
    <td align="center"><b>Home</b></td>
    <td align="center"><b>Hefte</b></td>
    <td align="center"><b>Aufgaben</b></td>
  </tr>
  <tr>
    <td><img src="kids-app/docs/screenshots/04-termine-screen.png" width="200"/></td>
    <td><img src="kids-app/docs/screenshots/05-shop-screen.png" width="200"/></td>
    <td><img src="kids-app/docs/screenshots/06-profil-screen.png" width="200"/></td>
  </tr>
  <tr>
    <td align="center"><b>Termine</b></td>
    <td align="center"><b>Sterne Shop</b></td>
    <td align="center"><b>Profil</b></td>
  </tr>
</table>

---

## 🛠️ Technologie

- **Framework**: React Native (Expo SDK 54)
- **Sprache**: TypeScript 5.9
- **Styling**: NativeWind 4 (Tailwind CSS)
- **State**: React Context + AsyncStorage
- **Navigation**: Expo Router 6
- **Backend**: Optional (Drizzle ORM + PostgreSQL)
- **APIs**: Pixabay (Bildsuche), Google Calendar (Termine)

---

## 📋 Roadmap

### Phase 1: MVP ✅
- [x] Kinderapp Grundfunktionen
- [x] Hefte, Aufgaben, Termine, Shop
- [x] Foto-Upload für Beweise
- [x] Automatische Bildsuche für Wünsche
- [x] Lokale Datenspeicherung

### Phase 2: Elternapp 🚧
- [ ] Dashboard mit Kind-Übersicht
- [ ] Freigaben für Wünsche
- [ ] Sterne-Regeln verwalten
- [ ] Wochenbericht (PDF)

### Phase 3: Smartwatch-App 🚧
- [ ] Aufgaben-Liste
- [ ] Bluetooth-Sync
- [ ] APK-Transfer aus Elternapp

### Phase 4: KI-Features 🔮
- [ ] OCR-Texterkennung für Hefte
- [ ] KI-Übungsgenerator
- [ ] Handschrifterkennung
- [ ] Thema-Erkennung

---

## 📄 Lizenz

Privates Projekt von Umut Zerman (HopeApps).  
Alle Rechte vorbehalten.

---

## 🤝 Kontakt

**Developer:** HopeApps  
**Owner:** Umut Zerman  
**GitHub:** https://github.com/HerrZerman/schulorganizer-suite

---

**Made with ❤️ for kids and parents**
