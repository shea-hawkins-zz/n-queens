
onmessage = function(message) {

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
  var n = message.data.n;
  var min = message.data.min;
  var max = message.data.max;
  postMessage(findSolutionsForColumnRange(n, min, max));
};