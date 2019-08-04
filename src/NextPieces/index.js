import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Piece from '../Piece'
import { add } from './Actions';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export default function NextPieces(props) {
    const dispatch = useDispatch();
    const allNextPieces = useSelector(store => store.nextPiece);
    useEffect(() => {
        if (allNextPieces.length === 0) {
            dispatch(add(5));
        }
    });

    return (<TransitionGroup className="nextPieces">
            {allNextPieces.map(piece => {
                return (<CSSTransition
                    key={piece.id}
                    timeout={200}
                    classNames="nextPieces"
                >
                    <Piece key={piece.id} id={piece.id} className="nextPiece" index={piece.index} />
                </CSSTransition>);
            })}
        </TransitionGroup>);
}
