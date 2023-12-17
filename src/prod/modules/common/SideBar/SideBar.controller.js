import SideBar from './SideBar'

angular.module('customermaster').value('Sidebar', SideBar);

angular.module('customermaster').controller('sideBarCtrl', function ($rootScope) {
    // $rootScope.menuActive = 'Settings';
})