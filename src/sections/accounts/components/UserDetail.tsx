import {
  X,
  Mail,
  Phone,
  Calendar,
  Edit,
  Users,
  FolderOpen,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";
import type { User } from "../../../../product-plan/sections/accounts/types";

interface UserDetailProps {
  user: User;
  onClose: () => void;
  onEdit?: () => void;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function UserDetail({ user, onClose, onEdit }: UserDetailProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <RoleBadge role={user.role} />
                <StatusBadge status={user.status} />
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
              Contact Information
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-stone-400" />
                <span className="text-stone-600 dark:text-stone-400">
                  {user.email}
                </span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-stone-400" />
                  <span className="text-stone-600 dark:text-stone-400">
                    {user.phone}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Activity */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
              Activity
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-stone-400" />
                <span className="text-stone-500 dark:text-stone-500">
                  Member since
                </span>
                <span className="text-stone-600 dark:text-stone-400">
                  {formatDate(user.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-stone-400" />
                <span className="text-stone-500 dark:text-stone-500">
                  Last active
                </span>
                <span className="text-stone-600 dark:text-stone-400">
                  {formatDate(user.lastActiveAt)}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Assignments */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
              Assignments
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 dark:bg-stone-800">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                    {user.assignedClients.length}
                  </div>
                  <div className="text-xs text-stone-500">Clients</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 dark:bg-stone-800">
                <FolderOpen className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                    {user.assignedPrograms?.length || 0}
                  </div>
                  <div className="text-xs text-stone-500">Programs</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
