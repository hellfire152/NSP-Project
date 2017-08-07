@ECHO OFF
rem Run this to start the WebServer, AppServer, and Database together.
rem Author: Jin Kuan

rem Decrypting the settings objects

:start
cd ./DatabaseServer
start node ./database.js "password" " " "eH7nKNVoeedg7gGZ" ./settings.json "settingsKey"
timeout 1
cd ../AppServer
start node ./server.js "password" "password2" ./settings.json "settingsKey"
timeout 1
cd ../WebServer
start node ./server.js "password2" ./settings.json "settingsKey"

echo Servers started!
:end
