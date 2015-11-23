describe('TourController', function() {
  beforeEach(module('toursModule'));
  var $scope = {};
  var tourAPIUrl = 'https://api.parse.com/1/classes/tours/1?include=hotel';
  var $httpBackend = null;
  var stubTour = {title: "TestTour", objectId: 1}

  beforeEach(inject(function($controller, _$httpBackend_) {
  	$controller('TourController', {$scope: $scope, $routeParams: {id: stubTour.objectId}});
  	$httpBackend = _$httpBackend_;
  }));

  it('expects call to parse.com', function() {
  	$httpBackend.expectGET(tourAPIUrl).respond(200);
  	expect($httpBackend.verifyNoOutstandingExpectation).not.toThrow();
  });

  it('initialize tour', function() {
  	$httpBackend.whenGET(tourAPIUrl).respond(200, JSON.stringify({results: [stubTour]}));
  	$httpBackend.flush();

  	expect($scope.tour.results[0]).toEqual(stubTour);
  });

})