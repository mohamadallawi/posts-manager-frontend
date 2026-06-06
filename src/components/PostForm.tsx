import { FormEvent, useEffect, useState } from 'react';
import type { Post } from '../types/post';
import type { User } from '../types/user';

interface PostFormProps {
  users: User[];
  initialPost?: Post | null;
  defaultUserId?: string | null;
  onSubmit: (data: { title: string; content: string; userId: string }) => Promise<void>;
  onCancel?: () => void;
}

export function PostForm({
  users,
  initialPost,
  defaultUserId,
  onSubmit,
  onCancel,
}: PostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title);
      setContent(initialPost.content);
      setUserId(initialPost.userId);
    } else {
      setTitle('');
      setContent('');
      setUserId(defaultUserId ?? users[0]?.id ?? '');
    }
  }, [initialPost, defaultUserId, users]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !userId) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        userId,
      });
      if (!initialPost) {
        setTitle('');
        setContent('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialPost && users.length === 0) {
    return (
      <div className="empty-state">
        <p>Create at least one user before adding posts.</p>
      </div>
    );
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h2>{initialPost ? 'Edit Post' : 'Create New Post'}</h2>
      {!initialPost && (
        <div className="form-group">
          <label htmlFor="post-user">Author</label>
          <select
            id="post-user"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content..."
          rows={5}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : initialPost ? 'Update Post' : 'Create Post'}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
