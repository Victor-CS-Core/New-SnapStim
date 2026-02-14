import { useState } from "react";
import { Reply, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CommentTagBadge from "./CommentTagBadge";
import VisibilityBadge from "./VisibilityBadge";
import type { Comment, UserRole } from "../../../../product-plan/sections/reporting/types";

interface CommentThreadProps {
  comment: Comment;
  replies: Comment[];
  onReply: (parentId: string, content: string) => void;
  currentUserId: string;
  currentUserRole: string;
}

export default function CommentThread({
  comment,
  replies,
  onReply,
  currentUserId,
}: CommentThreadProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(comment.comment_id, replyContent);
      setReplyContent("");
      setShowReplyForm(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const isUnread = !comment.read_by.includes(currentUserId);

  const getRoleBadgeColor = (role: UserRole) => {
    const colors = {
      BCBA: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      RBT: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Caregiver: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      Admin: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
    };
    return colors[role] || colors.Admin;
  };

  const renderComment = (c: Comment, isReply: boolean = false) => {
    const isUnreadReply = !c.read_by.includes(currentUserId);

    return (
      <div
        key={c.comment_id}
        className={`${isReply ? "ml-8 mt-4" : ""} ${isUnreadReply ? "bg-emerald-50 dark:bg-emerald-950/10" : ""}`}
      >
        <div className="space-y-3">
          {/* Author Info */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-stone-900 dark:text-stone-100">
                {c.author_name}
              </span>
              <Badge className={getRoleBadgeColor(c.author_role)}>{c.author_role}</Badge>
              <VisibilityBadge visibility={c.visibility} />
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <Clock className="h-3 w-3" />
              {formatTimestamp(c.created_at)}
              {c.edited && <span className="italic">(edited)</span>}
            </div>
          </div>

          {/* Content */}
          <div className="text-stone-700 dark:text-stone-300 prose prose-sm dark:prose-invert max-w-none">
            {c.content}
          </div>

          {/* Tags */}
          {c.tags.length > 0 && (
            <div className="flex gap-2">
              {c.tags.map((tag) => (
                <CommentTagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}

          {/* Attachments */}
          {c.attachments.length > 0 && (
            <div className="text-sm text-stone-500 dark:text-stone-400">
              {c.attachments.length} attachment(s)
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className={isUnread ? "border-emerald-300 dark:border-emerald-700" : ""}>
      <CardContent className="pt-6">
        {/* Main Comment */}
        {renderComment(comment)}

        {/* Reply Button */}
        {!showReplyForm && (
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(true)}
            >
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
          </div>
        )}

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4 space-y-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="w-full min-h-[100px] p-3 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex gap-2">
              <Button onClick={handleSubmitReply} size="sm">
                Submit Reply
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyContent("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Replies */}
        {replies.length > 0 && (
          <div className="mt-6 space-y-4 border-t border-stone-200 dark:border-stone-700 pt-6">
            {replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
