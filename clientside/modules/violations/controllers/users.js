angular
    .module("violations")
    .controller("UsersController", ["$log", "$scope", "$location", "$users", "$violations", function ($log, $scope, $location, $users, $violations) {
        $scope.users = $users;
        $scope.violations = $violations;


        $scope.gotoNewUser = function () {
            $location.url("/new-user");
        };


        $scope.selectUser = function (user) {
            $users.users.select(user.id.value, function () {
                $location.url("/user/" + user.id.value);
            });
        };
    }]);