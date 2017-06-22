/*
  Includes functions that handles all GET or POST requests.

  Author: Jin Kuan
*/
module.exports = function(data) {
    const C = data.C;
    let app = data.app,
        dirname = data.dirname,
        pendingResponses = data.pendingResponses,
        cipher = data.cipher,
        appConn = data.appConn,
        uuid = data.uuid,
        queryOfUser = data.queryOfUser;
    //routing
    //sends index.html when someone sends a https request
    app.get('/', function(req, res) {
        res.sendFile(dirname + "/site/index.html");
    });
    //BRYAN AREA
    app.get('/bryan', function(req, res) {
        res.sendFile(dirname + "/site/webpageDesign/Report.html");
    });


    //Bryan area

    //handling play path
    app.get('/play', function(req, res) { //submitted a form for playing in a room
        if (req.query.room.constructor === Array) { //if the room variable has been defined multiple times
            console.log("Well someone's trying to cause an error...");
        } else {
            let roomNo = req.query.room;
            cipher.decryptJSON(req.cookies.login)
                .catch(reason => {
                    console.log(reason);
                })
                .then(function(cookieData) {
                    //indirect reference as I can't directly srtingify it for some reason
                    let resNo = uuid();
                    pendingResponses[resNo] = res;
                    console.log('Response pending, no: ' + resNo);
                    appConn.write(JSON.stringify({ //AppServer does verification
                        'type': C.REQ_TYPE.JOIN_ROOM, //JOIN_ROOM
                        'id': cookieData.id,
                        'pass': cookieData.pass,
                        'resNo': resNo,
                        'roomNo': roomNo
                    }));
                });
        }
    });
    app.get('/host', function(req, res) { //submit the form for hosting a room
        if (req.query.quizId.constructor === Array) {
            console.log("Please don't mess with my webpage");
        } else {
            let quizId = req.query.quizId;
            cipher.decryptJSON(req.cookies.login)
                .catch(reason => {
                    console.log(reason);
                })
                .then(cookieData => {
                    let resNo = uuid();
                    pendingResponses[resNo] = res;
                    console.log("COOKIE DATA: ");
                    console.log(cookieData);

                    appConn.write(JSON.stringify({
                        'type': C.REQ_TYPE.HOST_ROOM,
                        'id': cookieData.id,
                        'pass': cookieData.pass,
                        'resNo': resNo,
                        'quizId': quizId
                    }));
                });
        }
    });

    /*TESTING*/
    app.get('/test', function(req, res) {
        res.render('test', {});
    });

    //handling all other requests (PUT THIS LAST)
    app.get('/*', function(req, res) {
        res.sendFile(dirname + "/site" + req.path);
    });

    //handling form submits
    app.post('/join-room', require('../validate-join-room.js')(cipher, appConn));
    app.post('/host-room', require('../validate-host-room.js')(cipher, appConn));
}