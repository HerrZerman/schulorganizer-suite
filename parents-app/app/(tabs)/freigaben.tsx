/**
 * Freigaben Screen
 * 
 * Zeigt wartende Wünsche der Kinder an.
 * Eltern können Wünsche genehmigen oder ablehnen.
 * 
 * Features:
 * - Liste wartender Wünsche (status: pending)
 * - Freigeben Button (grün)
 * - Ablehnen Button (grau)
 * - Verlauf genehmigter/abgelehnter Wünsche
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
import type { RewardWish, Child, WishWithChild } from "@/types/models";
import {
  loadWishes,
  loadChildren,
  approveWish,
  rejectWish,
} from "@/lib/storage";
import { useColors } from "@/hooks/use-colors";

export default function FreigabenScreen() {
  const colors = useColors();
  const [pendingWishes, setPendingWishes] = useState<WishWithChild[]>([]);
  const [approvedWishes, setApprovedWishes] = useState<WishWithChild[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedWish, setSelectedWish] = useState<WishWithChild | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  // Wünsche laden
  const loadWishesData = async () => {
    try {
      const [wishes, children] = await Promise.all([loadWishes(), loadChildren()]);

      // Wünsche mit Kind-Info kombinieren
      const wishesWithChild: WishWithChild[] = wishes
        .map((wish) => {
          const child = children.find((c) => c.id === wish.childId);
          if (!child) return null;
          return { ...wish, child };
        })
        .filter((w): w is WishWithChild => w !== null);

      // Nach Status filtern
      setPendingWishes(wishesWithChild.filter((w) => w.status === "pending"));
      setApprovedWishes(
        wishesWithChild
          .filter((w) => w.status === "approved" || w.status === "rejected")
          .sort((a, b) => {
            const dateA = a.approvedAt || a.rejectedAt || new Date(0);
            const dateB = b.approvedAt || b.rejectedAt || new Date(0);
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          })
      );
    } catch (error) {
      console.error("Fehler beim Laden der Wünsche:", error);
    }
  };

  // Initial laden
  useEffect(() => {
    loadWishesData();
  }, []);

  // Neu laden wenn Screen fokussiert wird
  useFocusEffect(
    useCallback(() => {
      loadWishesData();
    }, [])
  );

  // Pull-to-Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadWishesData();
    setRefreshing(false);
  };

  // Wunsch genehmigen
  const handleApprove = (wish: WishWithChild) => {
    setSelectedWish(wish);
    setActionType("approve");
    setShowNoteModal(true);
  };

  // Wunsch ablehnen
  const handleReject = (wish: WishWithChild) => {
    setSelectedWish(wish);
    setActionType("reject");
    setShowNoteModal(true);
  };

  // Fortschrittsbalken berechnen
  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b" style={{ borderBottomColor: colors.border }}>
        <Text className="text-2xl font-bold" style={{ color: colors.foreground }}>
          Freigaben
        </Text>
        <Text className="text-sm mt-1" style={{ color: colors.muted }}>
          Wünsche genehmigen oder ablehnen
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="p-6 gap-6">
          {/* Wartende Wünsche */}
          <View>
            <Text className="text-lg font-semibold mb-3" style={{ color: colors.foreground }}>
              Wartende Wünsche ({pendingWishes.length})
            </Text>

            {pendingWishes.length === 0 ? (
              <View
                className="rounded-2xl p-6 items-center"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-base text-center" style={{ color: colors.muted }}>
                  Keine wartenden Wünsche
                </Text>
              </View>
            ) : (
              pendingWishes.map((wish) => (
                <View
                  key={wish.id}
                  className="rounded-2xl p-4 mb-3 border"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }}
                >
                  {/* Kind-Info */}
                  <View className="flex-row items-center gap-2 mb-3">
                    <Text className="text-2xl">{wish.child.avatar}</Text>
                    <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                      {wish.child.name}
                    </Text>
                  </View>

                  {/* Wunsch-Titel */}
                  <Text className="text-lg font-bold mb-2" style={{ color: colors.foreground }}>
                    {wish.title}
                  </Text>

                  {/* Kosten und aktueller Stand */}
                  <View className="mb-3">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-sm" style={{ color: colors.muted }}>
                        Kosten: {wish.starPrice} ⭐
                      </Text>
                      <Text className="text-sm" style={{ color: colors.muted }}>
                        Aktuell: {wish.child.totalStars} ⭐
                      </Text>
                    </View>

                    {/* Fortschrittsbalken */}
                    <View
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: colors.border }}
                    >
                      <View
                        className="h-full rounded-full"
                        style={{
                          backgroundColor:
                            wish.child.totalStars >= wish.starPrice
                              ? colors.success
                              : colors.warning,
                          width: `${getProgress(wish.child.totalStars, wish.starPrice)}%`,
                        }}
                      />
                    </View>

                    {/* Status-Text */}
                    {wish.child.totalStars >= wish.starPrice ? (
                      <Text className="text-sm mt-2 font-semibold" style={{ color: colors.success }}>
                        ✓ Genug Sterne!
                      </Text>
                    ) : (
                      <Text className="text-sm mt-2" style={{ color: colors.muted }}>
                        Noch {wish.starPrice - wish.child.totalStars} ⭐ sammeln
                      </Text>
                    )}
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      className="flex-1 rounded-xl p-3 items-center"
                      style={{ backgroundColor: colors.muted }}
                      onPress={() => handleReject(wish)}
                      activeOpacity={0.8}
                    >
                      <Text className="text-base font-semibold text-white">Ablehnen</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="flex-1 rounded-xl p-3 items-center"
                      style={{ backgroundColor: colors.success }}
                      onPress={() => handleApprove(wish)}
                      activeOpacity={0.8}
                    >
                      <Text className="text-base font-semibold text-white">Freigeben</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Verlauf (genehmigte/abgelehnte Wünsche) */}
          {approvedWishes.length > 0 && (
            <View>
              <Text className="text-lg font-semibold mb-3" style={{ color: colors.foreground }}>
                Verlauf ({approvedWishes.length})
              </Text>

              {approvedWishes.slice(0, 5).map((wish) => (
                <View
                  key={wish.id}
                  className="rounded-2xl p-4 mb-3 border"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2 mb-1">
                        <Text className="text-xl">{wish.child.avatar}</Text>
                        <Text className="text-sm font-semibold" style={{ color: colors.foreground }}>
                          {wish.child.name}
                        </Text>
                      </View>
                      <Text className="text-base" style={{ color: colors.foreground }}>
                        {wish.title}
                      </Text>
                      <Text className="text-xs mt-1" style={{ color: colors.muted }}>
                        {wish.starPrice} ⭐
                      </Text>
                    </View>

                    <View className="items-end">
                      {wish.status === "approved" ? (
                        <Text className="text-sm font-semibold" style={{ color: colors.success }}>
                          ✓ Genehmigt
                        </Text>
                      ) : (
                        <Text className="text-sm font-semibold" style={{ color: colors.error }}>
                          ✗ Abgelehnt
                        </Text>
                      )}
                    </View>
                  </View>

                  {wish.parentNote && (
                    <Text className="text-sm mt-2 italic" style={{ color: colors.muted }}>
                      Notiz: {wish.parentNote}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Notiz Modal */}
      <ActionNoteModal
        visible={showNoteModal}
        wish={selectedWish}
        actionType={actionType}
        onClose={() => {
          setShowNoteModal(false);
          setSelectedWish(null);
        }}
        onSubmit={async () => {
          await loadWishesData();
          setShowNoteModal(false);
          setSelectedWish(null);
        }}
      />
    </ScreenContainer>
  );
}

// ============================================
// ACTION NOTE MODAL
// ============================================

interface ActionNoteModalProps {
  visible: boolean;
  wish: WishWithChild | null;
  actionType: "approve" | "reject";
  onClose: () => void;
  onSubmit: () => void;
}

function ActionNoteModal({ visible, wish, actionType, onClose, onSubmit }: ActionNoteModalProps) {
  const colors = useColors();
  const [note, setNote] = useState("");

  const handleSubmit = async () => {
    if (!wish) return;

    try {
      if (actionType === "approve") {
        await approveWish(wish.id, note.trim() || undefined);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        await rejectWish(wish.id, note.trim() || undefined);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }

      setNote("");
      onSubmit();
    } catch (error) {
      console.error("Fehler beim Aktualisieren:", error);
      Alert.alert("Fehler", "Wunsch konnte nicht aktualisiert werden.");
    }
  };

  if (!wish) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View
          className="rounded-t-3xl p-6"
          style={{
            backgroundColor: colors.background,
            minHeight: 350,
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold" style={{ color: colors.foreground }}>
              {actionType === "approve" ? "Wunsch freigeben" : "Wunsch ablehnen"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-base" style={{ color: colors.muted }}>
                Abbrechen
              </Text>
            </TouchableOpacity>
          </View>

          {/* Wunsch-Info */}
          <View
            className="rounded-xl p-4 mb-4"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="flex-row items-center gap-2 mb-2">
              <Text className="text-2xl">{wish.child.avatar}</Text>
              <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                {wish.child.name}
              </Text>
            </View>
            <Text className="text-lg font-bold" style={{ color: colors.foreground }}>
              {wish.title}
            </Text>
            <Text className="text-sm mt-1" style={{ color: colors.muted }}>
              {wish.starPrice} ⭐
            </Text>
          </View>

          {/* Notiz (optional) */}
          <View className="mb-6">
            <Text className="text-sm font-semibold mb-2" style={{ color: colors.foreground }}>
              Notiz (optional)
            </Text>
            <TextInput
              className="rounded-xl p-4 text-base"
              style={{
                backgroundColor: colors.surface,
                color: colors.foreground,
                borderWidth: 1,
                borderColor: colors.border,
                minHeight: 100,
              }}
              placeholder="Z.B. 'Erst nach dem Zeugnis' oder 'Zu teuer'"
              placeholderTextColor={colors.muted}
              value={note}
              onChangeText={setNote}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className="rounded-full p-4 items-center"
            style={{
              backgroundColor: actionType === "approve" ? colors.success : colors.error,
            }}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text className="text-base font-semibold text-white">
              {actionType === "approve" ? "Jetzt freigeben" : "Ablehnen"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
