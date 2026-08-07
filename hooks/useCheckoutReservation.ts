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
 * Holds the customer's items while they work through checkout.
 *
 * The hold is taken when the screen mounts, ticked down locally, re-synced with
 * the server whenever the app comes back to the foreground (a backgrounded phone
 * stops firing timers, so the countdown would otherwise lie), and renewed while
 * the customer is still active. Releasing is the caller's decision — moving
 * forward to payment must keep the hold, only backing out gives it up.
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

  const release = useCallback(async () => {
    if (!checkoutId) return;
    try {
      await checkoutApi.release(checkoutId);
    } catch {
      // Nothing to do — the hold expires on its own within minutes.
    }
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

    const onChange = async (state: AppStateStatus) => {
      if (state !== "active") return;
      try {
        const status = await checkoutApi.status(checkoutId);
        setExpiresAt(status?.expiresAt ? new Date(status.expiresAt).getTime() : null);
      } catch {
        // Leave the local countdown alone if the check fails.
      }
    };

    const subscription = AppState.addEventListener("change", onChange);
    return () => subscription.remove();
  }, [checkoutId, enabled]);

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
