angular
    .module("violations")
    .controller("DivisionsController", ["$log", "$scope", "$divisions", "$violations", "$tree", "$modals", function ($log, $scope, $divisions, $violations, $tree, $modals) {
        $scope.divisions = $divisions;
        $scope.violations = $violations;
        $scope.modals = $modals;
        $scope.errors = {
            fullTitle: undefined,
            shortTitle: undefined
        };


        if ($violations.mobileMenu() === true)
            $violations.mobileMenu(false);


        $scope.openNewDivisionModal = function () {
            $modals.open("new-division-modal");
        };


        $scope.cancelAddDivision = function () {
            $divisions.getNew()._backup_.restore();
            for (var index in $scope.errors) {
                $scope.errors[index] = undefined;
            }
        };


        $scope.add = function () {
            for (var index in $scope.errors) {
                $scope.errors[index] = undefined;
            }

            if ($divisions.getNew().shortTitle.value === "")
                $scope.errors.shortTitle = "Вы не указали краткое наименование";

            if ($divisions.getNew().fullTitle.value === "")
                $scope.errors.fullTitle = "Вы не указали полное наименование";

            if ($scope.errors.fullTitle == undefined && $scope.errors.shortTitle === undefined) {
                $divisions.add(function (division) {
                    $modals.close();
                    $tree.addItem({
                        treeId: "divisions-tree",
                        key: division.id.value,
                        parentKey: division.parentId.value,
                        display: division.shortTitle.value
                    });
                });
            }
        };


        $scope.openEditDivisionModal = function () {
            $modals.open("edit-division-modal");
        };


        $scope.cancelEditDivision = function () {
            for (var index in $scope.errors) {
                $scope.errors[index] = undefined;
            }
            $divisions.getCurrent()._backup_.restore();
            $divisions.getCurrent()._states_.changed(false);
        };


        $scope.save = function () {
            for (var index in $scope.errors) {
                $scope.errors[index] = undefined;
            }

            if ($divisions.getCurrent().shortTitle.value === "")
                $scope.errors.shortTitle = "Вы не указали краткое наименование";

            if ($divisions.getCurrent().fullTitle.value === "")
                $scope.errors.fullTitle = "Вы не указали полное наименование";

            if ($scope.errors.fullTitle == undefined && $scope.errors.shortTitle === undefined) {
                $divisions.edit(function (division) {
                    $modals.close();
                    $tree.getItemByKey("divisions-tree", division.id.value).display = division.shortTitle.value;
                });
            }
        };


        if (!$tree.getById("divisions-tree")) {
            //$log.log("NO TREE");
            var divisionsTree = $tree.register({
                id: "divisions-tree",
                rootKey: 0,
                expandOnSelect: true,
                collapseOnDeselect: true,
                onSelect: function (division) {
                    if (division.isSelected === true) {
                        $divisions.select(division.key);
                        $log.log("current divivison  = ", $divisions.getCurrent());
                        $divisions.getNew().parentId.value = division.key;
                    } else
                        $divisions.getNew().parentId.value = 0;
                }
            });


            var length = $divisions.getAll().length;
            for (var i = 0; i < length; i++) {
                var division = $divisions.getAll()[i];
                var item = $tree.addItem({
                    treeId: "divisions-tree",
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
    }]);
