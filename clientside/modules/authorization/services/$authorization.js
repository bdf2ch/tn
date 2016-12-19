angular
    .module("authorization")
    .factory("$authorization", ["$log", "$http", "$classes", "$factory", "$errors", function ($log, $http, $classes, $factory, $errors) {
        $classes.add("AppUser", {
            id: new Field({ source: "ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
            divisionId: new Field({ source: "DIVISION_ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
            surname: new Field({ source: "SURNAME", type: DATA_TYPE_STRING, value: "", default_value: "" }),
            name: new Field({ source: "NAME", type: DATA_TYPE_STRING, value: "", default_value: "" }),
            fname: new Field({ source: "FNAME", type: DATA_TYPE_STRING, value: "", default_value: "" }),
            email: new Field({ source: "EMAIL", type: DATA_TYPE_STRING, value: "", default_value: "" }),
            password: new Field({ source: "PASSWORD", type: DATA_TYPE_STRING, value: "", default_value: "" }),
            isAdministrator: new Field({ source: "IS_ADMINISTRATOR", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
            allowEdit: new Field({ source: "ALLOW_EDIT", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
            allowConfirm: new Field({ source: "ALLOW_CONFIRM", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 })
        });

        var user = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });

        return {
            init: function () {
                if (window.initialData !== undefined && window.initialData !== null) {
                    if (window.initialData.user !== undefined) {
                        user._model_.fromJSON(window.initialData.user);
                    }
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
                                var user = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });
                                //$log.log("usr = ", user);
                                user._model_.fromJSON(data);
                                //user._model_.fromJSON(data);
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
            }
        }
    }]);