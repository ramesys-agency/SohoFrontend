import { secureStorage } from "./secureStore";

const KEY = "soho_recent_searches";
const MAX_ENTRIES = 8;

/**
 * The last few things this shopper searched for, so the search screen opens
 * with something useful instead of an empty page. Stored on the device only.
 */
export const recentSearches = {
  async list(): Promise<string[]> {
    try {
      const raw = await secureStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed)
        ? parsed.filter((term): term is string => typeof term === "string")
        : [];
    } catch {
      // A corrupt or unreadable list is not worth failing a search over.
      return [];
    }
  },

  async add(term: string): Promise<string[]> {
    const trimmed = term.trim();
    if (!trimmed) return await recentSearches.list();

    const existing = await recentSearches.list();
    // Re-searching an old term moves it to the front rather than duplicating it.
    const next = [
      trimmed,
      ...existing.filter((t) => t.toLowerCase() !== trimmed.toLowerCase()),
    ].slice(0, MAX_ENTRIES);

    await recentSearches.save(next);
    return next;
  },

  async remove(term: string): Promise<string[]> {
    const next = (await recentSearches.list()).filter((t) => t !== term);
    await recentSearches.save(next);
    return next;
  },

  async clear(): Promise<void> {
    await recentSearches.save([]);
  },

  async save(terms: string[]): Promise<void> {
    try {
      await secureStorage.setItem(KEY, JSON.stringify(terms));
    } catch {
      // Losing the history is harmless; the search itself still works.
    }
  },
};
