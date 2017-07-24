@ECHO OFF
rem Run this to start the WebServer, AppServer, and Database together.
rem Author: Jin Kuan

rem Decrypting the settings objects

:start
cd ./DatabaseServer
xcopy ./settings.json ./settings-decrypted.json
cipher /d /a ./settings-decrypted.json
start node ./database.js "password" " " "databaseKey" ./settings-decrypted.json "settingsKey"
timeout 1
cd ../AppServer
xcopy ./settings.json ./settings-decrypted.json
cipher /d /a ./settings-decrypted.json
start node ./server.js "password" "password2" ./settings-decrypted.json "settingsKey"
timeout 1
cd ../WebServer
xcopy ./settings.json ./settings-decrypted.json
cipher /d /a ./settings-decrypted.json
start node ./server.js "password2" ./settings-decrypted.json "settingsKey"

echo Servers started!
:end
