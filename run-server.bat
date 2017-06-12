@ECHO OFF
rem Run this to start the WebServer and AppServer together.
rem Author: Jin Kuan

set pass=%1

if %1.==. goto error
goto start

:error
echo "Usage: ./run-server.bat <password>"
goto end

:start
cd ./custom-API
start node ./database.js %pass%
timeout 2
cd ../AppServer
start node ./server.js %pass%
timeout 2
cd ../WebServer
start node ./server.js %pass%

echo Servers started!

:end
