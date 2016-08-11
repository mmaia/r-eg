'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$modal', '$location', '$anchorScroll',
  function ($scope, Authentication, $modal, $location, $anchorScroll) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    var lgnCtrl = this;

    $scope.animationsEnabled = true;
    $scope.openModal = function(){
      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'modules/core/views/home.modal.client.view.html',
        controller: 'AuthenticationController'
      });
    };

    lgnCtrl.goToFeatures = function(){
      $location.hash('features');
      $anchorScroll();
    };

    lgnCtrl.goToPricing = function(){
      $location.hash('pricing');
      $anchorScroll();
    };
  }
]);
