import { Calendar, Users, Clock, ToggleLeft, ToggleRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ScheduledExport } from "../../../../product-plan/sections/reporting/types";

interface ScheduledExportsListProps {
  schedules: ScheduledExport[];
}

export default function ScheduledExportsList({
  schedules,
}: ScheduledExportsListProps) {
  const handleToggleActive = (scheduleId: string) => {
    console.log("Toggling schedule:", scheduleId);
    // In a real app, this would update the schedule
  };

  const handleEdit = (scheduleId: string) => {
    console.log("Editing schedule:", scheduleId);
    // In a real app, this would open edit dialog
  };

  const handleDelete = (scheduleId: string) => {
    console.log("Deleting schedule:", scheduleId);
    // In a real app, this would delete the schedule
  };

  const formatFrequency = (frequency: string, dayOfWeek?: string, dayOfMonth?: number) => {
    switch (frequency) {
      case "daily":
        return "Daily";
      case "weekly":
        return dayOfWeek ? `Weekly on ${dayOfWeek}` : "Weekly";
      case "monthly":
        return dayOfMonth ? `Monthly on day ${dayOfMonth}` : "Monthly";
      case "quarterly":
        return "Quarterly";
      default:
        return frequency;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (schedules.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-stone-500 dark:text-stone-400">
            No scheduled exports yet. Create a recurring export to automate your reports.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {schedules.map((schedule) => (
        <Card key={schedule.schedule_id}>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-stone-900 dark:text-stone-100">
                      Schedule #{schedule.schedule_id.split("-")[1]}
                    </span>
                    {schedule.active ? (
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                        Inactive
                      </Badge>
                    )}
                    <Badge className="bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                      {schedule.format.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-stone-600 dark:text-stone-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatFrequency(
                        schedule.frequency,
                        schedule.day_of_week,
                        schedule.day_of_month,
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {schedule.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {schedule.recipients.length} recipient(s)
                    </div>
                    {schedule.next_run && (
                      <div className="text-stone-500 dark:text-stone-400">
                        Next run: {formatDate(schedule.next_run)}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleActive(schedule.schedule_id)}
                >
                  {schedule.active ? (
                    <ToggleRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-stone-400" />
                  )}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(schedule.schedule_id)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(schedule.schedule_id)}
                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
