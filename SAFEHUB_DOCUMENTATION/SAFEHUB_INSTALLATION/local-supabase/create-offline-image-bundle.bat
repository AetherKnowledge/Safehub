@echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0"

set "CONTAINERS_DIR=containers"
set "IMAGE_LIST=%CONTAINERS_DIR%\safehub-local-supabase-images.txt"

if not exist "%CONTAINERS_DIR%" mkdir "%CONTAINERS_DIR%"

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

set "COUNT=0"

for /f "usebackq delims=" %%I in ("%IMAGE_LIST%") do (
  if not "%%I"=="" (
    set /a COUNT+=1
    set "IMAGE=%%I"
    set "FILE=!IMAGE:/=_!"
    set "FILE=!FILE::=_!"
    set "FILE=!FILE:@=_!"
    set "FILE=!FILE:\=_!"
    set "TARGET=%CONTAINERS_DIR%\!FILE!.tar"

    echo [SafeHub] Saving %%I...
    if exist "!TARGET!" del /f /q "!TARGET!"
    docker save -o "!TARGET!" "%%I"
    if errorlevel 1 (
      echo [SafeHub] Failed to save %%I.
      exit /b 1
    )
  )
)

if "%COUNT%"=="0" (
  echo [SafeHub] No images found.
  exit /b 1
)

echo.
echo [SafeHub] Offline container image files updated in:
echo   %CD%\%CONTAINERS_DIR%
echo.
echo Copy this whole folder to the offline machine.
echo On the offline machine, run:
echo   load-offline-image-bundle.bat

endlocal
