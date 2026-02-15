import { useState, useRef } from "react";
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
import { UserPlus, Upload, X } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useAuth } from "@/contexts/AuthContext";

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
  avatar_url?: string;
  guardian_name?: string;
  guardian_email?: string;
  guardian_phone?: string;
}

export default function AddClientModal({
  open,
  onClose,
  onAdd,
}: AddClientModalProps) {
  const { user } = useAuth();
  const { uploadImage, uploadState, resetUploadState } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ClientFormData>({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    primary_therapist: "usr_1",
    tags: [],
    avatar_url: "",
    guardian_name: "",
    guardian_email: "",
    guardian_phone: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setImagePreview("");
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
      onAdd(formData);
      setIsSubmitting(false);
      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        date_of_birth: "",
        primary_therapist: "usr_1",
        tags: [],
        avatar_url: "",
        guardian_name: "",
        guardian_email: "",
        guardian_phone: "",
      });
      setImagePreview("");
      resetUploadState();
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
                    <UserPlus className="h-8 w-8 text-stone-400" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="avatar-upload"
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
                      : "Upload Image"}
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
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting || uploadState.uploading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || uploadState.uploading}>
            {isSubmitting ? "Adding..." : "Add Client"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
