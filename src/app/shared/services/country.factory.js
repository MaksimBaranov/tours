angular.module('toursModule').factory('Country', function($resource){
  function parseServerResults(data, headerGetter) {
    data = angular.fromJson(data);
    return data.results;
  }

  var Country = $resource(
    'https://api.parse.com/1/classes/countries/:objectId',
    {objectId: '@objectId'},
    {
      query: {isArray: true, transformResponse: parseServerResults},
      update: {method: 'PUT'}
    }
  );
  
  return Country;
});