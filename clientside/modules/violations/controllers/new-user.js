angular
    .module("violations")
    .controller("NewUserController", ["$log", "$scope", "$http", "$location", "$users", "$violations", "$divisions", "$modals", "$tree", function ($log, $scope, $http, $location, $users, $violations, $divisions, $modals, $tree) {
        $scope.users = $users;
        $scope.violations = $violations;
        $scope.divisions = $divisions;
        $scope.modals = $modals;
        $scope.errors = {
            surname: undefined,
            name: undefined,
            fname: undefined,
            divisionId: undefined,
            email: undefined,
            login: undefined,
            password: undefined
        };



        if (!$tree.getById("new-user-tree")) {
            var newUserTree = $tree.register({
                id: "new-user-tree",
                rootKey: 0,
                expandOnSelect: true,
                collapseOnDeselect: true
            });

            newUserTree.onSelect = function (item) {
                //$log.log("selected division = ", item);
                $scope.selectDivision(item);
            };


            var length = $divisions.getAll().length;
            for (var i = 0; i < length; i++) {
                var division = $divisions.getAll()[i];
                var item = $tree.addItem({
                    treeId: "new-user-tree",
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



        $scope.selectDivision = function (division) {
            $users.users.getNew().divisionId.value = division.key;
        };



        $scope.openSelectDivisionModal = function () {
            $modals.open("new-user-division-modal");
        };


        $scope.cancel = function () {
            $location.url("/users");
            $users.users.getNew().divisionId.value = 0;
            $users.users.getNew().surname.value = "";
            $users.users.getNew().name.value = "";
            $users.users.getNew().fname.value = "";
            $users.users.getNew().email.value = "";
            $users.users.getNew().login.value = "";
            $users.users.getNew().password.value = "";
            $users.users.getNew().isAdministrator.value = false;
            $users.users.getNew().allowEdit.value = false;
            $users.users.getNew().allowConfirm.value = false;
        };


        $scope.add = function () {
            for (var index in $scope.errors) {
                $scope.errors[index] = undefined;
            }

            if ($users.users.getNew().divisionId.value === 0)
                $scope.errors.divisionId = "Вы не выбрали структурное подразделение";
            if ($users.users.getNew().surname.value === "")
                $scope.errors.surname = "Вы не указали фамилию";
            if ($users.users.getNew().name.value === "")
                $scope.errors.name = "Вы не указали имя";
            if ($users.users.getNew().fname.value === "")
                $scope.errors.fname = "Вы не указали отчество";
            if ($users.users.getNew().email.value === "")
                $scope.errors.email = "Вы не указали e-mail";
            if ($users.users.getNew().login.value === "")
                $scope.errors.login = "Вы не указали учетную запись в AD";
            if ($users.users.getNew().password.value === "")
                $scope.errors.password = "Вы не указали пароль";

            if ($scope.errors.divisionId === undefined && $scope.errors.surname === undefined &&
                $scope.errors.name === undefined && $scope.errors.fname === undefined &&
                $scope.errors.email === undefined && $scope.errors.login === undefined && $scope.errors.password === undefined) {
                $users.users.add(function () {
                    $location.url("/users");
                    $users.users.getNew()._backup_.restore();
                });
            }
        };

    }]);