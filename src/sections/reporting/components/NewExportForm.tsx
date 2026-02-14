import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ExportFormat } from "../../../../product-plan/sections/reporting/types";

interface NewExportFormProps {
  onSubmit: (exportRequest: any) => void;
  onCancel: () => void;
}

export default function NewExportForm({
  onSubmit,
  onCancel,
}: NewExportFormProps) {
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [exportType, setExportType] = useState("session_data");
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = () => {
    onSubmit({
      format,
      export_type: exportType,
      date_range: dateRange,
      client_id: "client-001", // In a real app, this would be selected
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
          Export Type
        </label>
        <select
          value={exportType}
          onChange={(e) => setExportType(e.target.value)}
          className="w-full p-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
        >
          <option value="session_data">Session Data</option>
          <option value="program_data">Program Data</option>
          <option value="trial_data">Trial-by-Trial Data</option>
          <option value="mastery_report">Mastery Report</option>
          <option value="attendance_report">Attendance Report</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
          Format
        </label>
        <div className="flex gap-2">
          {(["pdf", "excel", "csv"] as ExportFormat[]).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormat(fmt)}
              className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                format === fmt
                  ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
                  : "border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
              }`}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Start Date
          </label>
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            End Date
          </label>
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={handleSubmit}>Create Export</Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
