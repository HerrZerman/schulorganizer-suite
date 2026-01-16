/**
 * Storage Helper für AsyncStorage
 * 
 * Zentrale Funktionen zum Speichern und Laden von Daten.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  ChildProfile,
  NoteEntry,
  Task,
  Event,
  RewardWish,
  StarLedger,
  ChildStats,
  AppSettings,
} from "@/types/models";

// ============================================
// Storage Keys
// ============================================

const KEYS = {
  CHILD_PROFILE: "child_profile",
  NOTE_ENTRIES: "note_entries",
  TASKS: "tasks",
  EVENTS: "events",
  WISHES: "wishes",
  STAR_LEDGER: "star_ledger",
  STATS: "stats",
  SETTINGS: "settings",
  TOTAL_STARS: "total_stars",
} as const;

// ============================================
// Generic Storage Functions
// ============================================

async function saveData<T>(key: string, data: T): Promise<void> {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Fehler beim Speichern von ${key}:`, error);
    throw error;
  }
}

async function loadData<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
  } catch (error) {
    console.error(`Fehler beim Laden von ${key}:`, error);
    return defaultValue;
  }
}

async function deleteData(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Fehler beim Löschen von ${key}:`, error);
    throw error;
  }
}

// ============================================
// Child Profile
// ============================================

export async function saveChildProfile(profile: ChildProfile): Promise<void> {
  await saveData(KEYS.CHILD_PROFILE, profile);
}

export async function loadChildProfile(): Promise<ChildProfile | null> {
  return await loadData<ChildProfile | null>(KEYS.CHILD_PROFILE, null);
}

// ============================================
// Note Entries (Hefte)
// ============================================

export async function saveNoteEntries(entries: NoteEntry[]): Promise<void> {
  await saveData(KEYS.NOTE_ENTRIES, entries);
}

export async function loadNoteEntries(): Promise<NoteEntry[]> {
  return await loadData<NoteEntry[]>(KEYS.NOTE_ENTRIES, []);
}

export async function addNoteEntry(entry: NoteEntry): Promise<void> {
  const entries = await loadNoteEntries();
  entries.push(entry);
  await saveNoteEntries(entries);
}

export async function updateNoteEntry(id: string, updates: Partial<NoteEntry>): Promise<void> {
  const entries = await loadNoteEntries();
  const index = entries.findIndex((e) => e.id === id);
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updates, updatedAt: new Date() };
    await saveNoteEntries(entries);
  }
}

export async function deleteNoteEntry(id: string): Promise<void> {
  const entries = await loadNoteEntries();
  const filtered = entries.filter((e) => e.id !== id);
  await saveNoteEntries(filtered);
}

// ============================================
// Tasks (Aufgaben)
// ============================================

export async function saveTasks(tasks: Task[]): Promise<void> {
  await saveData(KEYS.TASKS, tasks);
}

export async function loadTasks(): Promise<Task[]> {
  return await loadData<Task[]>(KEYS.TASKS, []);
}

export async function addTask(task: Task): Promise<void> {
  const tasks = await loadTasks();
  tasks.push(task);
  await saveTasks(tasks);
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<void> {
  const tasks = await loadTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date() };
    await saveTasks(tasks);
  }
}

export async function deleteTask(id: string): Promise<void> {
  const tasks = await loadTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  await saveTasks(filtered);
}

export async function toggleTaskDone(id: string): Promise<number> {
  const tasks = await loadTasks();
  const task = tasks.find((t) => t.id === id);
  
  if (!task) return 0;
  
  const newDoneState = !task.done;
  const starsAwarded = newDoneState ? task.starsAwarded : -task.starsAwarded;
  
  await updateTask(id, {
    done: newDoneState,
    completedAt: newDoneState ? new Date() : undefined,
  });
  
  // Sterne hinzufügen/entfernen
  if (starsAwarded !== 0) {
    await addStars(starsAwarded, "task_completed", id);
  }
  
  return starsAwarded;
}

// ============================================
// Events (Termine)
// ============================================

export async function saveEvents(events: Event[]): Promise<void> {
  await saveData(KEYS.EVENTS, events);
}

export async function loadEvents(): Promise<Event[]> {
  return await loadData<Event[]>(KEYS.EVENTS, []);
}

export async function addEvent(event: Event): Promise<void> {
  const events = await loadEvents();
  events.push(event);
  await saveEvents(events);
}

export async function updateEvent(id: string, updates: Partial<Event>): Promise<void> {
  const events = await loadEvents();
  const index = events.findIndex((e) => e.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...updates, updatedAt: new Date() };
    await saveEvents(events);
  }
}

export async function deleteEvent(id: string): Promise<void> {
  const events = await loadEvents();
  const filtered = events.filter((e) => e.id !== id);
  await saveEvents(filtered);
}

// ============================================
// Reward Wishes (Wünsche)
// ============================================

export async function saveWishes(wishes: RewardWish[]): Promise<void> {
  await saveData(KEYS.WISHES, wishes);
}

export async function loadWishes(): Promise<RewardWish[]> {
  return await loadData<RewardWish[]>(KEYS.WISHES, []);
}

export async function addWish(wish: RewardWish): Promise<void> {
  const wishes = await loadWishes();
  wishes.push(wish);
  await saveWishes(wishes);
}

export async function updateWish(id: string, updates: Partial<RewardWish>): Promise<void> {
  const wishes = await loadWishes();
  const index = wishes.findIndex((w) => w.id === id);
  if (index !== -1) {
    wishes[index] = { ...wishes[index], ...updates, updatedAt: new Date() };
    await saveWishes(wishes);
  }
}

export async function deleteWish(id: string): Promise<void> {
  const wishes = await loadWishes();
  const filtered = wishes.filter((w) => w.id !== id);
  await saveWishes(filtered);
}

// ============================================
// Stars (Sterne)
// ============================================

export async function getTotalStars(): Promise<number> {
  return await loadData<number>(KEYS.TOTAL_STARS, 0);
}

export async function setTotalStars(stars: number): Promise<void> {
  await saveData(KEYS.TOTAL_STARS, stars);
}

export async function addStars(
  amount: number,
  reason: string,
  sourceId?: string
): Promise<number> {
  const currentStars = await getTotalStars();
  const newTotal = Math.max(0, currentStars + amount);
  await setTotalStars(newTotal);
  
  // Ledger-Eintrag erstellen
  const ledger = await loadData<StarLedger[]>(KEYS.STAR_LEDGER, []);
  ledger.push({
    id: Date.now().toString(),
    childId: "default",
    amount,
    reason,
    source: "manual",
    sourceId,
    timestamp: new Date(),
  });
  await saveData(KEYS.STAR_LEDGER, ledger);
  
  return newTotal;
}

export async function spendStars(amount: number, reason: string, sourceId?: string): Promise<number> {
  return await addStars(-amount, reason, sourceId);
}

// ============================================
// Stats (Statistiken)
// ============================================

export async function saveStats(stats: ChildStats): Promise<void> {
  await saveData(KEYS.STATS, stats);
}

export async function loadStats(): Promise<ChildStats | null> {
  return await loadData<ChildStats | null>(KEYS.STATS, null);
}

// ============================================
// Settings (Einstellungen)
// ============================================

export async function saveSettings(settings: AppSettings): Promise<void> {
  await saveData(KEYS.SETTINGS, settings);
}

export async function loadSettings(): Promise<AppSettings | null> {
  return await loadData<AppSettings | null>(KEYS.SETTINGS, null);
}

// ============================================
// Clear All Data (für Testing)
// ============================================

export async function clearAllData(): Promise<void> {
  await AsyncStorage.clear();
}
