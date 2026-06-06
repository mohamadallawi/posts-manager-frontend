import type { User } from './user';

export interface Comment {
  id: string;
  content: string;
  postId: string;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentInput {
  content: string;
  userId: string;
}

export interface UpdateCommentInput {
  content?: string;
}
