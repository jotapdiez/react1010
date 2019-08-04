export const use = id => ({
    type: 'use',
    payload: id
});

export const add = (count) => ({
    type: 'add',
    payload: count
});

