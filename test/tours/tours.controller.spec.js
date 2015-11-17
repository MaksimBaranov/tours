describe('ToursController', function() {
  beforeEach(module('toursModule'));
  var $scope = {};

  beforeEach(inject(function($controller) {
  	$controller('ToursController', {$scope: $scope});
  }));

  it('sets pageName to Tours', function() {
  	expect($scope.pageName).toBe('Tours');
  });
  
});