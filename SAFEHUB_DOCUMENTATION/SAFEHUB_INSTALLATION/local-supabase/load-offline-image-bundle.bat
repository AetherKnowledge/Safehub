@echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0"

set "CONTAINERS_DIR=containers"

if not exist "%CONTAINERS_DIR%" (
  echo [SafeHub] Missing %CONTAINERS_DIR% folder.
  echo Run create-offline-image-bundle.bat on an online machine first, then copy this folder here.
  exit /b 1
)

if not exist "%CONTAINERS_DIR%\*.tar" (
  echo [SafeHub] No .tar image files found in %CONTAINERS_DIR%.
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

for %%F in ("%CONTAINERS_DIR%\*.tar") do (
  echo [SafeHub] Loading %%~nxF...
  docker load -i "%%F"
  if errorlevel 1 (
    echo [SafeHub] Failed to load %%~nxF.
    exit /b 1
  )
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
