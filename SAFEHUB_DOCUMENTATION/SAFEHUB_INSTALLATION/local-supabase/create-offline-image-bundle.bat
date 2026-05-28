@echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0"

set "BUNDLE=safehub-local-supabase-images.tar"
set "IMAGE_LIST=safehub-local-supabase-images.txt"

echo [SafeHub] Pulling images from docker-compose.yml...
docker compose pull
if errorlevel 1 (
  echo [SafeHub] Failed to pull one or more images.
  exit /b 1
)

echo [SafeHub] Writing image list to %IMAGE_LIST%...
docker compose config --images > "%IMAGE_LIST%"
if errorlevel 1 (
  echo [SafeHub] Failed to read images from docker compose.
  exit /b 1
)

set "IMAGES="
for /f "usebackq delims=" %%I in ("%IMAGE_LIST%") do (
  if not "%%I"=="" set "IMAGES=!IMAGES! "%%I""
)

if "%IMAGES%"=="" (
  echo [SafeHub] No images found.
  exit /b 1
)

echo [SafeHub] Saving images to %BUNDLE%...
docker save -o "%BUNDLE%" %IMAGES%
if errorlevel 1 (
  echo [SafeHub] Failed to save Docker image bundle.
  exit /b 1
)

echo.
echo [SafeHub] Offline image bundle created:
echo   %CD%\%BUNDLE%
echo.
echo Copy this folder and %BUNDLE% to the offline machine.
echo On the offline machine, run:
echo   load-offline-image-bundle.bat

endlocal
