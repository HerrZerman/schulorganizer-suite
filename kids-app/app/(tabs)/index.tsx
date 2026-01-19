import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";
import { getTotalStars, loadTasks } from "@/lib/storage";
import * as Haptics from "expo-haptics";

/**
 * Home Screen - Hauptbildschirm der Kinderapp
 * Zeigt Avatar, Sterne-Counter und 4 große Kacheln
 */
export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const [totalStars, setTotalStars] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const stars = await getTotalStars();
    setTotalStars(stars);
    
    const tasks = await loadTasks();
    const completedToday = tasks.filter(
      t => t.done && new Date(t.completedAt!).toDateString() === new Date().toDateString()
    ).length;
    setTasksCompleted(completedToday);
  };

  const tiles = [
    {
      title: "Hefte",
      icon: "book.fill" as const,
      color: colors.primary,
      route: "/hefte" as const,
      emoji: "📚",
    },
    {
      title: "Aufgaben",
      icon: "checkmark.square.fill" as const,
      color: colors.accent,
      route: "/aufgaben" as const,
      emoji: "✅",
    },
    {
      title: "Termine",
      icon: "calendar" as const,
      color: colors.secondary,
      route: "/termine" as const,
      emoji: "📅",
    },
    {
      title: "Sterne Shop",
      icon: "star.fill" as const,
      color: colors.star,
      route: "/shop" as const,
      emoji: "⭐",
    },
  ];

  const handleTilePress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header mit Avatar und Sternen */}
        <View className="px-6 pt-6 pb-8">
          {/* Avatar und Sterne-Counter */}
          <View className="flex-row items-center justify-between mb-8">
            {/* Avatar */}
            <View className="flex-row items-center gap-4">
              <View
                className="w-20 h-20 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary + "30" }}
              >
                <Text className="text-5xl">👦</Text>
              </View>
              <View>
                <Text className="text-2xl font-bold text-foreground">Max</Text>
                <Text className="text-sm text-muted">Klasse 3</Text>
              </View>
            </View>

            {/* Sterne-Counter */}
            <View
              className="px-6 py-4 rounded-3xl items-center"
              style={{
                backgroundColor: colors.star + "20",
                borderWidth: 3,
                borderColor: colors.star + "40",
              }}
            >
              <Text className="text-4xl font-black" style={{ color: colors.star }}>
                {totalStars}
              </Text>
              <Text className="text-xs font-semibold text-muted mt-1">⭐ Sterne</Text>
            </View>
          </View>

          {/* Begrüßung */}
          <Text className="text-4xl font-bold text-foreground mb-2">
            Hallo Max! 👋
          </Text>
          <Text className="text-lg text-muted">
            Was möchtest du heute machen?
          </Text>
        </View>

        {/* 4 große Kacheln (2x2 Grid) */}
        <View className="px-6">
          <View className="flex-row flex-wrap gap-4">
            {tiles.map((tile) => (
              <TouchableOpacity
                key={tile.title}
                onPress={() => handleTilePress(tile.route)}
                activeOpacity={0.8}
                className="rounded-3xl p-8 items-center justify-center"
                style={{
                  width: "47%",
                  aspectRatio: 1,
                  backgroundColor: tile.color + "30",
                  borderWidth: 3,
                  borderColor: tile.color + "50",
                  shadowColor: tile.color,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                {/* Emoji statt Icon für bessere Sichtbarkeit */}
                <Text className="text-6xl mb-4">{tile.emoji}</Text>
                
                <Text
                  className="text-xl font-bold text-center"
                  style={{ color: colors.foreground }}
                >
                  {tile.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Motivations-Box */}
        <View className="px-6 mt-8">
          <View
            className="p-6 rounded-3xl"
            style={{
              backgroundColor: colors.success + "20",
              borderWidth: 2,
              borderColor: colors.success + "40",
            }}
          >
            <View className="flex-row items-center gap-3 mb-2">
              <Text className="text-3xl">💪</Text>
              <Text className="text-lg font-bold text-foreground">
                Super gemacht!
              </Text>
            </View>
            <Text className="text-base text-muted leading-relaxed">
              Du hast heute schon <Text className="font-bold" style={{ color: colors.success }}>{tasksCompleted} Aufgaben</Text> erledigt!
              {tasksCompleted === 0 && " Los geht's! 🚀"}
              {tasksCompleted > 0 && tasksCompleted < 3 && " Weiter so! 🌟"}
              {tasksCompleted >= 3 && " Du bist ein Star! ⭐"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
