#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Starting deployment process..."

# Check if all required environment variables are set
if [ -z "$DATABASE_URL" ] || [ -z "$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" ] || [ -z "$CLERK_SECRET_KEY" ]; then
    echo "${RED}Error: Missing required environment variables${NC}"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests
echo "🧪 Running tests..."
npm test || exit 1

# Build the application
echo "🏗️ Building application..."
npm run build || exit 1

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy || exit 1

# Start the application
echo "🌟 Starting application..."
npm start

echo "${GREEN}✅ Deployment completed successfully!${NC}" 