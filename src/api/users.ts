import type { CreateUserInput, UpdateUserInput, User } from '../types/user';
import type { Post } from '../types/post';

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

export const usersApi = {
  getAll: () => request<User[]>('/users'),
  getOne: (id: string) => request<User>(`/users/${id}`),
  getPosts: (id: string) => request<Post[]>(`/users/${id}/posts`),
  create: (data: CreateUserInput) =>
    request<User>('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UpdateUserInput) =>
    request<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    request<{ message: string }>(`/users/${id}`, { method: 'DELETE' }),
};
