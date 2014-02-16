app.Tile = Backbone.Model.extend({
  defaults: {
    state: "untouched"
  },

  mineCount: function(){
    return _.filter(_.values(this.get("neighboringInfo").attributes), function(type){
      return type == "mine";
    }).length
  },

  flip: function(){
    if (this.get("type") == "mine"){
      this.set("state", "exploded");
      return false;
    } else {
      this.set("state", "flipped");
      return true;
    }
  },

  flag: function(){
    if (this.get("state") == "flagged"){
      this.set("state", "untouched");
    } else {
      this.set("state", "flagged");
    }
  },

  alreadyFlipped: function(){
    return this.get("state") == "flipped";
  },

  noAdjacentMines: function(){
    return this.get("mineCount") == 0
  }
})
