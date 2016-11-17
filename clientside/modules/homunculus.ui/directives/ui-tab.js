angular
    .module("homunculus.ui")
    .directive("uiTab", ["$log", "$sce", "$errors", function ($log, $sce, $errors) {
        return {
            restrict: "E",
            require: "^uiTabs",
            //transclude: true,
            link: function (scope, element, attrs, controller, transclude) {
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
                    scope: scope,
                    //content: undefined,
                    isActive: false
                };

                $log.log("content = ", settings.content);
                //transclude(function(clone) {
                //    $log.info(clone);
                //    settings.content = clone;
                    //settings.content = clone;
                //});

                controller.registerTab(settings);
                //element[0].innerHTML = "";
            }
        }
    }]);