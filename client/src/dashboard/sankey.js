angular.module('microscopeClient').directive('sankey', function() {
	// Set our static SANKEY div_id for Google to render it.
	var divId = 'sankey_basic';
	return {
		restrict: 'E',
		template: '<div id="'+divId+'" style="width: 100%;height: 100%;"></div>',
		scope: {
			//@ reads the attribute value, = provides two-way binding, & works with functions
			graph: '=',
			width: '@',
			height: '@',
			releativeSizeNode: '='
		},
		link: function (scope, element, attrs) {
			// Initialize our visualization data table, and assign the appropriate headers
			// Also pass in our data-bound `scope.graph` from our DashboardCtrl
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'From');
      data.addColumn('string', 'To');
      data.addColumn('number', 'Weight');
      data.addRows(scope.graph);

			// Make the graph look pretty by assigning a set array of Hex Colors to choose from
			var colors = ['#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f',
                  '#cab2d6', '#ffff99', '#1f78b4', '#33a02c'];

			// Set options for the Sankey Visualization
	    var options = {
	      height: 600,
	      sankey: {
	        node: {
	          colors: colors
	        },
	        link: {
	          colorMode: 'gradient',
	          colors: colors
	        }
	      }
	    };

      // Instantiates and draws our chart, passing in some options.
      var chart = new google.visualization.Sankey(document.getElementById(divId));
      chart.draw(data, options);

			// Look for updates on the bound graph object, so that we can re-render
			scope.$watch('graph', function(newVal, oldVal) {
				data.removeRows(0, oldVal.length);
				data.addRows(newVal);
				chart.draw(data, options);
			});
		}
	};
});
