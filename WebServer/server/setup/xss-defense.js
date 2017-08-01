var xss = require('xss');
var option = {

}

function entityEncoding(inputData){
  return xss(inputData);
}

function jsonEncode(inputData){
  for (var key in inputData) {
    if (inputData.hasOwnProperty(key)) {
      inputData[key] = entityEncoding(inputData[key]);
    }
  }
  console.log("[XXS-DEFENSE Filtered]");
  return inputData;
}

function urlEncode(inputData){

}

module.exports = {
  'entityEncoding' : entityEncoding,
  'jsonEncode' : jsonEncode
};
