import { MoreHorizontal, Mail, UserX, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";
import type { User } from "../../../../product-plan/sections/accounts/types";

interface UserListProps {
  users: User[];
  onUserClick?: (userId: string) => void;
  onEditUser?: (userId: string) => void;
  onDeactivateUser?: (userId: string) => void;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function UserList({
  users,
  onUserClick,
  onEditUser,
  onDeactivateUser,
}: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-stone-100 dark:bg-stone-800 p-4 mb-4">
          <UserX className="h-8 w-8 text-stone-400" />
        </div>
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          No users found
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Try adjusting your filters or add a new user.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-stone-200 dark:border-stone-800">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/50"
              onClick={() => onUserClick?.(user.id)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-stone-900 dark:text-stone-100">
                      {user.name}
                    </div>
                    <div className="text-sm text-stone-500 dark:text-stone-400">
                      {user.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <RoleBadge role={user.role} />
              </TableCell>
              <TableCell>
                <StatusBadge status={user.status} />
              </TableCell>
              <TableCell className="text-stone-500 dark:text-stone-400 text-sm">
                {formatDate(user.lastActiveAt)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onUserClick?.(user.id);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditUser?.(user.id);
                      }}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeactivateUser?.(user.id);
                      }}
                      className="text-red-600 dark:text-red-400"
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      {user.status === "Active" ? "Deactivate" : "Reactivate"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
