export type AlertType = 'tip' | 'warning';

export interface PostAlert {
  type: AlertType;
  content: string;
}

export interface CodeSnippet {
  language: string;
  content: string;
}

export interface PostSection {
  id: string;
  title: string;
  level: number;
  paragraphs: string[];
  list?: string[];
  alert?: PostAlert;
  code?: CodeSnippet;
}

export interface AuthorSocial {
  label: string;
  url: string;
}

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  socials: AuthorSocial[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  categories: string[];
  tags: string[];
  publishedAt: string;
  readingTime: string;
  hero: {
    badge: string;
    headline: string;
    description: string;
  };
  authorId: string;
  sections: PostSection[];
  recommendedSlugs: string[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  postCount: number;
  accent: string;
}

export interface ChangelogEntry {
  id: string;
  date: string;
  summary: string;
  status: 'shipped' | 'experiment' | 'planned';
}

export interface NavigationLink {
  label: string;
  path: string;
  external?: boolean;
}
