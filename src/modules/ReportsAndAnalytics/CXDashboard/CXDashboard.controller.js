import CXDashboardEntry from './CXDashboardEntry.tsx';

angular.module('reports').value('CXDashboardEntry', CXDashboardEntry);

angular.module('reports').controller('CXDashboardCtrl', function ($scope, $rootScope, $state) {
    $rootScope.menuActive = 'reports';
    $scope.props = {
        ngStateRouter: $state,
        
        saveSvgAsPng: function (graphClass,graphId,graphName) {
            $scope.downloadGraphAsImage(graphClass,graphId,graphName)
          },
    }

    $scope.downloadGraphAsImage = function (graphClass,graphId, graphName) {
        saveSvgAsPng(document.querySelector('.' + graphId), graphName, {
            scale: 1.2,
            backgroundColor: 'white'
        });
    }
});


// document.getElementById("card-graph-wrapper").querySelector('.recharts-surface')