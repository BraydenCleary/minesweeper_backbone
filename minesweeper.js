var app = app || {};

app.vent = _.extend({}, Backbone.Events);

app.Board = Backbone.View.extend({
  el: '.board',

  initialize: function(){
    this.totalTileCount = this.options.rowLength * this.options.rowLength
    this.setNeighboringTileData()
    app.vent.on("tileClicked", this.tileClicked, this)
  },

  tileClicked: function(cid){
    var tile = this.collection.get(cid)
    if (tile.get("type") == "mine"){
      alert("you lose!")
    }
    else if (tile.get("type") == "land"){
      if (tile.get("mineCount") == 0){
        _.each(tile.get("neighboringInfo").get("neighboringCids"), function(cid){
          app.vent.trigger("tileClicked:" + cid, cid);
        });
      }
    }
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
      var neighboringCids = [];
      _.each(neighboringTiles, function(neighboringTile){
        neighboringInfo.set(_.keys(neighboringTile)[0], this.collection.at(_.values(neighboringTile)[0]).get("type"))
        neighboringCids.push(this.collection.at(_.values(neighboringTile)[0]).cid)
      }, this)

      neighboringInfo.set("neighboringCids", neighboringCids)
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
    "click": "triggerClick"
  },

  render: function(){
    this.$el.html(this.template(this.model.toJSON()))
    return this;
  },

  initialize: function(){
    app.vent.on("tileClicked:" + this.model.cid, this.triggerClick, this)
  },

  triggerClick: function(cid){
    app.vent.trigger("tileClicked", this.model.cid)
    if (cid == this.model.cid){
      this.flipTile()
    }
  },

  // tileClicked: function(cid){
  //   if (cid == this.model.cid){
  //     this.flipTile()
  //   }
  // },

  flipTile: function(){
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


