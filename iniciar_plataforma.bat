@echo off
title PaceRun - Assessoria de Corrida PWA
echo ===================================================
echo   Iniciando PaceRun - Assessoria de Corrida (PWA)
echo ===================================================
echo.
set PATH=C:\Program Files\nodejs;%PATH%
cd /d "%~dp0"
echo Abrindo em http://localhost:3000...
start http://localhost:3000
npm run dev
pause
