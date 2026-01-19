/**
 * Storage-Helper für SternWerk Elternapp
 * 
 * Verwaltet lokale Datenspeicherung mit AsyncStorage
 * Alle Daten werden lokal gespeichert (offline-first)
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Child, RewardWish, Task, NoteEntry, Event } from "@/types/models";

// ============================================
// STORAGE KEYS
// ============================================

const STORAGE_KEYS = {
  CHILDREN: "@sternwerk_children", // Array<Child>
  WISHES: "@sternwerk_wishes", // Array<RewardWish>
  TASKS: "@sternwerk_tasks", // Array<Task>
  NOTES: "@sternwerk_notes", // Array<NoteEntry>
  EVENTS: "@sternwerk_events", // Array<Event>
} as const;

// ============================================
// GENERIC HELPER FUNCTIONS
// ============================================

/**
 * Daten aus AsyncStorage laden
 */
async function loadData<T>(key: string): Promise<T[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue === null) {
      return [];
    }
    const parsed = JSON.parse(jsonValue);
    // Datum-Strings zurück in Date-Objekte konvertieren
    return Array.isArray(parsed) ? parsed.map(deserializeDates) : [];
  } catch (error) {
    console.error(`Fehler beim Laden von ${key}:`, error);
    return [];
  }
}

/**
 * Daten in AsyncStorage speichern
 */
async function saveData<T>(key: string, data: T[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Fehler beim Speichern von ${key}:`, error);
    throw error;
  }
}

/**
 * Date-Strings zurück in Date-Objekte konvertieren
 */
function deserializeDates<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj };
  for (const key in result) {
    const value = result[key];
    // Prüfen ob es ein ISO-Date-String ist
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
      result[key] = new Date(value) as any;
    }
  }
  return result;
}

/**
 * UUID generieren (einfache Implementierung)
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// KINDER (CHILDREN)
// ============================================

/**
 * Alle Kinder laden
 */
export async function loadChildren(): Promise<Child[]> {
  return loadData<Child>(STORAGE_KEYS.CHILDREN);
}

/**
 * Alle Kinder speichern
 */
export async function saveChildren(children: Child[]): Promise<void> {
  return saveData(STORAGE_KEYS.CHILDREN, children);
}

/**
 * Kind hinzufügen
 */
export async function addChild(child: Omit<Child, "id" | "createdAt">): Promise<Child> {
  const children = await loadChildren();
  const newChild: Child = {
    ...child,
    id: generateId(),
    createdAt: new Date(),
  };
  children.push(newChild);
  await saveChildren(children);
  return newChild;
}

/**
 * Kind aktualisieren
 */
export async function updateChild(id: string, updates: Partial<Child>): Promise<Child | null> {
  const children = await loadChildren();
  const index = children.findIndex((c) => c.id === id);
  if (index === -1) return null;

  children[index] = { ...children[index], ...updates };
  await saveChildren(children);
  return children[index];
}

/**
 * Kind löschen
 */
export async function deleteChild(id: string): Promise<boolean> {
  const children = await loadChildren();
  const filtered = children.filter((c) => c.id !== id);
  if (filtered.length === children.length) return false;

  await saveChildren(filtered);
  return true;
}

// ============================================
// WÜNSCHE (WISHES)
// ============================================

/**
 * Alle Wünsche laden
 */
export async function loadWishes(): Promise<RewardWish[]> {
  return loadData<RewardWish>(STORAGE_KEYS.WISHES);
}

/**
 * Alle Wünsche speichern
 */
export async function saveWishes(wishes: RewardWish[]): Promise<void> {
  return saveData(STORAGE_KEYS.WISHES, wishes);
}

/**
 * Wunsch hinzufügen
 */
export async function addWish(wish: Omit<RewardWish, "id" | "createdAt">): Promise<RewardWish> {
  const wishes = await loadWishes();
  const newWish: RewardWish = {
    ...wish,
    id: generateId(),
    createdAt: new Date(),
  };
  wishes.push(newWish);
  await saveWishes(wishes);
  return newWish;
}

/**
 * Wunsch aktualisieren
 */
export async function updateWish(
  id: string,
  updates: Partial<RewardWish>
): Promise<RewardWish | null> {
  const wishes = await loadWishes();
  const index = wishes.findIndex((w) => w.id === id);
  if (index === -1) return null;

  wishes[index] = { ...wishes[index], ...updates };
  await saveWishes(wishes);
  return wishes[index];
}

/**
 * Wunsch genehmigen
 */
export async function approveWish(id: string, parentNote?: string): Promise<RewardWish | null> {
  return updateWish(id, {
    status: "approved",
    approvedAt: new Date(),
    parentNote,
  });
}

/**
 * Wunsch ablehnen
 */
export async function rejectWish(id: string, parentNote?: string): Promise<RewardWish | null> {
  return updateWish(id, {
    status: "rejected",
    rejectedAt: new Date(),
    parentNote,
  });
}

/**
 * Wünsche nach Status filtern
 */
export async function getWishesByStatus(status: RewardWish["status"]): Promise<RewardWish[]> {
  const wishes = await loadWishes();
  return wishes.filter((w) => w.status === status);
}

/**
 * Wartende Wünsche laden (pending)
 */
export async function getPendingWishes(): Promise<RewardWish[]> {
  return getWishesByStatus("pending");
}

// ============================================
// AUFGABEN (TASKS)
// ============================================

/**
 * Alle Aufgaben laden
 */
export async function loadTasks(): Promise<Task[]> {
  return loadData<Task>(STORAGE_KEYS.TASKS);
}

/**
 * Alle Aufgaben speichern
 */
export async function saveTasks(tasks: Task[]): Promise<void> {
  return saveData(STORAGE_KEYS.TASKS, tasks);
}

/**
 * Aufgabe hinzufügen
 */
export async function addTask(task: Omit<Task, "id" | "createdAt">): Promise<Task> {
  const tasks = await loadTasks();
  const newTask: Task = {
    ...task,
    id: generateId(),
    createdAt: new Date(),
  };
  tasks.push(newTask);
  await saveTasks(tasks);
  return newTask;
}

/**
 * Aufgabe aktualisieren
 */
export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
  const tasks = await loadTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  tasks[index] = { ...tasks[index], ...updates };
  await saveTasks(tasks);
  return tasks[index];
}

/**
 * Aufgabe löschen
 */
export async function deleteTask(id: string): Promise<boolean> {
  const tasks = await loadTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  if (filtered.length === tasks.length) return false;

  await saveTasks(filtered);
  return true;
}

/**
 * Aufgaben nach Kind-ID filtern
 */
export async function getTasksByChild(childId: string): Promise<Task[]> {
  const tasks = await loadTasks();
  return tasks.filter((t) => t.childId === childId);
}

/**
 * Aufgaben für heute laden
 */
export async function getTodayTasks(): Promise<Task[]> {
  const tasks = await loadTasks();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasks.filter((t) => {
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  });
}

// ============================================
// HEFTE (NOTES)
// ============================================

/**
 * Alle Hefte laden
 */
export async function loadNotes(): Promise<NoteEntry[]> {
  return loadData<NoteEntry>(STORAGE_KEYS.NOTES);
}

/**
 * Alle Hefte speichern
 */
export async function saveNotes(notes: NoteEntry[]): Promise<void> {
  return saveData(STORAGE_KEYS.NOTES, notes);
}

/**
 * Heft hinzufügen
 */
export async function addNote(note: Omit<NoteEntry, "id" | "createdAt">): Promise<NoteEntry> {
  const notes = await loadNotes();
  const newNote: NoteEntry = {
    ...note,
    id: generateId(),
    createdAt: new Date(),
  };
  notes.push(newNote);
  await saveNotes(notes);
  return newNote;
}

/**
 * Heft aktualisieren
 */
export async function updateNote(
  id: string,
  updates: Partial<NoteEntry>
): Promise<NoteEntry | null> {
  const notes = await loadNotes();
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) return null;

  notes[index] = { ...notes[index], ...updates };
  await saveNotes(notes);
  return notes[index];
}

/**
 * Hefte nach Kind-ID filtern
 */
export async function getNotesByChild(childId: string): Promise<NoteEntry[]> {
  const notes = await loadNotes();
  return notes.filter((n) => n.childId === childId);
}

/**
 * Hefte nach Fach filtern
 */
export async function getNotesBySubject(subject: NoteEntry["subject"]): Promise<NoteEntry[]> {
  const notes = await loadNotes();
  return notes.filter((n) => n.subject === subject);
}

// ============================================
// TERMINE (EVENTS)
// ============================================

/**
 * Alle Termine laden
 */
export async function loadEvents(): Promise<Event[]> {
  return loadData<Event>(STORAGE_KEYS.EVENTS);
}

/**
 * Alle Termine speichern
 */
export async function saveEvents(events: Event[]): Promise<void> {
  return saveData(STORAGE_KEYS.EVENTS, events);
}

/**
 * Termin hinzufügen
 */
export async function addEvent(event: Omit<Event, "id" | "createdAt">): Promise<Event> {
  const events = await loadEvents();
  const newEvent: Event = {
    ...event,
    id: generateId(),
    createdAt: new Date(),
  };
  events.push(newEvent);
  await saveEvents(events);
  return newEvent;
}

/**
 * Termin aktualisieren
 */
export async function updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
  const events = await loadEvents();
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return null;

  events[index] = { ...events[index], ...updates };
  await saveEvents(events);
  return events[index];
}

/**
 * Termin löschen
 */
export async function deleteEvent(id: string): Promise<boolean> {
  const events = await loadEvents();
  const filtered = events.filter((e) => e.id !== id);
  if (filtered.length === events.length) return false;

  await saveEvents(filtered);
  return true;
}

// ============================================
// STATISTIKEN & HELPER
// ============================================

/**
 * Statistiken für ein Kind berechnen
 */
export async function getChildStats(childId: string) {
  const [child, wishes, tasks] = await Promise.all([
    loadChildren().then((children) => children.find((c) => c.id === childId)),
    loadWishes().then((wishes) => wishes.filter((w) => w.childId === childId)),
    loadTasks().then((tasks) => tasks.filter((t) => t.childId === childId)),
  ]);

  if (!child) return null;

  const pendingWishes = wishes.filter((w) => w.status === "pending").length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasksToday = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  });

  const completedTasksToday = tasksToday.filter((t) => t.done).length;

  return {
    childId: child.id,
    totalStars: child.totalStars,
    pendingWishes,
    tasksToday: tasksToday.length,
    completedTasksToday,
    lastActivity: child.lastActivity,
  };
}

/**
 * Alle Daten löschen (für Datenschutz)
 */
export async function clearAllData(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(STORAGE_KEYS.CHILDREN),
    AsyncStorage.removeItem(STORAGE_KEYS.WISHES),
    AsyncStorage.removeItem(STORAGE_KEYS.TASKS),
    AsyncStorage.removeItem(STORAGE_KEYS.NOTES),
    AsyncStorage.removeItem(STORAGE_KEYS.EVENTS),
  ]);
}
