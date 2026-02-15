import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import mockProgramData from "../../product-plan/sections/programs/data.json";
import type { Program } from "../../product-plan/sections/programs/types";

export function usePrograms(clientId?: string) {
    const { user } = useAuth();
    const userId = user?.uid || "device";

    return useQuery({
        queryKey: ["programs", userId, clientId],
        queryFn: async () => {
            try {
                const response = await api.listPrograms(userId, clientId) as { programs: Program[] };
                return response.programs || [];
            } catch (error) {
                console.warn("Backend offline, using mock program data:", error);
                const programs = mockProgramData.programs as Program[];
                
                if (clientId) {
                    return programs.filter(p => p.client_id === clientId);
                }
                
                return programs;
            }
        },
    });
}

export function useGenerateProgram() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const userId = user?.uid || "device";

    return useMutation({
        mutationFn: async (programData: {
            programName: string;
            programType: string;
            clientId: string;
            description?: string;
        }) => {
            return await api.generateProgram({
                userId,
                ...programData,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["programs", userId] });
        },
    });
}

export function useCreateProgram() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const userId = user?.uid || "device";

    return useMutation({
        mutationFn: async (
            programData: Omit<
                Program,
                "program_id" | "created_date" | "last_modified_date"
            >
        ) => {
            // Create program with generated ID and timestamps
            const newProgram: Program = {
                ...programData,
                program_id: crypto.randomUUID(),
                created_date: new Date().toISOString(),
                last_modified_date: new Date().toISOString(),
            } as Program;

            try {
                const response = await api.saveProgram(userId, newProgram);
                return response;
            } catch (error) {
                console.warn("Backend offline, program not saved:", error);
                // Return simulated response for offline mode
                return { ok: true, program: newProgram };
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["programs", userId] });
        },
    });
}

export function useUpdateProgram() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const userId = user?.uid || "device";

    return useMutation({
        mutationFn: async (program: Program) => {
            const updated = {
                ...program,
                last_modified_date: new Date().toISOString(),
            };

            try {
                const response = await api.updateProgram(userId, updated);
                return response;
            } catch (error) {
                console.warn("Backend offline, program not updated:", error);
                return { ok: true, program: updated };
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["programs", userId] });
        },
    });
}

export function useDeleteProgram() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const userId = user?.uid || "device";

    return useMutation({
        mutationFn: async (data: { programId: string; clientId: string }) => {
            try {
                const response = await api.deleteProgram(userId, data.programId, data.clientId);
                return response;
            } catch (error) {
                console.warn("Backend offline, program not deleted:", error);
                return { ok: true, programId: data.programId };
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["programs", userId] });
        },
    });
}
