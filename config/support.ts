/**
 * Customer support contact details.
 *
 * Returns are handled over WhatsApp: the customer taps "Request a Return" on a
 * delivered order, which opens a chat pre-filled with their order number, and an
 * admin then records the return in the dashboard. Set the values below via
 * `.env` so they can change without a code release.
 *
 * Digits only, with country code and no "+" or spaces — that is the format
 * wa.me expects (e.g. Bangladesh: 8801XXXXXXXXX).
 */
export const SUPPORT = {
  whatsappNumber: process.env.EXPO_PUBLIC_SUPPORT_WHATSAPP ?? "",
  phoneNumber: process.env.EXPO_PUBLIC_SUPPORT_PHONE ?? "",
  email: process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? "sohoadminbd@gmail.com",
  hours: "10 AM - 8 PM",
};

/** Strips "+", spaces and dashes — wa.me rejects anything but digits. */
const digitsOnly = (value: string) => value.replace(/[^\d]/g, "");

export const whatsappUrl = (message?: string): string | null => {
  const number = digitsOnly(SUPPORT.whatsappNumber);
  if (!number) return null;

  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${query}`;
};

export const phoneUrl = (): string | null => {
  const number = digitsOnly(SUPPORT.phoneNumber);
  return number ? `tel:+${number}` : null;
};

export const emailUrl = (subject?: string): string | null => {
  if (!SUPPORT.email) return null;
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${SUPPORT.email}${query}`;
};

/** The message that opens when a customer asks to return an order. */
export const returnRequestMessage = (
  orderReference: string,
  itemNames?: string[],
): string => {
  const items =
    itemNames && itemNames.length > 0
      ? `\n\nItems: ${itemNames.slice(0, 5).join(", ")}`
      : "";

  return `Hi Soho, I'd like to return my order #${orderReference}.${items}\n\nReason: `;
};
