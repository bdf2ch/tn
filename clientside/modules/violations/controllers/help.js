angular
    .module("violations")
    .controller("HelpController", ["$scope", "$session", function ($scope, $session) {
        $scope.session = $session;
    }]);
