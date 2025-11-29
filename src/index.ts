import { RequestClient } from './core/Request';

export * from './types';
export { RequestClient } from './core/Request';
export { STATUS_CODES, STATUS_TEXTS } from './constants/status';

const axios = new RequestClient();
export default axios;
 