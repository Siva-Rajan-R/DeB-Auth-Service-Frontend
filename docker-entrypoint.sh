#!/bin/sh
set -e

cat <<EOF > /usr/share/nginx/html/config.js
window.APP_CONFIG = {
  BACKEND_URL: "${VITE_BACKEND_URL:-${BACKEND_URL:-}}",
  FRONTEND_URL: "${VITE_FRONTEND_URL:-${FRONTEND_URL:-}}"
};
EOF

exec "$@"
