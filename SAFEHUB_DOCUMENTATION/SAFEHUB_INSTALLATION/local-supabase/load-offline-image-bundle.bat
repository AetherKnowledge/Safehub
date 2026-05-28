@echo off
setlocal EnableExtensions

cd /d "%~dp0"

set "BUNDLE=safehub-local-supabase-images.tar"

if not exist "%BUNDLE%" (
  echo [SafeHub] Missing %BUNDLE% in this folder.
  echo Put the image bundle beside this script, then run again.
  exit /b 1
)

if not exist ".env" (
  if exist ".env.example" (
    echo [SafeHub] .env not found. Creating it from .env.example...
    copy ".env.example" ".env" >nul
  ) else (
    echo [SafeHub] .env and .env.example are missing.
    exit /b 1
  )
)

echo [SafeHub] Loading Docker images from %BUNDLE%...
docker load -i "%BUNDLE%"
if errorlevel 1 (
  echo [SafeHub] Failed to load Docker images.
  exit /b 1
)

echo [SafeHub] Starting SafeHub local Supabase stack...
docker compose up -d
if errorlevel 1 (
  echo [SafeHub] Docker compose failed to start.
  exit /b 1
)

echo.
echo [SafeHub] Started.
echo   SafeHub: http://localhost:3000
echo   Supabase Studio / Kong: http://localhost:10000

endlocal
