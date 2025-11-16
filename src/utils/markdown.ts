import { marked, Tokens } from 'marked';
import DOMPurify from 'dompurify';

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

const slugify = (value: string) => {
  const base = value
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return base || 'section';
};

const createRenderer = (headings: HeadingItem[]) => {
  const renderer = new marked.Renderer();
  const slugCounts = new Map<string, number>();

  renderer.heading = function heading(token: Tokens.Heading) {
    const text = token.text ?? '';
    const base = slugify(text);
    const count = slugCounts.get(base) ?? 0;
    const slug = count ? `${base}-${count}` : base;
    slugCounts.set(base, count + 1);
    if (token.depth <= 3) {
      headings.push({ id: slug, text, level: token.depth });
    }
    const content = this.parser.parseInline(token.tokens);
    return `<h${token.depth} id="${slug}">${content}</h${token.depth}>`;
  };

  return renderer;
};

export const renderMarkdown = (markdown: string) => {
  const headingList: HeadingItem[] = [];
  const renderer = createRenderer(headingList);
  const rawHtml = marked.parse(markdown ?? '', {
    gfm: true,
    breaks: true,
    renderer,
  }) as string;
  const html = DOMPurify.sanitize(rawHtml ?? '');
  return { html, headings: headingList };
};

const hasDOM = typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined';

export const extractHeadingsFromHtml = (html: string): HeadingItem[] => {
  if (!hasDOM || !html) {
    return [];
  }
  const parser = new window.DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const nodes = Array.from(doc.querySelectorAll('h1, h2, h3'));
  return nodes.map((node) => ({
    id: node.id || slugify(node.textContent ?? ''),
    text: node.textContent ?? '',
    level: Number(node.tagName.replace('H', '')) || 1,
  }));
};
