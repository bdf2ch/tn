angular.module("violations")
    .filter("day", ["$log", function ($log) {
        return function (input) {
            return moment.unix(input).format("DD MMMM YYYY");
        }
    }]);
