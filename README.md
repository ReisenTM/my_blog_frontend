# Reisen`s Blog 前端

基于 React + TypeScript + Vite 打造的多页面博客前端，参考 `doc/参考文档.md` 规范，还原一个偏编程主题的个人博客（首页、文章详情、文章列表、目录/侧栏）。

## 功能特性

- **设计令牌单一来源**：`src/styles/colors.ts`、`typography.ts` 通过 `applyDesignTokens` 注入 CSS 变量，组件统一取值，方便主题切换。
- **博客化组件组合**：`PostLayout` 三栏布局、`TableOfContents` 粘性目录、`CodeBlock` 语法高亮+复制、`Alert` 提示框完全遵循参考文档规范。
- **完整路由 + 实时 API**：`react-router-dom` 驱动首页 / 全部文章 / 分类 / 关于 / 登录 / 文章详情 / 404，数据通过 `src/services/api.ts` 请求后端（可用 `VITE_API_BASE` 覆盖默认地址）。
- **登录体验**：`/login` 页面提供 GitHub OAuth、邮箱登录（邮箱+密码）与邮箱注册（邮箱+验证码+密码）三种入口，后端接入时按需对接对应 API。
- **首页体验**：英雄区 + 最新文章列表 + 分类索引 + 写作进度，让整个站点更接近真实博客运营。
- **使用文档与 API 定义**：详见 [`USAGE.md`](USAGE.md)，覆盖命令、目录结构、Mock API 形状与集成建议。

## 快速开始

```bash
npm install
npm run dev
```

构建与预览：

```bash
npm run build
npm run preview
```

## 目录速览

- `src/styles/`：设计令牌与全局样式。
- `src/components/`：布局、文章模块与基础 UI。
- `src/pages/`：`HomePage`、`AllPostsPage`、`CategoriesPage`、`AboutPage`、`LoginPage`、`PostPage` 等。
- `src/services/api.ts`：封装所有后端接口请求。
- `USAGE.md`：使用说明 + API 约定。

## 环境变量

默认情况下，前端会向相对路径 `/api` 发起请求，开发模式由 Vite 代理到 `http://127.0.0.1:8083`。如需调整，可在根目录创建 `.env` 或 `.env.local`：

```
VITE_API_BASE=/api              # 前端请求基础路径，生产可指向 Nginx 反向代理
VITE_DEV_API_TARGET=http://127.0.0.1:8083  # 本地开发代理到的后端地址
```
# my_blog
