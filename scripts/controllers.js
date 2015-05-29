'use strict';
    
app.controller('MainController', function($scope,$http,premieresService){
    $scope.tvshows = [];
    $scope.sortBy = 'date';
    $scope.availableGenres = [];
    $scope.availableNetworks = [];
    $scope.genreFilter = null;
    $scope.networkFilter = null;
    $scope.modulus = 0;
    

    var mainNetworks = ['CBS','NBC','FOX (US)','The CW','ABC (US)','PBS','AMC','HBO','A&E','E!','Bravo','Comedy Central','MTV','ABC Family','Disney Channel','Showtime','Netflix','USA Network','FX','TBS'];
    var networkFilteredList = [];
    var pageSize = 20;
    var pagesShown = 1;
    var errorMsg = 'There seems to be an problem with the data source. Please refresh or try again later. I apologize for the inconvenience.';


    premieresService.getPremieres().success(function(data){
        $('#loading').hide();
        // create filtered list of shows with preferred networks
        angular.forEach(data, function(tvshow){
            if(isMainNetwork(tvshow)) {
                networkFilteredList.push(tvshow);
            }
        });

        // format data from filtered network list
        angular.forEach(networkFilteredList, function(tvshow){
            // format premiere date
            tvshow.episode.date = moment(tvshow.episode.first_aired).format('MMM Do, YYYY');

            // format airdate and timezone
            if(tvshow.show.airs.day && tvshow.show.airs.time){
                 tvshow.show.airdate = tvshow.show.airs.day;
                 tvshow.show.airtime = formatAirTime(tvshow.show.airs.time);

                 tvshow.show.timezone = formatTimezone(tvshow);
                 if (tvshow.show.network == 'Netflix') {
                    tvshow.show.airdate = 'N/A';
                    tvshow.show.timezone = '';
                    tvshow.show.airtime = '';
                 }
            }
            else {
                tvshow.show.airdate = 'N/A';
            }

            // strip "(US)" from networks
            tvshow.show.network = tvshow.show.network.replace('(US)','');

            // check a shows' genre and add to master genre list if not already present
            angular.forEach(tvshow.show.genres, function(genre){
                var genreExists = checkGenreList(genre);
                if (!genreExists && genre != '') {
                    $scope.availableGenres.push(genre);
                }
            });

            // check a shows' network and add to master network list if not already present
            var network = tvshow.show.network;
            var networkExists = checkNetworkList(network);
            if (!networkExists && network != '') {
                $scope.availableNetworks.push(network);
            }

            // add format show to final tv shows list
            $scope.tvshows.push(tvshow);

        });

        // sort genres and networks alphabetically for dropdown
        $scope.availableGenres.sort();
        $scope.availableNetworks.sort();
    })
    .error(function(){
        $('#loading').hide();
        $('.container').append('<div class=\'feed-error\'<p>'+errorMsg+'</p></div>');
    });

    var isMainNetwork = function(tvshow) {
        // check to see if tv show is on a main network
        if(mainNetworks.indexOf(tvshow.show.network) > -1) {
            return true;
        }
        else {
            return false;
        }
    }

    var formatAirTime = function(airtime) {
        var timeArr = airtime.split(':');
        var hours = parseInt(timeArr[0]);;
        var minutes = parseInt(timeArr[1]);
        var formattedAirTime;

        if(hours >= 12) {
            hours = hours - 12;
        }

        var central = hours - 1;
    
        if(minutes > 0) {
            formattedAirTime = hours +':' +minutes +'/' +central+':' +minutes +' Central';
        }
        else {
            formattedAirTime = hours +'/' + central +' Central';
        }

        return formattedAirTime;
    }

    var formatTimezone = function(tvshow) {
        var timezone;
        switch(tvshow.show.airs.timezone) {
            case 'America/New_York':
                timezone = 'EST';
                break;

            case 'Europe/London':
                timezone = 'GMT';
                break;

            default:
                timezone = '';
        }
        return timezone; 
    }

    var checkGenreList = function(genre) {
        var exists = false;
        angular.forEach($scope.availableGenres, function(availableGenre){
            if (genre == availableGenre) {
                exists = true;
            }
        });
        return exists;
    }

    var checkNetworkList = function(network) {
        var exists = false;
        angular.forEach($scope.availableNetworks, function(availableNetwork){
            if (network == availableNetwork) {
                exists = true;
            }
        });
        return exists;
    }

    // Date and Title sorting
    $scope.sortOrder = function(tvshow){
        switch($scope.sortBy){
            case 'date':
                return tvshow.episode.first_aired;
                break;
            
            case 'title':
                return tvshow.show.title;
                break;
        }
    }

    // View More Pagination
    $scope.paginationLimit = function(data) {
        return pageSize * pagesShown;
    }

    $scope.hasMoreItemsToShow = function() {
        return $scope.filteredtvshows.length%pageSize == 0;
    }

    $scope.showMoreItems = function() {
        return pagesShown += 1;
    }
});

