angular
    .module("homunculus.ui")
    .directive("uiModalFooter", ["$log", "$sce", "$modals", function ($log, $sce, $modals) {
        return {
            restrict: "E",
            require: "^uiModal",
            link: function (scope, element, attrs, ctrl) {
                var height = 0;
                if (attrs.height !== undefined && attrs.height !== "")
                    height = parseInt(attrs.height);

                //$log.log("ui modal footer");
                ctrl.registerFooter($sce.trustAsHtml(element[0].innerHTML), height);
                angular.element(element).remove();
            }
        }
    }]);