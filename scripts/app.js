'use strict';

angular
  .module('tvpremieres', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.utils'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
