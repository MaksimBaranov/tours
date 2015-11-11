describe('AdminHotelsController', function() {
  
  beforeEach(module('toursModule'));
  var $scope = {};
  var HotelAPIUrl = 'https://api.parse.com/1/classes/hotels';
  
  var $httpBackend = null;

  beforeEach(inject(function($controller, _$httpBackend_) {
  	$controller('AdminHotelsController', {$scope: $scope});
  	$httpBackend = _$httpBackend_;
  	// $httpBackend.whenGET(TourAPIUrl).respond(200);
  }));

  describe('initialize controller', function() {
  	it('sets pageName to Hotel', function(){
  		expect($scope.pageName).toBe('Admin Hotels');
  	});

  	it('expect call to parse.com', function() {
  		$httpBackend.expectGET(HotelAPIUrl).respond(200);
  		expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
  	});

    it('sets $scope.hotels an array of hotels', function() {
      var 
      jsonResponse = JSON.stringify({resuls: [hotels]})
      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse) 
    });
  });

});