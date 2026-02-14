import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type {
  UserFilters as UserFiltersType,
  UserRole,
  UserStatus,
} from "../../../../product-plan/sections/accounts/types";

interface UserFiltersProps {
  filters: UserFiltersType;
  onFilterChange: (filters: UserFiltersType) => void;
}

const roles: (UserRole | "all")[] = ["all", "BCBA", "RBT", "Caregiver"];
const statuses: (UserStatus | "all")[] = [
  "all",
  "Active",
  "Inactive",
  "Pending",
];

export default function UserFilters({
  filters,
  onFilterChange,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={filters.search || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          className="pl-10"
          aria-label="Search users by name or email"
        />
      </div>

      {/* Role Filter */}
      <div className="flex gap-1">
        {roles.map((role) => (
          <Button
            key={role}
            variant={
              filters.role === role || (role === "all" && !filters.role)
                ? "default"
                : "outline"
            }
            size="sm"
            onClick={() =>
              onFilterChange({
                ...filters,
                role: role === "all" ? undefined : (role as UserRole),
              })
            }
            className="text-xs"
          >
            {role === "all" ? "All Roles" : role}
          </Button>
        ))}
      </div>

      {/* Status Filter */}
      <div className="flex gap-1">
        {statuses.map((status) => (
          <Button
            key={status}
            variant={
              filters.status === status || (status === "all" && !filters.status)
                ? "default"
                : "outline"
            }
            size="sm"
            onClick={() =>
              onFilterChange({
                ...filters,
                status: status === "all" ? undefined : (status as UserStatus),
              })
            }
            className="text-xs"
          >
            {status === "all" ? "All Status" : status}
          </Button>
        ))}
      </div>
    </div>
  );
}
