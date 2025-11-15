import type { Author, BlogPost, ChangelogEntry, Topic } from '../types/blog';

export const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

const buildHeaders = (initHeaders?: HeadersInit, hasBody = false) => {
  const headers = new Headers(initHeaders);
  if (hasBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  return headers;
};

const request = async <T>(path: string, init?: RequestInit) => {
  const hasBody = Boolean(init?.body);
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: buildHeaders(init?.headers, hasBody),
  });

  if (!response.ok) {
    throw new Error(`请求失败：${response.status}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;
  if (payload.code !== 0) {
    throw new Error(payload.message || '请求失败');
  }

  return payload.data;
};

export const api = {
  listPosts: () => request<BlogPost[]>('/posts'),
  getPost: (slug: string) => request<BlogPost>(`/posts/${slug}`),
  getTopics: () => request<Topic[]>('/topics'),
  getChangelog: () => request<ChangelogEntry[]>('/changelog'),
  getAuthor: (id: string) => request<Author>(`/authors/${id}`),
  sendEmailCode: (email: string, type: 1 | 2 = 1) =>
    request<unknown>('/auth/email-code', {
      method: 'POST',
      body: JSON.stringify({ email, type }),
    }),
  register: (payload: { email: string; emailCode: string; password: string }) =>
    request<unknown>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  emailLogin: (payload: { email: string; password: string }) =>
    request<string>('/auth/email-login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  githubAuthUrl: `${API_BASE}/auth/github`,
};
