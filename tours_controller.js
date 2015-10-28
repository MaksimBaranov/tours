angular.module('tours').controller('ToursController', function($scope, $resource){
  $scope.pageName = 'Tours';
  $scope.filter = {};

  function parseServerResults(data, headerGetter) {
    data = angular.fromJson(data);
    return data.results;
  }

  var Tour = $resource(
    'https://api.parse.com/1/classes/tours/:objectId',
    {objectId: '@objectId'},
    {query: {isArray: true, transformResponse: parseServerResults}}
  )

  var Country = $resource(
    'https://api.parse.com/1/classes/countries/:objectId',
    {objectId: '@objectId'},
    {query: {isArray: true, transformResponse: parseServerResults}}
  )

$scope.tours = Tour.query();
$scope.countries = Country.query();
});
