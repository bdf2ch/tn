/********************
 * Model
 * Набор свойст и методов, описывающих модель данных
 ********************/
$classesInjector.add("Model", {
    __dependencies__: [],
    _model_: {
        __instance__: "",
        _errors_: [],
        db_table: "",

        /**
         * Производит инициализацию модели данных на основе JSON-данных
         * @param JSONdata {JSON} - Набор JSON-данных
         * @returns {number} - Возвращает количество полей, проинициализированных из JSON-данных
         */
        fromJSON: function (JSONdata) {
            var result = 0;
            for (var data in JSONdata) {

                for (var prop in this.__instance__) {

                    if (this.__instance__[prop].constructor === Field && this.__instance__[prop].source === data) {

                        if (JSONdata[data] !== "") {

                            if (this.__instance__[prop].type !== undefined) {
                                switch (this.__instance__[prop].type) {
                                    case DATA_TYPE_STRING:
                                        this.__instance__[prop].value = JSONdata[data].toString();
                                        this.__instance__[prop]._backup_(JSONdata[data].toString());
                                        break;
                                    case DATA_TYPE_INTEGER:
                                        if (!isNaN(JSONdata[data])) {
                                            this.__instance__[prop].value = parseInt(JSONdata[data]);
                                            this.__instance__[prop]._backup_(parseInt(JSONdata[data]));
                                        } else {
                                            $log.error("$classes [Model]: Значение поля '" + data + "' в наборе JSON-данных не является числовым значением, свойству объекта присвоен 0");
                                            this.__instance__[prop].value = 0;
                                            this.__instance__[prop]._backup_(0);
                                        }
                                        break;
                                    case DATA_TYPE_FLOAT:
                                        if (!isNaN(JSONdata[data])) {
                                            this.__instance__[prop].value = +parseFloat(JSONdata[data]).toFixed(6);
                                            this.__instance__[prop]._backup_(+parseFloat(JSONdata[data]).toFixed(6));
                                        } else {
                                            $log.error("$classes [Model]: Значение поля '" + data + "' в наборе JSON-данных не является числовым значением, свойству объекта присвоен 0");
                                            this.__instance__[prop].value = 0.0;
                                            this.__instance__[prop]._backup_(0.0);
                                        }
                                        break;
                                    case DATA_TYPE_BOOLEAN:
                                        if (!isNaN(JSONdata[data])) {
                                            var value = parseInt(JSONdata[data]);
                                            if (value === 1 || value === 0) {
                                                this.__instance__[prop].value = value === 1 ? true : false;
                                                this.__instance__[prop]._backup_(this.__instance__[prop].value);
                                            } else {
                                                $log.error("$classes [Model]: Значение поля '" + data + "' в наборе JSON-данных не является интрепретируемым в логическое значение, свойству объекта присвоен false");
                                                this.__instance__[prop].value = false;
                                                this.__instance__[prop]._backup_(false);
                                            }
                                        } else {
                                            var value = JSONdata[data].toString().toLowerCase();
                                            if (value === "true" || value === "false") {
                                                this.__instance__[prop].value = value === "true" ? true : false;
                                                this.__instance__[prop]._backup_(this.__instance__[prop].value);
                                            } else {
                                                $log.error("$classes [Model]: Значение поля '" + data + "' в наборе JSON-данных не является интрепретируемым в логическое значение, свойству объекта присвоен false");
                                                this.__instance__[prop].value = false;
                                                this.__instance__[prop]._backup_(false);
                                            }
                                        }
                                        break;
                                }
                            } else {
                                /* Для совместимости */
                                if (isNaN(JSONdata[data]) === false) {
                                    if (JSONdata[data] !== null) {

                                        if (JSONdata[data].constructor === Boolean) {
                                            this.__instance__[prop].value = JSONdata[data];
                                        } else
                                            this.__instance__[prop].value = parseInt(JSONdata[data]);

                                    }
                                } else {
                                    this.__instance__[prop].value = JSONdata[data];
                                }
                            }
                        } else
                            this.__instance__[prop].value = "";

                        result++;
                    }

                }

            }
            if (this.__instance__["onInitModel"] !== undefined) {
                if (this.__instance__["onInitModel"].constructor === Function) {
                    this.__instance__.onInitModel();
                }
            }
            return result;
        },


        /**
         * Производит инициализацию модели данных на основе другого объекта, копируя значения совпадающих свойств
         * @param obj {object} - Объект, на основе которого требуется произвести инициализацию
         */
        fromAnother: function (obj) {
            if (obj === undefined) {
                $errors.add(ERROR_TYPE_DEFAULT, "Model -> fromAnother: Не задан параметр - объект, на основе которого трекуется провести инициализацию");
                return false;
            } else {

                for (var anotherProp in obj) {
                    if (obj[anotherProp] === null) {
                        $log.info("Model -> fromAnother: Отсутствует значение (null) свойста '" + anotherProp + "' объекта, на основе которого требуется провести инициализаццию");
                        return false;
                    } else {

                        if (this.__instance__.hasOwnProperty(anotherProp)) {
                            if (isField(this.__instance__[anotherProp])) {
                                if (this.__instance__[anotherProp].type !== undefined) {
                                    switch (this.__instance__[anotherProp].type) {
                                        case DATA_TYPE_STRING:
                                            if (isField(obj[anotherProp])) {
                                                this.__instance__[anotherProp]._fromAnother_(obj[anotherProp]);
                                                this.__instance__[anotherProp]._backup_(obj[anotherProp].value.toString());
                                            } else {
                                                this.__instance__[anotherProp].value = obj[anotherProp].toString();
                                                this.__instance__[anotherProp]._backup_(obj[anotherProp].toString());
                                            }
                                            break;
                                        case DATA_TYPE_INTEGER:
                                            var value = isField(obj[anotherProp]) ? obj[anotherProp].value : obj[anotherProp];


                                            if (!isNaN(value)) {
                                                if (isField(obj[anotherProp])) {
                                                    this.__instance__[anotherProp]._fromAnother_(obj[anotherProp]);
                                                    this.__instance__[anotherProp]._backup_(parseInt(obj[anotherProp].value));
                                                } else {
                                                    this.__instance__[anotherProp].value = parseInt(obj[anotherProp]);
                                                    this.__instance__[anotherProp]._backup_(parseInt(obj[anotherProp]));
                                                }
                                            } else {
                                                $log.info("$classes -> Model: Значение поля '" + anotherProp + "' в наборе JSON-данных не является числовым значением, свойству объекта присвоен 0");
                                                this.__instance__[anotherProp].value = 0;
                                                this.__instance__[anotherProp]._backup_(0);
                                            }
                                            break;
                                        case DATA_TYPE_FLOAT:
                                            if (!isNaN(obj[anotherProp])) {
                                                if (isField(obj[fromAnother()])) {
                                                    this.__instance__[anotherProp]._fromAnother_(obj[anotherProp]);
                                                    this.__instance__[anotherProp]._backup_(+parseFloat(obj[anotherProp].value).toFixed(6));
                                                } else {
                                                    this.__instance__[anotherProp].value = +parseFloat(obj[anotherProp]).toFixed(6);
                                                    this.__instance__[anotherProp]._backup_(+parseFloat(obj[anotherProp]).toFixed(6));
                                                }
                                            } else {
                                                $log.info("$classes -> Model: Значение поля '" + anotherProp + "' в наборе JSON-данных не является числовым значением, свойству объекта присвоен 0");
                                                this.__instance__[anotherProp].value = 0.0;
                                                this.__instance__[anotherProp]._backup_(0.0);
                                            }
                                            break;
                                        case DATA_TYPE_BOOLEAN:
                                            if (!isNaN(obj[anotherProp])) {
                                                var value = isField(obj[anotherProp]) ? parseInt(obj[anotherProp].value) : parseInt(obj[anotherProp]);
                                                if (value === 1 || value === 0) {
                                                    this.__instance__[anotherProp].value = value === 1 ? true : false;
                                                    this.__instance__[anotherProp]._backup_(this.__instance__[anotherProp].value);
                                                } else {
                                                    $log.info("$classes -> Model: Значение поля '" + anotherProp + "' в наборе JSON-данных не является интрепретируемым в логическое значение, свойству объекта присвоен false");
                                                    this.__instance__[anotherProp].value = false;
                                                    this.__instance__[anotherProp]._backup_(false);
                                                }
                                            } else {
                                                var value = isField(obj[anotherProp]) ? obj[anotherProp].value.toString().toLowerCase() : obj[anotherProp].toString().toLowerCase();

                                                if (value === "true" || value === "false") {
                                                    this.__instance__[anotherProp].value = value === "true" ? true : false;
                                                    this.__instance__[anotherProp]._backup_(this.__instance__[anotherProp].value);
                                                } else {
                                                    $log.info("$classes -> Model: Значение поля '" + anotherProp + "' в наборе JSON-данных не является интрепретируемым в логическое значение, свойству объекта присвоен false");
                                                    this.__instance__[anotherProp].value = false;
                                                    this.__instance__[anotherProp]._backup_(false);
                                                }
                                            }
                                            break;
                                    }

                                } else {
                                    if (isField(obj[anotherProp])) {
                                        this.__instance__[anotherProp].value = obj[anotherProp].value;
                                        this.__instance__[anotherProp]._backup_(obj[anotherProp].value);
                                    } else {

                                        this.__instance__[anotherProp].value = obj[anotherProp];
                                        this.__instance__[anotherProp]._backup_(obj[anotherProp]);
                                    }
                                }

                            } else {
                                if (isField(obj[anotherProp]))
                                    this.__instance__[anotherProp] = obj[anotherProp].value;
                                else
                                    this.__instance__[anotherProp] = obj[anotherProp];
                            }
                        }
                    }
                }
            }

            if (this.__instance__["onInitModel"] !== undefined) {
                if (this.__instance__["onInitModel"].constructor === Function) {
                    this.__instance__.onInitModel();
                }
            }
        },


        /**
         * Возвращает значения полей модели данных в виде строки
         * @returns {string} - Возвращает значения полей модели в виде строки
         */
        toString: function () {
            var result = {};
            for (var prop in this.__instance__) {
                if (this.__instance__[prop].constructor === Field) {
                    result[prop] = this.__instance__[prop];
                }
            }
            return JSON.stringify(result);
        },


        /**
         * Производит сброс значений полей модели данных к значениям по умолчанию
         * @returns {number} - Возвращает количество полей, чьи значения были установлены в значение по
         *                      умолчанию
         */
        reset: function () {
            var result = 0;
            for (var prop in this.__instance__) {
                if (this.__instance__[prop].constructor === Field &&
                    this.__instance__[prop].default_value !== undefined) {
                    this.__instance__[prop].value = this.__instance__[prop].default_value;
                    result++;
                }
            }
            return result;
        },


        _init_: function () {
            for (var prop in this.__instance__) {
                if (this.__instance__[prop].constructor === Field &&
                    this.__instance__[prop].default_value !== undefined) {
                    this.__instance__[prop].value = this.__instance__[prop].default_value;
                }
            }
        }
    }
});