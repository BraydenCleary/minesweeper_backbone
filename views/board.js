app.Board = Backbone.View.extend({
  el: '.board',

  initialize: function(){
    this.totalTileCount = this.options.rowLength * this.options.rowLength;
    this.setNeighboringTileData();
    app.vent.on("tileClicked", this.tileClicked, this);
  },

  tileClicked: function(cid){
    var tile = this.collection.get(cid)
    if (tile.get("state") == "flipped"){
      return false;
    } else{
      tile.flip();
      if (tile.get("mineCount") == 0){
        _.each(tile.get("neighboringInfo").get("neighboringCids"), function(cid){
          this.tileClicked(cid);
        }, this);
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
    this.$el.append(tileView.render().el);
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

      var neighboringInfo = new Backbone.Model({});
      var neighboringCids = [];
      _.each(neighboringTiles, function(neighboringTile){
        neighboringInfo.set(_.keys(neighboringTile)[0], this.collection.at(_.values(neighboringTile)[0]).get("type"));
        neighboringCids.push(this.collection.at(_.values(neighboringTile)[0]).cid);
      }, this)

      neighboringInfo.set("neighboringCids", neighboringCids);
      tile.set("neighboringInfo", neighboringInfo);
      tile.set("mineCount", tile.mineCount());
    }, this)
  }
})
