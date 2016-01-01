var colors = require('colors');

function Piece(color, pos, board){
  this.color = color;
  this.pos = pos;

  this.char = this.color === 'Black' ? 'B'.blue : 'R'.red;
}

function Space() {
  this.char = 'O';
}

function Board(x, y){
  this.grid = new Array(x);
  this.row = y;

  this.makeGrid = function() {
    for (var i = 0; i < this.grid.length; i++) {
      this.grid[i] = new Array(this.row);

      for (var j = 0; j < this.grid[i].length; j++) {
        this.grid[i][j] = new Space();
      }
    }
    return this.grid;
  };

  this.placePiece = function(row, playerColor) {
    var pos = this.isValidMove(row);
    if (pos !== false) {
      var piece = new Piece(playerColor, [row, pos]);
      this.grid[row][pos] = piece;

      return piece;
    }
  };

  this.isValidMove = function(row) {
    if (row < 0 || row > this.grid[0].length) {
      return false;
    }

    var i = 0;
    while (i < this.grid[row].length && this.grid[row][i].char !== 'O') {
      i++;
    }

    if (i < this.grid[row].length) {
      return i;
    }

    return false;
  };

  this.isLine = function(piece) {
    var i = 1;
    var x = piece.pos[0];
    var y = piece.pos[1];

    var lineCount = 1;
    while (i <= 4) {
      if (this.grid[x+i] && this.grid[x+i][y].color === piece.color) {
        lineCount++;
        i++;
      } else {
        break;
      }
    }

    i = 1;
    while (i <= 4) {
      if (this.grid[x-i] && this.grid[x-i][y].color === piece.color) {
        lineCount++;
        i++;
      } else {
        break;
      }
    }

    if (lineCount >= 4) {
      return true;
    }

    lineCount = 1;
    while (i <= 4) {
      if (this.grid[x][y+i] && this.grid[x][y+i].color === piece.color) {
        lineCount++;
        i++;
      } else {
        break;
      }
    }

    i = 1;
    while (i <= 4) {
      if (this.grid[x][y-i] && this.grid[x][y-i].color === piece.color) {
        lineCount++;
        i++;
      } else {
        break;
      }
    }

    if (lineCount >= 4) {
      return true;
    }

    lineCount = 1;
    while (i <= 4) {
      if (this.grid[x+i] && this.grid[x+i][y+i] &&
          this.grid[x+i][y+i].color === piece.color
      ) {
        lineCount++;
        i++;
      } else {
        break;
      }
    }

    i = 1;
    while (i <= 4) {
      if (this.grid[x-i] && this.grid[x-i][y-i] &&
        this.grid[x-i][y-i].color === piece.color
      ) {
        lineCount++;
        i++;
      } else {
        break;
      }
    }

    if (lineCount >= 4) {
      return true;
    }

    lineCount = 1;
    while (i <= 4) {
      if (this.grid[x-i] && this.grid[x-i][y+i] &&
        this.grid[x-i][y+i].color === piece.color
      ) {
        lineCount++;
        i++;
      } else {
        break;
      }
    }

    i = 1;
    while (i <= 4) {
      if (this.grid[x+i] && this.grid[x+i][y-i] &&
        this.grid[x+i][y-i].color === piece.color
      ) {
        lineCount++;
        i++;
      } else {
        break;
      }
    }

    if (lineCount >= 4) {
      return true;
    }

    return false;
  };
}

function Game(x, y){
  this.board = new Board(x, y);
  this.currentPlayer = 'Black';

  this.start = function() {
    this.board.makeGrid();
    this.printBoard();
    console.log(this.currentPlayer + ', choose a column:');
    this.play();
  };

  this.play = function() {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', function (input) {
      var validTurn = this.takeTurn(parseInt(input) - 1);
      if (validTurn) {
        this.currentPlayer = this.currentPlayer === 'Black' ? 'Red' : 'Black';
        this.printBoard();
        console.log(this.currentPlayer + ' choose a column:');
      } else {
        console.log('Invalid move. Try again.');
      }
    }.bind(this));
  };

  this.takeTurn = function(input) {
    if (isNaN(input)) {
      return false;
    }

    var piece = this.board.placePiece(input, this.currentPlayer);

    if (piece) {
      this.isWon(piece);
    } else {
      return false;
    }

    return true;
  };

  this.isWon = function(piece) {
    if (this.board.isLine(piece)) {
      this.printBoard();
      console.log(this.currentPlayer + ' wins!');
      process.exit();
    }
  };

  this.printBoard = function() {
    var i = this.board.grid[0].length - 1;
    var head = '';

    for (var k = 1; k <= this.board.grid.length; k++) {
      head += k + '  ';
    }
    console.log(head);

    while (i >= 0) {
      var row = '';
      for (var j = 0; j < this.board.grid.length; j++) {
        row += this.board.grid[j][i].char;
        row += '  ';
      }

      console.log(row);
      i--;
    }
  };
}

var game = new Game(7, 6);
game.start();
