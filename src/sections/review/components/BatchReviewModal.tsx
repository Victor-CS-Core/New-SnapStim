import { useState, useMemo, useCallback, useEffect } from "react";
import {
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Keyboard,
  SkipForward,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReviewStatusBadge from "./ReviewStatusBadge";
import { ConfidenceBar } from "./ConfidenceBadge";
import type {
  ReviewQueueItem,
  RejectionReason,
} from "../../../../product-plan/sections/review/types";

interface BatchReviewModalProps {
  items: ReviewQueueItem[];
  onClose: () => void;
  onApprove: (item: ReviewQueueItem) => void;
  onReject: (
    item: ReviewQueueItem,
    reason: RejectionReason,
    notes?: string,
  ) => void;
}

const rejectionReasons: { value: RejectionReason; label: string }[] = [
  { value: "image_quality", label: "Image quality" },
  { value: "incorrect_content", label: "Incorrect content" },
  { value: "not_age_appropriate", label: "Not age-appropriate" },
  { value: "too_complex", label: "Too complex" },
  { value: "too_simple", label: "Too simple" },
  { value: "copyright_concerns", label: "Copyright" },
  { value: "other", label: "Other" },
];

export default function BatchReviewModal({
  items,
  onClose,
  onApprove,
  onReject,
}: BatchReviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<RejectionReason | "">(
    "",
  );

  const pendingItems = useMemo(
    () => items.filter((i) => i.review_status === "pending"),
    [items],
  );

  const currentItem = pendingItems[currentIndex];
  const reviewedCount = reviewedIds.size;
  const totalCount = pendingItems.length;

  const goToNext = useCallback(() => {
    if (currentIndex < pendingItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowRejectForm(false);
      setRejectionReason("");
    }
  }, [currentIndex, pendingItems.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowRejectForm(false);
      setRejectionReason("");
    }
  }, [currentIndex]);

  const handleApprove = useCallback(() => {
    if (currentItem) {
      onApprove(currentItem);
      setReviewedIds((prev) => new Set([...prev, currentItem.stimulus_id]));
      if (currentIndex < pendingItems.length - 1) {
        goToNext();
      }
    }
  }, [currentItem, currentIndex, pendingItems.length, goToNext, onApprove]);

  const handleReject = useCallback(() => {
    if (currentItem && rejectionReason) {
      onReject(currentItem, rejectionReason);
      setReviewedIds((prev) => new Set([...prev, currentItem.stimulus_id]));
      setShowRejectForm(false);
      setRejectionReason("");
      if (currentIndex < pendingItems.length - 1) {
        goToNext();
      }
    }
  }, [
    currentItem,
    currentIndex,
    pendingItems.length,
    goToNext,
    onReject,
    rejectionReason,
  ]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showRejectForm) return;

      switch (e.key) {
        case "ArrowRight":
          goToNext();
          break;
        case "ArrowLeft":
          goToPrev();
          break;
        case "a":
        case "A":
          handleApprove();
          break;
        case "r":
        case "R":
          setShowRejectForm(true);
          break;
        case "Escape":
          if (showRejectForm) {
            setShowRejectForm(false);
          } else {
            onClose();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev, handleApprove, showRejectForm, onClose]);

  if (!currentItem) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="py-12 text-center">
            <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-4 inline-block mb-4">
              <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
              Batch Review Complete!
            </h3>
            <p className="text-stone-500 mt-2">
              You've reviewed {reviewedCount} stimuli.
            </p>
            <Button className="mt-6" onClick={onClose}>
              Return to Queue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-stone-900">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">Batch Review</h2>
          <Badge variant="secondary">
            {currentIndex + 1} of {totalCount}
          </Badge>
          <span className="text-stone-400">{reviewedCount} reviewed</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-stone-400 text-sm">
            <Keyboard className="h-4 w-4" />
            <span>← → Navigate</span>
            <span>|</span>
            <span>A Approve</span>
            <span>|</span>
            <span>R Reject</span>
            <span>|</span>
            <span>ESC Exit</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-stone-800">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        <div className="flex items-center gap-6 max-w-4xl w-full">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white h-12 w-12 flex-shrink-0"
            onClick={goToPrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          {/* Stimulus Card */}
          <Card className="flex-1 max-h-[70vh] overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {currentItem.program_name}
                  </CardTitle>
                  <p className="text-sm text-stone-500">
                    {currentItem.client_name}
                  </p>
                </div>
                <ReviewStatusBadge status={currentItem.review_status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto">
              {/* Image */}
              {currentItem.image_url ? (
                <div className="relative bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden flex items-center justify-center h-64">
                  <img
                    src={currentItem.image_url}
                    alt={currentItem.stimulus_text}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="bg-stone-100 dark:bg-stone-800 rounded-lg p-8 text-center h-32 flex items-center justify-center">
                  <span className="text-3xl font-semibold text-stone-400">
                    Aa
                  </span>
                </div>
              )}

              {/* Stimulus Text */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-lg text-center">
                <p className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
                  {currentItem.stimulus_text}
                </p>
              </div>

              {/* Confidence */}
              <div>
                <span className="text-sm text-stone-500">Confidence</span>
                <ConfidenceBar
                  score={currentItem.generation_metadata.confidence_score}
                />
              </div>

              {/* Rejection Form */}
              {showRejectForm && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {rejectionReasons.map((r) => (
                      <Button
                        key={r.value}
                        variant={
                          rejectionReason === r.value ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setRejectionReason(r.value)}
                      >
                        {r.label}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={!rejectionReason}
                    >
                      Confirm Reject
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowRejectForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white h-12 w-12 flex-shrink-0"
            onClick={goToNext}
            disabled={currentIndex === pendingItems.length - 1}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      {!showRejectForm && (
        <div className="flex justify-center gap-4 pb-8">
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 px-8"
            onClick={handleApprove}
          >
            <Check className="mr-2 h-5 w-5" />
            Approve (A)
          </Button>
          <Button
            size="lg"
            variant="destructive"
            className="px-8"
            onClick={() => setShowRejectForm(true)}
          >
            <X className="mr-2 h-5 w-5" />
            Reject (R)
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 text-white border-white/20 hover:bg-white/10"
            onClick={goToNext}
          >
            <SkipForward className="mr-2 h-5 w-5" />
            Skip
          </Button>
        </div>
      )}

      {/* Thumbnail Strip */}
      <div className="bg-stone-900 px-6 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {pendingItems.map((item, index) => (
            <button
              key={item.stimulus_id}
              onClick={() => {
                setCurrentIndex(index);
                setShowRejectForm(false);
              }}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? "border-primary ring-2 ring-primary/50"
                  : reviewedIds.has(item.stimulus_id)
                    ? "border-emerald-500 opacity-50"
                    : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.stimulus_text}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-stone-700 flex items-center justify-center">
                  <span className="text-xl text-stone-400">Aa</span>
                </div>
              )}
              {reviewedIds.has(item.stimulus_id) && (
                <div className="absolute inset-0 bg-emerald-500/50 flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
