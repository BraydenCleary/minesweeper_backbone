var app = app || {};

$(function(){
  app.vent = _.extend({}, Backbone.Events);

  app.tilesCollection = new Backbone.Collection();

  _.times(54, function(){
    app.tilesCollection.add(new app.Tile({type: "land"}));
  })


  _.times(10, function(){
    app.tilesCollection.add(new app.Tile({type: "mine"}));
  })

  $('#row-length').on('change', function(){
    $('.board').empty();
    app.tilesCollection.reset()

    var rowLength = parseInt($('#row-length').val());
    var totalTiles = rowLength * rowLength
    var landCount = totalTiles - 10

    _.times(landCount, function(){
      app.tilesCollection.add(new app.Tile({type: "land"}));
    })

    _.times(10, function(){
      app.tilesCollection.add(new app.Tile({type: "mine"}));
    })

    board = new app.Board({collection: app.tilesCollection.reset(app.tilesCollection.shuffle()), rowLength: rowLength});
    board.render();
    $('.tile').css('width', 100/rowLength + "%")
  })

  board = new app.Board({collection: app.tilesCollection.reset(app.tilesCollection.shuffle()), rowLength: parseInt($('#row-length').val())});
  board.render();
})


