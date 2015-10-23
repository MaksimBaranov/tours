angular.module('tours',  ['ngRoute'])
.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/',{
    templateUrl: "views/tours/index.html",
    controller: 'ToursController',
    publicAccess: true,
    resolve: {
      currentUser: function(){
        return {name: 'Maks'};
      }
  }
  })
  .when('/tour/:slug', {
    templateUrl: "views/tours/show.html",
    controller: "TourController",
    publicAccess: false
  }).otherwise({
    redirectTo: '/'
  })

  $locationProvider.html5Mode(true);
}).run(function($rootScope, $route, $location) {
  $rootScope.$on("$locationChangeStart", function(event, next, current){

    var nextPath = $location.path();
    var nextRoute = $route.routes[nextPath] || $route.routes['/tour/:slug'];

    if(!nextRoute.publicAccess) {
      alert('Please sign in');
      $location.path('/');
    }
  });
});





