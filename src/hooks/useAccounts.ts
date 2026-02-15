import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "../../product-plan/sections/accounts/types";

/**
 * Hook to fetch all users (with optional filters)
 */
export function useUsers(filters?: { role?: string; status?: string; search?: string }) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: async () => {
      try {
        const response = await api.listUsers(filters) as { ok: boolean; users: User[] };
        return response.users;
      } catch (error) {
        console.warn("Backend offline or error fetching users:", error);
        // Return empty array instead of mock data for now
        return [] as User[];
      }
    },
  });
}

/**
 * Hook to get a single user by ID
 */
export function useUser(userId: string | null) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) return null;
      try {
        const response = await api.getUser(userId) as { ok: boolean; user: User };
        return response.user;
      } catch (error) {
        console.warn(`Error fetching user ${userId}:`, error);
        return null;
      }
    },
    enabled: !!userId,
  });
}

/**
 * Hook to create/save a user
 */
export function useSaveUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: Partial<User>) => {
      const userId = userData.id || `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        const response = await api.saveUser(userId, userData) as { ok: boolean; user: User };
        return response.user;
      } catch (error) {
        console.error("Error saving user:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

/**
 * Hook to update an existing user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<User> }) => {
      try {
        const response = await api.updateUser(userId, updates) as { ok: boolean; user: User };
        return response.user;
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
    },
  });
}

/**
 * Hook to delete (deactivate) a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      try {
        const response = await api.deleteUser(userId);
        return response;
      } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

/**
 * Hook to invite a new user
 */
export function useInviteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteData: { email: string; role: string; name: string }) => {
      try {
        const response = await api.inviteUser(inviteData);
        return response;
      } catch (error) {
        console.error("Error inviting user:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
