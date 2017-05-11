$classesInjector
    .add("FeedbackMessage", {
        _dependencies__: [],
        id: new Field({ source: "ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        userId: new Field({ source: "USER_ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        message: new Field({ source: "MESSAGE", type: DATA_TYPE_STRING, default_value: "", value: "" }),
        timestamp: new Field({ source: "TIMESTAMP", type: DATA_TYPE_INTEGER, default_value: 0, value: 0 }),
        attachments: []
    });
