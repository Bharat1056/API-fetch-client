import { fetchAdapter } from '../adapters/FetchAdapter';
import { xhrAdapter } from '../adapters/XhrAdapter';
import { AdapterConfig } from '../types';

export const defaultRequestTimeout = 5000;
export const defaultRequestRetry = 1;
export const defaultResponseType = "json";

export const parseResponse = async (res: Response, type?: AdapterConfig["responseType"]) => {
  switch (type) {
    case "blob":
      return res.blob();
    case "arraybuffer":
      return res.arrayBuffer();
    case "text":
      return res.text();
    case "json":
    default:
      return res.json().catch(() => null);
  }
};

export const timeoutPromise = (ms: number) =>
  new Promise<never>((_, reject) =>
    setTimeout(() => {
      const err: any = new Error(`Request timeout after ${ms}ms`);
      err.__timeout__ = true;
      reject(err);
    }, ms)
  );

export const timeoutHeaderObject = (ms: number) => ({
  "x-timeout": "true",
  "x-timeout-ms": String(ms),
});

export function parseHeaders(headers: string) {
  const parsed: Record<string, string> = {};
  headers.trim().split(/[\r\n]+/).forEach((line) => {
    const [key, ...rest] = line.split(": ");
    if (key) parsed[key.toLowerCase()] = rest.join(": ");
  });
  return parsed;
}

export function parseJSON(str: string) {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}


export function getAdapter() {
  if (typeof fetch === "function") return fetchAdapter;
  return xhrAdapter;
}
