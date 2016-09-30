angular
    .module("violations")
    .filter("byViolationId", ["$log", function ($log) {
        return function (input, violationId) {
            if (violationId !== undefined && violationId !== 0) {
                var length = input.length;
                var result = [];
                
                for (var i = 0; i < length; i++) {
                    if (input[i].violationId.value === violationId)
                        result.push(input[i]);
                }
                return result;
            } else
                return input;

        }
    }]);