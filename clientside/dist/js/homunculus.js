/* Константы кодов ошибок */
const ERROR_TYPE_DEFAULT = 1;
const ERROR_TYPE_ENGINE = 2;
const ERROR_TYPE_DATABASE = 3;
const ERROR_TYPE_LDAP = 4;

/* Константы типов данных */
const DATA_TYPE_INTEGER = 1;
const DATA_TYPE_STRING = 2;
const DATA_TYPE_FLOAT = 3;
const DATA_TYPE_BOOLEAN = 4;



/**
 * Класс поля модели данных
 * @param parameters {Object} - Параметры инициализации создаваемого объекта
 * @constructor
 */
function Field (parameters) {
    var isChanged = false;
    var beforeChange = "";

    this.source = "";           // Наименование поля-источника данных в БД
    this.value = undefined;     // Значение поля
    this.default_value = "";    // Значение поля по умолчанию
    this.backupable = false;    // Флаг, требуется ли резервировать значение поля
    this.displayable = true;    // Флаг, требуется ли отображать поле
    this.required = false;      // Флаг, является ли поле обязательным для заполнения
    this.title = "";
    this.isValid = false;
    this.raw = false;
    this.type = undefined;

    this._fromAnother_ = function (parameters) {
        if (parameters == undefined || parameters === null) {
            $errors.add(ERROR_TYPE_DEFAULT, "Field -> fromAnother: Не задан параметр - параметры инициализации");
            return false;
        } else {
            for (var param in parameters) {
                if (this.hasOwnProperty(param))
                    this[param] = parameters[param];
            }
        }
    };

    this._change_ = function (flag) {
        if (flag !== undefined && typeof flag === "boolean")
            isChanged = flag;
        return isChanged;
    };

    this._backup_ = function (value) {
        if (value !== undefined)
            beforeChange = value;
        else {
            switch (this.type) {
                case DATA_TYPE_STRING:
                    this.value = beforeChange.toString();
                    break;
                case DATA_TYPE_INTEGER:
                    this.value = parseInt(beforeChange);
                    break;
                case DATA_TYPE_FLOAT:
                    this.value =+ parseFloat(beforeChange).toFixed(6);
                    break;
                case DATA_TYPE_BOOLEAN:
                    this.value = new Boolean(beforeChange);
                    break;
                default:
                    this.value = beforeChange;
                    break;
            }
            this._change_(false);
        }
    };

    if (parameters !== undefined) {
        for (var param in parameters) {
            if (this.hasOwnProperty(param)) {
                this[param] = parameters[param];
            }
        }
        beforeChange = this.value;
    }
};

angular
    .module("homunculus", []);


angular
    .module("homunculus")
    .factory("$classes", ["$log", function ($log) {
        var items = {};

        /**
         * Добавляет класс в стек классов
         * @param className - Наименование класса
         * @param classDefinition - Определение класса
         * @returns {boolean}
         */
        var add = function (title, definition) {
            if (title !== undefined && definition !== undefined && typeof(definition) == "object") {
                items[title] = definition;
                $log.info("Класс " + title + " добавлен в стек классов");
                //$log.log("total = ", items);
                return true;
            } else
                return false;
        };
        
        return {
            /**
             * Добавляет класс в стек классов
             * @param className - Наименование класса
             * @param classDefifnition - Определение класса
             * @returns {boolean}
             */
            add: function (className, classDefinition) {
                add(className, classDefinition);
            },

            /**
             * Возвращает все классы из стека
             * @returns {{}}
             */
            getAll: function () {
                return items;
            }
        };
    }]);

var homunculusInjector = angular.injector(['ng', 'homunculus']);
var $classesInjector = homunculusInjector.get('$classes');

angular
    .module("homunculus")
    .factory("$errors", ["$log", "$classes", "$factory", function ($log, $classes, $factory) {
        
        var items = [];

        return {
            /**
             * Добавляет ошибку в стек
             * @param errorType - Тип ошибки
             * @param errorMessage - Текст ошибки
             * @returns {*} - Error / false
             */
            add: function (errorType, errorMessage) {
                if (errorType !== undefined) {
                    if (!isNaN(errorType)) {
                        if (errorMessage !== undefined) {
                            var tempError = $factory({ classes: ["Error", "Model"], base_class: "Error" });
                            tempError.type.value = errorType;
                            tempError.message.value = errorMessage;
                            tempError.timestamp.value = Math.floor(Date.now() / 1000);
                            items.push(tempError);
                            $log.error(moment.unix(tempError.timestamp.value).format("DD.MM.YYYY HH:mm") + ": " + tempError.message.value);
                            return tempError;
                        } else {
                            $log.error("$errors -> add: Не задан параметр - текст ошибки");
                            return false;
                        }
                    } else {
                        $log.error("$errors -> add: Неверно задан тип параметра - тип ошибки");
                        return false;
                    }
                } else {
                    $log.error("$errors -> add: Не задан параметр - тип ошибки");
                    return false;
                }
            },

            /**
             * Возвращает стек ошибок
             * @returns {Array}
             */
            getAll: function () {
                return items;
            },

            /**
             * Проверяет, является ли объект экземпляром ошибки
             * @param error - Объект для проверки
             * @returns {boolean}
             */
            isError: function (error) {
                if (error !== undefined) {
                    if (typeof error === "object" && error.type !== undefined && error.message !== undefined && error.timestamp !== undefined) {
                        this.add(error.type, error.message);
                        return true;
                    } else
                        return false;
                } else {
                    var tempError = $factory({ classes: ["Error", "Model"], base_class: "Error" });
                    tempError.type.value = ERROR_TYPE_DEFAULT;
                    tempError.message.value = "$errors -> isError: Не задан параметр - объект для проверки";
                    tempError.timestamp.value = Math.floor(Date.now() / 1000);
                    items.push(tempError);
                    return false;
                }
            },

            init: function () {
                if (window.krypton !== undefined && window.krypton !== null) {
                    if (window.krypton.errors !== undefined) {
                        var length = window.krypton.errors.length;
                        for (var i = 0; i < length; i++) {
                            var error = $factory({ classes: ["Error", "Model"], base_class: "Error" });
                            error._model_.fromAnother(window.krypton.errors[i]);
                            items.push(error);
                            $log.error(error.message.value);
                        }
                    }
                }
            },

            checkResponse: function (data) {
                if (data === undefined) {
                    this.add(ERROR_TYPE_DEFAULT, "$errors -> check: Не задан параметр - ответ сервера");
                    return false;
                }

                if (data.errors !== undefined && data.errors.length > 0) {
                    var length = data.errors.length;
                    for (var i = 0; i < length; i++) {
                        var error = $factory({ classes: ["Error", "Model"], base_class: "Error" });
                        error.type.value = data.errors[i].type;
                        error.message.value = data.errors[i].message;
                        error.timestamp.value = data.errors[i].timestamp;
                        items.push(error);
                    }
                }
            }
        }
    }]);

angular
    .module("homunculus")
    .factory("$factory", ["$log", "$classes", function ($log, $classes) {
        function FactoryObject (parameters) {

            var clone = function _clone(obj) {
                if (obj instanceof Array) {
                    var out = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        var value = obj[i];
                        out[i] = (value !== null && typeof value === "object") ? _clone(value) : value;
                    }
                } else {
                    var out = new obj.constructor();
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            var value = obj[key];
                            out[key] = (value !== null && typeof value === "object") ? _clone(value) : value;
                        }
                    }
                }
                return out;
            };

            var _clone = function (it) {
                return this._clone({
                    it: it
                }).it;
            };


            var classes = $classesInjector.getAll();
            var addClass = function (className, destination) {
                if (className !== undefined && destination !== undefined) {
                    if (classes.hasOwnProperty(className)) {
                        destination.init_functions = [];
                        for (var prop in classes[className]) {
                            if (prop !== "__dependencies__") {
                                if (classes[className][prop].constructor !== Function) {
                                    destination[prop] = clone(classes[className][prop]);
                                    if (destination[prop]["__instance__"] !== undefined)
                                        destination[prop]["__instance__"] = destination;
                                    if (destination[prop]["_init_"] !== undefined && destination[prop]["_init_"].constructor === Function)
                                        destination.init_functions.push(destination[prop]["_init_"]);
                                    if (destination["_init_"] !== undefined && destination["_init_"].constructor === Function)
                                        destination.init_functions.push(destination["_init_"]);

                                } else {
                                    destination[prop] = classes[className][prop];
                                    if (prop === "_init_")
                                        destination.init_functions.push(destination[prop]);
                                }
                            }
                        }
                    }
                }
            };


            if (parameters !== undefined) {
                if (parameters.hasOwnProperty("classes")) {
                    if (parameters["classes"].constructor === Array) {
                        for (var parent in parameters["classes"]) {
                            var class_name = parameters["classes"][parent];
                            addClass(class_name, this);
                        }
                    }
                }
                if (parameters.hasOwnProperty("base_class")) {
                    if (classes.hasOwnProperty(parameters["base_class"])) {
                        this.__class__ = parameters["base_class"];
                    }
                }
            }

        };

        return function (parameters) {
            var obj = new FactoryObject(parameters);
            /*
            if (obj.init_functions.length > 0) {
                for (var i = 0; i < obj.init_functions.length; i++) {
                    obj.init_functions[i].call(obj);
                }
            }
            */
            //return new FactoryObject(parameters);
            return obj;
        };
    }]);

var injector = angular.injector(['ng', 'homunculus']);
var factory = injector.get('$factory');

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
angular
    .module("homunculus")
    .factory("$session", ["$log", "$http", "$classes", "$factory", "$errors", function ($log, $http, $classes, $factory, $errors) {
        var user = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });
        $log.log("user = ", user);

        return {

            init: function (source) {
                if (source === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$session -> init: не задан парметр - источник данных");
                    return false;
                }

                if (source.user !== undefined && source.user !== null) {
                    user._model_.fromJSON(source.user);
                }
            },

            getCurrentUser: function () {
                return user;
            },

            login: function (login, password, callback) {
                if (login === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$authorization -> login: Не задан параметр - логин пользователя");
                    return false;
                }

                if (password === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$authorization -> login: Не задан параметр - пароль пользователя");
                    return false;
                }

                var params = {
                    action: "login",
                    data: {
                        login: login,
                        password: password
                    }
                };
                $http.post("/serverside/api.php", params)
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data !== "false") {
                                var temp_user = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });
                                temp_user._model_.fromJSON(data);
                                user._model_.fromJSON(data);
                                if (callback !== undefined && typeof callback === "function")
                                    callback(user);
                                return true;
                            } else {
                                if (callback !== undefined && typeof callback === "function")
                                    callback(false);
                                return true;
                            }
                        }
                        return false;
                    });
            },


            logout: function (callback) {
                if (user.id.value === 0) {
                    $errors.add(ERROR_TYPE_ENGINE, "$session -> logout: Пользователь не авторизован");
                    return false;
                }

                var params = {
                    action: "logout",
                    data: {
                        userId: user.id.value
                    }
                };

                $http.post("/serverside/api.php", params)
                    .success(function () {
                        user.id.value = 0;
                        if (callback !== undefined && typeof callback === "function")
                            callback();
                        return true;
                    })
                    .error(function () {
                        return false;
                    });
            }
        }
    }]);

angular
    .module("homunculus")
    .factory("$users", ["$log", "$http", "$errors", "$classes", "$factory", function ($log, $http, $errors, $classes, $factory) {
        var users = [];
        var currentUser = undefined;
        var newUser = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });
        var usersOnPage = 20;
        var currentPage = 1;

        newUser._backup_.setup();

        return {

            users: {


                init: function (source) {
                    if (source === undefined) {
                        $errors.add(ERROR_TYPE_DEFAULT, "$users -> init: Не задан параметр - источник данных");
                        return false;
                    }

                    var length = source.length;
                    for (var i = 0; i < length; i++) {
                        var user = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });
                        user._model_.fromJSON(source[i]);
                        user._backup_.setup();
                        users.push(user);
                    }
                    return true;
                },


                getAll: function () {
                    return users;
                },


                getCurrent: function () {
                    return currentUser;
                },

                getNew: function () {
                    return newUser;
                },

                getById: function (userId, callback) {
                    if (userId === undefined) {
                        $errors.add(ERROR_TYPE_DEFAULT, "$users -> users -> getById: Не задан параметр - идентификатор пользователя");
                        return false;
                    }

                    var length = users.length;
                    for (var i = 0; i < length; i++) {
                        if (users[i].id.value === userId) {
                            $log.info("getting user from cache");
                            currentUser = users[i];
                            return currentUser;
                        }
                    }

                    var params = {
                        action: "getUserById",
                        data: {
                            id: userId
                        }
                    };

                    return $http.post("/serverside/api.php", params).then(

                        function success(response) {
                            $log.info("promise success");
                            var user = $factory({classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser"});
                            user._model_.fromJSON(response.data);
                            user._backup_.setup();
                            currentUser = user;
                            if (callback !== undefined && typeof callback === "function")
                                callback(currentUser);
                            return currentUser;
                        },

                        function error() {
                            return false;
                        }
                    );
                },


                select: function (userId, callback) {
                    if (userId === undefined) {
                        $errors.add(ERROR_TYPE_DEFAULT, "$users -> users -> select: Не задан параметр - идентификатор пользователя");
                        return false;
                    }

                    var length = users.length;
                    for (var i = 0; i < length; i++) {
                        if (users[i].id.value === userId) {
                            if (callback !== undefined && typeof callback === "function")
                                callback(users[i]);
                            return users[i];
                        }
                    }
                    return false;
                },


                add: function (success, error) {
                    var params = {
                        action: "addUser",
                        data: {
                            divisionId: newUser.divisionId.value,
                            name: newUser.name.value,
                            fname: newUser.fname.value,
                            surname: newUser.surname.value,
                            email: newUser.email.value,
                            login: newUser.login.value,
                            password: newUser.password.value,
                            isAdministrator: newUser.isAdministrator.value === true ? 1 : 0,
                            allowEdit: newUser.allowEdit.value === true ? 1 : 0,
                            allowConfirm: newUser.allowConfirm.value === true ? 1 : 0
                        }
                    };
                    $http.post("/serverside/api.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                var user = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });
                                user._model_.fromJSON(data);
                                user._backup_.setup();
                                users.push(user);
                                newUser._backup_.restore();
                                if (success !== undefined && typeof success === "function")
                                    success(user);
                                return true;
                            } else
                                return false;
                        })
                        .error(function (data) {
                            if (error !== undefined && typeof error === "function")
                                error(data);
                            return false;
                        });
                },


                edit: function (callback) {
                    if (currentUser === undefined) {
                        $errors.add("$users -> users -> edit: Текущий пользователь не выбран");
                        return false;
                    }

                    var params = {
                        action: "editUser",
                        data: {
                            id: currentUser.id.value,
                            divisionId: currentUser.divisionId.value,
                            surname: currentUser.surname.value,
                            name: currentUser.name.value,
                            fname: currentUser.fname.value,
                            email: currentUser.email.value,
                            login: currentUser.login.value,
                            password: currentUser.password.value,
                            isAdministrator: currentUser.isAdministrator.value === true ? 1 : 0,
                            allowEdit: currentUser.allowEdit.value === true ? 1: 0,
                            allowConfirm: currentUser.allowConfirm.value === true ? 1 : 0
                        }
                    };

                    currentUser._states_.loading(true);
                    $http.post("/serverside/api.php", params)
                        .success(function (data) {
                            currentUser._states_.loading(false);
                            if (data !== undefined) {
                                var user = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });
                                user._model_.fromJSON(data);
                                user._backup_.setup();
                                currentUser = user;
                                if (callback !== undefined && typeof callback === "function")
                                    callback(currentUser);
                                return true;
                            }
                            return false;
                        })
                        .error(function () {
                            currentUser._states_.loading(false);
                            return false;
                        });
                }

            },









            loadNextPage: function (callback) {
                var params = {
                    action: "loadUsers",
                    data: {
                        start: start
                    }
                };
            },





            edit: function (callback) {
                if (currentUser !== undefined) {
                    var params = {
                        action: "editUser", data: {
                            id: currentUser.id.value,
                            divisionId: currentUser.divisionId.value,
                            name: currentUser.name.value,
                            fname: currentUser.fname.value,
                            surname: currentUser.surname.value,
                            email: currentUser.email.value,
                            isAdministrator: currentUser.isAdministrator.value
                        }
                    };
                    $http.post("/serverside/api.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                currentUser._backup_.setup();
                                currentUser._states_.changed(false);

                                if (callback !== undefined && typeof callback === "function")
                                    callback(currentUser);

                                return true;
                            }
                        });
                }
                return false;
            }
        }
    }]);
angular
    .module("homunculus")
    .directive("uploader", ["$log", "$http", "$errors", function ($log, $http, $errors) {
        return {
            restrict: "A",
            scope: {
                //uploaderUrl: "=",
                uploaderData: "=",
                uploaderOnCompleteUpload: "=",
                uploaderOnBeforeUpload: "="
            },
            link: function (scope, element, attrs) {
                var url = "";
                var fd = new FormData();

                if (attrs.uploaderUrl === undefined || attrs.uploaderUrl === "") {
                    $errors.add(ERROR_TYPE_DEFAULT, "uploader -> Не задан атрибут - url");
                    return false;
                }

                attrs.$observe("uploaderUrl", function (val) {
                    $log.log("interpolated url = ", val);
                    url = val;
                });

                //scope.$watch("uploaderUrl", function (val) {
                //    $log.log("url = ", val);
                //    url = val;
                //});

                /**
                 * Отслеживаем выбор файла для загрузки
                 */
                element.bind("change", function () {
                    //var fd = new FormData();
                    angular.forEach(element[0].files, function (file) {
                        $log.log(file);
                        fd.append("file", file);
                    });

                    /* Если задан коллбэк onBeforeUpload - выполняем его */
                    $log.log(scope.uploaderOnBeforeUpload);
                    if (scope.uploaderOnBeforeUpload !== undefined && typeof scope.uploaderOnBeforeUpload === "function") {
                        //scope.$apply(scope.uploaderOnBeforeUpload);
                        scope.uploaderOnBeforeUpload();
                       // scope.upload();
                    } //else
                        //scope.upload();

                    /* Если заданы данные для отправки на сервер - добавляем их в данные формы для отправки */
                    if (scope.uploaderData !== undefined) {
                        $log.info(scope.uploaderData);
                        for (var param in scope.uploaderData) {
                            fd.append(param, scope.uploaderData[param]);
                        }
                    }

                    scope.upload();

                });

                /**
                 * Отправляет данные на сервер
                 */
                scope.upload = function () {
                    if (fd.has("file")) {
                        element.prop("disabled", "disabled");
                        $http.post(url, fd,
                            {
                                transformRequest: angular.identity,
                                headers: {
                                    "Content-Type": undefined
                                }
                            }
                        ).success(function (data) {
                                $log.log(data);
                                element.prop("disabled", "");
                                if (scope.uploaderOnCompleteUpload !== undefined)
                                    scope.uploaderOnCompleteUpload(data);
                                fd.delete("file");
                                fd = new FormData();
                            }
                        );
                    }
                };

            }
        }
    }]);