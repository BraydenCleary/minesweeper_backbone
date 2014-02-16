app.Board = Backbone.View.extend({
  el: '.board',

  flippedCount: 0,

  initialize: function(){
    this.totalTileCount = this.options.rowLength * this.options.rowLength;
    this.setNeighboringTileData();
    app.vent.on("tileClicked", this.tileClicked, this);
    app.vent.on("checkBoard", this.checkBoard, this);
  },

  tileClicked: function(cid, altKeyPressed){
    var tile = this.collection.get(cid)
    if (tile.alreadyFlipped()){
      return false;
    } else {
      if (altKeyPressed){
        this.handleAltClick(tile);
      } else {
        this.handleStandardClick(tile);
      }
    }
  },

  handleAltClick: function(tile){
    tile.flag();
    this.flaggedCount += 1;
  },

  handleStandardClick: function(tile){
    if (tile.flip()){
      this.flippedCount += 1;
      if (this.isWinner()){
        return
      } else {
        if (tile.noAdjacentMines()){
          this.clickAdjacentmines(tile);
        }
      }
    } else{
      this.youLose();
    }
  },

  clickAdjacentmines: function(tile){
    _.each(tile.get("neighboringInfo").get("neighboringCids"), function(cid){
      this.tileClicked(cid);
    }, this);
  },

  checkBoard: function(){
    if (this.flaggedMineCount() == this.options.mineCount){
      this.youWin();
    } else{
      this.youLose();
    }
  },

  flaggedMineCount: function(){
    return this.collection.where({type: "mine", state: "flagged"}).length
  },

  render: function(){
    this.collection.each(function(tile){
      this.renderTile(tile);
    }, this);
  },

  isWinner: function(){
    if (this.flippedCount == this.options.landCount) {
      this.youWin();
      return true;
    }
  },

  youLose: function(){
    alert('You lose!');
    app.vent.trigger("loser");
    this.$el.prepend("<div class='loser'>You lose. Try again!</div>")
  },

  youWin: function(){
    alert('You win!');
    app.vent.trigger("winner");
    this.$el.prepend("<div class='winner'>You win!</div>")
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
