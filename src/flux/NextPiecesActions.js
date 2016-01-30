'use strict';

var AppDispatcher = require('./AppDispatcher');
var NextPiecesConstants = require('./NextPiecesConstants');

var NextPiecesActions = {
    /**
     * Action fired when the NextPiecesApp component has successfully mounted.
     * Dispatches an action to the stores so that the NextPiecesStore can init the connection.
     */
    initSocket: function(){
        AppDispatcher.dispatch({
            actionType: NextPiecesConstants.INIT_SOCKET
        });
    },

    /**
    * @param  {number} id
    */
    use: function(id) {
        AppDispatcher.dispatch({
            actionType: NextPiecesConstants.USE,
            id: id
        });
    },

    /**
    * @param
    */
    add: function() {
		console.log('NextPiecesActions::add');
        AppDispatcher.dispatch({
            actionType: NextPiecesConstants.ADD
        });
    },

    /**
     * Action fired when the connection to the server is successful
     * @param {string} text The URL of the server we are connected to
     */
    serverConnected: function(text){
		console.log('NextPiecesActions::serverConnected');
        AppDispatcher.dispatch({
            actionType: NextPiecesConstants.SOCKET_CONNECTED,
            text: text
        });
    },

    /**
     * Action fired when an error occurs on the server during data processing
     * @param {string} err String describing the error encountred
     */
    serverError: function(err){
        AppDispatcher.dispatch({
            actionType: NextPiecesConstants.SERVER_ERROR,
            text: err
        });
    }
};

module.exports = NextPiecesActions;
