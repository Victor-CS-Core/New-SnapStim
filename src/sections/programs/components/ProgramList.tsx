import {
  MoreHorizontal,
  Play,
  Eye,
  Pause,
  Archive,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProgramTypeBadge from "./ProgramTypeBadge";
import ProgramStatusBadge from "./ProgramStatusBadge";
import TrendIndicator from "./TrendIndicator";
import type { Program } from "../../../../product-plan/sections/programs/types";

interface ProgramListProps {
  programs: Program[];
  onViewProgram?: (programId: string) => void;
  onPause?: (programId: string) => void;
  onArchive?: (programId: string) => void;
  onStartSession?: (programId: string) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProgramList({
  programs,
  onViewProgram,
  onPause,
  onArchive,
  onStartSession,
}: ProgramListProps) {
  if (programs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-stone-100 dark:bg-stone-800 p-4 mb-4">
          <FolderOpen className="h-8 w-8 text-stone-400" />
        </div>
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          No programs found
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Try adjusting your filters or create a new program.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-stone-200 dark:border-stone-800">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Program</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Accuracy</TableHead>
            <TableHead>Trend</TableHead>
            <TableHead>Last Run</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.map((program) => {
            const accuracyColor =
              program.performance.accuracy_percent >= program.mastery_threshold
                ? "text-emerald-600 dark:text-emerald-400"
                : program.performance.accuracy_percent >=
                    program.mastery_threshold - 10
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-red-600 dark:text-red-400";

            return (
              <TableRow
                key={program.program_id}
                className="cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/50"
                onClick={() => onViewProgram?.(program.program_id)}
              >
                <TableCell>
                  <div>
                    <div className="font-medium text-stone-900 dark:text-stone-100">
                      {program.program_name}
                    </div>
                    <div className="text-sm text-stone-500 dark:text-stone-400">
                      {program.category} •{" "}
                      {program.performance.sessions_to_date} sessions
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <ProgramTypeBadge type={program.program_type} />
                </TableCell>
                <TableCell>
                  <ProgramStatusBadge status={program.status} />
                </TableCell>
                <TableCell className="text-right">
                  <span className={`font-semibold ${accuracyColor}`}>
                    {program.performance.accuracy_percent}%
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 ml-1">
                    / {program.mastery_threshold}%
                  </span>
                </TableCell>
                <TableCell>
                  <TrendIndicator
                    trend={program.performance.trend}
                    showLabel={false}
                  />
                </TableCell>
                <TableCell className="text-stone-500 dark:text-stone-400 text-sm">
                  {formatDate(program.last_run_date)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewProgram?.(program.program_id);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {program.status === "active" && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartSession?.(program.program_id);
                          }}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Start Session
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onPause?.(program.program_id);
                        }}
                      >
                        <Pause className="mr-2 h-4 w-4" />
                        {program.status === "paused" ? "Resume" : "Pause"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onArchive?.(program.program_id);
                        }}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
