#!/bin/bash

# Script untuk stop semua services

echo "🛑 Stopping GDSS Pro services..."

# Kill backend (port 8080)
if lsof -ti:8080 > /dev/null 2>&1; then
    echo "Stopping Backend (port 8080)..."
    lsof -ti:8080 | xargs kill -9
    echo "✅ Backend stopped"
else
    echo "ℹ️  Backend is not running"
fi

# Kill frontend (port 5173)
if lsof -ti:5173 > /dev/null 2>&1; then
    echo "Stopping Frontend (port 5173)..."
    lsof -ti:5173 | xargs kill -9
    echo "✅ Frontend stopped"
else
    echo "ℹ️  Frontend is not running"
fi

echo ""
echo "✨ All services stopped!"
