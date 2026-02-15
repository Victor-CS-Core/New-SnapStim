import { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target } from "lucide-react";

interface AddProgramModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (programData: ProgramFormData) => void;
  clientId?: string; // Pre-fill if coming from client view
}

export interface ProgramFormData {
  program_name: string;
  client_id: string;
  program_type: string;
  category: string;
  description: string;
  mastery_threshold: number;
  trial_count: number;
  generate_ai_stimuli: boolean;
  stimuli_count: number;
}

export default function AddProgramModal({ open, onClose, onAdd, clientId }: AddProgramModalProps) {
  const [formData, setFormData] = useState<ProgramFormData>({
    program_name: "",
    client_id: clientId || "",
    program_type: "receptive_identification",
    category: "Receptive Language",
    description: "",
    mastery_threshold: 80,
    trial_count: 10,
    generate_ai_stimuli: true,
    stimuli_count: 15,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onAdd(formData);
      setIsSubmitting(false);
      // Reset form
      setFormData({
        program_name: "",
        client_id: clientId || "",
        program_type: "receptive_identification",
        category: "Receptive Language",
        description: "",
        mastery_threshold: 80,
        trial_count: 10,
        generate_ai_stimuli: true,
        stimuli_count: 15,
      });
      onClose();
    }, 500);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader onClose={onClose}>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <div>
            <DialogTitle>Create New Program</DialogTitle>
            <DialogDescription>
              Define a new teaching program with AI-generated stimuli
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <div className="space-y-4">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-3">
                Program Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-stone-600 dark:text-stone-400 mb-1 block">
                    Program Name *
                  </label>
                  <Input
                    value={formData.program_name}
                    onChange={(e) => setFormData({ ...formData, program_name: e.target.value })}
                    required
                    placeholder="e.g., 'Tacting Colors' or 'Receptive ID - Animals'"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-stone-600 dark:text-stone-400 mb-1 block">
                      Client *
                    </label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                      value={formData.client_id}
                      onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                      required
                    >
                      <option value="">Select a client</option>
                      <option value="cli_1">Emma Rodriguez</option>
                      <option value="cli_2">Liam Chen</option>
                      <option value="cli_3">Sophia Patel</option>
                      <option value="cli_4">Noah Williams</option>
                      <option value="cli_5">Olivia Thompson</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-stone-600 dark:text-stone-400 mb-1 block">
                      Program Type *
                    </label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                      value={formData.program_type}
                      onChange={(e) => setFormData({ ...formData, program_type: e.target.value })}
                      required
                    >
                      <option value="receptive_identification">Receptive Identification</option>
                      <option value="expressive_labeling">Expressive Labeling</option>
                      <option value="intraverbal">Intraverbal</option>
                      <option value="listener_responding">Listener Responding</option>
                      <option value="imitation">Imitation</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-stone-600 dark:text-stone-400 mb-1 block">
                      Category
                    </label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., 'Receptive Language'"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-stone-600 dark:text-stone-400 mb-1 block">
                      Mastery Threshold (%)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.mastery_threshold}
                      onChange={(e) => setFormData({ ...formData, mastery_threshold: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-stone-600 dark:text-stone-400 mb-1 block">
                    Description
                  </label>
                  <textarea
                    className="w-full min-h-[80px] px-3 py-2 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of program goals and methodology..."
                  />
                </div>
              </div>
            </div>

            {/* AI Stimuli Settings */}
            <div>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-3">
                AI Stimuli Generation
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="generate_ai"
                    checked={formData.generate_ai_stimuli}
                    onChange={(e) => setFormData({ ...formData, generate_ai_stimuli: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <label htmlFor="generate_ai" className="text-sm text-stone-900 dark:text-stone-100">
                    Generate AI stimuli images
                  </label>
                </div>

                {formData.generate_ai_stimuli && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-stone-600 dark:text-stone-400 mb-1 block">
                        Number of Stimuli
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="30"
                        value={formData.stimuli_count}
                        onChange={(e) => setFormData({ ...formData, stimuli_count: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-stone-600 dark:text-stone-400 mb-1 block">
                        Trials per Session
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="30"
                        value={formData.trial_count}
                        onChange={(e) => setFormData({ ...formData, trial_count: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Program"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
