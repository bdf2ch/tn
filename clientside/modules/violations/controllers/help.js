angular
    .module("violations")
    .controller("HelpController", ["$log", "$scope", "$session", "$violations", "$anchorScroll", "$location", function ($log, $scope, $session, $violations, $anchorScroll, $location) {
        $scope.session = $session;


        if ($violations.mobileMenu() === true)
            $violations.mobileMenu(false);


        $scope.scroll = function (hash) {
            if (hash !== undefined) {
                $location.hash(hash);
                $anchorScroll();
            }
        };
    }]);
