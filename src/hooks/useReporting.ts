import { useQuery } from "@tanstack/react-query";
import reportingData from "../../product-plan/sections/reporting/data.json";
import type {
    DashboardMetrics,
    ExportJob,
    ReportTemplate,
    ScheduledExport,
} from "../../product-plan/sections/reporting/types";

/**
 * Hook to fetch dashboard metrics
 * Returns aggregated analytics data for the dashboard
 */
export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: async () => {
      // In a real app, this would fetch from the backend
      // For now, return mock data from JSON
      console.warn("Backend endpoint for dashboard metrics not yet implemented - using mock data");
      return reportingData.dashboardMetrics as DashboardMetrics;
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
