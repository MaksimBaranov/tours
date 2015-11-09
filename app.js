angular.module('tours',  ['ngRoute', 'ngResource'])
.config(function($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider
  .when('/admin/tours', {
    templateUrl: "/views/admin/tours/index.html",
    controller: 'AdminToursController'
  })
  .when('/admin/countries', {
    templateUrl: '/views/admin/countries/index.html',
    controller: 'AdminCountriesController'
  })
  .when('/admin/places', {
    templateUrl: '/views/admin/places/index.html',
    controller: 'AdminPlacesController'
  })
  .when('/admin/hotels', {
    templateUrl: '/views/admin/hotels/index.html',
    controller: 'AdminHotelsController'
  })
  .when('/',{
    templateUrl: "/views/tours/index.html",
    controller: 'ToursController'
  })
  .when('/tour/:id', {
    templateUrl: "/views/tours/show.html",
    controller: "TourController"
  }).otherwise({
    templateUrl: '/404.html'
  })

  $locationProvider.html5Mode(true);

  $httpProvider.defaults.headers.common = {
    "X-Parse-Application-Id": "ZIRIkCOLK21MS6Us2FQRzYp7GkD2YD9IcdiAAqS8",
    "X-Parse-REST-API-Key": "ggk5tVA6hSyGQ2Fpi628lpmx3irmuESExdgzezLe"
  };
});




