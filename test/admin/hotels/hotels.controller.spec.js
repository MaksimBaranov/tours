describe('AdminHotelsController', function() {
  
  beforeEach(module('toursModule'));
  var $scope = {};
  var hotelAPIUrl = 'https://api.parse.com/1/classes/hotels';
  var $httpBackend = null;

  beforeEach(inject(function($controller, _$httpBackend_) {
  	$controller('AdminHotelsController', {$scope: $scope});
  	$httpBackend = _$httpBackend_;
    // $httpBackend.whenGET(hotelAPIUrl).respond(200);
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


  // desribe('$scope.new', function() {

  // });

  describe('$scope.create', function() {
    it('expect POST request to parse.com create point', function(){
      $httpBackend.whenGET(hotelAPIUrl).respond('[]');
      $httpBackend.whenPOST(hotelAPIUrl).respond(201);
      $scope.create();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('push new hotel to $scope.hotels', function() {
      $httpBackend.whenGET(hotelAPIUrl).respond(200, '[]');
      $httpBackend.whenPOST(hotelAPIUrl).respond(201);
      spyOn($scope.hotels, 'push')
      $scope.create();
      $httpBackend.flush();
      expect($scope.hotels.push).toHaveBeenCalled();
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
    });

    it('add new hotel to $scope.hotels', function() {
      $httpBackend.whenGET(hotelAPIUrl).respond(200, '[]');
      $httpBackend.whenPOST(hotelAPIUrl).respond(201);
      $scope.create();
      $httpBackend.flush();
      expect($scope.hotels.length).toBeGreaterThan(0);
      expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();
    });
  });

  describe('$scope.destroy', function() {
    it('DELETE query to parse.com', function() {
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
      // expect(hotel).toEqual(localHotel);
      // expect(hotel.title).toBe(localHotel.title);
      // expect(hotel.stars).toBe(localHotel.stars);
      // // var hotel = $scope.hotels[0]
      // $scope.destroy(0, hotel);
      // expect($scope.hotels.length).toBe(0);
    });
  });


  // describe('tests $scope.removeTour', function(){
  //   it('performs DELETE query to parse.com', function(){
  //      $httpBackend.expectGET('tours.html').respond(200);
  //      $httpBackend.flush();
  //      $scope.removeTour(0);
  //      expect($scope.tours.length).toBe(0);
  //   });
  // });

  describe('$scope.update', function(){
    it('expect PUT request to parse.com update point', function() {
      var localHotel = {title: 'oldTitle', stars: 1, objectId: 1};
      jsonResponse = JSON.stringify({results: [localHotel]});
      $httpBackend.whenGET(hotelAPIUrl).respond(200, jsonResponse);
      $httpBackend.flush();
      $scope.hotels[0].title = 'newTitle';
      $scope.hotels[0].stars = 4;
      $httpBackend.whenPUT(hotelAPIUrl + '/' + localHotel.objectId).respond(200);
      $scope.update($scope.hotels[0]);
      expect($scope.hotels[0].title).toBe('newTitle')
      expect($scope.hotels[0].stars).toBe(4)
      expect($scope.hotels.length).toBe(1);
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    // it('expect changed hotel attributes', function() {
    //   $httpBackend.whenGET(hotelAPIUrl).respond(200, '[]');
    // }); 

    // $httpBackend.expectGET('tours.html').respond(200);
    //    $httpBackend.flush();
    //    $scope.tours[0].title = "newTitle";
    //    $scope.editTour(0);
    //    $httpBackend.expectPUT(hotelAPIUrl).respond(200);
    //    expect($httpBackend.verifyNoOutstandingRequest).not.toThrow();     
  });
});