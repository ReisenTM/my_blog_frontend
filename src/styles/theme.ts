import { Colors } from './colors';
import { FontSizes, Fonts } from './typography';

const tokenToCssMap: Record<string, string> = {
  '--color-bg-main': Colors.bgMain,
  '--color-bg-secondary': Colors.bgSecondary,
  '--color-bg-inline-code': Colors.bgInlineCode,
  '--color-code-bg': Colors.codeBg,
  '--color-text-main': Colors.textMain,
  '--color-text-secondary': Colors.textSecondary,
  '--color-accent-blue': Colors.accentBlue,
  '--color-text-code-inline': Colors.textCodeInline,
  '--color-border': Colors.borderColor,
  '--color-tip-border': Colors.tipBorder,
  '--color-tip-bg': Colors.tipBg,
  '--color-warning-border': Colors.warningBorder,
  '--color-warning-bg': Colors.warningBg,
  '--font-family-ui': Fonts.fontUi,
  '--font-family-body': Fonts.fontBody,
  '--font-family-code': Fonts.fontCode,
  '--font-size-h1': FontSizes.h1,
  '--font-size-h2': FontSizes.h2,
  '--font-size-body': FontSizes.body,
  '--font-size-small': FontSizes.small,
  '--font-size-code': FontSizes.code,
};

export const applyDesignTokens = () => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  Object.entries(tokenToCssMap).forEach(([variable, value]) => {
    root.style.setProperty(variable, value);
  });
};
