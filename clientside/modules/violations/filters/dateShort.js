angular.module("violations")
    .filter("dateShort", ["$log", function ($log) {
        return function (input) {
            return moment.unix(input).format("DD.MM.YYYY");
        }
    }]);