import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type {
  Comment,
  CommentVisibility,
  CommentTag,
} from "../../../../product-plan/sections/reporting/types";

interface NewCommentFormProps {
  clientId: string;
  programId?: string;
  sessionId?: string;
  currentUserId: string;
  currentUserRole: string;
  onSubmit: (comment: Partial<Comment>) => void;
  onCancel: () => void;
}

export default function NewCommentForm({
  clientId,
  programId,
  sessionId,
  currentUserId,
  currentUserRole,
  onSubmit,
  onCancel,
}: NewCommentFormProps) {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<CommentVisibility>("public");
  const [selectedTags, setSelectedTags] = useState<CommentTag[]>([]);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit({
        author_id: currentUserId,
        client_id: clientId,
        program_id: programId || null,
        session_id: sessionId || null,
        content: content.trim(),
        visibility,
        tags: selectedTags,
        parent_comment_id: null,
      });
      setContent("");
      setVisibility("public");
      setSelectedTags([]);
    }
  };

  const toggleTag = (tag: CommentTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const availableTags: CommentTag[] = [
    "urgent",
    "question",
    "recommendation",
    "review_needed",
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
          Comment
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment..."
          rows={4}
          className="w-full p-3 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
          Visibility
        </label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={visibility === "public" ? "default" : "outline"}
            size="sm"
            onClick={() => setVisibility("public")}
          >
            Public
          </Button>
          <Button
            type="button"
            variant={visibility === "clinical_team" ? "default" : "outline"}
            size="sm"
            onClick={() => setVisibility("clinical_team")}
          >
            Clinical Team
          </Button>
          {currentUserRole === "BCBA" && (
            <Button
              type="button"
              variant={visibility === "supervisor_only" ? "default" : "outline"}
              size="sm"
              onClick={() => setVisibility("supervisor_only")}
            >
              Supervisor Only
            </Button>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
          Tags
        </label>
        <div className="flex gap-2 flex-wrap">
          {availableTags.map((tag) => (
            <Badge
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`cursor-pointer ${
                selectedTags.includes(tag)
                  ? "bg-emerald-600 text-white dark:bg-emerald-500"
                  : "bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300"
              }`}
            >
              {tag.replace("_", " ")}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSubmit}>Post Comment</Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
