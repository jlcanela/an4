var radarModule = angular.module('radar', ['ui.bootstrap']);

radarModule.controller('RadarController',
  function($scope) {

    var stars = [
    { name: 'center', x: 0, y: 0, defense: 5, pop: 1, size: 1, color: 'red'},
    { name: 'top', x: 0, y: -20, defense: 1, pop: 2, size: 2, color: 'yellow'},
    { name: 'bottom', x: 0, y: 20, defense: 2, pop: 4, size: 3, color: 'blue'},
    { name: 'left', x: -20, y: 0, defense: 3, pop: 8, size: 4, color: 'black'},
    { name: 'right', x: 20, y: 0, defense: 4, pop: 200, size: 10, color: 'pink'},
    { name: 'canopi', x: 2, y: 0, defense: 4, pop: 3, size: 10, color: 'green'},
    { name: 'extrem', x: 100, y: 0, defense: 4, pop: 3, size: 10, color: 'maroon'}
    ];

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

  }
);

var app = angular.module('app', ['radar']);
