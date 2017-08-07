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


function jsonEncodeObjArr(inputData){
  for(var key in inputData){
    var data = inputData[key];
    if(data instanceof Array){
      for(i = 0;i<data.length;i++){
        data[i] = entityEncoding(data[i]);
      }
    }else{
      if(inputData.hasOwnProperty(key)){
        inputData[key] = entityEncoding(inputData[key]);
      }
    }

  }
  console.log("[XSS-DEFENSE Filtere]")
  return inputData;
}

function urlEncode(inputData){

}


//main
// var data = {
//   user_id:"15",
//   name: "nigel",
//   weekdays: ['<script>sun', 'mon', 'tue']
// };

var data =[
  {
    name:"nigel",
    weekday:['<script>sun', 'mon</script>']
  },
  {
    name:"bryan",
    weekday:['script mon', 'scripttue']
  }
];


console.log(jsonEncodeObjArr(data)[0]);

module.exports = {
  'entityEncoding' : entityEncoding,
  'jsonEncode' : jsonEncode
};
