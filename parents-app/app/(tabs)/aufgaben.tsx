/**
 * Aufgaben Screen
 * 
 * Eltern können hier Aufgaben für ihre Kinder erstellen.
 * 
 * Features:
 * - Aufgaben-Liste nach Datum gruppiert
 * - Filter nach Kind
 * - Neue Aufgabe erstellen (Modal)
 * - Aufgabe bearbeiten/löschen (Swipe-Actions später)
 */

import { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import type { Task, Child, SubjectType, TaskWithChild } from "@/types/models";
import { SUBJECTS } from "@/types/models";
import { loadTasks, loadChildren, addTask, updateTask, deleteTask } from "@/lib/storage";
import { useColors } from "@/hooks/use-colors";

export default function AufgabenScreen() {
  const colors = useColors();
  const [tasks, setTasks] = useState<TaskWithChild[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | "all">("all");
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Daten laden
  const loadData = async () => {
    try {
      const [tasksData, childrenData] = await Promise.all([loadTasks(), loadChildren()]);

      // Aufgaben mit Kind-Info kombinieren
      const tasksWithChild: TaskWithChild[] = tasksData
        .map((task) => {
          const child = childrenData.find((c) => c.id === task.childId);
          if (!child) return null;
          return { ...task, child };
        })
        .filter((t): t is TaskWithChild => t !== null)
        .sort((a, b) => {
          // Sortieren nach Fälligkeitsdatum
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });

      setTasks(tasksWithChild);
      setChildren(childrenData);
    } catch (error) {
      console.error("Fehler beim Laden der Aufgaben:", error);
    }
  };

  // Initial laden
  useEffect(() => {
    loadData();
  }, []);

  // Neu laden wenn Screen fokussiert wird
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // Pull-to-Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Aufgaben nach Filter gruppieren
  const getGroupedTasks = () => {
    // Nach Kind filtern
    const filtered =
      selectedChildId === "all"
        ? tasks
        : tasks.filter((t) => t.childId === selectedChildId);

    // Nach Datum gruppieren
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const groups: { title: string; tasks: TaskWithChild[] }[] = [];

    // Heute
    const todayTasks = filtered.filter((t) => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    });
    if (todayTasks.length > 0) {
      groups.push({
        title: `Heute - ${formatDate(today)}`,
        tasks: todayTasks,
      });
    }

    // Morgen
    const tomorrowTasks = filtered.filter((t) => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === tomorrow.getTime();
    });
    if (tomorrowTasks.length > 0) {
      groups.push({
        title: `Morgen - ${formatDate(tomorrow)}`,
        tasks: tomorrowTasks,
      });
    }

    // Später
    const laterTasks = filtered.filter((t) => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() > tomorrow.getTime();
    });
    if (laterTasks.length > 0) {
      groups.push({
        title: "Später",
        tasks: laterTasks,
      });
    }

    // Ohne Datum
    const noDateTasks = filtered.filter((t) => !t.dueDate);
    if (noDateTasks.length > 0) {
      groups.push({
        title: "Ohne Datum",
        tasks: noDateTasks,
      });
    }

    return groups;
  };

  // Datum formatieren
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Aufgabe Toggle (erledigt/nicht erledigt)
  const handleToggleTask = async (task: TaskWithChild) => {
    try {
      await updateTask(task.id, {
        done: !task.done,
        completedAt: !task.done ? new Date() : undefined,
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await loadData();
    } catch (error) {
      console.error("Fehler beim Aktualisieren:", error);
    }
  };

  // Aufgabe löschen
  const handleDeleteTask = (task: TaskWithChild) => {
    Alert.alert("Aufgabe löschen", `"${task.title}" wirklich löschen?`, [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Löschen",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTask(task.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await loadData();
          } catch (error) {
            console.error("Fehler beim Löschen:", error);
          }
        },
      },
    ]);
  };

  const groupedTasks = getGroupedTasks();

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b" style={{ borderBottomColor: colors.border }}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold" style={{ color: colors.foreground }}>
              Aufgaben
            </Text>
            <Text className="text-sm mt-1" style={{ color: colors.muted }}>
              Aufgaben für Kinder erstellen
            </Text>
          </View>

          <TouchableOpacity
            className="rounded-full w-12 h-12 items-center justify-center"
            style={{ backgroundColor: colors.primary }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowAddModal(true);
            }}
          >
            <Text className="text-2xl text-white">+</Text>
          </TouchableOpacity>
        </View>

        {/* Filter nach Kind */}
        {children.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 -mx-2">
            <View className="flex-row gap-2 px-2">
              <TouchableOpacity
                className="rounded-full px-4 py-2"
                style={{
                  backgroundColor: selectedChildId === "all" ? colors.primary : colors.surface,
                  borderWidth: 1,
                  borderColor: selectedChildId === "all" ? colors.primary : colors.border,
                }}
                onPress={() => {
                  setSelectedChildId("all");
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{
                    color: selectedChildId === "all" ? "#FFFFFF" : colors.foreground,
                  }}
                >
                  Alle Kinder
                </Text>
              </TouchableOpacity>

              {children.map((child) => (
                <TouchableOpacity
                  key={child.id}
                  className="rounded-full px-4 py-2 flex-row items-center gap-2"
                  style={{
                    backgroundColor: selectedChildId === child.id ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor: selectedChildId === child.id ? colors.primary : colors.border,
                  }}
                  onPress={() => {
                    setSelectedChildId(child.id);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text className="text-base">{child.avatar}</Text>
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: selectedChildId === child.id ? "#FFFFFF" : colors.foreground,
                    }}
                  >
                    {child.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="p-6 gap-6">
          {groupedTasks.length === 0 ? (
            <View
              className="rounded-2xl p-6 items-center"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-base text-center" style={{ color: colors.muted }}>
                Noch keine Aufgaben.{"\n"}Tippe auf "+" um eine Aufgabe zu erstellen.
              </Text>
            </View>
          ) : (
            groupedTasks.map((group, groupIndex) => (
              <View key={groupIndex}>
                <Text className="text-base font-semibold mb-3" style={{ color: colors.foreground }}>
                  {group.title}
                </Text>

                {group.tasks.map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    className="rounded-xl p-4 mb-2 flex-row items-center gap-3"
                    style={{
                      backgroundColor: colors.surface,
                      opacity: task.done ? 0.6 : 1,
                    }}
                    onPress={() => handleToggleTask(task)}
                    onLongPress={() => handleDeleteTask(task)}
                    activeOpacity={0.7}
                  >
                    {/* Checkbox */}
                    <View
                      className="w-6 h-6 rounded items-center justify-center"
                      style={{
                        backgroundColor: task.done ? colors.success : "transparent",
                        borderWidth: 2,
                        borderColor: task.done ? colors.success : colors.border,
                      }}
                    >
                      {task.done && <Text className="text-white text-xs">✓</Text>}
                    </View>

                    {/* Aufgaben-Info */}
                    <View className="flex-1">
                      <Text
                        className="text-base"
                        style={{
                          color: colors.foreground,
                          textDecorationLine: task.done ? "line-through" : "none",
                        }}
                      >
                        {task.title}
                      </Text>

                      <View className="flex-row items-center gap-2 mt-1">
                        {/* Kind */}
                        <View className="flex-row items-center gap-1">
                          <Text className="text-sm">{task.child.avatar}</Text>
                          <Text className="text-xs" style={{ color: colors.muted }}>
                            {task.child.name}
                          </Text>
                        </View>

                        {/* Fach */}
                        {task.subject && (
                          <View className="flex-row items-center gap-1">
                            <Text className="text-sm">{SUBJECTS[task.subject].icon}</Text>
                            <Text className="text-xs" style={{ color: colors.muted }}>
                              {SUBJECTS[task.subject].label}
                            </Text>
                          </View>
                        )}

                        {/* Sterne */}
                        <Text className="text-xs" style={{ color: colors.muted }}>
                          +{task.starsAwarded} ⭐
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Aufgabe erstellen Modal */}
      <AddTaskModal
        visible={showAddModal}
        children={children}
        onClose={() => setShowAddModal(false)}
        onAdd={async () => {
          await loadData();
          setShowAddModal(false);
        }}
      />
    </ScreenContainer>
  );
}

// ============================================
// AUFGABE ERSTELLEN MODAL
// ============================================

interface AddTaskModalProps {
  visible: boolean;
  children: Child[];
  onClose: () => void;
  onAdd: () => void;
}

function AddTaskModal({ visible, children, onClose, onAdd }: AddTaskModalProps) {
  const colors = useColors();
  const [childId, setChildId] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<SubjectType | undefined>(undefined);
  const [dueDate, setDueDate] = useState<"today" | "tomorrow" | "later" | undefined>("today");
  const [starsAwarded, setStarsAwarded] = useState(5);

  useEffect(() => {
    if (visible && children.length > 0 && !childId) {
      setChildId(children[0].id);
    }
  }, [visible, children]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Fehler", "Bitte gib einen Titel ein.");
      return;
    }

    if (!childId) {
      Alert.alert("Fehler", "Bitte wähle ein Kind aus.");
      return;
    }

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let dueDateValue: Date | undefined;
      if (dueDate === "today") {
        dueDateValue = today;
      } else if (dueDate === "tomorrow") {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dueDateValue = tomorrow;
      }

      await addTask({
        childId,
        title: title.trim(),
        subject,
        done: false,
        starsAwarded,
        dueDate: dueDateValue,
        createdBy: "parent",
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTitle("");
      setSubject(undefined);
      setDueDate("today");
      setStarsAwarded(5);
      onAdd();
    } catch (error) {
      console.error("Fehler beim Erstellen:", error);
      Alert.alert("Fehler", "Aufgabe konnte nicht erstellt werden.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View
          className="rounded-t-3xl p-6"
          style={{
            backgroundColor: colors.background,
            minHeight: 500,
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold" style={{ color: colors.foreground }}>
              Neue Aufgabe
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-base" style={{ color: colors.muted }}>
                Abbrechen
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Kind auswählen */}
            <View className="mb-4">
              <Text className="text-sm font-semibold mb-2" style={{ color: colors.foreground }}>
                Für welches Kind?
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {children.map((child) => (
                  <TouchableOpacity
                    key={child.id}
                    className="rounded-xl px-4 py-3 flex-row items-center gap-2"
                    style={{
                      backgroundColor: childId === child.id ? colors.primary : colors.surface,
                      borderWidth: 1,
                      borderColor: childId === child.id ? colors.primary : colors.border,
                    }}
                    onPress={() => {
                      setChildId(child.id);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text className="text-xl">{child.avatar}</Text>
                    <Text
                      className="text-base font-semibold"
                      style={{
                        color: childId === child.id ? "#FFFFFF" : colors.foreground,
                      }}
                    >
                      {child.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Aufgabe */}
            <View className="mb-4">
              <Text className="text-sm font-semibold mb-2" style={{ color: colors.foreground }}>
                Aufgabe
              </Text>
              <TextInput
                className="rounded-xl p-4 text-base"
                style={{
                  backgroundColor: colors.surface,
                  color: colors.foreground,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                placeholder="Z.B. 'Zimmer aufräumen'"
                placeholderTextColor={colors.muted}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Fällig am */}
            <View className="mb-4">
              <Text className="text-sm font-semibold mb-2" style={{ color: colors.foreground }}>
                Fällig am
              </Text>
              <View className="flex-row gap-2">
                {[
                  { value: "today", label: "Heute" },
                  { value: "tomorrow", label: "Morgen" },
                  { value: undefined, label: "Ohne Datum" },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value ?? "none"}
                    className="flex-1 rounded-xl p-3 items-center"
                    style={{
                      backgroundColor: dueDate === option.value ? colors.primary : colors.surface,
                      borderWidth: 1,
                      borderColor: dueDate === option.value ? colors.primary : colors.border,
                    }}
                    onPress={() => {
                      setDueDate(option.value as any);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text
                      className="text-sm font-semibold"
                      style={{
                        color: dueDate === option.value ? "#FFFFFF" : colors.foreground,
                      }}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sterne-Belohnung */}
            <View className="mb-6">
              <Text className="text-sm font-semibold mb-2" style={{ color: colors.foreground }}>
                Sterne-Belohnung
              </Text>
              <View className="flex-row items-center justify-center gap-4">
                <TouchableOpacity
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.surface }}
                  onPress={() => {
                    if (starsAwarded > 1) {
                      setStarsAwarded(starsAwarded - 1);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}
                >
                  <Text className="text-2xl" style={{ color: colors.foreground }}>
                    -
                  </Text>
                </TouchableOpacity>

                <Text className="text-3xl font-bold" style={{ color: colors.foreground }}>
                  {starsAwarded} ⭐
                </Text>

                <TouchableOpacity
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.surface }}
                  onPress={() => {
                    if (starsAwarded < 20) {
                      setStarsAwarded(starsAwarded + 1);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}
                >
                  <Text className="text-2xl" style={{ color: colors.foreground }}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Submit Button */}
          <TouchableOpacity
            className="rounded-full p-4 items-center"
            style={{ backgroundColor: colors.primary }}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text className="text-base font-semibold text-white">Aufgabe erstellen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
