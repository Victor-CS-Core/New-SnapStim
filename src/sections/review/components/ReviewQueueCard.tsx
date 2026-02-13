import { Check, Eye, Image, RefreshCw, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReviewStatusBadge from "./ReviewStatusBadge";
import ConfidenceBadge from "./ConfidenceBadge";
import type { ReviewQueueItem } from "../../../../product-plan/sections/review/types";

interface ReviewQueueCardProps {
  item: ReviewQueueItem;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onView?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const programTypeLabels: Record<string, string> = {
  expressive_labeling: "Expressive",
  receptive_identification: "Receptive ID",
  intraverbal: "Intraverbal",
  listener_responding: "Listener",
};

export default function ReviewQueueCard({
  item,
  selected = false,
  onSelect,
  onView,
  onApprove,
  onReject,
}: ReviewQueueCardProps) {
  const hasRegeneration = item.regeneration_history.regeneration_count > 0;

  return (
    <Card
      className={`transition-all hover:shadow-md ${
        selected ? "ring-2 ring-primary" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Checkbox */}
          {onSelect && (
            <div className="flex items-start pt-1">
              <input
                type="checkbox"
                checked={selected}
                onChange={(e) => onSelect(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-primary focus:ring-primary"
              />
            </div>
          )}

          {/* Image/Text Preview */}
          <div className="flex-shrink-0">
            {item.image_url ? (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={item.image_url}
                  alt={item.stimulus_text}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                <span className="text-2xl font-semibold text-stone-400">
                  Aa
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-900 dark:text-stone-100 truncate">
                  {item.stimulus_text}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {programTypeLabels[item.program_type] || item.program_type}
                  </Badge>
                  <span className="text-xs text-stone-500">
                    {item.program_name}
                  </span>
                </div>
              </div>
              <ReviewStatusBadge status={item.review_status} />
            </div>

            <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
              <span>{item.client_name}</span>
              <span>•</span>
              <span>
                {formatDate(item.generation_metadata.generation_date)}
              </span>
              {item.image_url && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Image className="h-3 w-3" />
                    Image
                  </span>
                </>
              )}
              {hasRegeneration && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <RefreshCw className="h-3 w-3" />
                    Regen #{item.regeneration_history.regeneration_count}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500">Confidence:</span>
                <ConfidenceBadge
                  score={item.generation_metadata.confidence_score}
                />
              </div>

              {item.review_status === "pending" && (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={onView}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    onClick={onApprove}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={onReject}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
