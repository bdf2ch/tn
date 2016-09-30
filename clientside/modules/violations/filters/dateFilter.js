angular.module("violations")
    .filter("dateFilter", ["$log", function ($log) {
        return function (input) {
            return moment.unix(input).format("DD MMMM YYYY, HH:mm");
        }
    }]);