export const add = points => ({
    type: 'score_add',
    payload: points
});

export const drop = () => ({
    type: 'score_drop'
});
