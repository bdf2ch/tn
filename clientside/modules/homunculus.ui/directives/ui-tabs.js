angular
    .module("homunculus.ui")
    .directive("uiTabs", ["$log", "$templateCache", "$errors", "$tabs", function ($log, $templateCache, $errors, $tabs) {
        return {
            restrict: "E",
            transclude: true,
            scope: {
                onTabSelect: "="
            },
            replace: true,
            template: "<div class='ui-tabs'>" +
                        "<div ng-transclude></div>" +
                        "<div class='tabs-container'>" +
                            "<div class='ui-tab' ng-class='{ active: tab.isActive === true }' ng-repeat='tab in settings.tabs' ng-click='selectTab(tab.id)' title='{{ tab.title }}'>" +
                                "<span class='fa {{ tab.icon }}' ng-show='tab.icon !== undefined'></span>" +
                                "<span class='tab-caption'>{{ tab.caption }}</div>" +
                        "</div>" +
                        "<div class='tabs-content' id='tabs-content-{{settings.id}}' >" +
                            "<div ng-include='templateId' onload='onLoad()'></div>" +
                        "</div>" +
                      "</div>",
            controller: function ($scope, $element, $attrs) {
                if ($attrs.id === undefined || $attrs.id === "") {
                    $errors.push($errors.type.ERROR_TYPE_DEFAULT, "ui-tabs -> Не задан аттрибут - идентификатор компонента");
                    return false;
                }

                var settings = $scope.settings = {
                    id: $attrs.id,
                    tabs: [],
                    content: "",
                    onTabSelect: $scope.onTabSelect !== undefined && typeof $scope.onTabSelect === "function" ? $scope.onTabSelect : undefined
                };
                var templateId = $scope.templateId = "ui-tabs-" + settings.id;

                $scope.onLoad = function () {
                    $log.info("template loaded");
                };

                var instance = $tabs.getById(settings.id);
                if (!instance) {
                    $tabs.register(settings);
                }


                this.getId = function () {
                    return settings.id;
                };

                this.registerTab = function (tab) {
                    if (tab === undefined) {
                        $errors.push($errors.type.ERROR_TYPE_DEFAULT, "ui-tabs -> registerTab: Не задан параметр - объект с настройками вкладки");
                        return false;
                    }

                    var length = settings.tabs.length;
                    for (var i = 0; i < length; i++) {
                        if (settings.tabs[i].id === tab.id) {
                            $errors.push($errors.type.ERROR_TYPE_ENGINE, "ui-tabs -> registerTab: Вкладка с идентификатором '" + tab.id + "' уже существует");
                            return false;
                        } else
                            settings.tabs[i].isActive = false;
                    }

                    settings.tabs.push(tab);
                    settings.tabs[0].isActive = true;
                    $scope.templateId = "ui-tabs-" + settings.id + "-" + settings.tabs[0].id;
                    return true;
                };



                this.selectTab = $scope.selectTab = function (id) {
                    if (id === undefined) {
                        $errors.push($errors.type.ERROR_TYPE_DEFAULT, "ui-tabs -> selectTab: Не задан параметр - идентифкатор вкладки");
                        return false;
                    }

                    var length = settings.tabs.length;
                    for (var i = 0; i < length; i++) {
                        if (settings.tabs[i].id === id) {
                            settings.tabs[i].isActive = true;
                            $scope.templateId = "ui-tabs-" + settings.id + "-" + settings.tabs[i].id;
                        } else
                            settings.tabs[i].isActive = false;
                    }
                    return true;
                };
            },
            link: function (scope, element, attrs, transclude) {
                $log.log("tabs directive");
            }

        }
    }]);