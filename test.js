[
  {
    "prompt": "1+1=?",
    "type": 1,
    "choices": ["Window", "11", "2", "Some lame ass joke"],
    "solution": "Go away",
    "time": 20
  },
  {
    "prompt": "What is zero in Roman Numerals?",
    "type": 1,
    "solution": " ",
    "time": 20
  }
]

var x = {
  DB : {
    CREATE : {
      INFO : "YAY"
    },
    DELETE : {
      INFO : "NO"
    }
  }
}
var value = x.DB.CREATE.INFO;

console.log(value == x);
