var servicesModule = angular.module('services', ['ngResource']);

servicesModule.factory('Radar', ['$resource', function($resource) {
  return $resource('/api/radar', {}, {
          'query': {method: 'GET', isArray: true}
      });
}]);

var radarModule = angular.module('radar', ['ui.bootstrap', 'services']);

radarModule.controller('RadarController', ['$scope', 'Radar',
  function($scope, Radar) {

    var stars = Radar.query();

    var zoomMinValue = 2;

    var zoomMaxValue = 20;

    var defaultCenterX = 215;

    var defaultCenterY = 215;

    $scope.commander = { name: 'Arshaan' };
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
      zoom: 10,
      r: 20,
      displayText: true,
      stars: stars,
      selected: stars[0]
    };

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

    $scope.select = function(star) {
      $scope.radar.selected = star;
    }

    $scope.selectAndCenter = function(star) {
      $scope.radar.centerX = defaultCenterX - star.x * $scope.radar.zoom ;
      $scope.radar.centerY = defaultCenterY - star.y * $scope.radar.zoom - $scope.radar.offsetY;
      $scope.select(star);
    }

  }]
);

var app = angular.module('app', ['radar']);
