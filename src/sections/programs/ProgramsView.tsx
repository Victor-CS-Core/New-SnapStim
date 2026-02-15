import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateProgram, usePrograms } from "@/hooks/usePrograms";
import { useGenerateStimulus } from "@/hooks/useStimuli";
import { useNavigation } from "@/lib/NavigationContext";
import { BarChart3, Plus, Sparkles, Target, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import type {
  Program,
  ProgramStatus,
  ProgramType,
} from "../../../product-plan/sections/programs/types";
import type { ProgramFormData } from "./components/AddProgramModal";
import AddProgramModal from "./components/AddProgramModal";
import ProgramDetail from "./components/ProgramDetail";
import ProgramFilters from "./components/ProgramFilters";
import ProgramList from "./components/ProgramList";

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
  const { navigateTo, contextData } = useNavigation();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [filters, setFilters] = useState<{
    search?: string;
    type?: ProgramType;
    status?: ProgramStatus;
  }>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [isGeneratingStimuli, setIsGeneratingStimuli] = useState(false);

  // Use React Query hooks
  const { data: programs, isLoading } = usePrograms();
  const createProgram = useCreateProgram();
  const generateStimulus = useGenerateStimulus();

  const handleAddProgram = async (programData: ProgramFormData) => {
    try {
      // First, create the program
      const result = await createProgram.mutateAsync(programData as any);
      const programId = result?.program_id || `prg_${Date.now()}`;

      setShowAddModal(false);

      // If AI generation is requested, generate stimuli
      if (programData.generate_ai_stimuli && programData.stimuli_count > 0) {
        setIsGeneratingStimuli(true);

        const basePrompt = `Generate a clear, high-quality image suitable for ${programData.program_type} therapy. Program: ${programData.program_name}. ${programData.description}`;

        let successCount = 0;
        const total = programData.stimuli_count;

        for (let i = 0; i < total; i++) {
          try {
            await generateStimulus.mutateAsync({
              prompt: basePrompt,
              programId: programId,
              options: { programType: programData.program_type },
            });
            successCount++;
            console.log(`Generated stimulus ${successCount}/${total}`);
          } catch (error) {
            console.error(`Failed to generate stimulus ${i + 1}:`, error);
          }
        }

        setIsGeneratingStimuli(false);

        if (successCount === total) {
          alert(
            `Program "${programData.program_name}" created successfully!\n${successCount} stimuli generated and ready for review.`,
          );
        } else if (successCount > 0) {
          alert(
            `Program "${programData.program_name}" created successfully!\n${successCount} of ${total} stimuli generated. Some failed - you can generate more later.`,
          );
        } else {
          alert(
            `Program "${programData.program_name}" created successfully!\nHowever, stimulus generation failed. You can try generating them later from the program detail view.`,
          );
        }
      } else {
        alert(`Program "${programData.program_name}" created successfully!`);
      }
    } catch (error) {
      console.error("Failed to create program:", error);
      alert("Failed to create program");
      setIsGeneratingStimuli(false);
    }
  };

  // Filter programs based on search and filters
  const filteredPrograms = useMemo(() => {
    if (!programs) return [];

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
    if (!programs)
      return {
        activeCount: 0,
        masteredCount: 0,
        avgAccuracy: 0,
        improvingCount: 0,
        totalAIGenerated: 0,
        approvalRate: 0,
      };

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
    if (!programs) return;

    const program = programs.find((p) => p.program_id === programId);
    if (program) {
      setSelectedProgram(program);
    }
  };

  const handleCloseDetail = () => {
    setSelectedProgram(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-500 dark:text-stone-400">
          Loading programs...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Generation Loading Banner */}
      {isGeneratingStimuli && (
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-pulse" />
              <div>
                <p className="font-medium text-amber-900 dark:text-amber-100">
                  Generating AI Stimuli...
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Creating images for your new program. This may take a few minutes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
        <Button onClick={() => setShowAddModal(true)}>
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
          subtitle={`of ${programs?.length || 0} programs`}
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
            // Navigate to Sessions with program and client context
            navigateTo("/sessions", {
              programId: selectedProgram.program_id,
              clientId: selectedProgram.client_id,
              sourceView: "programs",
            });
            handleCloseDetail();
          }}
          onEdit={() => {
            // TODO: Implement program editing
            // Options:
            // 1. Show inline edit mode in ProgramDetail
            // 2. Open separate edit modal/form
            // 3. Navigate to dedicated edit page
            console.log("Edit program:", selectedProgram.program_id);
            handleCloseDetail();
          }}
        />
      )}

      {/* Add Program Modal */}
      <AddProgramModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProgram}
        clientId={contextData.clientId}
      />
    </div>
  );
}
