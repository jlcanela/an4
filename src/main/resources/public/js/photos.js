var EME = Ember.Application.create({
	template: "emeapp"
});

EME.store = DS.Store.create({
    adapter: "DS.RESTAdapter",
    revision: 11
});

EME.Photo = DS.Model.extend({
    imageTitle: DS.attr('string'),
    imageUrl: DS.attr('string')
});

EME.Router.map(function() {
    this.route("index", {path: "/"});
    this.resource("photos", {path: "/photos"}, function() {
        this.route("selectedPhoto", {path: ":photo_id"})
    });
});

EME.IndexRoute = Ember.Route.extend({
    redirect: function() {
        this.transitionTo('photos');
    }
});

var photos = [
              { "id": "1", "image_title": "Bird", "image_url": "img/bird.jpg"},
              { "id": "2", "image_title": "Dragonfly", "image_url": "img/dragonfly.jpg"},
              { "id": "3", "image_title": "Fly", "image_url": "img/fly.jpg"},
              { "id": "4", "image_title": "Frog", "image_url": "img/frog.jpg"},
              { "id": "5", "image_title": "Lizard", "image_url": "img/lizard.jpg"},
              { "id": "6", "image_title": "Mountain 1", "image_url": "img/mountain.jpg"},
              { "id": "7", "image_title": "Mountain 2", "image_url": "img/mountain2.jpg"},
              { "id": "8", "image_title": "Panorama", "image_url": "img/panorama.jpg"},
              { "id": "9", "image_title": "Sheep", "image_url": "img/sheep.jpg"},
              { "id": "10", "image_title": "Waterfall", "image_url": "img/waterfall.jpg"}
          ];

EME.PhotosRoute = Ember.Route.extend({
    model: function() {
        return { "photos": photos };
    }
});

/*EME.PhotoThumbnailView = Ember.View.extend({
    tagName: 'img',
    attributeBindings: ['src'],
    classNames: ['thumbnailItem'],
    classNameBindings: 'isSelected',

    isSelected: function() {
        return this.get('content.id') === 
this.get('controller.controllers.photosSelectedPhoto.content.id');
    }.property('controller.controllers.photosSelectedPhoto.content', 'content')
});

EME.PhotosController = Ember.ArrayController.extend({
    needs: ['photosSelectedPhoto'],
});

EME.PhotosSelectedPhotoController = Ember.ObjectController.extend({});

EME.PhotoControlsController = Ember.Controller.extend({
    needs: ['photos', 'photosSelectedPhoto'],

    playSlideshow: function() {
        console.log('playSlideshow');
        var controller = this;
        controller.nextPhoto();
        this.set('slideshowTimerId', setInterval(function() {
            Ember.run(function() {
                controller.nextPhoto();
            });
        }, 4000));
    },

    stopSlideshow: function() {
        console.log('stopSlideshow');
        clearInterval(this.get('slideshowTimerId'));
        this.set('slideshowTimerId', null);
    },

    nextPhoto: function() {
      console.log('nextPhoto');
      this.get('controllers.photos').nextPhoto();
    },

    prevPhoto: function() {
        console.log('prevPhoto');
        this.get('controllers.photos').prevPhoto();
    }


}); 
*/

