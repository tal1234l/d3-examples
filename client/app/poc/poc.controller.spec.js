'use strict';

describe('Controller: PocCtrl', function () {

  // load the controller's module
  beforeEach(module('portfolioApp'));

  var PocCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PocCtrl = $controller('PocCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
