 var socket = io.connect('http://localhost');

    socket.on('connect', function(){
        socket.emit('adduser', prompt("Ingrese su Nombre?"));
    });

    socket.on('updatechat', function (username, data) {
        $('#conversation').append(' <strong>'+username + ':</strong> ' + data + '<br> ');
    });

    socket.on('updateusers', function(data) {
        $('#users').empty();
        $.each(data, function(key, value) {
            $('#users').append('<div>' + key + '</div>');
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