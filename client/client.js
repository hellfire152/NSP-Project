/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(function(){var socket = io();
    $('form').submit(function(){
        socket.emit('message_send', $('#chatBox').val());
        $('#chatBox').val('');
    });
    socket.on('message_receive', function(message){
        $('#messages').append($('<li>').text(message));
    });
});


