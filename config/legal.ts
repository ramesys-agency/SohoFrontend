/**
 * Legal and policy documents.
 *
 * The canonical copy of every policy lives on the website — Apple requires the
 * Privacy Policy to be a public, login-free URL, and keeping a second copy in
 * the app would let the two drift apart. The app only links out.
 *
 * Set `EXPO_PUBLIC_LEGAL_BASE_URL` to the site root and every document below
 * resolves against it. Any single page can be repointed with its own variable
 * if the client hosts one somewhere else. While a URL is blank the link tells
 * the user it isn't available yet rather than opening a broken page.
 */
import * as WebBrowser from "expo-web-browser";
import { Alert } from "react-native";

const BASE = (process.env.EXPO_PUBLIC_LEGAL_BASE_URL ?? "").replace(/\/+$/, "");

/** An explicit override wins; otherwise fall back to base + path. */
const resolve = (override: string | undefined, path: string): string => {
  const explicit = override?.trim();
  if (explicit) return explicit;
  return BASE ? `${BASE}${path}` : "";
};

export interface LegalDocument {
  key: "privacy" | "terms" | "returns" | "shipping" | "cancellation";
  title: string;
  subtitle: string;
  url: string;
}

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    key: "privacy",
    title: "Privacy Policy",
    subtitle: "What we collect and how account deletion works",
    url: resolve(process.env.EXPO_PUBLIC_LEGAL_PRIVACY_URL, "/privacy"),
  },
  {
    key: "terms",
    title: "Terms of Service",
    subtitle: "The agreement you accept when you shop with us",
    url: resolve(process.env.EXPO_PUBLIC_LEGAL_TERMS_URL, "/terms"),
  },
  {
    key: "returns",
    title: "Return & Refund Policy",
    subtitle: "Return windows, conditions and how refunds are paid",
    url: resolve(process.env.EXPO_PUBLIC_LEGAL_RETURNS_URL, "/returns"),
  },
  {
    key: "shipping",
    title: "Shipping & Delivery Policy",
    subtitle: "Delivery areas, timelines and charges",
    url: resolve(process.env.EXPO_PUBLIC_LEGAL_SHIPPING_URL, "/shipping"),
  },
  {
    key: "cancellation",
    title: "Cancellation Policy",
    subtitle: "When and how an order can be cancelled",
    url: resolve(
      process.env.EXPO_PUBLIC_LEGAL_CANCELLATION_URL,
      "/cancellation",
    ),
  },
];

const byKey = (key: LegalDocument["key"]): LegalDocument => {
  const found = LEGAL_DOCUMENTS.find((doc) => doc.key === key);
  if (!found) throw new Error(`Unknown legal document: ${key}`);
  return found;
};

export const legalUrl = (key: LegalDocument["key"]): string => byKey(key).url;

/**
 * Opens a policy in an in-app browser so the customer keeps their place in the
 * app. Takes the key rather than a URL so a caller can't accidentally pass an
 * unresolved empty string past the guard.
 */
export const openLegalDocument = async (
  key: LegalDocument["key"],
): Promise<void> => {
  const doc = byKey(key);

  if (!doc.url) {
    Alert.alert(
      "Not available yet",
      `The ${doc.title} hasn't been published yet. Please contact support if you need a copy.`,
    );
    return;
  }

  try {
    await WebBrowser.openBrowserAsync(doc.url);
  } catch {
    Alert.alert("Couldn't open the page", "Please try again in a moment.");
  }
};

/** Name of the legal entity that owns the app, for the copyright line. */
export const LEGAL_ENTITY =
  process.env.EXPO_PUBLIC_LEGAL_ENTITY_NAME?.trim() || "Soho";

/** e.g. "© 2026 Soho Ltd." — App Store listings are expected to carry one. */
export const copyrightLine = (): string =>
  `© ${new Date().getFullYear()} ${LEGAL_ENTITY}`;
