angular
    .module("violations")
    .controller("HeaderController", ["$log", "$scope", "$session", "$navigation", "$window", "$modals", "$misc", "$settings", function ($log, $scope, $session, $navigation, $window, $modals, $misc, $settings) {
        $scope.misc = $misc;
        $scope.session = $session;
        $scope.settings = $settings;
        $scope.navigation = $navigation;
        $scope.modals = $modals;


        $scope.openSettingsModal = function () {
            $modals.open("settings-modal");
        };


        $scope.closeSettingsModal = function () {
            $log.log("close modal");
            if ($settings.changed() === true) {
                for (var setting in $settings.getAll()) {
                    $settings.getAll()[setting]._backup_.restore();
                    $settings.getAll()[setting]._states_.changed(false);
                }
            }
            $settings.changed(false);
            $modals.close();
        };


        $scope.saveSettings = function () {
            $settings.save(function () {
                $settings.changed(false);
            });
        };


        $scope.logout = function () {
            $session.logout(function () {
                $window.location.reload(true);
            });
        };

    }]);