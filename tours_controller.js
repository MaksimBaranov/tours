angular.module('tours').controller('ToursController', function($scope, $location){
  $scope.pageName = 'Tours';
  $scope.filter = {};
  $scope.tours = allTours;
  $scope.countries = allCountries;
});
