angular.module('toursModule').controller('AdminCountriesController', function($scope, Country){
  $scope.pageName = 'Admin Countries';
  $scope.countries = Country.query();
  $scope.backupCountriesCollection = [];

  // CRUD actions
  $scope.new = function() {
    $scope.newCountry  = emptyCountry();
    $scope.showForm = true;
  };

  $scope.create = function() {
    var countryToServer = new Country($scope.newCountry);

    countryToServer.$save().then(
      function(country) {
        var countryFromServer = angular.extend(country, $scope.newCountry);
        $scope.countries.push(countryFromServer);
        $scope.newCountry = emptyCountry();
        $scope.showForm = false;
      }
    );
  };

  $scope.edit = function(index, country) {
    putCountryToBackup(index, country);
    country.isModified = true;
  };

  $scope.update = function(country) {
    Country.update({objectId: country.objectId}, country);
    country.isModified = null;
  };

  $scope.destroy = function(index, country) {
    Country.delete({objectId: country.objectId}, function() {
      $scope.countries.splice(index, 1);  
    });
  };

  // Form Helpers
  $scope.cancelEdit = function(index, country) {
    getCountryFromBackup(index, country);
    country.isModified = null;
  };

  $scope.cancelNewCountry = function() {
    $scope.showForm = false;
    $scope.newCountry = emptyCountry();
  };

  // Actions' helpers
  function emptyCountry() {
    return {
      name: null,
      isModified: null
    }
  };

  function putCountryToBackup(index, country) {
    var backupItem = angular.copy(country);
    $scope.backupCountriesCollection[index] = backupItem;
  };

  function getCountryFromBackup(index, country) {
    angular.extend(country, $scope.backupCountriesCollection[index]); 
  };
});
