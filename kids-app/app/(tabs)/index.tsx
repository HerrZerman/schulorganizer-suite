import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Home Screen - Dashboard für Kinder
 * 
 * Zeigt:
 * - Header mit Avatar, Name und Sterne-Counter
 * - 4 große Kacheln für Hauptfunktionen
 * - Navigation zu den jeweiligen Screens
 */
export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const [stars, setStars] = useState(0);
  const [childName, setChildName] = useState("Max");

  // Lade Sterne und Name beim Start
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedStars = await AsyncStorage.getItem("stars");
      const savedName = await AsyncStorage.getItem("childName");
      
      if (savedStars) setStars(parseInt(savedStars, 10));
      if (savedName) setChildName(savedName);
    } catch (error) {
      console.error("Fehler beim Laden der Daten:", error);
    }
  };

  // Kachel-Daten
  const tiles = [
    {
      id: "hefte",
      title: "Hefte",
      icon: "book.fill" as const,
      color: colors.math,
      route: "/(tabs)/hefte" as const,
    },
    {
      id: "aufgaben",
      title: "Aufgaben",
      icon: "checkmark.square.fill" as const,
      color: colors.accent,
      route: "/(tabs)/aufgaben" as const,
    },
    {
      id: "termine",
      title: "Termine",
      icon: "calendar" as const,
      color: colors.secondary,
      route: "/(tabs)/termine" as const,
    },
    {
      id: "shop",
      title: "Sterne Shop",
      icon: "star.fill" as const,
      color: colors.reward,
      route: "/shop" as const,
    },
  ];

  return (
    <ScreenContainer className="bg-gradient-to-b from-primary/10 to-background">
      <View className="flex-1 p-6">
        {/* Header mit Avatar und Sterne */}
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center gap-3">
            {/* Avatar */}
            <View className="w-16 h-16 rounded-full bg-primary items-center justify-center border-4 border-white shadow-lg">
              <Text className="text-3xl">👦</Text>
            </View>
            {/* Name */}
            <View>
              <Text className="text-2xl font-bold text-foreground">{childName}</Text>
              <Text className="text-sm text-muted">Klasse 3</Text>
            </View>
          </View>
          
          {/* Sterne-Counter */}
          <View className="bg-star/20 px-4 py-2 rounded-full border-2 border-star/40">
            <View className="flex-row items-center gap-1">
              <IconSymbol name="star.fill" size={20} color={colors.star} />
              <Text className="text-xl font-bold text-foreground">{stars}</Text>
            </View>
          </View>
        </View>

        {/* Begrüßung */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Hallo {childName}! 👋
          </Text>
          <Text className="text-base text-muted">
            Was möchtest du heute machen?
          </Text>
        </View>

        {/* 4 Kacheln (2x2 Grid) */}
        <View className="flex-1 gap-4">
          <View className="flex-row gap-4">
            {tiles.slice(0, 2).map((tile) => (
              <TouchableOpacity
                key={tile.id}
                className="flex-1 aspect-square rounded-3xl p-6 items-center justify-center shadow-md"
                style={{ backgroundColor: tile.color }}
                onPress={() => router.push(tile.route)}
                activeOpacity={0.8}
              >
                <View className="items-center gap-3">
                  <View className="w-20 h-20 bg-white/30 rounded-full items-center justify-center">
                    <IconSymbol name={tile.icon} size={40} color="#FFFFFF" />
                  </View>
                  <Text className="text-lg font-bold text-white text-center">
                    {tile.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex-row gap-4">
            {tiles.slice(2, 4).map((tile) => (
              <TouchableOpacity
                key={tile.id}
                className="flex-1 aspect-square rounded-3xl p-6 items-center justify-center shadow-md"
                style={{ backgroundColor: tile.color }}
                onPress={() => router.push(tile.route)}
                activeOpacity={0.8}
              >
                <View className="items-center gap-3">
                  <View className="w-20 h-20 bg-white/30 rounded-full items-center justify-center">
                    <IconSymbol name={tile.icon} size={40} color="#FFFFFF" />
                  </View>
                  <Text className="text-lg font-bold text-white text-center">
                    {tile.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Motivations-Text */}
        <View className="mt-6 bg-success/20 p-4 rounded-2xl border border-success/30">
          <Text className="text-sm text-center text-foreground">
            💪 Du hast heute schon <Text className="font-bold">3 Aufgaben</Text> erledigt!
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
