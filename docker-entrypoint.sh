#!/bin/sh
set -e

cat > /usr/share/nginx/html/config.js << EOF
window.APP_CONFIG = {
  SIGNALING_SERVER: "${VITE_REACT_APP_SIGNALING_SERVER}",
  API_SERVER: "${VITE_REACT_APP_API_SERVER}",
  API_KEY: "${VITE_REACT_APP_API_KEY}"
};
EOF

echo "Config generated:"
cat /usr/share/nginx/html/config.js

exec nginx -g "daemon off;"
