import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type {
  ProgramType,
  ProgramStatus,
} from "../../../../product-plan/sections/programs/types";

interface ProgramFilters {
  search?: string;
  type?: ProgramType;
  status?: ProgramStatus;
}

interface ProgramFiltersProps {
  filters: ProgramFilters;
  onFilterChange: (filters: ProgramFilters) => void;
}

const programTypes: (ProgramType | "all")[] = [
  "all",
  "receptive_identification",
  "expressive_labeling",
  "intraverbal",
  "listener_responding",
];

const typeLabels: Record<ProgramType | "all", string> = {
  all: "All Types",
  receptive_identification: "Receptive ID",
  expressive_labeling: "Expressive",
  intraverbal: "Intraverbal",
  listener_responding: "Listener",
};

const statuses: (ProgramStatus | "all")[] = [
  "all",
  "active",
  "paused",
  "mastered",
  "archived",
];

export default function ProgramFiltersComponent({
  filters,
  onFilterChange,
}: ProgramFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search programs..."
          value={filters.search || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          className="pl-10"
        />
      </div>

      {/* Type Filter */}
      <div className="flex flex-wrap gap-1">
        {programTypes.map((type) => (
          <Button
            key={type}
            variant={
              filters.type === type || (type === "all" && !filters.type)
                ? "default"
                : "outline"
            }
            size="sm"
            onClick={() =>
              onFilterChange({
                ...filters,
                type: type === "all" ? undefined : (type as ProgramType),
              })
            }
            className="text-xs"
          >
            {typeLabels[type]}
          </Button>
        ))}
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-1">
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
                status:
                  status === "all" ? undefined : (status as ProgramStatus),
              })
            }
            className="text-xs capitalize"
          >
            {status === "all" ? "All Status" : status}
          </Button>
        ))}
      </div>
    </div>
  );
}
