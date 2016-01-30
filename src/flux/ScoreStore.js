'use strict';

/* jshint browser: true */
var AppDispatcher = require('./AppDispatcher');
var EventEmitter = require('events');
var ScoreConstants = require('./ScoreConstants');
var ScoreActions = require('./ScoreActions');

//connect to server only if the code is executed client-side.
if(typeof window !== 'undefined'){
    var socket = require('socket.io-client')(window.HOST || 'localhost:3000', {transports: ['websocket']});
}

var CHANGE_EVENT = 'change';
var ADD_EVENT = 'add';

var _drops = 0;
var _score = 0;

function initStore(){
	
}

function add(points){
	_score += points;
}

function addDrop(points){
	++_drops; 
}

function initSocket(){
    socket.on('servererror', function(err){
        ScoreActions.serverError(err);
    });
    socket.on('connected', function(){
        ScoreActions.serverConnected(window.HOST || 'localhost:3000');
    });
}

var ScoreStore = new EventEmitter();
ScoreStore.getScore = function(){
	return _score;
};

ScoreStore.getDrops = function(){
	return _drops;
};

ScoreStore.emitChange = function(){
	this.emit(CHANGE_EVENT);
};

ScoreStore.addChangeListener = function(callback){
	this.on(CHANGE_EVENT, callback);
};

ScoreStore.removeChangeListener = function(callback){
	this.removeListener(CHANGE_EVENT, callback);
};

ScoreStore.dispatchToken = AppDispatcher.register(function(action) {
    var text;
    switch(action.actionType) {
        case ScoreConstants.INIT_SOCKET:
            initSocket();
            break;

        case ScoreConstants.SOCKET_CONNECTED:
			initStore();
            ScoreStore.emitChange();
            break;

        case ScoreConstants.ADD_SCORE:
			add(action.points);
			ScoreStore.emitChange();
            break;

        case ScoreConstants.ADD_DROP:
			addDrop();
			ScoreStore.emitChange();
            break;

		default:
        // no op
    }
});

module.exports = ScoreStore;
