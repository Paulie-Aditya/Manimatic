#!/bin/bash

# Build script for Manimatic containers
set -e

echo "🏗️  Building Manimatic containers..."

# Build worker container first
echo "📦 Building worker container..."
docker build -f backend/Dockerfile.worker -t manimatic-worker:latest ./backend

# Build backend container
echo "🚀 Building backend container..."
docker build -f backend/Dockerfile.backend -t manimatic-backend:latest ./backend

echo "✅ Build complete!"
echo ""
echo "To run the application:"
echo "  docker-compose up"
echo ""
echo "To run in detached mode:"
echo "  docker-compose up -d"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f manimatic-backend"
