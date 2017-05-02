/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var socket = io();

function appendMessage(message){
    var newMessage = document.createElement('li');
    newMessage.appendChild(document.createTextNode(message));
    document.getElementById('messages').appendChild(newMessage);
}

document.getElementById('form').onsubmit = function(){
    var inputBox = document.getElementById('chatBox');
    socket.emit('message_send', inputBox.value);
    console.log(inputBox.value);
    inputBox.value = '';
    return false;
};
socket.on('message_receive', function(message){
    appendMessage(message);
});
socket.on('message_init', function(messageList){
   for(i = 0; i < messageList.length; i++){
       appendMessage(messageList[i]);
   } 
});


