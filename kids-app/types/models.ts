/**
 * Datenmodelle für die SchulOrganizer App
 * 
 * Diese Interfaces definieren die Struktur aller Daten in der App.
 */

// ============================================
// Benutzer & Profil
// ============================================

export interface ChildProfile {
  id: string;
  name: string;
  avatar: string; // Emoji oder Bild-URL
  grade: number; // Klassenstufe (1-4)
  school?: string; // Optional: Schulname
  theme: ThemeName; // Aktuelles Theme
  backgroundImage?: string; // Optional: Hintergrundbild
  createdAt: Date;
  updatedAt: Date;
}

export type ThemeName = 
  | "standard" 
  | "huntrix" 
  | "kaninchen" 
  | "weltraum" 
  | "dino" 
  | "einhorn" 
  | "baustelle";

// ============================================
// Fächer
// ============================================

export type SubjectType = 
  | "mathe" 
  | "deutsch" 
  | "sachkunde" 
  | "englisch" 
  | "kunst" 
  | "musik" 
  | "sport" 
  | "religion";

export interface Subject {
  id: SubjectType;
  name: string; // z.B. "Mathematik"
  shortName: string; // z.B. "Mathe"
  icon: string; // Icon-Name
  color: string; // Hex-Farbe
}

// ============================================
// Hefte-Einträge
// ============================================

export interface NoteEntry {
  id: string;
  childId: string;
  subject: SubjectType;
  topic: string; // z.B. "Plus bis 20"
  date: Date;
  photoUri: string; // Lokaler Pfad zum Foto
  ocrText?: string; // Extrahierter Text (optional)
  difficulty?: "easy" | "medium" | "hard"; // KI-Einschätzung
  understood: boolean; // "Verstanden" Button geklickt
  starsEarned: number; // Sterne für "Verstanden"
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Aufgaben
// ============================================

export interface Task {
  id: string;
  childId: string;
  title: string; // z.B. "Mathe Seite 12 rechnen"
  description?: string; // Optional: Details
  subject?: SubjectType; // Optional: Fach-Zuordnung
  dueDate?: Date; // Optional: Fälligkeitsdatum
  recurrence?: RecurrenceType; // Optional: Wiederholung
  linkedNoteEntryId?: string; // Optional: Verknüpfung mit Hefte-Eintrag
  photoUri?: string; // Optional: Beweis-Foto (z.B. aufgeräumtes Zimmer)
  done: boolean;
  starsAwarded: number; // Sterne beim Abhaken
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type RecurrenceType = 
  | "once" 
  | "daily" 
  | "weekdays" // Mo-Fr
  | "weekly" 
  | "custom";

// ============================================
// Termine
// ============================================

export interface Event {
  id: string;
  childId: string;
  title: string; // z.B. "Mathetest"
  description?: string;
  date: Date;
  time?: string; // Optional: "09:00"
  category: EventCategory;
  photoUri?: string; // Optional: Foto vom Event (z.B. Sportereignis)
  reminder?: boolean; // Push-Benachrichtigung
  reminderMinutes?: number; // z.B. 30 (30 Min vorher)
  voiceInputSource?: string; // Optional: Spracheingabe-Text
  createdAt: Date;
  updatedAt: Date;
}

export type EventCategory = 
  | "schule" 
  | "sport" 
  | "freizeit" 
  | "arzt" 
  | "sonstiges";

// ============================================
// Belohnungssystem
// ============================================

export interface RewardWish {
  id: string;
  childId: string;
  title: string; // z.B. "Playstation Spiel"
  description?: string;
  imageUrl?: string; // URL zum Produktbild (automatisch gesucht)
  starPrice: number; // Kosten in Sternen
  status: WishStatus;
  requestedAt?: Date; // Wann wurde Einlösung angefragt
  approvedAt?: Date; // Wann von Eltern genehmigt
  rejectedAt?: Date; // Wann von Eltern abgelehnt
  fulfilledAt?: Date; // Wann eingelöst
  createdAt: Date;
  updatedAt: Date;
}

export type WishStatus = 
  | "active" // Noch nicht genug Sterne
  | "ready" // Genug Sterne, noch nicht angefragt
  | "pending" // Wartet auf Eltern-Freigabe
  | "approved" // Von Eltern genehmigt
  | "rejected" // Von Eltern abgelehnt
  | "fulfilled"; // Eingelöst

export interface StarLedger {
  id: string;
  childId: string;
  amount: number; // Positiv = verdient, Negativ = ausgegeben
  reason: string; // z.B. "Aufgabe erledigt", "Wunsch eingelöst"
  source: StarSource;
  sourceId?: string; // ID der Aufgabe/Wunsch/etc.
  timestamp: Date;
}

export type StarSource = 
  | "task_completed" 
  | "note_understood" 
  | "exercise_completed" 
  | "wish_redeemed" 
  | "bonus" // Von Eltern vergeben
  | "manual"; // Manuell hinzugefügt/entfernt

// ============================================
// Statistiken
// ============================================

export interface ChildStats {
  childId: string;
  totalStars: number;
  starsThisWeek: number;
  tasksCompletedToday: number;
  tasksCompletedThisWeek: number;
  notesAdded: number;
  difficultTopics: DifficultTopic[];
  lastUpdated: Date;
}

export interface DifficultTopic {
  subject: SubjectType;
  topic: string;
  count: number; // Wie oft als schwierig markiert
}

// ============================================
// App-Einstellungen
// ============================================

export interface AppSettings {
  childId: string;
  notifications: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  theme: ThemeName;
  backgroundImage?: string;
  language: "de" | "en" | "tr"; // Deutsch, Englisch, Türkisch
}
