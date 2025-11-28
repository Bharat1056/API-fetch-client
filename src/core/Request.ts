import { fetchAdapter } from '../adapters/FetchAdapter';
import { defaultRequestRetry, defaultRequestTimeout } from "../constants";
import { STATUS_CODES } from '../constants/status';
import { AdapterConfig, AdapterResponse, RequestOptions } from "../types";
import { safeMerge } from "../utils/ObjectMerger";

export class RequestClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout = defaultRequestTimeout;
  private defaultRetry = defaultRequestRetry;

  constructor(
    baseURL: string = "",
    defaultHeaders: Record<string, string> = {}
  ) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
  }

  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  private async runWithRetry<T>(
    fn: () => Promise<T>,
    retry: number
  ): Promise<T> {
    let lastErr;
    for (let i = 0; i <= retry; i++) {
      try {
        return await fn();
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr;
  }

  async request<TResponse = any, TBody = any>(
    options: RequestOptions<TBody>
  ): Promise<TResponse> {
    const {
      method,
      endpoint,
      body,
      headers,
      timeout = this.defaultTimeout,
      retry = this.defaultRetry,
    } = options;

    const finalHeaders = safeMerge(this.defaultHeaders, headers);

    const adapterConfig: AdapterConfig = {
      url: this.baseURL + endpoint,
      method,
      headers: finalHeaders,
      timeout,
      data: body,
      responseType: "json",
    };

    const exec = async () => {
      const response: AdapterResponse<TResponse> = await fetchAdapter<TResponse>(adapterConfig);

      if (response.status === STATUS_CODES.TIMEOUT && response.headers["x-timeout"] === "true") {
        throw new Error(`Timeout: ${timeout}ms`);
      }

      return response.data;
    };

    return this.runWithRetry(exec, retry);
  }

  get<TResponse = any>(
    endpoint: string,
    headers?: Record<string, string>,
    timeout?: number,
    retry?: number
  ) {
    return this.request<TResponse>({
      method: "GET",
      endpoint,
      headers,
      timeout,
      retry,
    });
  }

  post<TResponse = any, TBody = any>(
    endpoint: string,
    body: TBody,
    headers?: Record<string, string>,
    timeout?: number,
    retry?: number
  ) {
    return this.request<TResponse, TBody>({
      method: "POST",
      endpoint,
      body,
      headers,
      timeout,
      retry,
    });
  }

  put<TResponse = any, TBody = any>(
    endpoint: string,
    body: TBody,
    headers?: Record<string, string>,
    timeout?: number,
    retry?: number
  ) {
    return this.request<TResponse, TBody>({
      method: "PUT",
      endpoint,
      body,
      headers,
      timeout,
      retry,
    });
  }

  patch<TResponse = any, TBody = any>(
    endpoint: string,
    body: TBody,
    headers?: Record<string, string>,
    timeout?: number,
    retry?: number
  ) {
    return this.request<TResponse, TBody>({
      method: "PATCH",
      endpoint,
      body,
      headers,
      timeout,
      retry,
    });
  }

  delete<TResponse = any>(
    endpoint: string,
    headers?: Record<string, string>,
    timeout?: number,
    retry?: number
  ) {
    return this.request<TResponse>({
      method: "DELETE",
      endpoint,
      headers,
      timeout,
      retry,
    });
  }
}

// // usage
// const api = new RequestClient("https://api.example.com", {
//   Authorization: "Bearer token123",
// });

// api.get("/users");
// api.post("/login", { email: "a@b.com", pass: "123" });
