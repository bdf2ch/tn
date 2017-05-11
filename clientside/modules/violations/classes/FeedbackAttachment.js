$classesInjector
    .add("FeedbackAttachment", {
        _dependencies__: [],
        id: new Field({ source: "id", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        messageId: new Field({ source: "message_id", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        title: new Field({ source: "title", type: DATA_TYPE_STRING, default_value: "", value: "", backupable: true, displayable: true }),
        type: new Field({ source: "mime_type", type: DATA_TYPE_STRING, default_value: "", value: "", backupable: true, displayable: true }),
        size: new Field({ source: "size", type: DATA_TYPE_INTEGER, default_value: 0, value: 0, backupable: true, displayable: true }),
        url: new Field({ source: "url", type: DATA_TYPE_STRING, default_value: "", value: "", backupable: true, displayable: true })
    });
