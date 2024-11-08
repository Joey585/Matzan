@echo off
setlocal enabledelayedexpansion
set "baseDir=%~dp0"  :: Set base directory to the folder where the .bat file is located

:: Loop through each directory in the base directory
for /D %%d in ("%baseDir%\*") do (
    if exist "%%d\index.ts" (
        for %%f in ("%%d") do set "myfolder=%%~nxf"
        start wt -w 0 nt -d "%%d" cmd /k "cd /d %%d && npm start"
    )
)

endlocal
pause  :: Keeps the original window open
