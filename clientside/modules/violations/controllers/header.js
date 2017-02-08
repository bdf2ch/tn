angular
    .module("violations")
    .controller("HeaderController", ["$log", "$scope", "$session", "$navigation", "$window", "$modals", "$misc", "$settings", "$violations", function ($log, $scope, $session, $navigation, $window, $modals, $misc, $settings, $violations) {
        $scope.misc = $misc;
        $scope.session = $session;
        $scope.settings = $settings;
        $scope.navigation = $navigation;
        $scope.violations = $violations;
        $scope.modals = $modals;


        $scope.openMobileMenu = function () {
            $violations.mobileMenu(true);
            $log.log("menu opened = ", $violations.mobileMenu());
        };

        $scope.closeMobileMenu = function () {
            if ($violations.mobileMenu() === true)
                $violations.mobileMenu(false);
        };

        $scope.swipeLeft = function () {
            $log.log("swipe left");
            $violations.mobileMenu(false);

        };

        $scope.openSettingsModal = function () {
            $modals.open("settings-modal");
        };


        $scope.closeSettingsModal = function () {
            if ($settings.changed() === true) {
                for (var setting in $settings.getAll()) {
                    $settings.getAll()[setting]._backup_.restore();
                    $settings.getAll()[setting]._states_.changed(false);
                }
            }
            $settings.changed(false);
            $modals.close();
            $window.location.reload();
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