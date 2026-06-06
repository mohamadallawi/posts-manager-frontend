import type { CreatePostInput, Post, UpdatePostInput } from '../types/post';

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

export const postsApi = {
  getAll: (userId?: string) =>
    request<Post[]>(userId ? `/posts?userId=${userId}` : '/posts'),
  getOne: (id: string) => request<Post>(`/posts/${id}`),
  create: (data: CreatePostInput) =>
    request<Post>('/posts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UpdatePostInput) =>
    request<Post>(`/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    request<{ message: string }>(`/posts/${id}`, { method: 'DELETE' }),
};
