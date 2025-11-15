import { FormEvent, useEffect, useState } from 'react';
import styles from './LoginPage.module.css';

type AuthMode = 'login' | 'register';

const LoginPage = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = window.setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const handleSendCode = () => {
    if (mode !== 'register') return;
    if (!email) {
      setFeedback('请输入邮箱，方便发送验证码。');
      return;
    }
    setCooldown(60);
    setFeedback('验证码已发送，请在 10 分钟内输入。');
    // 在真实后端中，这里应调用 /api/auth/email-code 接口。
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setFeedback('请填写邮箱与密码。');
      return;
    }

    if (mode === 'register' && !code) {
      setFeedback('请填写验证码完成注册。');
      return;
    }

    setFeedback(mode === 'login' ? '正在登录…' : '正在注册…');
    // 登录：POST /api/auth/login { email, password }
    // 注册：POST /api/auth/register { email, password, code }
  };

  const handleGithubLogin = () => {
    window.location.href = '/api/auth/github';
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.panel}>
        <div>
          <p className={styles.kicker}>登录 Reisen`s Blog</p>
          <h1>欢迎回到知识花园</h1>
          <p className={styles.description}>
            支持 GitHub OAuth、邮箱登录与邮箱注册。注册流程需输入密码并通过验证码验证，后续登录只需邮箱+密码。
          </p>

          <button type="button" className={styles.githubButton} onClick={handleGithubLogin}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.4c.58.11.79-.25.79-.55 0-.27-.01-.98-.02-1.93-3.22.7-3.9-1.55-3.9-1.55-.53-1.35-1.3-1.71-1.3-1.71-1.07-.75.08-.74.08-.74 1.18.08 1.8 1.22 1.8 1.22 1.05 1.8 2.76 1.28 3.43.98.11-.77.41-1.28.74-1.57-2.57-.29-5.27-1.29-5.27-5.73 0-1.27.45-2.32 1.2-3.14-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.2a11 11 0 0 1 5.82 0c2.2-1.51 3.18-1.2 3.18-1.2.64 1.59.24 2.76.12 3.05.75.82 1.19 1.87 1.19 3.14 0 4.45-2.71 5.44-5.29 5.72.42.36.79 1.08.79 2.18 0 1.58-.02 2.84-.02 3.23 0 .3.21.66.8.55A11.5 11.5 0 0 0 12 .5Z" />
            </svg>
            使用 GitHub 登录
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.modeToggle}>
            <button type="button" className={mode === 'login' ? styles.activeMode : ''} onClick={() => setMode('login')}>
              登录
            </button>
            <button type="button" className={mode === 'register' ? styles.activeMode : ''} onClick={() => setMode('register')}>
              注册
            </button>
          </div>
          <label>
            <span>邮箱地址</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            <span>密码</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="至少 8 位密码"
              minLength={6}
              required
            />
          </label>

          {mode === 'register' ? (
            <label className={styles.codeRow}>
              <span>验证码</span>
              <div className={styles.codeInputs}>
                <input
                  type="text"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="请输入 6 位数字"
                  maxLength={6}
                  required
                />
                <button type="button" onClick={handleSendCode} disabled={cooldown > 0}>
                  {cooldown > 0 ? `重新发送 (${cooldown}s)` : '发送验证码'}
                </button>
              </div>
            </label>
          ) : null}

          <button type="submit" className={styles.submitButton}>
            {mode === 'login' ? '登录' : '注册'}
          </button>
          {feedback ? <p className={styles.feedback}>{feedback}</p> : null}
        </form>
      </div>

      <aside className={styles.tips}>
        <p className={styles.kicker}>登录提示</p>
        <ul>
          <li>GitHub OAuth 回调地址：`/api/auth/github/callback`（后端需配置）。</li>
          <li>邮箱验证码有效期 10 分钟，可通过 Redis 或数据库存储。</li>
          <li>首次邮箱登录即可视为注册，无需额外表单。</li>
        </ul>
      </aside>
    </section>
  );
};

export default LoginPage;
