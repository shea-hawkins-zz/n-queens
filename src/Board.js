// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    canSetRookAtLocation: function(row, col) {
      var init = this.get(row)[col];
      if (init === 1) {
        return false;
      }
      this.get(row)[col] = 1;
      var conflict = this.hasAnyRooksConflicts();
      this.get(row)[col] = 0;
      return !conflict;
    },

    setAtLocation: function(row, col) {
      this.get(row)[col] = 1;
    },

    unSetAtLocation: function(row, col) {
      this.get(row)[col] = 0;
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    columns: function() {
      var columns = [];
      _(_.range(this.get('n'))).map(function(rowIndex) {
        this.get(rowIndex).forEach(function(element, index) {
          if (columns[index] === undefined) {
            columns[index] = [];
          }
          columns[index].push(element);
        });
      }, this);
      return columns;
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      return this.rows()[rowIndex].reduce((mem, element) => mem + element, 0) > 1 ? true : false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var matrix = this.rows();
      return _(matrix).reduce((mem, row, rowIndex) => {
        return mem ? mem : this.hasRowConflictAt(rowIndex);
      }, false);
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      return this.columns()[colIndex].reduce((mem, element) => mem + element, 0) > 1 ? true : false;
    },
    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var matrix = this.columns();
      this.hasColConflictAt(0);
      return _(matrix).reduce((mem, row, colIndex) => {
        return mem ? mem : this.hasColConflictAt(colIndex);
      }, false);
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(startIndex) {
      startIndex = Math.abs(startIndex);
      var rows = this.rows();
      var conflicts = _.range(startIndex, rows.length).reduce(function(mem, i) {
        return [mem[0] + rows[i][i - startIndex], mem[1] + rows[i - startIndex][i]];
      }, [0, 0]);
      return _(conflicts).any(function(i) {
        return i > 1;
      });
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var rows = this.rows();
      return _.reduce(rows, (mem, row, rowIndex) => {
        //sum i,i elements
        return mem ? mem : this.hasMajorDiagonalConflictAt(rowIndex);
      }, false);
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(startIndex) {
      startIndex = Math.abs(startIndex);
      var rows = this.rows();
      var conflicts = _.range(0, rows.length - startIndex).reduce(function(mem, i) {
        // console.log(`row: ${i}, col: ${rows.length - 1 - i - startIndex}, val: ${rows[i][rows.length - 1 - i - startIndex]}`);
        // console.log(`row: ${i + startIndex}, col: ${rows.length - i - 1}, val: ${rows[i + startIndex][rows.length - i - 1]}`);
        return [mem[0] + rows[i][rows.length - 1 - i - startIndex], 
                mem[1] + rows[i + startIndex][rows.length - i - 1]];
      }, [0, 0]);
      return _(conflicts).any(function(i) {
        return i > 1;
      });
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var rows = this.rows();
      return _.reduce(rows, (mem, row, rowIndex) => {
        //sum i,i elements
        return mem ? mem : this.hasMinorDiagonalConflictAt(rowIndex);
      }, false);
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
