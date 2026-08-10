import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import {
  checkoutApi,
  type CheckoutShortage,
} from "@/api/checkout.api";

interface UseCheckoutReservationOptions {
  /** Buy-now checkout. Omit to hold the whole cart. */
  buyNow?: { variantId: string; quantity?: number } | undefined;
  /**
   * Adopt a hold taken by an earlier step instead of creating a new one — the
   * payment screen continues the countdown the checkout screen started.
   */
  existingCheckoutId?: string | undefined;
  /** Skip reserving entirely. */
  skip?: boolean;
}

export interface CheckoutReservation {
  checkoutId: string | null;
  /** False when the backend has reservations switched off — hide the countdown. */
  enabled: boolean;
  loading: boolean;
  secondsLeft: number;
  expired: boolean;
  /** Items that were already gone when we tried to hold them. */
  shortages: CheckoutShortage[];
  error: string | null;
  reserve: () => Promise<void>;
  release: () => Promise<void>;
}

/** Renew once the hold drops under a minute — early enough to survive a slow network. */
const RENEW_AT_SECONDS = 60;

/**
 * A screen leaving the stack and the next one adopting the same hold happen in
 * separate commits, so a hold is only really abandoned if nobody has claimed it
 * back a moment later.
 */
const RELEASE_GRACE_MS = 500;

interface HoldEntry {
  /** Mounted screens currently showing this hold. */
  holders: number;
  timer: ReturnType<typeof setTimeout> | null;
}

/**
 * Which holds are still on screen somewhere, across screens.
 *
 * Checkout and payment share one hold: checkout takes it, payment adopts it, and
 * the units must stay held for as long as the customer is on either. Ownership
 * therefore cannot live in a single screen — the one that took the hold blurs
 * the moment the customer moves on. Counting holders is what lets the hold
 * survive the handoff and still be given back the moment the customer leaves
 * the flow entirely.
 */
const activeHolds = new Map<string, HoldEntry>();

function retainHold(checkoutId: string): void {
  const entry = activeHolds.get(checkoutId) ?? { holders: 0, timer: null };
  // Somebody picked the hold back up inside the grace window — it isn't going
  // anywhere after all.
  if (entry.timer) {
    clearTimeout(entry.timer);
    entry.timer = null;
  }
  entry.holders += 1;
  activeHolds.set(checkoutId, entry);
}

function releaseHold(checkoutId: string): void {
  const entry = activeHolds.get(checkoutId);
  if (!entry) return;

  entry.holders = Math.max(0, entry.holders - 1);
  // Still on screen elsewhere (checkout, while the customer is on payment).
  if (entry.holders > 0) return;

  entry.timer = setTimeout(() => {
    activeHolds.delete(checkoutId);
    void checkoutApi.release(checkoutId).catch(() => {
      // Nothing to do — the hold expires on its own within minutes.
    });
  }, RELEASE_GRACE_MS);
}

function abandonHold(checkoutId: string): Promise<unknown> {
  const entry = activeHolds.get(checkoutId);
  if (entry?.timer) clearTimeout(entry.timer);
  activeHolds.delete(checkoutId);
  return checkoutApi.release(checkoutId);
}

/**
 * Holds the customer's items while they work through checkout.
 *
 * The hold is taken when the screen mounts, ticked down locally, re-synced with
 * the server whenever the app comes back to the foreground (a backgrounded phone
 * stops firing timers, so the countdown would otherwise lie), and renewed while
 * the customer is still active. It is given back automatically once no screen is
 * showing it any more, so moving between checkout and payment keeps the units
 * while leaving the flow hands them straight back.
 */
export function useCheckoutReservation(
  options: UseCheckoutReservationOptions = {}
): CheckoutReservation {
  const { buyNow, existingCheckoutId, skip } = options;

  const [checkoutId, setCheckoutId] = useState<string | null>(
    existingCheckoutId ?? null
  );
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(!skip);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [shortages, setShortages] = useState<CheckoutShortage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Strict Mode / re-render guard: one reserve per mount, not one per render.
  const reservingRef = useRef(false);
  const renewingRef = useRef(false);

  const applyHold = useCallback(
    (hold: { checkoutId: string | null; enabled: boolean; expiresAt: string | null }) => {
      setCheckoutId(hold.checkoutId);
      setEnabled(hold.enabled);
      setExpiresAt(hold.expiresAt ? new Date(hold.expiresAt).getTime() : null);
      setShortages([]);
      setError(null);
    },
    []
  );

  const reserve = useCallback(async () => {
    if (reservingRef.current) return;
    reservingRef.current = true;

    try {
      setLoading(true);
      const hold = await checkoutApi.reserve(buyNow ? { buyNow } : {});
      applyHold(hold);
    } catch (err: any) {
      const status = err?.response?.status;
      const payload = err?.response?.data;

      if (status === 409 && Array.isArray(payload?.data?.items)) {
        setShortages(payload.data.items);
        setError(payload?.error || "Some items are no longer available");
      } else {
        setError(
          payload?.error ||
            payload?.message ||
            "We couldn't hold your items. Please try again."
        );
      }
    } finally {
      setLoading(false);
      reservingRef.current = false;
    }
  }, [applyHold, buyNow]);

  /** Re-read the hold from the server — the only source that can't drift. */
  const syncFromServer = useCallback(async () => {
    if (!checkoutId) return;
    try {
      const status = await checkoutApi.status(checkoutId);
      setExpiresAt(status?.expiresAt ? new Date(status.expiresAt).getTime() : null);
    } catch {
      // Leave the local countdown alone if the check fails.
    }
  }, [checkoutId]);

  /**
   * Give the units back now, without waiting for the screens to unmount. Only
   * for an explicit bail-out — ordinary navigation is handled by the holder
   * count below.
   */
  const release = useCallback(async () => {
    if (!checkoutId) return;
    try {
      await abandonHold(checkoutId);
    } catch {
      // Nothing to do — the hold expires on its own within minutes.
    }
  }, [checkoutId]);

  // Keep the hold alive for as long as a screen is showing it. Checkout pushes
  // payment on top of itself, so both are mounted during the handoff and the
  // count never reaches zero mid-flow; popping out of checkout unmounts both and
  // the units go back immediately instead of sitting idle until the TTL lapses.
  useEffect(() => {
    if (!checkoutId) return;
    retainHold(checkoutId);
    return () => releaseHold(checkoutId);
  }, [checkoutId]);

  // Initial hold — either adopt the one the previous step took, or take a new one.
  useEffect(() => {
    if (skip) {
      setLoading(false);
      return;
    }

    if (existingCheckoutId) {
      void (async () => {
        try {
          const status = await checkoutApi.status(existingCheckoutId);
          setExpiresAt(status?.expiresAt ? new Date(status.expiresAt).getTime() : null);
        } catch {
          // Treat an unreadable hold as expired rather than pretending it's live.
          setExpiresAt(null);
        } finally {
          setLoading(false);
        }
      })();
      return;
    }

    void reserve();
    // Intentionally mount-only: re-reserving on every render would thrash the
    // hold and release the units the customer is already holding.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, existingCheckoutId]);

  // Local countdown
  useEffect(() => {
    if (!expiresAt) {
      setSecondsLeft(0);
      return;
    }

    const tick = () =>
      setSecondsLeft(Math.max(0, Math.round((expiresAt - Date.now()) / 1000)));

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  // Auto-renew while the customer is still working through checkout. The server
  // caps the total hold, so this cannot keep stock locked indefinitely.
  useEffect(() => {
    if (!checkoutId || !enabled) return;
    if (secondsLeft <= 0 || secondsLeft > RENEW_AT_SECONDS) return;
    if (renewingRef.current) return;

    renewingRef.current = true;
    void (async () => {
      try {
        const hold = await checkoutApi.renew(checkoutId);
        applyHold(hold);
      } catch {
        // Renewal refused (hold lapsed, or the cap was reached) — the countdown
        // runs out and the screen shows the expired state.
      } finally {
        renewingRef.current = false;
      }
    })();
  }, [applyHold, checkoutId, enabled, secondsLeft]);

  // A backgrounded app freezes timers, so trust the server on return.
  useEffect(() => {
    if (!checkoutId || !enabled) return;

    const onChange = (state: AppStateStatus) => {
      if (state !== "active") return;
      void syncFromServer();
    };

    const subscription = AppState.addEventListener("change", onChange);
    return () => subscription.remove();
  }, [checkoutId, enabled, syncFromServer]);

  // Same reason on the way back: while this screen sat behind payment its
  // countdown kept ticking against an expiry that payment may have renewed, so
  // re-read the hold rather than showing a number that is only going down.
  useFocusEffect(
    useCallback(() => {
      if (!checkoutId || !enabled) return;
      void syncFromServer();
    }, [checkoutId, enabled, syncFromServer])
  );

  return {
    checkoutId,
    enabled,
    loading,
    secondsLeft,
    expired: enabled && !!checkoutId && secondsLeft <= 0 && !loading,
    shortages,
    error,
    reserve,
    release,
  };
}
