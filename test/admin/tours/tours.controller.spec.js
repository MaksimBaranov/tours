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
  var Tour = null;
  var Country = null;
  var Hotel = null;
  var Place = null;

  beforeEach(inject(function($controller, _$httpBackend_, _Tour_, _Country_, _Hotel_, _Place_) {
    $httpBackend = _$httpBackend_;
    Tour = _Tour_;
    Country = _Country_;
    Hotel = _Hotel_;
    Place = _Place_;

    stubHotel = {title: 'Test Hotel', stars: 5, objectId: 1};
    stubHotels = [stubHotel];

    stubCountry = {name: 'Belarus', objectId: 1};
    stubCountries = [stubCountry];

    stubPlace = {name: 'Test Place', objectId: 1};
    stubPlaces = [stubPlace];

    stubTour = {title: 'Test tour', description: 'Test description', price: 2, objectId: 1,  country: stubCountry, hotel: stubHotel, place: stubPlace, duration: 20};
    stubTours = [stubTour];

    spyOn(Tour, 'query').and.returnValue(stubTours);
    spyOn(Country, 'query').and.returnValue(stubCountries);
    spyOn(Hotel, 'query').and.returnValue(stubHotels);
    spyOn(Place, 'query').and.returnValue(stubPlaces);

    $controller('AdminToursController', {$scope: $scope, Tour: Tour, Country: Country, Hotel: Hotel, Place: Place});
  }));

  describe('initialize', function() {
    it('sets pageName to Tours', function() {
	  expect($scope.pageName).toBe('Admin Tours');
  	});

    it('sets countries, places, tours arrays', function() {
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
    it('expects 2 POST request to parse.com create point', function() {
      $httpBackend.expectPOST(hotelAPIUrl).respond(201);
      $httpBackend.expectPOST(tourAPIUrl).respond(201, {"objectId":"1"});
      $httpBackend.expectGET('https://api.parse.com/1/classes/tours/1?include=country,hotel,place').respond(200, stubTour);      
	    
      $scope.create();
      $httpBackend.flush();

      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('sets error about failed request if hotel creation trow exception', function() {
      $httpBackend.whenPOST(hotelAPIUrl).respond(500);
      $scope.create();
      $httpBackend.flush();

      expect($scope.errorMessage).toBeDefined();
    });

    it('sets error about failed request if tour creation trow exception', function() {
      $httpBackend.whenPOST(hotelAPIUrl).respond(201);
      $httpBackend.whenPOST(tourAPIUrl).respond(500);
      $scope.create();
      $httpBackend.flush();

      expect($scope.errorMessage).toBeDefined();
    });    

    it('expects "push" function is called', function() {
      $httpBackend.expectPOST(hotelAPIUrl).respond(201);
      $httpBackend.expectPOST(tourAPIUrl).respond(201, {"objectId":"1"});
      $httpBackend.expectGET('https://api.parse.com/1/classes/tours/1?include=country,hotel,place').respond(200, stubTour);

      spyOn($scope.hotels, 'push')
	    spyOn($scope.tours, 'push')

      $scope.create();
      $httpBackend.flush();

      expect($scope.hotels.push).toHaveBeenCalled();
      expect($scope.tours.push).toHaveBeenCalled();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('adds new hotel and tour to $scope', function() {
      $httpBackend.expectPOST(hotelAPIUrl).respond(201);
      $httpBackend.expectPOST(tourAPIUrl).respond(201, {"objectId":"1"});
      $httpBackend.expectGET('https://api.parse.com/1/classes/tours/1?include=country,hotel,place').respond(200, stubTour);

	    $scope.create();
      $httpBackend.flush();

      expect($scope.hotels.length).toBeGreaterThan(0);
      expect($scope.tours.length).toBeGreaterThan(0);
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });
  });

  describe('$scope.destroy', function() {
    beforeEach(function() {
      $httpBackend.expectDELETE('https://api.parse.com/1/classes/tours/1?include=country,hotel,place').respond(200);
    });

    it('expects DELETE request to parse.com', function() {
      $scope.destroy(0, $scope.tours[0])
      $httpBackend.flush();
      
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('expects \'splice\' function is called', function() {
      spyOn($scope.tours, 'splice')

      $scope.destroy(0, $scope.tours[0])
      $httpBackend.flush();

      expect($scope.tours.splice).toHaveBeenCalled();
    });

    it('expects one tour is removed from $scope.hotels', function() {
      $scope.destroy(0, $scope.tours[0])
      $httpBackend.flush();
      
      expect($scope.tours.length).toBe(0);
    });
  });
    
  describe('$scope.edit', function() {
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

  describe('$scope.update', function(){
    beforeEach(function() {
      $httpBackend.expectPUT('https://api.parse.com/1/classes/tours/1?include=country,hotel,place').respond(200);      
      $httpBackend.expectGET('https://api.parse.com/1/classes/tours/1?include=country,hotel,place').respond(200, stubTour);	
      $scope.tours[0].newPlaceId = stubPlace.objectId
      $scope.tours[0].newCountryId = stubCountry.objectId
      $scope.tours[0].newHotelId = stubHotel.objectId
    });

    it('expects PUT request to parse.com update point', function() {
      $scope.update($scope.tours[0]);
      $httpBackend.flush();

      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('expects tour attributes are changed after PUT request', function() {
      $scope.tours[0].title = 'NewTitle';
      $scope.tours[0].description = 'New Description';
      $scope.tours[0].price = 1000;
      $scope.tours[0].duration = 50;
      $scope.tours[0].place.objectId = 2;
      $scope.tours[0].country.objectId = 2;
      $scope.tours[0].hotel.objectId = 2;

      $scope.update($scope.tours[0]);
      $httpBackend.flush();

      expect($scope.tours[0].title).toBe('NewTitle');
      expect($scope.tours[0].description).toBe('New Description');
      expect($scope.tours[0].price).toBe(1000);
      expect($scope.tours[0].duration).toBe(50);
      expect($scope.tours[0].place.objectId).toBe(2);
      expect($scope.tours[0].country.objectId).toBe(2);
      expect($scope.tours[0].hotel.objectId).toBe(2);
      expect($scope.tours[0].isModified).toBeUndefined();

      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });
  });

  describe('$scope.cancelEdit', function() {
    beforeEach(function() {
      $scope.edit(0, $scope.tours[0])
    });

    it('expects restore hotel attributes values', function() {
  	  $scope.tours[0].title = 'NewTitle';
      $scope.tours[0].description = 'New Description';
      $scope.tours[0].price = 1000;
      $scope.tours[0].duration = 50;
      $scope.tours[0].place.objectId = 2;
      $scope.tours[0].country.objectId = 2;
      $scope.tours[0].hotel.objectId = 2;

      $scope.cancelEdit(0, $scope.tours[0])

      expect($scope.tours[0].title).not.toBe('NewTitle');
      expect($scope.tours[0].description).not.toBe('New Description');
      expect($scope.tours[0].price).not.toBe(1000);
      expect($scope.tours[0].duration).not.toBe(50);
      expect($scope.tours[0].place.objectId).not.toBe(2);
      expect($scope.tours[0].country.objectId).not.toBe(2);
      expect($scope.tours[0].hotel.objectId).not.toBe(2);
    });

    it('sets hotel.isModified value to null', function() {
      $scope.cancelEdit(0, $scope.tours[0])

      expect($scope.hotels[0].isModified).toBeUndefined()
    });
  });

  describe('$scope.cancelNewTour', function() {
  	it('expects $scope.showForm value is true and attributes are null', function() {
      $scope.new();
      $scope.newTour.title = 'NewTitle';
      $scope.newTour.description = 'New Description';
      $scope.newTour.price = 1000;
      $scope.newTour.duration = 50;
      $scope.newTour.place.objectId = 2;
      $scope.newTour.country.objectId = 2;
      $scope.newTour.hotel.objectId = 2;

      $scope.cancelNewTour();

      expect($scope.showForm).toBeFalsy();
      expect($scope.newTour.title).toBeNull();
      expect($scope.newTour.description).toBeNull();
      expect($scope.newTour.price).toBeNull();
      expect($scope.newTour.duration).toBeNull();
      expect($scope.newHotel.title).toBeNull();
      expect($scope.newHotel.stars).toBeNull();
      expect($scope.newTour.country.objectId).toBeNull();
      expect($scope.newTour.place.objectId).toBeNull();
    });
  });
});