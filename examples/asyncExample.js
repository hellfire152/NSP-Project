const cipher = require('../custom-API/cipher.js')();
const Promise = require('promise');

(async () => { //calling inside async function
  console.log(await cipher.encrypt("abc"));
})();

cipher.encrypt("5890458")
  .then(cipher => {
    console.log("CIPHER: " + cipher);
  })
  .catch(reason => {
    console.log(reason);
  });
console.log("ABC");

Promise.all([cipher.encrypt("123"), cipher.encrypt("234")]) //start multiple functions simultaneously, wait for all to finish
  .then(ciphers => {
    ciphers.forEach(cipher => {
      console.log(cipher);
    });
  })
  .catch(reason => {
    console.log(reason);
  });

Promise.race([cipher.encrypt("a"), cipher.encrypt("123")])
  .then(cipher => {
    console.log("RACE: " +cipher);
  });
