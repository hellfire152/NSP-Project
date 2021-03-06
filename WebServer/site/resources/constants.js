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
  "AUTH" : {
    "REQUEST_CONNECTION" : 0,
    "CHALLENGE_STRING" : 1,
    "RECEIVED_PUBLIC_KEY" : 2,
    "ENCRYPTED_CHALLENGE" : 3,
    "KEY_NEGOTIATION" : 4,
    "AUTHENTICATED" : 5
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
    "RESPONSE_DATA" : 19,
    "GET_READY" : 20
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
    "ACCOUNT_CREATE_STUD": 2,
    "ACCOUNT_CREATE_TEACH":4,
    "ACCOUNT_LOGIN": 3,
    "DATABASE" : 100

  },
  "RES_TYPE" : {
    "JOIN_ROOM_RES": 0,
    "HOST_ROOM_RES": 1,
    "CREATE_QUIZ_RES": 10,
    "ADD_QUESTION_RES": 11,
    "ADD_QUIZ_RES" : 12,

    "ACCOUNT_CREATED_STUD": 2,
    "ACCOUNT_CREATED_TEACH":4,
    "ACCOUNT_LOGGED_IN":3
  },
  "DB" : {
    "CREATE" : {
      "STUDENT_ACC" : 101,
      "TEACHER_ACC" : 102,
      "QUIZ" : 103,
      "IP_ADDRESS" : 104
    },
    "SELECT" : {
      "ALL_QUIZ" : 201,
      "QUESTION" : 202,
      "SEARCH_QUIZ" : 203,
      "USER_ACCOUNT" : 204,
      "RETRIEVE_USER_DETAILS" : 205,
      "FULL_USER_ACCOUNT" : 206,
      "EMAIL" : 207
    },
    "UPDATE" : {
      "PASSWORD" : 301,
      "QUIZ" : 302,
      "QUESTION" : 303,
      "ABOUT_ME" : 304,
      "USERNAME" : 305,
      "NAME" : 306,
      "SCHOOL" : 307,
      "ORGANISATION" : 308,
      "STUDENT_CATEGORY" : 309
    },
    "DELETE" : {
      "ACCOUNT" : 401,
      "QUIZ" : 402,
      "QUESTION" : 403
    },
    "QUESTION_TYPE" : {
      "MCQ" : 0,
      "SHORT_ANS" : 1
    },
    "RESPONSE" : {
      "SUCCESSFUL" : 601
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
    "GAME_HAS_NOT_STARTED" : 1501,
    "NOT_THE_HOST" : 1502,

    "DB_NO_SUCH_FUNCTION" : 2000,
    "DB_SQL_QUERY" : 2001,
    "DB_USERNAME_TAKEN" : 2002,
    "DB_NO_SUCH_USER" : 2003,
    "DB_DUPLICATE_USER_ID" : 2004,
    "DB_PASSWORD_INCORRECT" : 2005,
    "DB_INCORRECT_INPUT" : 2006,
    "DB_TWO_OR_MORE_ACCOUNT_DELETED" : 2007,
    "DB_NO_QUIZ_AVAILAVLE" : 2008,
    "DB_QUESTION_ID_NOT_FOUND" : 2009,
    "DB_UNKNOWN" : 2010
  }
}
