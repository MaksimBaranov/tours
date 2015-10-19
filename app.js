var app = angular.module('Tours', []);

app.controller('ToursController', function($scope){
  $scope.labelName = 'Tours';

  function emptyTour() {
    return {
      title: null,
      country: null,
      description: null,
      price: null,
      isModified: false
    }
  };

  $scope.revertedVersion = {
    title: null,
    country: null,
    description: null,
    price: null,
    isModified: null
  };

  // CRUD actions:
  $scope.new = function() {
    $scope.newTour  = emptyTour();
    $scope.showForm = true;
  }

  $scope.create = function() {
    $scope.tours.push(angular.copy($scope.newTour));
    $scope.newTour = emptyTour();
    $scope.showForm = false;
    localStorage.setItem("tours", JSON.stringify($scope.tours));
  };

  $scope.destroy = function(index) {
    $scope.tours.splice(index, 1);
    localStorage.setItem("tours", JSON.stringify($scope.tours));
  };

  $scope.edit = function(tour) {
    $scope.revertedVersion = angular.copy(tour);
    tour.isModified = true;
  };

  $scope.update = function(tour) {
    tour.isModified = false;
    $scope.showForm = false;
    localStorage.setItem("tours", JSON.stringify($scope.tours));
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

  initItems();
});


