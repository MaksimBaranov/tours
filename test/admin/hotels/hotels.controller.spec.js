describe('AdminHotelsController', function() {
  
  beforeEach(module('toursModule'));
  var $scope = {};
  var hotelAPIUrl = 'https://api.parse.com/1/classes/hotels';
  var $httpBackend = null;

  beforeEach(inject(function($controller, _$httpBackend_) {
  	$controller('AdminHotelsController', {$scope: $scope});
  	$httpBackend = _$httpBackend_;
  }));

  describe('initialize controller', function() {
  	it('sets pageName to Hotel', function(){
  		expect($scope.pageName).toBe('Admin Hotels');
  	});

  	it('expect call to parse.com', function() {
  		$httpBackend.expectGET(hotelAPIUrl).respond(200);
  		expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
  	});

    it('sets $scope.hotels an array of hotels', function() {
      var stubHotel = {title: 'Test Hotel', stars: 5};
      jsonResponse = JSON.stringify({results: [stubHotel]});
      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();

      expect($scope.hotels.length).toBe(1);
      var localHotel = $scope.hotels[0];
      expect(localHotel.title).toBe(stubHotel.title);
      expect(localHotel.stars).toBe(stubHotel.stars);
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
    it('expects POST request to parse.com create point', function(){
      $httpBackend.whenGET(hotelAPIUrl).respond('[]');
      $httpBackend.whenPOST(hotelAPIUrl).respond(201);
      $scope.create();
      $httpBackend.flush();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
    });

    it('expects "push" function is called', function() {
      $httpBackend.whenGET(hotelAPIUrl).respond(200, '[]');
      $httpBackend.whenPOST(hotelAPIUrl).respond(201);
      spyOn($scope.hotels, 'push')
      $scope.create();
      $httpBackend.flush();
      expect($scope.hotels.push).toHaveBeenCalled();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
    });

    it('adds new hotel object to $scope.hotels', function() {
      $httpBackend.whenGET(hotelAPIUrl).respond(200, '[]');
      $httpBackend.whenPOST(hotelAPIUrl).respond(201);
      $scope.create();
      $httpBackend.flush();
      expect($scope.hotels.length).toBeGreaterThan(0);
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
    });
  });

  describe('$scope.destroy', function() {
    it('expects DELETE request to parse.com', function() {
      var localHotel = {title: 'oldTitle', stars: 1, objectId: 1};
      jsonResponse = JSON.stringify({results: [localHotel]});

      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();
      $httpBackend.expectDELETE(hotelAPIUrl + '/' + localHotel.objectId).respond(200);
      
      $scope.destroy(0, $scope.hotels[0])
      $httpBackend.flush();
      
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('expects "splice" function is called', function() {
      var localHotel = {title: 'oldTitle', stars: 1, objectId: 1};
      jsonResponse = JSON.stringify({results: [localHotel]});
      
      spyOn($scope.hotels, 'splice')

      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();
      $httpBackend.whenDELETE(hotelAPIUrl + '/' + localHotel.objectId).respond(200);
      
      $scope.destroy(0, $scope.hotels[0])
      $httpBackend.flush();
      expect($scope.hotels.splice).toHaveBeenCalled();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('expects one hotel is removed from $scope.hotels', function() {
      var localHotel = {title: 'oldTitle', stars: 1, objectId: 1};
      jsonResponse = JSON.stringify({results: [localHotel]});
      
      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();
      $httpBackend.whenDELETE(hotelAPIUrl + '/' + localHotel.objectId).respond(200);
      
      $scope.destroy(0, $scope.hotels[0])
      $httpBackend.flush();
      
      expect($scope.hotels.length).toBe(0);
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });
  });

  describe('$scope.edit', function() {
    it('puts hotel to backup storage', function() {
      var localHotel = {title: 'oldTitle', stars: 1, objectId: 1};
      jsonResponse = JSON.stringify({results: [localHotel]});
      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();

      expect($scope.backupHotelsCollection.length).toBe(0);
      
      $scope.edit(0, $scope.hotels[0])
      expect($scope.backupHotelsCollection.length).toBeGreaterThan(0);
    });

    it('sets hotel.isModified attribute to true value', function() {
      var localHotel = {title: 'oldTitle', stars: 1, objectId: 1};
      jsonResponse = JSON.stringify({results: [localHotel]});
      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();

      $scope.edit(0, $scope.hotels[0])
      expect($scope.hotels[0].isModified).toBeDefined();
      expect($scope.hotels[0].isModified).toBeTruthy();
    });
  });

  describe('$scope.update', function(){
    it('expects PUT request to parse.com update point', function() {
      var localHotel = {title: 'oldTitle', stars: 1, objectId: 1};
      jsonResponse = JSON.stringify({results: [localHotel]});
      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();

      $httpBackend.expectPUT(hotelAPIUrl + '/' + localHotel.objectId).respond(200);
      $scope.update($scope.hotels[0]);
      $httpBackend.flush();

      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
    });

    it('expects hotel attributes are changed after PUT request', function() {
      var localHotel = {title: 'oldTitle', stars: 1, objectId: 1};
      jsonResponse = JSON.stringify({results: [localHotel]});
      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();

      $scope.hotels[0].title = 'NewTitle';
      $scope.hotels[0].stars = 5;
      
      $httpBackend.expectPUT(hotelAPIUrl + '/' + localHotel.objectId).respond(200);
      $scope.update($scope.hotels[0]);
      $httpBackend.flush();

      expect($scope.hotels[0].title).toBe('NewTitle');
      expect($scope.hotels[0].stars).toBe(5);

      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
    });
  });

  describe('$scope.cancelEdit', function() {
    it('expects restore hotel attributes values', function() {
      var localHotel = {title: 'oldTitle', stars: 1, objectId: 1};
      jsonResponse = JSON.stringify({results: [localHotel]});
      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();

      $scope.edit(0, $scope.hotels[0])

      $scope.hotels[0].title = 'NewTitle';
      $scope.hotels[0].stars = 5;
      
      $scope.cancelEdit(0, $scope.hotels[0])

      expect($scope.hotels[0].title).toBe(localHotel.title)
      expect($scope.hotels[0].stars).toBe(localHotel.stars)
    });

    it('sets hotel.isModified value to null', function() {
      var localHotel = {title: 'oldTitle', stars: 1, objectId: 1};
      jsonResponse = JSON.stringify({results: [localHotel]});
      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();

      $scope.edit(0, $scope.hotels[0])
      $scope.cancelEdit(0, $scope.hotels[0])

      expect($scope.hotels[0].isModified).toBeNull()
    });
  });

  describe('$scope.cancelNewHotel', function() {
    it('expects $scope.showForm value is true', function() {
      var localHotel = {title: 'oldTitle', stars: 1, objectId: 1};
      jsonResponse = JSON.stringify({results: [localHotel]});
      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();
      
      $scope.new();
      $scope.newHotel = 'NewTitle';
      $scope.stars = 5;

      $scope.cancelNewHotel();

      expect($scope.showForm).toBeFalsy();
    });

    it('expects $scope.showForm value is true', function() {
      var localHotel = {title: 'oldTitle', stars: 1, objectId: 1};
      jsonResponse = JSON.stringify({results: [localHotel]});
      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();
      
      $scope.new();
      $scope.newHotel = 'NewTitle';
      $scope.stars = 5;

      $scope.cancelNewHotel();
      expect($scope.newHotel.title).toBeNull();
      expect($scope.newHotel.stars).toBeNull();
    });
  });
});