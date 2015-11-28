describe('TourController', function() {
  beforeEach(module('toursModule'));
  var $scope = {};
  var $httpBackend = null;
  var stubTour = {title: "TestTour", objectId: 1}
  var Tour = null;

  beforeEach(inject(function($controller, _$httpBackend_, _Tour_) {
    Tour = _Tour_;
    $httpBackend = _$httpBackend_;
    spyOn(Tour, 'get').and.returnValue(stubTour);
    $controller('TourController', {$scope: $scope, Tour: Tour});
  }));

  it('initialize tour', function() {
  	expect($scope.tour).toEqual(stubTour);
  });

})