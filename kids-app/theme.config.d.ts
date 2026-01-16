export const themeColors: {
  // Primärfarben
  primary: { light: string; dark: string };
  secondary: { light: string; dark: string };
  accent: { light: string; dark: string };
  
  // Hintergrund & Oberflächen
  background: { light: string; dark: string };
  surface: { light: string; dark: string };
  
  // Text
  foreground: { light: string; dark: string };
  muted: { light: string; dark: string };
  
  // Borders
  border: { light: string; dark: string };
  
  // Fach-Farben
  math: { light: string; dark: string };
  german: { light: string; dark: string };
  science: { light: string; dark: string };
  art: { light: string; dark: string };
  music: { light: string; dark: string };
  sports: { light: string; dark: string };
  
  // Status
  success: { light: string; dark: string };
  warning: { light: string; dark: string };
  error: { light: string; dark: string };
  
  // Sterne & Belohnungen
  star: { light: string; dark: string };
  reward: { light: string; dark: string };
};

declare const themeConfig: {
  themeColors: typeof themeColors;
};

export default themeConfig;
