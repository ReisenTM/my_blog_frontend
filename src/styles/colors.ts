export const Colors = {
  bgMain: '#FFFFFF',
  bgSecondary: '#F4F4F7',
  bgInlineCode: '#E6F0FF',
  codeBg: '#2D2D2D',
  textMain: '#202020',
  textSecondary: '#606060',
  accentBlue: '#007AFF',
  textCodeInline: '#4DA1FF',
  borderColor: '#E0E0E0',
  tipBorder: '#007AFF',
  tipBg: '#F0F7FF',
  warningBorder: '#FFC107',
  warningBg: '#FFF9E6',
} as const;

export type ColorToken = keyof typeof Colors;
