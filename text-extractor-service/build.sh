#!/bin/bash
# Build script for Render deployment with PyMuPDF

echo "Starting build process..."

# Update package list and install system dependencies
echo "Installing system dependencies..."
apt-get update
apt-get install -y build-essential libgl1 libglib2.0-0 libsm6 libxext6 libxrender-dev libgomp1

# Check if we're in a virtual environment
if [ -z "$VIRTUAL_ENV" ]; then
    echo "Not in a virtual environment"
else
    echo "In virtual environment: $VIRTUAL_ENV"
fi

# Upgrade pip and install wheel for better dependency resolution
echo "Upgrading pip..."
pip install --upgrade pip setuptools wheel

# Install Python dependencies with timeout and error handling
echo "Installing Python dependencies from requirements.txt..."
if pip install --timeout 600 --no-cache-dir -r requirements.txt; then
    echo "Dependencies installed successfully"
else
    echo "Failed to install dependencies, trying with --force-reinstall"
    pip install --timeout 600 --no-cache-dir --force-reinstall -r requirements.txt
fi

# Verify installations
echo "Verifying installations..."
pip list | grep -E "(Flask|PyMuPDF)"

echo "Build completed successfully"