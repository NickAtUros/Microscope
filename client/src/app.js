require('angular');
require('angular-ui-router');
require('angular-bootstrap');
require('angular-bootstrap-datetimepicker');
require('angularjs-slider');

var css = require('./app.css');

/**
  * @ngdoc overview
  * @name microscopeClient
  * @description
  * Houses all of the states of the Microscope Client.
 */

angular.module('microscopeClient', ['ui.router', 'rzModule', 'ui.bootstrap', 'ui.bootstrap.datetimepicker'])
.config(function($stateProvider, $urlRouterProvider) {
  // Currently the only state, the main dashboard of the application.
  $stateProvider.state('dashboard', {
    url: '/dashboard',
    views: {
      'content': {
        templateUrl: './dashboard/dashboard.html',
        controller: 'DashboardCtrl'
      },
      'jumboMetadata@dashboard': { templateUrl: './dashboard/metadata.html' },
      'header': {
        templateUrl: './partials/nav.html'
      },
      'footer': {
        templateUrl: './partials/footer.html'
      }
    }
  });

  // Default to the dashboard view
  return $urlRouterProvider.otherwise('dashboard');
});

require('./dashboard');
