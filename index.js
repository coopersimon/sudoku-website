const port = 8081;
const db_path = 'mongodb://localhost:27017/sudoku';

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

var mongoose = require('mongoose');

mongoose.connect(db_path);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', main);

function main() {
    // MongoDB

    const sudokuSchema = new mongoose.Schema({
        id: Number,
        sudoku: Array
    });
    var Sudoku = mongoose.model('Sudoku', sudokuSchema);

    const userSchema = new mongoose.Schema({
        ip: String,
        current_id: Number,
        current_filled: Array
    });
    var User = mongoose.model('User', userSchema);


    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.json());
    
    // Functions

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/index.html'));
    });
    
    app.get('/sudoku', (req, res) => {
        // check ip
        var user_ip = req.ip;
 
        // get user with ip
        User.find({ip: user_ip})
            .exec()
            .then(function (users) {
                var user;
                if (users.length == 0) {
                    var u = new User({
                        ip: user_ip,
                        current_id: 1,
                        current_filled: NewSquareArray(9, null)
                    });
                    u.save(function (err) {
                        if (err) return console.error(err);
                    });
                    user = u;
                } else {
                    user = users[0];
                }
                Sudoku.find({id: user.current_id})
                    .exec()
                    .then( function (sudokus) {
                        if (sudokus.length == 0) {
                            // user has completed all available sudokus
                            return;
                        } else {
                            var ret = {
                                sudoku: sudokus[0].sudoku,
                                filled: user.current_filled
                            };

                            res.json(ret);
                        }
                    })
                    .catch(err => console.error(err));

            })
            .catch(err => console.error(err));
    });

    app.post('/finish', (req, res) => {
        // check ip
        var user_ip = req.ip;
 
        // get user with ip
        User.find({ip: user_ip})
            .exec()
            .then(function (users) {
                if (users.length == 0) {
                    // this should never happen
                    var u = new User({
                        ip: user_ip,
                        current_id: 1,
                        current_filled: NewSquareArray(9, null)
                    });
                    u.save(function (err) {
                        if (err) return console.error(err);
                    });
                } else {
                    users[0].current_id += 1;
                    users[0].current_filled = NewSquareArray(9, null);
                    users[0].save(function (err) {
                        if (err) return console.error(err);
                    });
                }
                res.status(200).send("Updated user sudoku id.");
            })
            .catch(err => console.error(err));
    });

    app.post('/filled', (req, res) => {
        // save data
        var filled = req.body;
        var user_ip = req.ip;
 
        // get user with ip
        User.find({ip: user_ip})
            .exec()
            .then(function (users) {
                if (users.length == 0) {
                    // this should never happen
                    var u = new User({
                        ip: user_ip,
                        current_id: 1,
                        current_filled: filled
                    });
                    u.save(function (err) {
                        if (err) return console.error(err);
                    });
                } else {
                    users[0].current_filled = filled;
                    users[0].save(function (err) {
                        if (err) return console.error(err);
                    });
                }
                res.status(200).send("Updated user filled.");
            })
            .catch(err => console.error(err));
    });

    // Listen
    
    app.listen(port, () => {
        console.log(`Started listening on port ${port}.`);
    });
}

// Generic functions

function NewSquareArray(size, t) {
    var array = new Array(size);

    for (var i = 0; i < size; i++) {
        array[i] = new Array(size);
        array[i].fill(t);
    }

    return array;
}
