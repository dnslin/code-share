import fs from "fs";
import path from "path";
import { format } from "date-fns";

// 确保日志目录存在
const LOG_DIR = path.join(process.cwd(), "logs");
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

// 获取当前日期作为日志文件名
const getLogFileName = () => {
  return path.join(LOG_DIR, `${format(new Date(), "yyyy-MM-dd")}.log`);
};

// 写入日志
const writeLog = (message: string, type: string) => {
  const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  const logMessage = `[${timestamp}] ${message}\n`;

  fs.appendFileSync(getLogFileName(), logMessage);

  const consoleMessage = `${
    type === "ERROR" ? "\x1b[31m" : "\x1b[36m"
  }[${timestamp}] ${message}\x1b[0m`;
  console.log(consoleMessage);
};

export const logger = {
  info: (message: string) => writeLog(`[INFO] ${message}`, "INFO"),
  error: (message: string) => writeLog(`[ERROR] ${message}`, "ERROR"),
  request: (method: string, url: string, params: any, duration: number) => {
    const message = `[REQUEST] ${method} ${url} - Params: ${JSON.stringify(
      params
    )} - Duration: ${duration}ms`;
    writeLog(message, "INFO");
  },
};

// 启动时的日志
console.log("\x1b[32m%s\x1b[0m", "📝 Logger initialized");
