angular
    .module("violations")
    .controller("HelpController", ["$scope", "$session", "$violations", function ($scope, $session, $violations) {
        $scope.session = $session;

        if ($violations.mobileMenu() === true)
            $violations.mobileMenu(false);
    }]);
