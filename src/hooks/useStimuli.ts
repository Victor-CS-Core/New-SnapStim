import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import mockReviewData from "../../product-plan/sections/review/data.json";
import type { ReviewQueueItem } from "../../product-plan/sections/review/types";

export function useStimuli(programId?: string, status?: string) {
    const { user } = useAuth();
    const userId = user?.uid || "device";

    return useQuery({
        queryKey: ["stimuli", userId, programId, status],
        queryFn: async () => {
            try {
                // Backend doesn't have a listStimuli endpoint yet
                console.warn(
                    "Stimuli list API not available, using mock data"
                );
                let stimuli = mockReviewData.review_queue as ReviewQueueItem[];

                // Apply filters if provided
                if (programId) {
                    stimuli = stimuli.filter(s => s.program_id === programId);
                }
                if (status) {
                    stimuli = stimuli.filter(s => s.review_status === status);
                }

                return stimuli;
            } catch (error) {
                console.warn("Failed to load stimuli, using mock data:", error);
                let stimuli = mockReviewData.review_queue as ReviewQueueItem[];

                // Apply filters if provided
                if (programId) {
                    stimuli = stimuli.filter(s => s.program_id === programId);
                }
                if (status) {
                    stimuli = stimuli.filter(s => s.review_status === status);
                }

                return stimuli;
            }
        },
    });
}

export function useGenerateStimulus() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const userId = user?.uid || "device";

    return useMutation({
        mutationFn: async (data: {
            programType: string;
            programId?: string;
            programName?: string;
            description?: string;
            customPrompt?: string;
            fields?: Record<string, any>;
        }) => {
            // Build fields object for backend
            const fields: Record<string, any> = {
                userId,
                programId: data.programId,
                title: data.programName,
                description: data.description,
                ...data.fields,
            };

            return await api.generateStimulus({
                programType: data.programType,
                fields,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stimuli", userId] });
        },
    });
}

export function useSubmitReview() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const userId = user?.uid || "device";

    return useMutation({
        mutationFn: async (reviewData: {
            stimulusId: string;
            status: "approved" | "rejected";
            feedback?: string;
        }) => {
            return await api.submitReview({
                userId,
                ...reviewData,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stimuli", userId] });
        },
    });
}

export function useUpdateStimulus() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const userId = user?.uid || "device";

    return useMutation({
        mutationFn: async (stimulus: ReviewQueueItem) => {
            console.warn(
                "Stimulus update API not available, simulating local update"
            );
            return { ok: true, stimulus };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stimuli", userId] });
        },
    });
}

export function useDeleteStimulus() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const userId = user?.uid || "device";

    return useMutation({
        mutationFn: async (stimulusId: string) => {
            console.warn(
                "Stimulus delete API not available, simulating local delete"
            );
            return { ok: true, stimulusId };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stimuli", userId] });
        },
    });
}
