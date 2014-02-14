var app = app || {};

app.Board = Backbone.View.extend({
  el: '.board',
  indicesOfMines: [],

  initialize: function(){
    //call function
  },

  render: function(){
    this.collection.each(function(tile){
      this.renderTile(tile);
    }, this);
  },

  renderTile: function(tile){
    var tileView = new app.TileView({
      model: tile
    });
    this.$el.append(tileView.render().el)
  },

  gatherIndicesOfMines: function(){
    this.collection.each(function(tile, index){
      if (tile.get("type") == "mine") {
        this.indicesOfMines.push(index)
      }
    }, this);
    return this.indicesOfMines
  },

  setSomething: function(){
    this.collection.each(function(tile, index){

    })
  }
})

//hardcoding in 8x8
//Indicies I care about for each tile 1 +8 -1 +9 +7 -9 -8 -7

/* var neighboringInfo = Backbone.Model({
    topLeft: 'mine',
    top: 'land',
    topRight: 'land',
    left: 'land',
    right: 'land'
    bottomLeft: 'mine',
    bottom: 'land',
    bottomRight: 'land'
// });
*/

app.TileView = Backbone.View.extend({
  tagName: 'div',
  className: 'tile',
  template: _.template("<div class='<%= state %> <%= type %>'></div>"),

  events: {
    "click": "tileClicked"
  },

  render: function(){
    this.$el.html(this.template(this.model.toJSON()))
    return this;
  },

  tileClicked: function(){
    if (this.model.get("type") == "mine"){
      this.model.set("state", "exploded")
    } else {
      this.model.set("state", "flipped")
    }
    this.render();
  }
})

app.Tile = Backbone.Model.extend({
  defaults: {
    state: "untouched"
  }
})

app.tilesCollection = new Backbone.Collection();

$(function(){
  _.times(54, function(){
    app.tilesCollection.add(new app.Tile({type: "land"}))
  })


  _.times(10, function(){
    app.tilesCollection.add(new app.Tile({type: "mine"}))
  })

  board = new app.Board({collection: app.tilesCollection.reset(app.tilesCollection.shuffle()), rowLength: 8})
  board.render();
})


