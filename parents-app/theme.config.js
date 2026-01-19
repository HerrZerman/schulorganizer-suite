/** @type {const} */
const themeColors = {
  // Primärfarbe - Tiefblau (Vertrauen, Professionalität)
  primary: { light: '#1E3A8A', dark: '#3B82F6' },
  
  // Hintergrund - Weiß/Dunkelgrau
  background: { light: '#FFFFFF', dark: '#1F2937' },
  
  // Oberflächen (Cards, erhöhte Elemente) - Hellgrau/Dunkelgrau
  surface: { light: '#F3F4F6', dark: '#374151' },
  
  // Haupttext - Dunkelgrau/Hellgrau
  foreground: { light: '#1F2937', dark: '#F9FAFB' },
  
  // Sekundärtext - Neutrales Grau
  muted: { light: '#6B7280', dark: '#9CA3AF' },
  
  // Borders/Dividers - Hellgrau
  border: { light: '#E5E7EB', dark: '#4B5563' },
  
  // Erfolg - Sanftes Grün (Freigaben, positive Aktionen)
  success: { light: '#10B981', dark: '#34D399' },
  
  // Warnung - Warmes Orange (Akzente, Call-to-Actions)
  warning: { light: '#F97316', dark: '#FB923C' },
  
  // Fehler - Rot (Ablehnungen, Fehler)
  error: { light: '#EF4444', dark: '#F87171' },
  
  // Akzent - Warmes Orange (für wichtige Buttons)
  accent: { light: '#F97316', dark: '#FB923C' },
  
  // Sterne - Gold
  star: { light: '#FFD700', dark: '#FFC700' },
};

module.exports = { themeColors };
