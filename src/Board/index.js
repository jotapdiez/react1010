import React, { useState } from 'react'
// import PropTypes from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ROWS, COLS, DRAG_DROP_CONTENT_TYPE } from '../constants';
import { flatten, find, every, forEach } from 'lodash';
import { useDispatch } from 'react-redux';
import * as nextPieceActions from '../NextPieces/Actions';
import * as scoreActions from '../Score/Actions';

const STATUS_WRONG = 1;
const STATUS_OK = 2;
const DEFAULT_PIECE = { id:null, placed: false, status: 0, color:null };
const DEFAULT_BOARD = Array(ROWS).fill(Array(COLS).fill(DEFAULT_PIECE));

export default function Board(props){
    // static propTypes = {
    //     prop: PropTypes
    // }
	const dispatch = useDispatch();
	const [piecesAdded, setPiecesAdded] = useState(DEFAULT_BOARD);

	const onDragOverItem = (e)  => {
		e.preventDefault();
	}

	const onDragEnter = (e)  => {
		if (!idValidDropTarget(e)) {
			return;
		}

		var data = JSON.parse(e.dataTransfer.getData(DRAG_DROP_CONTENT_TYPE));
		let tgtPoint = {
			r: parseInt(e.target.attributes["rowindex-data"].value),
			c: parseInt(e.target.attributes["colindex-data"].value)
		};

		checkPieceColision(data.matrix, tgtPoint.r, tgtPoint.c);
	}

	const idValidDropTarget = (e) => {
		if (!e.dataTransfer.getData(DRAG_DROP_CONTENT_TYPE) ||
			!e.target.attributes["rowindex-data"] || !e.target.attributes["colindex-data"].value){
				return false;
			}
		return true;
	}

	const onDragLeave = (e)  => {
		if (!idValidDropTarget(e)){
			return;
		}

		var data = JSON.parse(e.dataTransfer.getData(DRAG_DROP_CONTENT_TYPE));
		const row = parseInt(e.target.attributes["rowindex-data"].value);
		const col = parseInt(e.target.attributes["colindex-data"].value);

		const pieceMatrix = data.matrix;
		var matrix = JSON.parse(JSON.stringify(piecesAdded));
		for (var r in pieceMatrix) {
			var mr = parseInt(r) + parseInt(row);
			if (!matrix[mr]) {
				continue;
			}

			for (var c in pieceMatrix[r]) {
				var mc = parseInt(c) + parseInt(col);
				if (!matrix[mr][mc]){
					continue;
				}

				if (pieceMatrix[r][c] === 0) {
					continue;
				}

				matrix[mr][mc].status = 0;
			}
		}
		setPiecesAdded(matrix);
	}

	const checkPieceColision = (pieceMatrix, row, col) => {
		const matrix = JSON.parse(JSON.stringify(piecesAdded));
		let someError = false;
		for (let r in pieceMatrix){
			for (let c in pieceMatrix[r]){
				if (pieceMatrix[r][c] === 0){
					continue;
				}

				const mr = parseInt(r) + parseInt(row);
				const mc = parseInt(c) + parseInt(col);
				if (!matrix[mr] || !matrix[mr][mc] ||
					matrix[mr][mc].placed){
					someError = true;
					break;
				}
			}
		}

		for (let r in pieceMatrix) {
			for (let c in pieceMatrix[r]) {
				if (pieceMatrix[r][c] === 0) {
					continue;
				}

				const mr = parseInt(r) + parseInt(row);
				const mc = parseInt(c) + parseInt(col);
				if (!matrix[mr] || !matrix[mr][mc]) {
					continue;
				}

				matrix[mr][mc].status = (someError ? STATUS_WRONG : STATUS_OK);
			}
		}
		setPiecesAdded(matrix);
	}

	const onDrop = (e)  => {
		dispatch(scoreActions.drop());
		onDragLeave(e);
		if (!idValidDropTarget(e)) {
			return;
		}

		const someError = find(flatten(piecesAdded), (e) => e.status === STATUS_WRONG);
		if (someError){
			return;
		}

		var data = JSON.parse(e.dataTransfer.getData(DRAG_DROP_CONTENT_TYPE));
		let tgtPoint = {
			r: parseInt(e.target.attributes["rowindex-data"].value),
			c: parseInt(e.target.attributes["colindex-data"].value)
		};;
		if (checkPieceColision(data.matrix, tgtPoint.r, tgtPoint.c)){
			console.log('Board:: onDrop:: checkPieceColision=true');
			return;
		}

		addPiece(data, tgtPoint.r, tgtPoint.c);
	};

	const onDragEnd = (e)  => {
	};

	function addPiece(data, tr, tc) {
		let pieceScore = 0;
		let padded = JSON.parse(JSON.stringify(piecesAdded));
		for (let r in data.matrix){
			for (let c in data.matrix[r]){
				if (data.matrix[r][c] === 1){
					const absRowIndex = parseInt(tr) + parseInt(r);
					const absColIndex = parseInt(tc) + parseInt(c);

					++pieceScore;
					padded[absRowIndex][absColIndex].id = data.id+""+r+""+c;
					padded[absRowIndex][absColIndex].placed = true;
					padded[absRowIndex][absColIndex].status = 0;
					padded[absRowIndex][absColIndex].color = data.color;
				}
			}
		}

		dispatch(nextPieceActions.use(data.id));
		dispatch(scoreActions.add(pieceScore));
		checkLines(padded);
		setPiecesAdded(padded);
	};

	function checkLines(padded){
		let changes = 0;
		//Horizontales
		for (let r in padded) {
			if (!find(padded[r], e=>e.placed)){
				continue;
			}
			const allPiecesPlaced = every(padded[r], ['placed', true]);
			if (allPiecesPlaced){
				++changes;
				//eliminar linea r
				forEach(padded[r],e=>{
					e.placed = false;
					e.color = null;
				});
			}
		}

		//Verticales
		for (let c = 0; c < COLS ; ++c){
			let someNotPlaced = false;
			for (let r in padded) {
				if (!padded[r][c].placed){
					someNotPlaced = true;
				}
			}

			if (!someNotPlaced){
				++changes;
				//Eliminar columna c
				for (let r in padded) {
					padded[r][c].placed = false;
					padded[r][c].color = null;
				}
			}
		}

		if (changes > 0){
			//TODO: Multiplicar por lineas
			dispatch(scoreActions.add(10*changes));
		}
	}
	// function hardcode(){
	// 	let padded = JSON.parse(JSON.stringify(piecesAdded));
	// 	for (let c = 1; c < COLS; ++c) {
	// 		padded[0][c].placed = true;
	// 		padded[1][c].placed = true;
	// 	}
	// 	setPiecesAdded(padded);
	// }

	function renderColumns(col, colIndex, rowIndex){
		let blockValue = "empty";
		if (col.status !== 0) {
			blockValue = col.status === STATUS_WRONG ? 'dragEnterWrong' : 'dragEnterOk';
		} else if (col.placed) {
			blockValue = 'piece';
		}

		return (<CSSTransition
			in={col.placed}
			key={rowIndex + "" + colIndex}
			timeout={100}
			classNames="column">
			<div key={colIndex} colindex-data={colIndex} rowindex-data={rowIndex} className={(col.color ? col.color + ' ':'')  + "column " + blockValue} />
		</CSSTransition>);
	}

	return (<>
		{/*<span onClick={hardcode}>harcode</span> */}
		<TransitionGroup className="board"
				onDrop={onDrop} onDragEnd={onDragEnd} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOverItem}>
			{piecesAdded.map((row, rowIndex) => {
				const cols = row.map((col, colIndex) => renderColumns(col, colIndex, rowIndex));
				return (<div key={'r' + rowIndex} className="board_row">{cols}</div>);
			})}
		</TransitionGroup>
	</>);
}
