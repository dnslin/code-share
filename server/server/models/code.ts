import { initDatabase } from "../utils/db";

const db = initDatabase();

// 初始化代码表
db.exec(`
  CREATE TABLE IF NOT EXISTS codes (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    language TEXT NOT NULL,
    access_code TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME
  )
`);

export interface CodeData {
  id: string;
  code: string;
  language: string;
  accessCode?: string;
  expiresAt?: Date;
}

export const CodeModel = {
  // 创建新代码
  create: (data: CodeData) => {
    const stmt = db.prepare(`
      INSERT INTO codes (id, code, language, access_code, expires_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(
      data.id,
      data.code,
      data.language,
      data.accessCode || null,
      data.expiresAt?.toISOString() || null
    );
  },

  // 获取代码
  getById: (id: string) => {
    return db.prepare("SELECT * FROM codes WHERE id = ?").get(id);
  },

  // 验证访问码
  verifyAccessCode: (id: string, accessCode: string) => {
    const code = db
      .prepare("SELECT access_code FROM codes WHERE id = ?")
      .get(id) as { access_code: string | null };
    return !code.access_code || code.access_code === accessCode;
  },
};
