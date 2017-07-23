@ECHO OFF
rem Run this to start the WebServer, AppServer, and Database together.
rem Author: Jin Kuan

:start
cd ./DatabaseServer
start node ./database.js "password" " " "databaseKey" ./settings.json
timeout 1
cd ../AppServer
start node ./server.js "password" "password2" ./settings.json
timeout 1
cd ../WebServer
start node ./server.js "password2" ./settings.json

echo Servers started!

:end
