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
  },

  triggerClick: function(){
    app.vent.trigger("tileClicked", this.model.cid);
  }
})
