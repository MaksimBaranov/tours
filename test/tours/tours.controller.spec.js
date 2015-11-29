describe('ToursController', function() {
  beforeEach(module('toursModule'));
  var $scope = {};
  var $httpBackend = null;
  var stubCountries = [{name: 'Belarus'}];
  var stubPlaces = [{name: 'Test Place'}];
  var stubTours = [{title: 'Test tour', description: 'Test description', price: 2, objectId: 1,  country: stubCountries[0], place: stubPlaces[0]}];

  beforeEach(inject(function($controller, _$httpBackend_, _Tour_, _Country_, _Place_) {
    $httpBackend = _$httpBackend_;
    Tour = _Tour_;
    Country = _Country_;
    Place = _Place_;

    spyOn(Tour, 'query').and.returnValue(stubTours);
    spyOn(Country, 'query').and.returnValue(stubCountries);
    spyOn(Place, 'query').and.returnValue(stubPlaces);

  	$controller('ToursController', {$scope: $scope, Tour: Tour, Country: Country, Place: Place});
  }));

  it('sets pageName to Tours', function() {
  	expect($scope.pageName).toBe('Tours');
  });

  it('sets countries, places, tours arrays', function() {
    expect($scope.tours).toEqual(stubTours);
    expect($scope.countries).toEqual(stubCountries);
    expect($scope.places).toEqual(stubPlaces);
  });
});