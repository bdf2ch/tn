angular
    .module("homunculus.ui")
    .factory("$tabs", ["$log", "$errors", function ($log, $errors) {
        var tabs = [];

        return {

            register: function (tab) {
                if (tab === undefined) {
                    $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "$tabs -> register: Не задан параметр - параметры регистрируемого компонента");
                    return false;
                }

                tabs.push(tab);
                $log.log("tabs", tabs);
                return true;
            },

            getById: function (id) {
                if (id === undefined) {
                    $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "$tabs -> getById: Не задан параметр - идентификатор компонента");
                    return false;
                }

                var length = tabs.length;
                for (var i = 0; i < length; i++) {
                    if (tabs[i].id === id)
                        return tabs[i];
                }
                return false;
            },

            select: function (tabsId, tabId) {
                if (tabsId === undefined) {
                    $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "$tabs -> select: Не задан параметр - идентификатор компонента");
                    return false;
                }

                if (tabId === undefined) {
                    $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "$tabs -> select: Не задан параметр - идентификатор вкладки");
                    return false;
                }
            }

        }
    }]);