angular
    .module("violations")
    .filter("noDateSelected", ["$log", function ($log) {
        return function (input) {
            if (input === 0)
                return "Не выбрано";
            else
                return input;
        }
    }]);