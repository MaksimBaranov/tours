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
    });
  });


  // desribe('$scope.new', function() {

  // });

  describe('$scope.create', function() {
    it('expect POST request to parse.com create point', function(){
      // waiting for request to server
      $httpBackend.whenPOST(hotelAPIUrl).respond(201);
      $scope.create();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    // it('', function(){

    // });
  });
});