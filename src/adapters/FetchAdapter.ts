import { defaultRequestTimeout, defaultResponseType, parseResponse, timeoutHeaderObject, timeoutPromise } from '../constants';
import { STATUS_CODES, STATUS_TEXTS } from '../constants/status';
import { AdapterConfig, AdapterResponse } from '../types';

export async function fetchAdapter<T = any>(
  config: AdapterConfig
): Promise<AdapterResponse<T>> {
  const controller = new AbortController();
  if (config.signal) {
    config.signal.addEventListener("abort", () => controller.abort());
  }

  const fetchPromise = fetch(config.url, {
    method: config.method,
    headers: config.headers,
    body: config.data ? JSON.stringify(config.data) : undefined,
    credentials: config.withCredentials ? "include" : "same-origin",
    signal: controller.signal,
  });

  let response: Response;

  try {
    response = await (config.timeout
      ? Promise.race([fetchPromise, timeoutPromise(config.timeout)])
      : fetchPromise);
  } catch (err: any) {
    if (err.__timeout__) {
      return {
        data: null as any,
        status: STATUS_CODES.TIMEOUT,
        statusText: STATUS_TEXTS.TIMEOUT,
        headers: timeoutHeaderObject(config.timeout ?? defaultRequestTimeout),
        config,
        request: null,
      };
    }
    throw err;
  }

  const parsed = await parseResponse(response, config.responseType);

  const headers: Record<string, string> = {};
  response.headers.forEach((v, k) => (headers[k] = v));

  headers["x-timeout"] = "false";

  return {
    data: parsed as T,
    status: response.status,
    statusText: response.statusText,
    headers,
    config,
    request: response,
  };
}
