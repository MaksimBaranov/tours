describe('AdminHotelsController', function() {
  
  beforeEach(module('toursModule'));
  var $scope = {};
  var hotelAPIUrl = 'https://api.parse.com/1/classes/hotels';
  var $httpBackend = null;
  var stubHotel = null;
  var jsonResponse = null;

  beforeEach(inject(function($controller, _$httpBackend_) {
  	$controller('AdminHotelsController', {$scope: $scope});
  	$httpBackend = _$httpBackend_;
    stubHotel = {title: 'Test Hotel', stars: 5, objectId: 1};
    jsonResponse = JSON.stringify({results: [stubHotel]});
  }));

  describe('initialize controller', function() {
  	it('sets pageName to Hotel', function(){
  		expect($scope.pageName).toBe('Admin Hotels');
  	});

    it('sets $scope.hotels an array of hotels', function() {
      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();

      expect($scope.hotels.length).toBe(1);
      expect($scope.hotels[0].title).toBe(stubHotel.title);
      expect($scope.hotels[0].stars).toBe(stubHotel.stars);
    });
  });

  describe('$scope.new', function() {
    it('sets newHotel attributes to null values', function() {
      $scope.new();
      expect($scope.newHotel.title).toBe(null);
      expect($scope.newHotel.stars).toBe(null);
    });

    it('sets $scope.showForm be equal true value', function() {
      $scope.new();
      expect($scope.showForm).toBe(true);
    });
  });

  describe('$scope.create', function() {
    beforeEach(function() {
      $httpBackend.whenGET(hotelAPIUrl).respond('[]');
      $httpBackend.expectPOST(hotelAPIUrl).respond(201);
    });

    it('expects POST request to parse.com create point', function(){
      $scope.create();
      $httpBackend.flush();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('expects "push" function is called', function() {
      spyOn($scope.hotels, 'push')
      $scope.create();
      $httpBackend.flush();
      expect($scope.hotels.push).toHaveBeenCalled();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('adds new hotel object to $scope.hotels', function() {
      $scope.create();
      $httpBackend.flush();
      expect($scope.hotels.length).toBeGreaterThan(0);
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });
  });

  describe('$scope.destroy', function() {
    beforeEach(function() {
      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();
      $httpBackend.expectDELETE(hotelAPIUrl + '/' + stubHotel.objectId).respond(200);
    });

    it('expects DELETE request to parse.com', function() {
      $scope.destroy(0, $scope.hotels[0]);
      $httpBackend.flush();
      
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('expects \'splice\' function is called', function() {
      spyOn($scope.hotels, 'splice')

      $scope.destroy(0, $scope.hotels[0]);
      $httpBackend.flush();
      expect($scope.hotels.splice).toHaveBeenCalled();
    });

    it('expects one hotel is removed from $scope.hotels', function() {
      $scope.destroy(0, $scope.hotels[0]);
      $httpBackend.flush();
      
      expect($scope.hotels.length).toBe(0);
    });
  });

  describe('$scope.edit', function() {
    beforeEach(function() {
      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();
    });

    it('puts hotel to backup storage', function() {
      expect($scope.backupHotelsCollection.length).toBe(0);
      $scope.edit(0, $scope.hotels[0]);
      expect($scope.backupHotelsCollection.length).toBeGreaterThan(0);
    });

    it('sets hotel.isModified attribute to true value', function() {
      $scope.edit(0, $scope.hotels[0]);
      expect($scope.hotels[0].isModified).toBeDefined();
      expect($scope.hotels[0].isModified).toBeTruthy();
    });
  });

  describe('$scope.update', function(){
    beforeEach(function() {
      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();
      $httpBackend.expectPUT(hotelAPIUrl + '/' + stubHotel.objectId).respond(200);      
    });

    it('expects PUT request to parse.com update point', function() {
      $scope.update($scope.hotels[0]);
      $httpBackend.flush();

      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('expects hotel attributes are changed after PUT request', function() {
      $scope.hotels[0].title = 'NewTitle';
      $scope.hotels[0].stars = 5;
      
      $scope.update($scope.hotels[0]);
      $httpBackend.flush();

      expect($scope.hotels[0].title).toBe('NewTitle');
      expect($scope.hotels[0].stars).toBe(5);

      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });
  });

  describe('$scope.cancelEdit', function() {
    beforeEach(function() {
      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();
      $scope.edit(0, $scope.hotels[0]);
    });

    it('expects restore hotel attributes values', function() {
      $scope.hotels[0].title = 'NewTitle';
      $scope.hotels[0].stars = 5;
      
      $scope.cancelEdit(0, $scope.hotels[0]);

      expect($scope.hotels[0].title).toBe(stubHotel.title);
      expect($scope.hotels[0].stars).toBe(stubHotel.stars);
    });

    it('sets hotel.isModified value to null', function() {
      $scope.cancelEdit(0, $scope.hotels[0]);

      expect($scope.hotels[0].isModified).toBeNull();
    });
  });

  describe('$scope.cancelNewHotel', function() {
    it('expects $scope.showForm value is true and attributes are null', function() {
      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();
      
      $scope.new();
      $scope.newHotel = 'NewTitle';
      $scope.stars = 4;

      $scope.cancelNewHotel();

      expect($scope.showForm).toBeFalsy();
      expect($scope.newHotel.title).toBeNull();
      expect($scope.newHotel.stars).toBeNull();
    });
  });
});