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
