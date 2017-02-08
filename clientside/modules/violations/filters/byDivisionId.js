angular
    .module("violations")
    .filter("byDivisionId", ["$log", function ($log) {
        return function (input, divisionId) {
            if (divisionId !== undefined && divisionId !== 0) {
                var length = input.length;
                var result = [];

                for (var i = 0; i < length; i++) {
                    if (input[i].divisionId.value === divisionId)
                        result.push(input[i]);
                }
                return result;
            } else
                return input;

        }
    }]);