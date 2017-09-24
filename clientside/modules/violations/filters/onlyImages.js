angular.module("violations")
    .filter("onlyImages", ["$log", function ($log) {
        return function (input) {
            var length = input.length;
            var result = [];
            for (var i = 0; i < length; i++) {
                var at = input[i].title.value.split('.');
                if (at[at.length - 1].toLowerCase() === 'jpeg' || at[at.length - 1].toLowerCase() === 'jpg' || at[at.length - 1].toLowerCase() === 'png' || at[at.length - 1] === 'bmp') {
                    result.push(input[i]);
                }
            }
            return result;
        }
    }]);