import { View, Text, TouchableOpacity, FlatList, Alert, TextInput, Modal, Image } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import type { Task, SubjectType } from "@/types/models";
import { loadTasks, addTask, toggleTaskDone, updateTask } from "@/lib/storage";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";

/**
 * Aufgaben Screen - To-Do Liste mit Checkboxen und Foto-Upload
 */
export default function AufgabenScreen() {
  const colors = useColors();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskSubject, setNewTaskSubject] = useState<SubjectType>("mathe");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasksData();
  }, []);

  const loadTasksData = async () => {
    const loaded = await loadTasks();
    setTasks(loaded);
  };

  const handleToggleTask = async (task: Task) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const starsEarned = await toggleTaskDone(task.id);
    await loadTasksData();
    
    if (starsEarned > 0) {
      Alert.alert("🌟 Super!", `Du hast ${starsEarned} Sterne verdient!`);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert("Fehler", "Bitte gib einen Titel ein!");
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      childId: "default",
      title: newTaskTitle,
      subject: newTaskSubject,
      done: false,
      starsAwarded: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await addTask(newTask);
    await loadTasksData();
    setNewTaskTitle("");
    setShowAddModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const pickImageForTask = async (task: Task) => {
    Alert.alert(
      "Beweis-Foto hinzufügen",
      "Zeige deinen Eltern, dass du die Aufgabe erledigt hast!",
      [
        {
          text: "📷 Kamera",
          onPress: async () => {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
              Alert.alert("Keine Berechtigung", "Bitte erlaube den Zugriff auf die Kamera.");
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: "images",
              allowsEditing: true,
              quality: 0.8,
            });
            if (!result.canceled && result.assets[0]) {
              await updateTask(task.id, { photoUri: result.assets[0].uri });
              await loadTasksData();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert("✅ Foto hinzugefügt!", "Deine Eltern können es jetzt sehen!");
            }
          },
        },
        {
          text: "🖼️ Galerie",
          onPress: async () => {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
              Alert.alert("Keine Berechtigung", "Bitte erlaube den Zugriff auf deine Fotos.");
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: "images",
              allowsEditing: true,
              quality: 0.8,
            });
            if (!result.canceled && result.assets[0]) {
              await updateTask(task.id, { photoUri: result.assets[0].uri });
              await loadTasksData();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert("✅ Foto hinzugefügt!", "Deine Eltern können es jetzt sehen!");
            }
          },
        },
        { text: "Abbrechen", style: "cancel" },
      ]
    );
  };

  const subjects: Array<{ id: SubjectType; name: string; icon: string; color: string }> = [
    { id: "mathe", name: "Mathe", icon: "function", color: colors.math },
    { id: "deutsch", name: "Deutsch", icon: "textformat", color: colors.german },
    { id: "sachkunde", name: "HSU", icon: "globe", color: colors.science },
    { id: "kunst", name: "Kunst", icon: "paintbrush.fill", color: colors.art },
  ];

  const todayTasks = tasks.filter(t => !t.dueDate || new Date(t.dueDate).toDateString() === new Date().toDateString());
  const completedCount = todayTasks.filter(t => t.done).length;

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-3xl font-bold text-foreground">Aufgaben</Text>
            <Text className="text-sm text-muted mt-1">
              {completedCount} von {todayTasks.length} erledigt
            </Text>
          </View>
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <IconSymbol name="plus.circle.fill" size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Fortschrittsbalken */}
        {todayTasks.length > 0 && (
          <View className="h-2 bg-surface rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${(completedCount / todayTasks.length) * 100}%`,
                backgroundColor: colors.success,
              }}
            />
          </View>
        )}
      </View>

      {/* Aufgaben-Liste */}
      {tasks.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-6xl mb-4">✅</Text>
          <Text className="text-xl font-bold text-foreground mb-2">Keine Aufgaben</Text>
          <Text className="text-muted text-center">
            Tippe auf das + um eine neue Aufgabe hinzuzufügen!
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 24, gap: 12 }}
          renderItem={({ item }) => {
            const subject = subjects.find(s => s.id === item.subject);
            return (
              <View
                className="p-4 rounded-2xl"
                style={{ backgroundColor: colors.surface }}
              >
                <View className="flex-row items-start">
                  {/* Checkbox */}
                  <TouchableOpacity
                    onPress={() => handleToggleTask(item)}
                    activeOpacity={0.7}
                  >
                    <View
                      className="w-8 h-8 rounded-full items-center justify-center mr-4"
                      style={{
                        backgroundColor: item.done ? colors.success : "transparent",
                        borderWidth: 2,
                        borderColor: item.done ? colors.success : colors.border,
                      }}
                    >
                      {item.done && (
                        <IconSymbol name="checkmark" size={18} color="#FFFFFF" />
                      )}
                    </View>
                  </TouchableOpacity>

                  {/* Content */}
                  <View className="flex-1">
                    <Text
                      className="text-base font-semibold mb-2"
                      style={{
                        color: item.done ? colors.muted : colors.foreground,
                        textDecorationLine: item.done ? "line-through" : "none",
                      }}
                    >
                      {item.title}
                    </Text>
                    
                    {/* Tags */}
                    <View className="flex-row items-center flex-wrap gap-2 mb-3">
                      {subject && (
                        <View
                          className="flex-row items-center gap-1 px-2 py-1 rounded-full"
                          style={{ backgroundColor: subject.color + "20" }}
                        >
                          <IconSymbol name={subject.icon as any} size={14} color={subject.color} />
                          <Text className="text-xs font-semibold" style={{ color: subject.color }}>
                            {subject.name}
                          </Text>
                        </View>
                      )}
                      
                      <View className="flex-row items-center gap-1">
                        <IconSymbol name="star.fill" size={14} color={colors.star} />
                        <Text className="text-xs font-bold" style={{ color: colors.star }}>
                          +{item.starsAwarded}
                        </Text>
                      </View>

                      {item.photoUri && (
                        <View
                          className="flex-row items-center gap-1 px-2 py-1 rounded-full"
                          style={{ backgroundColor: colors.success + "20" }}
                        >
                          <IconSymbol name="camera.fill" size={14} color={colors.success} />
                          <Text className="text-xs font-semibold" style={{ color: colors.success }}>
                            Beweis
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Beweis-Foto anzeigen */}
                    {item.photoUri && (
                      <TouchableOpacity
                        onPress={() => setSelectedTask(item)}
                        activeOpacity={0.8}
                      >
                        <Image
                          source={{ uri: item.photoUri }}
                          className="w-full h-40 rounded-xl mb-3"
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    )}

                    {/* Foto hinzufügen Button */}
                    {!item.photoUri && (
                      <TouchableOpacity
                        onPress={() => pickImageForTask(item)}
                        className="flex-row items-center justify-center gap-2 py-3 rounded-xl"
                        style={{
                          backgroundColor: colors.primary + "10",
                          borderWidth: 1,
                          borderColor: colors.primary + "30",
                          borderStyle: "dashed",
                        }}
                      >
                        <IconSymbol name="camera.fill" size={20} color={colors.primary} />
                        <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                          Beweis-Foto hinzufügen
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Add Task Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View
            className="rounded-t-3xl p-6"
            style={{ backgroundColor: colors.background, minHeight: 400 }}
          >
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-2xl font-bold text-foreground">Neue Aufgabe</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <IconSymbol name="xmark" size={24} color={colors.muted} />
              </TouchableOpacity>
            </View>

            {/* Titel */}
            <Text className="text-sm font-semibold text-foreground mb-2">Titel</Text>
            <TextInput
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholder="z.B. Zimmer aufräumen, Hausaufgaben"
              className="p-4 rounded-2xl text-base mb-6"
              style={{
                backgroundColor: colors.surface,
                color: colors.foreground,
              }}
              placeholderTextColor={colors.muted}
            />

            {/* Fach */}
            <Text className="text-sm font-semibold text-foreground mb-3">Fach</Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject.id}
                  onPress={() => setNewTaskSubject(subject.id)}
                  className="px-4 py-3 rounded-2xl flex-row items-center gap-2"
                  style={{
                    backgroundColor: newTaskSubject === subject.id ? subject.color : colors.surface,
                  }}
                >
                  <IconSymbol
                    name={subject.icon as any}
                    size={18}
                    color={newTaskSubject === subject.id ? "#FFFFFF" : subject.color}
                  />
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: newTaskSubject === subject.id ? "#FFFFFF" : colors.foreground,
                    }}
                  >
                    {subject.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Buttons */}
            <TouchableOpacity
              onPress={handleAddTask}
              className="py-4 rounded-2xl items-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-base font-bold text-white">Aufgabe hinzufügen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Foto-Detail Modal */}
      <Modal
        visible={selectedTask !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedTask(null)}
      >
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: "rgba(0,0,0,0.9)" }}>
          <TouchableOpacity
            onPress={() => setSelectedTask(null)}
            className="absolute top-12 right-6 z-10"
          >
            <View
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <IconSymbol name="xmark" size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {selectedTask?.photoUri && (
            <View className="w-full px-6">
              <Image
                source={{ uri: selectedTask.photoUri }}
                className="w-full aspect-[3/4] rounded-3xl"
                resizeMode="contain"
              />
              <Text className="text-white text-center text-lg font-bold mt-6">
                {selectedTask.title}
              </Text>
              <Text className="text-white/70 text-center text-sm mt-2">
                Beweis-Foto für die Eltern
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </ScreenContainer>
  );
}
