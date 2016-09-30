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
