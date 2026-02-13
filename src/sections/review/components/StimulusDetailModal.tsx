import { useState } from "react";
import {
  X,
  Check,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ExternalLink,
  Clock,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ReviewStatusBadge from "./ReviewStatusBadge";
import { ConfidenceBar } from "./ConfidenceBadge";
import type {
  ReviewQueueItem,
  RejectionReason,
} from "../../../../product-plan/sections/review/types";

interface StimulusDetailModalProps {
  item: ReviewQueueItem;
  onClose: () => void;
  onApprove: () => void;
  onReject: (
    reason: RejectionReason,
    notes?: string,
    regenerate?: boolean,
  ) => void;
  onSkip?: () => void;
}

const rejectionReasons: { value: RejectionReason; label: string }[] = [
  { value: "image_quality", label: "Image quality issues" },
  { value: "incorrect_content", label: "Incorrect content" },
  { value: "not_age_appropriate", label: "Not age-appropriate" },
  { value: "too_complex", label: "Too complex" },
  { value: "too_simple", label: "Too simple" },
  { value: "copyright_concerns", label: "Copyright concerns" },
  { value: "other", label: "Other" },
];

const programTypeLabels: Record<string, string> = {
  expressive_labeling: "Expressive Labeling",
  receptive_identification: "Receptive Identification",
  intraverbal: "Intraverbal",
  listener_responding: "Listener Responding",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StimulusDetailModal({
  item,
  onClose,
  onApprove,
  onReject,
  onSkip,
}: StimulusDetailModalProps) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<RejectionReason | "">(
    "",
  );
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [regenerate, setRegenerate] = useState(true);
  const [zoom, setZoom] = useState(100);

  const handleReject = () => {
    if (rejectionReason) {
      onReject(rejectionReason, rejectionNotes || undefined, regenerate);
    }
  };

  const hasLowConfidence = item.generation_metadata.confidence_score < 0.5;
  const hasRegenerations = item.regeneration_history.regeneration_count > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <CardTitle className="text-xl">{item.program_name}</CardTitle>
              <ReviewStatusBadge status={item.review_status} />
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm text-stone-500">
              <Badge variant="outline">
                {programTypeLabels[item.program_type]}
              </Badge>
              <span>•</span>
              <span>{item.client_name}</span>
              <span>•</span>
              <Clock className="h-3 w-3" />
              <span>
                {formatDate(item.generation_metadata.generation_date)}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Warnings */}
          {(hasLowConfidence || hasRegenerations) && (
            <div className="flex gap-3 flex-wrap">
              {hasLowConfidence && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  Low confidence score - review carefully
                </div>
              )}
              {hasRegenerations && (
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg text-sm">
                  <RefreshCw className="h-4 w-4" />
                  Regenerated {
                    item.regeneration_history.regeneration_count
                  }{" "}
                  time(s)
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              {/* Image Preview */}
              {item.image_url ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                      Image Preview
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setZoom(Math.max(50, zoom - 25))}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <span className="px-2 py-1 text-sm">{zoom}%</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setZoom(Math.min(300, zoom + 25))}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(item.image_url!, "_blank")}
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="relative bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]">
                    <img
                      src={item.image_url}
                      alt={item.stimulus_text}
                      className="max-w-full transition-transform"
                      style={{ transform: `scale(${zoom / 100})` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-stone-100 dark:bg-stone-800 rounded-lg p-8 text-center">
                  <span className="text-4xl font-semibold text-stone-400">
                    Aa
                  </span>
                  <p className="text-sm text-stone-500 mt-2">
                    Text-only stimulus
                  </p>
                </div>
              )}

              {/* Stimulus Text */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
                <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
                  Stimulus Text
                </span>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100 mt-1">
                  {item.stimulus_text}
                </p>
                {item.generation_metadata.acceptable_answers && (
                  <div className="mt-3">
                    <span className="text-sm text-stone-500">
                      Acceptable answers:
                    </span>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {item.generation_metadata.acceptable_answers.map(
                        (answer) => (
                          <Badge key={answer} variant="outline">
                            {answer}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Confidence Score */}
              <div>
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  AI Confidence
                </span>
                <div className="mt-2">
                  <ConfidenceBar
                    score={item.generation_metadata.confidence_score}
                  />
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-4">
              {/* Generation Metadata */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-lg space-y-3">
                <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Generation Info
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Model</span>
                    <span className="font-medium text-stone-700 dark:text-stone-300">
                      {item.generation_metadata.model}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Batch</span>
                    <span className="font-mono text-xs text-stone-700 dark:text-stone-300">
                      {item.generation_metadata.batch_id}
                    </span>
                  </div>
                  {item.generation_metadata.image_resolution && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Resolution</span>
                      <span className="text-stone-700 dark:text-stone-300">
                        {item.generation_metadata.image_resolution}
                      </span>
                    </div>
                  )}
                  {item.generation_metadata.clarity_score && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Clarity</span>
                      <span className="text-stone-700 dark:text-stone-300">
                        {Math.round(
                          item.generation_metadata.clarity_score * 100,
                        )}
                        %
                      </span>
                    </div>
                  )}
                </div>
                <Separator />
                <div>
                  <span className="text-xs text-stone-500">Prompt</span>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                    "{item.generation_metadata.prompt}"
                  </p>
                </div>
              </div>

              {/* Program Link */}
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Program
              </Button>

              {/* Regeneration History */}
              {hasRegenerations && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg space-y-2">
                  <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                    Regeneration History
                  </h4>
                  {item.regeneration_history.improvement_notes.map(
                    (note, i) => (
                      <p
                        key={i}
                        className="text-sm text-amber-700 dark:text-amber-400"
                      >
                        • {note}
                      </p>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Rejection Form */}
          {showRejectForm ? (
            <div className="space-y-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 className="font-semibold text-red-800 dark:text-red-300">
                Rejection Feedback
              </h4>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Reason *
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) =>
                    setRejectionReason(e.target.value as RejectionReason)
                  }
                  className="w-full rounded-md border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm"
                >
                  <option value="">Select a reason...</option>
                  {rejectionReasons.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  placeholder="Describe what needs to be improved..."
                  className="w-full rounded-md border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm min-h-[80px]"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="regenerate"
                  checked={regenerate}
                  onChange={(e) => setRegenerate(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="regenerate"
                  className="text-sm text-stone-700 dark:text-stone-300"
                >
                  Request regeneration with improved parameters
                </label>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={!rejectionReason}
                >
                  <X className="mr-2 h-4 w-4" />
                  Confirm Rejection
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRejectForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            /* Action Buttons */
            <div className="flex gap-3 pt-2">
              {item.review_status === "pending" && (
                <>
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={onApprove}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setShowRejectForm(true)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}
              {onSkip && (
                <Button variant="outline" onClick={onSkip}>
                  Skip
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
