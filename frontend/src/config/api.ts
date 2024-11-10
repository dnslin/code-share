// 在开发环境中，会通过 Vite 代理转发请求
// 在生产环境中，会直接请求同域的 API
const BASE_PATH = "/api";

export const API = {
  code: {
    save: `${BASE_PATH}/code`,
    get: (id: string) => `${BASE_PATH}/code/${id}`,
  },
  languages: `${BASE_PATH}/languages`,
};

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};
