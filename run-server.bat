set pass=%1

cd ./AppServer
start node ./server.js %pass%
timeout 3
cd ../WebServer
start node ./server.js %pass%
