import { nanoid } from "nanoid";
import { CodeModel } from "../../models/code";
import { logger } from "../../utils/logger";

export default defineEventHandler(async (event) => {
  const start = Date.now();
  const body = await readBody(event);

  // 验证请求数据
  if (!body.code || !body.language) {
    logger.error("Invalid request: missing code or language");
    throw createError({
      statusCode: 400,
      message: "代码和语言是必需的",
    });
  }

  // 生成唯一ID
  const id = nanoid(10);

  try {
    await CodeModel.create({
      id,
      code: body.code,
      language: body.language,
      accessCode: body.accessCode,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    });

    const duration = Date.now() - start;
    logger.info(
      `Code saved successfully - ID: ${id} - Language: ${body.language} - Duration: ${duration}ms`
    );

    return {
      id,
      message: "代码保存成功",
    };
  } catch (error: any) {
    logger.error(`Failed to save code: ${error.message}`);
    throw createError({
      statusCode: 500,
      message: "保存代码失败",
    });
  }
});
