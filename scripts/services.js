app.factory('premieresService', ['$http', function($http){
    return {
        getPremieres: function(){
            var today = new Date;
            var startDate = moment(today).format('YYYY-MM-DD');
            var numDays = 200;
            var req = {
                method: 'GET',
                url: 'https://api-v2launch.trakt.tv/calendars/all/shows/premieres/'+startDate+'/'+numDays+'?extended=full',
                headers: {
                    'trakt-api-version': '2',
                    'trakt-api-key': 'd34303d48932f7cac3bdf38516ef933f345819c54bbe04976f82a6203c9c7688'
                }
            }
            return $http(req);
        }  
    }
}])