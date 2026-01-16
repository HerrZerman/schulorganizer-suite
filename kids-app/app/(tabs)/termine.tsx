import { View, Text, TouchableOpacity, FlatList, Alert, TextInput, Modal, Image } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import type { Event, EventCategory } from "@/types/models";
import { loadEvents, addEvent, updateEvent } from "@/lib/storage";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";

/**
 * Termine Screen - Kalender und Events mit Foto-Upload
 */
export default function TermineScreen() {
  const colors = useColors();
  const [events, setEvents] = useState<Event[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventCategory, setNewEventCategory] = useState<EventCategory>("schule");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    loadEventsData();
  }, []);

  const loadEventsData = async () => {
    const loaded = await loadEvents();
    setEvents(loaded);
  };

  const handleAddEvent = async () => {
    if (!newEventTitle.trim()) {
      Alert.alert("Fehler", "Bitte gib einen Titel ein!");
      return;
    }

    const newEvent: Event = {
      id: Date.now().toString(),
      childId: "default",
      title: newEventTitle,
      date: new Date(),
      category: newEventCategory,
      reminder: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await addEvent(newEvent);
    await loadEventsData();
    setNewEventTitle("");
    setShowAddModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const pickImageForEvent = async (event: Event) => {
    Alert.alert(
      "Event-Foto hinzufügen",
      "Halte dein Erlebnis fest!",
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
              await updateEvent(event.id, { photoUri: result.assets[0].uri });
              await loadEventsData();
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
              await updateEvent(event.id, { photoUri: result.assets[0].uri });
              await loadEventsData();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert("✅ Foto hinzugefügt!", "Deine Eltern können es jetzt sehen!");
            }
          },
        },
        { text: "Abbrechen", style: "cancel" },
      ]
    );
  };

  const categories: Array<{ id: EventCategory; name: string; icon: string; color: string }> = [
    { id: "schule", name: "Schule", icon: "book.fill", color: colors.primary },
    { id: "sport", name: "Sport", icon: "sportscourt.fill", color: colors.sports },
    { id: "freizeit", name: "Freizeit", icon: "star.fill", color: colors.secondary },
    { id: "arzt", name: "Arzt", icon: "heart.fill", color: colors.error },
  ];

  const todayEvents = events.filter(
    e => new Date(e.date).toDateString() === new Date().toDateString()
  );

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-3xl font-bold text-foreground">Termine</Text>
            <Text className="text-sm text-muted mt-1">
              {todayEvents.length} {todayEvents.length === 1 ? "Termin" : "Termine"} heute
            </Text>
          </View>
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <IconSymbol name="plus.circle.fill" size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Kalender-Karte (vereinfacht) */}
        <View
          className="p-6 rounded-3xl"
          style={{
            backgroundColor: colors.primary + "20",
            borderWidth: 2,
            borderColor: colors.primary + "40",
          }}
        >
          <Text className="text-center text-4xl font-bold text-foreground mb-2">
            {new Date().getDate()}
          </Text>
          <Text className="text-center text-lg text-muted">
            {new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
          </Text>
        </View>
      </View>

      {/* Termine-Liste */}
      {events.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-6xl mb-4">📅</Text>
          <Text className="text-xl font-bold text-foreground mb-2">Keine Termine</Text>
          <Text className="text-muted text-center">
            Tippe auf das + um einen neuen Termin hinzuzufügen!
          </Text>
        </View>
      ) : (
        <View className="flex-1 px-6">
          <Text className="text-lg font-bold text-foreground mb-4">
            Heute - {new Date().toLocaleDateString("de-DE")}
          </Text>
          
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => {
              const category = categories.find(c => c.id === item.category);
              return (
                <View
                  className="p-4 rounded-2xl"
                  style={{ backgroundColor: colors.surface }}
                >
                  <View className="flex-row items-start mb-3">
                    {/* Icon */}
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: category?.color + "20" }}
                    >
                      <IconSymbol
                        name={category?.icon as any || "calendar"}
                        size={24}
                        color={category?.color || colors.primary}
                      />
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                      <Text className="text-base font-bold text-foreground mb-1">
                        {item.title}
                      </Text>
                      <View className="flex-row items-center flex-wrap gap-2">
                        {item.time && (
                          <Text className="text-sm text-muted">{item.time}</Text>
                        )}
                        <View
                          className="px-2 py-1 rounded-full"
                          style={{ backgroundColor: category?.color + "20" }}
                        >
                          <Text className="text-xs font-semibold" style={{ color: category?.color }}>
                            {category?.name}
                          </Text>
                        </View>
                        {item.photoUri && (
                          <View
                            className="flex-row items-center gap-1 px-2 py-1 rounded-full"
                            style={{ backgroundColor: colors.success + "20" }}
                          >
                            <IconSymbol name="camera.fill" size={12} color={colors.success} />
                            <Text className="text-xs font-semibold" style={{ color: colors.success }}>
                              Foto
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Erinnerung */}
                    {item.reminder && (
                      <IconSymbol name="bell.fill" size={20} color={colors.secondary} />
                    )}
                  </View>

                  {/* Event-Foto anzeigen */}
                  {item.photoUri && (
                    <TouchableOpacity
                      onPress={() => setSelectedEvent(item)}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{ uri: item.photoUri }}
                        className="w-full h-48 rounded-xl mb-3"
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )}

                  {/* Foto hinzufügen Button */}
                  {!item.photoUri && (
                    <TouchableOpacity
                      onPress={() => pickImageForEvent(item)}
                      className="flex-row items-center justify-center gap-2 py-3 rounded-xl mt-2"
                      style={{
                        backgroundColor: colors.primary + "10",
                        borderWidth: 1,
                        borderColor: colors.primary + "30",
                        borderStyle: "dashed",
                      }}
                    >
                      <IconSymbol name="camera.fill" size={20} color={colors.primary} />
                      <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                        Event-Foto hinzufügen
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />
        </View>
      )}

      {/* Add Event Modal */}
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
              <Text className="text-2xl font-bold text-foreground">Neuer Termin</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <IconSymbol name="xmark" size={24} color={colors.muted} />
              </TouchableOpacity>
            </View>

            {/* Titel */}
            <Text className="text-sm font-semibold text-foreground mb-2">Was steht an?</Text>
            <TextInput
              value={newEventTitle}
              onChangeText={setNewEventTitle}
              placeholder="z.B. Mathetest, Fußballtraining"
              className="p-4 rounded-2xl text-base mb-6"
              style={{
                backgroundColor: colors.surface,
                color: colors.foreground,
              }}
              placeholderTextColor={colors.muted}
            />

            {/* Kategorie */}
            <Text className="text-sm font-semibold text-foreground mb-3">Kategorie</Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setNewEventCategory(category.id)}
                  className="px-4 py-3 rounded-2xl flex-row items-center gap-2"
                  style={{
                    backgroundColor: newEventCategory === category.id
                      ? category.color
                      : colors.surface,
                  }}
                >
                  <IconSymbol
                    name={category.icon as any}
                    size={18}
                    color={newEventCategory === category.id ? "#FFFFFF" : category.color}
                  />
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: newEventCategory === category.id ? "#FFFFFF" : colors.foreground,
                    }}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Buttons */}
            <TouchableOpacity
              onPress={handleAddEvent}
              className="py-4 rounded-2xl items-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-base font-bold text-white">Termin hinzufügen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Foto-Detail Modal */}
      <Modal
        visible={selectedEvent !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedEvent(null)}
      >
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: "rgba(0,0,0,0.9)" }}>
          <TouchableOpacity
            onPress={() => setSelectedEvent(null)}
            className="absolute top-12 right-6 z-10"
          >
            <View
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <IconSymbol name="xmark" size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {selectedEvent?.photoUri && (
            <View className="w-full px-6">
              <Image
                source={{ uri: selectedEvent.photoUri }}
                className="w-full aspect-[3/4] rounded-3xl"
                resizeMode="contain"
              />
              <Text className="text-white text-center text-lg font-bold mt-6">
                {selectedEvent.title}
              </Text>
              <Text className="text-white/70 text-center text-sm mt-2">
                Event-Foto · {new Date(selectedEvent.date).toLocaleDateString("de-DE")}
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </ScreenContainer>
  );
}
