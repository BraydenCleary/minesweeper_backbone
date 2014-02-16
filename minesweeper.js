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

  board = new app.Board({collection: app.tilesCollection.reset(app.tilesCollection.shuffle()), rowLength: 8});
  board.render();
})


