// adapters/xhrAdapter.ts

import { defaultRequestTimeout, parseHeaders, parseJSON } from '../constants';
import { AdapterConfig, AdapterResponse } from "../types";

export function xhrAdapter<T = any>(options: AdapterConfig): Promise<AdapterResponse<T>> {

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    const url = options.url;

    xhr.open(options.method, url, true);

    if (options.headers) {
      Object.keys(options.headers).forEach((key) =>
        xhr.setRequestHeader(key, options.headers![key])
      );
    }

    xhr.timeout = options.timeout ?? defaultRequestTimeout;

    xhr.onload = () => {
      const res = {
        data: parseJSON(xhr.responseText),
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders()),
        config: options,
        request: xhr,
      };
      xhr.status >= 200 && xhr.status < 300 ? resolve(res as any) : reject(res);
    };

    xhr.onerror = () => reject({ message: "Network Error", request: xhr });

    xhr.ontimeout = () =>
      reject({ message: `Timeout ${xhr.timeout}ms`, request: xhr });

    if (options.data) xhr.send(options.data as any);
    else xhr.send();
  });
}
