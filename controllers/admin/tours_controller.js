angular.module('tours').controller('AdminToursController', function($scope, $location, $http){
  $scope.pageName = 'Admin Tours';
  
  $http.get(
    'https://api.parse.com/1/classes/tours'
  ).then(
    function(response) {
      $scope.tours = response.data.results;
    }, function(errResponse) {
      console.log(errResponse);
    }
  )

  $http.get(
    'https://api.parse.com/1/classes/countries'
  ).then(
    function(response) {
      $scope.countries = response.data.results;
    }, function(errResponse) {
      console.log(errResponse);
    }
  )  

  $scope.filter = {};



  // CRUD actions
  $scope.new = function() {
    $scope.newTour  = emptyTour();
    $scope.showForm = true;
  };

  $scope.create = function() {
    $scope.newTour.slug = $scope.newTour.country
    $scope.tours.push(angular.copy($scope.newTour));
    $scope.newTour = emptyTour();
    $scope.showForm = false;
    store();
  };

  $scope.destroy = function(index) {
    $scope.tours.splice(index, 1);
    store();
  };

  $scope.edit = function(tour) {
    $scope.revertedVersion = angular.copy(tour);
    tour.isModified = true;
  };

  $scope.update = function(tour) {
    tour.isModified = false;
    $scope.showForm = false;
    store();
  };

  $scope.cancelEdit = function(tour) {
    tour.title = $scope.revertedVersion.title;
    tour.country = $scope.revertedVersion.country;
    tour.description = $scope.revertedVersion.description;
    tour.price = $scope.revertedVersion.price;
    tour.slug = $scope.revertedVersion.slug;
    tour.isModified = false;
  };

  $scope.cancelNewTour = function() {
    $scope.showForm = false;
  };

  // Actions helpers
  function emptyTour() {
    return {
      title: null,
      country: null,
      description: null,
      price: null,
      slug: null,
      isModified: false
    }
  };

  function store() { localStorage.setItem("tours", JSON.stringify(allTours)); }

  // Init Objects
  $scope.revertedVersion = emptyTour();
});
