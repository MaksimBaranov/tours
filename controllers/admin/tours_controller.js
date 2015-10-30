angular.module('tours').controller('AdminToursController', function($scope, $location, $resource){
  $scope.pageName = 'Admin Tours';
  
  var Tour = $resource(
    'https://api.parse.com/1/classes/tours/:objectId',
    {objectId: '@objectId'},
    {
      query: {isArray: true, transformResponse: parseServerResults},
      update: {method: 'PUT'}
    }
  );

  var Country = $resource(
    'https://api.parse.com/1/classes/countries/:objectId',
    {objectId: '@objectId'},
    {
      query: {isArray: true, transformResponse: parseServerResults}
    }
  );

   var Place = $resource(
    'https://api.parse.com/1/classes/places/:objectId',
    {objectId: '@objectId'},
    {query: {isArray: true, transformResponse: parseServerResults}}
  )

  $scope.tours = Tour.query();
  $scope.countries = Country.query();
  $scope.places = Place.query();

  $scope.filter = {};
  $scope.backupToursCollection = [];

  // CRUD actions
  $scope.new = function() {
    $scope.newTour  = emptyTour();
    $scope.showForm = true;
  };

  $scope.create = function() {
    $scope.newTour.slug = $scope.newTour.country;
    var tourToServer = new Tour($scope.newTour);

    tourToServer.$save().then(
      function(tour) {
        var tourFromServer = angular.extend(tour, $scope.newTour);
        $scope.tours.push(tourFromServer);
        $scope.newTour = emptyTour();
        $scope.showForm = false;
      }
    );
  };

  $scope.edit = function(index, tour) {
    putTourToBackup(index, tour);
    tour.isModified = true;
  };

  $scope.update = function(tour) {
    Tour.update({objectId: tour.objectId}, tour);
    tour.isModified = null;
  };

  $scope.destroy = function(index, tour) {
    Tour.delete({objectId: tour.objectId});
    $scope.tours.splice(index, 1);
  };

  // Form Helpers
  $scope.cancelEdit = function(index, tour) {
    getTourFromBackup(index, tour);
    tour.isModified = null;
  };

  $scope.cancelNewTour = function() {
    $scope.showForm = false;
    $scope.newTour = emptyTour();
  };

  // Actions' helpers
  function parseServerResults(data, headerGetter) {
    data = angular.fromJson(data);
    return data.results;
  };

  function emptyTour() {
    return {
      title: null,
      country: null,
      place: null,
      description: null,
      price: null,
      duration:null,
      slug: null,
      isModified: null
    }
  };

  function putTourToBackup(index, tour) {
    var backupItem = angular.copy(tour);
    $scope.backupToursCollection[index] = backupItem;
  };

  function getTourFromBackup(index, tour) {
    angular.extend(tour, $scope.backupToursCollection[index]); 
  };
});
