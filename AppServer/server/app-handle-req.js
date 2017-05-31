module.exports = async function(data, C) {
  console.log("REQ TYPE: " +data.type);
  switch(data.type) {
    case C.REQ_TYPE.JOIN_ROOM: {
      return await join_room(data, C);
      break;
    }
    case C.REQ_TYPE.HOST_ROOM: {
      return await host_room(data, C);
      break;
    }
    //ADD MORE CASES HERE
  }
}

async function join_room(data, C) {
  if(/*TODO::VALID LOGIN*/true) {
    response = {
      'type': C.RES_TYPE.JOIN_ROOM_RES,
      'validLogin': true,
      'room': data.room,
      'resNo': data.resNo,
      'id': data.id
    };
    return response;
  } else {
    //INVALID LOGIN
  }
}

async function host_room(data, C) {
  console.log("HOST_ROOM_REQ");
  response = {
    'type': C.RES_TYPE.HOST_ROOM_RES,
    'validLogin': true,//TODO::Proper login check
    'resNo': data.resNo,
    'hostId': data.id,
  };
  return response;
}
