#!/bin/bash
# Build script for Render deployment with PyMuPDF

# Update package list and install system dependencies
apt-get update
apt-get install -y build-essential libgl1 libglib2.0-0 libsm6 libxext6 libxrender-dev libgomp1

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

echo "Build completed successfully"