describe('Place', function() {
  beforeEach(module('toursModule'));

  var $httpBackend = null;
  var Hotel = null;
  var hotelAPIUrl = 'https://api.parse.com/1/classes/hotels';

  beforeEach(inject(function(_$httpBackend_, _Hotel_){
    $httpBackend = _$httpBackend_;
    Hotel = _Hotel_;
  }));

  describe('query', function(){
    var hotelsResponseData = [{ title: 'TestHotel' }]
    var jsonResponse = JSON.stringify({ results: hotelsResponseData });

    beforeEach(function(){
      $httpBackend.expectGET(hotelAPIUrl).respond(jsonResponse);
    });

    it('fetches data by request to API', function(){
      var response = Hotel.query();
      $httpBackend.flush();
      expect(angular.equals(response, hotelsResponseData)).toBe(true);
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });
  });

  describe('update', function(){
    var hotelAPIUrl = 'https://api.parse.com/1/classes/hotels/1';

    it('requests to API', function(){
      var hotel = new Hotel({ objectId: 1, title: 'TestTour' })
      $httpBackend.expectPUT(hotelAPIUrl).respond(200);
      hotel.$update();
      $httpBackend.flush();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });
  });
});