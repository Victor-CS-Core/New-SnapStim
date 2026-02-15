import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import mockSessionData from "../../product-plan/sections/sessions/data.json";
import type { Session } from "../../product-plan/sections/sessions/types";

export function useSessions(clientId?: string, programId?: string) {
    const { user } = useAuth();
    const userId = user?.uid || "device";

    return useQuery({
        queryKey: ["sessions", userId, clientId, programId],
        queryFn: async () => {
            try {
                const response = await api.listSessions(userId) as { sessions: Session[] };
                let sessions = response.sessions;

                // Apply filters if provided
                if (clientId) {
                    sessions = sessions.filter(s => s.client_id === clientId);
                }
                if (programId) {
                    sessions = sessions.filter(s => s.program_id === programId);
                }

                return sessions;
            } catch (error) {
                console.warn(
                    "Backend offline, using mock session data:",
                    error
                );
                let sessions = mockSessionData.sessions as Session[];

                // Apply filters if provided
                if (clientId) {
                    sessions = sessions.filter(s => s.client_id === clientId);
                }
                if (programId) {
                    sessions = sessions.filter(s => s.program_id === programId);
                }

                return sessions;
            }
        },
    });
}

export function useCreateSession() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const userId = user?.uid || "device";

    return useMutation({
        mutationFn: async (
            sessionData: Omit<Session, "session_id" | "start_time">
        ) => {
            // Backend doesn't have a saveSession endpoint yet
            const newSession: Session = {
                ...sessionData,
                session_id: crypto.randomUUID(),
                start_time: new Date().toISOString(),
            } as Session;

            console.warn(
                "Session save API not available, simulating local update"
            );
            return { ok: true, session: newSession };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sessions", userId] });
        },
    });
}

export function useUpdateSession() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const userId = user?.uid || "device";

    return useMutation({
        mutationFn: async (session: Session) => {
            console.warn(
                "Session update API not available, simulating local update"
            );
            return { ok: true, session };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sessions", userId] });
        },
    });
}

export function useExportSession() {
    const { user } = useAuth();
    const userId = user?.uid || "device";

    return useMutation({
        mutationFn: async (sessionData: any) => {
            return await api.exportSession({
                userId,
                ...sessionData,
            });
        },
    });
}

export function useDeleteSession() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const userId = user?.uid || "device";

    return useMutation({
        mutationFn: async (sessionId: string) => {
            console.warn(
                "Session delete API not available, simulating local delete"
            );
            return { ok: true, sessionId };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sessions", userId] });
        },
    });
}
