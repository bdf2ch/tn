
    $classesInjector.add("AppUser", {
        id: new Field({ source: "ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        divisionId: new Field({ source: "DIVISION_ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0, backupable: true }),
        surname: new Field({ source: "SURNAME", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        name: new Field({ source: "NAME", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        fname: new Field({ source: "FNAME", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        email: new Field({ source: "EMAIL", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        login: new Field({ source: "LOGIN", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        password: new Field({ source: "PASSWORD", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        isAdministrator: new Field({ source: "IS_ADMINISTRATOR", type: DATA_TYPE_BOOLEAN, value: false, default_value: false, backupable: true }),
        allowEdit: new Field({ source: "ALLOW_EDIT", type: DATA_TYPE_BOOLEAN, value: false, default_value: false, backupable: true }),
        allowConfirm: new Field({ source: "ALLOW_CONFIRM", type: DATA_TYPE_BOOLEAN, value: false, default_value: false, backupable: true }),
        isLDAPEnabled: new Field({ source: "IS_LDAP_ENABLED", type: DATA_TYPE_BOOLEAN, value: false, default_value: false, backupable: true })
    });