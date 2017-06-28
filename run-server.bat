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
cd ./DatabaseServer
start node ./database.js %pass%
<<<<<<< HEAD
::timeout 1
cd ../AppServer
start node ./server.js %pass%
::timeout 1
=======
::timeout 0.7
cd ../AppServer
start node ./server.js %pass%
::timeout 0.7
>>>>>>> origin/master
cd ../WebServer
start node ./server.js %pass%

echo Servers started!

:end
