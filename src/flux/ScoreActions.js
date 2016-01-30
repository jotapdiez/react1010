'use strict';

var AppDispatcher = require('./AppDispatcher');
var ScoreConstants = require('./ScoreConstants');

var ScoreActions = {
    /**
     * Action fired when the ScoreApp component has successfully mounted.
     * Dispatches an action to the stores so that the ScoreStore can init the connection.
     */
    initSocket: function(){
        AppDispatcher.dispatch({
            actionType: ScoreConstants.INIT_SOCKET
        });
    },

	/**
    * @param
    */
    add: function(points) {
        AppDispatcher.dispatch({
            actionType: ScoreConstants.ADD_SCORE,
			points: points
        });
    },

	/**
    * @param
    */
    addDrop: function(points) {
        AppDispatcher.dispatch({
            actionType: ScoreConstants.ADD_DROP
        });
    },

    /**
     * Action fired when the connection to the server is successful
     * @param {string} text The URL of the server we are connected to
     */
    serverConnected: function(text){
        AppDispatcher.dispatch({
            actionType: ScoreConstants.SOCKET_CONNECTED,
            text: text
        });
    },

    /**
     * Action fired when an error occurs on the server during data processing
     * @param {string} err String describing the error encountred
     */
    serverError: function(err){
        AppDispatcher.dispatch({
            actionType: ScoreConstants.SERVER_ERROR,
            text: err
        });
    }
};

module.exports = ScoreActions;
