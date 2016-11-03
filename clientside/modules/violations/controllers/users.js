angular
    .module("violations")
    .controller("UsersController", ["$log", "$scope", "$location", "$users", "$violations", "$divisions", function ($log, $scope, $location, $users, $violations, $divisions) {
        $scope.users = $users;
        $scope.violations = $violations;
        $scope.divisions = $divisions;


        $scope.gotoNewUser = function () {
            $location.url("/new-user");
        };


        $scope.selectUser = function (user) {
            $users.users.select(user.id.value, function () {
                $location.url("/user/" + user.id.value);
            });
        };
    }]);