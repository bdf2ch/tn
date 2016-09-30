angular
    .module("violations")
    .controller("ViolationsController", ["$log", "$scope", "$violations", "$location", "$tree", "$session", "$dateTimePicker", function ($log, $scope, $violations, $location, $tree, $session, $dateTimePicker) {
        $scope.violations = $violations;
        $scope.today = new moment().hours(23).minutes(59).seconds(59).unix();

        $scope.selectStartDate = function () {
            $log.log("onSelect called");
            $violations.violations.setStart(0);
            $dateTimePicker.getById("violations-end-date").scope.settings.minDate = $violations.violations.startDate;
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined)
                $violations.violations.getByDivisionId(division.key);
        };


        $scope.clearStartDate = function () {
            $violations.violations.startDate = 0;
            $violations.violations.setStart(0);
            $dateTimePicker.getById("violations-end-date").scope.settings.minDate = 0;
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined)
                $violations.violations.getByDivisionId(division.key);
        };


        $scope.selectEndDate = function () {
            $violations.violations.setStart(0);
            $violations.violations.endDate = moment.unix($violations.violations.endDate).hours(23).minutes(59).seconds(59).unix();
            $dateTimePicker.getById("violations-start-date").scope.settings.maxDate = $violations.violations.endDate;
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined)
                $violations.violations.getByDivisionId(division.key);
        };


        $scope.clearEndDate = function () {
            $violations.violations.endDate = 0;
            $violations.violations.setStart(0);
            //$dateTimePicker.getAll()[0].scope.settings.maxDate = $scope.today;
            $dateTimePicker.getById("violations-start-date").scope.settings.maxDate = $scope.today;
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined)
                $violations.violations.getByDivisionId(division.key);
        };


        $scope.gotoNewViolation = function () {
            $location.url("/new");
        };


        $scope.selectDivision = function (division) {
            $violations.violations.setStart(0);
            if (division.isSelected === true) {
                $violations.violations.getNew().divisionId.value = division.key;
                $violations.violations.getByDivisionId(division.key, $violations.violations.startDate, $violations.violations.endDate);
                $log.log("new = ", $violations.violations.getNew());

            }
        };


        $scope.selectViolation = function (violationId) {
            if (violationId !== undefined) {
                $violations.violations.select(violationId, function () {
                    $location.url("/violations/" + violationId);
                });
            }
        };

    }]);
