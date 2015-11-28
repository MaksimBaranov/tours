angular.module('toursModule').controller('TourController', function($scope, $routeParams, Tour){
  $scope.tour = Tour.get({objectId: $routeParams.id})

  $scope.imageTourRender = function(tour){
    return tour.image != undefined ? tour.image.url : '/assets/img/foto_not_found.jpeg'
  }
});
