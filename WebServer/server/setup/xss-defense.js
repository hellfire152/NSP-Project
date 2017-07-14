var xss = require('xss');
var option = {

}

function entityEncoding(inputData){
  return xss(inputData);
}

function jsonEncode(inputData){

  console.log(inputData);
  for (var key in inputData) {
    if (inputData.hasOwnProperty(key)) {
      inputData[key] = entityEncoding(inputData[key]);
    }
  }
  console.log("XXS-DEFENSE");
  console.log(inputData);
  return inputData;
}

module.exports = {
  'entityEncoding' : entityEncoding,
  'jsonEncode' : jsonEncode
};
