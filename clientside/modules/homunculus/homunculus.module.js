/* Константы кодов ошибок */
const ERROR_TYPE_DEFAULT = 1;
const ERROR_TYPE_ENGINE = 2;
const ERROR_TYPE_DATABASE = 3;
const ERROR_TYPE_LDAP = 4;

/* Константы типов данных */
const DATA_TYPE_INTEGER = 1;
const DATA_TYPE_STRING = 2;
const DATA_TYPE_FLOAT = 3;
const DATA_TYPE_BOOLEAN = 4;



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

