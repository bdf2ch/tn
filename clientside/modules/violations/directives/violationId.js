angular
    .module("violations")
    .directive("violationId", ["$log", function ($log) {
        return {
            restrict: "A",
            require: "ngModel",
            scope: false,
            link: function (scope, element, attrs, controller) {

                controller.$parsers.push(function (val) {
                    return val;
                });

                controller.$formatters.push(function (val) {
                    if (val === 0)
                        return "";
                    else
                        return val;
                });

                element.on("keyup", function (event) {
                    if (event.key !== "Enter") {
                        var reg = new RegExp('^[0-9]+$');
                        if (reg.test(event.key)) {
                            controller.$setViewValue(parseInt(event.key));
                        } else {
                            controller.$setViewValue(0);
                            element.val("");
                        }
                    }
                });
            }
        }
    }]);
