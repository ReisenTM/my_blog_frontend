import { useState } from 'react';
import { Highlight, themes, type Language } from 'prism-react-renderer';
import styles from './CodeBlock.module.css';

export interface CodeBlockProps {
  language: string;
  content: string;
}

const CodeBlock = ({ language, content }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const normalizedLang = (language ? (language.toLowerCase() as Language) : 'tsx');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('复制失败', error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.meta}>
        <span className={styles.language}>{language.toUpperCase()}</span>
        <button type="button" className={styles.copyButton} onClick={handleCopy}>
          {copied ? '已复制' : '复制代码'}
        </button>
      </div>
      <Highlight code={content.trim()} language={normalizedLang} theme={themes.nightOwl}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} ${styles.code}`} style={style}>
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line });
              return (
                <div
                  key={`code-line-${i}`}
                  {...lineProps}
                  className={`${styles.line} ${lineProps.className ?? ''}`}
                >
                  <span className={styles.lineNumber}>{i + 1}</span>
                  <span className={styles.lineContent}>
                    {line.map((token, key) => (
                      <span key={`token-${i}-${key}`} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export default CodeBlock;
