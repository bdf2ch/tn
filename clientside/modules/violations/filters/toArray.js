angular
    .module("violations")
    .filter('toArray', [function () {
        return function (input) {
            var result = [];
            for (var index in input) {
                result.push(input[index]);
            }
            return result;
        }
    }]);
