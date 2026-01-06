import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  fetchAddresses,
  Address,
} from "@/services/address-service";

// Add new address
export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      addressData: Omit<
        Address,
        "_id" | "customerId" | "createdAt" | "updatedAt"
      >
    ) => addAddress(addressData),
    onSuccess: () => {
      // Invalidate queries to trigger refetch for address list and (if used for user profile)
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
    onError: (error: unknown) => {
      // Optionally show error
      // toast.error(error instanceof Error ? error.message : "Failed to add address");
    },
  });
};

// Update existing address
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      addressId,
      addressData,
    }: {
      addressId: string;
      addressData: Partial<
        Omit<Address, "_id" | "customerId" | "createdAt" | "updatedAt">
      >;
    }) => updateAddress(addressId, addressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
    onError: (error: unknown) => {
      // Optionally show error
    },
  });
};

// Delete address
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
    onError: (error: unknown) => {
      // Optionally show error
    },
  });
};

// Mark address as default
export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => setDefaultAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
    onError: (error: unknown) => {
      // Optionally show error
    },
  });
};

// If needed: List addresses (for query list pattern)
import { useQuery } from "@tanstack/react-query";

export const useAddresses = () => {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
  });
};
