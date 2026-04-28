#!/usr/bin/env bash
# Start script for Render deployment

set -e  # Exit on error

echo "Starting FastAPI application..."

# Start the application
# Use PORT environment variable from Render, default to 8000
exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}