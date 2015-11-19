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
  	stubHotel = {title: 'Test Hotel', stars: 5};
  	stubCountry = {name: 'Belarus'};
  	stubPlace = {name: 'Test Place'};
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
});