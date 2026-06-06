import type { User } from './user';

export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  userId: string;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
}
