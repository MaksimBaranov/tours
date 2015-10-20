angular.module('Tours', ['ngRoute'])
.config(function($routeProvider)) {
  $routeProvider
  .when('/',{
    templateUrl: "views/tours/index.html",
    contoller: 'tours_controller'
  })
}




