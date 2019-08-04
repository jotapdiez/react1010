// var keyMirror = require('keymirror');

export const ROWS =  9;
export const COLS = 15;
export const BLOCK_HEIGHT = 50;
export const BLOCK_WIDTH  =  5;
export const ALLOWED_DROP_EFFECT = 'move';
export const DRAG_DROP_CONTENT_TYPE = 'custom_container_type';

export const MATRIX_PIECES = [
    [ //0
        [1],
        [1],
        [1],
        [1, 1, 1, 1]
    ],
    [ //1
        [1, 1, 1, 1],
        [1],
        [1],
        [1]
    ],
    [ //2
        [1],
        [1],
        [1],
        [1]
    ],
    [ //3
        [1, 1],
        [1, 1]
    ],
    [ //4
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ],
    [ //5
        [1, 1, 1],
        [1, 0, 0],
        [1, 0, 0]
    ],
    [ //6
        [1, 1, 1],
        [0, 0, 1],
        [0, 0, 1]
    ],
    [ //7
        [1, 1, 1, 1]
    ],
    [ //8
        [1]
    ],
    [ //9
        [1, 1]
    ],
    [ //10
        [1, 1, 1]
    ],
    [ //11
        [1],
        [1],
        [1]
    ],
    [ //12
        [1],
        [1, 1]
    ],
    [ //13
        [1],
        [1]
    ]
];


