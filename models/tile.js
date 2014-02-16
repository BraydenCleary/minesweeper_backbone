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
    } else {
      this.set("state", "flipped");
    }
  }
})
