'use strict';

/* jshint browser: true */
var AppDispatcher = require('./AppDispatcher');
var EventEmitter = require('events');
var NextPiecesConstants = require('./NextPiecesConstants');
var NextPiecesActions = require('./NextPiecesActions');
var MATRIX_PIECES = require('../views/const_pieces_matrix').MATRIX_PIECES;

//connect to server only if the code is executed client-side.
if(typeof window !== undefined){
    var socket = require('socket.io-client')(window.HOST || 'localhost:3000', {transports: ['websocket']});
}

var CHANGE_EVENT = 'change';
var ADD_EVENT = 'add';

var lastId = 3;
var _pieces = [];

function initStore(){
	_pieces = [
		{id: 0, index: 2}, 
		{id: 1, index: 7}, 
		{id: 2, index: 5}, 
		{id: 3, index: 6}
	];
}
function receiveNextPieces(pieces){
    _pieces = pieces;
}

function addRandomPiece(){
	console.log('NextPiecesStore::addRandomPiece');
	var randomIndex = Math.round(Math.random() * MATRIX_PIECES.length);
	_pieces.push({id: ++lastId, index: randomIndex});
}

function use(id){
	var index = null;
	for (var i in _pieces){
		if (_pieces[i].id === id){
			index = i;
			break;
		}
	}
	
	if (index){
		_pieces.splice(index, 1);
	}
}

function initSocket(){
    socket.on('servererror', function(err){
        NextPiecesActions.serverError(err);
    });
    socket.on('connected', function(){
        NextPiecesActions.serverConnected(window.HOST || 'localhost:3000');
    });
}

var NextPiecesStore = new EventEmitter();
NextPiecesStore.getAll = function(){
	return _pieces;
};

NextPiecesStore.emitChange = function(){
	this.emit(CHANGE_EVENT);
};

NextPiecesStore.emitAdd = function(){
	this.emit(ADD_EVENT);
};

NextPiecesStore.addChangeListener = function(callback){
	this.on(CHANGE_EVENT, callback);
};

NextPiecesStore.addAddListener = function(callback){
	this.on(ADD_EVENT, callback);
};

NextPiecesStore.removeChangeListener = function(callback){
	this.removeListener(CHANGE_EVENT, callback);
};
NextPiecesStore.removeAddListener = function(callback){
	this.removeListener(ADD_EVENT, callback);
};
NextPiecesStore.dispatchToken = AppDispatcher.register(function(action) {
    var text;
    switch(action.actionType) {
        case NextPiecesConstants.INIT_SOCKET:
            initSocket();
            break;

        case NextPiecesConstants.SOCKET_CONNECTED:
			initStore();
            NextPiecesStore.emitChange();
            break;

        case NextPiecesConstants.USE:
			use(action.id);
			NextPiecesStore.emitChange();
            break;
			
        case NextPiecesConstants.ADD:
			// console.log('NextPiecesStore.ADD');
			addRandomPiece();
			NextPiecesStore.emitAdd();
            break;

		default:
        // no op
    }
});

module.exports = NextPiecesStore;
