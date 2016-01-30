'use strict';

var React = require('react');
var Board = require('./board');
var Piece = require('./piece');
var NextPiecesActions = require('../flux/NextPiecesActions');
var ScoreActions = require('../flux/ScoreActions');

var ConstantsGame = require('./const_game');
var ConstantsDragAndDrop = require('./const_dragAndDrop');

module.exports = React.createClass({
	displayName: "Board",
	getInitialState: function(){
		return {
			piecesAdded: []
		};
	},
	
	componentWillMount: function(){
		var piecesAdded = [];
		for (var r = 0; r < ConstantsGame.ROWS; ++r){
			var cols = [];
			for (var c = 0; c < ConstantsGame.ROWS; ++c){
				cols.push(null);
			}
			
			piecesAdded.push(cols);
		}
		// console.log('piecesAdded', piecesAdded);
		this.setState({piecesAdded: piecesAdded});
		// this.loadBoard();
	},
	
	onDragOverItem: function(e) {
		// console.log('Board:: onDragOverItem');
		// if(this.containerAcceptsDropData(e.dataTransfer.types)) { e.preventDefault(); } 
		// var over = parseInt(e.currentTarget.dataset.key);
		// if(e.clientY - e.currentTarget.offsetTop > e.currentTarget.offsetHeight / 2) { over++; }
		// if(over !== this.state.hoverOver) { this.setState({ hoverOver: over }); }
		e.preventDefault();
		// return false;
	},

	pointFromELementId: function(id){
		id = id.replace('.0', '').replace('.$r', 'r');
		var r = id.split('.$')[0].replace('r', '');
		var c = id.split('.$')[1].replace('.0', '').replace('c', '');
		
		return {
			r: r,
			c: c
		};
	},
	
	onDragEnter: function(e) {
		if (e.target.className === 'nullPiece'){
			var data = JSON.parse(e.dataTransfer.getData(ConstantsDragAndDrop.DRAG_DROP_CONTENT_TYPE));
			var state = "Ok";

			var id = e.dispatchMarker.replace(e._dispatchIDs, ''); //.$r4.$c3.0
			var tgtPoint = this.pointFromELementId(id);
			// id = id.replace('.0', '').replace('.$r', 'r');
			// var r = id.split('.$')[0].replace('r', '');
			// var c = id.split('.$')[1].replace('.0', '').replace('c', '');
		
			if (this.pieceColision(data.matrix, tgtPoint.r, tgtPoint.c)){
				state = 'Wrong';
			}
		
			e.target.className += ' dragEnter' + state;
			// // console.log('TODO Board:: onDragEnter', id, id.split('.$'), '--', r, c);
			// this.setState({targetR: r, targetC: c});
			
			// this.setState({piecesAdded: this.state.piecesAdded});
		}
	},
	
	onDragLeave: function(e) {		
		if (e.target.className.indexOf('nullPiece') > -1){
			// console.log('TODO Board:: onDragLeave', e.target);
			if (e.target.className.indexOf('dragEnterOk') > -1 || e.target.className.indexOf('dragEnterWrong') > -1){
				e.target.className = e.target.className.replace(/ dragEnter(Ok|Wrong)/g, '');
			}
			// console.log('TODO Board:: onDragLeave pos', e.target);
		}
	},
	
	pieceColision: function(pieceMatrix, row, col){
		// console.log('pieceMatrix', pieceMatrix, 'row', row, 'col', col);
		var matrix = this.state.piecesAdded;
		for (var r in pieceMatrix){
			var mr = parseInt(r) + parseInt(row);
			if (matrix[mr] === undefined){
				return true;
			}
			
			for (var c in pieceMatrix[r]){
				if (pieceMatrix[r][c] === 0){
					continue;
				}
				
				var mc = parseInt(c) + parseInt(col);
				// console.log('r+row=mr', r, '+', row, '=', mr, 'c+col=mc', c, '+', col, '=', mc, 'matrix[mr][mc]=', matrix[mr][mc]);
				if (matrix[mr][mc] !== null){
					return true;
				}
			}
		}
		
		return false;
	},
	
	onDrop: function(e) {
		// if (e)e.preventDefault();
		
		// console.log('Board:: onDrop', e);
		
		var data = JSON.parse(e.dataTransfer.getData(ConstantsDragAndDrop.DRAG_DROP_CONTENT_TYPE));
		
		var id = e.dispatchMarker.replace(e._dispatchIDs, ''); //.$r4.$c3.0
		var tgtPoint = this.pointFromELementId(id);
		
		this.onDragLeave(e);
		if (this.pieceColision(data.matrix, tgtPoint.r, tgtPoint.c)){
			return;
		}
		
		ScoreActions.addDrop();
		NextPiecesActions.use(data.pieceId);
		
		this.addPiece(data, tgtPoint.r, tgtPoint.c);
		// if(this.state.hoverOver !== NO_HOVER) {
			// this.state.items.splice(this.state.hoverOver, 0, data);
			// if(this.state.selected > this.state.hoverOver) {
				// this.state.selected = this.state.selected+1;
			// }
			// this.state.hoverOver = NO_HOVER;
			// this.setState(this.state);
		// }
	},
	
	onDragEnd: function(e) {
		// console.log('TODO Board:: onDragEnd');
		if(e.dataTransfer.dropEffect === ConstantsDragAndDrop.ALLOWED_DROP_EFFECT) {
			this.state.items.splice(this.state.selected, 1);
			this.state.hoverOver = ConstantsDragAndDrop.NO_HOVER;
			this.state.selected = ConstantsDragAndDrop.NONE_SELECTED;
			this.setState(this.state);
			return;
		}
		if(this.state.hoverOver !== ConstantsDragAndDrop.NO_HOVER || this.state.sele) {
			this.setState({ hoverOver: ConstantsDragAndDrop.NO_HOVER, selected: ConstantsDragAndDrop.NONE_SELECTED });
		}
	},
	
	addPiece: function(data, tr, tc){
		var blockStyle = {backgroundColor: '#' + this.state.red + this.state.green + this.state.blue};
		
		var pieceScore = 0;
		var piecesAdded = this.state.piecesAdded;
		var _tc = tc;
		for (var r in data.matrix){
			var added = false;
			_tc = tc;
			for (var c in data.matrix[r]){
				// console.log('data.matrix['+r+']['+c+']', data.matrix[r][c], ' tr', tr, ' tc', tc);
				if (data.matrix[r][c] === 1){
					++pieceScore;
					if (piecesAdded[tr] === undefined || piecesAdded[tr][_tc] === undefined){
						continue;
					}
						
					piecesAdded[tr][_tc] = (<div className="piece" style={blockStyle}> </div>);
				}
				++_tc;
				
				// added = true;
			}
			
			// if (added){
				++tr;
			// }
		}

		ScoreActions.add(pieceScore);
		this.setState({piecesAdded: piecesAdded});
	},
	
	componentDidUpdate: function(prevProps, prevState){
		var boardsAreEqualStart = this.boardsAreEqual(this.state.piecesAdded, prevState.piecesAdded);
		// console.log('componentDidUpdate:: compare piecesAdded',boardsAreEqualStart);
		if (!boardsAreEqualStart){
			// console.log('componentDidUpdate::\n',this.state.piecesAdded, '\n', prevState.piecesAdded);
			// console.log('<-- componentDidUpdate::!boardsAreEqualStart return');
			return;
		}
		
		// var changed = false;
		// console.log('this.state');
		// for (var r in this.state.piecesAdded){
			// var l = r+":";
			// for (var c in this.state.piecesAdded[r]){
				// // console.log('changed',this.state.piecesAdded[r][c] != prevState.piecesAdded[r][c]);
				// // if (this.state.piecesAdded[r][c] != prevState.piecesAdded[r][c]){
					// // changed = true;
					// // break;
				// // }
				// l+=(!this.state.piecesAdded[r][c] ? '-' : 'O');
			// }
			// console.log(l);
		// }
		
		// console.log('prevState');
		// for (var r in prevState.piecesAdded){
			// var l = r+":";
			// for (var c in prevState.piecesAdded[r]){
				// // console.log('changed',this.state.piecesAdded[r][c] != prevState.piecesAdded[r][c]);
				// // if (this.state.piecesAdded[r][c] != prevState.piecesAdded[r][c]){
					// // changed = true;
					// // break;
				// // }
				// l+=(!prevState.piecesAdded[r][c] ? '-' : 'O');
			// }
			// console.log(l);
		// }
		// console.log('piecesAdded',this.state.piecesAdded, prevState.piecesAdded);
		
		// if (!changed){
			// return;
		// }
		
		var columnsWithFreeSpaces = {};
		var rowsWithoutFreeSpaces = {};
		
		var linesHorizontalCleared = 0;
		var linesVerticalCleared = 0;
		
		for (var r in this.state.piecesAdded){
			var freeSpaceOnRow = false;
			for (var c in this.state.piecesAdded[r]){
				if (!this.state.piecesAdded[r][c]){
					freeSpaceOnRow = true;
					columnsWithFreeSpaces[c] = true;
				}else if(columnsWithFreeSpaces[c] === undefined){
					// ++linesVerticalCleared;
					columnsWithFreeSpaces[c] = false;
				}
			}
			
			// if (!freeSpaceOnRow){
				// ++linesHorizontalCleared;
			// }
			
			rowsWithoutFreeSpaces[r] = !freeSpaceOnRow;
		}

		var newState = [];
		// console.log('columnsWithFreeSpaces', columnsWithFreeSpaces);
		var lastRowCleared = null;
		var lastColCleared = null;
		var countColumns = true;
		for (var row in this.state.piecesAdded){
			var cols = [];
			var countRow = true;
			for (var column in this.state.piecesAdded[row]){
				var clear = false;
				if (rowsWithoutFreeSpaces[row]){
					if (countRow){
						++linesHorizontalCleared;
						countRow = false;
					}
					
					clear = true;
				}
				if(!columnsWithFreeSpaces[column]){
					if (countColumns){
						++linesVerticalCleared;
					}
					
					clear = true;
					
				}
					
				if (clear){
					cols.push(null);
				}else{
					cols.push(this.state.piecesAdded[row][column]);
				}
			}
			
			countColumns = false;
			newState.push(cols);
		}

		var boardsAreEqual = this.boardsAreEqual(this.state.piecesAdded, newState);
		// console.log('boardsAreEqual method', boardsAreEqual);
		// console.log('boardsAreEqual ===', this.state.piecesAdded === newState);
		if (!boardsAreEqual){
			var self = this;
			setTimeout(function(){
				var score = 10;
				score *= (linesHorizontalCleared > 0 ? linesHorizontalCleared : 1);
				score *= (linesVerticalCleared > 0 ? linesVerticalCleared : 1);
				
				ScoreActions.add(score);
				self.setState({piecesAdded: newState});
			}, 300);
			
		}
	},
	
	boardsAreEqual: function(boardOne, boardTwo){
		var equal = true;
		for (var r in boardOne){
			for (var c in boardOne[r]){
				// console.log('boardOne['+r+']['+c+'] != boardTwo['+r+']['+c+']', boardOne[r][c] != boardTwo[r][c]);
				if (boardOne[r][c] !== boardTwo[r][c]){
					equal = false;
					break;
				}
			}
		}
		
		return equal;
	},
	
	render: function() {
		var blockStyle = {
			display: 'inline-block', 
			width: ConstantsGame.BLOCK_WIDTH + 'px', 
			height: ConstantsGame.BLOCK_HEIGHT + 'px'
		};
		
		var rows = this.state.piecesAdded.map(function(row, rowIndex){
			var cols = row.map(function(col, colIndex){
				return (<div key={'c' + colIndex} style={blockStyle} className="_column">{col || <div className="nullPiece"> </div>}</div>);
			});
			
			return (<div key={'r' + rowIndex} className="_row">{cols}</div>);
		});
		
		return (<div id="board" className="board" onDrop={this.onDrop} onDragEnd={this.onDragEnd} onDragEnter={this.onDragEnter} onDragLeave={this.onDragLeave} onDragOver={this.onDragOverItem}>
				{rows}
			</div>);
	}
});
