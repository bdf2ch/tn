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