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

