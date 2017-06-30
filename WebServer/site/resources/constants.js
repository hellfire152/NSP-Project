const C = {

  "MCQ" : {
    "A" : 8,
    "B" : 4,
    "C" : 2,
    "D" : 1
  },

  "TYPE" : {
    "PUBLIC" : 0,
    "PRIVATE" : 1
  },

  "SPECIAL" : {
    "SOCKET_DISCONNECT" : 500,
    "HOST_DISCONNECT": 501,

    "NULL": 0
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
    "SUBMIT_ANSWER": 11,
    "NEXT_ROUND": 12,
    "SUBMIT_TEAM": 13
  },
  "GAME_RES": {
    "BEGIN_FIRST_QUESTION": 10,
    "ANSWER_CHOSEN": 11,
    "ROUND_END": 12,
    "NEXT_QUESTION": 13,
    "GAME_END": 14,
    "WRONG_ANSWER": 15,
    "PLAYER_FINISH": 16,
    "TEAM_CHOSEN": 17,
    "CONFIRM_TEAM_NO" : 18,
    "RESPONSE_DATA" : 19
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
    "HOST_ROOM": 1,

    "CREATE_QUIZ": 10,
    "ADD_QUESTION": 11,
    "ADD_QUIZ" : 12,
    "DATABASE" : 100

  },
  "RES_TYPE" : {
    "JOIN_ROOM_RES": 0,
    "HOST_ROOM_RES": 1,
    "CREATE_QUIZ_RES": 10,
    "ADD_QUESTION_RES": 11,
    "ADD_QUIZ_RES" : 12
  },
  "DB" : {
    "CREATE" : {
      "STUDENT_ACC" : 101,
      "TEACHER_ACC" : 102,
      "QUIZ" : 103
    },
    "SELECT" : {
      "ALL_QUIZ" : 201,
      "QUESTION" : 202,
      "SEARCH_QUIZ" : 203,
      "USER_ACCOUNT" : 204
    },
    "UPDATE" : {

    },
    "DELETE" : {

    },
    "QUESTION_TYPE" : {
      "MCQ" : 0,
      "SHORT_ANS" : 1
    },
    "OTHERS" : {
      "TEST" : 601
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

    "ALREADY_ANSWERED": 1500,


    "DB_NO_RESULT" : 2000,
    "DB_EMAIL_TAKEN" : 2001
  }
}
