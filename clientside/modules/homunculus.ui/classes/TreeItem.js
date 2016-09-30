$classesInjector.add("TreeItem", {
        key: 0,
        parentKey: 0,
        display: "",
        children: {},
        childrenCount: 0,
        order: 0,
        data: {},
        isExpanded: false,
        isSelected: false,
        isChecked: false,
        isVisible: true,
        notifications: {
            items: [],

            add: function (parameters) {
                if (parameters === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "TreeItem -> notifications -> add: Не задан параметр - объект с настройками уведомления уведомления");
                    return false;
                }

                if (parameters.id === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "TreeItem -> notifications -> add: Не задана настройка - идентификатор уведомления");
                    return false;
                }

                if (parameters.value === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "TreeItem -> notifications -> add: Не задана настройка - значение уведомления");
                    return false;
                }

                var notification = factory({ classes: ["TreeItemNotification"], base_class: "TreeItemNotification" });
                notification.id = parameters.id;
                notification.value = parameters.value;
                notification.icon = parameters.icon !== undefined ? parameters.icon : "";
                notification.class = parameters.class !== undefined ? parameters.class : "";
                notification.isVisible = parameters.isVisible;
                this.items.push(notification);

                return true;
            },

            getById: function (id) {
                if (id === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "TreeItem -> notifications -> getById: Не задан параметр - идентификатор уведомления");
                    return false;
                }

                var length = this.items.length;
                for (var i = 0; i < length; i++) {
                    if (this.items[i].id === id)
                        return this.items[i];
                }

                return false;
            }
        },
        onAddChildren: function (children, data) {},
        onDeleteChildren: function (children) {},
        onSelect: function (item) {}
    });