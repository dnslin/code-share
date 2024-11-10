import { defineEventHandler, getMethod, setResponseHeaders } from "h3";

export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    "Access-Control-Allow-Origin": process.dev
      ? "http://localhost:5173" // 开发环境
      : "https://your-production-domain.com", // 生产环境
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  });

  if (getMethod(event) === "OPTIONS") {
    event.node.res.statusCode = 204;
    event.node.res.end();
    return;
  }
});
