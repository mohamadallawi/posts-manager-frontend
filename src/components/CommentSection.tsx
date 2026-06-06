import { FormEvent, useCallback, useEffect, useState } from 'react';
import { commentsApi } from '../api/comments';
import type { Comment } from '../types/comment';
import type { User } from '../types/user';

interface CommentSectionProps {
  postId: string;
  users: User[];
  defaultUserId?: string | null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString();
}

export function CommentSection({
  postId,
  users,
  defaultUserId,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState(defaultUserId ?? users[0]?.id ?? '');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    try {
      setError(null);
      const data = await commentsApi.getByPost(postId);
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    setLoading(true);
    loadComments();
  }, [loadComments]);

  useEffect(() => {
    if (defaultUserId) setUserId(defaultUserId);
    else if (users[0]) setUserId(users[0].id);
  }, [defaultUserId, users]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !userId) return;

    setSubmitting(true);
    try {
      await commentsApi.create(postId, {
        content: content.trim(),
        userId,
      });
      setContent('');
      await loadComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await commentsApi.remove(id);
      await loadComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
    }
  };

  if (users.length === 0) {
    return (
      <p className="comments-empty">Create a user to add comments.</p>
    );
  }

  return (
    <div className="comment-section">
      <h4>Comments ({comments.length})</h4>

      {error && <p className="comment-error">{error}</p>}

      <form className="comment-form" onSubmit={handleSubmit}>
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          aria-label="Comment author"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          rows={2}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Posting...' : 'Add Comment'}
        </button>
      </form>

      {loading ? (
        <p className="comments-loading">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="comments-empty">No comments yet.</p>
      ) : (
        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <div className="comment-meta">
                <strong>{comment.user.name}</strong>
                <time>{formatDate(comment.createdAt)}</time>
              </div>
              <p>{comment.content}</p>
              <button
                type="button"
                className="btn-danger btn-small"
                onClick={() => handleDelete(comment.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
