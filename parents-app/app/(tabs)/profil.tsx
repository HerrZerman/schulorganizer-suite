/**
 * Profil Screen (Einstellungen)
 * 
 * Einstellungen und Verwaltung für die Elternapp.
 * 
 * Features:
 * - Kinder-Verwaltung
 * - Datenschutz (Daten löschen)
 * - App-Info
 */

import { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { clearAllData } from "@/lib/storage";
import { useColors } from "@/hooks/use-colors";

export default function ProfilScreen() {
  const colors = useColors();

  // Alle Daten löschen
  const handleClearData = () => {
    Alert.alert(
      "Alle Daten löschen",
      "Möchtest du wirklich alle Daten löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllData();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert("Gelöscht", "Alle Daten wurden gelöscht.");
            } catch (error) {
              console.error("Fehler beim Löschen:", error);
              Alert.alert("Fehler", "Daten konnten nicht gelöscht werden.");
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b" style={{ borderBottomColor: colors.border }}>
        <Text className="text-2xl font-bold" style={{ color: colors.foreground }}>
          Profil
        </Text>
        <Text className="text-sm mt-1" style={{ color: colors.muted }}>
          Einstellungen und Verwaltung
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-6 gap-6">
          {/* Kinder-Verwaltung */}
          <View>
            <Text className="text-lg font-semibold mb-3" style={{ color: colors.foreground }}>
              Kinder-Verwaltung
            </Text>

            <TouchableOpacity
              className="rounded-2xl p-4 flex-row items-center justify-between"
              style={{ backgroundColor: colors.surface }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert("Coming Soon", "Diese Funktion wird bald verfügbar sein.");
              }}
              activeOpacity={0.7}
            >
              <View>
                <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                  Kinder bearbeiten
                </Text>
                <Text className="text-sm mt-1" style={{ color: colors.muted }}>
                  Kinder hinzufügen, bearbeiten oder löschen
                </Text>
              </View>
              <Text className="text-xl" style={{ color: colors.muted }}>
                ›
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sterne-Regeln */}
          <View>
            <Text className="text-lg font-semibold mb-3" style={{ color: colors.foreground }}>
              Sterne-Regeln
            </Text>

            <TouchableOpacity
              className="rounded-2xl p-4 flex-row items-center justify-between"
              style={{ backgroundColor: colors.surface }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert("Coming Soon", "Diese Funktion wird bald verfügbar sein.");
              }}
              activeOpacity={0.7}
            >
              <View>
                <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                  Belohnungen konfigurieren
                </Text>
                <Text className="text-sm mt-1" style={{ color: colors.muted }}>
                  Sterne pro Aktivität anpassen
                </Text>
              </View>
              <Text className="text-xl" style={{ color: colors.muted }}>
                ›
              </Text>
            </TouchableOpacity>
          </View>

          {/* Benachrichtigungen */}
          <View>
            <Text className="text-lg font-semibold mb-3" style={{ color: colors.foreground }}>
              Benachrichtigungen
            </Text>

            <TouchableOpacity
              className="rounded-2xl p-4 flex-row items-center justify-between"
              style={{ backgroundColor: colors.surface }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert("Coming Soon", "Diese Funktion wird bald verfügbar sein.");
              }}
              activeOpacity={0.7}
            >
              <View>
                <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                  Push-Einstellungen
                </Text>
                <Text className="text-sm mt-1" style={{ color: colors.muted }}>
                  Benachrichtigungen für Freigaben
                </Text>
              </View>
              <Text className="text-xl" style={{ color: colors.muted }}>
                ›
              </Text>
            </TouchableOpacity>
          </View>

          {/* Statistiken */}
          <View>
            <Text className="text-lg font-semibold mb-3" style={{ color: colors.foreground }}>
              Statistiken
            </Text>

            <TouchableOpacity
              className="rounded-2xl p-4 flex-row items-center justify-between"
              style={{ backgroundColor: colors.surface }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert("Coming Soon", "Diese Funktion wird bald verfügbar sein.");
              }}
              activeOpacity={0.7}
            >
              <View>
                <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                  Wochenbericht anzeigen
                </Text>
                <Text className="text-sm mt-1" style={{ color: colors.muted }}>
                  Fortschritt und Aktivitäten
                </Text>
              </View>
              <Text className="text-xl" style={{ color: colors.muted }}>
                ›
              </Text>
            </TouchableOpacity>
          </View>

          {/* Datenschutz */}
          <View>
            <Text className="text-lg font-semibold mb-3" style={{ color: colors.foreground }}>
              Datenschutz
            </Text>

            <TouchableOpacity
              className="rounded-2xl p-4 flex-row items-center justify-between mb-3"
              style={{ backgroundColor: colors.surface }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert("Coming Soon", "Diese Funktion wird bald verfügbar sein.");
              }}
              activeOpacity={0.7}
            >
              <View>
                <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                  Daten exportieren
                </Text>
                <Text className="text-sm mt-1" style={{ color: colors.muted }}>
                  Alle Daten als JSON exportieren
                </Text>
              </View>
              <Text className="text-xl" style={{ color: colors.muted }}>
                ›
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="rounded-2xl p-4 flex-row items-center justify-between"
              style={{ backgroundColor: colors.error, opacity: 0.9 }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                handleClearData();
              }}
              activeOpacity={0.7}
            >
              <View>
                <Text className="text-base font-semibold text-white">Alle Daten löschen</Text>
                <Text className="text-sm mt-1 text-white opacity-80">
                  Kann nicht rückgängig gemacht werden
                </Text>
              </View>
              <Text className="text-xl text-white">⚠️</Text>
            </TouchableOpacity>
          </View>

          {/* Über SternWerk */}
          <View>
            <Text className="text-lg font-semibold mb-3" style={{ color: colors.foreground }}>
              Über SternWerk
            </Text>

            <View
              className="rounded-2xl p-4"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-base font-semibold mb-2" style={{ color: colors.foreground }}>
                SternWerk - Elternapp
              </Text>
              <Text className="text-sm mb-1" style={{ color: colors.muted }}>
                Version 1.0.0
              </Text>
              <Text className="text-sm mb-1" style={{ color: colors.muted }}>
                Developer: HopeApps
              </Text>
              <Text className="text-sm" style={{ color: colors.muted }}>
                Owner: Umut Zerman
              </Text>

              <View className="mt-4 pt-4 border-t" style={{ borderTopColor: colors.border }}>
                <Text className="text-xs leading-5" style={{ color: colors.muted }}>
                  Diese App hilft Eltern, den Lernfortschritt ihrer Kinder zu verfolgen und zu
                  unterstützen. Alle Daten werden lokal auf dem Gerät gespeichert.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
