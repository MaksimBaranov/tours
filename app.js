var app = angular.module('Tours', []);

app.controller('ToursController', function($scope){
  $scope.labelName = 'Tours';

  $scope.newTour = {
    title: null,
    country: null,
    description: null,
    price: null,
    is_modified: false
  };

  $scope.revertedVersion = {
    title: null,
    country: null,
    description: null,
    price: null,
    is_modified: null
  };

  // CRUD actions:
  $scope.new = function() {
    $scope.showForm = true;
    $scope.newTour = {};
  }

  $scope.create = function() {
    $scope.tours.push(angular.copy($scope.newTour));
    $scope.showForm = false;
    localStorage.setItem("tours", JSON.stringify($scope.tours));
  };

  $scope.destroy = function(index) {
    $scope.tours.splice(index, 1);
    localStorage.setItem("tours", JSON.stringify($scope.tours));
  };

  $scope.edit = function(tour) {
    $scope.revertedVersion = angular.copy(tour);
    tour.is_modified = true;
  };

  $scope.update = function(tour) {
    tour.is_modified = false;
    $scope.showForm = false;
    localStorage.setItem("tours", JSON.stringify($scope.tours));
  };

  $scope.cancel = function(tour) {
    if (tour != null) {
      tour.title = $scope.revertedVersion.title;
      tour.country = $scope.revertedVersion.country;
      tour.description = $scope.revertedVersion.description;
      tour.price = $scope.revertedVersion.price;
      tour.is_modified = false;
    } else {
      $scope.showForm = false;
    }
  };

  function = initItems() {
    if (localStorage['tours']) {
      $scope.tours = JSON.parse(localStorage['tours'])
    } else {
      $scope.tours = [];
    }
  };

  initItems();
});


