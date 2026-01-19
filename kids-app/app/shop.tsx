import { View, Text, TouchableOpacity, FlatList, Alert, TextInput, Modal, Image } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import type { RewardWish } from "@/types/models";
import { loadWishes, addWish, updateWish, getTotalStars, spendStars } from "@/lib/storage";
import { getWishEmoji } from "@/lib/image-search";
import * as Haptics from "expo-haptics";

/**
 * Shop Screen - Sterne gegen Wünsche eintauschen
 */
export default function ShopScreen() {
  const router = useRouter();
  const colors = useColors();
  const [wishes, setWishes] = useState<RewardWish[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWishTitle, setNewWishTitle] = useState("");
  const [newWishPrice, setNewWishPrice] = useState("50");


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedWishes = await loadWishes();
    setWishes(loadedWishes);
    
    const stars = await getTotalStars();
    setTotalStars(stars);
  };



  const handleAddWish = async () => {
    if (!newWishTitle.trim()) {
      Alert.alert("Fehler", "Bitte gib einen Titel ein!");
      return;
    }

    const price = parseInt(newWishPrice, 10);
    if (isNaN(price) || price <= 0) {
      Alert.alert("Fehler", "Bitte gib einen gültigen Preis ein!");
      return;
    }

    const newWish: RewardWish = {
      id: Date.now().toString(),
      childId: "default",
      title: newWishTitle,

      starPrice: price,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await addWish(newWish);
    await loadData();
    setNewWishTitle("");
    setNewWishPrice("50");
    setShowAddModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleRedeemWish = async (wish: RewardWish) => {
    if (totalStars < wish.starPrice) {
      Alert.alert(
        "Nicht genug Sterne",
        `Du brauchst noch ${wish.starPrice - totalStars} Sterne!`
      );
      return;
    }

    Alert.alert(
      "Wunsch einlösen?",
      `Möchtest du "${wish.title}" für ${wish.starPrice} ⭐ einlösen?\n\nDeine Eltern müssen das noch bestätigen!`,
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Einlösen",
          onPress: async () => {
            await updateWish(wish.id, {
              status: "pending",
              requestedAt: new Date(),
            });
            await spendStars(wish.starPrice, `Wunsch angefragt: ${wish.title}`, wish.id);
            await loadData();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(
              "🎉 Anfrage gesendet!",
              "Deine Eltern werden benachrichtigt und können deinen Wunsch freigeben!"
            );
          },
        },
      ]
    );
  };

  const getWishIcon = (status: RewardWish["status"]) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "approved":
        return "✅";
      case "rejected":
        return "❌";
      case "fulfilled":
        return "🎁";
      default:
        return "⭐";
    }
  };

  const getWishStatusText = (wish: RewardWish) => {
    const canAfford = totalStars >= wish.starPrice;
    const remaining = wish.starPrice - totalStars;

    switch (wish.status) {
      case "pending":
        return "Wartet auf Freigabe";
      case "approved":
        return "Von Eltern genehmigt!";
      case "rejected":
        return "Abgelehnt";
      case "fulfilled":
        return "Eingelöst!";
      default:
        return canAfford ? "✅ Genug Sterne!" : `Noch ${remaining} ⭐ sammeln`;
    }
  };

  const activeWishes = wishes.filter(w => w.status !== "fulfilled");

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <IconSymbol name="chevron.left" size={28} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-foreground flex-1">Sterne Shop</Text>
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <IconSymbol name="plus.circle.fill" size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Sterne-Counter */}
        <View
          className="p-6 rounded-3xl items-center"
          style={{
            backgroundColor: colors.star + "20",
            borderWidth: 2,
            borderColor: colors.star + "40",
          }}
        >
          <Text className="text-sm text-muted mb-2">Deine Sterne</Text>
          <View className="flex-row items-center gap-2">
            <IconSymbol name="star.fill" size={32} color={colors.star} />
            <Text className="text-5xl font-bold" style={{ color: colors.star }}>
              {totalStars}
            </Text>
          </View>
        </View>
      </View>

      {/* Wunschliste */}
      {activeWishes.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-6xl mb-4">🎁</Text>
          <Text className="text-xl font-bold text-foreground mb-2">Keine Wünsche</Text>
          <Text className="text-muted text-center">
            Tippe auf das + um einen neuen Wunsch hinzuzufügen!
          </Text>
        </View>
      ) : (
        <FlatList
          data={activeWishes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 24, gap: 16 }}
          renderItem={({ item }) => {
            const canAfford = totalStars >= item.starPrice;
            const isPending = item.status === "pending";
            const isApproved = item.status === "approved";
            
            return (
              <View
                className="p-6 rounded-3xl"
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 2,
                  borderColor: canAfford ? colors.success + "40" : colors.border,
                }}
              >
                {/* Bild oder Icon & Titel */}
                <View className="flex-row items-start mb-4">
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={{ width: 80, height: 80, borderRadius: 12, marginRight: 16 }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text className="text-5xl mr-4">{getWishIcon(item.status)}</Text>
                  )}
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-foreground mb-1">
                      {item.title}
                    </Text>
                    <View className="flex-row items-center gap-1">
                      <IconSymbol name="star.fill" size={16} color={colors.star} />
                      <Text className="text-lg font-bold" style={{ color: colors.star }}>
                        {item.starPrice}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Fortschrittsbalken */}
                {item.status === "active" && (
                  <View className="mb-4">
                    <View className="h-3 bg-background rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min((totalStars / item.starPrice) * 100, 100)}%`,
                          backgroundColor: canAfford ? colors.success : colors.primary,
                        }}
                      />
                    </View>
                  </View>
                )}

                {/* Status-Text */}
                <Text
                  className="text-sm font-semibold mb-4"
                  style={{
                    color: canAfford || isApproved ? colors.success : colors.muted,
                  }}
                >
                  {getWishStatusText(item)}
                </Text>

                {/* Einlösen-Button */}
                <TouchableOpacity
                  onPress={() => handleRedeemWish(item)}
                  disabled={!canAfford || isPending || isApproved}
                  className="py-4 rounded-2xl items-center"
                  style={{
                    backgroundColor: canAfford && !isPending && !isApproved
                      ? colors.success
                      : colors.surface,
                    opacity: canAfford && !isPending && !isApproved ? 1 : 0.5,
                  }}
                >
                  <Text
                    className="text-base font-bold"
                    style={{
                      color: canAfford && !isPending && !isApproved
                        ? "#FFFFFF"
                        : colors.muted,
                    }}
                  >
                    {isPending
                      ? "⏳ Wartet auf Eltern"
                      : isApproved
                      ? "✅ Genehmigt!"
                      : canAfford
                      ? "Einlösen"
                      : "Nicht genug Sterne"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      {/* Add Wish Modal */}
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
              <Text className="text-2xl font-bold text-foreground">Neuer Wunsch</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <IconSymbol name="xmark" size={24} color={colors.muted} />
              </TouchableOpacity>
            </View>

            {/* Titel */}
            <Text className="text-sm font-semibold text-foreground mb-2">Was wünschst du dir?</Text>
            <TextInput
              value={newWishTitle}
              onChangeText={setNewWishTitle}
              placeholder="z.B. Nintendo Switch, Huntrix T-Shirt"
              className="p-4 rounded-2xl text-base mb-4"
              style={{
                backgroundColor: colors.surface,
                color: colors.foreground,
              }}
              placeholderTextColor={colors.muted}
            />

            {/* Hinweis: Bildsuche */}
            <View className="mb-4 p-3 rounded-2xl" style={{ backgroundColor: colors.secondary + "20" }}>
              <Text className="text-xs text-muted text-center">
                💡 Tipp: Deine Eltern können später ein Produktbild hinzufügen!
              </Text>
            </View>

            {/* Preis */}
            <Text className="text-sm font-semibold text-foreground mb-2">Wie viele Sterne?</Text>
            <TextInput
              value={newWishPrice}
              onChangeText={setNewWishPrice}
              placeholder="50"
              keyboardType="number-pad"
              className="p-4 rounded-2xl text-base mb-6"
              style={{
                backgroundColor: colors.surface,
                color: colors.foreground,
              }}
              placeholderTextColor={colors.muted}
            />

            {/* Buttons */}
            <TouchableOpacity
              onPress={handleAddWish}
              className="py-4 rounded-2xl items-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-base font-bold text-white">Wunsch hinzufügen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
