export default defineEventHandler((event) => {
  // 处理所有路由
  if (event.path === "/") {
    return {
      name: "Node-Code-Server",
      version: "1.0.0",
      description: "基于 Nuxt 的后端 API 服务",
      timestamp: new Date().toISOString(),
      apis: {
        auth: {
          register: {
            path: "/api/auth/register",
            method: "POST",
            description: "用户注册",
          },
          login: {
            path: "/api/auth/login",
            method: "POST",
            description: "用户登录",
          },
        },
        system: {
          health: {
            path: "/api/health",
            method: "GET",
            description: "系统健康检查",
          },
        },
      },
      documentation: {
        openapi: "/api/openapi.json",
        description: "OpenAPI 文档地址",
      },
    };
  }

  // 其他路由返回 404
  if (!event.path.startsWith("/api/")) {
    throw createError({
      statusCode: 404,
      message: "Not Found",
    });
  }
});
