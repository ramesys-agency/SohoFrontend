import React from "react";
import { Image, StyleProp, ImageStyle } from "react-native";

// Every logo asset is derived from assets/images/Soho1024x1024.png. This cut has
// the brand's white background baked in, so only place it on white surfaces —
// assets/images/notification-icon.png is the transparent cut if one is needed.
const SOHO_LOGO = require("@/assets/images/soho.png");

// Intrinsic size of the artwork. Callers give a width and the height follows,
// so the wordmark can never end up stretched.
const ASPECT_RATIO = 705 / 288;

interface LogoProps {
  /** Rendered width in points. */
  width: number;
  style?: StyleProp<ImageStyle>;
}

const Logo: React.FC<LogoProps> = ({ width, style }) => (
  <Image
    source={SOHO_LOGO}
    accessibilityRole="image"
    accessibilityLabel="Soho"
    resizeMode="contain"
    style={[{ width, height: width / ASPECT_RATIO }, style]}
  />
);

export default Logo;
