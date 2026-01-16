/** @type {const} */
const themeColors = {
  // Primärfarben (Pastell, kindgerecht)
  primary: { light: '#A8D8EA', dark: '#7CB8D1' }, // Hellblau (Mathe)
  secondary: { light: '#FFE5A0', dark: '#E6C878' }, // Warmes Gelb (Termine)
  accent: { light: '#B8E6D5', dark: '#95D4BE' }, // Mint Grün (Aufgaben/Erfolg)
  
  // Hintergrund & Oberflächen
  background: { light: '#FFFFFF', dark: '#1A1A1A' },
  surface: { light: '#F8F9FA', dark: '#2A2A2A' },
  
  // Text
  foreground: { light: '#4A4A4A', dark: '#E8E8E8' },
  muted: { light: '#9E9E9E', dark: '#A0A0A0' },
  
  // Borders & Dividers
  border: { light: '#E5E7EB', dark: '#404040' },
  
  // Fach-Farben (für Tags)
  math: { light: '#A8D8EA', dark: '#7CB8D1' }, // Mathe (Blau)
  german: { light: '#FFB4A2', dark: '#E69580' }, // Deutsch (Coral Orange)
  science: { light: '#FFD4E5', dark: '#E6B8CC' }, // Sachkunde (Soft Rosa)
  art: { light: '#D4C5F9', dark: '#B8A6E0' }, // Kunst (Lavendel)
  music: { light: '#FFE5A0', dark: '#E6C878' }, // Musik (Gelb)
  sports: { light: '#B8E6D5', dark: '#95D4BE' }, // Sport (Mint)
  
  // Status-Farben
  success: { light: '#B8E6D5', dark: '#95D4BE' }, // Grün (Verstanden)
  warning: { light: '#FFE5A0', dark: '#E6C878' }, // Gelb (Achtung)
  error: { light: '#FFB4A2', dark: '#E69580' }, // Coral (Fehler)
  
  // Sterne & Belohnungen
  star: { light: '#FFD700', dark: '#FFC700' }, // Gold
  reward: { light: '#FFE5A0', dark: '#E6C878' }, // Gelb
};

module.exports = { themeColors };
