#!/bin/bash

# Script untuk menjalankan Frontend dan Backend secara bersamaan
# Pastikan script ini executable: chmod +x start.sh

echo "🚀 Starting GDSS Pro Application..."
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on CTRL+C
trap cleanup SIGINT SIGTERM

# Start Backend (Go)
echo "📦 Starting Backend Server (Go)..."
cd services
go run cmd/api/main.go &
BACKEND_PID=$!
cd ..
echo "✅ Backend started on http://localhost:8080 (PID: $BACKEND_PID)"
echo ""

# Wait a bit for backend to start
sleep 2

# Start Frontend (React)
echo "🎨 Starting Frontend Server (Vite)..."
cd interfaces
npm run dev &
FRONTEND_PID=$!
cd ..
echo "✅ Frontend started on http://localhost:5173 (PID: $FRONTEND_PID)"
echo ""

echo "✨ Application is ready!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8080"
echo ""
echo "Press CTRL+C to stop all services"
echo ""

# Wait for both processes
wait
