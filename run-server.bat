@ECHO OFF
rem Run this to start the WebServer and AppServer together.
rem Author: Jin Kuan

:start
cd ./DatabaseServer
start node ./database.js ./settings.json
timeout 1
cd ../AppServer
start node ./server.js ./settings.json
timeout 1
cd ../WebServer
start node ./server.js ./settings.json

echo Servers started!

:end
