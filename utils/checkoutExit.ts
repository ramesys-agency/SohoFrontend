import { router } from "expo-router";

/**
 * Where a customer lands when they bail out of checkout — because their stock
 * hold expired, items went short, or an order failed on stock.
 *
 * The two entry points need different destinations:
 *  - Cart flow (`_ctx` unset): they came from the wardrobe, so send them back
 *    to it to edit the cart and start again.
 *  - Buy-now flow (`_ctx === "checkout"`): there is no cart to return to. The
 *    useful move is the product page they bought from, where they can pick a
 *    different size or colour. If the product id didn't survive the params we
 *    fall back to the wardrobe rather than risk an unmatched route.
 */
export function exitCheckout(opts: {
  ctx?: string;
  buyNowProductId?: string;
}): void {
  const { ctx, buyNowProductId } = opts;

  if (ctx === "checkout") {
    if (buyNowProductId) {
      router.replace({
        pathname: "/product/[id]",
        params: { id: buyNowProductId },
      });
      return;
    }
    router.replace("/(tabs)/home");
    return;
  }

  router.replace("/(tabs)/wardrobe");
}

/** Label for the bail-out button, matching where `exitCheckout` will land. */
export function exitCheckoutLabel(ctx?: string): string {
  return ctx === "checkout" ? "Back to product" : "Back to cart";
}
