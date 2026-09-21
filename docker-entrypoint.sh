#!/bin/sh
set -e

# Extract and sanitize variables
BACKEND="${VITE_BACKEND_URL:-${BACKEND_URL:-}}"
FRONTEND="${VITE_FRONTEND_URL:-${FRONTEND_URL:-}}"

# Strip surrounding quotes if present
BACKEND=$(echo "$BACKEND" | sed -e "s/^['\"]//" -e "s/['\"]$//")
FRONTEND=$(echo "$FRONTEND" | sed -e "s/^['\"]//" -e "s/['\"]$//")

cat <<EOF > /usr/share/nginx/html/config.js
window.APP_CONFIG = {
  BACKEND_URL: "${BACKEND}",
  FRONTEND_URL: "${FRONTEND}"
};
EOF

exec "$@"
