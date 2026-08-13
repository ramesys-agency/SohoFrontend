import { addressApi } from "@/api/address.api";
import {
  checkoutApi,
  type DeliveryRegion,
  type DeliveryRegionOption,
} from "@/api/checkout.api";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";

/** Rates change rarely; five minutes keeps every screen quoting the same number. */
const FEE_STALE_TIME = 5 * 60 * 1000;

/**
 * The delivery rate per region, as published by the server. Nothing here is
 * hardcoded on purpose: the fee the app displays and the fee the order is
 * charged have to come from the same place or they drift.
 */
export function useDeliveryRegions() {
  const { data, isLoading } = useQuery({
    queryKey: ["checkoutConfig"],
    queryFn: checkoutApi.getConfig,
    staleTime: FEE_STALE_TIME,
  });

  const regions: DeliveryRegionOption[] = data?.deliveryRegions ?? [];

  return {
    regions,
    currency: data?.currency ?? "BDT",
    isLoading,
    feeFor: (region: DeliveryRegion) =>
      regions.find((option) => option.region === region)?.fee,
  };
}

/**
 * What delivery will cost for the address the customer would ship to by default
 * — the region is resolved server-side from that address, so screens that show a
 * total before checkout show the total checkout will charge. Returns `undefined`
 * for a customer with no saved address yet; there is no region to price then.
 */
export function useDefaultAddressDeliveryFee() {
  // Both calls need a session. Asking as a guest would 401, and a 401 with no
  // refresh token to spend logs the app out — the product page must not do that.
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: addressResponse, isLoading: isLoadingAddresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: addressApi.getAddresses,
    enabled: isAuthenticated,
    staleTime: FEE_STALE_TIME,
  });

  const addresses: any[] = addressResponse?.data ?? [];
  // Same choice the checkout address step makes, so the two agree.
  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

  const { data, isLoading: isLoadingFee } = useQuery({
    queryKey: ["deliveryFee", defaultAddress?.id],
    queryFn: () => checkoutApi.getDeliveryFee(defaultAddress.id),
    enabled: !!defaultAddress?.id,
    staleTime: FEE_STALE_TIME,
  });

  return {
    deliveryFee: data,
    hasAddress: !!defaultAddress?.id,
    isLoading:
      isAuthenticated &&
      (isLoadingAddresses || (!!defaultAddress?.id && isLoadingFee)),
  };
}
