/**
 * Debug-Screen (nur in Development)
 * 
 * Zeigt alle Log-Einträge (Fehler, Warnungen, Infos, Erfolge)
 * für Debugging-Zwecke an.
 * 
 * Features:
 * - Liste aller Logs mit Timestamp, Level, Kontext, Nachricht
 * - Filter nach Log-Level
 * - Logs exportieren (Share-Dialog)
 * - Logs löschen
 * - Detail-Ansicht mit Stack-Trace
 */

import { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  Share,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import {
  loadLogs,
  clearLogs,
  exportLogs,
  getLogStats,
  filterLogsByLevel,
  type LogEntry,
  type LogLevel,
} from "@/lib/debug-logger";
import { useColors } from "@/hooks/use-colors";

export default function DebugScreen() {
  const colors = useColors();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | "all">("all");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Logs laden
  const loadLogsData = async () => {
    try {
      const logsData = await loadLogs();
      // Neueste zuerst
      const sorted = logsData.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setLogs(sorted);
      applyFilter(sorted, selectedLevel);
    } catch (error) {
      console.error("Fehler beim Laden der Logs:", error);
    }
  };

  // Filter anwenden
  const applyFilter = (logsData: LogEntry[], level: LogLevel | "all") => {
    if (level === "all") {
      setFilteredLogs(logsData);
    } else {
      setFilteredLogs(filterLogsByLevel(logsData, level));
    }
  };

  // Initial laden
  useEffect(() => {
    loadLogsData();
  }, []);

  // Neu laden wenn Screen fokussiert wird
  useFocusEffect(
    useCallback(() => {
      loadLogsData();
    }, [])
  );

  // Pull-to-Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadLogsData();
    setRefreshing(false);
  };

  // Filter ändern
  const handleFilterChange = (level: LogLevel | "all") => {
    setSelectedLevel(level);
    applyFilter(logs, level);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Logs exportieren
  const handleExport = async () => {
    try {
      const logsJson = await exportLogs();
      await Share.share({
        message: logsJson,
        title: "SternWerk Debug-Logs",
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Fehler beim Exportieren:", error);
      Alert.alert("Fehler", "Logs konnten nicht exportiert werden.");
    }
  };

  // Logs löschen
  const handleClear = () => {
    Alert.alert(
      "Logs löschen",
      "Möchtest du wirklich alle Debug-Logs löschen?",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: async () => {
            try {
              await clearLogs();
              await loadLogsData();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              console.error("Fehler beim Löschen:", error);
              Alert.alert("Fehler", "Logs konnten nicht gelöscht werden.");
            }
          },
        },
      ]
    );
  };

  // Log-Detail öffnen
  const handleOpenLog = (log: LogEntry) => {
    setSelectedLog(log);
    setShowDetailModal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Datum formatieren
  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Log-Level Farbe
  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case "error":
        return colors.error;
      case "warning":
        return colors.warning;
      case "info":
        return colors.muted;
      case "success":
        return colors.success;
    }
  };

  // Log-Level Icon
  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      case "success":
        return "✅";
    }
  };

  const stats = getLogStats(logs);

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b" style={{ borderBottomColor: colors.border }}>
        <View className="flex-row items-center justify-between mb-2">
          <View>
            <Text className="text-2xl font-bold" style={{ color: colors.foreground }}>
              Debug-Logs
            </Text>
            <Text className="text-sm mt-1" style={{ color: colors.muted }}>
              {stats.total} Einträge
            </Text>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              className="rounded-full w-10 h-10 items-center justify-center"
              style={{ backgroundColor: colors.surface }}
              onPress={handleExport}
            >
              <Text className="text-lg">📤</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="rounded-full w-10 h-10 items-center justify-center"
              style={{ backgroundColor: colors.error, opacity: 0.9 }}
              onPress={handleClear}
            >
              <Text className="text-lg">🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistiken */}
        <View className="flex-row gap-4 mb-4">
          <View className="flex-row items-center gap-1">
            <Text className="text-sm font-semibold" style={{ color: colors.error }}>
              {stats.errors}
            </Text>
            <Text className="text-xs" style={{ color: colors.muted }}>
              Fehler
            </Text>
          </View>

          <View className="flex-row items-center gap-1">
            <Text className="text-sm font-semibold" style={{ color: colors.warning }}>
              {stats.warnings}
            </Text>
            <Text className="text-xs" style={{ color: colors.muted }}>
              Warnungen
            </Text>
          </View>

          <View className="flex-row items-center gap-1">
            <Text className="text-sm font-semibold" style={{ color: colors.success }}>
              {stats.success}
            </Text>
            <Text className="text-xs" style={{ color: colors.muted }}>
              Erfolge
            </Text>
          </View>
        </View>

        {/* Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
          <View className="flex-row gap-2 px-2">
            {(["all", "error", "warning", "info", "success"] as const).map((level) => (
              <TouchableOpacity
                key={level}
                className="rounded-full px-4 py-2"
                style={{
                  backgroundColor: selectedLevel === level ? colors.primary : colors.surface,
                  borderWidth: 1,
                  borderColor: selectedLevel === level ? colors.primary : colors.border,
                }}
                onPress={() => handleFilterChange(level)}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{
                    color: selectedLevel === level ? "#FFFFFF" : colors.foreground,
                  }}
                >
                  {level === "all"
                    ? "Alle"
                    : level === "error"
                    ? "Fehler"
                    : level === "warning"
                    ? "Warnungen"
                    : level === "info"
                    ? "Infos"
                    : "Erfolge"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="p-6 gap-2">
          {filteredLogs.length === 0 ? (
            <View
              className="rounded-2xl p-6 items-center"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-base text-center" style={{ color: colors.muted }}>
                Keine Logs gefunden.
                {selectedLevel !== "all" && "\n\nÄndere den Filter um mehr Logs zu sehen."}
              </Text>
            </View>
          ) : (
            filteredLogs.map((log) => (
              <TouchableOpacity
                key={log.id}
                className="rounded-xl p-3 border"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderLeftWidth: 4,
                  borderLeftColor: getLevelColor(log.level),
                }}
                onPress={() => handleOpenLog(log)}
                activeOpacity={0.7}
              >
                {/* Header */}
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-base">{getLevelIcon(log.level)}</Text>
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: getLevelColor(log.level) }}
                    >
                      {log.level.toUpperCase()}
                    </Text>
                  </View>

                  <Text className="text-xs" style={{ color: colors.muted }}>
                    {formatTimestamp(log.timestamp)}
                  </Text>
                </View>

                {/* Kontext */}
                <Text className="text-xs font-mono mb-1" style={{ color: colors.muted }}>
                  {log.context}
                </Text>

                {/* Nachricht */}
                <Text
                  className="text-sm"
                  numberOfLines={2}
                  style={{ color: colors.foreground }}
                >
                  {log.message}
                </Text>

                {/* Details-Indikator */}
                {(log.details || log.stack) && (
                  <Text className="text-xs mt-1" style={{ color: colors.muted }}>
                    Tippen für Details →
                  </Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Detail Modal */}
      <LogDetailModal
        visible={showDetailModal}
        log={selectedLog}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedLog(null);
        }}
      />
    </ScreenContainer>
  );
}

// ============================================
// LOG DETAIL MODAL
// ============================================

interface LogDetailModalProps {
  visible: boolean;
  log: LogEntry | null;
  onClose: () => void;
}

function LogDetailModal({ visible, log, onClose }: LogDetailModalProps) {
  const colors = useColors();

  if (!log) return null;

  // Log-Level Farbe
  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case "error":
        return colors.error;
      case "warning":
        return colors.warning;
      case "info":
        return colors.muted;
      case "success":
        return colors.success;
    }
  };

  // Log-Level Icon
  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      case "success":
        return "✅";
    }
  };

  // Datum formatieren
  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <View
          className="px-6 py-4 border-b flex-row items-center justify-between"
          style={{ borderBottomColor: colors.border, paddingTop: 60 }}
        >
          <TouchableOpacity onPress={onClose}>
            <Text className="text-base" style={{ color: colors.primary }}>
              ← Zurück
            </Text>
          </TouchableOpacity>

          <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
            Log-Details
          </Text>

          <View style={{ width: 60 }} />
        </View>

        <ScrollView className="flex-1">
          <View className="p-6 gap-4">
            {/* Level & Timestamp */}
            <View
              className="rounded-2xl p-4"
              style={{
                backgroundColor: colors.surface,
                borderLeftWidth: 4,
                borderLeftColor: getLevelColor(log.level),
              }}
            >
              <View className="flex-row items-center gap-2 mb-2">
                <Text className="text-2xl">{getLevelIcon(log.level)}</Text>
                <Text
                  className="text-base font-semibold"
                  style={{ color: getLevelColor(log.level) }}
                >
                  {log.level.toUpperCase()}
                </Text>
              </View>

              <Text className="text-sm" style={{ color: colors.muted }}>
                {formatTimestamp(log.timestamp)}
              </Text>
            </View>

            {/* Kontext */}
            <View>
              <Text className="text-sm font-semibold mb-2" style={{ color: colors.foreground }}>
                Kontext
              </Text>
              <View
                className="rounded-xl p-3"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-sm font-mono" style={{ color: colors.foreground }}>
                  {log.context}
                </Text>
              </View>
            </View>

            {/* Nachricht */}
            <View>
              <Text className="text-sm font-semibold mb-2" style={{ color: colors.foreground }}>
                Nachricht
              </Text>
              <View
                className="rounded-xl p-3"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-sm" style={{ color: colors.foreground }}>
                  {log.message}
                </Text>
              </View>
            </View>

            {/* Details */}
            {log.details && (
              <View>
                <Text className="text-sm font-semibold mb-2" style={{ color: colors.foreground }}>
                  Details
                </Text>
                <View
                  className="rounded-xl p-3"
                  style={{ backgroundColor: colors.surface }}
                >
                  <Text className="text-xs font-mono" style={{ color: colors.foreground }}>
                    {JSON.stringify(log.details, null, 2)}
                  </Text>
                </View>
              </View>
            )}

            {/* Stack-Trace */}
            {log.stack && (
              <View>
                <Text className="text-sm font-semibold mb-2" style={{ color: colors.foreground }}>
                  Stack-Trace
                </Text>
                <View
                  className="rounded-xl p-3"
                  style={{ backgroundColor: colors.surface }}
                >
                  <Text className="text-xs font-mono" style={{ color: colors.error }}>
                    {log.stack}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
