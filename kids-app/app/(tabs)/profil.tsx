import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { loadChildProfile, saveChildProfile, getTotalStars, loadTasks } from "@/lib/storage";
import type { ChildProfile } from "@/types/models";

/**
 * Profil Screen - Einstellungen und Statistiken
 */
export default function ProfilScreen() {
  const colors = useColors();
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [totalStars, setTotalStars] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    let loadedProfile = await loadChildProfile();
    
    // Erstelle Default-Profil wenn keins existiert
    if (!loadedProfile) {
      loadedProfile = {
        id: "default",
        name: "Max",
        avatar: "👦",
        grade: 3,
        theme: "standard",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await saveChildProfile(loadedProfile);
    }
    
    setProfile(loadedProfile);
    
    // Lade Statistiken
    const stars = await getTotalStars();
    setTotalStars(stars);
    
    const tasks = await loadTasks();
    const completed = tasks.filter(t => t.done).length;
    setCompletedTasks(completed);
  };

  const changeAvatar = () => {
    const avatars = ["👦", "👧", "🧒", "👶", "🐰", "🐶", "🐱", "🦊", "🐻", "🐼"];
    const currentIndex = avatars.indexOf(profile?.avatar || "👦");
    const nextIndex = (currentIndex + 1) % avatars.length;
    const newAvatar = avatars[nextIndex];
    
    if (profile) {
      const updated = { ...profile, avatar: newAvatar, updatedAt: new Date() };
      saveChildProfile(updated);
      setProfile(updated);
    }
  };

  const menuItems = [
    { id: "theme", icon: "paintbrush.fill", title: "Theme ändern", subtitle: "Standard" },
    { id: "background", icon: "photo.fill", title: "Hintergrund", subtitle: "Wähle ein Bild" },
    { id: "notifications", icon: "bell.fill", title: "Erinnerungen", subtitle: "Ein" },
    { id: "stats", icon: "trophy.fill", title: "Meine Statistik", subtitle: `${completedTasks} Aufgaben` },
    { id: "help", icon: "lightbulb.fill", title: "Hilfe", subtitle: "Fragen & Tipps" },
  ];

  if (!profile) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-muted">Lade Profil...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Header */}
        <Text className="text-3xl font-bold text-foreground mb-8">Profil</Text>

        {/* Profil-Karte */}
        <View
          className="items-center p-8 rounded-3xl mb-8"
          style={{
            backgroundColor: colors.primary + "20",
            borderWidth: 2,
            borderColor: colors.primary + "40",
          }}
        >
          {/* Avatar (tippbar) */}
          <TouchableOpacity onPress={changeAvatar} activeOpacity={0.8}>
            <View
              className="w-32 h-32 rounded-full items-center justify-center mb-4"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 4,
                borderColor: colors.primary,
              }}
            >
              <Text className="text-7xl">{profile.avatar}</Text>
            </View>
          </TouchableOpacity>

          {/* Name */}
          <Text className="text-3xl font-bold text-foreground mb-2">{profile.name}</Text>
          <Text className="text-lg text-muted mb-6">Klasse {profile.grade}</Text>

          {/* Statistiken */}
          <View className="flex-row gap-6">
            <View className="items-center">
              <View className="flex-row items-center gap-1 mb-1">
                <IconSymbol name="star.fill" size={20} color={colors.star} />
                <Text className="text-2xl font-bold" style={{ color: colors.star }}>
                  {totalStars}
                </Text>
              </View>
              <Text className="text-xs text-muted">Sterne</Text>
            </View>

            <View className="items-center">
              <View className="flex-row items-center gap-1 mb-1">
                <IconSymbol name="checkmark.square.fill" size={20} color={colors.success} />
                <Text className="text-2xl font-bold" style={{ color: colors.success }}>
                  {completedTasks}
                </Text>
              </View>
              <Text className="text-xs text-muted">Aufgaben</Text>
            </View>
          </View>
        </View>

        {/* Menü-Items */}
        <View className="gap-3">
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => Alert.alert(item.title, "Diese Funktion kommt bald!")}
              className="flex-row items-center p-4 rounded-2xl"
              style={{ backgroundColor: colors.surface }}
              activeOpacity={0.7}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: colors.primary + "20" }}
              >
                <IconSymbol name={item.icon as any} size={24} color={colors.primary} />
              </View>

              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">{item.title}</Text>
                <Text className="text-sm text-muted mt-1">{item.subtitle}</Text>
              </View>

              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Tipp */}
        <View
          className="mt-8 p-4 rounded-2xl"
          style={{
            backgroundColor: colors.secondary + "20",
            borderWidth: 1,
            borderColor: colors.secondary + "40",
          }}
        >
          <Text className="text-sm text-center text-foreground">
            💡 <Text className="font-bold">Tipp:</Text> Tippe auf deinen Avatar um ihn zu ändern!
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
