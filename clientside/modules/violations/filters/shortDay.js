angular.module("violations")
    .filter("shortDay", ["$log", function ($log) {
        return function (input) {
            return moment.unix(input).format("DD.MM.YY");
        }
    }]);
