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
  "chevron.down": "chevron-down",
  "chevron.up": "chevron-up",
  "checkmark.circle.fill": "checkmark-circle",
  "arrow.down.right": "arrow-forward",
  trash: "trash",
  minus: "remove",
  plus: "add",
  pencil: "create",
  "list.bullet": "list",
  "doc.text": "document-text",
  "arrow.counterclockwise": "refresh",
  creditcard: "card",
  map: "location",
  bell: "notifications",
  moon: "moon",
  "rectangle.portrait.and.arrow.right": "log-out",
  person: "person",
  "person.2": "people",
  phone: "call",
  envelope: "mail",
  "figure.stand": "body",
  "square.and.pencil": "create",
  eye: "eye",
  "eye.slash": "eye-off",
  "exclamationmark.circle.fill": "alert-circle",
  "apple.logo": "logo-apple",
  "google.logo": "logo-google",
  "facebook.logo": "logo-facebook",
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
  const iconName =
    focused || iconBaseName.startsWith("logo-")
      ? iconBaseName
      : `${iconBaseName}-outline`;

  return (
    <Ionicons
      color={color}
      size={size}
      name={iconName as any}
      style={[
        name === "arrow.down.right" ? { transform: [{ rotate: "45deg" }] } : {},
        style,
      ]}
    />
  );
}
