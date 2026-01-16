import { View, Text, TouchableOpacity, FlatList, Image, Alert } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import type { NoteEntry, SubjectType } from "@/types/models";
import { loadNoteEntries, addNoteEntry, updateNoteEntry, addStars } from "@/lib/storage";

/**
 * Hefte Screen - Fotografierte Hefte anzeigen und verwalten
 */
export default function HefteScreen() {
  const colors = useColors();
  const router = useRouter();
  const [entries, setEntries] = useState<NoteEntry[]>([]);
  const [filter, setFilter] = useState<SubjectType | "all">("all");

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const loaded = await loadNoteEntries();
    setEntries(loaded);
  };

  const pickImage = async (source: "camera" | "gallery") => {
    try {
      let result;
      
      if (source === "camera") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Keine Berechtigung", "Bitte erlaube den Zugriff auf die Kamera.");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: "images",
          allowsEditing: true,
          quality: 0.8,
        });
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Keine Berechtigung", "Bitte erlaube den Zugriff auf deine Fotos.");
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: "images",
          allowsEditing: true,
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const newEntry: NoteEntry = {
          id: Date.now().toString(),
          childId: "default",
          subject: "mathe",
          topic: "Neues Heft",
          date: new Date(),
          photoUri: result.assets[0].uri,
          understood: false,
          starsEarned: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await addNoteEntry(newEntry);
        await loadEntries();
      }
    } catch (error) {
      console.error("Fehler beim Foto-Upload:", error);
      Alert.alert("Fehler", "Foto konnte nicht geladen werden.");
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Foto hinzufügen",
      "Woher möchtest du das Foto nehmen?",
      [
        { text: "📷 Kamera", onPress: () => pickImage("camera") },
        { text: "🖼️ Galerie", onPress: () => pickImage("gallery") },
        { text: "Abbrechen", style: "cancel" },
      ]
    );
  };

  const toggleUnderstood = async (entry: NoteEntry) => {
    const newState = !entry.understood;
    const stars = newState ? 5 : -5;
    
    await updateNoteEntry(entry.id, { understood: newState, starsEarned: stars });
    await addStars(stars, `Heft verstanden: ${entry.topic}`, entry.id);
    await loadEntries();
  };

  const filteredEntries = filter === "all" 
    ? entries 
    : entries.filter(e => e.subject === filter);

  const subjects: Array<{ id: SubjectType | "all"; name: string; color: string }> = [
    { id: "all", name: "Alle", color: colors.muted },
    { id: "mathe", name: "Mathe", color: colors.math },
    { id: "deutsch", name: "Deutsch", color: colors.german },
    { id: "sachkunde", name: "HSU", color: colors.science },
  ];

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-3xl font-bold text-foreground">Meine Hefte</Text>
          <TouchableOpacity onPress={showImageOptions}>
            <IconSymbol name="plus.circle.fill" size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Filter-Chips */}
        <View className="flex-row gap-2">
          {subjects.map((subject) => (
            <TouchableOpacity
              key={subject.id}
              onPress={() => setFilter(subject.id)}
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: filter === subject.id ? subject.color : colors.surface,
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{
                  color: filter === subject.id ? "#FFFFFF" : colors.foreground,
                }}
              >
                {subject.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Hefte-Grid */}
      {filteredEntries.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-6xl mb-4">📚</Text>
          <Text className="text-xl font-bold text-foreground mb-2">Noch keine Hefte</Text>
          <Text className="text-muted text-center">
            Tippe auf das + um dein erstes Heft zu fotografieren!
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredEntries}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 16 }}
          columnWrapperStyle={{ gap: 16 }}
          renderItem={({ item }) => (
            <View className="flex-1 rounded-2xl overflow-hidden shadow-md" style={{ backgroundColor: colors.surface }}>
              {/* Foto */}
              <Image
                source={{ uri: item.photoUri }}
                className="w-full aspect-[3/4]"
                resizeMode="cover"
              />
              
              {/* Info */}
              <View className="p-3">
                {/* Fach-Tag */}
                <View
                  className="self-start px-3 py-1 rounded-full mb-2"
                  style={{
                    backgroundColor: subjects.find(s => s.id === item.subject)?.color || colors.primary,
                  }}
                >
                  <Text className="text-xs font-bold text-white">
                    {subjects.find(s => s.id === item.subject)?.name || "Mathe"}
                  </Text>
                </View>

                {/* Datum */}
                <Text className="text-xs text-muted mb-1">
                  {new Date(item.date).toLocaleDateString("de-DE")}
                </Text>

                {/* Thema */}
                <Text className="text-sm font-bold text-foreground mb-3" numberOfLines={2}>
                  {item.topic}
                </Text>

                {/* Verstanden-Button */}
                <TouchableOpacity
                  onPress={() => toggleUnderstood(item)}
                  className="py-2 rounded-full items-center"
                  style={{
                    backgroundColor: item.understood ? colors.success : colors.surface,
                    borderWidth: 2,
                    borderColor: colors.success,
                  }}
                >
                  <Text
                    className="text-sm font-bold"
                    style={{
                      color: item.understood ? "#FFFFFF" : colors.success,
                    }}
                  >
                    {item.understood ? "✓ Verstanden" : "Verstanden?"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </ScreenContainer>
  );
}
