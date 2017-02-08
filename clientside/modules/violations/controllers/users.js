angular
    .module("violations")
    .controller("UsersController", ["$log", "$scope", "$location", "$users", "$violations", "$divisions", "$modals", "$tree", function ($log, $scope, $location, $users, $violations, $divisions, $modals, $tree) {
        $scope.users = $users;
        $scope.violations = $violations;
        $scope.divisions = $divisions;
        $scope.modals = $modals;
        $scope.filters = {
            divisionId: 0,
            name: ""
        };

        if ($violations.mobileMenu() === true)
            $violations.mobileMenu(false);


        if (!$tree.getById("users-filter-tree")) {
            var usersFilterTree = $tree.register({
                id: "users-filter-tree",
                rootKey: 0,
                expandOnSelect: true,
                collapseOnDeselect: true
            });

            usersFilterTree.onSelect = function (item) {
                //$log.log("selected division = ", item);
                $scope.filters.divisionId = item.key;
                $modals.close();
            };


            var length = $divisions.getAll().length;
            for (var i = 0; i < length; i++) {
                var division = $divisions.getAll()[i];
                var item = $tree.addItem({
                    treeId: "users-filter-tree",
                    key: division.id.value,
                    parentKey: division.parentId.value,
                    display: division.shortTitle.value,
                    order: division.sortId.value
                });
                if (division.id.value === 1) {
                    item.isExpanded = true;
                }
            }
        }



        $scope.gotoNewUser = function () {
            $location.url("/new-user");
        };



        $scope.selectUser = function (user) {
            $users.users.select(user.id.value, function () {
                $location.url("/user/" + user.id.value);
            });
        };



        $scope.openFilterDivisionModal = function () {
            $modals.open("users-filter-division-modal");
        };



        $scope.cancelDivisionIdFilter = function () {
            $scope.filters.divisionId = 0;
        };

    }]);