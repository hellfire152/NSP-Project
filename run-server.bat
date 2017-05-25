set pass=%1

cd ./WebServer
start node ./server.js %pass%
cd ../LogicClient
timeout 3
start node ./server.js %pass%
