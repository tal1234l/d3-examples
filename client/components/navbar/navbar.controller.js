'use strict';

angular.module('portfolioApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'customers',
      'link': '/'
    },
    {
      'title': 'poc',
      'link': '/poc'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
