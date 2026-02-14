import { useState, useMemo } from "react";
import { Check, Inbox, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReviewFilters from "./ReviewFilters";
import type { ReviewFiltersState } from "./ReviewFilters";
import ReviewQueueCard from "./ReviewQueueCard";
import type { ReviewQueueItem } from "../../../../product-plan/sections/review/types";

interface ReviewQueueProps {
  items: ReviewQueueItem[];
  onViewItem: (item: ReviewQueueItem) => void;
  onApproveItem: (item: ReviewQueueItem) => void;
  onRejectItem: (item: ReviewQueueItem) => void;
  onBulkApprove: (items: ReviewQueueItem[]) => void;
  onBulkReject: (items: ReviewQueueItem[]) => void;
}

export default function ReviewQueue({
  items,
  onViewItem,
  onApproveItem,
  onRejectItem,
  onBulkApprove,
  onBulkReject,
}: ReviewQueueProps) {
  const [filters, setFilters] = useState<ReviewFiltersState>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          item.stimulus_text.toLowerCase().includes(searchLower) ||
          item.program_name.toLowerCase().includes(searchLower) ||
          item.client_name.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status && item.review_status !== filters.status) {
        return false;
      }

      // Program type filter
      if (filters.programType && item.program_type !== filters.programType) {
        return false;
      }

      // Image filter
      if (filters.hasImage !== undefined) {
        const hasImage = item.image_url !== null;
        if (filters.hasImage !== hasImage) return false;
      }

      return true;
    });
  }, [items, filters]);

  const pendingItems = filteredItems.filter(
    (i) => i.review_status === "pending",
  );
  const selectedItems = filteredItems.filter((i) =>
    selectedIds.has(i.stimulus_id),
  );
  const allSelected =
    pendingItems.length > 0 &&
    pendingItems.every((i) => selectedIds.has(i.stimulus_id));

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingItems.map((i) => i.stimulus_id)));
    }
  };

  const handleSelectItem = (item: ReviewQueueItem, selected: boolean) => {
    const newSet = new Set(selectedIds);
    if (selected) {
      newSet.add(item.stimulus_id);
    } else {
      newSet.delete(item.stimulus_id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkApprove = () => {
    onBulkApprove(selectedItems);
    setSelectedIds(new Set());
  };

  const handleBulkReject = () => {
    onBulkReject(selectedItems);
    setSelectedIds(new Set());
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">Review Queue</CardTitle>
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
            >
              {pendingItems.length} pending
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <ReviewFilters filters={filters} onFilterChange={setFilters} />

        {/* Bulk Action Toolbar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
              className="h-4 w-4 rounded border-stone-300 text-primary focus:ring-primary"
              aria-label="Select all items"
            />
            <span className="text-sm text-stone-600 dark:text-stone-400">
              {selectedIds.size} selected
            </span>
            <div className="flex-1" />
            <Button
              size="sm"
              variant="default"
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleBulkApprove}
            >
              <Check className="mr-1 h-4 w-4" />
              Approve Selected
            </Button>
            <Button size="sm" variant="destructive" onClick={handleBulkReject}>
              <X className="mr-1 h-4 w-4" />
              Reject Selected
            </Button>
          </div>
        )}

        {/* Select All (when not in selection mode) */}
        {selectedIds.size === 0 && pendingItems.length > 0 && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={false}
              onChange={handleSelectAll}
              className="h-4 w-4 rounded border-stone-300 text-primary focus:ring-primary"
              aria-label="Select all pending items"
            />
            <span className="text-sm text-stone-500 dark:text-stone-400">Select all pending</span>
          </div>
        )}

        {/* Queue Items */}
        {filteredItems.length > 0 ? (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <ReviewQueueCard
                key={item.stimulus_id}
                item={item}
                selected={selectedIds.has(item.stimulus_id)}
                onSelect={
                  item.review_status === "pending"
                    ? (selected) => handleSelectItem(item, selected)
                    : undefined
                }
                onView={() => onViewItem(item)}
                onApprove={() => onApproveItem(item)}
                onReject={() => onRejectItem(item)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-4 mb-4">
              <Inbox className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              {filters.status || filters.programType || filters.search
                ? "No matching stimuli"
                : "All caught up!"}
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-sm">
              {filters.status || filters.programType || filters.search
                ? "Try adjusting your filters to see more items."
                : "No stimuli pending review. All generated content has been reviewed!"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
