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
import { UserPlus } from "lucide-react";

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (clientData: ClientFormData) => void;
}

export interface ClientFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  primary_therapist: string;
  tags: string[];
  guardian_name?: string;
  guardian_email?: string;
  guardian_phone?: string;
}

export default function AddClientModal({
  open,
  onClose,
  onAdd,
}: AddClientModalProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    primary_therapist: "usr_1",
    tags: [],
    guardian_name: "",
    guardian_email: "",
    guardian_phone: "",
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
        first_name: "",
        last_name: "",
        date_of_birth: "",
        primary_therapist: "usr_1",
        tags: [],
        guardian_name: "",
        guardian_email: "",
        guardian_phone: "",
      });
      onClose();
    }, 500);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader onClose={onClose}>
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          <div>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter client information to create a new profile
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <div className="space-y-4">
            {/* Client Information */}
            <div>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-3">
                Client Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-stone-600 dark:text-stone-400 mb-1 block">
                    First Name *
                  </label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    required
                    placeholder="Emma"
                  />
                </div>
                <div>
                  <label className="text-sm text-stone-600 dark:text-stone-400 mb-1 block">
                    Last Name *
                  </label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    required
                    placeholder="Rodriguez"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-sm text-stone-600 dark:text-stone-400 mb-1 block">
                    Date of Birth *
                  </label>
                  <Input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_of_birth: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-stone-600 dark:text-stone-400 mb-1 block">
                    Primary Therapist *
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                    value={formData.primary_therapist}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primary_therapist: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="usr_1">Dr. Sarah Chen (BCBA)</option>
                    <option value="usr_2">Mike Johnson (RBT)</option>
                    <option value="usr_3">Emma Davis (Caregiver)</option>
                    <option value="usr_4">Dr. James Wilson (BCBA)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Guardian Information */}
            <div>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-3">
                Guardian Information (Optional)
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-stone-600 dark:text-stone-400 mb-1 block">
                    Guardian Name
                  </label>
                  <Input
                    value={formData.guardian_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guardian_name: e.target.value,
                      })
                    }
                    placeholder="Parent or Guardian Name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-stone-600 dark:text-stone-400 mb-1 block">
                      Guardian Email
                    </label>
                    <Input
                      type="email"
                      value={formData.guardian_email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          guardian_email: e.target.value,
                        })
                      }
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-stone-600 dark:text-stone-400 mb-1 block">
                      Guardian Phone
                    </label>
                    <Input
                      type="tel"
                      value={formData.guardian_phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          guardian_phone: e.target.value,
                        })
                      }
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Client"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
