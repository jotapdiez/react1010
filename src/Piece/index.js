import React, { useState } from 'react'
// import PropTypes from 'prop-types'
import { MATRIX_PIECES, ALLOWED_DROP_EFFECT, DRAG_DROP_CONTENT_TYPE } from '../constants';
import './styles.css';
const COLORS = [
		"bg-primary",
		"bg-secondary",
		"bg-success",
		"bg-danger",
		"bg-warning",
		"bg-info",
		// "bg-light",
		"bg-dark",
		// "bg-white"
	];

export default function Piece(props) {
	const [pick, setPick] = useState({});
	const [colorClass/*, setColor*/] = useState(COLORS[Math.floor(Math.random() * COLORS.length)]);

    const onDragStart = (e) => {
		e.persist();
		let event = e.nativeEvent;
		event.dataTransfer.effectAllowed = ALLOWED_DROP_EFFECT;

		var data = {
			matrix: MATRIX_PIECES[props.index],
			pickedFrom: pick,
			id: props.id,
			color: colorClass
		};
		event.dataTransfer.setData(DRAG_DROP_CONTENT_TYPE, JSON.stringify(data));
		event.dataTransfer.dropEffect = "move";
    };

    const selectPiecePortion = (row, column) => {
        setPick({
            r: row,
            c: column
        });
    };

	return (<div style={props.style} className="pieceCointainer" draggable='true' onDragStart={(e)=>{e.persist(); onDragStart(e);}}>
				{MATRIX_PIECES[props.index].map((row, r) => {
					// console.log('Color: ' + colorClass, ' - length: ', COLORS.length);

					// const colorClass = colors[Math.floor(Math.random() * colors.length)];
					const cols = row.map((col, c) => {
						let classes = ["piece_column"];
						classes.push(col === 1 ? 'piece' : 'empty');
						if (col === 1){
							classes.push(colorClass);
						}

						// var pieceObj = (<div key={"pcol" + c} className="piece_column empty"> </div>);
						// if (col === 1) {
						// 	pieceObj = (<div key={"pcol" + c} className="piece_column piece" onMouseDown={e => selectPiecePortion(r, c)}> </div>);
						// }
						// return <div key={"pcol" + c} className="piece_column">{pieceObj}</div>;
						// return pieceObj;
						return (<div key={"pcol" + c} className={classes.join(' ')} onMouseDown={e => {
								if (col ===1) selectPiecePortion(r, c)
							}}/>);
					});
					return <div key={'r' + r} className="piece_row">{cols}</div>;
				})}
			</div>);
}
