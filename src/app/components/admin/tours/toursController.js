angular.module('toursModule').controller('AdminToursController', function($scope, $http, Tour, Country, Hotel, Place){
  $scope.pageName = 'Admin Tours';
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

  $scope.uploadImage = function(file, tour) {
    $http.post('https://api.parse.com/1/files/'+file.name, file, {
      transformRequest: angular.identity
    }).then(function(data) {
      data = angular.fromJson(data);
      tour.image = { __type: 'File', name: data.data.name, url: data.data.url }
    });
  }

  // Form Helpers
  $scope.cancelEdit = function(index, tour) {
    getTourFromBackup(index, tour);
    removeHelpAttributes(tour);
  };

  $scope.cancelNewTour = function() {
    $scope.showForm = false;
    $scope.newTour = emptyTour();
  };

  $scope.imageTourRender = function(tour){
    return tour.image ? tour.image.url : '/assets/img/foto_not_found.jpeg'
  }

  // Actions' helpers
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
