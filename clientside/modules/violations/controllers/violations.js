angular
    .module("violations")
    .controller("ViolationsController", ["$log", "$scope", "$violations", "$divisions", "$misc", "$vFilters", "$location", "$tree", "$session", "$dateTimePicker", function ($log, $scope, $violations, $divisions, $misc, $vFilters, $location, $tree, $session, $dateTimePicker) {
        $scope.violations = $violations;
        $scope.divisions = $divisions;
        $scope.misc = $misc;
        $scope.filters = $vFilters;
        $scope.today = new moment().hours(23).minutes(59).seconds(59).unix();

        $scope.selectStartDate = function (value) {
            $log.log("onSelect called", value);
            //$violations.violations.filter.setStartDate(value);
            $violations.violations.setStart(0);
            $dateTimePicker.getById("violations-end-date").scope.settings.minDate = $violations.violations.filter.startDate;
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined)
                $violations.violations.getByDivisionId(division.key);
        };


        /*
        $scope.clearStartDate = function () {
            $violations.violations.filter.startDate = 0;
            $violations.violations.setStart(0);
            $dateTimePicker.getById("violations-end-date").scope.settings.minDate = 0;
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined)
                $violations.violations.getByDivisionId(division.key);
        };
        */


        $scope.cancelStartDate = function () {
            $violations.violations.filter.cancelStartDate(function () {
                $violations.violations.setStart(0);
                $dateTimePicker.getById("violations-end-date").scope.settings.minDate = 0;
                var division = $tree.getById("session-divisions-tree").selectedItem;
                if (division !== undefined)
                    $violations.violations.getByDivisionId(division.key);
            });
        };


        $scope.selectEndDate = function () {
            $violations.violations.setStart(0);
            $violations.violations.endDate = moment.unix($violations.violations.filter.endDate).hours(23).minutes(59).seconds(59).unix();
            $dateTimePicker.getById("violations-start-date").scope.settings.maxDate = $violations.violations.filter.endDate;
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined)
                $violations.violations.getByDivisionId(division.key);
        };

        /*
        $scope.clearEndDate = function () {
            $violations.violations.filter.endDate = 0;
            $violations.violations.setStart(0);
            //$dateTimePicker.getAll()[0].scope.settings.maxDate = $scope.today;
            $dateTimePicker.getById("violations-start-date").scope.settings.maxDate = $scope.today;
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined)
                $violations.violations.getByDivisionId(division.key);
        };
        */

        $scope.cancelEndDate = function () {
            $violations.violations.filter.cancelEndDate(function () {
                $violations.violations.setStart(0);
                $dateTimePicker.getById("violations-start-date").scope.settings.maxDate = $scope.today;
                var division = $tree.getById("session-divisions-tree").selectedItem;
                if (division !== undefined)
                    $violations.violations.getByDivisionId(division.key);
            });
        };


        $scope.cancelBothDates = function () {
            $violations.violations.setStart(0);
            $violations.violations.filter.cancelStartDate();
            $dateTimePicker.getById("violations-start-date").scope.settings.maxDate = $scope.today;
            $violations.violations.filter.cancelEndDate();
            $dateTimePicker.getById("violations-end-date").scope.settings.minDate = 0;
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined)
                $violations.violations.getByDivisionId(division.key);
        };


        $scope.gotoNewViolation = function () {
            $location.url("/new");
        };


        $scope.selectDivision = function (division) {
            //$violations.violations.setStart(0);
            if (division.isSelected === true) {
                $violations.violations.getNew().divisionId.value = division.key;
                if ($divisions.getCurrent().id.value !== division.key)
                    $violations.violations.getByDivisionId(division.key);
                //$log.log("new = ", $violations.violations.getNew());

            }
        };


        $scope.selectViolation = function (violationId) {
            if (violationId !== undefined) {
                $violations.violations.select(violationId, function () {
                    $location.url("/violations/" + violationId);
                });
            }
        };


        $scope.clearViolationId = function () {};

        $scope.onChangeViolationId = function () {
            $log.log("violationId changed");
            var violationId = $violations.violations.filter.violationId;
            if (violationId !== "") {
                if (isNaN(violationId))
                    $violations.violations.filter.violationId = "";
                else
                    $violations.violations.filter.violationId = Math.floor(violationId);
            }
        };


        $scope.searchViolationById = function () {
            $log.log("search pressed");
            $violations.violations.filter.isIdSent(true);
        };


        $scope.selectEskGroup = function () {
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined)
                $violations.violations.getByDivisionId(division.key);
        };

    }]);
