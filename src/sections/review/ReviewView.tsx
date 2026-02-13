import { useState } from "react";
import { BarChart3, ClipboardList, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReviewQueue from "./components/ReviewQueue";
import StimulusDetailModal from "./components/StimulusDetailModal";
import BatchReviewModal from "./components/BatchReviewModal";
import ReviewAnalytics from "./components/ReviewAnalytics";
import reviewData from "../../../product-plan/sections/review/data.json";
import type {
  ReviewQueueItem,
  ReviewAction,
  ReviewAnalytics as ReviewAnalyticsType,
  RejectionReason,
} from "../../../product-plan/sections/review/types";

type ViewMode = "queue" | "analytics";

export default function ReviewView() {
  const [viewMode, setViewMode] = useState<ViewMode>("queue");
  const [selectedItem, setSelectedItem] = useState<ReviewQueueItem | null>(
    null,
  );
  const [batchReviewMode, setBatchReviewMode] = useState(false);

  // Load data from JSON
  const queueItems = reviewData.review_queue as ReviewQueueItem[];
  const reviewActions = reviewData.review_actions as ReviewAction[];
  const analytics = reviewData.review_analytics as ReviewAnalyticsType;

  const pendingCount = queueItems.filter(
    (i) => i.review_status === "pending",
  ).length;

  // Handlers for review actions
  const handleViewItem = (item: ReviewQueueItem) => {
    setSelectedItem(item);
  };

  const handleApproveItem = (item: ReviewQueueItem) => {
    // In a real app, this would update the backend
    console.log("Approved:", item.stimulus_id);
    setSelectedItem(null);
  };

  const handleRejectItem = (
    item: ReviewQueueItem,
    reason?: RejectionReason,
    notes?: string,
    regenerate?: boolean,
  ) => {
    // In a real app, this would update the backend
    console.log("Rejected:", item.stimulus_id, { reason, notes, regenerate });
    setSelectedItem(null);
  };

  const handleBulkApprove = (items: ReviewQueueItem[]) => {
    console.log(
      "Bulk approved:",
      items.map((i) => i.stimulus_id),
    );
  };

  const handleBulkReject = (items: ReviewQueueItem[]) => {
    // In a real app, this would open a bulk rejection dialog
    console.log(
      "Bulk rejected:",
      items.map((i) => i.stimulus_id),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Review
          </h1>
          <p className="text-stone-500 dark:text-stone-400">
            Review AI-generated stimuli before use in programs
          </p>
        </div>
        <div className="flex gap-2">
          {viewMode === "queue" && pendingCount > 0 && (
            <Button variant="outline" onClick={() => setBatchReviewMode(true)}>
              <Layers className="mr-2 h-4 w-4" />
              Batch Review ({pendingCount})
            </Button>
          )}
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg w-fit">
        <Button
          variant={viewMode === "queue" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("queue")}
        >
          <ClipboardList className="mr-2 h-4 w-4" />
          Review Queue
        </Button>
        <Button
          variant={viewMode === "analytics" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("analytics")}
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          Analytics
        </Button>
      </div>

      {/* Content */}
      {viewMode === "queue" ? (
        <ReviewQueue
          items={queueItems}
          onViewItem={handleViewItem}
          onApproveItem={handleApproveItem}
          onRejectItem={(item) => handleRejectItem(item)}
          onBulkApprove={handleBulkApprove}
          onBulkReject={handleBulkReject}
        />
      ) : (
        <ReviewAnalytics analytics={analytics} recentActions={reviewActions} />
      )}

      {/* Stimulus Detail Modal */}
      {selectedItem && !batchReviewMode && (
        <StimulusDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onApprove={() => handleApproveItem(selectedItem)}
          onReject={(reason, notes, regenerate) =>
            handleRejectItem(selectedItem, reason, notes, regenerate)
          }
        />
      )}

      {/* Batch Review Modal */}
      {batchReviewMode && (
        <BatchReviewModal
          items={queueItems}
          onClose={() => setBatchReviewMode(false)}
          onApprove={(item) => handleApproveItem(item)}
          onReject={(item, reason, notes) =>
            handleRejectItem(item, reason, notes)
          }
        />
      )}
    </div>
  );
}
