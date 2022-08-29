export const RDS_API_URL_SELF = 'https://api.realdevsquad.com/users/self';
export const UPDATE_SSE_EVENTS_TIME = 5000;
export const SSE_RESPONSE_HEADER = {
  Connection: 'keep-alive',
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'X-Accel-Buffering': 'no',
};
export const CORS_OPTIONS = {
  origin: /(\.realdevsquad\.com$)|(localhost)/,
  credentials: true,
};
export const LOCAL_PORT = 5000;