describe('Country', function() {
  beforeEach(module('toursModule'));

  var $httpBackend = null;
  var Country = null;
  var countryAPIUrl = 'https://api.parse.com/1/classes/countries';

  beforeEach(inject(function(_$httpBackend_, _Country_){
    $httpBackend = _$httpBackend_;
    Country = _Country_;
  }));

  describe('query', function(){
    var countriesResponseData = [{ title: 'Testcountry' }]
    var jsonResponse = JSON.stringify({ results: countriesResponseData });

    beforeEach(function(){
      $httpBackend.expectGET(countryAPIUrl).respond(jsonResponse);
    });

    it('requests to API', function(){
      Country.query();
      $httpBackend.flush();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });

    it('get data from API', function(){
      var response = Country.query();
      $httpBackend.flush();
      expect(angular.equals(response, countriesResponseData)).toBe(true);
    });
  });

  describe('update', function(){
    var countryAPIUrl = 'https://api.parse.com/1/classes/countries/1';

    it('requests to API', function(){
      var country = new Country({ objectId: 1, title: 'TestTour' })
      $httpBackend.expectPUT(countryAPIUrl).respond(200);
      country.$update();
      $httpBackend.flush();
      expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
    });
  });
});