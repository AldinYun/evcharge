#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy

if [ "$RUN_MOCK_PIPELINE_ON_START" = "true" ]; then
  echo "Running mock EV pipeline..."
  npm run pipeline:mock
fi

echo "Starting EV Charge app..."
exec "$@"
