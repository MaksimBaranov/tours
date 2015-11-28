angular.module('toursModule').factory('Hotel', function($resource){
  function parseServerResults(data, headerGetter) {
    data = angular.fromJson(data);
    return data.results;
  }
  
  var Hotel = $resource(
    'https://api.parse.com/1/classes/hotels/:objectId',
    {objectId: '@objectId'},
    {
      query: {isArray: true, transformResponse: parseServerResults},
      update: {method: 'PUT'}
    }
  );
  
  return Hotel;
});