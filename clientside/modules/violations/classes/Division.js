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
