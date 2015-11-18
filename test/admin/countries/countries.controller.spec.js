describe('AdminCounriesController', function() {
  
  beforeEach(module('toursModule'));
  var $scope = {};
  var countryAPIUrl = 'https://api.parse.com/1/classes/countries';
  var $httpBackend = null;
  var stubCountry = null;
  var jsonResponse = null;

  beforeEach(inject(function($controller, _$httpBackend_) {
    $controller('AdminCountriesController', {$scope: $scope});
    $httpBackend = _$httpBackend_;
    stubCountry = {name: 'Belarus', objectId: 1};
    jsonResponse = JSON.stringify({results: [stubCountry]});
  }));

  describe('initialize controller', function() {
    it('sets pageName to Country', function(){
      expect($scope.pageName).toBe('Admin Countries');
    });

    it('expect call to parse.com', function() {
      $httpBackend.expectGET(countryAPIUrl).respond(200);
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('sets $scope.countries an array of countries', function() {
      $httpBackend.whenGET(countryAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();

      expect($scope.countries.length).toBe(1);
      expect($scope.countries[0].name).toBe(stubCountry.name);
    });
  });

  describe('$scope.new', function() {
    it('sets newCountry attributes to null values', function() {
      $scope.new();
      expect($scope.newCountry.name).toBe(null);
    });

    it('sets $scope.showForm be equal true value', function() {
      $scope.new();
      expect($scope.showForm).toBe(true);
    });
  });

  describe('$scope.create', function() {
    beforeEach(function() {
      $httpBackend.whenGET(countryAPIUrl).respond('[]');
      $httpBackend.whenPOST(countryAPIUrl).respond(201);
    });

    it('expects POST request to parse.com create point', function(){
      $scope.create();
      $httpBackend.flush();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
    });

    it('expects "push" function is called', function() {
      spyOn($scope.countries, 'push')
      $scope.create();
      $httpBackend.flush();
      expect($scope.countries.push).toHaveBeenCalled();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
    });

    it('adds new country object to $scope.countries', function() {
      $scope.create();
      $httpBackend.flush();
      expect($scope.countries.length).toBeGreaterThan(0);
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
    });
  });

  describe('$scope.destroy', function() {
    beforeEach(function() {
      $httpBackend.whenGET(countryAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();
      $httpBackend.expectDELETE(countryAPIUrl + '/' + stubCountry.objectId).respond(200);
    });

    it('expects DELETE request to parse.com', function() {
      $scope.destroy(0, $scope.countries[0])
      $httpBackend.flush();
      
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('expects \'splice\' function is called', function() {
      spyOn($scope.countries, 'splice')

      $scope.destroy(0, $scope.countries[0])
      $httpBackend.flush();
      expect($scope.countries.splice).toHaveBeenCalled();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('expects one country is removed from $scope.countries', function() {
      $scope.destroy(0, $scope.countries[0])
      $httpBackend.flush();
      
      expect($scope.countries.length).toBe(0);
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });
  });

  describe('$scope.edit', function() {
    beforeEach(function() {
      $httpBackend.whenGET(countryAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();
    });

    it('puts country to backup storage', function() {
      expect($scope.backupCountriesCollection.length).toBe(0);
      $scope.edit(0, $scope.countries[0])
      expect($scope.backupCountriesCollection.length).toBeGreaterThan(0);
    });

    it('sets country.isModified attribute to true value', function() {
      $scope.edit(0, $scope.countries[0])
      expect($scope.countries[0].isModified).toBeDefined();
      expect($scope.countries[0].isModified).toBeTruthy();
    });
  });

  describe('$scope.update', function(){
    beforeEach(function() {
      $httpBackend.whenGET(countryAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();
      $httpBackend.expectPUT(countryAPIUrl + '/' + stubCountry.objectId).respond(200);      
    });

    it('expects PUT request to parse.com update point', function() {
      $scope.update($scope.countries[0]);
      $httpBackend.flush();

      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
    });

    it('expects country attributes are changed after PUT request', function() {
      $scope.countries[0].name = 'NewName';
      
      $scope.update($scope.countries[0]);
      $httpBackend.flush();

      expect($scope.countries[0].name).toBe('NewName');

      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
    });
  });

  describe('$scope.cancelEdit', function() {
    beforeEach(function() {
      $httpBackend.whenGET(countryAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();
      $scope.edit(0, $scope.countries[0])
    });

    it('expects restore countries attributes values', function() {
      $scope.countries[0].name = 'NewName';
      
      $scope.cancelEdit(0, $scope.countries[0])

      expect($scope.countries[0].name).toBe(stubCountry.name)
    });

    it('sets country.isModified value to null', function() {
      $scope.cancelEdit(0, $scope.countries[0])

      expect($scope.countries[0].isModified).toBeNull()
    });
  });

  describe('$scope.cancelNewCountry', function() {
    it('expects $scope.showForm value is true and attributes are null', function() {
      $httpBackend.whenGET(countryAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();
      
      $scope.new();
      $scope.newCountry = 'NewTitle';
      $scope.stars = 4;

      $scope.cancelNewCountry();

      expect($scope.showForm).toBeFalsy();
      expect($scope.newCountry.name).toBeNull();
    });
  });
});