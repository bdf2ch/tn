angular.module("violations")
    .filter("emptyViolationId", ["$log", function ($log) {
        return function (input) {
            if (input === 0)
                return "";
            else
                return input;
        }
    }]);

