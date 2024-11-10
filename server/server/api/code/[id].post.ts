import { CodeModel } from "../../models/code";
import { logger } from "../../utils/logger";

interface CodeRecord {
  id: string;
  code: string;
  language: string;
  access_code: string | null;
  created_at: string;
  expires_at: string | null;
}

export default defineEventHandler(async (event) => {
  const start = Date.now();
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "ID 不能为空",
    });
  }
  const { accessCode } = await readBody(event);

  try {
    // 获取代码
    const code = (await CodeModel.getById(id)) as CodeRecord;
    if (!code) {
      logger.error(`Code not found - ID: ${id}`);
      throw createError({
        statusCode: 404,
        message: "代码不存在",
      });
    }

    // 验证访问码
    if (code.access_code && !CodeModel.verifyAccessCode(id, accessCode || "")) {
      logger.error(`Invalid access code - ID: ${id}`);
      throw createError({
        statusCode: 403,
        message: "访问密码错误",
      });
    }

    // 检查是否过期
    if (code.expires_at && new Date(code.expires_at) < new Date()) {
      logger.error(`Code expired - ID: ${id}`);
      throw createError({
        statusCode: 410,
        message: "代码已过期",
      });
    }

    const duration = Date.now() - start;
    logger.info(
      `Code retrieved successfully - ID: ${id} - Duration: ${duration}ms`
    );

    return {
      code: code.code,
      language: code.language,
      createdAt: code.created_at,
    };
  } catch (error: any) {
    logger.error(`Error retrieving code - ID: ${id}: ${error.message}`);
    throw error;
  }
});
