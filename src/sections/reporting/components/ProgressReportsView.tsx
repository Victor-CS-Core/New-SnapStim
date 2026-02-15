import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReportTemplates } from "@/hooks/useReporting";
import { Download, FileText, Mail, Printer } from "lucide-react";
import { useState } from "react";
import type {
  ExportFormat,
  ReportGenerationRequest,
  ReportTemplate,
} from "../../../../product-plan/sections/reporting/types";
import ReportConfigPanel from "./ReportConfigPanel";
import ReportPreview from "./ReportPreview";
import ReportTemplateSelector from "./ReportTemplateSelector";

export default function ProgressReportsView() {
  const { data: templates, isLoading } = useReportTemplates();

  const [selectedTemplate, setSelectedTemplate] =
    useState<ReportTemplate | null>(null);
  const [reportConfig, setReportConfig] = useState<
    Partial<ReportGenerationRequest>
  >({
    client_id: "client-001",
    program_ids: [],
    date_range: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      end: new Date().toISOString().split("T")[0],
    },
    format: "pdf" as ExportFormat,
    include_options: {
      session_attendance: true,
      performance_graphs: true,
      mastery_status: true,
      therapist_comments: true,
      recommendations: true,
    },
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setGeneratedReport("report-preview-content");
      setIsGenerating(false);
    }, 2000);
  };

  const handleDownload = (format: ExportFormat) => {
    console.log("Downloading report as:", format);
    // In a real app, this would trigger download
  };

  const handleEmail = () => {
    console.log("Sending report via email");
    // In a real app, this would open email dialog
  };

  const handlePrint = () => {
    window.print();
  };

  // Set default template once data is loaded
  if (templates && !selectedTemplate) {
    setSelectedTemplate(
      templates.find((t) => t.is_default) || templates[0] || null,
    );
  }

  if (isLoading || !templates) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-500 dark:text-stone-400">
          Loading report templates...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Progress Reports
          </CardTitle>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Generate and download progress reports for stakeholders
          </p>
        </CardHeader>
      </Card>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Template Selection & Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <ReportTemplateSelector
            templates={templates}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
          />

          {selectedTemplate && (
            <ReportConfigPanel
              template={selectedTemplate}
              config={reportConfig}
              onConfigChange={setReportConfig}
            />
          )}

          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={handleGenerateReport}
                disabled={!selectedTemplate || isGenerating}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Preview & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {generatedReport ? (
            <>
              {/* Actions Bar */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => handleDownload("pdf")}
                      variant="default"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button
                      onClick={() => handleDownload("excel")}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                    <Button
                      onClick={() => handleDownload("word")}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Word
                    </Button>
                    <Button onClick={handleEmail} variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button onClick={handlePrint} variant="outline">
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <ReportPreview
                template={selectedTemplate}
                config={reportConfig}
              />
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-stone-400 dark:text-stone-600 mb-4" />
                <p className="text-stone-500 dark:text-stone-400">
                  Configure your report settings and click "Generate Report" to
                  see a preview
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
