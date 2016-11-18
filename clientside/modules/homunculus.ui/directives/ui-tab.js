angular
    .module("homunculus.ui")
    .directive("uiTab", ["$log", "$templateCache", "$errors", function ($log, $templateCache, $errors) {
        return {
            restrict: "E",
            require: "^uiTabs",
            link: function (scope, element, attrs, controller) {
                $log.log("tab directive");

                if (attrs.id === undefined || attrs.id === "") {
                    $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "ui-tab -> Не задан аттрибут - идентификатор вкладки");
                    return false;
                }

                var settings = scope.settings = {
                    id: attrs.id,
                    caption: attrs.caption !== undefined && attrs.caption !== "" ? attrs.caption : "",
                    icon: attrs.icon !== undefined && attrs.icon !== "" ? attrs.icon : undefined,
                    title: attrs.title !== undefined && attrs.title !== "" ? attrs.title : "",
                    content: element[0].innerHTML,
                    isActive: false
                };

                $templateCache.put("ui-tabs-" + controller.getId() + "-" + settings.id, settings.content);

                controller.registerTab(settings);
                element[0].innerHTML = "";
            }
        }
    }]);