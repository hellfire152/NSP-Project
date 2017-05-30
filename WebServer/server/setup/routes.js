module.exports = function(data) {
  const C = data.C;
  let app = data.app,
    dirname = data.dirname,
    pendingResponses = data.pendingResponses,
    cipher = data.cipher,
    appConn = data.appConn,
    uuid = data.uuid;
  //routing
  //sends index.html when someone sends a https request
  app.get('/', function(req, res){
    res.sendFile(dirname + "/site/index.html");
  });
  //handling play path
  app.get('/play', function(req, res) {
    if(req.query.room.constructor === Array) { //if the room variable has been defined multiple times
      console.log("Well someone's trying to cause an error...");
    } else {
      let roomNo = req.query.room;
      cipher.decryptJSON(req.cookies.login_and_room)
        .catch(reason => {
          console.log(reason);
        })
        .then(function(cookieData) {
          //indirect reference as I can't directly srtingify it for some reason
          let resNo = uuid();
          pendingResponses[resNo] = res;
          appConn.write(JSON.stringify({ //AppServer does verification
            'type': C.REQ_TYPE.JOIN_ROOM, //JOIN_ROOM
            'id': cookieData.id,
            'pass': cookieData.pass,
            'resNo': resNo,
            'room': roomNo
          }));
        });
    }
  });
  app.get('/host', function(req, res) {
    if(req.query.room.constructor === Array) {
      console.log("Please don't mess with my webpage");
    } else {
      let roomNo = req.query.room;
      cipher.decryptJSON(req.cookies.hosting_room)
        .catch(reason => {
          console.log(reason);
        })
        .then(cookieData => {
          let resNo = uuid();
          pendingResponses[resNo] = res;
          console.log("COOKIE DATA GOTTEN");
          appConn.write(JSON.stringify({
            'type': C.RES_TYPE.HOST_ROOM_RES,
            'id': cookieData.id,
            'pass': cookieData.pass,
            'resNo': resNo,
            'room': roomNo,
            'quiz': cookieData.quiz
          }));
        });
    }
  });
  //handling all other requests
  app.get('/*', function(req, res){
    res.sendFile(dirname + "/site" + req.path);
  });

  //handling form submit
  app.post('/join-room', require('../validate-join-room.js')(cipher, appConn));
  app.post('/host-room', require('../validate-host-room.js')(cipher, appConn));
}
