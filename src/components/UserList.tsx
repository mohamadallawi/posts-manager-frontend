import type { User } from '../types/user';

interface UserListProps {
  users: User[];
  selectedUserId: string | null;
  editingId: string | null;
  onSelect: (userId: string | null) => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export function UserList({
  users,
  selectedUserId,
  editingId,
  onSelect,
  onEdit,
  onDelete,
}: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="empty-state">
        <p>No users yet. Create a user first to assign posts.</p>
      </div>
    );
  }

  return (
    <div className="user-list">
      <div className="list-header">
        <h2>Users ({users.length})</h2>
        <button
          type="button"
          className={`btn-filter ${selectedUserId === null ? 'active' : ''}`}
          onClick={() => onSelect(null)}
        >
          All Posts
        </button>
      </div>
      {users.map((user) => (
        <article
          key={user.id}
          className={`user-card ${editingId === user.id ? 'editing' : ''} ${
            selectedUserId === user.id ? 'selected' : ''
          }`}
        >
          <div className="user-info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
          <footer>
            <button type="button" onClick={() => onSelect(user.id)}>
              {selectedUserId === user.id ? 'Selected' : 'Filter Posts'}
            </button>
            <button type="button" onClick={() => onEdit(user)}>
              Edit
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={() => onDelete(user.id)}
            >
              Delete
            </button>
          </footer>
        </article>
      ))}
    </div>
  );
}
