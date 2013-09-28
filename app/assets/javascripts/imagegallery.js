
var ImageGallery = {};

ImageGallery.vent = _.extend({}, Backbone.Events);


ImageGallery.Image = Backbone.Model.extend({
});
  
ImageGallery.ImageCollection = Backbone.Collection.extend({
  model: ImageGallery.Image
});


ImageGallery.AddImageView = Backbone.View.extend({
    
  id: "add-image-form",
  
  template: "#add-image-template",
  
  events: {
    "change #name": "nameChanged",
    "change #description": "descriptionChanged",
    "input #url": "urlChanged",
    "click #save": "saveImage"
  },
  
  nameChanged: function(e) {
    var value = $(e.currentTarget).val();
    this.model.set({name: value});
  },
  
  
  descriptionChanged: function(e) {
    var value = $(e.currentTarget).val();
    this.model.set({description: value});
  },
  
  urlChanged: function(e) {      
    var value = $(e.currentTarget).val();
    this.model.set({url: value});
    this.$("#preview").attr("src", value);
  },
  
  saveImage: function(e) {
    e.preventDefault();
    var name = this.model.get("name");
    var desc = this.model.get("description");
    var url = this.model.get("url");
    
    var message = "Name: " + name + "\n";
    message += "Description: " + desc + "\n";
    message += "URL: " + url;
    
    this.collection.add(this.model);
    
  },
  
  render: function() {
    var html = $(this.template).tmpl();
    $(this.el).html(html);
  }
  
});

ImageGallery.ImageListView = Backbone.View.extend({
  tagName: "ul",
  template: "#image-preview-template",
  
  events: {
    "click a": "imageClicked",
  },
  
  imageClicked: function(e) {
    e.preventDefault();
    var id = $(e.currentTarget).data("id");
    var image = this.collection.get(id);
    ImageGallery.vent.trigger("image:selected", image);
    
  },
  
  initialize: function() {
    _.bindAll(this, "renderImage");
    this.template = $(this.template);
    this.collection.bind("add", this.renderImage, this);
  },
  
  renderImage: function(image) {
    var html = this.template.tmpl(image.toJSON());
    $(this.el).prepend(html);
  }, 
  
  render: function() {
    this.collection.each(this.renderImage)
  }

});


ImageGallery.addImage = function(images) {
  var image = new ImageGallery.Image();
  var addImageView = new ImageGallery.AddImageView({
    model: image,
    collection: images
  });
  
  addImageView.render();
  
  $("#main").html(addImageView.el);  
}


 // JQuery Dom ready Callback 
$(function() { 
  
  var imageData = [
    {
      id: 1,
      url: "assets/mountain.jpeg",
      name: "A mountain",
      description: "Mountain with grassy hill and tree"
     
    },
    
    {
      id: 2,
      url: "assets/island.jpeg",
      name: "some islands",
      description: "Some islands at sunset"
    },
    
    {
      id: 3,
      url: "assets/tools.jpeg",
      name: "rusty wrench",
      description: "closup of a wrench"
    },
    
    {
      id: 4,
      url: "assets/flower.jpeg",
      name: "some flower",
      description: "a purple flower"
    }       
  
  ];  
    
  var images = new ImageGallery.ImageCollection(imageData);
    
  ImageGallery.addImage(images);  
  images.bind("add", function() {
    ImageGallery.addImage(images);
  });  
  
  ImageGallery.vent.bind("image:selected", function(image) {
    alert(image.get("name"));
  });
  
  var imageListView = new ImageGallery.ImageListView({
    collection: images
  });
  imageListView.render();
  
  $("#image-list").html(imageListView.el);
  
});


