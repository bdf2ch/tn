angular
    .module("homunculus.ui")
    .directive("uiTabs", ["$log", "$compile", "$sce", "$errors", "$tabs", function ($log, $compile, $sce, $errors, $tabs) {
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
                        "<div class='tabs-content' id='tabs-content-{{settings.id}}'></div>" +
                      "</div>",
            controller: function ($scope, $element, $attrs) {
                if ($attrs.id === undefined || $attrs.id === "") {
                    $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "ui-tabs -> Не задан аттрибут - идентификатор компонента");
                    return false;
                }

                var settings = $scope.settings = {
                    id: $attrs.id,
                    tabs: [],
                    container: document.getElementById("tabs-content-" + this.id),
                    content: "",
                    onTabSelect: $scope.onTabSelect !== undefined && typeof $scope.onTabSelect === "function" ? $scope.onTabSelect : undefined
                };
                var test = document.getElementById("tabs-content-" + this.id);
                $log.info(test);
                var instance = $tabs.getById(settings.id);
                if (!instance) {
                    $tabs.register(settings);
                }

                this.registerTab = function (tab) {
                    if (tab === undefined) {
                        $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "ui-tabs -> registerTab: Не задан параметр - объект с настройками вкладки");
                        return false;
                    }

                    var length = settings.tabs.length;
                    for (var i = 0; i < length; i++) {
                        if (settings.tabs[i].id === tab.id) {
                            $errors.throw($errors.type.ERROR_TYPE_ENGINE, "ui-tabs -> registerTab: Вкладка с идентификатором '" + tab.id + "' уже существует");
                            return false;
                        } else
                            settings.tabs[i].isActive = false;
                    }

                    settings.tabs.push(tab);
                    tab.isActive = true;
                    $log.info("container = ", settings.container);
                    //settings.contentContainer.innerHTML = settings.tabs[0].content;
                    //settings.tabs[0].content(function (clone) {
                    //    $log.info(clone);
                        angular.element(settings.container).innerHTML = tab.content;
                    //});

                    $compile(settings.container)(tab.scope);
                    $log.log("local tabs", settings.tabs);
                    return true;
                };

                this.selectTab = $scope.selectTab = function (id) {
                    if (id === undefined) {
                        $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "ui-tabs -> selectTab: Не задан параметр - идентифкатор вкладки");
                        return false;
                    }

                    var length = settings.tabs.length;
                    for (var i = 0; i < length; i++) {
                        if (settings.tabs[i].id === id) {
                            settings.tabs[i].isActive = true;
                            //settings.content = settings.tabs[i].content;
                            angular.element(settings.container).innerHTML = settings.tabs[i].content;
                            //settings.contentContainer.innerHTML = settings.tabs[i].content;
                            $compile(settings.container)($scope);
                            if (settings.onTabSelect !== undefined)
                                settings.onTabSelect(settings.tabs[i]);
                        } else
                            settings.tabs[i].isActive = false;
                    }
                    return true;
                };
            },
            link: function (scope, element, attrs, transclude) {
                $log.log("tabs directive");

                //scope.settings.container = document.getElementById("tabs-content-" + this.id);

                //if (attrs.id === undefined || attrs.id === "") {
                //    $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "tabs directive -> Не задан аттрибут - идентификатор компонента");
                //    return false;
                //}
                var test = document.getElementById("tabs-content-test-tabs");
                $log.info("test", test);


            }

        }
    }]);