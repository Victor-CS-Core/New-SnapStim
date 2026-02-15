import { useQuery } from "@tanstack/react-query";
import reportingData from "../../product-plan/sections/reporting/data.json";
import type {
    DashboardMetrics,
    ExportJob,
    ReportTemplate,
    ScheduledExport,
} from "../../product-plan/sections/reporting/types";
import { useSessions } from "./useSessions";
import { usePrograms } from "./usePrograms";
import type { Session } from "../../product-plan/sections/sessions/types";
import type { Program } from "../../product-plan/sections/programs/types";

/**
 * Hook to fetch dashboard metrics
 * Returns aggregated analytics data calculated from real session and program data
 */
export function useDashboardMetrics() {
  const { data: allSessions = [] } = useSessions();
  const { data: allPrograms = [] } = usePrograms();

  return useQuery({
    queryKey: ["dashboardMetrics", allSessions.length, allPrograms.length],
    queryFn: async () => {
      // Calculate metrics from real data
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // Sessions this month
      const sessionsThisMonth = allSessions.filter(
        (s: Session) => new Date(s.start_time) >= thisMonth
      );

      // All completed trials across all sessions
      const allTrials = allSessions.flatMap((s: Session) => s.trials || []);
      const completedTrials = allTrials.filter(
        (t) => t.response === "correct" || t.response === "incorrect" || t.response === "prompted"
      );
      
      // Average accuracy
      const correctTrials = allTrials.filter((t) => t.response === "correct");
      const averageAccuracy = completedTrials.length > 0
        ? Math.round((correctTrials.length / completedTrials.length) * 100)
        : 0;

      // Programs at mastery (100% accuracy in last 3 sessions)
      const programsAtMastery = allPrograms.filter((p: Program) => {
        const programSessions = allSessions
          .filter((s: Session) => s.program_id === p.program_id && s.status === "completed")
          .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
          .slice(0, 3);
        
        if (programSessions.length === 0) return false;
        
        const recentTrials = programSessions.flatMap((s: Session) => s.trials || []);
        const recentCorrect = recentTrials.filter((t) => t.response === "correct").length;
        const recentTotal = recentTrials.length;
        
        return recentTotal > 0 && (recentCorrect / recentTotal) >= (p.mastery_threshold || 80) / 100;
      });

      // Active programs
      const activePrograms = allPrograms.filter((p: Program) => p.status === "active");

      const metrics: DashboardMetrics = {
        total_sessions_this_month: sessionsThisMonth.length,
        average_accuracy_all_programs: averageAccuracy,
        programs_at_mastery: programsAtMastery.length,
        active_programs: activePrograms.length,
        total_comments_unread: 0,
        reports_generated_this_month: 0,
        scheduled_exports_active: 0,
      };

      return metrics;
    },
  });
}

/**
 * Hook to fetch report templates
 * Returns available report templates for generation
 */
export function useReportTemplates() {
  return useQuery({
    queryKey: ["reportTemplates"],
    queryFn: async () => {
      // In a real app, this would fetch from the backend
      console.warn("Backend endpoint for report templates not yet implemented - using mock data");
      return reportingData.reportTemplates as ReportTemplate[];
    },
  });
}

/**
 * Hook to fetch export jobs
 * Returns history of data export jobs
 */
export function useExportJobs() {
  return useQuery({
    queryKey: ["exportJobs"],
    queryFn: async () => {
      // In a real app, this would fetch from the backend
      console.warn("Backend endpoint for export jobs not yet implemented - using mock data");
      return reportingData.exportJobs as ExportJob[];
    },
  });
}

/**
 * Hook to fetch scheduled exports
 * Returns list of scheduled/recurring exports
 */
export function useScheduledExports() {
  return useQuery({
    queryKey: ["scheduledExports"],
    queryFn: async () => {
      // In a real app, this would fetch from the backend
      console.warn("Backend endpoint for scheduled exports not yet implemented - using mock data");
      return reportingData.scheduledExports as ScheduledExport[];
    },
  });
}

/**
 * Hook to calculate accuracy trends over time
 * Groups sessions by week and calculates accuracy per program
 */
export function useAccuracyTrends() {
  const { data: allSessions = [] } = useSessions();
  const { data: allPrograms = [] } = usePrograms();

  return useQuery({
    queryKey: ["accuracyTrends", allSessions.length],
    queryFn: async () => {
      // Get last 4 weeks of data
      const now = new Date();
      const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
      
      const recentSessions = allSessions.filter(
        (s: Session) => new Date(s.start_time) >= fourWeeksAgo && s.status === "completed"
      );

      // Group by week
      const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      const weekBuckets = Array(4).fill(null).map(() => new Date());
      
      for (let i = 0; i < 4; i++) {
        weekBuckets[i] = new Date(fourWeeksAgo.getTime() + i * 7 * 24 * 60 * 60 * 1000);
      }

      // Calculate accuracy per program per week
      const topPrograms = allPrograms.slice(0, 2); // Top 2 programs
      const datasets = topPrograms.map((program: Program, idx) => {
        const colors = ["#10b981", "#6366f1", "#f59e0b", "#ef4444"];
        const weeklyAccuracy = weekLabels.map((_, weekIdx) => {
          const weekStart = weekBuckets[weekIdx];
          const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
          
          const weekSessions = recentSessions.filter(
            (s: Session) => 
              s.program_id === program.program_id &&
              new Date(s.start_time) >= weekStart &&
              new Date(s.start_time) < weekEnd
          );
          
          const weekTrials = weekSessions.flatMap((s: Session) => s.trials || []);
          const correct = weekTrials.filter((t) => t.response === "correct").length;
          const total = weekTrials.length;
          
          return total > 0 ? Math.round((correct / total) * 100) : 0;
        });

        return {
          label: program.program_name,
          data: weeklyAccuracy,
          color: colors[idx % colors.length],
        };
      });

      return {
        labels: weekLabels,
        datasets,
      };
    },
  });
}

/**
 * Hook to calculate session volume per day
 */
export function useSessionVolume() {
  const { data: allSessions = [] } = useSessions();

  return useQuery({
    queryKey: ["sessionVolume", allSessions.length],
    queryFn: async () => {
      // Get last 7 days
      const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const recentSessions = allSessions.filter(
        (s: Session) => new Date(s.start_time) >= sevenDaysAgo
      );

      // Group by day of week
      const dayCounts = Array(7).fill(0);
      recentSessions.forEach((s: Session) => {
        const dayOfWeek = new Date(s.start_time).getDay();
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert Sunday=0 to be at index 6
        dayCounts[adjustedDay]++;
      });

      return {
        labels: dayLabels,
        datasets: [{
          label: "Sessions",
          data: dayCounts,
          color: "#f59e0b",
        }],
      };
    },
  });
}

/**
 * Hook to calculate response type distribution
 */
export function useResponseDistribution() {
  const { data: allSessions = [] } = useSessions();

  return useQuery({
    queryKey: ["responseDistribution", allSessions.length],
    queryFn: async () => {
      const allTrials = allSessions.flatMap((s: Session) => s.trials || []);
      
      const correct = allTrials.filter((t) => t.response === "correct").length;
      const incorrect = allTrials.filter((t) => t.response === "incorrect").length;
      const prompted = allTrials.filter((t) => t.response === "prompted").length;
      const noResponse = allTrials.filter((t) => t.response === "no_response").length;
      
      const total = allTrials.length || 1; // Avoid division by zero
      
      return {
        labels: ["Correct", "Incorrect", "Prompted", "No Response"],
        data: [
          Math.round((correct / total) * 100),
          Math.round((incorrect / total) * 100),
          Math.round((prompted / total) * 100),
          Math.round((noResponse / total) * 100),
        ],
        colors: ["#10b981", "#ef4444", "#f59e0b", "#6b7280"],
      };
    },
  });
}

/**
 * Hook to calculate mastery progress for active programs
 */
export function useMasteryProgress() {
  const { data: allSessions = [] } = useSessions();
  const { data: allPrograms = [] } = usePrograms();

  return useQuery({
    queryKey: ["masteryProgress", allSessions.length, allPrograms.length],
    queryFn: async () => {
      const activePrograms = allPrograms.filter((p: Program) => p.status === "active");
      
      const programProgress = activePrograms.map((program: Program) => {
        const programSessions = allSessions
          .filter((s: Session) => s.program_id === program.program_id && s.status === "completed")
          .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
          .slice(0, 3);
        
        const recentTrials = programSessions.flatMap((s: Session) => s.trials || []);
        const correct = recentTrials.filter((t) => t.response === "correct").length;
        const total = recentTrials.length;
        
        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
        const masteryTarget = program.mastery_threshold || 80;
        
        let status: "mastered" | "close" | "in-progress";
        if (accuracy >= masteryTarget) {
          status = "mastered";
        } else if (accuracy >= masteryTarget * 0.85) {
          status = "close";
        } else {
          status = "in-progress";
        }
        
        return {
          name: program.program_name,
          progress: accuracy,
          status,
        };
      });
      
      return { programs: programProgress.slice(0, 4) }; // Top 4 programs
    },
  });
}
