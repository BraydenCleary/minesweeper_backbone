var app = app || {};

app.resetGame = function(){
  $('.board').empty();
  app.tilesCollection.reset()

  var rowLength = parseInt($('#row-length').val());
  var mineCount = parseInt($('#mine-count').val())
  var totalTiles = rowLength * rowLength
  var landCount = totalTiles - mineCount

  _.times(landCount, function(){
    app.tilesCollection.add(new app.Tile({type: "land"}));
  })

  _.times(mineCount, function(){
    app.tilesCollection.add(new app.Tile({type: "mine"}));
  })

  board = new app.Board({collection: app.tilesCollection.reset(app.tilesCollection.shuffle()), rowLength: rowLength});
  board.render();
  $('.tile').css('width', 100/rowLength + "%")
}


$(function(){
  app.vent = _.extend({}, Backbone.Events);

  app.tilesCollection = new Backbone.Collection();

  $('#row-length, #mine-count').on('change', function(){
    app.resetGame()
  })

  app.resetGame();
})


