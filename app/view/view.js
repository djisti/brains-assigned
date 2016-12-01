'use strict';

var app = angular.module('brainsApp.view', ['ngRoute', 'ngTouch', 'ui.grid', 'ui.grid.autoResize', 'ui.grid.expandable', 'ui.grid.selection', 'ngAnimate', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view', {
    templateUrl: 'view/view.html',
	controller: 'tableCtrl'
  });
}]);

app.controller('tableCtrl', ['$scope', '$http', '$timeout', '$animate', function($scope, $http, $timeout, $animate) {

	$scope.gridOptions = {
		expandableRowTemplate: 'view/rowTemplate.html',
		expandableRowHeight: 150,
		showHeader: true,
		expandableRowScope: {
			subGridVariable: 'subGridScopeValue'
		},
		autoResize: true,
		enableColumnResize: true,
		enableSorting: true,
		onRegisterApi: function (gridApi) {
			gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
			  if (row.isExpanded) {
			    row.entity.subGridOptions = {
			      columnDefs: [
			      { name: 'Name'},
			      { name: 'YearOfBirth'},
			      { name: 'Mother'}
			    ]};

			    $animate.enabled('loader', true);
			    $timeout(function () {
				    $http.get('http://assignment.siteimprove.com/api/persondetails/'+row.entity.Id)
				      .then(function(response) {
				        row.entity.subGridOptions.data = response.data;
				        $animate.enabled('loader', false);
				      });
			    }, 3000);
			  }
			});
		}
    };
	$scope.gridOptions.columnDefs = [
	             { field: 'Id' },
	             { field: 'Name', name: 'Name' },
	             { field: 'YearOfBirth', name: 'Year of Birth' },
	             { field: 'NumChildren', name: 'Children' },
	             { field: 'Profession', name: 'Profession', enableHiding: true }
	        ];

	$timeout(function () {
		$http.get('http://assignment.siteimprove.com/api/persons?callback=JSON_CALLBACK')
		 .then(function(response) {
		 	for (var i = 0; i < response.data.length; i++) {
				response.data[i].subGridOptions = {
					columnDefs: [
						{name: 'Id'},
						{name: 'Name', field:'Name'},
						{field: 'YearOfBirth', name: 'Year of Birth'},
						{field: 'Mother', name: 'Mother'}
					],
					data: response.data[i]
				}
		    }
		   $scope.gridOptions.data = response.data;
		 });

		$scope.gridOptions.onRegisterApi = function(gridApi) {
		    $scope.gridApi = gridApi;
	    };
	}, 3000);

}]);

app.directive('gridLoading', function () {
	return {
		restrict: 'C', require: '^uiGrid', link: function ($scope, $elm, $attrs, uiGridCtrl) {
			$scope.grid = uiGridCtrl.grid;
		}
	}
});