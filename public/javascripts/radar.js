var servicesModule = angular.module('services', ['ngResource']);

servicesModule.factory('Radar', ['$resource', function($resource) {
  return $resource('/api/radar', {}, {
          'query': {method: 'GET', isArray: true}
      });
}]);

var radarModule = angular.module('radar', ['ui.bootstrap', 'services']);

radarModule.controller('RadarController', ['$scope', 'Radar',
  function($scope, Radar) {

    function isStarOwned(star) {
      if (star) {
        return (star.commander == $scope.commander.name);
      } else {
        return false;
      }
    }

    function owned(element, index, array) {
      return isStarOwned(element);
    }

    function cx(star) {
      if (star) {
        return $scope.radar.centerX + star.x * $scope.radar.zoom;
      } else {
        return 0;
      }
    }

    function cy(star) {
      if (star) {
        return $scope.radar.centerY + star.y * $scope.radar.zoom + $scope.radar.offsetY;
      } else {
        return 0;
      }
    }

    var stars = Radar.query(function(x) {
      $scope.select(stars.filter(owned)[0]);
    });

    var zoomMinValue = 2;

    var zoomMaxValue = 20;

    var defaultCenterX = 215;

    var defaultCenterY = 215;

    var maxPathLengthSqr = 50;

    $scope.commander = { name: 'Anonymous' };

    $scope.radar = {
      sizeX: 450,
      sizeY: 460,
      centerX: defaultCenterX,
      centerY: defaultCenterY,
      offsetY: 20,
      offsetNameX: -20,
      offsetNameY: 20,
      offsetDefenseX: 5,
      offsetDefenseY: -5,
      zoom: 20,
      r: 20,
      displayText: true,
      stars: stars,
    };

    $scope.u = {
      cx: cx,
      cy: cy,
      radar : {
        width : function() {
          return $scope.radar.sizeX;
        },
        height : function() {
          return $scope.radar.sizeY;
        } 
      },
      star: {
        scaleX: function() {
          return $scope.radar.zoom/1.5;
        },
        scaleY: function() {
          return $scope.radar.zoom/1.5;
        }
      },
      selectedStar: {
        isOwned: function() {
          return isStarOwned($scope.radar.selected);
        },
        show: function() {
          if ($scope.radar.selected)  {
            $scope.radar.selected.governor == $scope.commander.name;  
          } else {
            true;
          }
        },
        cx: function() {  
          return cx($scope.radar.selected);
        },
        cy: function() {
          return cy($scope.radar.selected);
        }
      }, 
      targetedStar: {
        isOwned: function() {
          return isStarOwned($scope.radar.targeted);
        },
        cx: function() {  
          return cx($scope.radar.targeted);
        },
        cy: function() {
          return cy($scope.radar.targeted);
        }
      }
    }

    $scope.updateZoom = function() {
      if ($scope.radar.zoom > 5) {
        $scope.radar.displayText = true;
      } else {
        $scope.radar.displayText = false;
      }
    }

    $scope.scrollUp = function() {
      $scope.radar.centerY =  $scope.radar.centerY - 1;
    }

    $scope.scrollDown = function() {
      $scope.radar.centerY =  $scope.radar.centerY + 1;
    }

    $scope.scrollLeft = function() {
      $scope.radar.centerX =  $scope.radar.centerX - 1;
    }

    $scope.scrollRight = function() {
      $scope.radar.centerX =  $scope.radar.centerX + 1;
    }

    $scope.zoomMinValue = 3;

    $scope.zoomMaxValue = 20;

    $scope.zoomP = function() {
      if ($scope.radar.zoom < zoomMaxValue) {
        $scope.radar.zoom =  $scope.radar.zoom + 1;
      } else {
        $scope.radar.zoom = zoomMaxValue;
      }
      $scope.updateZoom();
    }

    $scope.zoomM = function() {
      if ($scope.radar.zoom > zoomMinValue) {
        $scope.radar.zoom =  $scope.radar.zoom - 1;
      } else {
        $scope.radar.zoom = zoomMinValue;
      }
      $scope.updateZoom();
    }

    $scope.target = function(star) {
      var dx = star.x - $scope.radar.selected.x
      var dy = star.y - $scope.radar.selected.y

      if ((dx * dx + dy * dy) < maxPathLengthSqr ) {
        $scope.radar.targeted = star;
      }
    }

    $scope.select = function(star) {
      $scope.radar.centerX = defaultCenterX - star.x * $scope.radar.zoom ;
      $scope.radar.centerY = defaultCenterY - star.y * $scope.radar.zoom - $scope.radar.offsetY;
      //$scope.radar.targeted = star;
      $scope.radar.selected = star;
    }

    $scope.lootActive = function(star) {
      return owned(star, 0, []) && (star.pop > 0);
    }

    $scope.loot = function(star) {
      star.pop = star.pop - 1;
      star.defense = star.defense + 3;
    }

    $scope.developActive = function(star) {
      return owned(star, 0, []) && (star.defense > 2);
    }

    $scope.develop = function(star) {
      star.pop = star.pop + 1;
      star.defense = star.defense - 3;
    }

    $scope.attackActive = function(star) {
      return owned($scope.radar.selected, 0, [])
        && ($scope.radar.selected.defense > 0)
        && (owned(star, 0, []) == false);
    }

    $scope.attack = function(star) {

    }

  }]
);

var app = angular.module('app', ['radar']);

angular.forEach([ 'x1', 'y1', 'x', 'y', 'cx', 'cy', 'r', 'width', 'height', 'fill'], function(name) {
  var ngName = 'ng' + name[0].toUpperCase() + name.slice(1);
  app.directive(ngName, function() {
    return function(scope, element, attrs) {
      attrs.$observe(ngName, function(value) {
        attrs.$set(name, value);
      })
    };
  });
});

function ShowTooltip(evt, mouseovertext, star) {
    var tooltip = document.getElementById('ctooltip');
    var svg = document.getElementById('radarsvg');
    var rect = svg.getBoundingClientRect();

    console.log(star.tgt);
    tooltip.setAttribute("x", evt.clientX + 11 - rect.left);
    tooltip.setAttribute("y", evt.clientY + 27 - rect.top);
    tooltip.firstChild.data = mouseovertext;
    tooltip.setAttribute("visibility", "visible");
}

function HideTooltip(evt) {
    var tooltip = document.getElementById('ctooltip');
    tooltip.setAttribute("visibility", "hidden");
}
