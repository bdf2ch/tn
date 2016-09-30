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
