import type {
  CreateCommentInput,
  Comment,
  UpdateCommentInput,
} from '../types/comment';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const commentsApi = {
  getByPost: (postId: string) =>
    request<Comment[]>(`/posts/${postId}/comments`),
  create: (postId: string, data: CreateCommentInput) =>
    request<Comment>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateCommentInput) =>
    request<Comment>(`/comments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    request<{ message: string }>(`/comments/${id}`, { method: 'DELETE' }),
};
