@echo off
title Nihar Portfolio AI — Local Backend
color 0A

echo.
echo  ============================================================
echo    Nihar Portfolio AI — Starting Local Backend
echo  ============================================================
echo.

:: ── 1. ChromaDB ──────────────────────────────────────────────
echo [1/3] Starting ChromaDB on port 8000...
start "ChromaDB" cmd /k "python -m uvicorn chromadb.app:app --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak >nul

:: ── 2. .NET RAG API ───────────────────────────────────────────
echo [2/3] Starting .NET RAG API on port 5000...
start "RAG API" cmd /k "dotnet run --project D:\Codes\nihar840.github.io\.claude\worktrees\charming-burnell-api\RagApi --urls http://localhost:5000"
timeout /t 5 /nobreak >nul

:: ── 3. Cloudflare Tunnel ──────────────────────────────────────
echo [3/3] Starting Cloudflare Tunnel → api.niharranjan.com...
start "CF Tunnel" cmd /k "cloudflared tunnel run --token eyJhIjoiODU1MGNlZjY2NzM4ZDIwYWNhNzJlMmUwNzkxOGQ4MDIiLCJ0IjoiYjE1ZGU5NmItYTUwZC00YjVkLWIzODYtYTU1MTBmY2U1YWNhIiwicyI6Ik0yVTVZMkkyTjJNdFltVTFNUzAwTnpGakxUZ3haVEl0WXpVelpUSTFabVZoTkRJMSJ9"

echo.
echo  ============================================================
echo    All services started!
echo    API local:   http://localhost:5000/api/health
echo    API public:  https://api.niharranjan.com/api/health
echo    Ollama:      http://localhost:11434 (runs as service)
echo  ============================================================
echo.
echo  Press any key to close this launcher (services keep running)
pause >nul
