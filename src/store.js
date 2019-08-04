import { combineReducers } from 'redux';

import NextPieceStore from './NextPieces/Store';
import ScoreStore from './Score/Store';

export default combineReducers({
    nextPiece: NextPieceStore,
    score: ScoreStore
});