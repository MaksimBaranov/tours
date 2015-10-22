angular.module('Tours').controller('ToursController', function($scope){
  $scope.labelName = 'Tours';

  // CRUD actions:
  $scope.new = function() {
    $scope.newTour  = emptyTour();
    $scope.showForm = true;
  }

  $scope.create = function() {
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
    tour.isModified = false;
  };

  $scope.cancelNewTour = function() {
    $scope.showForm = false;
  };

  function initItems() {
    if (localStorage['tours']) {
      $scope.tours = JSON.parse(localStorage['tours'])
    } else {
      $scope.tours = [];
    }
  };

  function emptyTour() {
    return {
      title: null,
      country: null,
      description: null,
      price: null,
      isModified: false
    }
  };

  function store() { localStorage.setItem("tours", JSON.stringify($scope.tours)); }

  $scope.revertedVersion = emptyTour();
  initItems();
});
