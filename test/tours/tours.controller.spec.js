describe('ToursController', function() {
  beforeEach(module('toursModule'));
  var $scope = {};

  beforeEach(inject(function($controller) {
  	$controller('ToursController', {$scope: $scope});
  }));

  it('sets pageName to Tours', function() {
  	//check $scope.pageName == 'Tours'
  	expect($scope.pageName).toBe('Tours');
  });
  
});