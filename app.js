angular.module('tours',  ['ngRoute'])
.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/admin/tours', {
    templateUrl: "/views/admin/tours/index.html",
    controller: 'AdminToursController'
  })
  .when('/admin/countries', {
    templateUrl: '/views/admin/countries/index.html',
    controller: 'AdminCountriesController'
  })
  .when('/',{
    templateUrl: "/views/tours/index.html",
    controller: 'ToursController'
  })
  .when('/tour/:slug', {
    templateUrl: "/views/tours/show.html",
    controller: "TourController"
  }).otherwise({
    // redirectTo: '/'
    redirectTo: function() {
        window.location = "/404.html";
    }
  })

  $locationProvider.html5Mode(true);
});

var allTours = JSON.parse(localStorage['tours']) || [];
var allCountries = JSON.parse(localStorage['countries']) || [];




