import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExportJobs, useScheduledExports } from "@/hooks/useReporting";
import { Calendar, Clock, Download } from "lucide-react";
import { useState } from "react";
import ExportHistoryList from "./ExportHistoryList";
import NewExportForm from "./NewExportForm";
import ScheduledExportsList from "./ScheduledExportsList";

export default function ExportCenterView() {
  const [showNewExportForm, setShowNewExportForm] = useState(false);
  const [activeView, setActiveView] = useState<"history" | "scheduled">(
    "history",
  );

  const { data: exportJobs, isLoading: isLoadingJobs } = useExportJobs();
  const { data: scheduledExports, isLoading: isLoadingScheduled } =
    useScheduledExports();

  const handleCreateExport = (exportRequest: any) => {
    console.log("Creating export:", exportRequest);
    setShowNewExportForm(false);
    // In a real app, this would create the export job
  };

  if (isLoadingJobs || isLoadingScheduled || !exportJobs || !scheduledExports) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-500 dark:text-stone-400">
          Loading export center...
        </div>
      </div>
    );
  }

  const pendingJobs = exportJobs.filter(
    (j) => j.status === "pending" || j.status === "processing",
  );
  const completedJobs = exportJobs.filter((j) => j.status === "completed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Center
              </CardTitle>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                Download data exports and manage scheduled reports
              </p>
            </div>
            <Button onClick={() => setShowNewExportForm(!showNewExportForm)}>
              <Download className="h-4 w-4 mr-2" />
              New Export
            </Button>
          </div>
        </CardHeader>

        {/* New Export Form */}
        {showNewExportForm && (
          <CardContent className="border-t border-stone-200 dark:border-stone-700">
            <NewExportForm
              onSubmit={handleCreateExport}
              onCancel={() => setShowNewExportForm(false)}
            />
          </CardContent>
        )}
      </Card>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400 uppercase font-medium">
                  Pending/Processing
                </p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {pendingJobs.length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400 uppercase font-medium">
                  Ready to Download
                </p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {completedJobs.length}
                </p>
              </div>
              <Download className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400 uppercase font-medium">
                  Scheduled Exports
                </p>
                <p className="text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                  {scheduledExports.filter((s) => s.active).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-stone-600 dark:text-stone-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Switcher */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b border-stone-200 dark:border-stone-700">
            <Button
              variant="ghost"
              onClick={() => setActiveView("history")}
              className={`flex-1 rounded-none border-b-2 ${
                activeView === "history"
                  ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-stone-600 dark:text-stone-400"
              }`}
            >
              <Clock className="h-4 w-4 mr-2" />
              Export History
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveView("scheduled")}
              className={`flex-1 rounded-none border-b-2 ${
                activeView === "scheduled"
                  ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-stone-600 dark:text-stone-400"
              }`}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Scheduled Exports
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Area */}
      {activeView === "history" ? (
        <ExportHistoryList jobs={exportJobs} />
      ) : (
        <ScheduledExportsList schedules={scheduledExports} />
      )}
    </div>
  );
}
