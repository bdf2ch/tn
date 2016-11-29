angular
    .module("violations")
    .controller("ViolationsController", ["$log", "$scope", "$violations", "$divisions", "$misc", "$location", "$tree", "$session", "$dateTimePicker", function ($log, $scope, $violations, $divisions, $misc, $location, $tree, $session, $dateTimePicker) {
        $scope.violations = $violations;
        $scope.divisions = $divisions;
        $scope.misc = $misc;
        $scope.today = new moment().hours(23).minutes(59).seconds(59).unix();



        $scope.selectStartDate = function (value) {
            $log.log("onSelect called", value);
            $dateTimePicker.getById("violations-end-date").scope.settings.minDate = $violations.filter.getByCode("violation-date").startValue.value;
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined) {
                $violations.clear();
                $violations.getByDivisionId(division.key);
            }
        };



        $scope.cancelStartDate = function () {
            $dateTimePicker.getById("violations-end-date").scope.settings.minDate = 0;
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined) {
                $violations.clear();
                $violations.filter.getByCode("violation-date").resetStartValue();
                $violations.getByDivisionId(division.key);
            }
        };



        $scope.selectEndDate = function () {
            $violations.filter.endDate = moment.unix($violations.filter.getByCode("violation-date").endValue.value).hours(23).minutes(59).seconds(59).unix();
            $dateTimePicker.getById("violations-start-date").scope.settings.maxDate = $violations.filter.endDate;
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined) {
                $violations.clear();
                $violations.getByDivisionId(division.key);
            }
        };



        $scope.cancelEndDate = function () {
            $dateTimePicker.getById("violations-start-date").scope.settings.maxDate = $scope.today;
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined) {
                $violations.clear();
                $violations.filter.getByCode("violation-date").resetEndValue();
                $violations.getByDivisionId(division.key);
            }
        };



        $scope.cancelBothDates = function () {
            $dateTimePicker.getById("violations-start-date").scope.settings.maxDate = $scope.today;
            $violations.filter.getByCode("violation-date").resetStartValue();
            $violations.filter.getByCode("violation-date").resetEndValue();
            $dateTimePicker.getById("violations-end-date").scope.settings.minDate = 0;
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined) {
                $violations.clear();
                $violations.getByDivisionId(division.key);
            }
        };



        $scope.gotoNewViolation = function () {
            $location.url("/new");
        };



        $scope.selectDivision = function (division) {
            if (division.isSelected === true) {
                $violations.getNew().divisionId.value = division.key;
                if ($divisions.getCurrent().id.value !== division.key)
                    $violations.getByDivisionId(division.key);
            }
        };



        $scope.selectViolation = function (violationId) {
            if (violationId !== undefined) {
                $violations.select(violationId, function () {
                    $location.url("/violations/" + violationId);
                });
            }
        };


        $scope.cancelViolationId = function () {
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined) {
                $violations.clear();
                $violations.filter.isIdSent(false);
                $violations.filter.cancelViolationId();
                $violations.getByDivisionId(division.key);
            }
        };



        $scope.onChangeViolationId = function () {
            $log.log("violationId changed");
            if ($violations.filter.getByCode("violation-id").startValue.value !== "") {
                if (isNaN($violations.filter.getByCode("violation-id").startValue.value))
                    $violations.filter.getByCode("violation-id").startValue.value = 0;
                else
                    $violations.filter.getByCode('violation-id').startValue.value = Math.floor($violations.filter.getByCode("violation-id").startValue.value);
            }
        };



        $scope.searchViolationById = function () {
            $log.log("search pressed");
            $violations.filter.isIdSent(true);
            $violations.filter.cancelStartDate();
            $violations.filter.cancelEndDate();
            $violations.filter.cancelEskGroup();
            $violations.filter.getByCode('violation-id')._backup_.setup();
            $violations.searchById($violations.filter.getByCode('violation-id').startValue.value, function (violation) {
                $log.log("violation # " + $violations.filter.violationId + " found");
                $violations.clear();
                $violations.getAll().push(violation);
            });
        };



        $scope.cancelViolationId = function () {
            $violations.filter.getByCode("violation-id").resetStartValue();
            $violations.filter.isIdSent(false);
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined) {
                $violations.clear();
                $violations.getByDivisionId(division.key);
            }
        };



        $scope.selectEskGroup = function () {
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined) {
                $violations.clear();
                $violations.getByDivisionId(division.key);
            }
        };


        $scope.cancelEskGroup = function () {
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined) {
                $violations.filter.getByCode("violation-esk-group").resetStartValue();
                $violations.clear();
                $violations.getByDivisionId(division.key);
            }
        };

    }]);
