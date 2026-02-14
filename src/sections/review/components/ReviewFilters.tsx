import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ReviewStatus } from "../../../../product-plan/sections/review/types";

type ProgramType =
  | "expressive_labeling"
  | "receptive_identification"
  | "intraverbal"
  | "listener_responding";

export interface ReviewFiltersState {
  search?: string;
  status?: ReviewStatus;
  programType?: ProgramType;
  hasImage?: boolean;
}

interface ReviewFiltersProps {
  filters: ReviewFiltersState;
  onFilterChange: (filters: ReviewFiltersState) => void;
}

const statuses: (ReviewStatus | "all")[] = [
  "all",
  "pending",
  "approved",
  "rejected",
];

const programTypes: (ProgramType | "all")[] = [
  "all",
  "expressive_labeling",
  "receptive_identification",
  "intraverbal",
  "listener_responding",
];

const programTypeLabels: Record<ProgramType | "all", string> = {
  all: "All Types",
  expressive_labeling: "Expressive",
  receptive_identification: "Receptive ID",
  intraverbal: "Intraverbal",
  listener_responding: "Listener",
};

export default function ReviewFilters({
  filters,
  onFilterChange,
}: ReviewFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "");

  const handleSearchSubmit = () => {
    onFilterChange({ ...filters, search: searchInput || undefined });
  };

  const handleStatusChange = (status: ReviewStatus | "all") => {
    onFilterChange({
      ...filters,
      status: status === "all" ? undefined : status,
    });
  };

  const handleProgramTypeChange = (type: ProgramType | "all") => {
    onFilterChange({
      ...filters,
      programType: type === "all" ? undefined : type,
    });
  };

  const handleImageFilterChange = (hasImage: boolean | "all") => {
    onFilterChange({
      ...filters,
      hasImage: hasImage === "all" ? undefined : hasImage,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Search stimuli..."
            className="pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            aria-label="Search stimuli"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-1 flex-wrap">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={
                (filters.status || "all") === status ? "default" : "outline"
              }
              size="sm"
              onClick={() => handleStatusChange(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        {/* Program Type Filter */}
        <div className="flex gap-1 flex-wrap">
          {programTypes.map((type) => (
            <Button
              key={type}
              variant={
                (filters.programType || "all") === type ? "default" : "outline"
              }
              size="sm"
              onClick={() => handleProgramTypeChange(type)}
            >
              {programTypeLabels[type]}
            </Button>
          ))}
        </div>

        {/* Image Filter */}
        <div className="flex gap-1">
          <Button
            variant={filters.hasImage === undefined ? "default" : "outline"}
            size="sm"
            onClick={() => handleImageFilterChange("all")}
          >
            All
          </Button>
          <Button
            variant={filters.hasImage === true ? "default" : "outline"}
            size="sm"
            onClick={() => handleImageFilterChange(true)}
          >
            With Images
          </Button>
          <Button
            variant={filters.hasImage === false ? "default" : "outline"}
            size="sm"
            onClick={() => handleImageFilterChange(false)}
          >
            Text Only
          </Button>
        </div>
      </div>
    </div>
  );
}
