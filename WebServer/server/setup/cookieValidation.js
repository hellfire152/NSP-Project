var crypto = require('crypto');

function generateCheckCookie(jsonObj, ipAddress){
  return {
    'data' : jsonObj,
    'check' : {
      'hash' : crypto.createHash('SHA256').update(JSON.stringify(jsonObj)).digest('base64'), //NOTE: Temp solution,
      'ipAddress' : crypto.createHash('SHA256').update(ipAddress).digest('base64')
    }
  }
}

function generateCheckCookieNoIP(jsonObj){
  return {
    'data' : jsonObj,
    'check' : {
      'hash' : crypto.createHash('SHA256').update(JSON.stringify(jsonObj)).digest('base64') //NOTE: Temp solution
      // 'hash' : crypto.createHash('SHA256').update(JSON.stringify(jsonObj)).digest('base64') + '123'; //ALWAYS GIVE FALSE INTEGRITY
    }
  }
}

function validateCookie(jsonObj, currentIp){
  if(currentIp != undefined)
    var ipCheck = ipAddressCheck(currentIp, jsonObj.check.ipAddress);
  else
    var ipCheck = true;

  if(integrityCheck(jsonObj.data, jsonObj.check.hash) && ipCheck){
    console.log("COOKIE VALIDATION SUCCESS");
    return true;
  }
  else{
    console.log("COOKIE VALIDATION FAILED");
    return false;
  }
}

//Check if content matches the hash value for integrity check
function integrityCheck(dataObj, checkHash){
  var hashedDataObj = crypto.createHash('SHA256').update(JSON.stringify(dataObj)).digest('base64');
  if(hashedDataObj === checkHash)
    return true;
  else {
    return false;
  }
}

function ipAddressCheck(currentIp, checkIp){
  var hashedCurrentIp = crypto.createHash('SHA256').update(currentIp).digest('base64');
  if(hashedCurrentIp === checkIp)
    return true;
  else {
    return false;
  }
}

module.exports = {
  'validateCookie' : validateCookie,
  'generateCheckCookie' : generateCheckCookie,
  'generateCheckCookieNoIP' : generateCheckCookieNoIP
};
