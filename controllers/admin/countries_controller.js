angular.module('tours').controller('AdminCountriesController', function($scope, $location){
  debugger;
  $scope.pageName = 'Admin Countries';

  // CRUD actions
  $scope.new = function() {
    $scope.newCountry  = emptyCountry();
    $scope.showForm = true;
  }

  $scope.create = function() {
    $scope.countries.push(angular.copy($scope.newCountry));
    $scope.newCountry = emptyCountry();
    $scope.showForm = false;
    store();
  };

  $scope.destroy = function(index) {
    $scope.countries.splice(index, 1);
    store();
  };

  $scope.edit = function(country) {
    $scope.revertedVersion = angular.copy(country);
    country.isModified = true;
  };

  $scope.update = function(country) {
    country.isModified = false;
    $scope.showForm = false;
    store();
  };

  $scope.cancelEdit = function(country) {
    country.name = $scope.revertedVersion.name;
    country.isModified = false;
  };

  $scope.cancelNewCountry = function() {
    $scope.showForm = false;
  };

  // Actions helpers
  function emptyCountry() {
    return {
      name: null,
      isModified: false
    }
  };

  function store() { localStorage.setItem("countries", JSON.stringify(allCountries)); }

  $scope.revertedVersion = emptyCountry();
  $scope.countries = allCountries;
});
