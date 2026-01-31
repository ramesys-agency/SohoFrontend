// Fallback for using Ionicons on Android and web.
import Ionicons from "@expo/vector-icons/Ionicons";
import { SymbolWeight } from "expo-symbols";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Ionicons mappings here.
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "paper-plane",
  "chevron.left.forwardslash.chevron.right": "code-slash",
  "chevron.right": "chevron-forward",
  "square.grid.2x2.fill": "grid",
  "cart.fill": "bag-handle",
  "heart.fill": "heart",
  "person.fill": "person",
  "chevron.left": "chevron-back",
  "checkmark.circle.fill": "checkmark-circle",
} as const;

/**
 * An icon component that uses native SF Symbols on iOS, and Ionicons on Android and web.
 * This ensures a consistent look across platforms.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  focused,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
  focused?: boolean;
}) {
  const iconBaseName = MAPPING[name];
  const iconName = focused ? iconBaseName : `${iconBaseName}-outline`;

  return (
    <Ionicons color={color} size={size} name={iconName as any} style={style} />
  );
}
