import { withDb } from "~/server/utils/db";
import { defineEventHandler, readBody, createError } from "h3";
import { verify } from "~/server/utils/crypto";

interface LoginBody {
  username: string;
  password: string;
}

interface User {
  id: number;
  username: string;
  password: string;
}

export default withDb((db) => {
  return defineEventHandler(async (event) => {
    const body = await readBody<LoginBody>(event);

    if (!body.username || !body.password) {
      throw createError({
        statusCode: 400,
        message: "用户名和密码不能为空",
      });
    }

    const user = db
      .prepare("SELECT * FROM users WHERE username = ?")
      .get(body.username) as User | undefined;

    if (!user || !(await verify(user.password, body.password))) {
      throw createError({
        statusCode: 401,
        message: "用户名或密码错误",
      });
    }

    return {
      id: user.id,
      username: user.username,
    };
  });
});
