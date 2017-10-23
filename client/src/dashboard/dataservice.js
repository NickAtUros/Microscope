/**
  * @ngdoc service
  * @name microscopeClient.DataService
  * @description
  * Responsible for pulling information from the microservice about flow data / metadata
 */
angular.module('microscopeClient')
.config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
})
.factory('DataService', function($q, $http) {
  return {

    // GET Request to retrieve all distinct services that are available to filter on the dashboard
    getDistinctServices: function() {
      var dataPromise;
      dataPromise = $q.defer();
      $http.get('http://localhost:9000/distinctServices')
      .success(function(data, status, headers, config) {
        return dataPromise.resolve(data);
      }).error(function(data, status, headers, config) {
        return dataPromise.reject();
      });
      return dataPromise.promise;
    },

    // GET Request to retrieve the number of datapoints in order to display on our metadata row
    count: function() {
      var dataPromise;
      dataPromise = $q.defer();
      $http.get('http://localhost:9000/count')
      .success(function(data, status, headers, config) {
        return dataPromise.resolve(data);
      }).error(function(data, status, headers, config) {
        return dataPromise.reject();
      });
      return dataPromise.promise;
    },

    // POST Request to retrieve all our bounded metadata
    getBetween: function(start, end) {
      var dataPromise, messageData;

      dataPromise = $q.defer();

      messageData = {
        start: start,
        end: end
      };

      $http({
        url: 'http://localhost:9000/fetchBetween',
        method: 'POST',
        data: JSON.stringify(messageData),
        headers: {
          'Content-Type': 'application/json'
        }
      }).success(function(data, status, headers, config){
        return dataPromise.resolve(data);
      }).error(function(data, status, headers, config) {
        dataPromise.reject();
      });
      return dataPromise.promise
    }

  };
});
