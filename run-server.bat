@ECHO OFF
rem Run this to start the WebServer, AppServer, and Database together.
rem Author: Jin Kuan

rem Decrypting the settings objects

:start
cd ./SigningAuthority
start node server.js
timeout 1
cd ../DatabaseServer
start node ./database.js "password" "eH7nKNVoeedg7gGZ" "databaseKey" ./settings.json "settingsKey"
timeout 3
cd ../AppServer
start node ./server.js "password" "password2" ./settings.json "settingsKey"
timeout 3
cd ../WebServer
start node ./server.js "password2" ./settings.json "settingsKey"

echo Servers started!
:end
