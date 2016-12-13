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