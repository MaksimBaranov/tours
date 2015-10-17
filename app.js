var app = angular.module('Tours', []);

app.controller('ToursController', function($scope){
  $scope.labelName = 'Tours';
  $scope.tours = [
    {
       title: 'from Minsk to Rome',
       country: 'Rome',
       price: '10000',
       description: 'Rome today is one of the most important tourist destinations of the world, due to the incalculable immensity of its archaeological and art treasures, as well as for the charm of its unique traditions, the beauty of its panoramic views, and the majesty of its magnificent "villas" (parks). Among the most significant resources: plenty of museums - (Capitoline Museums, the Vatican Museums, Galleria Borghese, and a great many others)—aqueducts, fountains, churches, palaces, historical buildings, the monuments and ruins of the Roman Forum, and the Catacombs. Rome is the 3rd most visited city in the EU, after London and Paris, and receives an average of 7-10 million tourists a year, which sometimes doubles on holy years.',
       is_modified: false
    },
    {
       title: 'From Brest to Berlin',
       country: 'Berlin',
       price: '50000',
       description: 'Berlin is an edgy city, from its fashion to its architecture to its charged political history. The Berlin Wall is a sobering reminder of the hyper-charged postwar atmosphere, and yet the graffiti art that now covers its remnants has become symbolic of social progress. Check out the Weltzeituhr (world time) Clock, topped by a model of the solar system, then turn back time by dining at the historic Zur Letzten Instanz, a 16th century restaurant that was frequented by Napoleon and Beethoven',
       is_modified: false
    }
  ];

  $scope.newTour = {
    title: null,
    country: null,
    description: null,
    price: null,
    is_modified: false
  };

  $scope.revertedVersion = {
    title: null,
    country: null,
    description: null,
    price: null,
    is_modified: null
}

  $scope.addTour = function() {
    $scope.tours.push(angular.copy($scope.newTour))
  };

  $scope.deleteTour = function(index) {
    $scope.tours.splice(index, 1)
  };

  $scope.editTour = function(tour) {
    $scope.revertedVersion = angular.copy(tour)
    tour.is_modified = true
  };

  $scope.saveTour = function(tour) {
    tour.is_modified = false
  };

  $scope.cancelEdit = function(tour) {
    tour.title = $scope.revertedVersion.title;
    tour.country = $scope.revertedVersion.country;
    tour.description = $scope.revertedVersion.description;
    tour.price = $scope.revertedVersion.price;
    tour.is_modified = false;
  }
});


