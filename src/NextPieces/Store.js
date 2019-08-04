import { MATRIX_PIECES } from '../constants';
import { remove } from 'lodash';

const initial = [];

let lastId = 5;

export default function reduce(state = initial, action){
	switch (action.type) {
		case 'add':
			return addRandomPiece(state, action.payload);
		case 'use':
			return use(state, action.payload);
		default:
			return state;
	}
}

function addRandomPiece(state, count){
	let result = JSON.parse(JSON.stringify(state));

	for (let i = 0; i < count; ++i) {
		var randomIndex = Math.floor(Math.random() * MATRIX_PIECES.length);
		// console.log('randomIndex = ', randomIndex);
		result.push({ id: ++lastId, index: randomIndex });
	}
	return result;
}

function use(state, id){
	let result = JSON.parse(JSON.stringify(state));
	remove(result, e => e.id === id );

	return result;
}
