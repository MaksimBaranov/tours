angular.module('toursModule').controller('ToursController', function($scope, $resource, Tour, Country, Place){
  $scope.pageName = 'Tours';
  $scope.filter = {};

  $scope.tours = Tour.query();
  $scope.countries = Country.query();
  $scope.places = Place.query();

  $scope.imageTourRender = function(tour){
    return tour.image ? tour.image.url : '/assets/img/foto_not_found.jpeg'
  }
});
