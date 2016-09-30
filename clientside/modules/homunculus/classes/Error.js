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

