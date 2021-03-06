$classesInjector
    .add("ViolationFilter", {
        code: new Field({ source: "", type: DATA_TYPE_STRING, value: "", default_value: "" }),
        title: new Field({ source: "", type: DATA_TYPE_STRING, value: "", default_value: "" }),
        startValue: new Field({ source: "", type: DATA_TYPE_INTEGER, value: 0, default_value: 0, backupable: true }),
        endValue: new Field({ source: "", type: DATA_TYPE_INTEGER, value: 0, default_value: 0, backupable: true }),
        isEnabled: false,
        isActive: false,

        resetStartValue: function () {
            this.startValue.value = this.startValue.default_value;
        },

        resetEndValue: function () {
            this.endValue.value = this.endValue.default_value;
        }
    });
