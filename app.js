var app = angular.module('Tours', []);

app.controller('ToursController', function($scope){
  $scope.labelName = 'Tours';
  $scope.tour = {
      title: 'from Minsk to Rome',
      country: 'Rome',
      price: '10000',
      text: 'Rome today is one of the most important tourist destinations of the world, due to the incalculable immensity of its archaeological and art treasures, as well as for the charm of its unique traditions, the beauty of its panoramic views, and the majesty of its magnificent "villas" (parks). Among the most significant resources: plenty of museums - (Capitoline Museums, the Vatican Museums, Galleria Borghese, and a great many others)—aqueducts, fountains, churches, palaces, historical buildings, the monuments and ruins of the Roman Forum, and the Catacombs. Rome is the 3rd most visited city in the EU, after London and Paris, and receives an average of 7-10 million tourists a year, which sometimes doubles on holy years.'
  }
});


