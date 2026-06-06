import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { PostList } from './PostList';
import type { Post } from '../types/post';

const sampleUser = {
  id: 'user-1',
  name: 'John',
  email: 'john@example.com',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const posts: Post[] = [
  {
    id: '1',
    title: 'First Post',
    content: 'First content',
    userId: 'user-1',
    user: sampleUser,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
];

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([]),
  }));
});

describe('PostList', () => {
  it('shows empty state when no posts', () => {
    render(
      <PostList
        posts={[]}
        users={[sampleUser]}
        selectedUserId={null}
        editingId={null}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(
      screen.getByText('No posts yet. Create your first post above!'),
    ).toBeInTheDocument();
  });

  it('renders posts with author and comment section', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <PostList
        posts={posts}
        users={[sampleUser]}
        selectedUserId={null}
        editingId="1"
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Posts (1)' })).toBeInTheDocument();
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('by John')).toBeInTheDocument();
    expect(screen.getByText('Comments (0)')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onEdit).toHaveBeenCalledWith(posts[0]);
  });
});
