var socket = io.connect('http://localhost'), $document = $(document), positions = {}, map = {},
        icon = {
    redIcon: 'assets/images/icon_map_1.png',
    yellowIcon: 'assets/images/icon_map_2.png'
};

socket.on('connect', function() {
    var $container_chat = $('#container_chat'), $container_login = $('#container_login');

    $('#btn_login').on('click', function() {
        var $form_user = $(this).parent('form'), user = $form_user.find('input').val();
        if (user) {
            socket.emit('adduser', user);
            $document.data('user', user);
            $container_chat.show();
            $container_login.hide();
            $('#map').show();

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    map = new GMaps({
                        el: '#map',
                        lat: 22.593726,
                        lng: -2.871101,
                        zoom: 2
                    });

                    map.addMarker({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        icon: icon.redIcon
                    });

                    $document.on('mousemove', function() {
                        positions = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        };

                        socket.emit('add:locations', positions);
                    });

                }, function(error) {
                    alert(error);
                }, {enableHighAccuracy: true});
            } else {
                alert("Geolocalización no es compatible con este navegador");
            }
        }
    });

});

socket.on('errorchat', function(username, message) {
    console.log(username + ' ' + message);
});

socket.on('updatechat', function(username, data) {
    var data_conversation = {};

    data_conversation.user = username;
    data_conversation.conversation = data;
    data_conversation.position = $document.data('user') == username ? 'right' : 'left';

    $('#conversations').tmpl(data_conversation).appendTo('#wrapper_conversations');
});


socket.on('user:locations', function(userId) {
    if (!$document.data('user_id')) {
        $document.data('user_id', userId);
    }

});

socket.on('update:locations', function(locations) {
    if ($document.data('user_id') in locations) {
        delete locations[$document.data('user_id')];
    }

    for (var location in locations) {
        map.addMarker({
            lat: locations[location].latitude,
            lng: locations[location].longitude,
            icon: icon.yellowIcon
        });

    }
});

$(function() {

    var $btn_send_chat = $('#btn_send_chat'), $input_message = $('#input_message');

    $btn_send_chat.on('click', function() {
        var message = $input_message.val();
        socket.emit('sendchat', message);
        $input_message.val('');
    });

    $input_message.on('keypress', function(e) {
        if (e.which == 13) {
            $(this).blur();
            $btn_send_chat.trigger('click');
        }
    });
});
