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
                // Backend doesn't have a listPrograms endpoint yet
                // Using mock data with optional client filtering
                console.warn(
                    "Programs API not available, using mock data"
                );
                const programs = mockProgramData.programs as Program[];
                
                if (clientId) {
                    return programs.filter(p => p.client_id === clientId);
                }
                
                return programs;
            } catch (error) {
                console.warn("Failed to load programs, using mock data:", error);
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
            // Simulate API call - backend doesn't have saveProgram endpoint yet
            const newProgram: Program = {
                ...programData,
                program_id: crypto.randomUUID(),
                created_date: new Date().toISOString(),
                last_modified_date: new Date().toISOString(),
            } as Program;

            console.warn(
                "Program save API not available, simulating local update"
            );
            return { ok: true, program: newProgram };
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

            console.warn(
                "Program update API not available, simulating local update"
            );
            return { ok: true, program: updated };
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
        mutationFn: async (programId: string) => {
            console.warn(
                "Program delete API not available, simulating local delete"
            );
            return { ok: true, programId };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["programs", userId] });
        },
    });
}
