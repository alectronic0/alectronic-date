#!/bin/bash
echo "🚀 Starting development server..."
echo "📍 Open: http://localhost:8000"
echo "📁 Serving from: $(pwd)"
echo "Press Ctrl+C to stop"
python3 -m http.server 8000 --bind 127.0.0.1
