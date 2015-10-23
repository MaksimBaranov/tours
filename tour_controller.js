angular.module('tours').controller('TourController', function($scope, $routeParams){
  console.log($routeParams.slug);

  angular.forEach(JSON.parse(localStorage['tours']), function(tour) {
    if ($routeParams.slug == tour.slug) { $scope.tour = tour; }
  })
});
