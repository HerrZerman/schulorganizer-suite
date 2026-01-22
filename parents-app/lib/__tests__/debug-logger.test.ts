/**
 * Unit-Tests für Debug-Logger
 * 
 * Testet alle Funktionen des Debug-Logging-Systems
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  logError,
  logWarning,
  logInfo,
  logSuccess,
  loadLogs,
  clearLogs,
  exportLogs,
  getLogStats,
  filterLogsByLevel,
  type LogEntry,
} from "../debug-logger";

describe("Debug-Logger", () => {
  // Vor jedem Test: Logs löschen
  beforeEach(async () => {
    await clearLogs();
  });

  describe("logError", () => {
    it("sollte einen Error-Log erstellen", async () => {
      await logError("TestContext", "Test-Fehlermeldung", { test: true });

      const logs = await loadLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe("error");
      expect(logs[0].context).toBe("TestContext");
      expect(logs[0].message).toBe("Test-Fehlermeldung");
      expect(logs[0].details).toEqual({ test: true });
    });

    it("sollte Stack-Trace bei Error-Objekten speichern", async () => {
      const error = new Error("Test-Error");
      await logError("TestContext", "Fehler aufgetreten", {}, error);

      const logs = await loadLogs();
      expect(logs[0].stack).toBeDefined();
      expect(logs[0].stack).toContain("Error: Test-Error");
    });
  });

  describe("logWarning", () => {
    it("sollte einen Warning-Log erstellen", async () => {
      await logWarning("TestContext", "Test-Warnung");

      const logs = await loadLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe("warning");
      expect(logs[0].context).toBe("TestContext");
      expect(logs[0].message).toBe("Test-Warnung");
    });
  });

  describe("logInfo", () => {
    it("sollte einen Info-Log erstellen", async () => {
      await logInfo("TestContext", "Test-Info");

      const logs = await loadLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe("info");
      expect(logs[0].context).toBe("TestContext");
      expect(logs[0].message).toBe("Test-Info");
    });
  });

  describe("logSuccess", () => {
    it("sollte einen Success-Log erstellen", async () => {
      await logSuccess("TestContext", "Test-Erfolg");

      const logs = await loadLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe("success");
      expect(logs[0].context).toBe("TestContext");
      expect(logs[0].message).toBe("Test-Erfolg");
    });
  });

  describe("loadLogs", () => {
    it("sollte leeres Array zurückgeben wenn keine Logs vorhanden", async () => {
      const logs = await loadLogs();
      expect(logs).toEqual([]);
    });

    it("sollte alle gespeicherten Logs laden", async () => {
      await logError("Context1", "Error 1");
      await logWarning("Context2", "Warning 1");
      await logInfo("Context3", "Info 1");

      const logs = await loadLogs();
      expect(logs).toHaveLength(3);
    });

    it("sollte Datum-Strings in Date-Objekte konvertieren", async () => {
      await logInfo("TestContext", "Test");

      const logs = await loadLogs();
      expect(logs[0].timestamp).toBeInstanceOf(Date);
    });
  });

  describe("clearLogs", () => {
    it("sollte alle Logs löschen", async () => {
      await logError("Context1", "Error 1");
      await logWarning("Context2", "Warning 1");

      let logs = await loadLogs();
      expect(logs).toHaveLength(2);

      await clearLogs();

      logs = await loadLogs();
      expect(logs).toEqual([]);
    });
  });

  describe("exportLogs", () => {
    it("sollte Logs als JSON-String exportieren", async () => {
      await logError("TestContext", "Test-Error");

      const exported = await exportLogs();
      const parsed = JSON.parse(exported);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].level).toBe("error");
      expect(parsed[0].context).toBe("TestContext");
    });

    it("sollte leeres Array exportieren wenn keine Logs vorhanden", async () => {
      const exported = await exportLogs();
      expect(exported).toBe("[]");
    });
  });

  describe("filterLogsByLevel", () => {
    beforeEach(async () => {
      await logError("Context1", "Error 1");
      await logError("Context2", "Error 2");
      await logWarning("Context3", "Warning 1");
      await logInfo("Context4", "Info 1");
      await logSuccess("Context5", "Success 1");
    });

    it("sollte nur Errors filtern", async () => {
      const logs = await loadLogs();
      const errors = filterLogsByLevel(logs, "error");

      expect(errors).toHaveLength(2);
      expect(errors.every((log) => log.level === "error")).toBe(true);
    });

    it("sollte nur Warnings filtern", async () => {
      const logs = await loadLogs();
      const warnings = filterLogsByLevel(logs, "warning");

      expect(warnings).toHaveLength(1);
      expect(warnings[0].level).toBe("warning");
    });

    it("sollte nur Infos filtern", async () => {
      const logs = await loadLogs();
      const infos = filterLogsByLevel(logs, "info");

      expect(infos).toHaveLength(1);
      expect(infos[0].level).toBe("info");
    });

    it("sollte nur Success filtern", async () => {
      const logs = await loadLogs();
      const successes = filterLogsByLevel(logs, "success");

      expect(successes).toHaveLength(1);
      expect(successes[0].level).toBe("success");
    });
  });

  describe("getLogStats", () => {
    it("sollte korrekte Statistiken zurückgeben", async () => {
      await logError("Context1", "Error 1");
      await logError("Context2", "Error 2");
      await logWarning("Context3", "Warning 1");
      await logInfo("Context4", "Info 1");
      await logInfo("Context5", "Info 2");
      await logSuccess("Context6", "Success 1");

      const logs = await loadLogs();
      const stats = getLogStats(logs);

      expect(stats.total).toBe(6);
      expect(stats.errors).toBe(2);
      expect(stats.warnings).toBe(1);
      expect(stats.info).toBe(2);
      expect(stats.success).toBe(1);
    });

    it("sollte Null-Statistiken für leere Logs zurückgeben", async () => {
      const logs = await loadLogs();
      const stats = getLogStats(logs);

      expect(stats.total).toBe(0);
      expect(stats.errors).toBe(0);
      expect(stats.warnings).toBe(0);
      expect(stats.info).toBe(0);
      expect(stats.success).toBe(0);
    });
  });

  describe("Log-Eigenschaften", () => {
    it("sollte eindeutige IDs generieren", async () => {
      await logInfo("Context1", "Info 1");
      await logInfo("Context2", "Info 2");

      const logs = await loadLogs();
      expect(logs[0].id).not.toBe(logs[1].id);
    });

    it("sollte Timestamp setzen", async () => {
      const before = new Date();
      await logInfo("TestContext", "Test");
      const after = new Date();

      const logs = await loadLogs();
      const logTime = new Date(logs[0].timestamp);

      expect(logTime.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(logTime.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it("sollte Details optional speichern", async () => {
      await logInfo("Context1", "Ohne Details");
      await logInfo("Context2", "Mit Details", { key: "value" });

      const logs = await loadLogs();
      expect(logs[0].details).toBeUndefined();
      expect(logs[1].details).toEqual({ key: "value" });
    });
  });
});
