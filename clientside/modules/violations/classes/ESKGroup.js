$classesInjector
    .add("ESKGroup", {
        id: new Field({ source: "ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        title: new Field({ source: "TITLE", type: DATA_TYPE_STRING, value: "", default_value: "" }),
        description: new Field({ source: "DESCRIPTION", type: DATA_TYPE_STRING, value: "", default_value: "" })
    });