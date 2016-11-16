angular
    .module("homunculus.ui")
    .directive("uiTabs", ["$log", "$errors", "$tabs", function ($log, $errors, $tabs) {
        return {
            restrict: "E",
            transclude: true,
            scope: {
                onTabSelect: "="
            },
            replace: true,
            template: "<div class='ui-tabs' ng-transclude></div>",
            controller: function ($scope, $element, $attrs) {
                if ($attrs.id === undefined || $attrs.id === "") {
                    $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "ui-tabs -> Не задан аттрибут - идентификатор компонента");
                    return false;
                }

                var settings = $scope.settings = {
                    id: $attrs.id,
                    tabs: [],
                    onTabSelect: $scope.onTabSelect !== undefined && typeof $scope.onTabSelect === "function" ? $scope.onTabSelect : undefined
                };

                var instance = $tabs.getById(settings.id);
                if (!instance) {
                    $tabs.register(settings);
                }

                this.registerTab = function (tab) {
                    if (tab === undefined) {
                        $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "ui-tabs -> registerTab: Не задан параметр - объект с настройками вкладки");
                        return false;
                    }

                    settings.tabs.push(tab);
                    $log.log("local tabs", settings.tabs);
                    return true;
                };
            },
            link: function (scope, element, attrs, transclude) {
                $log.log("tabs directive");

                //if (attrs.id === undefined || attrs.id === "") {
                //    $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "tabs directive -> Не задан аттрибут - идентификатор компонента");
                //    return false;
                //}



            }

        }
    }]);