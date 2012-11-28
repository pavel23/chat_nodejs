//var socket = io.connect('http://localhost');
var socket = io.connect('http://pavel23.chat_node.jit.su');

socket.on('connect', function(){
  socket.emit('adduser', prompt("Ingrese su Nombre?"));
});

socket.on('errorchat',function(username,message){
  console.log(username + ' ' + message );
});

socket.on('updatechat', function (username, data) {
  $('#conversation').append(' <strong>'+username + ':</strong> ' + data + '<br> ');
});

socket.on('updateusers', function(data) {
  $('#users').empty();
  $.each(data, function(key, value) {
    $('#users').append('<div>' + value + '</div>');
  });
});

$(function(){
  $('#data_send').click( function() {
    var message = $('#data').val();
    $('#data').val('');
    socket.emit('sendchat', message);
  });

  $('#data').keypress(function(e) {
    if(e.which == 13) {
      $(this).blur();
      $('#data_send').focus().click();
    }
  });
});