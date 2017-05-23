module.exports = function(data) {
  var app = data.app;
  var io = data.io;
  var sessionHandler = data.sessionHandler;
  //routing
  //sends index.html when someone sends a https request
  app.get('/', function(req, res){
    res.sendFile(__dirname + "/site/index.html");
  });
  //handling play path
  app.get('/play', function(req, res) {

  });
  //handling all other requests
  app.get('/*', function(req, res){
    res.sendFile(__dirname + "/site" + req.path);
  });
  //handling form submits
  app.post('/join-room', require('./server/validate-join-room.js')(sessionHandler));

  //Various middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(expressValidator());
  app.use("/", express.static(__dirname));
  app.use(helmet()); //adds a bunch of security features
  app.use(session);

  require('./game.js')(io);
}
