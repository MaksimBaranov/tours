angular.module('toursModule').controller('AdminHotelsController', function($scope, Hotel){
  $scope.pageName = 'Admin Hotels';
  $scope.hotels = Hotel.query();
  $scope.backupHotelsCollection = [];

  // CRUD actions
  $scope.new = function() {
    $scope.newHotel  = emptyHotel();
    $scope.showForm = true;
  };

  $scope.create = function() {
    var hotelToServer = new Hotel($scope.newHotel);

    hotelToServer.$save().then(
      function(hotel) {
        var hotelFromServer = angular.extend(hotel, $scope.newHotel);
        $scope.hotels.push(hotelFromServer);
        $scope.newHotel = emptyHotel();
        $scope.showForm = false;
      }
    );
  };

  $scope.edit = function(index, hotel) {
    putHotelToBackup(index, hotel);
    hotel.isModified = true;
  };

  $scope.update = function(hotel) {
    Hotel.update({objectId: hotel.objectId}, hotel);
    hotel.isModified = null;
  };

  $scope.destroy = function(index, hotel) {
    Hotel.delete({objectId: hotel.objectId}, function() {
      $scope.hotels.splice(index, 1);  
    });
  };

  // Form Helpers
  $scope.cancelEdit = function(index, hotel) {
    getHotelFromBackup(index, hotel);
    hotel.isModified = null;
  };

  $scope.cancelNewHotel = function() {
    $scope.showForm = false;
    $scope.newHotel = emptyHotel();
  };

  // Actions' helpers
  function parseServerResults(data, headerGetter) {
    data = angular.fromJson(data);
    return data.results;
  };

  function emptyHotel() {
    return {
      title: null,
      stars: null,
      isModified: null
    }
  };

  function putHotelToBackup(index, hotel) {
    var backupItem = angular.copy(hotel);
    $scope.backupHotelsCollection[index] = backupItem;
  };

  function getHotelFromBackup(index, hotel) {
    angular.extend(hotel, $scope.backupHotelsCollection[index]); 
  };
});
