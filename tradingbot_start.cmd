@echo off
REM Auto-start trading bot recovery on login
wsl.exe -- bash -lc "cd '/mnt/g/New folder/New folder/trading_bot' && bash scripts/recover_after_restart.sh >> '/mnt/g/New folder/New folder/trading_bot/logs/recover_startup.log' 2>&1"
