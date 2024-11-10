import { withDb, type SqliteError } from "~/server/utils/db";
import { defineEventHandler, readBody, createError } from "h3";
import { hash } from "~/server/utils/crypto";

export default withDb((db) => {
  return defineEventHandler(async (event) => {
    const body = await readBody(event);

    if (!body.username || !body.password) {
      throw createError({
        statusCode: 400,
        message: "用户名和密码不能为空",
      });
    }

    try {
      const hashedPassword = await hash(body.password);
      const stmt = db.prepare(
        "INSERT INTO users (username, password) VALUES (?, ?)"
      );
      const result = stmt.run(body.username, hashedPassword);

      return {
        id: result.lastInsertRowid,
        username: body.username,
      };
    } catch (error) {
      const sqliteError = error as SqliteError;
      if (sqliteError.code === "SQLITE_CONSTRAINT") {
        throw createError({
          statusCode: 400,
          message: "用户名已存在",
        });
      }
      throw error;
    }
  });
});
