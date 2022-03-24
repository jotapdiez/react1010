import React, {useState,useEffect} from 'react'
import { useSelector } from 'react-redux';
import './score.css';

export default function Score(){
    const { score, moves } = useSelector(store => store.score );
    const [ scoreAnimation, setScoreAnimation ] = useState(false);
    const [ movesAnimation, setMovesAnimation ] = useState(false);

    useEffect(()=>{
        setScoreAnimation(true);
        setTimeout(e => setScoreAnimation(false), 1000);
    }, [score]);

    useEffect(()=>{
        setMovesAnimation(true);
        setTimeout(e => setMovesAnimation(false), 1000);
    }, [moves]);

    return (<div className="score">
        <div className='points'>
            <span>
                <strong>Puntaje:</strong>
            </span>
            <div className={"score-text" + (scoreAnimation ? " changed" : '')}>{score}</div>
        </div>
        <div className='moves'>
            <span>
                <strong>Movimientos:</strong>
            </span>
            <div className={"moves-text" + (scoreAnimation ? " changed" : '')}>{moves}</div>
        </div>
    </div>);
}
