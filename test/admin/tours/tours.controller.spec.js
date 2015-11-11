// describe('AdminToursController', function() {
  
//   beforeEach(module('toursModule'));
//   var $scope = {};
//   var TourAPIUrl = 'https://api.parse.com/1/classes/tours/?include=country,hotel,place';
  
//   var httpBackend = null;

//   beforeEach(inject(function($controller, $httpBackend) {
//   	$controller('AdminToursController', {$scope: $scope});
//   	httpBackend = $httpBackend;
//   	// $httpBackend.whenGET(TourAPIUrl).respond(200);
//   }));

//   describe('initialize controller', function() {
//   	it('sets pageName to Tours', function(){
//   		expect($scope.pageName).toBe('Admin Tours');
//   	});

//   	it('expect call to parse.com', function() {
//   		httpBackend.expectGET(TourAPIUrl).respond(200);
//   		httpBackend.verifyNoOutstandingExpectation();
//   		// expect($httpBackend.verifyNoOutstandingExpectations).not.toThrow();
//   	});
//   });

// });