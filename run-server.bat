set pass=%1

cd ./LogicClient
start node ./server.js %pass%
timeout 3
cd ../WebServer
start node ./server.js %pass%
