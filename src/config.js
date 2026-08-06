const getEnv = (key, viteFallback, defaultVal = "") => {
  const windowVal = typeof window !== 'undefined' && window.APP_CONFIG ? window.APP_CONFIG[key] : undefined;
  if (windowVal && !windowVal.startsWith("$")) {
    return windowVal;
  }
  if (viteFallback && !viteFallback.startsWith("$")) {
    return viteFallback;
  }
  return defaultVal;
};

export const APP_CONFIG = {
  BACKEND_URL: getEnv("BACKEND_URL", import.meta.env.VITE_BACKEND_URL, "http://127.0.0.1:8000"),
  FRONTEND_URL: getEnv("FRONTEND_URL", import.meta.env.VITE_FRONTEND_URL, typeof window !== 'undefined' ? window.location.origin : ""),
};
