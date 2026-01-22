/**
 * Storage-Helper für SternWerk Elternapp
 * 
 * Verwaltet lokale Datenspeicherung mit AsyncStorage
 * Alle Daten werden lokal gespeichert (offline-first)
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Child, RewardWish, Task, NoteEntry, Event } from "@/types/models";
import { logError, logWarning, logInfo, logSuccess } from "./debug-logger";

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
      // Keine Daten vorhanden (normaler Zustand bei erstem Start)
      return [];
    }
    const parsed = JSON.parse(jsonValue);
    // Datum-Strings zurück in Date-Objekte konvertieren
    const result = Array.isArray(parsed) ? parsed.map(deserializeDates) : [];
    
    // Erfolg loggen
    await logInfo("Storage.loadData", `${result.length} Einträge von ${key} geladen`);
    return result;
  } catch (error) {
    // Fehler beim Laden protokollieren
    await logError(
      "Storage.loadData",
      `Fehler beim Laden von ${key}`,
      { key },
      error as Error
    );
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
    
    // Erfolg loggen
    await logInfo("Storage.saveData", `${data.length} Einträge in ${key} gespeichert`);
  } catch (error) {
    // Fehler beim Speichern protokollieren
    await logError(
      "Storage.saveData",
      `Fehler beim Speichern von ${key}`,
      { key, dataLength: data.length },
      error as Error
    );
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
  try {
    // Eingabe-Validierung
    if (!child.name || child.name.trim() === "") {
      const error = new Error("Name darf nicht leer sein");
      await logError("Storage.addChild", "Validierung fehlgeschlagen: Name fehlt", { child });
      throw error;
    }
    
    if (!child.grade || child.grade < 1 || child.grade > 4) {
      const error = new Error("Klasse muss zwischen 1 und 4 liegen");
      await logError("Storage.addChild", "Validierung fehlgeschlagen: Ungültige Klasse", { child });
      throw error;
    }

    const children = await loadChildren();
    const newChild: Child = {
      ...child,
      id: generateId(),
      createdAt: new Date(),
    };
    children.push(newChild);
    await saveChildren(children);
    
    // Erfolg loggen
    await logSuccess("Storage.addChild", `Kind "${newChild.name}" hinzugefügt`, { id: newChild.id });
    return newChild;
  } catch (error) {
    // Fehler protokollieren
    await logError("Storage.addChild", "Kind konnte nicht hinzugefügt werden", { child }, error as Error);
    throw error;
  }
}

/**
 * Kind aktualisieren
 */
export async function updateChild(id: string, updates: Partial<Child>): Promise<Child | null> {
  try {
    // Eingabe-Validierung
    if (!id || id.trim() === "") {
      const error = new Error("ID darf nicht leer sein");
      await logError("Storage.updateChild", "Validierung fehlgeschlagen: ID fehlt", { id, updates });
      throw error;
    }

    const children = await loadChildren();
    const index = children.findIndex((c) => c.id === id);
    
    if (index === -1) {
      await logWarning("Storage.updateChild", `Kind mit ID "${id}" nicht gefunden`, { id });
      return null;
    }

    children[index] = { ...children[index], ...updates };
    await saveChildren(children);
    
    // Erfolg loggen
    await logSuccess("Storage.updateChild", `Kind "${children[index].name}" aktualisiert`, { id, updates });
    return children[index];
  } catch (error) {
    // Fehler protokollieren
    await logError("Storage.updateChild", "Kind konnte nicht aktualisiert werden", { id, updates }, error as Error);
    throw error;
  }
}

/**
 * Kind löschen
 */
export async function deleteChild(id: string): Promise<boolean> {
  try {
    // Eingabe-Validierung
    if (!id || id.trim() === "") {
      const error = new Error("ID darf nicht leer sein");
      await logError("Storage.deleteChild", "Validierung fehlgeschlagen: ID fehlt", { id });
      throw error;
    }

    const children = await loadChildren();
    const childToDelete = children.find((c) => c.id === id);
    const filtered = children.filter((c) => c.id !== id);
    
    if (filtered.length === children.length) {
      await logWarning("Storage.deleteChild", `Kind mit ID "${id}" nicht gefunden`, { id });
      return false;
    }

    await saveChildren(filtered);
    
    // Erfolg loggen
    await logSuccess("Storage.deleteChild", `Kind "${childToDelete?.name}" gelöscht`, { id });
    return true;
  } catch (error) {
    // Fehler protokollieren
    await logError("Storage.deleteChild", "Kind konnte nicht gelöscht werden", { id }, error as Error);
    throw error;
  }
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
  try {
    // Eingabe-Validierung
    if (!wish.title || wish.title.trim() === "") {
      const error = new Error("Titel darf nicht leer sein");
      await logError("Storage.addWish", "Validierung fehlgeschlagen: Titel fehlt", { wish });
      throw error;
    }
    
    if (!wish.starPrice || wish.starPrice < 1) {
      const error = new Error("Sterne-Preis muss mindestens 1 sein");
      await logError("Storage.addWish", "Validierung fehlgeschlagen: Ungültiger Preis", { wish });
      throw error;
    }
    
    if (!wish.childId || wish.childId.trim() === "") {
      const error = new Error("Kind-ID darf nicht leer sein");
      await logError("Storage.addWish", "Validierung fehlgeschlagen: Kind-ID fehlt", { wish });
      throw error;
    }

    const wishes = await loadWishes();
    const newWish: RewardWish = {
      ...wish,
      id: generateId(),
      createdAt: new Date(),
    };
    wishes.push(newWish);
    await saveWishes(wishes);
    
    // Erfolg loggen
    await logSuccess("Storage.addWish", `Wunsch "${newWish.title}" hinzugefügt`, { id: newWish.id, childId: wish.childId });
    return newWish;
  } catch (error) {
    // Fehler protokollieren
    await logError("Storage.addWish", "Wunsch konnte nicht hinzugefügt werden", { wish }, error as Error);
    throw error;
  }
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
  try {
    const result = await updateWish(id, {
      status: "approved",
      approvedAt: new Date(),
      parentNote,
    });
    
    if (result) {
      await logSuccess("Storage.approveWish", `Wunsch "${result.title}" genehmigt`, { id, parentNote });
    } else {
      await logWarning("Storage.approveWish", `Wunsch mit ID "${id}" nicht gefunden`, { id });
    }
    
    return result;
  } catch (error) {
    await logError("Storage.approveWish", "Wunsch konnte nicht genehmigt werden", { id, parentNote }, error as Error);
    throw error;
  }
}

/**
 * Wunsch ablehnen
 */
export async function rejectWish(id: string, parentNote?: string): Promise<RewardWish | null> {
  try {
    const result = await updateWish(id, {
      status: "rejected",
      rejectedAt: new Date(),
      parentNote,
    });
    
    if (result) {
      await logSuccess("Storage.rejectWish", `Wunsch "${result.title}" abgelehnt`, { id, parentNote });
    } else {
      await logWarning("Storage.rejectWish", `Wunsch mit ID "${id}" nicht gefunden`, { id });
    }
    
    return result;
  } catch (error) {
    await logError("Storage.rejectWish", "Wunsch konnte nicht abgelehnt werden", { id, parentNote }, error as Error);
    throw error;
  }
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
  try {
    // Eingabe-Validierung
    if (!task.title || task.title.trim() === "") {
      const error = new Error("Titel darf nicht leer sein");
      await logError("Storage.addTask", "Validierung fehlgeschlagen: Titel fehlt", { task });
      throw error;
    }
    
    if (!task.childId || task.childId.trim() === "") {
      const error = new Error("Kind-ID darf nicht leer sein");
      await logError("Storage.addTask", "Validierung fehlgeschlagen: Kind-ID fehlt", { task });
      throw error;
    }
    
    if (!task.starsAwarded || task.starsAwarded < 1) {
      const error = new Error("Sterne-Belohnung muss mindestens 1 sein");
      await logError("Storage.addTask", "Validierung fehlgeschlagen: Ungültige Sterne-Anzahl", { task });
      throw error;
    }

    const tasks = await loadTasks();
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date(),
    };
    tasks.push(newTask);
    await saveTasks(tasks);
    
    // Erfolg loggen
    await logSuccess("Storage.addTask", `Aufgabe "${newTask.title}" hinzugefügt`, { id: newTask.id, childId: task.childId });
    return newTask;
  } catch (error) {
    // Fehler protokollieren
    await logError("Storage.addTask", "Aufgabe konnte nicht hinzugefügt werden", { task }, error as Error);
    throw error;
  }
}

/**
 * Aufgabe aktualisieren
 */
export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
  try {
    // Eingabe-Validierung
    if (!id || id.trim() === "") {
      const error = new Error("ID darf nicht leer sein");
      await logError("Storage.updateTask", "Validierung fehlgeschlagen: ID fehlt", { id, updates });
      throw error;
    }

    const tasks = await loadTasks();
    const index = tasks.findIndex((t) => t.id === id);
    
    if (index === -1) {
      await logWarning("Storage.updateTask", `Aufgabe mit ID "${id}" nicht gefunden`, { id });
      return null;
    }

    tasks[index] = { ...tasks[index], ...updates };
    await saveTasks(tasks);
    
    // Erfolg loggen
    await logSuccess("Storage.updateTask", `Aufgabe "${tasks[index].title}" aktualisiert`, { id, updates });
    return tasks[index];
  } catch (error) {
    // Fehler protokollieren
    await logError("Storage.updateTask", "Aufgabe konnte nicht aktualisiert werden", { id, updates }, error as Error);
    throw error;
  }
}

/**
 * Aufgabe löschen
 */
export async function deleteTask(id: string): Promise<boolean> {
  try {
    // Eingabe-Validierung
    if (!id || id.trim() === "") {
      const error = new Error("ID darf nicht leer sein");
      await logError("Storage.deleteTask", "Validierung fehlgeschlagen: ID fehlt", { id });
      throw error;
    }

    const tasks = await loadTasks();
    const taskToDelete = tasks.find((t) => t.id === id);
    const filtered = tasks.filter((t) => t.id !== id);
    
    if (filtered.length === tasks.length) {
      await logWarning("Storage.deleteTask", `Aufgabe mit ID "${id}" nicht gefunden`, { id });
      return false;
    }

    await saveTasks(filtered);
    
    // Erfolg loggen
    await logSuccess("Storage.deleteTask", `Aufgabe "${taskToDelete?.title}" gelöscht`, { id });
    return true;
  } catch (error) {
    // Fehler protokollieren
    await logError("Storage.deleteTask", "Aufgabe konnte nicht gelöscht werden", { id }, error as Error);
    throw error;
  }
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
