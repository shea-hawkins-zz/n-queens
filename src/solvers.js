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
window.findNQueensSolution = function(n, board, x, y, pruned) {
  var numSolutions = 0;
  var solutions = [];

  if (!board) {
    x = 0;
    y = 0;
    var pruned = {
      row: {},
      col: {},
      diag: {}
    };
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

      // if the target row is in the prunedRows as true
      // increment the row and skip forward.
      for (var col = y; col < board.rows().length; col++) {
        // ''
        // if the target row, column -(row - column == dia) in the pruned diagonal 
        // col++
        var canSet = board.canSetAtLocation(row, col, 'queen');
        if (canSet) {
          board.setAtLocation(row, col);
          pruned['row'][row] = true;
          solutions = findNQueensSolution(n - 1, board, row, col, pruned);
          if (solutions !== undefined && solutions.length > 0) {
            return solutions;
          }

          board.unSetAtLocation(row, col);
          pruned['row'][row] = false;
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
window.countNQueensSolutions = function(n) {
    // var solutionCount = undefined; //fixme

  var parallelSolutionFinder = function(n) {
    // if n mod 2 doesn't = zero
      // Then we have a third worker that calculates the number of solutions at ceil(n / 2)

    // start worker 1 finding solutions for boards where the first row has a piece at the first position to Math.ceil(Math.floor(n / 2) / 2)
    // worker 2 does above for Math.ceil(Math.floor(n/2) / 2) + 1 to Math.floor(n/2)
    
    //After worker 1 and 2 report back solutions, add them together, multiply by 2, and add worker 3 if applic.
    // SOLUTIONS!
    var midWorkerSolution = 0;
    if (n % 2 !== 0) {
      midWorkerSol = findSolutionsForColumnRange(n, Math.floor(n / 2), Math.floor(n / 2) + 1);
    }
    var leftWorkerSol = findSolutionsForColumnRange(n, 0, Math.ceil(Math.floor(n / 2) / 2) + 1);
    var rightWorkerSol = findSolutionsForColumnRange(n, Math.ceil(Math.floor(n / 2) / 2 + 1, Math.floor(n / 2)));
    var totalSolution = (leftWorkerSol + rightWorkerSol) * 2;
    return totalSolution + midWorkerSol;
  };

  var findSolutionsForColumnRange = function(n, min, max) {
    var setPrunes = function(row, col) {
      var minDiag = (board.rows().length - 1 - row - col);
      var majDiag = (col - row);
      pruned['col'][col] = true;
      pruned['minDiag'][minDiag] = true;
      pruned['majDiag'][majDiag] = true;
    };


    var unSetPrunes = function(row, col) {
      var minDiag = (board.rows().length - 1 - row - col);
      var majDiag = (col - row);
      pruned['minDiag'][minDiag] = false;
      pruned['majDiag'][majDiag] = false;
      pruned['col'][col] = false;
    };

    var findSolutions = function(n, board, row, pruned, callback) {
      if (row === n) {
        return callback();
      }
      for (var col = 0; col < board.rows().length; col++) {
        var minDiag = (board.rows().length - 1 - row - col);
        var majDiag = (col - row);
        if (!pruned['col'][col] && !pruned['majDiag'][majDiag] && !pruned['minDiag'][minDiag]) {
          setPrunes(row, col);
          board.setAtLocation(row, col);
          findSolutions(n, board, row + 1, pruned, callback);
          board.unSetAtLocation(row, col);
          unSetPrunes(row, col);
        }
      }
    };

    var solutionsCount = 0;
    var board = new Board({n: n});
    var pruned = {
      row: {},
      col: {},
      majDiag: {},
      minDiag: {}
    };
    for (var i = min; i < max; i++) {
      board.setAtLocation(0, i);
      setPrunes(0, i);
      findSolutions(n, board, 1, pruned, function() {
        solutionsCount++;
      });
      board.unSetAtLocation(0, i);
      unSetPrunes(0, i);
    }      
    return solutionsCount;
  };

  if (n === 0) {
    return 1;
  }
  return findSolutionsForColumnRange(n, 0, n);
};
