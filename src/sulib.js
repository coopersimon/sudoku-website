// Checks array has numbers 1-9 in it
function CheckComplete(arr) {
    arr.sort();
    for (var i = 0; i < 9; i++) {
        if (arr[i] != i + 1) {
            return false;
        }
    }
    return true;
}

function CheckSet(access) {
    for (var i = 0; i < 9; i++) {
        var row = new Array(9);
        for (var j = 0; j < 9; j++) {
            row[j] = access(i, j);
        }
        if (!CheckComplete(row)) {
            return false;
        }
    }
    return true;
}

function CheckSudoku(sudoku) {
    return CheckSet((i, j) => {
            return sudoku[i][j];
        }) &&
        // col
        CheckSet((i, j) => {
            return sudoku[j][i];
        }) &&
        // box
        // i 00, 30, 60, 03, 33, 63, 06, 36, 66
        // j 00, 10, 20, 01, 11, 21, 02, 12, 22
        CheckSet((i, j) => {
            let x = ((i * 3) % 9) + (j % 3);
            let y = (Math.floor(i / 3) * 3) + Math.floor(j / 3);
            return sudoku[y][x];
        });
}

export default CheckSudoku

/*var sudoku = [
    [9,1,8,4,5,3,6,2,7],
    [3,5,6,9,2,7,4,8,1],
    [7,4,2,6,8,1,9,3,5],
    [5,2,4,1,7,8,3,6,9],
    [6,7,9,3,4,2,5,1,8],
    [8,3,1,5,6,9,7,4,2],
    [2,9,3,7,1,4,8,5,6],
    [4,8,5,2,9,6,1,7,3],
    [1,6,7,8,3,5,2,9,4]
];*/

//console.log(CheckSudoku(sudoku));
