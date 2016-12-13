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
