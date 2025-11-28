export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type ResponseType = "json" | "text" | "blob" | "arraybuffer";

export interface RequestOptions<TBody = any> {
  method: HTTPMethod;
  endpoint: string;
  body?: TBody;
  headers?: Record<string, string>;
  timeout?: number;
  retry?: number;
}

export interface AdapterConfig {
  url: string;
  method: string;
  headers?: Record<string, string>;
  data?: any;
  timeout?: number;
  responseType?: ResponseType;
  withCredentials?: boolean;
  signal?: AbortSignal;
}

export interface AdapterResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: AdapterConfig;
  request: Response | null;
}
