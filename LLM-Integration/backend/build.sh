#!/usr/bin/env bash
# Build script for Render deployment

set -e  # Exit on error

echo "Starting build process..."

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements-render.txt

echo "Build completed successfully!"