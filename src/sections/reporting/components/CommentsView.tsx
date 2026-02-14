import { useState, useMemo } from "react";
import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommentThread from "./CommentThread";
import NewCommentForm from "./NewCommentForm";
import CommentFilters from "./CommentFilters";
import reportingData from "../../../../product-plan/sections/reporting/data.json";
import type {
  Comment,
  CommentFilters as CommentFiltersType,
} from "../../../../product-plan/sections/reporting/types";

const comments = reportingData.comments as Comment[];

export default function CommentsView() {
  const [showNewCommentForm, setShowNewCommentForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<CommentFiltersType>({});

  // Mock current user data
  const currentUserId = "user-001";
  const currentUserRole = "BCBA";

  // Filter comments
  const filteredComments = useMemo(() => {
    let result = comments;

    if (filters.client_id) {
      result = result.filter((c) => c.client_id === filters.client_id);
    }

    if (filters.program_id) {
      result = result.filter((c) => c.program_id === filters.program_id);
    }

    if (filters.role) {
      result = result.filter((c) => c.author_role === filters.role);
    }

    if (filters.tags && filters.tags.length > 0) {
      result = result.filter((c) =>
        c.tags.some((tag) => filters.tags?.includes(tag)),
      );
    }

    if (filters.unread_only) {
      result = result.filter((c) => !c.read_by.includes(currentUserId));
    }

    return result;
  }, [filters]);

  // Organize comments into threads
  const threads = useMemo(() => {
    const topLevel = filteredComments.filter((c) => !c.parent_comment_id);
    return topLevel.map((comment) => ({
      comment,
      replies: filteredComments.filter(
        (c) => c.parent_comment_id === comment.comment_id,
      ),
    }));
  }, [filteredComments]);

  const handleNewComment = (comment: Partial<Comment>) => {
    console.log("New comment:", comment);
    setShowNewCommentForm(false);
    // In a real app, this would save to backend
  };

  const handleReply = (parentId: string, content: string) => {
    console.log("Reply to:", parentId, content);
    // In a real app, this would save to backend
  };

  const unreadCount = comments.filter(
    (c) => !c.read_by.includes(currentUserId),
  ).length;

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Comments & Communication</CardTitle>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                {unreadCount > 0 && (
                  <span className="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full text-xs font-medium mr-2">
                    {unreadCount} unread
                  </span>
                )}
                Team discussion and updates
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button onClick={() => setShowNewCommentForm(!showNewCommentForm)}>
                <Plus className="h-4 w-4 mr-2" />
                New Comment
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Filters */}
        {showFilters && (
          <CardContent className="border-t border-stone-200 dark:border-stone-700">
            <CommentFilters filters={filters} onFiltersChange={setFilters} />
          </CardContent>
        )}

        {/* New Comment Form */}
        {showNewCommentForm && (
          <CardContent className="border-t border-stone-200 dark:border-stone-700">
            <NewCommentForm
              clientId="client-001"
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              onSubmit={handleNewComment}
              onCancel={() => setShowNewCommentForm(false)}
            />
          </CardContent>
        )}
      </Card>

      {/* Comment Threads */}
      <div className="space-y-4">
        {threads.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-stone-500 dark:text-stone-400">
                No comments found. Start a conversation by creating a new
                comment.
              </p>
            </CardContent>
          </Card>
        ) : (
          threads.map((thread) => (
            <CommentThread
              key={thread.comment.comment_id}
              comment={thread.comment}
              replies={thread.replies}
              onReply={handleReply}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
            />
          ))
        )}
      </div>
    </div>
  );
}
