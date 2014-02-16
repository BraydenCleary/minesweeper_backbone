app.TileView = Backbone.View.extend({
  tagName: 'div',
  className: 'tile',
  template: _.template("<div class='<%= state %> <%= type %>'><%= mineCount %></div>"),

  events: {
    "click": "triggerClick"
  },

  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  initialize: function(){
    this.listenTo(this.model, 'change', this.render);
    //TODO: refactor
    app.vent.on("winner", this.gameOver)
    app.vent.on( "loser", this.gameOver)
  },

  triggerClick: function(e){
    app.vent.trigger("tileClicked", this.model.cid, e.altKey);
  },

  gameOver: function(){
    this.unbind();
  }
})
