angular
    .module("violations")
    .filter("filesize", [function () {
        return function (input, precision) {
            if (typeof precision === 'undefined') precision = 1;
            var units = ['байт', 'кб', 'мб', 'гб', 'тв', 'пб'];
            var number = Math.floor(Math.log(input) / Math.log(1024));
            return (input / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
        }
    }]);
