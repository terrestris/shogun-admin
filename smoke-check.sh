#!/bin/bash
set -e

npm run start &
APP_PID=$!

echo "Waiting for app to be available at http://localhost:8080/ ..."
for i in {1..30}; do
  if curl -fs http://localhost:8080/ > /dev/null; then
    echo "App is up!"
    break
  fi
  sleep 2
done

echo "Checking app content..."
curl -fs http://localhost:8080/ | grep -q '<title>' && echo "App content OK" || { echo "App content check FAILED"; kill $APP_PID; exit 1; }

echo "Smoke test passed!"
