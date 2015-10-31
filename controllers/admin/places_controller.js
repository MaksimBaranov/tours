angular.module('tours').controller('AdminPlacesController', function($scope, $location, $resource){
  $scope.pageName = 'Admin Places';

  var Place = $resource(
    'https://api.parse.com/1/classes/places/:objectId',
    {objectId: '@objectId'},
    {
      query: {isArray: true, transformResponse: parseServerResults},
      update: {method: 'PUT'}
    }
  );

  $scope.places = Place.query();

  $scope.backupPlacesCollection = [];

  // CRUD actions
  $scope.new = function() {
    $scope.newPlace  = emptyPlace();
    $scope.showForm = true;
  };

  $scope.create = function() {
    var placeToServer = new Place($scope.newPlace);

    placeToServer.$save().then(
      function(place) {
        var placeFromServer = angular.extend(place, $scope.newPlace);
        $scope.places.push(placeFromServer);
        $scope.newPlace = emptyPlace();
        $scope.showForm = false;
      }
    );
  };

  $scope.edit = function(index, place) {
    putPlaceToBackup(index, place);
    place.isModified = true;
  };

  $scope.update = function(place) {
    Place.update({objectId: place.objectId}, place);
    place.isModified = null;
  };

  $scope.destroy = function(index, place) {
    Place.delete({objectId: place.objectId});
    $scope.places.splice(index, 1);
  };

  // Form Helpers
  $scope.cancelEdit = function(index, place) {
    getPlaceFromBackup(index, place);
    place.isModified = null;
  };

  $scope.cancelNewPlace = function() {
    $scope.showForm = false;
    $scope.newPlace = emptyPlace();
  };

  // Actions' helpers
  function parseServerResults(data, headerGetter) {
    data = angular.fromJson(data);
    return data.results;
  };

  function emptyPlace() {
    return {
      name: null,
      isModified: null
    }
  };

  function putPlaceToBackup(index, place) {
    var backupItem = angular.copy(place);
    $scope.backupPlacesCollection[index] = backupItem;
  };

  function getPlaceFromBackup(index, place) {
    angular.extend(place, $scope.backupPlacesCollection[index]); 
  };
});
