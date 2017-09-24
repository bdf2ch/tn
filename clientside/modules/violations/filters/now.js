angular.module("violations")
    .filter("nowFilter", ["$log", function ($log) {
        return function (input) {
            return moment(input).format("DD MMM YYYY, HH:mm");
        }
    }]);