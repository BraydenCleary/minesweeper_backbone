var app = app || {};

app.Board = Backbone.View.extend({
  el: '.board',

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
  }
})

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

  board = new app.Board({collection: app.tilesCollection.reset(app.tilesCollection.shuffle())})
  board.render();
})


