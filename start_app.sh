#!/usr/bin/env bash

# DataPilot Full-Stack Launcher (Backend API + React Frontend)
# Works on macOS, Linux, and Git Bash / WSL

set -e

# Resolve script directory so it can be called from anywhere
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ANSI color codes
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}==========================================${NC}"
echo -e "${CYAN} Starting DataPilot Enterprise 2.0        ${NC}"
echo -e "${CYAN}==========================================${NC}"

# Detect Python interpreter (virtual environment or system)
PYTHON_BIN=""
if [ -f "myenv/bin/python" ]; then
    PYTHON_BIN="myenv/bin/python"
elif [ -f ".venv/bin/python" ]; then
    PYTHON_BIN=".venv/bin/python"
elif [ -f "venv/bin/python" ]; then
    PYTHON_BIN="venv/bin/python"
elif [ -f "myenv/Scripts/python.exe" ]; then
    PYTHON_BIN="myenv/Scripts/python.exe"
elif command -v python3 >/dev/null 2>&1; then
    PYTHON_BIN="$(command -v python3)"
elif command -v python >/dev/null 2>&1; then
    PYTHON_BIN="$(command -v python)"
else
    echo -e "${RED}[ERROR] Python was not found on your PATH or in a virtual environment (myenv/.venv/venv).${NC}"
    exit 1
fi

echo -e "${YELLOW}Using Python:${NC} $PYTHON_BIN"

# Check if npm is installed
if ! command -v npm >/dev/null 2>&1; then
    echo -e "${RED}[ERROR] npm is required to run the frontend dev server, but it was not found on your PATH.${NC}"
    exit 1
fi

# Track backend PID for cleanup on exit (Ctrl+C)
BACKEND_PID=""

cleanup() {
    echo ""
    echo -e "${YELLOW}Stopping DataPilot services...${NC}"
    if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
        echo -e "${YELLOW}Terminating Backend API (PID: $BACKEND_PID)...${NC}"
        kill "$BACKEND_PID" 2>/dev/null || true
        wait "$BACKEND_PID" 2>/dev/null || true
    fi
    echo -e "${GREEN}All services stopped cleanly.${NC}"
    exit 0
}

# Trap SIGINT (Ctrl+C), SIGTERM, and script exit
trap cleanup SIGINT SIGTERM EXIT

# 1. Start FastAPI backend in background
echo -e "${YELLOW}[1/2] Launching Backend API (http://localhost:8001)...${NC}"
"$PYTHON_BIN" api_server.py &
BACKEND_PID=$!

# Wait for backend initialization (it loads RAG docs, builds fonts & pre-renders charts)
echo -ne "${YELLOW}Waiting for Backend API to finish initializing...${NC}"
READY=0
for i in $(seq 1 35); do
    if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
        echo ""
        echo -e "${RED}[ERROR] Backend API process terminated unexpectedly. Check logs above.${NC}"
        exit 1
    fi

    # Ping status endpoint using Python (portable across curl versions)
    if "$PYTHON_BIN" -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8001/api/status', timeout=1)" >/dev/null 2>&1; then
        READY=1
        break
    fi
    echo -n "."
    sleep 1
done
echo ""

if [ "$READY" -eq 1 ]; then
    echo -e "${GREEN}✓ Backend API is healthy & responding at http://localhost:8001 (PID: $BACKEND_PID)${NC}"
else
    echo -e "${YELLOW}[NOTE] Backend process is running (PID: $BACKEND_PID). Continuing to launch frontend...${NC}"
fi

# 2. Start Vite React frontend
echo -e "${GREEN}[2/2] Launching Frontend Dev Server (http://localhost:5173)...${NC}"
cd datapilot-frontend
npm run dev

