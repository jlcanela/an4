Ember.Application.initializer({
    name: 'authentication',
    initialize: function(container, application) {
        Ember.SimpleAuth.setup(container, application, {
            routeAfterLogin: 'stars'
        });
    }
});

var An4 = Ember.Application.create({
        LOG_ACTIVE_GENERATION: true
});

An4.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin);

//Ember.run.backburner.DEBUG = true;

An4.LoginController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin);

An4.Router.map(function() {
    this.route('login');
    this.route('signup');
    this.route('index', {path: "/"});
	this.resource("stars", { path: "/stars" }, function() {
		this.route('star', { path: ':star_id' });
	});
});

An4.IndexRoute = Ember.Route.extend({
	  /*beforeModel: function() {
	    this.transitionTo('stars');
	  }*/
    afterModel: function() {
        console.log(this.get('controller.currentMessage'));
    }
	});

An4.SignupRoute = Ember.Route.extend({
    actions: {
        signup: function(){
            var username = this.get('identification');
            var email = this.get('email');
            var password = this.get('password');
            var t = this;
            $.ajax({
                type: 'POST',
                url: 'api/signup',
                data: JSON.stringify( { username: username, email: email, password: password}),
                success: function(res, status, xhr) {
                    t.flashMessage('Please click on the registration link you will receive by email!');
                    console.log(t.get('controller.currentMessage'));
                    t.transitionTo('index');
                },
                error: function(xhr, status, err) {
                    console.log('failed ' + command + ' with status' + status);
                    console.log(err);
                }
            })
        }
    }
});

An4.SignupController = Ember.Controller.extend({

});

An4.ApplicationAdapter = DS.RESTAdapter.extend({
	  host: 'http://'+host,
	  namespace: 'api'
	});

An4.Star = DS.Model.extend({
	  name       : DS.attr(),
	  x          : DS.attr(),
	  y          : DS.attr(),
	  shuttles   : DS.attr(),
	  pop        : DS.attr(),
	  tech       : DS.attr(),
	  commander  : DS.attr(),
	  color      : DS.attr(),
	  owned      : function() {
	    var o = this.get('commander') == 'Anonymous';
	    return o;
	  }.property('commander'),
      visible      : function(a) {
        var o = this.get('commander') == 'Anonymous';
        return o;
      }.property('x', 'y', 'commander'),
      distance: function(other){
        var dx = other.get('x') - this.get('x');
        var dy = other.get('y') - this.get('y');
        return dx * dx + dy * dy;
      }

});

An4.StarsRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin).extend({
    connectOutlets: function(router, context) {
    console.log('connectOutlets');
        router.get('starsStarController').connectOutlet('test1');
      },
	model: function(){
	    var s = this.store.findAll('star');
        var contentObserver=function() {
          var currentStar = this.get('controller.currentStar');
          console.log('observer:');
          console.log(currentStar);
        }.observes(s);

		return s;
	}
});

/*
An4.StarIndexRoute = Ember.Route.extend({
});*/

An4.StarRoute = Ember.Route.extend({
   /* beforeModel: function(transition){
      console.log('after model');
    },*/
	model: function(id){
		return this.store.find('star', id);
	}
});

var thes = 0;

An4.StarsController =  Ember.ArrayController.extend({
	needs: "starsStar",
	selectedStarBinding: 'controllers.starsStar.model',
	currentStar: function(){
        var cs = this.get('controllers.starsStar.model'); // instance of App.PostController
        return cs;
      }.property('controllers.starsStar.model'),
    distance: function(a, b){
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        return dx * dx + dy * dy;
    },
    onUpdateStar: function(e) {
       this.store.find('star', e.star.id).then(function(star) {
          star.set('shuttles', e.star.shuttles);
          star.set('pop', e.star.pop);
          star.set('tech', e.star.tech);
          star.set('commander', e.star.commander);
          star.set('color', e.star.color);
       }, function(value) {
         // failure
       });
    },
    onNotifyMessage: function(msg) {
        alert(msg.msg);
    },
    event: function(ev){
       eval("var e="+ev);
       if (e.event == 'develop') {
          this.onDevelop(e);
       } else if (e.event == 'update-star') {
          this.onUpdateStar(e);
       } else if (e.event == 'notify-message') {
          this.onNotifyMessage(e);
       }
    },
    init: function() {
        var con = new WebSocket("ws://"+host+"/api/event");
        var t = this;
        con.onmessage = function(msg) {
          t.event(msg.data);
        }
    },
    sendCommand: function(command) {
       return function(star){
            $.ajax({
                type: 'POST',
                url: 'api/event',
                data: JSON.stringify( { event: command, star: star._data.name}),
                success: function(res, status, xhr) {
                },
                error: function(xhr, status, err) {
                    console.log('failed ' + command + ' with status' + status);
                    console.log(err);
                }
            })
            console.log('develop star' + star);
        }
    },
    actions: {
        selectStar: function(star){
            this.propertyWillChange("currentStar");
            this.transitionToRoute("/stars/" + star.id);
        },
        develop: function(star){
            this.sendCommand('develop')(star);
        },
        loot: function(star){
            this.sendCommand('loot')(star);
        },
        produce: function(star){
            this.sendCommand('produce')(star);
        },
        unselectStar: function(){
            this.propertyWillChange("currentStar");
            this.set('selectedStar', null);
            this.propertyDidChange("currentStar");
            this.transitionToRoute("stars");
        }
    }
});

An4.StarsStarController = Ember.ObjectController.extend({
    needs:["stars", "starsStar"],
    localStars: function(){
        var current = this.get('model');

        console.log(current);
        var stars =  this.get('controllers.stars.model');

        function isLocal(star, index, array) {
            return star.distance(current) < 30;
        }

        return stars.filter(isLocal);
    }.property('controllers.starsStar.model'),
    actions: {
        attack: function(data){
            data.commander = "";
        }
    }
});

An4.RadarView = Ember.View.create({
	  templateName: 'radar',
	  starsBinding: 'controller.model.content',
	  starBinding: 'controller.currentStar',
	  didInsertElement: function() {
		  var s = Snap("#svgradar").attr({
			  fill: "red"
		  });
		  var controller = this.get('controller');
		  var model = controller.get('model');
          var zoom = 100 / Math.sqrt(50);

          var t = this;

          var displaySector = function(){

              var star = t.get('controller.currentStar');

              function isLocal(st, index, array) {
                  return st.distance(star) < 30;
              }

              var stars = model.get('content').filter(isLocal);
              var ox = stars.get(0).get('x');
              var oy = stars.get(0).get('y');


              var toremove = s.selectAll("*");
              toremove.forEach(function(st) {
                st.remove();
              })

              if (star) {
                var x = star.get('x');// - ox;
                var y = star.get('y');// - oy;

                ox = x;
                oy = y;

                s.circle( ((x-ox) * 4 + 50) + "%", ((y-oy) * 4 + 50) + "%", zoom * 7);
              }

              stars.forEach(function(star) {
                  s.circle(((star._data.x - ox) * 4 + 50) + "%" ,  ((star._data.y - oy) * 4 + 50) + "%", "1%").attr({
                      fill: star._data.color
                  });
              });
          }

          displaySector(controller.get("currentStar"));
          var a=this;
          controller.addObserver('currentStar', a, displaySector);

	 }
});


