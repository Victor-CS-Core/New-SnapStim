import { useState, useMemo } from "react";
import { Target, TrendingUp, Sparkles, BarChart3, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgramFilters from "./components/ProgramFilters";
import ProgramList from "./components/ProgramList";
import ProgramDetail from "./components/ProgramDetail";
import programsData from "../../../product-plan/sections/programs/data.json";
import type {
  Program,
  ProgramType,
  ProgramStatus,
} from "../../../product-plan/sections/programs/types";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
}

function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-stone-600 dark:text-stone-400">
          {title}
        </CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400">
              {trend.value > 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ProgramsView() {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [filters, setFilters] = useState<{
    search?: string;
    type?: ProgramType;
    status?: ProgramStatus;
  }>({});

  const programs = programsData.programs as Program[];

  // Filter programs based on search and filters
  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesSearch =
        !filters.search ||
        program.program_name
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        program.description
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        program.category.toLowerCase().includes(filters.search.toLowerCase());

      const matchesType =
        !filters.type || program.program_type === filters.type;
      const matchesStatus =
        !filters.status || program.status === filters.status;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [programs, filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const activePrograms = programs.filter((p) => p.status === "active");
    const masteredPrograms = programs.filter((p) => p.status === "mastered");

    const avgAccuracy =
      activePrograms.length > 0
        ? Math.round(
            activePrograms.reduce(
              (sum, p) => sum + p.performance.accuracy_percent,
              0,
            ) / activePrograms.length,
          )
        : 0;

    const improvingCount = programs.filter(
      (p) => p.performance.trend === "improving",
    ).length;

    const totalAIGenerated = programs.reduce(
      (sum, p) => sum + p.ai_metadata.stimuli_generated,
      0,
    );

    const totalApproved = programs.reduce(
      (sum, p) => sum + p.ai_metadata.stimuli_approved,
      0,
    );

    return {
      activeCount: activePrograms.length,
      masteredCount: masteredPrograms.length,
      avgAccuracy,
      improvingCount,
      totalAIGenerated,
      approvalRate:
        totalAIGenerated > 0
          ? Math.round((totalApproved / totalAIGenerated) * 100)
          : 0,
    };
  }, [programs]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleViewProgram = (programId: string) => {
    const program = programs.find((p) => p.program_id === programId);
    if (program) {
      setSelectedProgram(program);
    }
  };

  const handleCloseDetail = () => {
    setSelectedProgram(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Programs
          </h1>
          <p className="text-stone-500 dark:text-stone-400">
            Manage skill acquisition programs and track progress
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Program
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Programs"
          value={stats.activeCount}
          subtitle={`${stats.masteredCount} mastered`}
          icon={<Target className="h-5 w-5" />}
        />
        <StatCard
          title="Average Accuracy"
          value={`${stats.avgAccuracy}%`}
          subtitle="Across active programs"
          icon={<BarChart3 className="h-5 w-5" />}
          trend={{ value: 3, label: "vs last week" }}
        />
        <StatCard
          title="Improving"
          value={stats.improvingCount}
          subtitle={`of ${programs.length} programs`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          title="AI Stimuli"
          value={stats.totalAIGenerated}
          subtitle={`${stats.approvalRate}% approval rate`}
          icon={<Sparkles className="h-5 w-5" />}
        />
      </div>

      {/* Filters */}
      <ProgramFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Programs List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Programs ({filteredPrograms.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ProgramList
            programs={filteredPrograms}
            onViewProgram={handleViewProgram}
          />
        </CardContent>
      </Card>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <ProgramDetail
          program={selectedProgram}
          onClose={handleCloseDetail}
          onStartSession={() => {
            // TODO: Navigate to sessions with this program
            handleCloseDetail();
          }}
          onEdit={() => {
            // TODO: Open edit form
            handleCloseDetail();
          }}
        />
      )}
    </div>
  );
}
