import { useState, useEffect } from "react";
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
import { UserCog } from "lucide-react";
import type { User } from "../../../../product-plan/sections/accounts/types";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (userData: EditUserFormData) => void;
  user: User;
}

export interface EditUserFormData {
  id: string;
  name: string;
  email: string;
  role: "BCBA" | "RBT" | "Caregiver";
  phone?: string;
  status: "Active" | "Inactive" | "Pending";
}

export default function EditUserModal({
  open,
  onClose,
  onSave,
  user,
}: EditUserModalProps) {
  const [formData, setFormData] = useState<EditUserFormData>({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || "",
    status: user.status,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when user prop changes
  useEffect(() => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      status: user.status,
    });
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onSave(formData);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>
          <UserCog className="inline-block mr-2 h-5 w-5" />
          Edit User Account
        </DialogTitle>
        <DialogDescription>
          Update user information and permissions
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Full Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Email Address *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Phone Number
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Role *
              </label>
              <select
                className="w-full rounded-md border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as "BCBA" | "RBT" | "Caregiver",
                  })
                }
                required
              >
                <option value="BCBA">
                  BCBA (Board Certified Behavior Analyst)
                </option>
                <option value="RBT">
                  RBT (Registered Behavior Technician)
                </option>
                <option value="Caregiver">Caregiver</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Status *
              </label>
              <select
                className="w-full rounded-md border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "Active" | "Inactive" | "Pending",
                  })
                }
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
              <p className="text-xs text-stone-500 dark:text-stone-400">
                * Required fields
              </p>
            </div>
          </div>
        </DialogContent>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
