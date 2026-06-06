import type { Post } from '../types/post';
import type { User } from '../types/user';
import { CommentSection } from './CommentSection';

interface PostListProps {
  posts: Post[];
  users: User[];
  selectedUserId: string | null;
  editingId: string | null;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString();
}

export function PostList({
  posts,
  users,
  selectedUserId,
  editingId,
  onEdit,
  onDelete,
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <p>No posts yet. Create your first post above!</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      <h2>Posts ({posts.length})</h2>
      {posts.map((post) => (
        <article
          key={post.id}
          className={`post-card ${editingId === post.id ? 'editing' : ''}`}
        >
          <header>
            <div>
              <h3>{post.title}</h3>
              <span className="post-author">by {post.user.name}</span>
            </div>
            <time>{formatDate(post.updatedAt)}</time>
          </header>
          <p>{post.content}</p>
          <footer>
            <button type="button" onClick={() => onEdit(post)}>
              Edit
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={() => onDelete(post.id)}
            >
              Delete
            </button>
          </footer>
          <CommentSection
            postId={post.id}
            users={users}
            defaultUserId={selectedUserId}
          />
        </article>
      ))}
    </div>
  );
}
