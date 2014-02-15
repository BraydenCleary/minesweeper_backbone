var app = app || {};

app.Board = Backbone.View.extend({
  el: '.board',
  indicesOfMines: [],

  initialize: function(){
    this.totalTileCount = this.options.rowLength * this.options.rowLength
    this.setNeighboringTileData()
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

  setNeighboringTileData: function(){
    this.collection.each(function(tile, index){
      neighboringTiles = [
        {topLeft: index-this.options.rowLength-1},
        {top: index-this.options.rowLength},
        {topRight: index-this.options.rowLength+1},
        {left: index-1},
        {right: index+1},
        {bottomLeft: index+this.options.rowLength -1},
        {bottom: index+this.options.rowLength},
        {bottomRight: index+this.options.rowLength +1}
      ]
      neighboringTiles = _.filter(neighboringTiles, function(neighboringTile){
        neighboringIndex = _.values(neighboringTile)[0]
        if (index % this.options.rowLength == 0){
          return 0 <= neighboringIndex  &&  neighboringIndex < this.totalTileCount && (neighboringIndex+1) % this.options.rowLength != 0
        } else if ((index+1) % this.options.rowLength == 0){
          return 0 <= neighboringIndex  &&  neighboringIndex < this.totalTileCount && neighboringIndex % this.options.rowLength != 0
        } else {
          return 0 <= neighboringIndex  &&  neighboringIndex < this.totalTileCount
        }
      }, this)

      var neighboringInfo = new Backbone.Model({})
      _.each(neighboringTiles, function(neighboringTile){
        neighboringInfo.set(_.keys(neighboringTile)[0], this.collection.at(_.values(neighboringTile)[0]).get("type"))
      }, this)

      tile.set("neighboringInfo", neighboringInfo)
      tile.set("mineCount", tile.mineCount())
    }, this)
  }
})

app.TileView = Backbone.View.extend({
  tagName: 'div',
  className: 'tile',
  template: _.template("<div class='<%= state %> <%= type %>'><%= mineCount %></div>"),

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
  },

  mineCount: function(){
    return _.filter(_.values(this.get("neighboringInfo").attributes), function(type){
      return type == "mine"
    }).length
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


