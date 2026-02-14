import { Download, Clock, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ExportJob } from "../../../../product-plan/sections/reporting/types";

interface ExportHistoryListProps {
  jobs: ExportJob[];
}

export default function ExportHistoryList({ jobs }: ExportHistoryListProps) {
  const handleDownload = (job: ExportJob) => {
    if (job.download_url) {
      console.log("Downloading:", job.download_url);
      // In a real app, this would trigger download
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: ExportJob["status"]) => {
    const config = {
      pending: {
        icon: Clock,
        label: "Pending",
        className: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
      },
      processing: {
        icon: Clock,
        label: "Processing",
        className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      },
      completed: {
        icon: Check,
        label: "Completed",
        className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      },
      failed: {
        icon: X,
        label: "Failed",
        className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      },
    };

    const { icon: Icon, label, className } = config[status];
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-stone-500 dark:text-stone-400">
            No export history yet. Create your first export to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <Card key={job.export_id}>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-stone-900 dark:text-stone-100">
                    Export {job.export_id.split("-")[1]}
                  </span>
                  {getStatusBadge(job.status)}
                  <Badge className="bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                    {job.format.toUpperCase()}
                  </Badge>
                </div>

                <div className="text-sm text-stone-500 dark:text-stone-400 space-y-1">
                  <div>
                    Created: {formatDate(job.created_at)}
                  </div>
                  {job.status === "completed" && job.file_size_bytes > 0 && (
                    <div>
                      Size: {formatFileSize(job.file_size_bytes)}
                    </div>
                  )}
                  {job.expires_at && (
                    <div>
                      Expires: {formatDate(job.expires_at)}
                    </div>
                  )}
                </div>
              </div>

              {job.status === "completed" && job.download_url && (
                <Button onClick={() => handleDownload(job)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}

              {job.status === "processing" && (
                <div className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-amber-600 dark:border-amber-400 border-t-transparent rounded-full"></div>
                  Processing...
                </div>
              )}

              {job.status === "failed" && (
                <Button variant="outline" onClick={() => console.log("Retry")}>
                  Retry
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
