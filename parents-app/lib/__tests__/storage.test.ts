/**
 * Unit-Tests für Storage-Helper-Funktionen
 */

import { describe, it, expect, beforeEach } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  loadChildren,
  saveChildren,
  addChild,
  updateChild,
  deleteChild,
  loadWishes,
  addWish,
  updateWish,
  approveWish,
  rejectWish,
  getPendingWishes,
  loadTasks,
  addTask,
  updateTask,
  deleteTask,
  getTodayTasks,
  getChildStats,
  clearAllData,
} from "../storage";

// AsyncStorage vor jedem Test leeren
beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("Kinder (Children) Storage", () => {
  it("sollte ein Kind hinzufügen können", async () => {
    const child = await addChild({
      name: "Emma",
      avatar: "👧",
      grade: 3,
      totalStars: 0,
      theme: "default",
    });

    expect(child.id).toBeDefined();
    expect(child.name).toBe("Emma");
    expect(child.grade).toBe(3);
    expect(child.totalStars).toBe(0);
  });

  it("sollte alle Kinder laden können", async () => {
    await addChild({
      name: "Emma",
      avatar: "👧",
      grade: 3,
      totalStars: 100,
      theme: "default",
    });

    await addChild({
      name: "Max",
      avatar: "👦",
      grade: 1,
      totalStars: 50,
      theme: "default",
    });

    const children = await loadChildren();
    expect(children).toHaveLength(2);
    expect(children[0].name).toBe("Emma");
    expect(children[1].name).toBe("Max");
  });

  it("sollte ein Kind aktualisieren können", async () => {
    const child = await addChild({
      name: "Emma",
      avatar: "👧",
      grade: 3,
      totalStars: 100,
      theme: "default",
    });

    const updated = await updateChild(child.id, {
      totalStars: 150,
    });

    expect(updated?.totalStars).toBe(150);
    expect(updated?.name).toBe("Emma");
  });

  it("sollte ein Kind löschen können", async () => {
    const child = await addChild({
      name: "Emma",
      avatar: "👧",
      grade: 3,
      totalStars: 100,
      theme: "default",
    });

    const deleted = await deleteChild(child.id);
    expect(deleted).toBe(true);

    const children = await loadChildren();
    expect(children).toHaveLength(0);
  });
});

describe("Wünsche (Wishes) Storage", () => {
  it("sollte einen Wunsch hinzufügen können", async () => {
    const child = await addChild({
      name: "Emma",
      avatar: "👧",
      grade: 3,
      totalStars: 100,
      theme: "default",
    });

    const wish = await addWish({
      childId: child.id,
      title: "Playstation Spiel",
      starPrice: 200,
      status: "pending",
    });

    expect(wish.id).toBeDefined();
    expect(wish.title).toBe("Playstation Spiel");
    expect(wish.starPrice).toBe(200);
    expect(wish.status).toBe("pending");
  });

  it("sollte einen Wunsch genehmigen können", async () => {
    const child = await addChild({
      name: "Emma",
      avatar: "👧",
      grade: 3,
      totalStars: 200,
      theme: "default",
    });

    const wish = await addWish({
      childId: child.id,
      title: "Kinobesuch",
      starPrice: 100,
      status: "pending",
    });

    const approved = await approveWish(wish.id, "Viel Spaß!");
    expect(approved?.status).toBe("approved");
    expect(approved?.parentNote).toBe("Viel Spaß!");
    expect(approved?.approvedAt).toBeDefined();
  });

  it("sollte einen Wunsch ablehnen können", async () => {
    const child = await addChild({
      name: "Emma",
      avatar: "👧",
      grade: 3,
      totalStars: 50,
      theme: "default",
    });

    const wish = await addWish({
      childId: child.id,
      title: "Teures Spielzeug",
      starPrice: 500,
      status: "pending",
    });

    const rejected = await rejectWish(wish.id, "Zu teuer");
    expect(rejected?.status).toBe("rejected");
    expect(rejected?.parentNote).toBe("Zu teuer");
    expect(rejected?.rejectedAt).toBeDefined();
  });

  it("sollte wartende Wünsche filtern können", async () => {
    const child = await addChild({
      name: "Emma",
      avatar: "👧",
      grade: 3,
      totalStars: 200,
      theme: "default",
    });

    await addWish({
      childId: child.id,
      title: "Wunsch 1",
      starPrice: 100,
      status: "pending",
    });

    await addWish({
      childId: child.id,
      title: "Wunsch 2",
      starPrice: 150,
      status: "active",
    });

    const pending = await getPendingWishes();
    expect(pending).toHaveLength(1);
    expect(pending[0].title).toBe("Wunsch 1");
  });
});

describe("Aufgaben (Tasks) Storage", () => {
  it("sollte eine Aufgabe hinzufügen können", async () => {
    const child = await addChild({
      name: "Emma",
      avatar: "👧",
      grade: 3,
      totalStars: 100,
      theme: "default",
    });

    const task = await addTask({
      childId: child.id,
      title: "Zimmer aufräumen",
      done: false,
      starsAwarded: 10,
      createdBy: "parent",
    });

    expect(task.id).toBeDefined();
    expect(task.title).toBe("Zimmer aufräumen");
    expect(task.starsAwarded).toBe(10);
    expect(task.done).toBe(false);
  });

  it("sollte eine Aufgabe als erledigt markieren können", async () => {
    const child = await addChild({
      name: "Emma",
      avatar: "👧",
      grade: 3,
      totalStars: 100,
      theme: "default",
    });

    const task = await addTask({
      childId: child.id,
      title: "Hausaufgaben",
      done: false,
      starsAwarded: 5,
      createdBy: "parent",
    });

    const updated = await updateTask(task.id, {
      done: true,
      completedAt: new Date(),
    });

    expect(updated?.done).toBe(true);
    expect(updated?.completedAt).toBeDefined();
  });

  it("sollte eine Aufgabe löschen können", async () => {
    const child = await addChild({
      name: "Emma",
      avatar: "👧",
      grade: 3,
      totalStars: 100,
      theme: "default",
    });

    const task = await addTask({
      childId: child.id,
      title: "Test Aufgabe",
      done: false,
      starsAwarded: 5,
      createdBy: "parent",
    });

    const deleted = await deleteTask(task.id);
    expect(deleted).toBe(true);

    const tasks = await loadTasks();
    expect(tasks).toHaveLength(0);
  });

  it("sollte Aufgaben für heute filtern können", async () => {
    const child = await addChild({
      name: "Emma",
      avatar: "👧",
      grade: 3,
      totalStars: 100,
      theme: "default",
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await addTask({
      childId: child.id,
      title: "Heute",
      done: false,
      starsAwarded: 5,
      dueDate: today,
      createdBy: "parent",
    });

    await addTask({
      childId: child.id,
      title: "Morgen",
      done: false,
      starsAwarded: 5,
      dueDate: tomorrow,
      createdBy: "parent",
    });

    const todayTasks = await getTodayTasks();
    expect(todayTasks).toHaveLength(1);
    expect(todayTasks[0].title).toBe("Heute");
  });
});

describe("Statistiken", () => {
  it("sollte Kind-Statistiken berechnen können", async () => {
    const child = await addChild({
      name: "Emma",
      avatar: "👧",
      grade: 3,
      totalStars: 150,
      theme: "default",
    });

    // Wartender Wunsch
    await addWish({
      childId: child.id,
      title: "Wunsch",
      starPrice: 100,
      status: "pending",
    });

    // Aufgaben für heute
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await addTask({
      childId: child.id,
      title: "Aufgabe 1",
      done: true,
      starsAwarded: 5,
      dueDate: today,
      createdBy: "parent",
    });

    await addTask({
      childId: child.id,
      title: "Aufgabe 2",
      done: false,
      starsAwarded: 5,
      dueDate: today,
      createdBy: "parent",
    });

    const stats = await getChildStats(child.id);
    expect(stats).toBeDefined();
    expect(stats?.totalStars).toBe(150);
    expect(stats?.pendingWishes).toBe(1);
    expect(stats?.tasksToday).toBe(2);
    expect(stats?.completedTasksToday).toBe(1);
  });
});

describe("Daten löschen", () => {
  it("sollte alle Daten löschen können", async () => {
    // Daten hinzufügen
    const child = await addChild({
      name: "Emma",
      avatar: "👧",
      grade: 3,
      totalStars: 100,
      theme: "default",
    });

    await addWish({
      childId: child.id,
      title: "Wunsch",
      starPrice: 100,
      status: "pending",
    });

    await addTask({
      childId: child.id,
      title: "Aufgabe",
      done: false,
      starsAwarded: 5,
      createdBy: "parent",
    });

    // Alle Daten löschen
    await clearAllData();

    // Prüfen ob alles gelöscht wurde
    const children = await loadChildren();
    const wishes = await loadWishes();
    const tasks = await loadTasks();

    expect(children).toHaveLength(0);
    expect(wishes).toHaveLength(0);
    expect(tasks).toHaveLength(0);
  });
});
