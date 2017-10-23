/**
  * @ngdoc function
  * @name microscopeClient.controller:DashboardCtrl
  * @description
  * Binds metadata about the information collected from microservice to our view.
  * Also responsible for long-pulling new data every 5 seconds, or on constraint changes.
 */
angular.module('microscopeClient').controller('DashboardCtrl', function($scope, $interval, DataService) {

  // Initialize our data structure with the appropriate initial variables.
  $scope.data = {
    num_services: 0,
    flow_overall: 0,
    currentService: 'All Services',
    startDate: new Date(),
    endDate: new Date()
  };

  // Our interval control slider object
  $scope.slider = {
    value: 5,
    options: {
      floor: 1,
      ceil: 10,
      showTicks: true,
      onChange: function () {
        // Update our refresh interval when the slider changes
        $interval.cancel($scope.updateInterval);
        $scope.updateInterval = $interval(updateGraph, $scope.slider.value * 1000);
      }
    }
  };

  // This will eventually hold all the unique services we have aggregated on the backend
  $scope.services = [];

  // This will house the data structure we wish to visualize
  $scope.sankeyGraph = [];

  // Determine whether or not our F->T is included in our constraint
  function proceedKey(f, t) {
    return (f === $scope.data.currentService ||
            t === $scope.data.currentService ||
            $scope.data.currentService === 'All Services')
  }

  // Function to convert our JSON Data to Google JSAPI Sankey Data Table
  function convertToSankey(data) {
      result = [];

      data.map(function(entry) {
        if(proceedKey(entry.from, entry.to)) {
          result.push([entry.from, entry.to, entry.count]);
        }
      });

     return(result);
  }

  // Function to long pull metadata / data from microservice using the DataService Factory
  function updateGraph() {
    console.log("Updating Graph");

    var start = moment($scope.data.startDate).format('YYYY-MM-DD HH:mm:ss.sss');
    var end = moment($scope.data.endDate).format('YYYY-MM-DD HH:mm:ss.sss');

    // Get our distinct services, and prepend 'All Services' to the initial list
    DataService.getDistinctServices().then(
      function(data) {
        $scope.services = data;
        $scope.services.unshift('All Services')
        $scope.data.num_services = data.length;
      },
      function(err) { console.log(err); }
    );

    // Get the overall number of data points we have
    DataService.count().then(
      function(data) { $scope.data.flow_overall = data },
      function(err) { console.log(err); }
    );

    // Fetch the sankey diagram data
    DataService.getBetween(start, end).then(
      function(data) {
        $scope.sankeyGraph = convertToSankey(data);
      },
      function(err) { console.log(err); }
    );
  }

  // Update the graph on page load
  $scope.init = function() { updateGraph() }

  // Propogate our new service view constraint and udpate our visualization
  $scope.setService = function(service) {
    $scope.data.currentService = service;
    updateGraph();
  }

  // Watch for changes in the start or end date constraint, and update our visualization
  $scope.$watchGroup(['data.startDate', 'data.endDate'], function(newVal, oldVal) {
    updateGraph();
  });

  // Update graph every 5000 milliseconds (5 seconds)
  $scope.updateInterval = $interval(updateGraph, $scope.slider.value * 1000);

});
