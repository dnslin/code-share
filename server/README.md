# Code Share Server

基于 Nuxt.js 的代码分享平台后端服务。

## 技术栈

- Nuxt.js 3.x
- SQLite3
- TypeScript

## 项目结构
```bash
server/
├── middleware/ # 中间件
│ ├── 01.logger.ts # 日志中间件
│ └── 02.cors.ts # CORS 中间件
├── server/
│ ├── api/ # API 路由
│ │ ├── code/ # 代码相关接口
│ │ │ ├── index.post.ts # 保存代码
│ │ │ └── [id].post.ts # 获取代码
│ │ ├── health.get.ts # 健康检查
│ │ └── languages.get.ts # 语言配置
│ ├── models/ # 数据模型
│ │ └── code.ts # 代码模型
│ └── utils/ # 工具函数
│ ├── db.ts # 数据库工具
│ └── logger.ts # 日志工具
├── logs/ # 日志文件目录
├── database.db # SQLite 数据库文件
├── nuxt.config.ts # Nuxt 配置文件
└── package.json # 项目依赖
```


## API 接口

### 代码相关

- `POST /api/code` - 保存代码
  ```typescript
  // 请求体
  {
    code: string;        // 代码内容
    language: string;    // 编程语言
    accessCode?: string; // 访问密码（可选）
    expiresAt?: string; // 过期时间（可选）
  }

  // 响应
  {
    id: string;         // 代码唯一标识
    message: string;    // 成功消息
  }
  ```

- `POST /api/code/:id` - 获取代码
  ```typescript
  // 请求体
  {
    accessCode?: string; // 访问密码（如果有）
  }

  // 响应
  {
    code: string;      // 代码内容
    language: string;  // 编程语言
    createdAt: string; // 创建时间
  }
  ```

### 系统相关

- `GET /api/languages` - 获取支持的编程语言列表
- `GET /api/health` - 系统健康检查

## 日志系统

- 所有请求都会被记录到 `logs` 目录
- 日志按天分割（YYYY-MM-DD.log）
- 包含以下信息：
  - 请求时间
  - 请求方法和 URL
  - 请求参数
  - 处理时长
  - 错误信息（如果有）

## 环境变量

- `JWT_SECRET` - JWT 密钥（默认：Node-Code-Server）
- `DATABASE_PATH` - 数据库文件路径（默认：database.db）
- `PORT` - 服务器端口（默认：3000）

## 错误处理

- 400: 请求参数错误
- 401: 未授权
- 403: 访问被拒绝（密码错误）
- 404: 资源不存在
- 410: 资源已过期
- 500: 服务器内部错误

## 开发指南

1. 安装依赖

```bash
cd server
pnpm install
```

2. 启动服务

```bash
cd server
pnpm dev
```

3. 构建生产版本

```bash
cd server
pnpm build
pnpm start
````

## 许可证

MIT License