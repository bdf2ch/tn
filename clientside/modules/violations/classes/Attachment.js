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
