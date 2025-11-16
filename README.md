# Reisen`s Blog · Web 前端

以 React + TypeScript + Vite 构建的博客前端。界面遵循 `doc/index.html` 的设计语言：三栏式正文 + 粘性目录、浅色调排版以及突出代码的视觉秩序。可直接对接配套的 Go 后端，也可以对接任意遵循相同 API 的服务。

![home](doc/index.html)

---

## ✨ 特色特性

| 模块 | 说明 |
| --- | --- |
| 设计系统 | `src/styles/colors.ts` + `typography.ts` 输出 CSS Variables，配合 `applyDesignTokens` 保证字体、色彩在任意页面都一致。 |
| 文章体验 | `PostLayout` 三栏布局、`TableOfContents` 粘性目录、Prism 代码高亮 + 复制按钮、行号等增强细节。 |
| 列表 & 分类 | 首页、全部文章、分类页都使用卡片化布局，支持搜索、排序、分页等交互。 |
| 鉴权流程 | 登录/注册页覆盖邮箱验证码注册、邮箱密码登录，登录后会存储 Token 并在发文时自动携带。 |
| API 封装 | `src/services/api.ts` 统一处理 baseURL、通用响应、鉴权头。可通过 `VITE_API_BASE` 切换请求地址。 |

更多组件/API 约定可查阅 [`USAGE.md`](USAGE.md) 与 `doc/` 下的设计文档。

---

## 🧱 技术栈

- **构建**：Vite + SWC
- **框架**：React 18 + React Router v7
- **语言**：TypeScript
- **样式**：原子化 CSS Modules + CSS Variables
- **高亮**：Prism.js（定制 token + 复制按钮）

---

## 🚀 快速启动

```bash
cd frontend
npm install
npm run dev
```

在 `http://localhost:5173` 访问。构建与预览：

```bash
npm run build
npm run preview
```

---

## 📁 目录结构

```
frontend
├─ doc/                    # 设计稿与 API 文档
├─ src/
│  ├─ components/          # Header / Footer / PostLayout / Sidebar 等复用组件
│  ├─ pages/               # Home / AllPosts / Categories / Login / Post / ...
│  ├─ services/api.ts      # 与后端交互的统一封装
│  ├─ styles/              # colors.ts / typography.ts / global.css
│  ├─ hooks/               # useActiveHeading、useAuth 等自定义 Hook
│  └─ utils/               # markdown 渲染、格式化等工具
└─ README.md
```

---

## ⚙️ 环境变量

| 变量 | 作用 | 默认值 |
| --- | --- | --- |
| `VITE_API_BASE` | 前端请求的 API 基础路径 | `/api` |
| `VITE_DEV_API_TARGET` | Vite 开发代理指向的后端地址 | `http://127.0.0.1:8083` |

可在 `.env` / `.env.local` 中覆盖：

```env
VITE_API_BASE=/api
VITE_DEV_API_TARGET=http://127.0.0.1:8083
```

---

## 🧪 常用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器（带代理） |
| `npm run build` | TypeScript 检查 + 产出静态资源 |
| `npm run preview` | 基于构建产物启动只读预览 |

---

## 📮 API 约定（摘要）

| 方法&路径 | 说明 |
| --- | --- |
| `GET /api/posts` | 文章列表（分页、搜索、作者过滤） |
| `POST /api/post` | 发布文章（需 token） |
| `POST /api/auth/email-code` | 发送邮箱验证码 |
| `POST /api/auth/register` | 邮箱注册 |
| `POST /api/auth/email-login` | 邮箱登录 |

更详细的字段说明参考 `backend/doc/api-reference.md`。

---

## 🤝 贡献 & 开发建议

1. 前后端都位于同一仓库，建议通过 `VITE_DEV_API_TARGET` 直接连本地 Go 服务。
2. 新增页面时先在 `styles/` 下定义好 token，再在组件内引用，避免 hardcode。
3. 如果你对 UI 有更多想法，欢迎在 `doc/` 中补充设计稿，再同步修改相应 CSS Modules。

Happy hacking! 🚀
