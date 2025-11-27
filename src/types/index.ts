export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions<TBody = any> {
  method: HTTPMethod;
  endpoint: string;
  body?: TBody;
  headers?: Record<string, string>;
  timeout?: number;
  retry?: number;
}
