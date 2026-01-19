/**
 * Dashboard Screen (Home)
 * 
 * Zeigt eine Übersicht aller Kinder mit:
 * - Avatar/Emoji
 * - Name und Klasse
 * - Sterne-Stand
 * - Anzahl wartender Wünsche
 * - Letzte Aktivität
 * 
 * Plus-Button zum Hinzufügen neuer Kinder
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
import type { Child } from "@/types/models";
import { loadChildren, addChild, getChildStats } from "@/lib/storage";
import { useColors } from "@/hooks/use-colors";

// Statistik-Typ für Dashboard
interface ChildWithStats extends Child {
  pendingWishes: number;
  tasksToday: number;
  completedTasksToday: number;
}

export default function DashboardScreen() {
  const colors = useColors();
  const [children, setChildren] = useState<ChildWithStats[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Kinder laden
  const loadChildrenData = async () => {
    try {
      const childrenData = await loadChildren();

      // Statistiken für jedes Kind laden
      const childrenWithStats = await Promise.all(
        childrenData.map(async (child) => {
          const stats = await getChildStats(child.id);
          return {
            ...child,
            pendingWishes: stats?.pendingWishes ?? 0,
            tasksToday: stats?.tasksToday ?? 0,
            completedTasksToday: stats?.completedTasksToday ?? 0,
          };
        })
      );

      setChildren(childrenWithStats);
    } catch (error) {
      console.error("Fehler beim Laden der Kinder:", error);
    }
  };

  // Initial laden
  useEffect(() => {
    loadChildrenData();
  }, []);

  // Neu laden wenn Screen fokussiert wird
  useFocusEffect(
    useCallback(() => {
      loadChildrenData();
    }, [])
  );

  // Pull-to-Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadChildrenData();
    setRefreshing(false);
  };

  // Kind hinzufügen Button
  const handleAddChild = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowAddModal(true);
  };

  // Letzte Aktivität formatieren
  const formatLastActivity = (date?: Date) => {
    if (!date) return "Keine Aktivität";

    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Gerade eben";
    if (hours === 1) return "Vor 1 Stunde";
    if (hours < 24) return `Vor ${hours} Stunden`;

    const days = Math.floor(hours / 24);
    if (days === 1) return "Vor 1 Tag";
    return `Vor ${days} Tagen`;
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b" style={{ borderBottomColor: colors.border }}>
        <Text className="text-2xl font-bold" style={{ color: colors.foreground }}>
          SternWerk
        </Text>
        <Text className="text-sm mt-1" style={{ color: colors.muted }}>
          Meine Kinder
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="p-6 gap-4">
          {/* Kinder-Liste */}
          {children.length === 0 ? (
            <View className="items-center py-12">
              <Text className="text-base text-center" style={{ color: colors.muted }}>
                Noch keine Kinder hinzugefügt.{"\n"}Tippe auf "+" um ein Kind hinzuzufügen.
              </Text>
            </View>
          ) : (
            children.map((child) => (
              <TouchableOpacity
                key={child.id}
                className="rounded-2xl p-4 border"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  // TODO: Navigation zu Kind-Detail
                }}
                activeOpacity={0.7}
              >
                {/* Kind-Info */}
                <View className="flex-row items-center gap-3 mb-3">
                  {/* Avatar */}
                  <View
                    className="w-14 h-14 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text className="text-3xl">{child.avatar}</Text>
                  </View>

                  {/* Name und Klasse */}
                  <View className="flex-1">
                    <Text className="text-lg font-semibold" style={{ color: colors.foreground }}>
                      {child.name}
                    </Text>
                    <Text className="text-sm" style={{ color: colors.muted }}>
                      Klasse {child.grade}
                    </Text>
                  </View>

                  {/* Sterne */}
                  <View className="items-end">
                    <Text className="text-2xl font-bold" style={{ color: colors.star }}>
                      {child.totalStars} ⭐
                    </Text>
                  </View>
                </View>

                {/* Status-Info */}
                <View className="flex-row gap-4">
                  {/* Wartende Wünsche */}
                  {child.pendingWishes > 0 && (
                    <View className="flex-row items-center gap-1">
                      <Text className="text-sm font-semibold" style={{ color: colors.warning }}>
                        {child.pendingWishes}
                      </Text>
                      <Text className="text-sm" style={{ color: colors.muted }}>
                        {child.pendingWishes === 1 ? "Wunsch wartet" : "Wünsche warten"}
                      </Text>
                    </View>
                  )}

                  {/* Aufgaben heute */}
                  {child.tasksToday > 0 && (
                    <View className="flex-row items-center gap-1">
                      <Text className="text-sm font-semibold" style={{ color: colors.success }}>
                        {child.completedTasksToday}/{child.tasksToday}
                      </Text>
                      <Text className="text-sm" style={{ color: colors.muted }}>
                        Aufgaben
                      </Text>
                    </View>
                  )}

                  {/* Alle Aufgaben erledigt */}
                  {child.tasksToday > 0 &&
                    child.completedTasksToday === child.tasksToday && (
                      <Text className="text-sm font-semibold" style={{ color: colors.success }}>
                        ✓ Alle erledigt
                      </Text>
                    )}
                </View>

                {/* Letzte Aktivität */}
                <Text className="text-xs mt-2" style={{ color: colors.muted }}>
                  Letzte Aktivität: {formatLastActivity(child.lastActivity)}
                </Text>
              </TouchableOpacity>
            ))
          )}

          {/* Kind hinzufügen Button */}
          <TouchableOpacity
            className="rounded-2xl p-4 border-2 border-dashed items-center justify-center"
            style={{
              borderColor: colors.border,
              minHeight: 80,
            }}
            onPress={handleAddChild}
            activeOpacity={0.7}
          >
            <Text className="text-4xl mb-2">➕</Text>
            <Text className="text-base font-semibold" style={{ color: colors.primary }}>
              Kind hinzufügen
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Kind hinzufügen Modal */}
      <AddChildModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={async () => {
          await loadChildrenData();
          setShowAddModal(false);
        }}
      />
    </ScreenContainer>
  );
}

// ============================================
// KIND HINZUFÜGEN MODAL
// ============================================

interface AddChildModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: () => void;
}

function AddChildModal({ visible, onClose, onAdd }: AddChildModalProps) {
  const colors = useColors();
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("1");
  const [avatar, setAvatar] = useState("👧");

  // Emoji-Auswahl (vereinfacht)
  const avatars = ["👧", "👦", "🧒", "👶", "🧑", "👨", "👩"];

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Fehler", "Bitte gib einen Namen ein.");
      return;
    }

    try {
      await addChild({
        name: name.trim(),
        avatar,
        grade: parseInt(grade),
        totalStars: 0,
        theme: "default",
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setName("");
      setGrade("1");
      setAvatar("👧");
      onAdd();
    } catch (error) {
      console.error("Fehler beim Hinzufügen:", error);
      Alert.alert("Fehler", "Kind konnte nicht hinzugefügt werden.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View
          className="rounded-t-3xl p-6"
          style={{
            backgroundColor: colors.background,
            minHeight: 400,
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold" style={{ color: colors.foreground }}>
              Kind hinzufügen
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-base" style={{ color: colors.muted }}>
                Abbrechen
              </Text>
            </TouchableOpacity>
          </View>

          {/* Name */}
          <View className="mb-4">
            <Text className="text-sm font-semibold mb-2" style={{ color: colors.foreground }}>
              Name
            </Text>
            <TextInput
              className="rounded-xl p-4 text-base"
              style={{
                backgroundColor: colors.surface,
                color: colors.foreground,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              placeholder="Vorname des Kindes"
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
              autoFocus
            />
          </View>

          {/* Klasse */}
          <View className="mb-4">
            <Text className="text-sm font-semibold mb-2" style={{ color: colors.foreground }}>
              Klasse
            </Text>
            <View className="flex-row gap-2">
              {["1", "2", "3", "4"].map((g) => (
                <TouchableOpacity
                  key={g}
                  className="flex-1 rounded-xl p-3 items-center"
                  style={{
                    backgroundColor: grade === g ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor: grade === g ? colors.primary : colors.border,
                  }}
                  onPress={() => {
                    setGrade(g);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text
                    className="text-base font-semibold"
                    style={{
                      color: grade === g ? "#FFFFFF" : colors.foreground,
                    }}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Avatar */}
          <View className="mb-6">
            <Text className="text-sm font-semibold mb-2" style={{ color: colors.foreground }}>
              Avatar
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {avatars.map((a) => (
                <TouchableOpacity
                  key={a}
                  className="w-14 h-14 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: avatar === a ? colors.primary : colors.surface,
                    borderWidth: 2,
                    borderColor: avatar === a ? colors.primary : colors.border,
                  }}
                  onPress={() => {
                    setAvatar(a);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text className="text-2xl">{a}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className="rounded-full p-4 items-center"
            style={{ backgroundColor: colors.primary }}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text className="text-base font-semibold text-white">Kind hinzufügen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
