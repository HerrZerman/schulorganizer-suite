/**
 * Hefte-Galerie Screen
 * 
 * Zeigt fotografierte Schulhefte aller Kinder an.
 * Eltern können Hefte anschauen und Notizen hinzufügen.
 * 
 * Features:
 * - Grid-Ansicht mit Foto-Previews
 * - Filter nach Kind und Fach
 * - Detail-Ansicht mit großem Foto
 * - Notizen für Eltern
 */

import { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";

import { ScreenContainer } from "@/components/screen-container";
import type { NoteEntry, Child, SubjectType, NoteWithChild } from "@/types/models";
import { SUBJECTS } from "@/types/models";
import { loadNotes, loadChildren, updateNote } from "@/lib/storage";
import { useColors } from "@/hooks/use-colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 Spalten mit Padding

export default function HefteScreen() {
  const colors = useColors();
  const [notes, setNotes] = useState<NoteWithChild[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | "all">("all");
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | "all">("all");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteWithChild | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Daten laden
  const loadData = async () => {
    try {
      const [notesData, childrenData] = await Promise.all([loadNotes(), loadChildren()]);

      // Hefte mit Kind-Info kombinieren
      const notesWithChild: NoteWithChild[] = notesData
        .map((note) => {
          const child = childrenData.find((c) => c.id === note.childId);
          if (!child) return null;
          return { ...note, child };
        })
        .filter((n): n is NoteWithChild => n !== null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setNotes(notesWithChild);
      setChildren(childrenData);
    } catch (error) {
      console.error("Fehler beim Laden der Hefte:", error);
    }
  };

  // Initial laden
  useEffect(() => {
    loadData();
  }, []);

  // Neu laden wenn Screen fokussiert wird
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // Pull-to-Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Hefte filtern
  const getFilteredNotes = () => {
    return notes.filter((note) => {
      const childMatch = selectedChildId === "all" || note.childId === selectedChildId;
      const subjectMatch = selectedSubject === "all" || note.subject === selectedSubject;
      return childMatch && subjectMatch;
    });
  };

  // Heft öffnen
  const handleOpenNote = (note: NoteWithChild) => {
    setSelectedNote(note);
    setShowDetailModal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Datum formatieren
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filteredNotes = getFilteredNotes();

  // Fächer für Filter (nur die, die auch Hefte haben)
  const availableSubjects = Array.from(new Set(notes.map((n) => n.subject)));

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b" style={{ borderBottomColor: colors.border }}>
        <Text className="text-2xl font-bold" style={{ color: colors.foreground }}>
          Hefte
        </Text>
        <Text className="text-sm mt-1" style={{ color: colors.muted }}>
          Fotografierte Schulhefte anzeigen
        </Text>

        {/* Filter nach Kind */}
        {children.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 -mx-2">
            <View className="flex-row gap-2 px-2">
              <TouchableOpacity
                className="rounded-full px-4 py-2"
                style={{
                  backgroundColor: selectedChildId === "all" ? colors.primary : colors.surface,
                  borderWidth: 1,
                  borderColor: selectedChildId === "all" ? colors.primary : colors.border,
                }}
                onPress={() => {
                  setSelectedChildId("all");
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{
                    color: selectedChildId === "all" ? "#FFFFFF" : colors.foreground,
                  }}
                >
                  Alle Kinder
                </Text>
              </TouchableOpacity>

              {children.map((child) => (
                <TouchableOpacity
                  key={child.id}
                  className="rounded-full px-4 py-2 flex-row items-center gap-2"
                  style={{
                    backgroundColor: selectedChildId === child.id ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor: selectedChildId === child.id ? colors.primary : colors.border,
                  }}
                  onPress={() => {
                    setSelectedChildId(child.id);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text className="text-base">{child.avatar}</Text>
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: selectedChildId === child.id ? "#FFFFFF" : colors.foreground,
                    }}
                  >
                    {child.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {/* Filter nach Fach */}
        {availableSubjects.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2 -mx-2">
            <View className="flex-row gap-2 px-2">
              <TouchableOpacity
                className="rounded-full px-4 py-2"
                style={{
                  backgroundColor: selectedSubject === "all" ? colors.primary : colors.surface,
                  borderWidth: 1,
                  borderColor: selectedSubject === "all" ? colors.primary : colors.border,
                }}
                onPress={() => {
                  setSelectedSubject("all");
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{
                    color: selectedSubject === "all" ? "#FFFFFF" : colors.foreground,
                  }}
                >
                  Alle Fächer
                </Text>
              </TouchableOpacity>

              {availableSubjects.map((subject) => (
                <TouchableOpacity
                  key={subject}
                  className="rounded-full px-4 py-2 flex-row items-center gap-2"
                  style={{
                    backgroundColor: selectedSubject === subject ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor: selectedSubject === subject ? colors.primary : colors.border,
                  }}
                  onPress={() => {
                    setSelectedSubject(subject);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text className="text-base">{SUBJECTS[subject].icon}</Text>
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: selectedSubject === subject ? "#FFFFFF" : colors.foreground,
                    }}
                  >
                    {SUBJECTS[subject].label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="p-6">
          {filteredNotes.length === 0 ? (
            <View
              className="rounded-2xl p-6 items-center"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-base text-center" style={{ color: colors.muted }}>
                Keine Hefte gefunden.
                {(selectedChildId !== "all" || selectedSubject !== "all") &&
                  "\n\nÄndere die Filter um mehr Hefte zu sehen."}
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-3">
              {filteredNotes.map((note) => (
                <TouchableOpacity
                  key={note.id}
                  className="rounded-2xl overflow-hidden border"
                  style={{
                    width: CARD_WIDTH,
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }}
                  onPress={() => handleOpenNote(note)}
                  activeOpacity={0.7}
                >
                  {/* Foto-Preview */}
                  <View style={{ height: CARD_WIDTH * 1.2, backgroundColor: colors.border }}>
                    <Image
                      source={{ uri: note.photoUri }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  </View>

                  {/* Info */}
                  <View className="p-3">
                    {/* Kind */}
                    <View className="flex-row items-center gap-1 mb-1">
                      <Text className="text-sm">{note.child.avatar}</Text>
                      <Text className="text-xs font-semibold" style={{ color: colors.foreground }}>
                        {note.child.name}
                      </Text>
                    </View>

                    {/* Fach */}
                    <View className="flex-row items-center gap-1 mb-1">
                      <Text className="text-sm">{SUBJECTS[note.subject].icon}</Text>
                      <Text className="text-xs font-semibold" style={{ color: colors.foreground }}>
                        {SUBJECTS[note.subject].label}
                      </Text>
                    </View>

                    {/* Datum */}
                    <Text className="text-xs mb-2" style={{ color: colors.muted }}>
                      {formatDate(note.date)}
                    </Text>

                    {/* Thema */}
                    <Text
                      className="text-sm font-semibold"
                      numberOfLines={2}
                      style={{ color: colors.foreground }}
                    >
                      {note.topic}
                    </Text>

                    {/* Status */}
                    <View className="mt-2">
                      {note.understood ? (
                        <Text className="text-xs font-semibold" style={{ color: colors.success }}>
                          ✓ Verstanden
                        </Text>
                      ) : (
                        <Text className="text-xs font-semibold" style={{ color: colors.warning }}>
                          ⚠️ Schwierig
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Detail Modal */}
      <NoteDetailModal
        visible={showDetailModal}
        note={selectedNote}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedNote(null);
        }}
        onUpdate={async () => {
          await loadData();
        }}
      />
    </ScreenContainer>
  );
}

// ============================================
// HEFT DETAIL MODAL
// ============================================

interface NoteDetailModalProps {
  visible: boolean;
  note: NoteWithChild | null;
  onClose: () => void;
  onUpdate: () => void;
}

function NoteDetailModal({ visible, note, onClose, onUpdate }: NoteDetailModalProps) {
  const colors = useColors();
  const [parentNote, setParentNote] = useState("");

  useEffect(() => {
    if (note) {
      setParentNote(note.parentNote || "");
    }
  }, [note]);

  const handleSaveNote = async () => {
    if (!note) return;

    try {
      await updateNote(note.id, {
        parentNote: parentNote.trim() || undefined,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onUpdate();
      Alert.alert("Gespeichert", "Notiz wurde gespeichert.");
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      Alert.alert("Fehler", "Notiz konnte nicht gespeichert werden.");
    }
  };

  if (!note) return null;

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

          <TouchableOpacity onPress={handleSaveNote}>
            <Text className="text-base font-semibold" style={{ color: colors.primary }}>
              Speichern
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          <View className="p-6 gap-4">
            {/* Foto (groß) */}
            <View
              className="rounded-2xl overflow-hidden"
              style={{ aspectRatio: 3 / 4, backgroundColor: colors.border }}
            >
              <Image
                source={{ uri: note.photoUri }}
                style={{ width: "100%", height: "100%" }}
                contentFit="contain"
              />
            </View>

            {/* Metadaten */}
            <View
              className="rounded-2xl p-4"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-row items-center gap-2 mb-2">
                <Text className="text-2xl">{note.child.avatar}</Text>
                <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                  {note.child.name}
                </Text>
                <Text className="text-sm" style={{ color: colors.muted }}>
                  | Klasse {note.child.grade}
                </Text>
              </View>

              <View className="flex-row items-center gap-2 mb-2">
                <Text className="text-xl">{SUBJECTS[note.subject].icon}</Text>
                <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                  {SUBJECTS[note.subject].label}
                </Text>
              </View>

              <Text className="text-sm mb-2" style={{ color: colors.muted }}>
                📅 {new Date(note.date).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </Text>

              <Text className="text-lg font-bold mb-2" style={{ color: colors.foreground }}>
                {note.topic}
              </Text>

              <View className="flex-row items-center gap-4">
                {note.understood ? (
                  <Text className="text-sm font-semibold" style={{ color: colors.success }}>
                    ✓ Verstanden
                  </Text>
                ) : (
                  <Text className="text-sm font-semibold" style={{ color: colors.warning }}>
                    ⚠️ Schwierig
                  </Text>
                )}

                <Text className="text-sm" style={{ color: colors.muted }}>
                  Sterne verdient: +{note.starsEarned} ⭐
                </Text>
              </View>
            </View>

            {/* Notizen für Eltern */}
            <View>
              <Text className="text-base font-semibold mb-2" style={{ color: colors.foreground }}>
                Notizen (optional)
              </Text>
              <TextInput
                className="rounded-2xl p-4 text-base"
                style={{
                  backgroundColor: colors.surface,
                  color: colors.foreground,
                  borderWidth: 1,
                  borderColor: colors.border,
                  minHeight: 120,
                }}
                placeholder="Z.B. 'Nochmal üben' oder 'Sehr gut!'"
                placeholderTextColor={colors.muted}
                value={parentNote}
                onChangeText={setParentNote}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
