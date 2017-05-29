const MCQ = {
  'A' : 0b1000,
  'B' : 0b0100,
  'C' : 0b0010,
  'D' : 0b0001
}
const EVENT = {
  'INIT_ROOM': 0
}
const SEND_TO = {
  "ALL": 0,
  "USER": 1,
  "ROOM_ALL": 2,
  "ROOM_EXCEPT_SENDER": 3,
  "NULL": -1
}
const REQ_TYPE = {
  'JOIN_ROOM': 0
}
const RES_TYPE = {
  'JOIN_ROOM_RES': 0
}
module.exports = {
  "MCQ": MCQ,
  "SEND_TO": SEND_TO,
  "REQ_TYPE": REQ_TYPE,
  "RES_TYPE": RES_TYPE
}
