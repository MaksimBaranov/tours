angular.module('toursModule')
.config(function($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider
  .when('/admin/tours', {
    templateUrl: "app/components/admin/tours/toursView.html",
    controller: 'AdminToursController'
  })
  .when('/admin/countries', {
    templateUrl: 'app/components/admin/countries/countriesView.html',
    controller: 'AdminCountriesController'
  })
  .when('/admin/places', {
    templateUrl: 'app/components/admin/places/placesView.html',
    controller: 'AdminPlacesController'
  })
  .when('/admin/hotels', {
    templateUrl: 'app/components/admin/hotels/hotelsView.html',
    controller: 'AdminHotelsController'
  })
  .when('/',{
    templateUrl: "app/components/tours/toursView.html",
    controller: 'ToursController'
  })
  .when('/tour/:id', {
    templateUrl: "app/components/tour/tourView.html",
    controller: "TourController"
  }).otherwise({
    templateUrl: 'app/shared/404/404View.html'
  })

  $locationProvider.html5Mode(true);

  $httpProvider.defaults.headers.common = {
    "X-Parse-Application-Id": "ZIRIkCOLK21MS6Us2FQRzYp7GkD2YD9IcdiAAqS8",
    "X-Parse-REST-API-Key": "ggk5tVA6hSyGQ2Fpi628lpmx3irmuESExdgzezLe"
  };
});
