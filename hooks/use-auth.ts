"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserProfile,
  updateUserProfile,
  type User,
} from "@/services/auth-service";
import { useRouter } from "next/navigation";

// Fetch current user profile (null if guest)
export const useUserProfile = () => {
  return useQuery<User | null>({
    queryKey: ["auth", "me"],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5,
    retry: 0,
    placeholderData: (prev) => prev,
  });
};

// Helper: Is the user authenticated (not guest/anonymous)
export const isAuthenticated = (user?: User | null): boolean =>
  !!user && !!user._id && user._id !== "guest";

// Log out/reset auth
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
      }
      return null;
    },
    onSuccess: () => {
      queryClient.setQueryData<User | null>(["auth", "me"], null);
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "list"] });
      router.push("/");
    },
  });
};

// Profile update
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Accepts only backend-valid fields
    mutationFn: async (
      payload: Partial<{ fullName: string; email: string; mobile: string }>
    ) => updateUserProfile(payload),
    onSuccess: (user) => {
      queryClient.setQueryData<User | null>(["auth", "me"], user);
    },
  });
};
