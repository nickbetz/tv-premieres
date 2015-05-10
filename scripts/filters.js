app.filter('genres', function() {
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
});