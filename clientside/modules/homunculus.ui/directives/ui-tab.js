angular
    .module("homunculus.ui")
    .directive("uiTab", ["$log", "$errors", function ($log, $errors) {
        return {
            restrict: "E",
            require: "^uiTabs",
            transclude: true,
            replace: true,
            template: "<div class='ui-tab' ng-transclude></div>",
            link: function (scope, element, attrs, controller) {
                $log.log("tab directive");

                if (attrs.id === undefined || attrs.id === "") {
                    $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "ui-tab -> Не задан аттрибут - идентификатор вкладки");
                    return false;
                }

                var settings = scope.settings = {
                    id: attrs.id,
                    caption: attrs.caption !== undefined && attrs.caption !== "" ? attrs.caption : "",
                    icon: attrs.icon !== undefined && attrs.icon !== "" ? attrs.icon : undefined
                };

                controller.registerTab(settings);
            }
        }
    }]);