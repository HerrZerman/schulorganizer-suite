// Icon-Mappings für SternWerk Elternapp
// Fallback für MaterialIcons auf Android und Web

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols zu Material Icons Mappings
 * - Material Icons: https://icons.expo.fyi
 * - SF Symbols: https://developer.apple.com/sf-symbols/
 */
const MAPPING = {
  // Tab Bar Icons
  "house.fill": "home", // Dashboard
  "checkmark.circle.fill": "check-circle", // Freigaben
  "pencil": "edit", // Aufgaben
  "book.fill": "menu-book", // Hefte
  "person.fill": "person", // Profil

  // Utility Icons
  "plus": "add",
  "gear": "settings",
  "magnifyingglass": "search",
  "star.fill": "star",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "xmark": "close",
  "ellipsis.circle": "more-horiz",
} as IconMapping;

/**
 * Icon-Komponente mit SF Symbols (iOS) und Material Icons (Android/Web)
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
