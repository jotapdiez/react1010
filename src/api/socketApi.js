'use strict';

var socketio = require('socket.io');

module.exports = function(server, gameStorageService){
	// console.log('initApi::server param', server);
    var io = socketio(server);

    io.on('connection', function(socket){

        console.log('Client ', socket.client.id, ' connected');
        socket.emit('connected');

		socket.on('event', function(data){ console.log('event', data); });
		socket.on('disconnect', function(){ console.log('disconnect'); });
    });
	
	io.listen(3000, {transports: ['websocket']});
};

// export default initApi;
