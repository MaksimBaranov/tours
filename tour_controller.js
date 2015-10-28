angular.module('tours').controller('TourController', function($scope, $routeParams, $resource){

  var Tour = $resource(
 	'https://api.parse.com/1/classes/tours/:objectId',
 	{objectId: '@objectId'}
  )

  $scope.tour = Tour.get({objectId: $routeParams.id})
});
