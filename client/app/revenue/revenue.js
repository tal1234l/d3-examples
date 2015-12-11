'use strict';

angular.module('portfolioApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('revenue', {
        url: '/revenue',
        templateUrl: 'app/revenue/revenue.html',
        controller: 'RevenueCtrl'
      });
  });