# Sudoku Website
I extended one of the websites I made for my final year project. It gets a sudoku from a database and the user can fill it in.

## Techs used:
* Database: MongoDB and Mongoose
* Server: Node.js with Express
* Front-end: React

## How to use:
First a MongoDB database must be run (`service mongod start` or similar).

Then, in the mongo shell, run `load(init/init.js)`.

Then run `npm install`.

Then run `npm start`. This will webpack the code and run the server.
