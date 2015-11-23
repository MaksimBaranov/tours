angular.module('toursModule').controller('AdminToursController', function($scope, $location, $resource){
  $scope.pageName = 'Admin Tours';
  
  var Tour = $resource(
    'https://api.parse.com/1/classes/tours/:objectId?include=country,hotel,place',
    {objectId: '@objectId'},
    {
      query: {isArray: true, transformResponse: parseServerResults},
      update: {method: 'PUT'}
    }
  );

  var Country = $resource(
    'https://api.parse.com/1/classes/countries/:objectId',
    {objectId: '@objectId'},
    {query: {isArray: true, transformResponse: parseServerResults}}
  );

  var Place = $resource(
    'https://api.parse.com/1/classes/places/:objectId',
    {objectId: '@objectId'},
    {query: {isArray: true, transformResponse: parseServerResults}}
  );

  var Hotel = $resource(
    'https://api.parse.com/1/classes/hotels/:objectId',
    {objectId: '@objectId'},
    {query: {isArray: true, transformResponse: parseServerResults}}
  );

  $scope.tours = Tour.query();
  $scope.countries = Country.query();
  $scope.places = Place.query();
  $scope.hotels = Hotel.query();

  $scope.filter = {};
  $scope.backupToursCollection = [];

  // CRUD actions
  $scope.new = function() {
    $scope.newTour  = emptyTour();
    $scope.newHotel = emptyHotel();
    $scope.showForm = true;
  };

  $scope.create = function() {
    var hotelToServer = new Hotel($scope.newHotel)
    var tourToServer = new Tour($scope.newTour);


    hotelToServer.$save().then(
      function(hotel) {
        var hotelFromServer = angular.extend(hotel, $scope.newHotel);
        $scope.hotels.push(hotelFromServer);
        tourToServer.hotel.objectId = hotelFromServer.objectId;
        
        tourToServer.$save().then(
          function(tour) {
            loadNewTour(tour);
            $scope.tours.push(tour);
            $scope.newTour = emptyTour();
            $scope.newHotel = emptyHotel();
            $scope.showForm = false;
          }         
        ).catch(function(SaveTourErr) {
          $scope.errorMessage = SaveTourErr;  
        })
      }
    ).catch(function(SaveHotelErr) {
      $scope.errorMessage = SaveHotelErr;  
    })
  };

  $scope.edit = function(index, tour) {
    putTourToBackup(index, tour);
    tour.newPlaceId = tour.place.objectId;
    tour.newCountryId = tour.country.objectId;
    tour.newHotelId = tour.hotel.objectId;
    tour.isModified = true;
  };

  $scope.update = function(tour) {
    var tourToServer = angular.copy(tour)
    tourToServer.place = {
        __type: 'Pointer',
        className: 'places',
        objectId: tour.newPlaceId
      };
    tourToServer.country = {
        __type: 'Pointer',
        className: 'countries',
        objectId: tour.newCountryId
      };
    tourToServer.hotel = {
      __type: 'Pointer',
        className: 'hotels',
        objectId: tour.newHotelId
      };

    removeHelpAttributes(tourToServer);
    removeHelpAttributes(tour);
    
    Tour.update({objectId: tourToServer.objectId}, tourToServer);
    loadNewTour(tour);
  };

  $scope.destroy = function(index, tour) {
    Tour.delete({objectId: tour.objectId}, function() {
      $scope.tours.splice(index, 1);  
    });
  };

  // Form Helpers
  $scope.cancelEdit = function(index, tour) {
    getTourFromBackup(index, tour);
    
  };

  $scope.cancelNewTour = function() {
    $scope.showForm = false;
    $scope.newTour = emptyTour();
  };

  // Actions' helpers
  function parseServerResults(data, headerGetter) {
    data = angular.fromJson(data);
    return data.results;
  };

  function loadNewTour(tour) {
    Tour.get({objectId: tour.objectId}, function(tourFromServer) {
      angular.extend(tour, tourFromServer);
    });
    return tour;
  }

  function emptyTour() {
    return {
      title: null,
      description: null,
      price: null,
      duration:null,
      place:{
        __type: 'Pointer',
        className: 'places',
        objectId: null
      },
      country: {
        __type: 'Pointer',
        className: 'countries',
        objectId: null
      },
      hotel: {
        __type: 'Pointer',
        className: 'hotels',
        objectId: null
      }
    }
  };

  function emptyHotel() {
    return {
      title: null,
      stars: null  
    }
  };

  function removeHelpAttributes(tour) {
    delete tour.newPlaceId;
    delete tour.newCountryId;
    delete tour.newHotelId;
    delete tour.isModified;
  }

  function putTourToBackup(index, tour) {
    var backupItem = angular.copy(tour);
    $scope.backupToursCollection[index] = backupItem;
  };

  function getTourFromBackup(index, tour) {
    angular.extend(tour, $scope.backupToursCollection[index]); 
  };
});
