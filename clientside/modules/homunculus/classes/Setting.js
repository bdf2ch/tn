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