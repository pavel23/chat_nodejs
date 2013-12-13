var socket = io.connect('http://localhost');

socket.on('connect', function(){
  var $container_chat  = $('#container_chat'), $container_login = $('#container_login');

  $('#btn_login').on('click', function(){
    var $form_user = $(this).parent('form'), user = $form_user.find('input').val();
    if(user){
      socket.emit('adduser', user);
      $(document).data('user', user);
      $container_chat.show();
      $container_login.hide();
    }
  });

});

socket.on('errorchat',function(username,message){
  console.log(username + ' ' + message );
});

socket.on('updatechat', function (username, data) {
  var  data_conversation = {};

  data_conversation.user = username;
  data_conversation.conversation = data;
  data_conversation.position = $(document).data('user') == username  ? 'right' : 'left';

  $('#conversations').tmpl(data_conversation).appendTo('#wrapper_conversations');
});

/*socket.on('updateusers', function(data) {
  $('#users').empty();
  console.log(data);
  $.each(data, function(key, value) {
    $('#users').append('<div>' + value + '</div>');
  });
});*/

$(function(){

  var $btn_send_chat = $('#btn_send_chat'),$input_message = $('#input_message');

  $btn_send_chat.on('click', function(){
    var message = $input_message.val();
     socket.emit('sendchat', message);
     $input_message.val('');
  });

  $input_message.on('keypress', function(e) {
    if(e.which == 13) {
      $(this).blur();
      $btn_send_chat.trigger('click');
    }
  });
});
