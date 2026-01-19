# 🤖 Anleitung für KI-Agenten in Visual Studio Code

Diese Anleitung ist für KI-Agenten (Cursor, GitHub Copilot, etc.) in Visual Studio Code, um den Code von GitHub zu aktualisieren und die App auf einem angeschlossenen Handy zu testen.

---

## 📦 Schritt 1: Repository von GitHub klonen/aktualisieren

### **Erstes Mal (Klonen):**

```bash
# Terminal in VS Code öffnen (Ctrl+` oder View → Terminal)

# Repository klonen
git clone https://github.com/HerrZerman/schulorganizer-suite.git

# In das Verzeichnis wechseln
cd schulorganizer-suite

# Kinderapp-Verzeichnis öffnen
cd kids-app
```

### **Updates holen (Pull):**

```bash
# In das Repository-Verzeichnis wechseln
cd schulorganizer-suite

# Neueste Änderungen von GitHub holen
git pull origin main

# Oder: Alles neu klonen (wenn Probleme auftreten)
cd ..
rm -rf schulorganizer-suite
git clone https://github.com/HerrZerman/schulorganizer-suite.git
```

---

## 📱 Schritt 2: Kinderapp auf angeschlossenem Handy testen

### **Voraussetzungen:**

1. **Node.js installiert** (Version 18+)
   ```bash
   node --version  # Sollte v18.x oder höher sein
   ```

2. **pnpm installiert**
   ```bash
   npm install -g pnpm
   ```

3. **Handy per USB angeschlossen**
   - Android: USB-Debugging aktiviert
   - iOS: Xcode installiert, Entwickler-Zertifikat

4. **Expo Go App auf dem Handy installiert**
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

---

## 🚀 Schritt 3: App starten und testen

### **Option A: Mit Expo Go (Empfohlen für schnelles Testen)**

```bash
# In das Kinderapp-Verzeichnis wechseln
cd schulorganizer-suite/kids-app

# Dependencies installieren (nur beim ersten Mal oder nach Updates)
pnpm install

# Dev-Server starten
pnpm dev

# Warten bis QR-Code erscheint, dann:
# - Android: QR-Code mit Expo Go scannen
# - iOS: QR-Code mit Kamera-App scannen → "In Expo Go öffnen"
```

**Wichtig:** Das Handy muss im **gleichen WLAN** sein wie der Computer!

---

### **Option B: Direkt auf angeschlossenem Handy (ohne Expo Go)**

#### **Android:**

```bash
# USB-Debugging aktivieren auf dem Handy:
# Einstellungen → Über das Telefon → Build-Nummer 7x tippen
# Einstellungen → Entwickleroptionen → USB-Debugging aktivieren

# Prüfen ob Handy erkannt wird
adb devices
# Sollte dein Gerät anzeigen

# In das Kinderapp-Verzeichnis wechseln
cd schulorganizer-suite/kids-app

# Dependencies installieren
pnpm install

# App direkt auf Android-Handy starten
pnpm android

# App wird gebaut und automatisch auf dem Handy installiert
```

#### **iOS (nur auf Mac):**

```bash
# Xcode muss installiert sein
# Handy per USB verbinden und "Diesem Computer vertrauen" bestätigen

# In das Kinderapp-Verzeichnis wechseln
cd schulorganizer-suite/kids-app

# Dependencies installieren
pnpm install

# Pods installieren (nur beim ersten Mal)
cd ios && pod install && cd ..

# App direkt auf iOS-Handy starten
pnpm ios

# Xcode öffnet sich → Entwickler-Zertifikat auswählen → Run
```

---

## 🔧 Schritt 4: Änderungen testen

### **Live-Reload:**

Wenn die App läuft, werden Änderungen automatisch auf dem Handy aktualisiert:

1. **Datei bearbeiten** (z.B. `app/(tabs)/index.tsx`)
2. **Speichern** (Ctrl+S)
3. **App aktualisiert sich automatisch** auf dem Handy (Hot Reload)

### **Manuelle Aktualisierung:**

Wenn Hot Reload nicht funktioniert:
- **Android/iOS:** App schließen und neu öffnen
- **Expo Go:** Shake-Geste → "Reload"

---

## 🐛 Fehlersuche (Troubleshooting)

### **Problem: "Metro Bundler läuft nicht"**

```bash
# Metro Bundler manuell starten
pnpm start

# In einem neuen Terminal:
pnpm android  # oder pnpm ios
```

### **Problem: "Dependencies fehlen"**

```bash
# Alle Dependencies neu installieren
rm -rf node_modules
pnpm install
```

### **Problem: "Handy wird nicht erkannt (Android)"**

```bash
# ADB neu starten
adb kill-server
adb start-server
adb devices
```

### **Problem: "Build-Fehler auf iOS"**

```bash
# Pods neu installieren
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

---

## 📝 Wichtige Befehle (Cheat Sheet)

| Befehl | Beschreibung |
|--------|--------------|
| `git pull origin main` | Neueste Änderungen von GitHub holen |
| `pnpm install` | Dependencies installieren |
| `pnpm dev` | Dev-Server starten (mit Expo Go) |
| `pnpm android` | App direkt auf Android-Handy starten |
| `pnpm ios` | App direkt auf iOS-Handy starten (nur Mac) |
| `pnpm test` | Tests ausführen |
| `adb devices` | Android-Geräte anzeigen |
| `pnpm start` | Metro Bundler manuell starten |

---

## 🎯 Typischer Workflow für KI-Agenten

```bash
# 1. Neueste Änderungen holen
cd schulorganizer-suite
git pull origin main

# 2. In Kinderapp wechseln
cd kids-app

# 3. Dependencies aktualisieren (falls nötig)
pnpm install

# 4. App auf Handy starten
pnpm android  # oder pnpm ios

# 5. Änderungen vornehmen
# → VS Code: Dateien bearbeiten
# → App aktualisiert sich automatisch

# 6. Testen auf dem Handy
# → Funktionen durchklicken
# → Screenshots machen
# → Bugs notieren

# 7. Änderungen committen (falls gewünscht)
git add .
git commit -m "Beschreibung der Änderungen"
git push origin main
```

---

## 🔐 GitHub-Authentifizierung

Falls Git nach Login fragt:

```bash
# GitHub CLI installieren (einmalig)
# Windows: winget install GitHub.cli
# Mac: brew install gh
# Linux: siehe https://cli.github.com

# Einloggen
gh auth login

# Repository-Zugriff testen
gh repo view HerrZerman/schulorganizer-suite
```

---

## 📱 App-Struktur (für Orientierung)

```
kids-app/
├── app/                    # Screens
│   ├── (tabs)/            # Tab-Navigation
│   │   ├── index.tsx      # Home Screen
│   │   ├── hefte.tsx      # Hefte Screen
│   │   ├── aufgaben.tsx   # Aufgaben Screen
│   │   ├── termine.tsx    # Termine Screen
│   │   └── profil.tsx     # Profil Screen
│   └── shop.tsx           # Sterne Shop
├── components/            # Wiederverwendbare Komponenten
├── lib/                   # Helper-Funktionen
├── types/                 # TypeScript-Typen
├── assets/                # Bilder, Icons
└── package.json           # Dependencies
```

---

## 🎨 Wichtige Dateien zum Bearbeiten

| Datei | Zweck |
|-------|-------|
| `app/(tabs)/index.tsx` | Home Screen (Hauptbildschirm) |
| `theme.config.js` | Farben und Theme |
| `app.config.ts` | App-Name, Logo, Bundle-ID |
| `lib/storage.ts` | Datenspeicherung (AsyncStorage) |
| `types/models.ts` | Datenmodelle (TypeScript) |

---

## ✅ Checkliste vor dem Testen

- [ ] Git-Repository aktualisiert (`git pull`)
- [ ] Dependencies installiert (`pnpm install`)
- [ ] Handy per USB verbunden
- [ ] USB-Debugging aktiviert (Android)
- [ ] Expo Go installiert (falls Option A)
- [ ] Gleiches WLAN (falls Expo Go)
- [ ] Dev-Server läuft (`pnpm dev` oder `pnpm android`)

---

## 🆘 Hilfe

Bei Problemen:
1. **Terminal-Ausgabe lesen** (Fehlermeldungen)
2. **Google/ChatGPT fragen** mit exakter Fehlermeldung
3. **GitHub Issues** checken: https://github.com/HerrZerman/schulorganizer-suite/issues
4. **Expo Docs**: https://docs.expo.dev

---

**Developer:** HopeApps  
**Owner:** Umut Zerman  
**Repository:** https://github.com/HerrZerman/schulorganizer-suite
