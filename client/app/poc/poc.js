'use strict';

angular.module('portfolioApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('poc', {
        url: '/poc',
        templateUrl: 'app/poc/poc.html',
        controller: 'PocCtrl'
      });
  });