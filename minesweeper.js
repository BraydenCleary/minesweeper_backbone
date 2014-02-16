var app = app || {};

app.resetGame = function(rowlength, minecount){
  $('.board').empty();
  app.tilesCollection.reset();

  var rowLength = rowLength || parseInt($('#row-length').val());
  var mineCount = mineCount || parseInt($('#mine-count').val());
  var totalTiles = rowLength * rowLength;
  var landCount = totalTiles - mineCount;

  _.times(landCount, function(){
    app.tilesCollection.add(new app.Tile({type: "land"}));
  })

  _.times(mineCount, function(){
    app.tilesCollection.add(new app.Tile({type: "mine"}));
  })

  board = new app.Board({
    collection: app.tilesCollection.reset(app.tilesCollection.shuffle()),
    rowLength: rowLength,
    landCount: landCount,
    mineCount: mineCount
  });

  board.render();
  $('.tile').css('width', 100/rowLength + "%")
}

app.resetToDefaults = function(){
  app.resetGame(8,10);
  $('#row-length').val(8);
  $('#mine-count').val(10);
}

app.validateRowLength = function(){
  var rowLength = parseInt($('#row-length').val());
  if (0 < rowLength && rowLength < 56){
    return true
  } else {
    alert('Row length must be between 0 and 55')
    var rowLength = $('#row-length').val(8);
    app.resetGame();
  }
}

app.validateMineCount = function(){
  var rowLength = parseInt($('#row-length').val());
  var mineCount = parseInt($('#mine-count').val())
  var totalTiles = rowLength * rowLength
  if (totalTiles < mineCount){
    alert('You can have more mines than total tiles.')
    var rowLength = $('#mine-count').val(10);
    app.resetGame();
  }
}


$(function(){
  app.vent = _.extend({}, Backbone.Events);

  app.tilesCollection = new Backbone.Collection();

  $('#row-length, #mine-count').change(function(){
    app.validateRowLength();
    app.validateMineCount();
    app.resetGame();
  })

  $('#reset').click(function(){
    app.resetToDefaults();
  })

  $('#check-board').click(function(){
    app.vent.trigger('checkBoard')
  })

  app.resetGame();
})


