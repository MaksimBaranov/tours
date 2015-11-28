angular.module('toursModule').controller('AdminPlacesController', function($scope, $resource, Place){
  $scope.pageName = 'Admin Places';

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
    Place.delete({objectId: place.objectId}, function() {
      $scope.places.splice(index, 1);  
    });
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
