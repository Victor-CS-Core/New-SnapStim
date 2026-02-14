import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type {
  ReportTemplate,
  ReportGenerationRequest,
  ExportFormat,
} from "../../../../product-plan/sections/reporting/types";

interface ReportConfigPanelProps {
  template: ReportTemplate;
  config: Partial<ReportGenerationRequest>;
  onConfigChange: (config: Partial<ReportGenerationRequest>) => void;
}

export default function ReportConfigPanel({
  config,
  onConfigChange,
}: ReportConfigPanelProps) {
  const updateDateRange = (field: "start" | "end", value: string) => {
    onConfigChange({
      ...config,
      date_range: {
        ...config.date_range!,
        [field]: value,
      },
    });
  };

  const toggleIncludeOption = (option: keyof typeof config.include_options) => {
    onConfigChange({
      ...config,
      include_options: {
        ...config.include_options!,
        [option]: !config.include_options?.[option],
      },
    });
  };

  const updateFormat = (format: ExportFormat) => {
    onConfigChange({
      ...config,
      format,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100 mb-3">
            Date Range
          </h3>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-stone-500 dark:text-stone-400">
                Start Date
              </label>
              <Input
                type="date"
                value={config.date_range?.start || ""}
                onChange={(e) => updateDateRange("start", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-stone-500 dark:text-stone-400">
                End Date
              </label>
              <Input
                type="date"
                value={config.date_range?.end || ""}
                onChange={(e) => updateDateRange("end", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100 mb-3">
            Export Format
          </h3>
          <div className="flex gap-2">
            {(["pdf", "excel", "word"] as ExportFormat[]).map((format) => (
              <button
                key={format}
                onClick={() => updateFormat(format)}
                className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                  config.format === format
                    ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
                    : "border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
                }`}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100 mb-3">
            Include Options
          </h3>
          <div className="space-y-2">
            {["session_attendance", "performance_graphs", "mastery_status", "therapist_comments", "recommendations"].map((key) => (
              <label
                key={key}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={config.include_options?.[key as keyof typeof config.include_options] || false}
                  onChange={() => toggleIncludeOption(key as keyof typeof config.include_options)}
                  className="rounded border-stone-300 dark:border-stone-600 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-stone-700 dark:text-stone-300">
                  {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
