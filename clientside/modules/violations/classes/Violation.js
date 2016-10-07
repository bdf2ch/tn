$classesInjector
    .add("Violation", {
        id: new Field({ source: "ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        userId: new Field({ source: "USER_ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        divisionId: new Field({ source: "DIVISION_ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0, backupable: true }),
        eskGroupId: new Field({ source: "ESK_GROUP_ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0, backupable: true }),
        eskObject: new Field({ source: "ESK_OBJECT", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        happened: new Field({ source: "DATE_HAPPENED", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        added: new Field({ source: "DATE_ADDED", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        description: new Field({ source: "DESCRIPTION", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        isConfirmed: new Field({ source: "IS_CONFIRMED", type: DATA_TYPE_BOOLEAN, value: false, default_value: false, backupable: true }),
        user: 0,
        attachments: [],
        isNew: false,
        newAttachments: 0
    });