angular
    .module("homunculus.ui")
    .directive("uiCentered", ["$log", "$window", function ($log, $window) {
        return {
            restrict: "A",
            scope: false,
            link: function (scope, element, attrs) {

                $log.log("ui-centered");

                var redraw = function () {
                    var left = ($window.innerWidth / 2) - angular.element(element).prop("clientWidth") / 2 + "px";
                    var top = ($window.innerHeight / 2) - ((angular.element(element).prop("clientHeight")) / 2) + "px";
                    angular.element(element).css("left", left);
                    angular.element(element).css("top", top);
                };


                angular.element($window).bind("resize", function () {
                    redraw();
                });

                angular.element($window).bind("load", function () {
                    redraw();
                });

                redraw();

                element[0].addEventListener("DOMSubtreeModified", function () {
                    redraw();
                }, false);

            }
        }
    }]);