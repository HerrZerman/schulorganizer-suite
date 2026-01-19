/**
 * Tab Bar Layout für SternWerk Elternapp
 * 
 * 5 Haupt-Tabs:
 * - Dashboard (Home)
 * - Freigaben (Wunsch-Verwaltung)
 * - Aufgaben (Aufgaben erstellen)
 * - Hefte (Hefte-Galerie)
 * - Profil (Einstellungen)
 */

import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      {/* Dashboard (Home) */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      {/* Freigaben (Wunsch-Verwaltung) */}
      <Tabs.Screen
        name="freigaben"
        options={{
          title: "Freigaben",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="checkmark.circle.fill" color={color} />
          ),
        }}
      />

      {/* Aufgaben (Aufgaben erstellen) */}
      <Tabs.Screen
        name="aufgaben"
        options={{
          title: "Aufgaben",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="pencil" color={color} />,
        }}
      />

      {/* Hefte (Hefte-Galerie) */}
      <Tabs.Screen
        name="hefte"
        options={{
          title: "Hefte",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="book.fill" color={color} />,
        }}
      />

      {/* Profil (Einstellungen) */}
      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
