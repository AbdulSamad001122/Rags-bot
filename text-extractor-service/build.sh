#!/bin/bash
# Build script for Render deployment

# Install system dependencies
apt-get update
apt-get install -y build-essential libffi-dev

# Install Python dependencies
pip install -r requirements.txt