import Database from "better-sqlite3";
import type { Database as DatabaseType } from "better-sqlite3";
import { defineEventHandler } from "h3";

let db: DatabaseType;

export function initDatabase() {
  if (!db) {
    db = new Database("database.db");

    // 创建用户表
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  return db;
}

// 数据库操作包装器
export function withDb<T>(handler: (db: DatabaseType) => T) {
  return defineEventHandler((event) => {
    const database = initDatabase();
    return handler(database);
  });
}

// 定义错误类型
export interface SqliteError extends Error {
  code?: string;
}
