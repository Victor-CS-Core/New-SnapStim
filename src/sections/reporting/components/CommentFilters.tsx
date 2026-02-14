import { Badge } from "@/components/ui/badge";
import type { CommentFilters as CommentFiltersType } from "../../../../product-plan/sections/reporting/types";

interface CommentFiltersProps {
  filters: CommentFiltersType;
  onFiltersChange: (filters: CommentFiltersType) => void;
}

export default function CommentFilters({
  filters,
  onFiltersChange,
}: CommentFiltersProps) {
  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag as any)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag as any];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const toggleUnreadOnly = () => {
    onFiltersChange({ ...filters, unread_only: !filters.unread_only });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const availableTags = [
    "urgent",
    "question",
    "recommendation",
    "review_needed",
    "resolved",
  ];

  const hasActiveFilters =
    filters.tags?.length || filters.unread_only || filters.role;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge
          onClick={toggleUnreadOnly}
          className={`cursor-pointer ${
            filters.unread_only
              ? "bg-emerald-600 text-white dark:bg-emerald-500"
              : "bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300"
          }`}
        >
          Unread Only
        </Badge>

        {availableTags.map((tag) => (
          <Badge
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`cursor-pointer ${
              filters.tags?.includes(tag as any)
                ? "bg-emerald-600 text-white dark:bg-emerald-500"
                : "bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300"
            }`}
          >
            {tag.replace("_", " ")}
          </Badge>
        ))}
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
