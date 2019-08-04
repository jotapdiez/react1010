import React, {useState,useEffect} from 'react'
import { useSelector } from 'react-redux';
// import { createSelector } from 'reselect'
import { CSSTransition } from 'react-transition-group';
import './score.css';

// const storeSelector = createSelector(
//     score => state.todos,
//     drops => state.drops
// );

export default function Score(){
    // const { score, drops } = useSelector(storeSelector);
    const { score, drops } = useSelector(store => {
        console.log('store:', store);

        return store.score;
    });
    const [anim, setAnim] = useState(false);
    useEffect(()=>{
        setAnim(true);
    }, [score]);
    return (<div className="score">
        <span>
            <strong>Puntaje:</strong>
        </span>
        <CSSTransition
            in={anim}
            timeout={100}
            onEntered={() => setAnim(false)}
            classNames="score-text">
            <div className="score-text">{score}</div>
        </CSSTransition>
        <br />
        <span>
            <strong>Movimientos:</strong>
        </span>
            <div>{drops}</div>
    </div>);
}
