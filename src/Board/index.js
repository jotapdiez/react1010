import React, { useEffect, useState } from 'react'
import { ROWS, COLS, DRAG_DROP_CONTENT_TYPE } from '../constants';
import { find, every, forEach } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import * as nextPieceActions from '../NextPieces/Actions';
import * as scoreActions from '../Score/Actions';
import './board.css';

const DEFAULT_PIECE = { id:null, placed: false, status: 0, color:null };
const DEFAULT_BOARD = Array(ROWS).fill(Array(COLS).fill(DEFAULT_PIECE));

export default function Board(props){
	const dispatch = useDispatch();
	const [piecesAdded, setPiecesAdded] = useState(DEFAULT_BOARD);
	const [pieceDragged, setPiecesDragged] = useState(null);
	const [dragPoint, setDragPoint] = useState(null);
	const [piecePositions, setPiecePositions] = useState([]);
	const allNextPieces = useSelector(store => store.nextPiece);

	useEffect(e => {
		if (dragPoint !== null && pieceDragged !== null)
			checkPieceColision(pieceDragged, dragPoint.r, dragPoint.c);
	}, [pieceDragged, dragPoint]);

	useEffect(e => {
		if (allNextPieces.length > 0) checkNoAvailableDrop();
	}, [allNextPieces]);

	const getEventData = (e) => {
		// console.log('getEventData::tgt = ', e.target)
		// console.log('getEventData::attrs = ', e.target.attributes)
		let data = e.dataTransfer.types[0].replace(DRAG_DROP_CONTENT_TYPE + "/", "");
		let row = e.target.attributes["rowindex-data"] ? parseInt(e.target.attributes["rowindex-data"].value) : null;
		let col = e.target.attributes["colindex-data"] ? parseInt(e.target.attributes["colindex-data"].value) : null;
		return {
			data: JSON.parse(data),
			tgtPoint: {
				r: row,
				c: col
			}
		}
	}

	const onDragOverItem = (e)  => {
		e.preventDefault();
		return false;
	}

	const onDragEnter = (e) => {
		e.preventDefault();
		// if (!idValidDropTarget(e)) {
		// 	return;
		// }

		const { data, tgtPoint } = getEventData(e);
		setPiecesDragged(data.matrix);
		setDragPoint({
			r: tgtPoint.r,
			c: tgtPoint.c
		});
	}

	const idValidDropTarget = (e) => {
		const { data, tgtPoint } = getEventData(e);
		// const data = e.dataTransfer.types[0].replace(DRAG_DROP_CONTENT_TYPE + "/", "");
		if (!data || !tgtPoint || tgtPoint.r === null || tgtPoint.c === null) {
			return false;
		}
		return true;
	}

	const checkPieceColision = (pieceMatrix, row, col) => {
		const matrix = JSON.parse(JSON.stringify(piecesAdded));

		// let hasError = false;
		let _pieceMatrixPositions = [];
		// console.log(pieceMatrix);
		let anyError = false;
		pieceMatrix.forEach((r, ri) => r.forEach((c, ci) => {
			if (c === 0) return;
			let hasError = false;
			const mr = parseInt(ri) + parseInt(row);
			const mc = parseInt(ci) + parseInt(col);
			if (mr >= matrix.length || mc >= matrix[mr].length || matrix[mr][mc].placed) {
				hasError = true;
				anyError = true;
			}

			_pieceMatrixPositions.push({
				r: mr,
				c: mc,
				isPlaced: false,
				hasError
			});
		}));

		if (anyError) {
			_pieceMatrixPositions.forEach(e => e.hasError = true);
		}
		setPiecePositions(_pieceMatrixPositions);
	}

	const onDragLeave = (e) => {
		// if (!idValidDropTarget(e)){
		// 	return;
		// }
		setDragPoint(null);
		setPiecePositions([]);
	}

	const onDrop = (e) => {
		dispatch(scoreActions.drop());
		onDragLeave(e);
		// if (!idValidDropTarget(e)) {
		// 	setPiecePositions([]);
		// 	return;
		// }

		const someError = piecePositions.find(e => e.hasError);
		if (someError) {
			return;
		}

		const { data, tgtPoint } = getEventData(e);
		addPiece(data, tgtPoint.r, tgtPoint.c);
	};

	const onDragEnd = (e) => {
		console.log("onDragEnd")
	};

	function addPiece(data, tr, tc) {
		let pieceScore = 0;
		let _board = JSON.parse(JSON.stringify(piecesAdded));
		for (let r in data.matrix){
			for (let c in data.matrix[r]){
				if (data.matrix[r][c] === 1){
					const absRowIndex = parseInt(tr) + parseInt(r);
					const absColIndex = parseInt(tc) + parseInt(c);

					++pieceScore;
					_board[absRowIndex][absColIndex].id = data.id+""+r+""+c;
					_board[absRowIndex][absColIndex].placed = true;
					_board[absRowIndex][absColIndex].status = 0;
					_board[absRowIndex][absColIndex].color = data.color;
				}
			}
		}

		dispatch(nextPieceActions.use(data.id));
		dispatch(scoreActions.add(pieceScore));
		checkLines(_board);
		setPiecesAdded(_board);
	};

	function checkLines(_board){
		let changes = 0;
		//Horizontales
		for (let r in _board) {
			if (!find(_board[r], e=>e.placed)){
				continue;
			}
			const allPiecesPlaced = every(_board[r], ['placed', true]);
			if (allPiecesPlaced){
				++changes;
				//eliminar linea r
				forEach(_board[r],e=>{
					e.placed = false;
					e.color = null;
					e.removing = true;
				});
			// } else {
			// 	forEach(_board[r], e => {
			// 		e.removing = false;
			// 	});
			}
		}

		//Verticales
		for (let c = 0; c < COLS ; ++c){
			let someNotPlaced = false;
			for (let r in _board) {
				if (!_board[r][c].placed){
					someNotPlaced = true;
				}
			}

			if (!someNotPlaced){
				++changes;
				//Eliminar columna c
				for (let r in _board) {
					_board[r][c].placed = false;
					_board[r][c].color = null;
					_board[r][c].removing = true;
				}
			// } else {
			// 	for (let r in _board) {
			// 		_board[r][c].removing = false;
			// 	}
			}
		}

		if (changes > 0){
			dispatch(scoreActions.add(10*changes));
		}
	}

	const checkNoAvailableDrop = () => {
		// verificar cada una de allNextPieces si hay disponible en el board
		console.log("checkNoAvailableDrop:", allNextPieces)
	}

	function renderColumns(col, colIndex, rowIndex) {
		let blockValue = (col.removing ? 'remove' : 'empty');
		let res = piecePositions.find(e => e.r === rowIndex && e.c === colIndex);
		if (res) {
			blockValue = res.hasError ? 'dragEnterWrong' : 'dragEnterOk';
		} else if (col.placed) {
			blockValue = ' piece';
		}

		return (
			<div key={colIndex}
				onDrop={onDrop}
				onDragEnd={onDragEnd}
				onDragEnter={onDragEnter}
				onDragLeave={onDragLeave}
				onDragOver={onDragOverItem}
				colindex-data={colIndex}
				rowindex-data={rowIndex}
				className={"column " + blockValue} />
		);
	}

	function renderBoard() {
		return piecesAdded.map((row, rowIndex) => {
			const cols = row.map((col, colIndex) => renderColumns(col, colIndex, rowIndex));
			return (<div key={'r' + rowIndex} className="board_row">{cols}</div>);
		});
	}

	return (<>
		{/*<span onClick={hardcode}>harcode</span> */}
		<div className="board">
			{renderBoard()}
		</div>
	</>);
}
