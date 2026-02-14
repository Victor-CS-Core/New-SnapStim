import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  ReportTemplate,
  ReportGenerationRequest,
} from "../../../../product-plan/sections/reporting/types";

interface ReportPreviewProps {
  template: ReportTemplate | null;
  config: Partial<ReportGenerationRequest>;
}

export default function ReportPreview({ template, config }: ReportPreviewProps) {
  if (!template) {
    return null;
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg p-8 space-y-6 min-h-[600px]">
          {/* Report Header */}
          <div className="border-b border-stone-200 dark:border-stone-700 pb-6">
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
              {template.template_name}
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mt-2">
              {config.date_range?.start && config.date_range?.end && (
                <>
                  {formatDate(config.date_range.start)} -{" "}
                  {formatDate(config.date_range.end)}
                </>
              )}
            </p>
          </div>

          {/* Client Demographics Section */}
          <div>
            <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
              Client Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-stone-500 dark:text-stone-400">Client:</span>
                <p className="text-stone-900 dark:text-stone-100 font-medium">
                  Emma Thompson
                </p>
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400">Age:</span>
                <p className="text-stone-900 dark:text-stone-100 font-medium">5 years</p>
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400">BCBA:</span>
                <p className="text-stone-900 dark:text-stone-100 font-medium">
                  Dr. Sarah Mitchell
                </p>
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400">
                  Report Type:
                </span>
                <p className="text-stone-900 dark:text-stone-100 font-medium">
                  {template.template_type}
                </p>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          {template.sections.includes("executive_summary") && (
            <div>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
                Executive Summary
              </h2>
              <p className="text-stone-700 dark:text-stone-300 text-sm">
                Emma continues to make excellent progress across all targeted skill
                domains. Performance data indicates significant improvement in
                receptive identification tasks, with mastery achieved in fruit
                identification (100% accuracy over 3 consecutive sessions).
              </p>
            </div>
          )}

          {/* Session Attendance */}
          {config.include_options?.session_attendance && (
            <div>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
                Session Attendance
              </h2>
              <div className="bg-stone-50 dark:bg-stone-800 rounded-md p-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-stone-500 dark:text-stone-400">
                      Scheduled:
                    </span>
                    <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                      12
                    </p>
                  </div>
                  <div>
                    <span className="text-stone-500 dark:text-stone-400">
                      Completed:
                    </span>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      11
                    </p>
                  </div>
                  <div>
                    <span className="text-stone-500 dark:text-stone-400">
                      Attendance:
                    </span>
                    <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                      92%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Graphs */}
          {config.include_options?.performance_graphs && (
            <div>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
                Performance Trends
              </h2>
              <div className="bg-stone-100 dark:bg-stone-800 rounded-md h-48 flex items-center justify-center">
                <p className="text-stone-500 dark:text-stone-400 text-sm">
                  [Chart: Accuracy over time]
                </p>
              </div>
            </div>
          )}

          {/* Mastery Status */}
          {config.include_options?.mastery_status && (
            <div>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
                Mastery Achievements
              </h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full"></span>
                  <span className="text-stone-700 dark:text-stone-300">
                    Fruit Identification - Mastered (100% accuracy)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-amber-500 rounded-full"></span>
                  <span className="text-stone-700 dark:text-stone-300">
                    Body Parts - In Progress (85% accuracy)
                  </span>
                </li>
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {config.include_options?.recommendations && (
            <div>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
                Recommendations
              </h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-stone-700 dark:text-stone-300">
                <li>
                  Continue current programming with emphasis on generalization
                </li>
                <li>Introduce more complex discrimination tasks</li>
                <li>Maintain consistent session schedule</li>
              </ul>
            </div>
          )}

          {/* Signature Block */}
          <div className="border-t border-stone-200 dark:border-stone-700 pt-6 mt-8">
            <div className="text-sm space-y-2">
              <p className="text-stone-700 dark:text-stone-300">
                <strong>Prepared by:</strong> Dr. Sarah Mitchell, BCBA
              </p>
              <p className="text-stone-500 dark:text-stone-400">
                Board Certified Behavior Analyst
              </p>
              <p className="text-stone-500 dark:text-stone-400">
                Certification #: 1-23-45678
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
