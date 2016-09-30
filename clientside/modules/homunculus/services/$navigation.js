angular
    .module("homunculus")
    .factory("$navigation", ["$log", "$rootScope", "$factory", "$errors", function ($log, $rootScope, $factory, $errors) {
        var menu = [];
        var breadcrumb = [];
        var currentMenuItem = undefined;

        var getById = function (id) {
            if (id === undefined && id === "") {
                $errors.add(ERROR_TYPE_DEFAULT, "$navigation -> GetById: Не задан парметр - идентификатор раздела");
                return false;
            }

            var length = menu.length;
            for (var i = 0; i < length; i++) {
                if (menu[i].id === id) {
                    return menu[i];
                }
            }
            return false;
        };

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $log.log("current = ", current);
            $log.log("next = ", next);

            breadcrumb = [];
            var length = menu.length;
            for (var i = 0; i < length; i++) {
                var parent = getById(menu[i].parentId);
                if (menu[i].url === next.$$route.originalPath) {
                    breadcrumb.push(menu[i]);
                    for (var y = 0; y < length; y++) {
                        if (menu[y].parentId === menu[i].id)
                            menu[y].isParentActive = true;
                        else
                            menu[y].isParentActive = false;
                    }
                    if (menu[i].parentId !== "") {
                        var parentId = menu[i].parentId;
                        $log.log("parentId = ", parentId);
                        while (parentId !== "") {
                            for (var x = 0; x < length; x++) {
                                if (menu[x].id === parentId) {
                                    breadcrumb.unshift(menu[x]);
                                    parentId = menu[x].parentId;
                                }
                            }
                        }

                    }

                    //var breadcrumbLength = breadcrumb.length;
                    //for (var z = 0; z < breadcrumbLength; z++) {
                    //    if (z === 0)
                    //        breadcrumb[z].isActive = true;
                    //    else
                    //        breadcrumb[z].isActive = false;
                    //}
                    menu[i].isActive = true;
                    currentMenuItem = menu[i];
                } else
                    menu[i].isActive = false;
            }

            $log.log("breadcrumb = ", breadcrumb);
        });

        return {

            getAll: function () {
                return menu;
            },

            add: function (parameters) {
                if (parameters === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$navigation -> add: Не задан объект с параметрами");
                    return false;
                }

                if (parameters.id === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$navigation -> add: Не задан параметр - идентификатор раздела");
                    return false;
                }

                if (parameters.url === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$navigation -> add: Не задан параметр - url раздела");
                    return false;
                }

                var item = $factory({ classes: ["MenuItem"], base_class: "MenuItem" });
                item.id = parameters.id;
                item.parentId = parameters.parentId !== undefined ? parameters.parentId : "";
                item.url = parameters.url;
                item.order = parameters.order !== undefined ? parameters.order : 0;
                item.icon = parameters.icon !== undefined ? parameters.icon : "";
                item.title = parameters.title !== undefined ? parameters.title : "";
                item.description = parameters.description !== undefined ? parameters.description : "";
                item.isVisible = parameters.isVisible !== undefined ? parameters.isVisible : true;

                menu.push(item);
                $log.info("menus = ", menu);
            },

            select: function (menuId, callback) {
                if (menuId === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$navigation -> select: Не задан параметр - идентификатор раздела");
                    return false;
                }

                var length = menu.length;
                var found = false;
                for (var i = 0; i < length; i++) {
                    if (menu[i].id === menuId) {
                        menu[i].isActive = true;
                        found = true;
                        currentMenuItem = menu[i];
                        if (callback !== undefined && typeof callback === "function")
                            callback(currentMenuItem);
                    } else
                        menu[i].isActive = false;
                    return found;
                }
            }

        }
    }]);