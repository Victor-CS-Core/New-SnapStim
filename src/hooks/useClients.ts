import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import mockClientData from "../../product-plan/sections/clients/data.json";
import type { Client } from "../../product-plan/sections/clients/types";

export function useClients() {
    const { user } = useAuth();
    const userId = user?.uid || "device";

    return useQuery({
        queryKey: ["clients", userId],
        queryFn: async () => {
            try {
                const response = await api.listClients(userId);
                return response.clients as Client[];
            } catch (error) {
                console.warn("Backend offline, using mock data:", error);
                return mockClientData.clients as Client[];
            }
        },
    });
}

export function useCreateClient() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const userId = user?.uid || "device";

    return useMutation({
        mutationFn: async (
            clientData: Omit<
                Client,
                "client_id" | "createdAt" | "updatedAt" | "isActive"
            >,
        ) => {
            const newClient: Client = {
                ...clientData,
                client_id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isActive: true,
            } as Client;
            return await api.saveClient(userId, newClient);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients", userId] });
        },
    });
}

export function useUpdateClient() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const userId = user?.uid || "device";

    return useMutation({
        mutationFn: async (client: Client) => {
            const updated = {
                ...client,
                updatedAt: new Date().toISOString(),
            };
            return await api.saveClient(userId, updated);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients", userId] });
        },
    });
}

export function useDeleteClient() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const userId = user?.uid || "device";

    return useMutation({
        mutationFn: async (clientId: string) => {
            return await api.deleteClient(userId, clientId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients", userId] });
        },
    });
}
