angular
    .module("violations")
    .controller("HeaderController", ["$log", "$scope", "$session", "$navigation", "$window", function ($log, $scope, $session, $navigation, $window) {
        $scope.session = $session;
        $scope.navigation = $navigation;


        $scope.logout = function () {
            $session.logout(function () {
                $window.location.reload(true);
            });
        };
    }]);