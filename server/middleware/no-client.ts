export default defineEventHandler((event) => {
  // 如果请求的是静态资源或前端路由，返回 404
  if (
    event.path.startsWith("/_nuxt/") ||
    event.path.includes(".") ||
    event.path.startsWith("/assets/")
  ) {
    throw createError({
      statusCode: 404,
      message: "Not Found",
    });
  }
});
