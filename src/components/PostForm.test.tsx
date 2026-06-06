import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PostForm } from './PostForm';
import type { Post } from '../types/post';
import type { User } from '../types/user';

const sampleUser: User = {
  id: 'user-1',
  name: 'John',
  email: 'john@example.com',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const samplePost: Post = {
  id: '1',
  title: 'Existing',
  content: 'Existing content',
  userId: 'user-1',
  user: sampleUser,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('PostForm', () => {
  it('renders create form with user select', () => {
    render(<PostForm users={[sampleUser]} onSubmit={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Create New Post' })).toBeInTheDocument();
    expect(screen.getByLabelText('Author')).toBeInTheDocument();
  });

  it('shows message when no users exist', () => {
    render(<PostForm users={[]} onSubmit={vi.fn()} />);

    expect(
      screen.getByText('Create at least one user before adding posts.'),
    ).toBeInTheDocument();
  });

  it('submits trimmed title, content, and userId', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<PostForm users={[sampleUser]} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Title'), '  My Title  ');
    await user.type(screen.getByLabelText('Content'), '  My Content  ');
    await user.click(screen.getByRole('button', { name: 'Create Post' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'My Title',
        content: 'My Content',
        userId: 'user-1',
      });
    });
  });

  it('renders edit mode with cancel button', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <PostForm
        users={[sampleUser]}
        initialPost={samplePost}
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Edit Post' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Author')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalled();
  });
});
