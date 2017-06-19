var cipher = require("./cipher.js")();

cipher.handleEncryption("123456789012345612345678901234561234567890123456")
.then(x => {
  console.log("[Encryption Output]: " +  x);
})


cipher.handleDecryption("b48f79620684761c3da24b4e48cf6261e810af2c20eaae41e24184644f61390991ca453b6aa43afe2b0283c1e816674a310687b38260c8a99873133892b2e58963115ab32d6b8b0a1bca8fc04d47e8f967566af9306ce9ed2b874f83f7f4b795")
.then(x => {
  console.log("[Decryption Output]: " +  x);
})

// console.log("5de53b4d3cb289ade5f6bb31405341c4fba9695661e488d447afcf28ee6109b5675d302fa552cc12dc63fdf09302234a453e26257b583f8b7e50832038f2daf8d3748bca87f3bcc2287bfa4a8e173c8eb5f6f0c8e261a4dc1caf51a777458048efd83ca9702186d23cbb93c17979a786e598fbd7c7c36cf5723b6e22a6b9b24b12f0c999a2bb355d28f291c465ba0aac".match(/.{1,64}/g));





























// var x = "~~~~~~~~~~~~~~~~";
// console.log(x.length);
//
//
// var plainTextBlockSize = 16;
// var iv = [ 121, 123, 117, 32, 108, 105, 107, 101, 32, 114, 101, 97, 108, 108, 121, 44 ];
// function encode(plainText){
//   var encodedValue = [];
//
//   var i = 0;
//   loop1:
//     while(i < plainText.length){
//       var result = [];
//         for(j=i ; j<i+plainTextBlockSize ; j++){
//           var asciiChar = plainText.charCodeAt(j);
//           if(isNaN(asciiChar)){
//             encodedValue.push(result);
//             break loop1;
//           }
//           result.push(asciiChar);
//
//         }
//       encodedValue.push(result);
//       i += plainTextBlockSize;
//     }
//
//   // console.log(resultSet);
//   // decode(resultSet);
//   return encodedValue;
// }
//
// function decode(encodedText){
//   var decodedText = "";
//   for(i=0 ; i<encodedText.length ; i++){
//     decodedText += String.fromCharCode(encodedText[i]);
//   }
//   console.log(decodedText);
//   return decodedText;
// }
//
// function decodeAll(encodedText){
//   var decodedText = "";
//   for(i=0 ; i<encodedText.length ; i++){
//     for(j=0 ; j<encodedText[i].length ; j++){
//       decodedText += String.fromCharCode(encodedText[i][j]);
//     }
//   }
//   return decodedText;
// }
//
// //XOR IV with input text to increase the randomness of the text
// function cipherBlockChaining(value, iv){
//   xorValue = [];
//   for(i=0 ; i<value.length ; i++){
//     xorValue.push(value[i]^iv[i])
//   }
//   console.log(xorValue);
//   return xorValue;
// }


// var x = encode("5dZoC41JFwmLQMYo");

// console.log(x);
// var y = cipherBlockChaining(x[0], iv);
// var z = decode(y);
// var g = encode(z);
// var h = cipherBlockChaining(g[0], iv);
// var k = decode(h);
//
