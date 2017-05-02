/* 
 * Client side code for the NSP project.
 * Version: pre02052017
 */
//initializes a socket.io connection
var socket = io();

//adds a new <li> to the unordered list of messages
function appendMessage(message){
    var newMessage = document.createElement('li');
    newMessage.appendChild(document.createTextNode(message));
    document.getElementById('messages').appendChild(newMessage);
}

//sends the message to the server on button/enter key press
document.getElementById('form').onsubmit = function(){
    var inputBox = document.getElementById('chatBox');
    socket.emit('message_send', inputBox.value);
    console.log(inputBox.value);
    inputBox.value = '';
    return false;
};
//handles new messages from the server
socket.on('message_receive', function(message){
    appendMessage(message);
});
//not used, since I've only just figured out sessions. Will definitely have to change this
socket.on('message_init', function(messageList){
   for(i = 0; i < messageList.length; i++){
       appendMessage(messageList[i]);
   } 
});


