var ROWS = 250;
var COLS = 250;

function randomArray(width = COLS, height = ROWS) {
    return (new Array(width)).fill(0).map((col) => {
        return (new Int8Array(height)).fill(0).map((row) => {
            return Math.random() >= 0.7 ? 1 : 0;
        });
    });
}

function gof(state = null) {
    return state.map((col, x) => {
        return col.map((row, y) => {
            let liveNeighbours = [
                [-1, -1],
                [0, -1],
                [1, -1],
                [-1, 0],
                [1, 0],
                [-1, 1],
                [0, 1],
                [1, 1]
            ].filter((neighbour) => {
                return state[x + neighbour[0]] == undefined || state[x + neighbour[0]][y + neighbour[1]] == undefined ? false : state[x + neighbour[0]][y + neighbour[1]] == 1;
            }).length;
            return row == 1 ? (liveNeighbours == 2 || liveNeighbours == 3) ? 1 : 0 : liveNeighbours == 3 ? 1 : 0;
        });
    });
}

function randomArray8(width = COLS, height = ROWS) {
    return (new Int8Array(COLS * ROWS)).fill(0).map((row) => {
        return Math.random() >= 0.7 ? 1 : 0;
    });
}

function gof8(state = null) {
    return state.map((value, i) => {
        //let x = i % COLS;
        //let y = Math.floor(i/ROWS);
        let liveNeighbours = [i - COLS - 1, i - COLS, i - COLS + 1, i - 1, i + 1, i + COLS - 1, i + COLS, i + COLS + 1].filter((neighbour) => {
            return state[neighbour] == undefined ? false : state[neighbour] == 1;
        }).length;
        return value == 1 ? (liveNeighbours == 2 || liveNeighbours == 3) ? 1 : 0 : liveNeighbours == 3 ? 1 : 0;

    });
}

/*
function init() {
    var state = gof(randomArray());
    //var stats = new Stats();
    //document.body.appendChild( stats.dom );
    //console.log(state);
    let loop = function() {
        state = gof(state);
        //stats.update();
        requestAnimationFrame(loop);

    };
    requestAnimationFrame(loop);
    
}

init();
*/