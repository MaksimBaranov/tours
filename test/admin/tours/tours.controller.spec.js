describe('AdminToursController', function() {
  beforeEach(module('toursModule'));
  var $scope = {};
  var tourAPIUrl = 'https://api.parse.com/1/classes/tours/?include=country,hotel,place';
  var countryAPIUrl = 'https://api.parse.com/1/classes/countries'
  var placeAPIUrl = 'https://api.parse.com/1/classes/places'
  var hotelAPIUrl = 'https://api.parse.com/1/classes/hotels'
  var $httpBackend = null;
  var stubTour = null;
  var stubHotel = null;
  var stubCountry = null;
  var stubPlace = null;

  beforeEach(inject(function($controller, _$httpBackend_) {
  	$controller('AdminToursController', {$scope: $scope});
  	$httpBackend = _$httpBackend_;
  	stubHotel = {title: 'Test Hotel', stars: 5, objectId: 1};
  	stubCountry = {name: 'Belarus', objectId: 1};
  	stubPlace = {name: 'Test Place', objectId: 1};
  	stubTour = {title: 'Test tour', description: 'Test description', price: 2, objectId: 1,  country: stubCountry, hotel: stubHotel, place: stubPlace};
    tourJsonResponse = JSON.stringify({results: [stubTour]});
	$httpBackend.whenGET(countryAPIUrl).respond(200, JSON.stringify({results: [stubCountry]}));
	$httpBackend.whenGET(placeAPIUrl).respond(200, JSON.stringify({results: [stubPlace]}));
	$httpBackend.whenGET(hotelAPIUrl).respond(200, JSON.stringify({results: [stubHotel]}));
  }));

  describe('initialize', function() {
    it('sets pageName to Tours', function() {
	  expect($scope.pageName).toBe('Admin Tours');
  	});

  	it('expects call to parse.com', function() {
	  $httpBackend.expectGET(tourAPIUrl).respond(200);
	  expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('sets countries, places, tours arrays', function() {
  	  $httpBackend.expectGET(tourAPIUrl).respond(200, tourJsonResponse);
  	  $httpBackend.flush();
  	  expect(angular.equals($scope.tours[0], stubTour)).toBeTruthy();
  	  expect(angular.equals($scope.places[0], stubPlace)).toBeTruthy();
  	  expect(angular.equals($scope.countries[0], stubCountry)).toBeTruthy();
    });	
  });

  describe('$scope.new', function() {
  	it('sets newTour attributes to be null', function() {
	  $scope.new();
	  expect($scope.newTour.title).toBeNull();
	  expect($scope.newTour.description).toBeNull();
	  expect($scope.newTour.price).toBeNull();
	  expect($scope.newTour.duration).toBeNull();
	  expect($scope.newTour.place.objectId).toBeNull();
	  expect($scope.newTour.hotel.objectId).toBeNull();
	  expect($scope.newTour.country.objectId).toBeNull();
  	});

  	it('sets showForm attribute to true value', function() {
  	  $scope.new();
  	  expect($scope.showForm).toBeTruthy();
  	});
  });

  describe('$scope.create', function() {
    beforeEach(function() {
      $httpBackend.whenGET(hotelAPIUrl).respond('[]');
      $httpBackend.whenGET(tourAPIUrl).respond('[]');
      $httpBackend.whenGET('https://api.parse.com/1/classes/tours/:objectId?include=country,hotel,place', {objectId: stubTour}).respond(200, tourJsonResponse);
      $httpBackend.whenPOST(hotelAPIUrl).respond(201);
      $httpBackend.whenPOST(tourAPIUrl).respond(201);
    });

    it('expects 2 POST request to parse.com create point', function() {
	  $scope.create();
      $httpBackend.flush();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
    });

    it('expects "push" function is called', function() {
	  spyOn($scope.hotels, 'push')
	  spyOn($scope.tours, 'push')
      $scope.create();
      $httpBackend.flush();
      expect($scope.hotels.push).toHaveBeenCalled();
      expect($scope.tours.push).toHaveBeenCalled();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();	
    });

    it('adds new hotel and tour to $scope', function() {
	  $scope.create();
      $httpBackend.flush();
      expect($scope.hotels.length).toBeGreaterThan(0);
      expect($scope.tours.length).toBeGreaterThan(0);
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
    });
  });

  describe('$scope.destroy', function() {
    beforeEach(function() {
      $httpBackend.whenGET(tourAPIUrl).respond(200, tourJsonResponse);
      $httpBackend.flush();
      $httpBackend.expectDELETE('https://api.parse.com/1/classes/tours/1?include=country,hotel,place').respond(200);
    });

    it('expects DELETE request to parse.com', function() {
      $scope.destroy(0, $scope.tours[0])
      $httpBackend.flush();
      
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('expects \'splice\' function is called', function() {
      spyOn($scope.tours, 'splice')

      $scope.destroy(0, $scope.tours[0])
      $httpBackend.flush();
      expect($scope.tours.splice).toHaveBeenCalled();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('expects one tour is removed from $scope.hotels', function() {
      $scope.destroy(0, $scope.tours[0])
      $httpBackend.flush();
      
      expect($scope.tours.length).toBe(0);
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    describe('$scope.edit', function() {
      beforeEach(function() {
        $httpBackend.whenGET(tourAPIUrl).respond(200, tourJsonResponse);
      });

      it('puts tour to backup storage', function() {
        expect($scope.backupToursCollection.length).toBe(0);
        $scope.edit(0, $scope.tours[0])
        expect($scope.backupToursCollection.length).toBeGreaterThan(0);
      });

      it('sets tour.isModified attribute to true value', function() {
        $scope.edit(0, $scope.tours[0])
        expect($scope.tours[0].isModified).toBeDefined();
        expect($scope.tours[0].isModified).toBeTruthy();
      });
  	});

  //   describe('$scope.update', function(){
  //   beforeEach(function() {
  //     $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
  //     $httpBackend.flush();
  //     $httpBackend.expectPUT(hotelAPIUrl + '/' + stubHotel.objectId).respond(200);      
  //   });

  //   it('expects PUT request to parse.com update point', function() {
  //     $scope.update($scope.hotels[0]);
  //     $httpBackend.flush();

  //     expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
  //     expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
  //   });

  //   it('expects hotel attributes are changed after PUT request', function() {
  //     $scope.hotels[0].title = 'NewTitle';
  //     $scope.hotels[0].stars = 5;
      
  //     $scope.update($scope.hotels[0]);
  //     $httpBackend.flush();

  //     expect($scope.hotels[0].title).toBe('NewTitle');
  //     expect($scope.hotels[0].stars).toBe(5);

  //     expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
  //     expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
  //   });
  // });


  	
  });
  
});