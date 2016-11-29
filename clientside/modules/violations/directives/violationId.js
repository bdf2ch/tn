angular
    .module("violations")
    .directive("violationId", ["$log", function ($log) {
        return {
            restrict: "A",
            require: "ngModel",
            scope: false,
            link: function (scope, element, attrs, controller) {
                $log.log("controller = ", controller);

                controller.$parsers.push(function (val) {
                        return val;
                });

                controller.$formatters.push(function (val) {
                    $log.log("value = ", val);
                    if (val === 0)
                        return "";
                    else
                        return val;
                });
            }
        }
    }]);
