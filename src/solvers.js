/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  var matrix = _.range(n).map(val => _.range(n).map(() => 0));
  var board = new Board(matrix);
  for (var row = 0; row < n; row++) {
    for (var col = 0; col < n; col++) {
      var canSet = board.canSetAtLocation(row, col, 'rook');
      if (canSet) {
        board.setAtLocation(row, col);
      }  
    }
  }
  var solution = board.rows();
  // console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n, board, x, y) {
  // var solutionCount = undefined; //fixme
  var numSolutions = 0;
  var solutions = [];
  if (!board) {
    x = 0;
    y = 0;
    var matrix = _.range(n).map(val => _.range(n).map(() => 0));
    var board = new Board(matrix); 
    if (n === 0) {
      return 1;      
    } 
  }
  if (n > 0) {
    for (var row = x; row < board.rows().length; row++) {
      for (var col = y; col < board.rows().length; col++) {
        var canSet = board.canSetAtLocation(row, col, 'rook');
        if (canSet) {
          board.setAtLocation(row, col);
          solutions = solutions.concat(countNRooksSolutions(n - 1, board, row, col));
          board.unSetAtLocation(row, col);
        }
      }
      y = 0;
    }
    if (n === board.rows().length) {
      // var solutionCount = solutions.length;
      // console.log(`solutions: ${solutions}`);
      // console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
      return solutions.length;
    }
    return solutions;
  } else {
    solutions.push(JSON.stringify(board.rows()));
    return solutions;
  }  
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n, board, x, y) {
  var numSolutions = 0;
  var solutions = [];
  if (!board) {
    x = 0;
    y = 0;
    var matrix = _.range(n).map(val => _.range(n).map(() => 0));
    var board = new Board(matrix); 
    if (n === 0) {
      return 0;      
    } else if (n === 1) {
      return [[1]];
    }
  }

  if (n > 0) {
    for (var row = x; row < board.rows().length; row++) {
      for (var col = y; col < board.rows().length; col++) {
        var canSet = board.canSetAtLocation(row, col, 'queen');
        if (canSet) {
          board.setAtLocation(row, col);
          solutions = findNQueensSolution(n - 1, board, row, col);
          if (solutions !== undefined && solutions.length > 0) {
            return solutions;
          }

          board.unSetAtLocation(row, col);
        }
      }
      y = 0;
    } 
    if (n === board.rows().length) {
      return board.rows();
    }
  } else {
    return board.rows();
  }
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n, board, x, y) {
    // var solutionCount = undefined; //fixme
  var numSolutions = 0;
  var solutions = [];
  if (!board) {
    x = 0;
    y = 0;
    var matrix = _.range(n).map(val => _.range(n).map(() => 0));
    var board = new Board(matrix); 
    if (n === 0) {
      return 1;      
    } 
  }
  if (n > 0) {
    for (var row = x; row < board.rows().length; row++) {
      for (var col = y; col < board.rows().length; col++) {
        var canSet = board.canSetAtLocation(row, col, 'queen');
        if (canSet) {
          board.setAtLocation(row, col);
          solutions = solutions.concat(countNQueensSolutions(n - 1, board, row, col));
          board.unSetAtLocation(row, col);
        }
      }
      y = 0;
    }
    if (n === board.rows().length) {
      var solutionCount = solutions.length;
      console.log(`solutions: ${solutions}`);
      console.log('Number of solutions for ' + n + ' queens:', solutionCount);
      return solutions.length;
    }
    return solutions;
  } else {
    solutions.push(JSON.stringify(board.rows()));
    return solutions;
  }
};
