#!/bin/bash
# Build script for Render deployment with PyMuPDF

# Update package list and install system dependencies
apt-get update
apt-get install -y build-essential libgl1 libglib2.0-0 libsm6 libxext6 libxrender-dev libgomp1

# Upgrade pip and install wheel for better dependency resolution
pip install --upgrade pip setuptools wheel

# Install Python dependencies with timeout and retry mechanism
echo "Installing Python dependencies..."
pip install --timeout 300 -r requirements.txt

echo "Build completed successfully"