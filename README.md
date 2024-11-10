# Code Share

一个现代化的代码分享平台，支持多种编程语言和访问控制。

## 项目结构

```bash
code-share/
├── frontend/ # Vue 3 前端项目
│ ├── src/
│ │ ├── components/ # 组件
│ │ │ └── Editor/ # 编辑器组件
│ │ ├── views/ # 页面
│ │ ├── stores/ # Pinia 状态管理
│ │ ├── config/ # 配置文件
│ │ └── utils/ # 工具函数
│ ├── public/ # 静态资源
│ └── README.md # 前端文档
└── server/ # Nuxt.js 后端项目
├── server/ # 服务端代码
├── middleware/ # 中间件
└── README.md # 后端文档
```

## 功能特点

- 代码编辑与分享
  - 支持多种编程语言的代码高亮
  - 实时代码编辑
  - 可选的访问密码保护
  - 代码分享链接生成
  
- 用户体验
  - 响应式设计
  - 暗色/亮色主题切换
  - 快捷键支持
  
- 系统特性
  - 完整的日志记录
  - API 文档
  - 健康检查
  - 跨域支持

## 技术栈


### 前端

- Vue 3 - 渐进式 JavaScript 框架
- Pinia - 状态管理
- Vue Router - 路由管理
- TailwindCSS - 样式框架
- Axios - HTTP 客户端
- Monaco Editor - 代码编辑器


### 后端

- Nuxt.js 3 - SSR 框架
- SQLite3 - 数据库
- TypeScript - 类型支持
- H3 - HTTP 引擎



## 快速开始

1. 克隆项目

```bash
git clone https://github.com/dnslin/code-share.git
cd code-share
```

2. 启动后端服务

```bash
cd server
pnpm install
pnpm dev

```

3. 启动前端服务

```bash
cd frontend
pnpm install
pnpm dev
```


## 环境要求

- Node.js >= 16
- PNPM >= 8
- SQLite3

## 许可证

MIT License