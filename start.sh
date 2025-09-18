#!/bin/bash

# Blackwater Industries Backend Startup Script

echo "🚀 Starting Blackwater Industries Backend Server..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp env.example .env
    echo "📝 Please edit .env file with your email configuration before running again."
    echo "   Required: SMTP_USER, SMTP_PASS, TARGET_EMAIL"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🌐 Starting server on port ${PORT:-3000}..."
npm start
