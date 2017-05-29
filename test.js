const cipher = require('./custom-API/cipher.js')();

const a = async () => {
  try {
    let b = cipher.encrypt('abc');
    return b;
  } catch (err) {
    throw new Error(400);
  }
}

a().then(console.log); //calling outside an async function

console.log(c);

(async () => { //calling inside async function
  console.log(await a());
})();
