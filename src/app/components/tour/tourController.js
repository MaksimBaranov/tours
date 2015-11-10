angular.module('toursModule').controller('TourController', function($scope, $routeParams, $resource){

  var Tour = $resource(
 	'https://api.parse.com/1/classes/tours/:objectId?include=hotel',
 	{objectId: '@objectId'}
  )

  $scope.tour = Tour.get({objectId: $routeParams.id})
});
