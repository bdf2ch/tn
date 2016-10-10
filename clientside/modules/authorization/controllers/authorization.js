angular
    .module("authorization")
    .controller("AuthorizationController", ["$log", "$scope", "$authorization", "$window", function ($log, $scope, $authorization, $window) {
        $scope.email = "";
        $scope.password = "";
        $scope.submitted = false;
        $scope.isLoading = false;
        $scope.noUserFound = false;

        $scope.login = function () {
            $scope.submitted = true;
            $scope.noUserFound = false;
            if ($scope.auth_form.$valid === true) {
                $authorization.login($scope.email, $scope.password, function (data) {
                    //$log.log("result = ", data);
                    if (data !== false) {
                        $window.location.reload();
                    } else
                        $scope.noUserFound = true;
                });
            }
        };
    }]);