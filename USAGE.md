# 使用文档 & API 约定

本文档帮助你快速理解 Reisen`s Blog 前端的运行方式、目录结构以及 Mock API 设计，方便后续替换为真实后端或接入 CI/CD。

## 运行指令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动 Vite 本地开发服务器（默认 5173，若端口受限可通过 `--host/--port` 覆盖）。 |
| `npm run build` | 执行 `tsc --noEmit` 类型检查 + `vite build` 产出静态资源。 |
| `npm run preview` | 基于构建结果开启只读预览服务器，模拟生产运行。 |

## 目录结构速查

```
src
├── App.tsx                # React Router 入口 + 布局外壳
├── components             # 文章布局、目录、代码块、卡片等 UI 组件
│   ├── layout             # Header / Footer / Layout 容器
│   └── …
├── data/mockData.ts       # 作者、文章、主题、日志等 Mock 数据
├── hooks/useActiveHeading.ts
├── pages                  # Home / AllPosts / Categories / About / Post / NotFound 页面
├── styles                 # 设计令牌 + 全局样式
├── types/blog.ts          # 统一的数据模型定义
└── utils/formatDate.ts    # 常用工具方法
```

## 设计令牌使用方式

1. `src/styles/colors.ts` / `typography.ts` 导出 TS 常量。
2. `applyDesignTokens()` 在 `src/main.tsx` 中运行，将常量映射到 CSS 变量（`--color-*`、`--font-*`）。
3. 所有组件仅消费 CSS 变量，保障主题切换或深浅色扩展时无需修改组件内部逻辑。

## 核心组件 API

| 组件 | 关键 Props | 说明 |
| --- | --- | --- |
| `PostLayout` | `toc: ReactNode`、`sidebar?: ReactNode`、`children: ReactNode` | 三栏博客布局（目录/正文/侧栏），内置桌面/平板/移动断点。 |
| `TableOfContents` | `headings: { id; text; level }[]`、`activeId?: string` | 粘性目录；支持 2-3 级标题缩进与滚动高亮。 |
| `CodeBlock` | `language: string`、`content: string` | 基于 `prism-react-renderer` 渲染语法高亮并封装复制按钮。 |
| `Alert` | `type: 'tip' | 'warning'`、`children` | 左侧 5px 边框 + 图标前缀的提示/警告块，适合写“提示/注意”。 |
| `PostPreviewCard` | `post: BlogPost` | 首页文章卡片，展示日期、摘要、标签与 CTA。 |
| `SidebarCard` | `title: string`、`children`、`footer?` | 右侧信息模块，可用于作者简介、相关文章等。 |

## 数据模型（节选）

所有类型集中在 `src/types/blog.ts`，后端只需遵守相同 shape 即可与当前前端解耦。关键接口如下：

```ts
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  categories: string[];
  tags: string[];
  publishedAt: string; // ISO 日期
  readingTime: string; // 语义化文案，如 "8 min"
  hero: { badge: string; headline: string; description: string };
  authorId: string;
  sections: PostSection[]; // 文章内容片段
  recommendedSlugs: string[]; // 推荐文章关联
}

export interface PostSection {
  id: string;
  title: string;
  level: number; // 映射 TOC 层级
  paragraphs: string[];
  list?: string[];
  alert?: { type: 'tip' | 'warning'; content: string };
  code?: { language: string; content: string };
}
```

## Mock API 设计

前端目前使用本地数据，但已预留可直接替换的 API 约定（REST 风格）：

| Method & Path | 说明 | 返回示例 |
| --- | --- | --- |
| `GET /api/posts` | 获取文章列表（首页卡片使用） | `PostSummary[]`（可与 `BlogPost` 等同或精简字段）。 |
| `GET /api/posts/:slug` | 获取文章详情 | `BlogPost`，包含 `sections`、`recommendedSlugs`。 |
| `GET /api/topics` | 获取主题统计 | `Topic[]`，用于首页主题网格。 |
| `GET /api/changelog` | 获取 DesignOps 更新日志 | `ChangelogEntry[]`。 |
| `GET /api/authors/:id` | 获取作者信息 | `Author`；也可以在 `/api/posts/:slug` 中内联。 |

> **提示**：当文章包含代码演示时，`sections` 中会带有 `code` 字段（`{ language: string; content: string }`）。消费 API 时可直接把 `language` 传给语法高亮组件，例如本文仓库中的 `CodeBlock`。

### JSON 示例：`GET /api/posts/design-system-blog`

```json
{
  "id": "post-001",
  "slug": "design-system-blog",
  "title": "让博客也遵守设计系统的秩序",
  "summary": "利用 React + TypeScript + 设计令牌搭建三栏博客版式……",
  "categories": ["Design System", "Frontend Architecture"],
  "tags": ["React", "Design Token", "Table of Contents"],
  "publishedAt": "2025-02-18",
  "readingTime": "8 min",
  "hero": {
    "badge": "Code Orderliness · React / TS",
    "headline": "让博客也遵守设计系统的秩序",
    "description": "通过 PostLayout…"
  },
  "authorId": "chen",
  "sections": [ /* 参照 PostSection 定义 */ ],
  "recommendedSlugs": ["toc-observer-playbook", "token-automation-pipeline"]
}
```

> 当后端可用时，仅需把 `src/data/mockData.ts` 的读取逻辑替换为请求结果或 React Query/RTK Query，就能无缝切换。

## 集成指南

1. **扩展文章**：在 `src/data/mockData.ts` 中新增 `BlogPost` 条目，或在未来改为 API 响应；确保 `sections` 至少包含 `id/title/level/paragraphs`。
2. **自定义主题**：更新 `src/styles/colors.ts` / `typography.ts`，或在 `applyDesignTokens` 中注入暗色 token；组件自动响应。
3. **导航菜单**：调整 `navigationLinks` 即可在 Header 中增删入口。
4. **部署**：`npm run build` 产出的 `dist/` 可直接部署至静态托管（Vercel、Netlify、OSS 等）。

如需进一步的 API 契约或与 CMS 打通，可基于本文件继续补充字段说明。EOF
