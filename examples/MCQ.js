const C = require('./custom-API/constants.js');

console.log(C.MCQ.B & (C.MCQ.A | C.MCQ.B)); //left -> chosen, right -> check (checks for A OR B)
