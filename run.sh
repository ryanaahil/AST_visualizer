#!/bin/bash
# Quick start script for Parser Visualizer on macOS/Linux

echo ""
echo "======================================"
echo "  Parser Visualizer - Quick Start"
echo "======================================"
echo ""

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Check if virtual environment exists
if [ ! -d "../../.venv" ]; then
    echo "Setting up Python environment..."
    python3 -m venv "../../.venv"
    source "../../.venv/bin/activate"
    pip install -r ../requirements.txt
else
    source "../../.venv/bin/activate"
fi

echo ""
echo "Starting Flask development server..."
echo ""
echo "Opening http://localhost:5000 in your browser..."
echo "Press Ctrl+C to stop the server"
echo ""

# Try to open browser (works on macOS and some Linux systems)
if command -v open &> /dev/null; then
    open http://localhost:5000
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5000
fi

python app.py
