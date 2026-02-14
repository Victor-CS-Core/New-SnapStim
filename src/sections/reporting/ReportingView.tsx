import { useState } from "react";
import { MessageSquare, FileText, BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CommentsView from "./components/CommentsView";
import ProgressReportsView from "./components/ProgressReportsView";
import DataVisualizationView from "./components/DataVisualizationView";
import ExportCenterView from "./components/ExportCenterView";

type TabView = "comments" | "reports" | "analytics" | "exports";

export default function ReportingView() {
  const [activeTab, setActiveTab] = useState<TabView>("comments");

  const tabs = [
    {
      id: "comments" as TabView,
      label: "Comments",
      icon: MessageSquare,
      description: "Team communication",
    },
    {
      id: "reports" as TabView,
      label: "Progress Reports",
      icon: FileText,
      description: "Generate reports",
    },
    {
      id: "analytics" as TabView,
      label: "Data Analytics",
      icon: BarChart3,
      description: "Visual analysis",
    },
    {
      id: "exports" as TabView,
      label: "Export Center",
      icon: Download,
      description: "Download data",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "comments":
        return <CommentsView />;
      case "reports":
        return <ProgressReportsView />;
      case "analytics":
        return <DataVisualizationView />;
      case "exports":
        return <ExportCenterView />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Reporting & Communication
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">
          Team collaboration, reports, and data visualization
        </p>
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b border-stone-200 dark:border-stone-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col sm:flex-row items-center gap-2 rounded-none border-b-2 py-4 ${
                    isActive
                      ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                      : "border-transparent hover:bg-stone-50 dark:hover:bg-stone-800/50 text-stone-600 dark:text-stone-400"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <div className="text-center sm:text-left">
                    <div className="font-medium text-sm">{tab.label}</div>
                    <div className="text-xs hidden sm:block opacity-70">
                      {tab.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content Area */}
      <div>{renderContent()}</div>
    </div>
  );
}
