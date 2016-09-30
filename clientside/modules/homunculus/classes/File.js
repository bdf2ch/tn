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