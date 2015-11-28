angular.module('toursModule').factory('Tour', function($resource){
  function parseServerResults(data, headerGetter) {
    data = angular.fromJson(data);
    return data.results;
  }

  var Tour = $resource(
    'https://api.parse.com/1/classes/tours/:objectId?include=country,hotel,place',
    {objectId: '@objectId'},
    {
      query: {isArray: true, transformResponse: parseServerResults},
      update: {method: 'PUT'}
    }
  );
  
  return Tour;
});