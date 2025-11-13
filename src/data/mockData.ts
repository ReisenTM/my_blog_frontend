import type { Author, BlogPost, ChangelogEntry, NavigationLink, Topic } from '../types/blog';

export const navigationLinks: NavigationLink[] = [
  { label: '首页', path: '/' },
  { label: '文章', path: '/posts' },
  { label: '分类', path: '/categories' },
  { label: '关于我', path: '/about' },
  { label: 'RSS', path: '/feed.xml', external: true },
];

export const authors: Author[] = [
  {
    id: 'gemini',
    name: 'Gemini',
    role: '云原生与后端技术博客作者',
    bio: '专注云原生、容器、Kubernetes 与 DevOps 实践，喜欢把晦涩概念写成通俗的文章。',
    socials: [
      { label: 'GitHub', url: 'https://github.com/codecraft-dev' },
      { label: 'Email', url: 'mailto:hello@codecraft.dev' },
    ],
  },
  {
    id: 'mu',
    name: '木子',
    role: '分布式系统工程师',
    bio: '长期折腾 Kubernetes 集群与服务网格，偶尔写写关于团队协作的随笔。',
    socials: [{ label: 'Twitter', url: 'https://twitter.com/mu-cloud' }],
  },
];

const dockerCode = `# syntax=docker/dockerfile:1.4
FROM python:3.12-slim AS base

ENV POETRY_VIRTUALENVS_CREATE=false \\
    PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1

WORKDIR /app
COPY pyproject.toml poetry.lock ./
RUN pip install --no-cache-dir poetry && poetry install --no-interaction --no-ansi
COPY . .
CMD ["python", "main.py"]`;

export const posts: BlogPost[] = [
  {
    id: 'post-001',
    slug: 'dockerfile-best-practice',
    title: '深度解析：如何编写高效的 Dockerfile',
    summary:
      '从 FROM 到 CMD，系统讲解 Dockerfile 的核心指令、常见坑位以及减少镜像体积的技巧，帮助你写出更快更安全的容器镜像。',
    categories: ['后端编程', '开发者工具'],
    tags: ['Dockerfile', '容器', '最佳实践'],
    publishedAt: '2025-03-15',
    readingTime: '10 min',
    hero: {
      badge: 'Docker · 工程实践',
      headline: '深度解析：如何编写高效的 Dockerfile',
      description: '一个优秀的 Dockerfile 不仅能减少镜像体积，还能缩短发布时间并降低安全风险。',
    },
    authorId: 'gemini',
    sections: [
      {
        id: 'intro',
        title: '导言：什么是 Dockerfile？',
        level: 2,
        paragraphs: [
          '在现代云原生应用中，容器化是不可或缺的一环，而 Dockerfile 则是定义容器镜像“蓝图”的文本文件。',
          '写好 Dockerfile 的关键不在于堆砌指令，而是理解镜像构建过程、合理拆分层（Layer），并结合业务需求做权衡。',
        ],
        alert: {
          type: 'tip',
          content: '先画出镜像构建流程图，再动手写 Dockerfile，能有效避免无意义的层和重复安装步骤。',
        },
      },
      {
        id: 'base-command',
        title: '基础指令解析',
        level: 2,
        paragraphs: ['让我们从最核心的指令开始，理解它们的区别是编写高效镜像的第一步。'],
      },
      {
        id: 'from',
        title: '2.1 FROM',
        level: 3,
        paragraphs: [
          'FROM 指令必须是 Dockerfile 中的第一个非注释指令，它指定了构建镜像所依赖的基础镜像。',
          '除了常见的 `FROM python:3.12`，你也可以使用 `FROM --platform=linux/arm64` 为不同架构准备镜像，这是多架构构建的关键。',
        ],
        alert: {
          type: 'warning',
          content: '不要盲目使用 latest 标签，版本不可控会导致线上环境不可预期的升级。',
        },
      },
      {
        id: 'run',
        title: '2.2 RUN',
        level: 3,
        paragraphs: [
          'RUN 指令用于在镜像构建时执行命令，多用于安装软件包或下载依赖。',
          '一个常见的技巧是使用 `&&` 将多个 RUN 命令合并为一条，以减少镜像层并统一清理缓存。',
        ],
        code: {
          language: 'docker',
          content: 'RUN apt-get update && apt-get install -y curl \\\n    && rm -rf /var/lib/apt/lists/*',
        },
      },
      {
        id: 'cmd-vs-entrypoint',
        title: '2.3 CMD vs ENTRYPOINT',
        level: 3,
        paragraphs: [
          'CMD 更像是给容器提供默认参数，而 ENTRYPOINT 是不可或缺的主进程。',
          '组合用法示例：ENTRYPOINT 指向可执行文件，CMD 负责提供默认参数，两者都可以被 docker run 覆盖。',
        ],
      },
      {
        id: 'best-practice',
        title: '最佳实践',
        level: 2,
        paragraphs: [
          '尽量使用官方瘦身镜像（如 alpine、distroless），搭配多阶段构建可以进一步减少产物体积。',
          '为每一个 RUN 块添加注释，记录该步骤存在的意义，方便未来排查和复用。',
        ],
        list: [
          '多阶段构建：编译阶段与运行阶段分离，最终镜像只保留可执行文件。',
          '显式清理缓存：在同一个层中删除 apt/yum 缓存，否则镜像会迅速膨胀。',
          '使用 `.dockerignore` 排除无关文件，减少上下文传输体积。',
        ],
      },
      {
        id: 'sample-dockerfile',
        title: '示例 Dockerfile',
        level: 2,
        paragraphs: ['以下示例展示了一个 Python 服务的多阶段 Dockerfile：'],
        code: {
          language: 'docker',
          content: dockerCode,
        },
      },
      {
        id: 'summary',
        title: '总结',
        level: 2,
        paragraphs: [
          '高质量的 Dockerfile 需要在可维护性、镜像体积、安全性之间找到平衡。',
          '从基础镜像、指令顺序到清理策略，任何一步都可能决定上线效率。保持审慎与复盘，是写好 Dockerfile 的秘诀。',
        ],
      },
    ],
    recommendedSlugs: ['kubernetes-core-concepts', 'service-mesh-explained'],
  },
  {
    id: 'post-002',
    slug: 'kubernetes-core-concepts',
    title: 'Kubernetes 核心概念入门',
    summary: '从 Pod、Deployment 到 Service，十分钟厘清 Kubernetes 集群中的核心对象与常见排障技巧。',
    categories: ['系统架构', '后端编程'],
    tags: ['K8s', 'Pod', 'Service'],
    publishedAt: '2025-03-10',
    readingTime: '8 min',
    hero: {
      badge: 'Kubernetes · 入门',
      headline: 'Kubernetes 核心概念入门',
      description: '如果你刚接触 K8s，这篇文章会帮助你建立语境，搞懂对象之间的关系。',
    },
    authorId: 'mu',
    sections: [
      {
        id: 'pod',
        title: 'Pod 是最小的调度单位',
        level: 2,
        paragraphs: [
          'Pod 中的容器共享网络命名空间与卷，因此适合放置紧密耦合的协程，如 Sidecar。',
          '调试 Pod 时别忘了使用 `kubectl describe` 查看事件，很多问题其实出在镜像拉取或探针配置。',
        ],
      },
      {
        id: 'deployment',
        title: 'Deployment 管理副本与滚动发布',
        level: 2,
        paragraphs: [
          'Deployment 负责保证 Pod 副本数与模板一致，它会默认使用滚动升级策略。',
          '需要快速回滚时，执行 `kubectl rollout undo deployment/<name>` 即可恢复到上一版本。',
        ],
        alert: {
          type: 'tip',
          content: '生产环境务必为 Deployment 配置 liveness/readiness 探针，否则滚动发布无法准确感知实例健康状态。',
        },
      },
      {
        id: 'service',
        title: 'Service 负责网络暴露',
        level: 2,
        paragraphs: [
          'ClusterIP、NodePort、LoadBalancer 是最常见的三种 Service 类型，对应不同的访问场景。',
          'Service 通过 selector 绑定 Pod 标签，确保请求被均衡转发到健康实例。',
        ],
      },
      {
        id: 'debug',
        title: '排障清单',
        level: 2,
        paragraphs: ['遇到集群告警或服务不可达时，可以按照以下顺序排查。'],
        list: [
          '检查 namespace 与 context，确认命令执行在正确的集群。',
          '通过 `kubectl get events --sort-by=.metadata.creationTimestamp` 快速定位最新异常。',
          '结合 `kubectl exec` 和 `kubectl cp` 收集日志、配置文件。',
        ],
      },
    ],
    recommendedSlugs: ['dockerfile-best-practice'],
  },
  {
    id: 'post-003',
    slug: 'service-mesh-explained',
    title: 'Service Mesh 是什么？我用一个周末把它讲清楚',
    summary: '拆解 Service Mesh 的数据平面与控制平面职责，分享在团队落地 Istio 时踩过的坑。',
    categories: ['系统架构', '编程随笔'],
    tags: ['Istio', 'Envoy', '可观测性'],
    publishedAt: '2025-02-28',
    readingTime: '12 min',
    hero: {
      badge: 'Service Mesh · 解析',
      headline: 'Service Mesh 是什么？我用一个周末把它讲清楚',
      description: '当微服务数量暴增时，Service Mesh 能把流量治理、观测、安全统一抽象出来。',
    },
    authorId: 'gemini',
    sections: [
      {
        id: 'why-mesh',
        title: '为什么需要 Service Mesh',
        level: 2,
        paragraphs: [
          '传统 SDK 方式在跨语言场景会迅速失控，Mesh 把治理能力下沉到基础设施。',
          '它最大的价值在于让开发团队专注业务，而把熔断、重试、限流统统交给数据面处理。',
        ],
      },
      {
        id: 'data-plane',
        title: '数据平面：Envoy Sidecar',
        level: 2,
        paragraphs: [
          '每个 Pod 附带一个 Envoy 进程负责拦截入站/出站流量，因此可以无侵入地注入日志、指标和 Tracing。',
        ],
        code: {
          language: 'yaml',
          content: `apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: reviews-dr
spec:
  host: reviews
  trafficPolicy:
    loadBalancer:
      simple: LEAST_CONN`,
        },
      },
      {
        id: 'control-plane',
        title: '控制平面：Pilot、Citadel、Galley',
        level: 2,
        paragraphs: [
          '控制平面负责把配置下发给各个 Envoy 代理，Pilot 关注路由，Citadel 负责证书与 mTLS，Galley 做配置校验。',
        ],
        alert: {
          type: 'warning',
          content: '在启用 mTLS 之后要及时更新监控探针，否则健康检查请求也会被加密导致失败。',
        },
      },
      {
        id: 'practice',
        title: '落地建议',
        level: 2,
        paragraphs: ['Servce Mesh 不只是安装 Istio，更重要的是制定配套的策略与协作流程。'],
        list: [
          '从观测场景切入，先统一指标与日志，再逐步接入灰度、熔断策略。',
          '准备好 Sidecar 资源配额，避免 Envoy 抢占业务容器 CPU。',
          '建立 Mesh 变更手册，记录每次路由策略的修改，方便事故回溯。',
        ],
      },
    ],
    recommendedSlugs: ['kubernetes-core-concepts'],
  },
];

export const topics: Topic[] = [
  { id: 'topic-backend', title: '后端编程', description: '服务端代码、性能优化与部署经验。', postCount: 32, accent: '#C7D2FE' },
  { id: 'topic-architecture', title: '系统架构', description: '分布式、容器、Service Mesh 等架构经验。', postCount: 21, accent: '#A5B4FC' },
  { id: 'topic-tools', title: '开发者工具', description: '命令行、编辑器、自动化脚本等效率技巧。', postCount: 17, accent: '#FBCFE8' },
  { id: 'topic-writing', title: '编程随笔', description: '写作记录、学习心得与思考。', postCount: 14, accent: '#FDE68A' },
];

export const changelogEntries: ChangelogEntry[] = [
  { id: 'log-001', date: '2025-03-14', summary: '发布 Dockerfile 深度解析，整理一份编程向最佳实践。', status: 'shipped' },
  { id: 'log-002', date: '2025-03-07', summary: '上线 Reisen`s Blog 新首页，聚焦编程主题。', status: 'shipped' },
  { id: 'log-003', date: '2025-03-02', summary: '正在撰写 “我如何整理编程笔记” 系列文章。', status: 'planned' },
];
