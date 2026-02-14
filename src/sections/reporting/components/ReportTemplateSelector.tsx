import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ReportTemplate } from "../../../../product-plan/sections/reporting/types";

interface ReportTemplateSelectorProps {
  templates: ReportTemplate[];
  selectedTemplate: ReportTemplate | null;
  onSelectTemplate: (template: ReportTemplate) => void;
}

export default function ReportTemplateSelector({
  templates,
  selectedTemplate,
  onSelectTemplate,
}: ReportTemplateSelectorProps) {
  const getTemplateTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      weekly: "Weekly",
      monthly: "Monthly",
      quarterly: "Quarterly",
      insurance: "Insurance",
      school: "School/IEP",
      custom: "Custom",
    };
    return labels[type] || type;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100 mb-3">
          Report Template
        </h3>
        <div className="space-y-2">
          {templates.map((template) => {
            const isSelected = selectedTemplate?.template_id === template.template_id;
            return (
              <button
                key={template.template_id}
                onClick={() => onSelectTemplate(template)}
                className={`w-full text-left p-3 rounded-md border transition-colors ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-500"
                    : "border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-900 dark:text-stone-100">
                        {template.template_name}
                      </span>
                      {template.is_default && (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      {getTemplateTypeLabel(template.template_type)} •{" "}
                      {template.sections.length} sections
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
