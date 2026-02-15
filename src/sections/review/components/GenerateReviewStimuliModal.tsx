import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, AlertCircle } from "lucide-react";
import { useGenerateStimulus } from "@/hooks/useStimuli";
import { usePrograms } from "@/hooks/usePrograms";

interface GenerateReviewStimuliModalProps {
  open: boolean;
  onClose: () => void;
}

export default function GenerateReviewStimuliModal({
  open,
  onClose,
}: GenerateReviewStimuliModalProps) {
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [count, setCount] = useState(5);
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedCount, setGeneratedCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const generateStimulus = useGenerateStimulus();
  const { data: programs } = usePrograms();

  const selectedProgram = programs?.find((p) => p.program_id === selectedProgramId);

  const handleGenerate = async () => {
    if (!selectedProgram) {
      alert("Please select a program first");
      return;
    }

    setGeneratedCount(0);
    setErrors([]);

    const basePrompt = `Generate a clear, high-quality image suitable for ${selectedProgram.program_type} therapy. Program: ${selectedProgram.program_name}. ${selectedProgram.description}`;
    const fullPrompt = customPrompt
      ? `${basePrompt} Additional guidance: ${customPrompt}`
      : basePrompt;

    const errorList: string[] = [];
    let successCount = 0;

    // Generate stimuli one at a time to show progress
    for (let i = 0; i < count; i++) {
      try {
        await generateStimulus.mutateAsync({
          prompt: fullPrompt,
          programId: selectedProgram.program_id,
          options: { programType: selectedProgram.program_type },
        });
        successCount++;
        setGeneratedCount(successCount);
      } catch (error) {
        console.error(`Failed to generate stimulus ${i + 1}:`, error);
        errorList.push(`Stimulus ${i + 1}: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }

    setErrors(errorList);

    // Show completion message
    if (successCount === count) {
      alert(`Successfully generated ${successCount} stimuli for review!`);
      onClose();
    } else if (successCount > 0) {
      alert(
        `Generated ${successCount} out of ${count} stimuli. ${errorList.length} failed - see details below.`,
      );
    } else {
      alert("Failed to generate any stimuli. Please check your connection and try again.");
    }
  };

  const isGenerating = generateStimulus.isPending;
  const progress = count > 0 ? (generatedCount / count) * 100 : 0;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader onClose={onClose}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <div>
            <DialogTitle>Generate Stimuli for Review</DialogTitle>
            <DialogDescription>
              Create new AI-generated stimuli that will appear in the review queue
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <DialogContent>
        <div className="space-y-4">
          {/* Program Selection */}
          <div>
            <label className="text-sm font-medium text-stone-900 dark:text-stone-100 mb-2 block">
              Select Program
            </label>
            <select
              className="w-full px-3 py-2 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100"
              value={selectedProgramId}
              onChange={(e) => setSelectedProgramId(e.target.value)}
              disabled={isGenerating}
            >
              <option value="">Choose a program...</option>
              {programs
                ?.filter((p) => p.status === "active")
                .map((program) => (
                  <option key={program.program_id} value={program.program_id}>
                    {program.program_name} ({program.program_type})
                  </option>
                ))}
            </select>
          </div>

          {/* Count Input */}
          <div>
            <label className="text-sm font-medium text-stone-900 dark:text-stone-100 mb-2 block">
              Number of Stimuli to Generate
            </label>
            <Input
              type="number"
              min="1"
              max="20"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              disabled={isGenerating}
              placeholder="5"
            />
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Each stimulus takes 3-5 seconds to generate
            </p>
          </div>

          {/* Custom Prompt */}
          <div>
            <label className="text-sm font-medium text-stone-900 dark:text-stone-100 mb-2 block">
              Additional Guidance (Optional)
            </label>
            <textarea
              className="w-full min-h-[60px] px-3 py-2 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 text-sm"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              disabled={isGenerating}
              placeholder="e.g., 'Focus on common household items' or 'Use simple, bold colors'"
            />
          </div>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600 dark:text-stone-400">
                  Generating stimuli...
                </span>
                <span className="text-stone-900 dark:text-stone-100 font-medium">
                  {generatedCount} / {count}
                </span>
              </div>
              <div className="h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-red-900 dark:text-red-100 mb-1">
                    Some stimuli failed to generate:
                  </p>
                  <ul className="text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
                    {errors.slice(0, 3).map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                    {errors.length > 3 && (
                      <li>...and {errors.length - 3} more</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Cancel"}
        </Button>
        <Button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || !selectedProgramId || count < 1}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isGenerating
            ? `Generating ${generatedCount}/${count}...`
            : `Generate ${count} Stimuli`}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
