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
    var workerLeft = new Worker('src/queenWorker.js');
    var workerMid = new Worker('src/queenWorker.js');
    var workerRight = new Worker('src/queenWorker.js');
    workerLeft.onerror = function(event) {
      console.log(event);
      //throw new Error(event.message + " (" + event.filename + ":" + event.lineno + ")");
    };
    var midWorkerSol = 0;
    var leftWorkerSol = 0;
    var rightWorkerSol = 0;
    if (n % 2 !== 0) {
      workerMid.postMessage('message');
      workerMid.onmessage = function(event) {
        midWorkerSol = event.data;
        console.log('mid' + midWorkerSol);
      };
    }
    workerLeft.postMessage({n: n, min: 0, max: Math.ceil(Math.floor(n / 2) / 2), board: new Board({n: n})});
    workerLeft.onmessage = function(count) {
      leftWorkerSol = count.data;
      console.log('left' + leftWorkerSol);
    };
    workerRight.postMessage({n: n, min: Math.ceil(Math.floor(n / 2) / 2), max: Math.floor(n / 2), board: new Board({n: n})});
    workerRight.onmessage = function(count) {
      rightWorkerSol = count.data;
      console.log('right' + rightWorkerSol);
    };
    var totalSolution = ( + rightWorkerSol) * 2;
    return totalSolution + midWorkerSol;
  };



  if (n === 0 || n === 1) {
    return 1;
  }
  return parallelSolutionFinder(8);
};
