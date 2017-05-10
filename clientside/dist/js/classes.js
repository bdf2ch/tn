
    $classesInjector.add("AppUser", {
        id: new Field({ source: "ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        divisionId: new Field({ source: "DIVISION_ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0, backupable: true }),
        surname: new Field({ source: "SURNAME", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        name: new Field({ source: "NAME", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        fname: new Field({ source: "FNAME", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        email: new Field({ source: "EMAIL", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        login: new Field({ source: "LOGIN", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        password: new Field({ source: "PASSWORD", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        isAdministrator: new Field({ source: "IS_ADMINISTRATOR", type: DATA_TYPE_BOOLEAN, value: false, default_value: false, backupable: true }),
        allowEdit: new Field({ source: "ALLOW_EDIT", type: DATA_TYPE_BOOLEAN, value: false, default_value: false, backupable: true }),
        allowConfirm: new Field({ source: "ALLOW_CONFIRM", type: DATA_TYPE_BOOLEAN, value: false, default_value: false, backupable: true }),
        isLDAPEnabled: new Field({ source: "IS_LDAP_ENABLED", type: DATA_TYPE_BOOLEAN, value: true, default_value: true, backupable: true })
    });
/******************************
 * Backup
 * Набор свойств и методов, реализующих резервное копирование данных объекта
 ******************************/
$classesInjector.add("Backup", {
    __dependencies__: [],
    _backup_: {
        __instance__: "",
        data: {},

        /**
         * Устанавливает резервные значения для полей, помеченных для бэкапа
         * @returns {number} - Возвращает количество полей, для короых созданы резервные значения
         */
        setup: function () {
            var result = 0;
            for (var prop in this.__instance__) {
                if (this.__instance__[prop].constructor === Field && this.__instance__[prop].backupable !== undefined && this.__instance__[prop].backupable === true && this.__instance__[prop] !== null) {
                    if (this.__instance__[prop].type !== undefined) {
                        switch (parseInt(this.__instance__[prop].type)) {
                            case DATA_TYPE_STRING:
                                this.data[prop] = this.__instance__[prop].value.toString();
                                break;
                            case DATA_TYPE_INTEGER:
                                this.data[prop] = parseInt(this.__instance__[prop].value);
                                break;
                            case DATA_TYPE_FLOAT:
                                this.data[prop] = +parseFloat(this.__instance__[prop].value).toFixed(6);
                                break;
                            case DATA_TYPE_BOOLEAN:
                                this.data[prop] = this.__instance__[prop].value;
                                break;
                        }
                    } else {
                        this.data[prop] = this.__instance__[prop].value;
                        result++;
                    }
                }
            }
            if (this.__instance__._init_ !== undefined)
                this.__instance__._init_();
            return result;
        },

        /**
         * Восстанавливает резервные значения полей, занесенных в бэкап
         * @returns {number} Возвращает количество полей, для которых восстановлены резервные значения
         */
        restore: function () {
            var result = 0;
            for (var prop in this.data) {
                if (this.__instance__[prop] !== undefined &&
                    this.__instance__[prop].constructor === Field &&
                    this.__instance__[prop].backupable === true) {
                    this.__instance__[prop].value = this.data[prop];
                    result++;
                }
            }
            if (this.__instance__.onInitModel !== undefined)
                this.__instance__.onInitModel();
            if (this.__instance__.onRestoreBackup !== undefined && typeof (this.__instance__.onRestoreBackup === "function"))
                this.__instance__.onRestoreBackup();
            return result;
        },

        toString: function () {
            return JSON.stringify(this.data);
        }
    }
});

/******************************
 * Collection
 * Набор свойств и методов, описывающих коллекцию элементов
 ******************************/
$classesInjector.add("Collection", {
    items: [],
    selectedItems: [],
    allowMultipleSelect: false,
    allowMultipleSearch: false,

    /**
     * Возвращает количество элементов в коллекции
     * @returns {Number} - Возвращает размер коллекции
     */
    size: function () {
        return this.items.length;
    },

    /**
     * Выводит в консоль все элементы коллекции
     * @returns {Number} - Возвращает количество элементов в коллекции
     */
    display: function () {
        var result = this.items.length;
        if (console !== undefined) {
            console.log(this.items);
        }
        return result;
    },

    /**
     * Включает / выключает режим поиска нескольких элементов коллекции
     * @param flag {boolean} - Флаг, включения / выключения режима поиска нескольких элементов коллекции
     * @returns {boolean} - Возвращает флаг, включен ли режим поиска нескольких элементов коллекции
     */
    multipleSearch: function (flag) {
        var result = false;
        if (flag !== undefined) {
            if (flag.constructor === Boolean) {
                this.allowMultipleSearch = flag;
                result = this.allowMultipleSearch;
            } else
                $log.error("$classes 'Collection': Параметр должен быть типа Boolean");
        } else
            $log.error("$classes 'Collection': Не указан параметр при установке режима поиска нескольких элементов");
        return result;
    },

    /**
     * Возвращает элемент коллекции, поле field которого равен value
     * @param field {String} - Наименование поля
     * @param value - Значение искомого поля
     * @returns {boolean/Any} - Возвращает искомый элемент коллекции, в противном случае false
     */
    find: function (field, value) {
        var result = false;
        var temp_result = [];
        var length = this.items.length;

        /* Если требуется найти элемент коллекции по значению поля */
        if (field !== undefined && value !== undefined) {
            //console.log("finding item by field and value");
            for (var i = 0; i < length; i++) {
                if (this.items[i][field] !== undefined) {
                    if (this.items[i][field].constructor === Field) {
                        if (this.items[i][field].value === value) {
                            if (this.allowMultipleSearch === true) {
                                temp_result.push(this.items[i]);
                            } else {
                                temp_result.splice(0, temp_result.length);
                                temp_result.push(this.items[i]);
                                result = this.items[i];
                            }
                        }
                    } else {
                        if (this.items[i][field] === value) {
                            if (this.allowMultipleSearch === true) {
                                temp_result.push(this.items[i]);
                            } else {
                                temp_result.splice(0, temp_result.length);
                                temp_result.push(this.items[i]);
                                result = this.items[i];
                            }
                        }
                    }
                }
            }
        }

        /* Если требуется найти элемент коллекции по значению */
        if (field !== undefined && value === undefined) {
            //console.log("finding item by value");
            for (var i = 0; i < length; i++) {
                if (this.items[i] === field) {
                    if (this.allowMultipleSearch === true) {
                        temp_result.push(this.items[i]);
                        result = this.items[i];
                    } else {
                        temp_result.splice(0, temp_result.length);
                        temp_result.push(this.items[i]);
                    }
                }
            }
        }

        if (temp_result.length === 0)
            return false;
        else if (temp_result.length === 1)
            return temp_result[0];
        else if (temp_result.length > 1)
            return temp_result;
    },


    /**
     * Добавляет элемент в конец коллекции
     * @param item {Any} - Элемент, добавляемый в коллекцию
     * @returns {boolean / Number} - Возвращает новую длину коллекции, false в случае некорректного завершения
     */
    append: function (item) {
        var result = false;
        if (item !== undefined) {
            this.items.push(item);
        }
        return item;
    },

    /**
     * Удаляет элементы по значению поля и по значению
     * @param field {String} - Наименование поля
     * @param value {Any} - Значение поля
     * @returns {Number} - Возвращает количество удаленных элементов
     */
    delete: function (field, value) {
        var result = 0;
        var length = this.items.length;

        /* Если требуется удалить элементы коллекции по полю и его значению */
        if (field !== undefined && value !== undefined) {
            console.log("deleting by field and value");
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i][field] !== undefined) {
                    if (this.items[i][field].constructor === Field) {
                        if (this.items[i][field].value === value) {
                            this.items.splice(i, 1);
                            result++;
                        }
                    } else {
                        if (this.items[i][field] === value) {
                            this.items.splice(i, 1);
                            result++;
                        }
                    }
                }
            }
        }

        /* Если требуется удалить элементы по значению */
        if (field !== undefined && value === undefined) {
            console.log("deleting by value");
            for (var i = 0; i < length; i++) {
                if (this.items[i] === field) {
                    this.items.splice(i, 1);
                    result++;
                }
            }
        }

        return result;
    },

    /**
     *
     */
    clear: function () {
        this.items.splice(0, this.items.length);
        return true;
    },

    /**
     * Включает / выключает режим выбора нескольких элементов коллекции
     * @param flag {boolean} - Флаг включения / выключения режима выбора нескольких элементов коллекции
     * @returns {boolean} - Возвращает флаг, включен ли режим выбора нескольких элементов коллекции
     */
    multipleSelect: function (flag) {
        if (flag !== undefined) {
            if (flag.constructor === Boolean) {
                this.allowMultipleSelect = flag;
                return this.allowMultipleSelect;
            } else
                $log.error("$classes 'Collection': Параметр должен быть типа Boolean");
        } else
            $log.error("$classes 'Collection': Не указан параметр при установке режима выбора нескольких элементов");
    },

    /**
     * Помечает элемент коллекции как выбранный
     * @param field {string} - Наименование поля элемента коллекции
     * @param value {any} - Значение поля элемента коллекции
     * @returns {number}
     */
    select: function (field, value) {
        var result = [];
        if (field !== undefined && value !== undefined) {
            var length = this.items.length;
            for (var i = 0; i < length; i++) {
                if (this.items[i].hasOwnProperty(field)) {
                    var item = undefined;
                    if (this.items[i][field].constructor === Field) {
                        if (this.items[i][field].value === value) {
                            console.log("element found", this.items[i]);
                            item = this.items[i];
                        }
                    } else {
                        if (this.items[i][field] === value)
                            item = this.items[i];
                    }
                    if (item !== undefined) {
                        if (this.allowMultipleSelect === true) {
                            result.push(item);
                            this.selectedItems.push(item);
                            if (item._states_ !== undefined)
                                item._states_.selected(true);
                        } else {
                            result.splice(0, result.length);
                            this.selectedItems.splice(0, this.selectedItems.length);
                            result.push(this.items[i]);
                            this.selectedItems.push(this.items[i]);
                            if (item._states_ !== undefined)
                                item._states_.selected(true);
                            for (var x = 0; x < length; x++) {
                                if (this.items[x] !== item) {
                                    if (this.items[x]._states_ !== undefined)
                                        this.items[x]._states_.selected(false);
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log("selectedItems = ", this.selectedItems);

        if (result.length === 0)
            return false;
        if (result.length === 1)
            return result[0];
        if (result.length > 1)
            return result;

    },

    deselect: function (item) {
        if (item !== undefined) {
            var length = this.items.length;
            for (var i = 0; i < length; i++) {
                if (this.items[i] === item) {
                    var selectedLength = this.selectedItems.length;
                    if (item._states_ !== undefined)
                        item._states_.selected(false);
                    for (var x = 0; x < selectedLength; x++) {
                        if (this.selectedItems[x] === item) {
                            this.selectedItems.splice(x, 1);
                        }
                    }
                }
            }
        }
        console.log(this.selectedItems);
        return this.selectedItems;
    }
});


/**
 * Error
 * Набор свойств и методов, описывающий ошибку
 */

$classesInjector.add("Error", {
 __dependencies__: [],
 type: new Field({ source: "typeId", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
 message: new Field({ source: "message", type: DATA_TYPE_STRING, value: "", default_value: "" }),
 timestamp: new Field({ source: "timestamp", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 })
 });


/**
 * File
 * Набор свойств и методов, описывающих файл
 */
$classesInjector.add("File", {
    _dependencies__: [],
    title: new Field({ source: "title", type: DATA_TYPE_STRING, default_value: "", value: "", backupable: true, displayable: true }),
    type: new Field({ source: "type", type: DATA_TYPE_STRING, default_value: "", value: "", backupable: true, displayable: true }),
    size: new Field({ source: "size", type: DATA_TYPE_INTEGER, default_value: 0, value: 0, backupable: true, displayable: true }),
    url: new Field({ source: "url", type: DATA_TYPE_STRING, default_value: "", value: "", backupable: true, displayable: true })
});
$classesInjector
    .add("Route", {
        id: undefined,
        parentId: undefined,
        order: 0,
        url: undefined,
        icon: undefined,
        title: undefined,
        description: undefined,
        isActive: false,
        isVisible: true,
        onSelect: undefined
    });

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
/**
 * Setting
 * Класс, описывающий настройку приложения
 */
$classesInjector.add("Setting", {
    code: new Field({ source: "CODE", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
    type: new Field({ source: "DATA_TYPE", type: DATA_TYPE_INTEGER, value: 0, default_value: 0, backupable: true }),
    title: new Field({ source: "TITLE", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
    description: new Field({ source: "DESCRIPTION", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
    value: new Field({ source: "VALUE", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),

    _onConstruct: function () {
        if (this.value.value !== undefined && this.value.value !== null && this.value.value !== "") {
            switch (this.type.value) {
                case DATA_TYPE_INTEGER:
                    if (isNaN(this.value.value)) {
                        console.info("$settings -> " + this.title.value + " - значание настройки не соответствует типу данных, присвоен 0");
                        this.value.value = 0;
                    } else {
                        this.value.value = parseInt(this.value.value);
                        this.value.type = DATA_TYPE_INTEGER;
                    }
                    break;
                case DATA_TYPE_FLOAT:
                    if (isNaN(this.value.value)) {
                        console.info("$settings -> " + this.title.value + " - значание настройки не соответствует типу данных, присвоен 0");
                        this.value.value = 0;
                    } else {
                        this.value.value = parseFloat(this.value.value);
                        this.value.type = DATA_TYPE_FLOAT;
                    }
                    break;
                case DATA_TYPE_STRING:
                    this.value.value = this.value.value.toString();
                    break;
                case DATA_TYPE_BOOLEAN:
                    if (isNaN(this.value.value) && parseInt(this.value.value) !== 0 && parseInt(this.value.value) !== 1) {
                        console.info("$settings -> " + this.title.value + " - значение настройки не соответствует типу данных, присвоен false");
                        this.value.value = false;
                    } else {
                        this.value.value = new Boolean(parseInt(this.value.value));
                        this.value.type = DATA_TYPE_BOOLEAN;
                    }
                    break;
                default:
                    console.info("$settings -> " + this.title.value + " - тип данных настройки задан некорректно");
                    break;
            }
        }
    }
});
/******************************
 * States
 * Набор свойст и методов, описывающих состояние объекта
 ******************************/

$classesInjector.add("States", {
    __dependencies__: [],
    _states_: {
        isActive: false,        // Флаг, сигнализирующий, активен ли объект
        isSelected: false,      // Флаг, сигнализирующий, выбран ли объект
        isChanged: false,       // Флаг, сигнализирующий, был ли изменен объект
        isLoaded: true,         // Флаг, сигнализирующий был ли объект загружен
        isLoading: false,       // Флаг, сигнализирующий, находится ли объект в режиме загрузки
        isInEditMode: false,    // Флаг, сигнализирующий, находится ли объект в режиме редактирования
        isInDeleteMode: false,  // Флаг, сигнализирующий, находится ли объект в режиме удаления

        /**
         * Устанавливает / отменяет режим активного объекта
         * @param flag {Boolean} - Флаг активности / неактивности объекта
         * @returns {boolean} - Возвращает флаг активности / неактивности объекта
         */
        active: function (flag) {
            if (flag !== undefined && flag.constructor === Boolean)
                this.isActive = flag;
            return this.isActive;
        },

        /**
         * Устанавливает / отменяет режим редактирования объекта
         * @param flag {Boolean} - Флаг нахождения объекта в режиме редактирования
         * @returns {boolean} - Возвращает флаг нахождения объекта в режиме редактирования
         */
        editing: function (flag) {
            if (flag !== undefined && flag.constructor === Boolean)
                this.isInEditMode = flag;
            return this.isInEditMode;
        },

        /**
         * Устанавливает / отменяет режим удаления объекта
         * @param flag {boolean} - Флаг нахождения объекта в режиме удаления
         * @returns {boolean} - Возвращает флаг нахождения объекта в режиме удаления
         */
        deleting: function (flag) {
            if (flag !== undefined && flag.constructor === Boolean)
                this.isInDeleteMode = flag;
            return this.isInDeleteMode;
        },

        /**
         * Устанавливает / отменяет режим измененного объекта
         * @param flag {boolean} - Флаг, был ли объект изменен
         * @returns {boolean} - Возвращает флаг, был ли объект изменен
         */
        changed: function (flag) {
            if (flag !== undefined && flag.constructor === Boolean)
                this.isChanged = flag;
            return this.isChanged;
        },

        /**
         * Устанавливает / отменяет режим выбранного объекта
         * @param flag {boolean} - Флаг, был ли выбран объект
         * @returns {boolean} - Возвращает флаг, был ли выбран объект
         */
        selected: function (flag) {
            if (flag !== undefined && flag.constructor === Boolean) {
                this.isSelected = flag;
                //console.log("selected = ", this.isSelected);
            }
            return this.isSelected;
        },

        /**
         * Устанавливает / отменяет режим загруженного объекта
         * @param flag {boolean} - Флаг, был ли объект загружен
         * @returns {boolean} - Возвращает флаг, был ли объект загружен
         */
        loaded: function (flag) {
            if (flag !== undefined && flag.constructor === Boolean)
                this.isLoaded = flag;
            return this.isLoaded;
        },

        /**
         * Устанавливает / отменяет режим загруженного объекта
         * @param flag {boolean} - Флаг, был ли объект загружен
         * @returns {boolean} - Возвращает флаг, был ли объект загружен
         */
        loading: function (flag) {
            if (flag !== undefined && flag.constructor === Boolean)
                this.isLoading = flag;
            return this.isLoading;
        }
    }
});
$classesInjector.add("TreeItem", {
        key: 0,
        parentKey: 0,
        display: "",
        children: {},
        childrenCount: 0,
        order: 0,
        data: {},
        isExpanded: false,
        isSelected: false,
        isChecked: false,
        isVisible: true,
        notifications: {
            items: [],

            add: function (parameters) {
                if (parameters === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "TreeItem -> notifications -> add: Не задан параметр - объект с настройками уведомления уведомления");
                    return false;
                }

                if (parameters.id === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "TreeItem -> notifications -> add: Не задана настройка - идентификатор уведомления");
                    return false;
                }

                if (parameters.value === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "TreeItem -> notifications -> add: Не задана настройка - значение уведомления");
                    return false;
                }

                var notification = factory({ classes: ["TreeItemNotification"], base_class: "TreeItemNotification" });
                notification.id = parameters.id;
                notification.value = parameters.value;
                notification.icon = parameters.icon !== undefined ? parameters.icon : "";
                notification.class = parameters.class !== undefined ? parameters.class : "";
                notification.isVisible = parameters.isVisible;
                this.items.push(notification);

                return true;
            },

            getById: function (id) {
                if (id === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "TreeItem -> notifications -> getById: Не задан параметр - идентификатор уведомления");
                    return false;
                }

                var length = this.items.length;
                for (var i = 0; i < length; i++) {
                    if (this.items[i].id === id)
                        return this.items[i];
                }

                return false;
            }
        },
        onAddChildren: function (children, data) {},
        onDeleteChildren: function (children) {},
        onSelect: function (item) {}
    });
$classesInjector.add("TreeItemNotification", {
        id: "",
        value: 0,
        icon: "",
        class: "",
        isVisible: true
    });
$classesInjector
    .add("TreeStructure", {
        id: "",
        rootKey: 0,
        expandOnSelect: false,
        collapseOnDeselect: false,
        showNotifications: true,
        class: "",
        stack: {},
        initial: {},
        selectedItem: false,
        onAddItem: function (item) {}
    });

$classesInjector
    .add("Attachment", {
        _dependencies__: [],
        id: new Field({ source: "ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        violationId: new Field({ source: "VIOLATION_ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        title: new Field({ source: "TITLE", type: DATA_TYPE_STRING, default_value: "", value: "", backupable: true, displayable: true }),
        type: new Field({ source: "MIME_TYPE", type: DATA_TYPE_STRING, default_value: "", value: "", backupable: true, displayable: true }),
        size: new Field({ source: "SIZE", type: DATA_TYPE_INTEGER, default_value: 0, value: 0, backupable: true, displayable: true }),
        url: new Field({ source: "URL", type: DATA_TYPE_STRING, default_value: "", value: "", backupable: true, displayable: true }),
        added: new Field({ source: "DATE_ADDED", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        isInAddMode: false
    });

$classesInjector
    .add("Division", {
        id: new Field({ source: "ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        parentId: new Field({ source: "PARENT_ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0, bacupable: true }),
        sortId: new Field({ source: "SORT_ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        shortTitle: new Field({ source: "TITLE_SHORT", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        fullTitle: new Field({ source: "TITLE_FULL", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        violationsAdded: new Field({ source: "VIOLATIONS_ADDED", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        attachmentsAdded: new Field({ source: "ATTACHMENTS_ADDED", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        storage: new Field({ source: "FILE_STORAGE_HOST", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        isDepartment: new Field({ source: "IS_DEPARTMENT", type: DATA_TYPE_BOOLEAN, value: false, default_value: false, backupable: true }),
        path: new Field({ source: "PATH", type: DATA_TYPE_STRING, value: "", default_value: "" })
    });

$classesInjector
    .add("ESKGroup", {
        id: new Field({ source: "ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        title: new Field({ source: "TITLE", type: DATA_TYPE_STRING, value: "", default_value: "" }),
        description: new Field({ source: "DESCRIPTION", type: DATA_TYPE_STRING, value: "", default_value: "" })
    });
$classesInjector
    .add("Violation", {
        id: new Field({ source: "ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        userId: new Field({ source: "USER_ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        divisionId: new Field({ source: "DIVISION_ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0, backupable: true }),
        eskGroupId: new Field({ source: "ESK_GROUP_ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0, backupable: true }),
        eskObject: new Field({ source: "ESK_OBJECT", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        happened: new Field({ source: "DATE_HAPPENED", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        ended: new Field({ source: "DATE_ENDED", type: DATA_TYPE_INTEGER, value: 0, default_value: 0, backupable: true }),
        added: new Field({ source: "DATE_ADDED", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        description: new Field({ source: "DESCRIPTION", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        isConfirmed: new Field({ source: "IS_CONFIRMED", type: DATA_TYPE_BOOLEAN, value: false, default_value: false, backupable: true }),
        user: 0,
        attachments: [],
        isNew: false,
        newAttachments: 0
    });
$classesInjector
    .add("ViolationFilter", {
        code: new Field({ source: "", type: DATA_TYPE_STRING, value: "", default_value: "" }),
        title: new Field({ source: "", type: DATA_TYPE_STRING, value: "", default_value: "" }),
        startValue: new Field({ source: "", type: DATA_TYPE_INTEGER, value: 0, default_value: 0, backupable: true }),
        endValue: new Field({ source: "", type: DATA_TYPE_INTEGER, value: 0, default_value: 0, backupable: true }),
        isEnabled: false,
        isActive: false,

        resetStartValue: function () {
            this.startValue.value = this.startValue.default_value;
        },

        resetEndValue: function () {
            this.endValue.value = this.endValue.default_value;
        }
    });

$classesInjector
    .add("Weekday", {
        id: 0,
        title: "",
        code: ""
    });
