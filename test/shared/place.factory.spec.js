describe('Place', function() {
  beforeEach(module('toursModule'));

  var $httpBackend = null;
  var Place = null;
  var placeAPIUrl = 'https://api.parse.com/1/classes/places';

  beforeEach(inject(function(_$httpBackend_, _Place_){
    $httpBackend = _$httpBackend_;
    Place = _Place_;
  }));

  describe('query', function(){
    var placesResponseData = [{ title: 'TestPlace' }]
    var jsonResponse = JSON.stringify({ results: placesResponseData });

    beforeEach(function(){
      $httpBackend.expectGET(placeAPIUrl).respond(jsonResponse);
    });

    it('requests to API', function(){
      Place.query();
      $httpBackend.flush();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('get data from API', function(){
      var response = Place.query();
      $httpBackend.flush();
      expect(angular.equals(response, placesResponseData)).toBe(true);
    });
  });

  describe('update', function(){
    var placeAPIUrl = 'https://api.parse.com/1/classes/places/1';

    it('requests to API', function(){
      var place = new Place({ objectId: 1, title: 'TestTour' })
      $httpBackend.expectPUT(placeAPIUrl).respond(200);
      place.$update();
      $httpBackend.flush();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });
  });
});