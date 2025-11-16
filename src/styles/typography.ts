export const Fonts = {
  fontUi: "'Inter', 'Helvetica Neue', 'PingFang SC', sans-serif",
  fontBody: "'Lora', 'Georgia', 'Songti SC', 'PingFang SC', serif",
  fontCode: "'JetBrains Mono', 'Fira Code', monospace",
} as const;

export const FontSizes = {
  h1: '38px',
  h2: '28px',
  body: '17px',
  small: '14px',
  code: '15px',
} as const;

export type FontToken = keyof typeof Fonts;
export type FontSizeToken = keyof typeof FontSizes;
