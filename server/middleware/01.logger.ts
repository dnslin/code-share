import { logger } from "../server/utils/logger";

export default defineEventHandler(async (event) => {
  const start = Date.now();
  const method = event.method;
  const url = event.path;

  // 获取请求参数
  const params = {
    query: getQuery(event),
    body:
      method !== "GET" ? await readBody(event).catch(() => ({})) : undefined,
  };

  try {
    // 记录请求开始
    logger.info(`Started ${method} ${url}`);

    // 等待请求完成
    await new Promise<void>((resolve) => {
      resolve();
    });

    // 计算请求处理时间
    const duration = Date.now() - start;

    // 记录请求完成
    logger.request(method, url, params, duration);
  } catch (err) {
    // 记录错误日志
    const duration = Date.now() - start;
    const error = err as Error;
    logger.error(
      `Error processing ${method} ${url} (${duration}ms): ${error.message}`
    );
    throw error;
  }
});
