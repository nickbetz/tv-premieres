'use strict';
angular.module('tvpremieres')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.apiKey = '133c23f27248caa13fda1bf15fbc81ce';
    $scope.tvshows = [];
    $scope.sortBy = 'date';
    $scope.availableGenres = [];
    $scope.availableNetworks = [];
    $scope.genreFilter = null;
    $scope.networkFilter = null;

    var today = new Date();
    var apiDate = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);
    var errorMsg = 'There seems to be an problem with the data source. Please refresh or try again later. I apologize for the inconvenience.';


    $http.jsonp('http://api.trakt.tv/calendar/premieres.json/' + $scope.apiKey + '/' + apiDate + '/' + 30 + '/?callback=JSON_CALLBACK')

        .success(function(data){
            $('#loading').hide();

            // Make each show it's own object
            angular.forEach(data, function(value){
                // Store the air date
                var airDate = value.date;

                angular.forEach(value.episodes, function(tvshow){
                    // Move the date into each show object
                    tvshow.date = airDate;

                    // Format country to use with flag images
                    if(tvshow.show.country != null){
                        tvshow.show.country = tvshow.show.country.replace(' ','-');
                    }

                    // create a list of genres
                    angular.forEach(tvshow.show.genres, function(genre){
                        var exists = false;
                        angular.forEach($scope.availableGenres, function(availableGenre){
                            if (availableGenre == genre) {
                                exists = true;
                            }
                        });
                        if (exists === false && genre != '') {
                            $scope.availableGenres.push(genre);
                        }

                    });

                    // create a list of networks
                    var network = tvshow.show.network;
                    var networkExists = false;
                    angular.forEach($scope.availableNetworks, function(availableNetwork){
                            if (availableNetwork == network) {
                                networkExists = true;
                            }
                    });
                    if (networkExists === false && network != '') {
                            $scope.availableNetworks.push(network);
                    }

                    // preserve unformated date for sorting
                    var unformatedDate = tvshow.date;

                    // Format date to be more readable
                    tvshow.date = moment(tvshow.date).format('MMMM DD');

                    // Update format of airtime
                    tvshow.show.air_time = tvshow.show.air_time.split(':')[0];

                    // Date and Title sorting
                    $scope.sortOrder = function(tvshow){
                        switch($scope.sortBy){
                            case 'date':
                                return unformatedDate;
                                break;
                            
                            case 'title':
                                return tvshow.show.title;
                                break;

                            case 'network':
                                return tvshow.show.network;
                                break;
                        }
                    }

                    // Push the new object into our own array
                    $scope.tvshows.push(tvshow);

                    // Sort the genre and network filters
                    $scope.availableGenres.sort();
                    $scope.availableNetworks.sort();
                  });
              });
        })
        .error(function(){
            $('#loading').hide();
            $('.container').append('<div class=\'feed-error\'<p>'+errorMsg+'</p></div>');
        });

    })

.directive("qtip", function ($compile, $templateCache) {
  var clone = $compile($templateCache.get("qtip.html"));

  function link (scope, el, attr) {
    el.qtip({
      position: {
        at: "bottom center"
      },
      style: {
        tip: {
          corner: "top left"
        },
        classes: "qtipCustom"
      },
      content: {
        text: function () {
          return scope.$apply(function () {
            return clone(scope);
          });
        }
      }
    });
  }
  return {
    link: link,
    scope: {
      text: "=qtip"
    }
  };
})

.filter('seriespremiere', function() {
    return function(shows,input){

        var filtered = [];

        if (input == true) {
            for(var i = 0; i < shows.length; i++){
                var show = shows[i];
                if (show.episode.season == 1){
                    filtered.push(show); 
                }      
            }
            return filtered;
        }

        else {
            return shows;
        }        
    }
})

.filter('country', function() {
    return function(shows,input){

        var filtered = [];

        if (input == true) {
            for(var i = 0; i < shows.length; i++){
                var show = shows[i];
                if (show.show.country == 'United-States'){
                    filtered.push(show); 
                }      
            }
            return filtered;
        }
        
        else {
            return shows;
        }        
    }
})

.filter('genres', function() {
    return function(input,genre) {
        if (typeof genre == 'undefined' || genre == null) {
            return input;
        } 
        else {
            var filtered = [];
            for (var a = 0; a < input.length; a++){
                for (var b = 0; b < input[a].show.genres.length; b++){
                    if(input[a].show.genres[b] == genre) {
                        filtered.push(input[a]);
                    }
                }
            }
            return filtered;
        }
    };
})

.filter('networks', function() {
    return function(input,network) {
        if (typeof network == 'undefined' || network == null) {
            return input;
        } 
        else {
            var filtered = [];
            for (var a = 0; a < input.length; a++){
                    if(input[a].show.network == network) {
                        filtered.push(input[a]);
                    }
                
            }
            return filtered;
        }
    };
})