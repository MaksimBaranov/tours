angular.module('toursModule').factory('Place', function($resource){
  function parseServerResults(data, headerGetter) {
    data = angular.fromJson(data);
    return data.results;
  }

  var Place = $resource(
    'https://api.parse.com/1/classes/places/:objectId',
    {objectId: '@objectId'},
    {
      query: {isArray: true, transformResponse: parseServerResults},
      update: {method: 'PUT'}
    }
  );
  
  return Place;
});