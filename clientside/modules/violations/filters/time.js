angular.module("violations")
    .filter("time", ["$log", function ($log) {
        return function (input) {
            return moment.unix(input).format("HH:mm");
        }
    }]);