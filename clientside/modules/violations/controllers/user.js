angular
    .module("violations")
    .controller("UserController", ["$log", "$scope", "$location", "$users", "$violations", "$tree", "$modals", function ($log, $scope, $location, $users, $violations, $tree, $modals) {
        $scope.users = $users;
        $scope.violations = $violations;
        $scope.modals = $modals;
        $scope.errors = {
            divisionId: undefined,
            surname: undefined,
            name: undefined,
            fname: undefined,
            email: undefined,
            login: undefined,
            password: undefined
        };



        $scope.openSelectDivisionModal = function () {
            $modals.open("current-user-division-modal");
        };



        $scope.selectDivision = function (division) {
            $users.users.getCurrent().divisionId.value = division.key;
            $users.users.getCurrent()._states_.changed(true);
        };



        if (!$tree.getById("current-user-tree")) {
            var currentUserTree = $tree.register({
                id: "current-user-tree",
                rootKey: 0,
                expandOnSelect: true,
                collapseOnDeselect: true
            });

            currentUserTree.onSelect = function (item) {
                $log.log("selected division = ", item);
                $scope.selectDivision(item);
            };


            var length = $violations.divisions.getAll().length;
            for (var i = 0; i < length; i++) {
                var division = $violations.divisions.getAll()[i];
                var item = $tree.addItem({
                    treeId: "current-user-tree",
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



        $scope.gotoUsers = function () {
            $location.url("/users");
            $users.users.getCurrent()._backup_.restore();
            $users.users.getCurrent()._states_.changed(false);
        };



        $scope.save = function () {
            for (var index in $scope.errors) {
                $scope.errors[index] = undefined;
            }

            if ($users.users.getCurrent().divisionId.value === 0)
                $scope.errors = "Вы не выбрали струтурное подразделение";
            if ($users.users.getCurrent().surname.value === "")
                $scope.errors.surname = "Вы не указали фамилию";
            if ($users.users.getCurrent().name.value === "")
                $scope.errors.name = "Вы не указали имя";
            if ($users.users.getCurrent().fname.value === "")
                $scope.errors.fname = "Вы не указали отчество";
            if ($users.users.getCurrent().email.value === "")
                $scope.errors.email = "Вы не указали e-mail";
            if ($users.users.getCurrent().login.value === "")
                $scope.errors.login = "Вы не указали учетную запись в AD";
            if ($users.users.getCurrent().password.value === "")
                $scope.errors.password = "Вы не указали пароль";

            if ($scope.errors.divisionId === undefined && $scope.errors.surname === undefined &&
                $scope.errors.name === undefined && $scope.errors.fname === undefined &&
                $scope.errors.email === undefined && $scope.errors.login === undefined && $scope.errors.password === undefined) {
                $users.users.edit(function () {

                });
            }
        };
    }]);