var xss = require('xss');

function entityEncoding(inputData){
  return xss(inputData);
}
