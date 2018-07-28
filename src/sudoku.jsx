import React from 'react'
import './index.css'
import CheckSudoku from './sulib'

function NewSquareArray(size) {
    var array = new Array(size);

    for (var i = 0; i < size; i++) {
        array[i] = new Array(size);
        array[i].fill({num: "", variable: true});
    }

    return array;
}

class Sudoku extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: NewSquareArray(9),
        };
        this.getSudoku();
    }

    render() {
        return (
            <div>
            <div className="su-grid">
                {this.state.squares.map((row, y) =>
                    <div className="su-row" key={y}>
                        {row.map((sq, x) =>
                            <SudokuSquare
                             value={sq.num}
                             variable={sq.variable}
                             key={(y*9 + x + 9).toString()}
                             onChange={(event) => this.handleInput(event,y,x)}
                             boldLines={ {right: (y%3 === 2) && (y != 8), bottom: (x%3 === 2) && (x != 8)} }
                            />
                        )}
                    </div>
                )}
            </div>
                <button onClick={(event) => this.save()}> Save </button>
                <button onClick={(event) => this.checkCorrect()}> Check! </button>
            </div>
        );
    }

    handleInput(event, y, x) {
        const num = event.target.value;
        if (num.length <= 1 && !isNaN(num)) {
            const squares = this.state.squares.slice();
            squares[y][x] = {num: num, variable: true};
            this.setState({
                squares: squares,
            });
        }
    }

    // send difference to server
    save() {
        console.log(JSON.stringify(this.findVars()));
        fetch('/filled', {
            method: "POST",
            headers: new Headers([
                ['Content-Type', 'application/json']
            ]),
            body: JSON.stringify(this.findVars())
        })
            .catch((error) => console.log(error));
    }

    findVars() {
        const squares = this.state.squares.slice();
        return squares.map(row => {
            return row.map(val => {
                if (val.variable) {
                    return val.num;
                } else {
                    return null;
                }
            });
        });
    }

    checkCorrect() {
        try {
            var sudokuVals = this.state.squares.map((row) => {
                return row.map((val) => {
                    return parseInt(val.num);
                });
            });
        } catch(e) {
            console.log("Error: " + e);
            return;
        }

        if (CheckSudoku(sudokuVals)) {
            window.alert("Well done!");
            this.finish();
        } else {
            window.alert("Not correct!");
        }
    }
    
    // gets from database
    getSudoku() {
        fetch('/sudoku')
            .then((res) => res.json())
            .then((data) => {
                this.setState({
                    squares: data.sudoku.map((row, y) => {
                        return row.map((val, x) => {
                            if (val == 0) {
                                if (data.filled[y][x] != null) {
                                    return {num: data.filled[y][x], variable: true};
                                } else {
                                    return {num: "", variable: true};
                                }
                            } else {
                                return {num: val.toString(), variable: false};
                            }
                        });
                    }),
                });
            })
            .catch((error) => console.log(error));
    }

    // if sudoku is correct, notify the server and update
    finish() {
        fetch('/finish', {
            method: "POST"
        })
            .then((res) => {
                this.getSudoku();
            })
            .catch((error) => console.log(error));
    }
}

class SudokuSquare extends React.Component {
    render() {
        const boldRight = this.props.boldLines.right ? "2px" : "";
        const boldBottom = this.props.boldLines.bottom ? "2px" : "";
        if (this.props.variable) {
            return (
                <div
                 className="su-square"
                 style={{borderRightWidth: boldRight, borderBottomWidth: boldBottom}}
                >
                    <input
                     type="text"
                     value={this.props.value}
                     onChange={this.props.onChange}
                     className="sq-input"
                    />
                </div>
            );
        } else {
            return (
                <div
                 className="su-square sq-input"
                 style={{borderRightWidth: boldRight, borderBottomWidth: boldBottom}}
                >
                    <strong>{this.props.value}</strong>
                </div>
            );
        }
    }
}

export default Sudoku
