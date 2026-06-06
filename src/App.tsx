import { useCallback, useEffect, useState } from 'react';
import { postsApi } from './api/posts';
import { usersApi } from './api/users';
import { PostForm } from './components/PostForm';
import { PostList } from './components/PostList';
import { UserForm } from './components/UserForm';
import { UserList } from './components/UserList';
import type { Post } from './types/post';
import type { User } from './types/user';

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    const data = await usersApi.getAll();
    setUsers(data);
    return data;
  }, []);

  const loadPosts = useCallback(async (userId?: string | null) => {
    const data = await postsApi.getAll(userId ?? undefined);
    setPosts(data);
  }, []);

  const loadAll = useCallback(async () => {
    try {
      setError(null);
      await loadUsers();
      await loadPosts(selectedUserId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [loadUsers, loadPosts, selectedUserId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleCreateUser = async (data: { name: string; email: string }) => {
    await usersApi.create(data);
    await loadUsers();
  };

  const handleUpdateUser = async (data: { name: string; email: string }) => {
    if (!editingUser) return;
    await usersApi.update(editingUser.id, data);
    setEditingUser(null);
    await loadUsers();
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Delete this user and all their posts?')) return;
    try {
      await usersApi.remove(id);
      if (editingUser?.id === id) setEditingUser(null);
      if (selectedUserId === id) setSelectedUserId(null);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const handleCreatePost = async (data: {
    title: string;
    content: string;
    userId: string;
  }) => {
    await postsApi.create(data);
    await loadPosts(selectedUserId);
  };

  const handleUpdatePost = async (data: {
    title: string;
    content: string;
    userId: string;
  }) => {
    if (!editingPost) return;
    await postsApi.update(editingPost.id, {
      title: data.title,
      content: data.content,
    });
    setEditingPost(null);
    await loadPosts(selectedUserId);
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await postsApi.remove(id);
      if (editingPost?.id === id) setEditingPost(null);
      await loadPosts(selectedUserId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  const handleSelectUser = async (userId: string | null) => {
    setSelectedUserId(userId);
    setLoading(true);
    try {
      await loadPosts(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter posts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Posts Manager</h1>
        <p>Manage users and their posts</p>
      </header>

      <main className="app-layout">
        {error && (
          <div className="error-banner">
            {error}
            <button type="button" onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
        )}

        <section className="panel">
          <UserForm
            initialUser={editingUser}
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            onCancel={editingUser ? () => setEditingUser(null) : undefined}
          />
          {loading ? (
            <p className="loading">Loading users...</p>
          ) : (
            <UserList
              users={users}
              selectedUserId={selectedUserId}
              editingId={editingUser?.id ?? null}
              onSelect={handleSelectUser}
              onEdit={setEditingUser}
              onDelete={handleDeleteUser}
            />
          )}
        </section>

        <section className="panel">
          <PostForm
            users={users}
            initialPost={editingPost}
            defaultUserId={selectedUserId}
            onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
            onCancel={editingPost ? () => setEditingPost(null) : undefined}
          />
          {loading ? (
            <p className="loading">Loading posts...</p>
          ) : (
            <PostList
              posts={posts}
              editingId={editingPost?.id ?? null}
              onEdit={setEditingPost}
              onDelete={handleDeletePost}
            />
          )}
        </section>
      </main>
    </div>
  );
}
