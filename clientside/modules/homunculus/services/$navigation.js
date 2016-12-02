angular
    .module("homunculus")
    .factory("$navigation", ["$log", "$rootScope", "$factory", "$errors", function ($log, $rootScope, $factory, $errors) {
        var routes = [];
        var breadcrumb = [];
        var currentRoute = undefined;



        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            //$log.log("current = ", current);
            //$log.log("next = ", next);

            breadcrumb = [];
            var length = routes.length;

            for (var i = 0; i < length; i++) {
                var parent = api.getById(routes[i].parentId);
                if (routes[i].url === next.$$route.originalPath) {
                    breadcrumb.push(routes[i]);
                    if (routes[i].parentId !== undefined && routes[i].parentId !== "") {
                        var parentId = routes[i].parentId;
                        while (parentId !== undefined && parentId !== "") {
                            for (var x = 0; x < length; x++) {
                                if (routes[x].id === parentId) {
                                    breadcrumb.unshift(routes[x]);
                                    parentId = routes[x].parentId;
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
                    routes[i].isActive = true;
                    currentRoute = routes[i];
                } else
                    routes[i].isActive = false;
            }
            if (currentRoute !== undefined && currentRoute.onSelect !== undefined && typeof currentRoute.onSelect === "function")
                currentRoute.onSelect();

            //$log.log("breadcrumb = ", breadcrumb);
        });

        var api =  {


            /**
             *
             * @returns {Array}
             */
            getAll: function () {
                return routes;
            },



            getById: function (id) {
                if (id === undefined && id === "") {
                    $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "$navigation -> GetById: Не задан параметр - идентификатор раздела");
                    return false;
                }

                var length = routes.length;
                for (var i = 0; i < length; i++) {
                    if (routes[i].id === id) {
                        return routes[i];
                    }
                }

                return false;
            },



            add: function (parameters) {
                if (parameters === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$navigation -> add: Не задан объект с параметрами");
                    return false;
                }

                if (parameters.id === undefined || parameters.id === "") {
                    $errors.add(ERROR_TYPE_DEFAULT, "$navigation -> add: Не задан параметр - идентификатор раздела");
                    return false;
                }

                if (parameters.url === undefined || parameters.url === "") {
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
                item.onSelect = parameters.onSelect !== undefined && typeof parameters.onSelect === "function" ? parameters.onSelect : undefined;

                routes.push(item);
                //$log.info("menus = ", menu);
            },

            select: function (routeId, callback) {
                if (routeId === undefined) {
                    $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "$navigation -> select: Не задан параметр - идентификатор пути");
                    return false;
                }

                var length = routes.length;
                var found = false;
                for (var i = 0; i < length; i++) {
                    if (routes[i].id === routeId) {
                        routes[i].isActive = true;
                        found = true;
                        currentMenuItem = routes[i];
                        if (callback !== undefined && typeof callback === "function")
                            callback(currentMenuItem);
                    } else
                        routes[i].isActive = false;
                    return found;
                }
            }

        };

        return api;
    }]);