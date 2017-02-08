/* Константы кодов ошибок */
var ERROR_TYPE_DEFAULT = 1;
var ERROR_TYPE_ENGINE = 2;
var ERROR_TYPE_DATABASE = 3;
var ERROR_TYPE_LDAP = 4;

/* Константы типов данных */
var DATA_TYPE_INTEGER = 1;
var DATA_TYPE_STRING = 2;
var DATA_TYPE_FLOAT = 3;
var DATA_TYPE_BOOLEAN = 4;



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
                //$log.info("Класс " + title + " добавлен в стек классов");
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
        var errors = [];
        var types = {
            ERROR_TYPE_DEFAULT: 1,
            ERROR_TYPE_ENGINE: 2,
            ERROR_TYPE_DATABASE: 3
        };

        var api = {
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
            },








            /**
             * Объект с типами ошибок
             */
            type: types,

            /**
             * Генерирует ошибку
             * @param type {number} - тип ошибки
             * @param message {string} - содержание ошибки
             * @returns {boolean} - возвращает true в случае успешного завершения, false - в противном случае
             */
            push: function (errorType, message) {
                if (errorType === undefined) {
                    $log.error("$errors -> push: Не задан параметр - тип ошибки");
                    return false;
                }

                var errorTypeFound = false;
                for (var i in api.type) {
                    if (api.type[i] === errorType)
                        errorTypeFound = true;
                }
                if (errorTypeFound === false) {
                    $log.error("$errors -> push: Неверно задан тип ошибки");
                    return false;
                }

                if (message === undefined || message === "") {
                    $log.error("$errors -> push: Не задан параметр - содержание ошибки");
                    return false;
                }

                var now = new moment();
                var error = $factory({ classes: ["Error", "Model"], base_class: "Error" });
                error.timestamp = now.unix();
                error.type = errorType;
                error.message = message;
                errors.push(error);
                $log.error(now.format("DD.MM.YYYY HH:mm") + " " + message);
                return true;
            },


            /**
             * Производит инициализацию из источника данных
             * @param source {array/object} - источник данных
             * @returns {boolean} - возвращает true в случае успешного завершения, false - в противном случае
             */
            init: function (source) {
                if (source === undefined) {
                    api.push(api.types.ERROR_TYPE_DEFAULT, "$errors -> init: Не задан параметр - источник данных");
                    return false;
                }

                switch (typeof source) {
                    case "array":
                        var length = source.length;
                        for (var i = 0; i < length; i++) {
                            var error = $factory({ classes: ["Error", "Model"], base_class: "Error" });
                            error._model_.fromJSON(source[i]);
                            errors.push(error);
                        }
                        break;
                    case "object":
                        var error = $factory({ classes: ["Error", "Model"], base_class: "Error" });
                        error._model_.fromJSON(source);
                        errors.push(error);
                        break;
                }
                return true;
            },







            /**
             * Производит проверку данных на наличие ошибок
             * @param data {object} - объект с данными, которые требуется проверить на наличие ошибок
             * @returns {boolean} - возвращает true в случае успешного завершения, false - в противном случае
             */
            check: function (data) {
                if (data === undefined) {
                    api.push(ERROR_TYPE_DEFAULT, "$errors -> check: Не задан параметр - данные для проверки");
                    return false;
                }

                if (data.errors !== undefined && typeof data.errors === "array") {
                    if (data.errors.length > 0) {
                        for (var i = 0; i < data.errors; i++) {
                            var error = $factory({ classes: ["Error", "Model"], base_class: "Error" });
                            error._model_.fromJSON(data.errors[i]);
                            errors.push(error);
                            api.push(error.type, error.message);
                        }
                    }
                    return true;
                }
            }
        };

        return api;
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

                if (parameters.hasOwnProperty("init")) {
                    for (var x in parameters.init) {
                        if (this.hasOwnProperty(x))
                            if (this[x].constructor === Field)
                                this[x].value = parameters.init[x];
                            else
                                this[x] = parameters.init[x];
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
                    $errors.push($errors.type.ERROR_TYPE_DEFAULT, "$navigation -> GetById: Не задан параметр - идентификатор раздела");
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
                    $errors.push($errors.type.ERROR_TYPE_DEFAULT, "$navigation -> select: Не задан параметр - идентификатор пути");
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
angular
    .module("homunculus")
    .factory("$session", ["$log", "$http", "$classes", "$factory", "$errors", function ($log, $http, $classes, $factory, $errors) {
        var user = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });
        //$log.log("user = ", user);

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
    .factory("$settings", ["$log", "$http", "$errors", "$factory", function ($log, $http, $errors, $factory) {
        var settings = {};
        var isChanged = false;

        return api =  {

            /**
             *
             * @param source
             * @returns {boolean}
             */
            init: function (source) {
                if (source === undefined) {
                    $errors.push($errors.type.ERROR_TYPE_DEFAULT, "$settings -> init: Не задан параметр - источник данных");
                    return false;
                }

                var length = source.length;
                for (var i = 0; i < length; i++) {
                    var setting = $factory({ classes: ["Setting", "Model", "Backup", "States"], base_class: "Setting" });
                    setting._model_.fromJSON(source[i]);
                    setting._onConstruct();
                    setting._backup_.setup();
                    settings[setting.code.value] = setting;
                }
            },


            /**
             *
             * @returns {Array}
             */
            getAll: function () {
                return settings;
            },


            /**
             *
             * @param code
             * @returns {*}
             */
            getByCode: function (code) {
                if (code === undefined) {
                    $errors.push($errors.type.ERROR_TYPE_DEFAULT, "$settings -> getByCode: Не задан параметр - код настройки");
                    return false;
                }

                for (var i in settings) {
                    if (settings[i].code.value === code)
                        return settings[i];
                }
                return false;
            },



            save: function (callback) {
                var params = {
                    action: "saveSettings",
                    data: {}
                };
                for (var setting in settings) {
                    params.data[setting] = settings[setting].value.value;
                }
                $http.post("/serverside/api.php", params).then(
                    function (response) {
                        if (response.data !== undefined && response.data === "true") {
                            if (callback !== undefined && typeof callback === "function")
                                callback();
                            return true;
                        }
                    },
                    function () {
                        $errors.push($errors.type.ERROR_TYPE_ENGINE, "$settings -> save: Не удалось сохранить значение настроек");
                        return false;
                    }
                );
            },


            changed: function (flag) {
                if (flag !== undefined) {
                    isChanged = flag;
                }
                return isChanged;
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
                        user.fio = user.surname.value + " " + user.name.value + " " + user.fname.value;
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
                            allowConfirm: currentUser.allowConfirm.value === true ? 1 : 0,
                            isLDAPEnabled: currentUser.isLDAPEnabled.value === true ? 1 : 0
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
                    url = val;
                    $log.log("interpolated url = ", url);

                });

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
                        scope.$apply(scope.uploaderOnBeforeUpload);
                    }

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

                    $log.info("upload, link = ", url);
                    //if (fd.has("file")) {
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
                            if (scope.uploaderOnCompleteUpload !== undefined && typeof scope.uploaderOnCompleteUpload === "function")
                                scope.uploaderOnCompleteUpload(data);
                            //fd.delete("file");
                            fd = new FormData();
                        });
                    //}
                };

            }
        }
    }]);
angular
    .module("homunculus")
    .filter("integer", ["$errors", function ($errors) {
        return function (input) {
            if (input !== undefined) {
                if (typeof input !== "number")
                    return "";
                else
                    return Math.floor(input);
            }
        };
    }]);