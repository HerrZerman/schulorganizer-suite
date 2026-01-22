/**
 * Debug-Logger-System für SternWerk Elternapp
 * 
 * Protokolliert alle Fehler, Warnungen und wichtigen Ereignisse
 * für die Debug-Ansicht in den Einstellungen.
 * 
 * Features:
 * - Verschiedene Log-Level (error, warning, info, success)
 * - Timestamp für jeden Eintrag
 * - Kontext-Informationen (Screen, Funktion, Parameter)
 * - Persistente Speicherung in AsyncStorage
 * - Export-Funktion für Fehlerberichte
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

// ============================================
// TYPEN
// ============================================

/**
 * Log-Level für verschiedene Ereignistypen
 */
export type LogLevel = "error" | "warning" | "info" | "success";

/**
 * Einzelner Log-Eintrag
 */
export interface LogEntry {
  /** Eindeutige ID des Log-Eintrags */
  id: string;
  /** Zeitstempel des Ereignisses */
  timestamp: Date;
  /** Schweregrad des Ereignisses */
  level: LogLevel;
  /** Kontext (z.B. "Dashboard", "Storage.addChild") */
  context: string;
  /** Haupt-Nachricht */
  message: string;
  /** Optionale Detail-Informationen (z.B. Fehlerobjekt, Parameter) */
  details?: any;
  /** Stack-Trace bei Fehlern */
  stack?: string;
}

// ============================================
// KONSTANTEN
// ============================================

/** AsyncStorage Key für Log-Einträge */
const LOGS_STORAGE_KEY = "@sternwerk_debug_logs";

/** Maximale Anzahl gespeicherter Logs (älteste werden gelöscht) */
const MAX_LOG_ENTRIES = 500;

/** Flag ob Debug-Logging aktiviert ist (nur in Development) */
const DEBUG_ENABLED = typeof __DEV__ !== 'undefined' ? __DEV__ : true;

// ============================================
// LOGGER-FUNKTIONEN
// ============================================

/**
 * Generiert eine eindeutige ID für einen Log-Eintrag
 */
function generateLogId(): string {
  return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Lädt alle gespeicherten Log-Einträge aus AsyncStorage
 */
export async function loadLogs(): Promise<LogEntry[]> {
  try {
    const logsJson = await AsyncStorage.getItem(LOGS_STORAGE_KEY);
    if (!logsJson) return [];

    const logs = JSON.parse(logsJson);
    // Datum-Strings zurück in Date-Objekte konvertieren
    return logs.map((log: any) => ({
      ...log,
      timestamp: new Date(log.timestamp),
    }));
  } catch (error) {
    console.error("[DebugLogger] Fehler beim Laden der Logs:", error);
    return [];
  }
}

/**
 * Speichert Log-Einträge in AsyncStorage
 */
async function saveLogs(logs: LogEntry[]): Promise<void> {
  try {
    // Nur die neuesten MAX_LOG_ENTRIES behalten
    const trimmedLogs = logs.slice(-MAX_LOG_ENTRIES);
    await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(trimmedLogs));
  } catch (error) {
    console.error("[DebugLogger] Fehler beim Speichern der Logs:", error);
  }
}

/**
 * Fügt einen neuen Log-Eintrag hinzu
 * 
 * @param level - Schweregrad (error, warning, info, success)
 * @param context - Kontext (z.B. "Dashboard", "Storage.addChild")
 * @param message - Haupt-Nachricht
 * @param details - Optionale Detail-Informationen
 * @param error - Optionales Error-Objekt (für Stack-Trace)
 */
async function addLog(
  level: LogLevel,
  context: string,
  message: string,
  details?: any,
  error?: Error
): Promise<void> {
  // In Production nur Errors loggen
  if (!DEBUG_ENABLED && level !== "error") {
    return;
  }

  try {
    const logs = await loadLogs();

    const logEntry: LogEntry = {
      id: generateLogId(),
      timestamp: new Date(),
      level,
      context,
      message,
      details,
      stack: error?.stack,
    };

    logs.push(logEntry);
    await saveLogs(logs);

    // Auch in Console ausgeben (Development)
    if (__DEV__) {
      const emoji = {
        error: "❌",
        warning: "⚠️",
        info: "ℹ️",
        success: "✅",
      }[level];

      console.log(
        `${emoji} [${context}] ${message}`,
        details ? details : "",
        error ? error : ""
      );
    }
  } catch (err) {
    console.error("[DebugLogger] Fehler beim Hinzufügen eines Logs:", err);
  }
}

/**
 * Loggt einen Fehler
 * 
 * @example
 * logError("Storage.addChild", "Kind konnte nicht hinzugefügt werden", { name: "Emma" }, error);
 */
export async function logError(
  context: string,
  message: string,
  details?: any,
  error?: Error
): Promise<void> {
  await addLog("error", context, message, details, error);
}

/**
 * Loggt eine Warnung
 * 
 * @example
 * logWarning("Dashboard", "Keine Kinder vorhanden");
 */
export async function logWarning(
  context: string,
  message: string,
  details?: any
): Promise<void> {
  await addLog("warning", context, message, details);
}

/**
 * Loggt eine Info
 * 
 * @example
 * logInfo("Storage.loadChildren", "3 Kinder geladen");
 */
export async function logInfo(
  context: string,
  message: string,
  details?: any
): Promise<void> {
  await addLog("info", context, message, details);
}

/**
 * Loggt einen Erfolg
 * 
 * @example
 * logSuccess("Freigaben", "Wunsch genehmigt", { wishId: "123" });
 */
export async function logSuccess(
  context: string,
  message: string,
  details?: any
): Promise<void> {
  await addLog("success", context, message, details);
}

/**
 * Löscht alle Log-Einträge
 */
export async function clearLogs(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LOGS_STORAGE_KEY);
    console.log("[DebugLogger] Alle Logs gelöscht");
  } catch (error) {
    console.error("[DebugLogger] Fehler beim Löschen der Logs:", error);
  }
}

/**
 * Exportiert alle Logs als JSON-String
 * (kann z.B. per Share-Dialog geteilt werden)
 */
export async function exportLogs(): Promise<string> {
  try {
    const logs = await loadLogs();
    return JSON.stringify(logs, null, 2);
  } catch (error) {
    console.error("[DebugLogger] Fehler beim Exportieren der Logs:", error);
    return "[]";
  }
}

/**
 * Filtert Logs nach Level
 */
export function filterLogsByLevel(logs: LogEntry[], level: LogLevel): LogEntry[] {
  return logs.filter((log) => log.level === level);
}

/**
 * Filtert Logs nach Zeitraum
 */
export function filterLogsByDate(
  logs: LogEntry[],
  startDate: Date,
  endDate: Date
): LogEntry[] {
  return logs.filter((log) => {
    const logDate = new Date(log.timestamp);
    return logDate >= startDate && logDate <= endDate;
  });
}

/**
 * Gibt Statistiken über die Logs zurück
 */
export function getLogStats(logs: LogEntry[]): {
  total: number;
  errors: number;
  warnings: number;
  info: number;
  success: number;
} {
  return {
    total: logs.length,
    errors: logs.filter((l) => l.level === "error").length,
    warnings: logs.filter((l) => l.level === "warning").length,
    info: logs.filter((l) => l.level === "info").length,
    success: logs.filter((l) => l.level === "success").length,
  };
}
