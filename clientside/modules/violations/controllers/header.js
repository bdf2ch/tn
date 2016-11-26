angular
    .module("violations")
    .controller("HeaderController", ["$log", "$scope", "$session", "$navigation", "$window", "$modals", "$misc", function ($log, $scope, $session, $navigation, $window, $modals, $misc) {
        $scope.misc = $misc;
        $scope.session = $session;
        $scope.navigation = $navigation;
        $scope.modals = $modals;


        $scope.openSettingsModal = function () {
            $modals.open("settings-modal");
        };


        $scope.logout = function () {
            $session.logout(function () {
                $window.location.reload(true);
            });
        };
    }]);