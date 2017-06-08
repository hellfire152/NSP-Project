const C = {
  "MCQ" : {
    "A" : 8,
    "B" : 4,
    "C" : 2,
    "D" : 1
  },
  "SPECIAL" : {
    "SOCKET_DISCONNECT" : 500,
    "HOST_DISCONNECT": 501
  },
  "SEND_TO": {
    "ALL": 0,
    "USER": 1,
    "ROOM": 2,
    "ROOM_EXCEPT_SENDER": 3
  },
  "EVENT" : {
    "JOIN_ROOM": 1,
    "GAMEMODE_SET": 2,
    "PLAYER_JOIN" : 3
  },
  "EVENT_RES" : {
    "GAMEMODE_CONFIRM" : 1,
    "PLAYER_JOIN" : 2,
    "PLAYER_LIST" : 3
  },
  "GAME": {
    "START": 10,
    "SUBMIT_ANSWER": 11
  },
  "GAME_RES": {
    "BEGIN_FIRST_QUESTION": 10,
    "ANSWER_CHOSEN": 11,
    "ROUND_END": 12,
    "NEXT_QUESTION": 13
  },
  "GAMEMODE" : {
    "CLASSIC": 0,
    "RACE" : 1,
    "TEAM_BATTLE" : 2,
    "TUG_OF_WAR" : 3
  },
  "ROOM_EVENT" : {
    "JOIN" : 0,
    "DELETE_ROOM" : 1
  },
  "REQ_TYPE" : {
    "JOIN_ROOM": 0,
    "HOST_ROOM": 1
  },
  "RES_TYPE" : {
    "JOIN_ROOM_RES": 0,
    "HOST_ROOM_RES": 1
  },
  "DB" : {
    "SELECT" : {
      "USER_ACCOUNT" : 101,
      "STUDENT_DETAILS" : 102,
      "TEACHER_DETAILS" : 103,
      "QUIZ" : 104,
      "QUIZ_QUESTION" : 105,
      "QUIZ_QUESTION_CHOICES" : 106,
      "LOG_QUIZ" : 107,
      "LOG_QUESTION" : 108,
      "ACHIEVEMENTS" : 109,
      "ACHIEVEMENTS_EARNED" : 110
     },
    "INSERT" : {
      "USER_ACCOUNT" : 201,
      "STUDENT_DETAILS" : 202,
      "TEACHER_DETAILS" : 203,
      "QUIZ" : 204,
      "QUIZ_QUESTION" : 205,
      "QUIZ_QUESTION_CHOICES" : 206,
      "LOG_QUIZ" : 207,
      "LOG_QUESTION" : 208,
      "ACHIEVEMENTS" : 209,
      "ACHIEVEMENTS_EARNED" : 210
    },
    "UPDATE" : {
      "USER_ACCOUNT" : 301,
      "STUDENT_DETAILS" : 302,
      "TEACHER_DETAILS" : 303,
      "QUIZ" : 304,
      "QUIZ_QUESTION" : 305,
      "QUIZ_QUESTION_CHOICES" : 306,
      "LOG_QUIZ" : 307,
      "LOG_QUESTION" : 308,
      "ACHIEVEMENTS" : 309,
      "ACHIEVEMENTS_EARNED" : 310
    },
    "DELETE" : {
      "USER_ACCOUNT" : 401,
      "STUDENT_DETAILS" : 402,
      "TEACHER_DETAILS" : 403,
      "QUIZ" : 404,
      "QUIZ_QUESTION" : 405,
      "QUIZ_QUESTION_CHOICES" : 406,
      "LOG_QUIZ" : 407,
      "LOG_QUESTION" : 408,
      "ACHIEVEMENTS" : 409,
      "ACHIEVEMENTS_EARNED" : 410
    }
  },
  "ERR" : {
    "DIFFERENT_DEVICE_LOGIN" : 1000,
    "NO_SPARE_ROOMS" : 1001,
    "INVALID_LOGIN" : 1002,
    "QUIZ_DOES_NOT_EXIST" : 1003,
    "GAME_ALREADY_STARTED" : 1004,
    "ROOM_DOES_NOT_EXIST" : 1005,
    "ROOM_NOT_JOINABLE" : 1006,
    "DUPLICATE_ID": 1007,
    "INACCESSIBLE_PRIVATE_QUIZ": 1008,

    "ALREADY_ANSWERED": 1500
  }
}
