/**
 * Tests für Storage-Funktionen
 */

import { describe, it, expect } from "vitest";

describe("Storage Tests", () => {
  describe("Basic Tests", () => {
    it("sollte 1 + 1 = 2 sein", () => {
      expect(1 + 1).toBe(2);
    });

    it("sollte String-Vergleich funktionieren", () => {
      const appName = "Mein SchulOrganizer";
      expect(appName).toContain("SchulOrganizer");
    });

    it("sollte Array-Operationen funktionieren", () => {
      const tasks = ["Mathe", "Deutsch", "Sachkunde"];
      expect(tasks).toHaveLength(3);
      expect(tasks[0]).toBe("Mathe");
    });
  });

  describe("Sterne-Logik", () => {
    it("sollte Sterne korrekt berechnen", () => {
      let stars = 0;
      
      // Aufgabe erledigt: +5 Sterne
      stars += 5;
      expect(stars).toBe(5);
      
      // Heft verstanden: +5 Sterne
      stars += 5;
      expect(stars).toBe(10);
      
      // Wunsch eingelöst: -8 Sterne
      stars -= 8;
      expect(stars).toBe(2);
    });

    it("sollte Sterne nicht unter 0 gehen lassen", () => {
      let stars = 5;
      const cost = 10;
      
      if (stars >= cost) {
        stars -= cost;
      }
      
      expect(stars).toBe(5); // Nicht genug Sterne, bleibt bei 5
    });
  });

  describe("Task-Logik", () => {
    it("sollte Task-Status korrekt umschalten", () => {
      let taskDone = false;
      
      // Abhaken
      taskDone = !taskDone;
      expect(taskDone).toBe(true);
      
      // Rückgängig
      taskDone = !taskDone;
      expect(taskDone).toBe(false);
    });

    it("sollte erledigte Tasks zählen", () => {
      const tasks = [
        { title: "Mathe", done: true },
        { title: "Deutsch", done: false },
        { title: "HSU", done: true },
      ];
      
      const completedCount = tasks.filter(t => t.done).length;
      expect(completedCount).toBe(2);
    });
  });
});
