'use strict';

describe('Controller: RevenueCtrl', function () {

  // load the controller's module
  beforeEach(module('portfolioApp'));

  var RevenueCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RevenueCtrl = $controller('RevenueCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
