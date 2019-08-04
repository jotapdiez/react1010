const initial ={
    drops: 0,
    score: 0
};

export default function reduce(state = initial, action) {
    // console.log('action: ', action);
    // console.log('state', state);
    // console.table(state);
    let result = Object.assign({}, state);
    switch (action.type) {
        case 'score_add':
            result.score += action.payload;
            return result;
        case 'score_drop':
            // let result = Object.assign({}, state);
            ++result.drops;
            console.log('result: ', result);

            return result;
        default:
            // console.log('Invalid action "'+action.type+'"');
            return state;
        // throw new Error('Invalid action');
        // 	break;
    }
}
