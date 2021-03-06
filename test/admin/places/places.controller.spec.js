describe('AdminPlacesController', function() {
  
  beforeEach(module('toursModule'));
  var $scope = {};
  var placeAPIUrl = 'https://api.parse.com/1/classes/places';
  var $httpBackend = null;
  var Place = null;
  var stubPlace = null;
  var stubPlaces = null;

  beforeEach(inject(function($controller, _$httpBackend_, _Place_) {
    Place = _Place_;
  	$httpBackend = _$httpBackend_;

    stubPlace = {name: 'Test Place', objectId: 1};
    stubPlaces = [stubPlace];

    spyOn(Place, 'query').and.returnValue(stubPlaces);

    $controller('AdminPlacesController', {$scope: $scope, Place: Place});
  }));

  describe('initialize controller', function() {
  	it('sets pageName to Place', function(){
  		expect($scope.pageName).toBe('Admin Places');
  	});

    it('sets $scope.places an array of places', function() {
      expect($scope.places.length).toBe(1);
      expect($scope.places[0].name).toBe(stubPlace.name);
    });
  });

  describe('$scope.new', function() {
    it('sets newPlace attributes to null values', function() {
      $scope.new();
      expect($scope.newPlace.name).toBe(null);
    });

    it('sets $scope.showForm be equal true value', function() {
      $scope.new();
      expect($scope.showForm).toBe(true);
    });
  });

  describe('$scope.create', function() {
    beforeEach(function() {
      $httpBackend.expectPOST(placeAPIUrl).respond(201);
    });

    it('expects POST request to parse.com create point', function(){
      $scope.create();
      $httpBackend.flush();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('expects "push" function is called', function() {
      spyOn($scope.places, 'push')
      $scope.create();
      $httpBackend.flush();
      expect($scope.places.push).toHaveBeenCalled();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('adds new place object to $scope.places', function() {
      $scope.create();
      $httpBackend.flush();
      expect($scope.places.length).toBeGreaterThan(1);
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });
  });

  describe('$scope.destroy', function() {
    beforeEach(function() {
      $httpBackend.expectDELETE(placeAPIUrl + '/' + stubPlace.objectId).respond(200);
    });

    it('expects DELETE request to parse.com', function() {
      $scope.destroy(0, $scope.places[0])
      $httpBackend.flush();
      
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('expects \'splice\' function is called', function() {
      spyOn($scope.places, 'splice')

      $scope.destroy(0, $scope.places[0])
      $httpBackend.flush();
      expect($scope.places.splice).toHaveBeenCalled();
    });

    it('expects one place is removed from $scope.places', function() {
      $scope.destroy(0, $scope.places[0])
      $httpBackend.flush();
      
      expect($scope.places.length).toBe(0);
    });
  });

  describe('$scope.edit', function() {
    it('puts place to backup storage', function() {
      expect($scope.backupPlacesCollection.length).toBe(0);
      $scope.edit(0, $scope.places[0])
      expect($scope.backupPlacesCollection.length).toBeGreaterThan(0);
    });

    it('sets place.isModified attribute to true value', function() {
      $scope.edit(0, $scope.places[0])
      expect($scope.places[0].isModified).toBeDefined();
      expect($scope.places[0].isModified).toBeTruthy();
    });
  });

  describe('$scope.update', function(){
    beforeEach(function() {
      $httpBackend.expectPUT(placeAPIUrl + '/' + stubPlace.objectId).respond(200);      
    });

    it('expects PUT request to parse.com update point', function() {
      $scope.update($scope.places[0]);
      $httpBackend.flush();

      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('expects place attributes are changed after PUT request', function() {
      $scope.places[0].name = 'NewName';
      $scope.places[0].stars = 5;
      
      $scope.update($scope.places[0]);
      $httpBackend.flush();

      expect($scope.places[0].name).toBe('NewName');
      expect($scope.places[0].stars).toBe(5);
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });
  });

  describe('$scope.cancelEdit', function() {
    beforeEach(function() {
      $scope.edit(0, $scope.places[0])
    });

    it('expects restore place attributes values', function() {
      $scope.places[0].name = 'NewTitle';
      $scope.places[0].stars = 5;
      
      $scope.cancelEdit(0, $scope.places[0])

      expect($scope.places[0].name).toBe(stubPlace.name)
    });

    it('sets place.isModified value to null', function() {
      $scope.cancelEdit(0, $scope.places[0])

      expect($scope.places[0].isModified).toBeNull()
    });
  });

  describe('$scope.cancelNewPlace', function() {
    it('expects $scope.showForm value is true and attributes are null', function() {
      $scope.new();
      $scope.newPlace.name = 'NewTitle';
      $scope.stars = 4;

      $scope.cancelNewPlace();

      expect($scope.showForm).toBeFalsy();
      expect($scope.newPlace.name).toBeNull();
    });
  });
});