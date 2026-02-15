import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <Card className="p-12">
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        <div className="rounded-full bg-stone-100 dark:bg-stone-800 p-4 mb-4">
          <Icon className="h-8 w-8 text-stone-400 dark:text-stone-500" />
        </div>
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
          {title}
        </h3>
        <p className="text-stone-500 dark:text-stone-400 mb-6">
          {description}
        </p>
        {action && (
          <div className="flex gap-3">
            <Button onClick={action.onClick}>{action.label}</Button>
            {secondaryAction && (
              <Button variant="outline" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
