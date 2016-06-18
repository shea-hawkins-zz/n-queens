
onmessage = function(message) {

  var findSolutionsForColumnRange = function(n, min, max, board) {
    var setPrunes = function(row, col) {
      var minDiag = (board[0].length - 1 - row - col);
      var majDiag = (col - row);
      pruned['col'][col] = true;
      pruned['minDiag'][minDiag] = true;
      pruned['majDiag'][majDiag] = true;
    };


    var unSetPrunes = function(row, col) {
      var minDiag = (board[0].length - 1 - row - col);
      var majDiag = (col - row);
      pruned['minDiag'][minDiag] = false;
      pruned['majDiag'][majDiag] = false;
      pruned['col'][col] = false;
    };

    var findSolutions = function(n, board, row, pruned, callback) {
      if (row === n) {
        return callback();
      }
      for (var col = 0; col < board[0].length; col++) {
        var minDiag = (board[0].length - 1 - row - col);
        var majDiag = (col - row);
        if (!pruned['col'][col] && !pruned['majDiag'][majDiag] && !pruned['minDiag'][minDiag]) {
          setPrunes(row, col);
          board[row][col] = 1;
          findSolutions(n, board, row + 1, pruned, callback);
          board[row][col] = 0;
          unSetPrunes(row, col);
        }
      }
    };

    var solutionsCount = 0;
    var pruned = {
      row: {},
      col: {},
      majDiag: {},
      minDiag: {}
    };
    for (var i = min; i < max; i++) {
      board[0][i];
      setPrunes(0, i);
      findSolutions(n, board, 1, pruned, function() {
        solutionsCount++;
      });
      board[0][i];
      unSetPrunes(0, i);
    }      
    return solutionsCount;
  }; 
  var n = message.data.n;
  var min = message.data.min;
  var max = message.data.max;
  var board = [];
  for (var i = 0; i < n; i++) {
    var row = [];
    for (var j = 0; j < n; j++) {
      row.push(0);
    }
    board.push(row);
  }
  var numSol = findSolutionsForColumnRange(n, min, max, board);

  postMessage(numSol);
};