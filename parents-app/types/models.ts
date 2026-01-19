/**
 * Datenmodelle für SternWerk Elternapp
 * 
 * Diese Typen definieren die Datenstruktur für:
 * - Kinder (Child)
 * - Wünsche (RewardWish)
 * - Aufgaben (Task)
 * - Hefte (NoteEntry)
 */

// ============================================
// ENUMS & KONSTANTEN
// ============================================

/**
 * Schulfächer - synchronisiert mit Kinderapp
 */
export type SubjectType =
  | "mathe"
  | "deutsch"
  | "sachkunde"
  | "kunst"
  | "musik"
  | "sport"
  | "englisch"
  | "religion"
  | "alltag"; // Für Haushaltsaufgaben

/**
 * Status eines Wunsches im Sterne-Shop
 */
export type WishStatus =
  | "active" // Kind hat Wunsch erstellt, noch nicht genug Sterne
  | "pending" // Kind hat genug Sterne, wartet auf Eltern-Freigabe
  | "approved" // Eltern haben freigegeben
  | "rejected" // Eltern haben abgelehnt
  | "fulfilled"; // Wunsch wurde erfüllt

/**
 * Termin-Kategorien
 */
export type EventCategory = "schule" | "sport" | "freizeit" | "arzt" | "sonstiges";

/**
 * Theme-Namen für Kinderapp
 */
export type ThemeName = "default" | "huntrix" | "kaninchen" | "weltraum" | "dino" | "einhorn";

// ============================================
// HAUPT-DATENMODELLE
// ============================================

/**
 * Kind-Profil
 * Repräsentiert ein Kind, das die Kinderapp nutzt
 */
export interface Child {
  id: string; // UUID
  name: string; // Vorname des Kindes
  avatar: string; // Emoji oder Avatar-URL
  grade: number; // Klassenstufe (1-4)
  totalStars: number; // Gesamt-Sterne-Stand
  theme: ThemeName; // Gewähltes Theme in der Kinderapp
  createdAt: Date; // Erstellungsdatum
  lastActivity?: Date; // Letzte Aktivität in der Kinderapp
}

/**
 * Wunsch aus dem Sterne-Shop
 * Kinder erstellen Wünsche, Eltern genehmigen sie
 */
export interface RewardWish {
  id: string; // UUID
  childId: string; // Referenz zu Child.id
  title: string; // Wunsch-Titel (z.B. "Playstation Spiel")
  starPrice: number; // Kosten in Sternen
  status: WishStatus; // Aktueller Status
  createdAt: Date; // Erstellungsdatum (von Kind)
  approvedAt?: Date; // Freigabe-Datum (von Eltern)
  rejectedAt?: Date; // Ablehnungs-Datum (von Eltern)
  fulfilledAt?: Date; // Erfüllungs-Datum
  parentNote?: string; // Notiz der Eltern (optional)
}

/**
 * Aufgabe (Hausaufgabe oder Alltags-Aufgabe)
 * Kann von Kind oder Eltern erstellt werden
 */
export interface Task {
  id: string; // UUID
  childId: string; // Referenz zu Child.id
  title: string; // Aufgaben-Titel
  subject?: SubjectType; // Fach (optional, nur für Schulaufgaben)
  done: boolean; // Erledigt?
  starsAwarded: number; // Sterne-Belohnung
  dueDate?: Date; // Fälligkeitsdatum (optional)
  createdAt: Date; // Erstellungsdatum
  createdBy: "child" | "parent"; // Wer hat die Aufgabe erstellt?
  completedAt?: Date; // Erledigungs-Datum
}

/**
 * Heft-Eintrag (fotografiertes Schulheft)
 * Wird von Kindern in der Kinderapp erstellt
 */
export interface NoteEntry {
  id: string; // UUID
  childId: string; // Referenz zu Child.id
  subject: SubjectType; // Fach
  topic: string; // Thema (z.B. "Plus bis 20")
  photoUri: string; // Lokaler Pfad zum Foto
  understood: boolean; // Hat Kind "Verstanden" markiert?
  starsEarned: number; // Verdiente Sterne (5 wenn verstanden)
  date: Date; // Datum des Hefts
  createdAt: Date; // Upload-Datum
  parentNote?: string; // Notiz der Eltern (optional)
}

/**
 * Termin/Event
 * Schultermine, Sport, Arzttermine etc.
 */
export interface Event {
  id: string; // UUID
  childId: string; // Referenz zu Child.id
  title: string; // Termin-Titel
  date: Date; // Termin-Datum und Uhrzeit
  category: EventCategory; // Kategorie
  reminder: boolean; // Erinnerung aktiviert?
  createdAt: Date; // Erstellungsdatum
  createdBy: "child" | "parent"; // Wer hat den Termin erstellt?
}

// ============================================
// HELPER-TYPEN FÜR UI
// ============================================

/**
 * Kind-Statistik für Dashboard
 */
export interface ChildStats {
  childId: string;
  totalStars: number;
  pendingWishes: number; // Anzahl wartender Wünsche
  tasksToday: number; // Anzahl Aufgaben heute
  completedTasksToday: number; // Anzahl erledigte Aufgaben heute
  lastActivity?: Date;
}

/**
 * Wunsch mit Kind-Info (für Freigaben-Screen)
 */
export interface WishWithChild extends RewardWish {
  child: Child;
}

/**
 * Aufgabe mit Kind-Info
 */
export interface TaskWithChild extends Task {
  child: Child;
}

/**
 * Heft mit Kind-Info
 */
export interface NoteWithChild extends NoteEntry {
  child: Child;
}

/**
 * Fach-Info mit Farbe und Icon
 */
export interface SubjectInfo {
  type: SubjectType;
  label: string; // Deutscher Name
  color: string; // Hex-Farbe
  icon: string; // Emoji
}

/**
 * Fach-Mapping für UI
 */
export const SUBJECTS: Record<SubjectType, SubjectInfo> = {
  mathe: { type: "mathe", label: "Mathe", color: "#A8D8EA", icon: "🧮" },
  deutsch: { type: "deutsch", label: "Deutsch", color: "#FFB4A2", icon: "📝" },
  sachkunde: { type: "sachkunde", label: "Sachkunde", color: "#FFD4E5", icon: "🌍" },
  kunst: { type: "kunst", label: "Kunst", color: "#D4C5F9", icon: "🎨" },
  musik: { type: "musik", label: "Musik", color: "#FFE5A0", icon: "🎵" },
  sport: { type: "sport", label: "Sport", color: "#B8E6D5", icon: "⚽" },
  englisch: { type: "englisch", label: "Englisch", color: "#FFB4A2", icon: "🇬🇧" },
  religion: { type: "religion", label: "Religion", color: "#D4C5F9", icon: "✝️" },
  alltag: { type: "alltag", label: "Alltag", color: "#9E9E9E", icon: "🏠" },
};

/**
 * Status-Labels für Wünsche
 */
export const WISH_STATUS_LABELS: Record<WishStatus, string> = {
  active: "Aktiv",
  pending: "Wartet auf Freigabe",
  approved: "Genehmigt",
  rejected: "Abgelehnt",
  fulfilled: "Erfüllt",
};
