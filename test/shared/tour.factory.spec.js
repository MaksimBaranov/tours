describe('Tour', function() {
  beforeEach(module('toursModule'));

  var $httpBackend = null;
  var Tour = null;
  var tourAPIUrl = 'https://api.parse.com/1/classes/tours/?include=country,hotel,place';

  beforeEach(inject(function(_$httpBackend_, _Tour_){
    $httpBackend = _$httpBackend_;
    Tour = _Tour_;
  }));

  describe('query', function(){
    var toursResponseData = [{ title: 'TestTour' }]
    var jsonResponse = JSON.stringify({ results: toursResponseData });

    beforeEach(function(){
      $httpBackend.expectGET(tourAPIUrl).respond(jsonResponse);
    });

    it('fetches data by request to API', function(){
      var response = Tour.query();
      $httpBackend.flush();
      expect(angular.equals(response, toursResponseData)).toBe(true);
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });
  });

  describe('update', function(){
    var tourAPIUrl = 'https://api.parse.com/1/classes/tours/1?include=country,hotel,place';

    it('requests to API', function(){
      var tour = new Tour({ objectId: 1, title: 'TestTour' })
      $httpBackend.expectPUT(tourAPIUrl).respond(200);
      tour.$update();
      $httpBackend.flush();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });
  });
});
