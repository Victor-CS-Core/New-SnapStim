import { useState, useEffect, useRef } from "react";
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
import { UserCog, Upload, X } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useAuth } from "@/contexts/AuthContext";
import type { Client } from "../../../../product-plan/sections/clients/types";

interface EditClientModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (clientData: EditClientFormData) => void;
  client: Client;
}

export interface EditClientFormData {
  client_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  primary_therapist: string;
  status: "active" | "inactive" | "discharged";
  tags: string[];
  avatar_url?: string;
  guardian_name?: string;
  guardian_email?: string;
  guardian_phone?: string;
}

export default function EditClientModal({
  open,
  onClose,
  onSave,
  client,
}: EditClientModalProps) {
  const { user } = useAuth();
  const { uploadImage, uploadState, resetUploadState } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<EditClientFormData>({
    client_id: client.client_id,
    first_name: client.first_name,
    last_name: client.last_name,
    date_of_birth: client.date_of_birth,
    primary_therapist: client.primary_therapist,
    status: client.status,
    tags: client.tags,
    avatar_url: client.avatar_url || "",
    guardian_name: "",
    guardian_email: "",
    guardian_phone: "",
  });

  const [imagePreview, setImagePreview] = useState<string>(client.avatar_url || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when client prop changes
  useEffect(() => {
    setFormData({
      client_id: client.client_id,
      first_name: client.first_name,
      last_name: client.last_name,
      date_of_birth: client.date_of_birth,
      primary_therapist: client.primary_therapist,
      status: client.status,
      tags: client.tags,
      avatar_url: client.avatar_url || "",
      guardian_name: "",
      guardian_email: "",
      guardian_phone: "",
    });
    setImagePreview(client.avatar_url || "");
  }, [client]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Firebase Storage
      const downloadURL = await uploadImage(file, user.uid, "client-avatars");
      setFormData({ ...formData, avatar_url: downloadURL });
    } catch (error) {
      console.error("Image upload failed:", error);
      setImagePreview(client.avatar_url || "");
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setFormData({ ...formData, avatar_url: "" });
    resetUploadState();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
          Edit Client Profile
        </DialogTitle>
        <DialogDescription>
          Update client information and guardian details
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <div className="space-y-6">
            {/* Profile Image Upload */}
            <div>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-3">
                Profile Image <span className="text-stone-500 font-normal">(Optional)</span>
              </h3>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-stone-200 dark:border-stone-700"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      disabled={uploadState.uploading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center border-2 border-dashed border-stone-300 dark:border-stone-600">
                    <UserCog className="h-8 w-8 text-stone-400" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="avatar-upload-edit"
                    disabled={uploadState.uploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadState.uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadState.uploading
                      ? `Uploading ${Math.round(uploadState.progress)}%`
                      : "Upload New Image"}
                  </Button>
                  {uploadState.error && (
                    <p className="text-xs text-red-500 mt-1">
                      {uploadState.error}
                    </p>
                  )}
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    JPG, PNG or GIF. Max 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                Client Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    First Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Last Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Date of Birth *
                </label>
                <Input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    setFormData({ ...formData, date_of_birth: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Primary Therapist *
                </label>
                <select
                  className="w-full rounded-md border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm"
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
                  <option value="usr_2">Marcus Johnson (RBT)</option>
                  <option value="usr_3">Emily Rodriguez (BCBA)</option>
                  <option value="usr_4">James Kim (RBT)</option>
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
                      status: e.target.value as
                        | "active"
                        | "inactive"
                        | "discharged",
                    })
                  }
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="discharged">Discharged</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Tags (comma separated)
                </label>
                <Input
                  type="text"
                  value={formData.tags.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g., verbal, non-verbal, autism"
                />
              </div>
            </div>

            {/* Guardian Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                Guardian Information (Optional)
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Guardian Name
                </label>
                <Input
                  type="text"
                  value={formData.guardian_name}
                  onChange={(e) =>
                    setFormData({ ...formData, guardian_name: e.target.value })
                  }
                  placeholder="Full name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Guardian Email
                </label>
                <Input
                  type="email"
                  value={formData.guardian_email}
                  onChange={(e) =>
                    setFormData({ ...formData, guardian_email: e.target.value })
                  }
                  placeholder="guardian@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Guardian Phone
                </label>
                <Input
                  type="tel"
                  value={formData.guardian_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, guardian_phone: e.target.value })
                  }
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting || uploadState.uploading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || uploadState.uploading}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
