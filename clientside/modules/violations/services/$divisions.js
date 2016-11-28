angular
    .module("violations")
    .factory("$divisions", ["$log", "$http", "$factory", "$errors", "$session", "$violations", "$tree", function ($log, $http, $factory, $errors, $session, $violations, $tree) {
        var divisions = [];
        var currentDivision = undefined;
        var newDivision = $factory({ classes: ["Division",  "Model", "Backup", "States"], base_class: "Division" });
        newDivision._backup_.setup();

        return {


            /**
             * Выполняет инициализацию сервиса
             * @param source {object} - источник данных
             * @returns {boolean}
             */
            init: function (source) {
                if (source === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$divisions -> init: Не задан параметр - источник данных");
                    return false;
                }

                var tree = $tree.register({
                    id: "global-divisions-tree",
                    rootKey: 0,
                    expandOnSelect: true,
                    collapseOnDeselect: true
                });


                tree.calcRoot = function () {
                    var root = $tree.getItemByKey(tree.id, 1);
                    root.data.violationsTotal = root.data.violationsAdded;
                    root.notifications.getById("violations").value = root.data.violationsAdded;
                    root.data.attachmentsTotal = root.data.attachmentsAdded;
                    root.notifications.getById("attachments").value = root.data.attachmentsAdded;
                    for (var index in root.children) {
                        var child = root.children[index];
                        root.data.violationsTotal += child.data.violationsTotal;
                        root.notifications.getById("violations").value += child.data.violationsTotal;
                        root.data.attachmentsTotal += child.data.attachmentsTotal;
                        root.notifications.getById("attachments").value += child.data.attachmentsTotal;
                    }
                    root.notifications.getById("violations").isVisible = root.notifications.getById("violations").value > 0 ? true : false;
                    root.notifications.getById("attachments").isVisible = root.notifications.getById("attachments").value > 0 ? true : false;
                };


                tree.onAddItem = function (itm) {
                    itm.data.violationsTotal = itm.data.violationsAdded;
                    itm.data.attachmentsTotal = itm.data.attachmentsAdded;

                    itm.notifications.add({
                        id: "violations",
                        icon: "fa-bolt",
                        class: "violation-notification",
                        value: 0,
                        isVisible: true
                    });
                    itm.notifications.getById("violations").value = itm.data.violationsAdded;

                    itm.notifications.add({
                        id: "attachments",
                        icon: "fa-file",
                        class: "attachment-notification",
                        value: 0,
                        isVisible: true
                    });
                    itm.notifications.getById("attachments").value = itm.data.attachmentsAdded;

                    var prev = itm;
                    var parent = $tree.getItemByKey("global-divisions-tree", itm.parentKey);
                    while (parent) {
                        if (itm.data.violationsAdded > 0) {
                            parent.data.violationsTotal += itm.data.violationsAdded;
                            parent.notifications.getById("violations").value += itm.data.violationsAdded;
                            parent.notifications.getById("violations").isVisible = parent.notifications.getById("violations").value > 0 ? true : false;
                        }
                        if (itm.data.attachmentsAdded > 0) {
                            parent.data.attachmentsTotal += itm.data.attachmentsAdded;
                            parent.notifications.getById("attachments").value += itm.data.attachmentsAdded;
                            parent.notifications.getById("attachments").isVisible = parent.notifications.getById("attachments").value > 0 ? true : false;
                        }
                        prev = parent;
                        parent = $tree.getItemByKey("global-divisions-tree", parent.parentKey);
                    }
                };

                var length = source.length;
                for (var i = 0; i < length; i++) {
                    var division = $factory({ classes: ["Division", "Model", "Backup", "States"], base_class: "Division" });
                    division._model_.fromJSON(source[i]);
                    division._backup_.setup();
                    if (division.id.value === $session.getCurrentUser().divisionId.value) {
                        division._states_.selected(true);
                        currentDivision = division;
                    }
                    divisions.push(division);

                    var item = $tree.addItem({
                        treeId: "global-divisions-tree",
                        key: division.id.value,
                        parentKey: division.parentId.value,
                        display: division.shortTitle.value,
                        order: division.sortId.value,
                        data: {
                            violationsAdded: division.violationsAdded.value,
                            violationsTotal: 0,
                            attachmentsAdded: division.attachmentsAdded.value,
                            attachmentsTotal: 0
                        }
                    });

                    item.notifications.getById("violations").value = item.data.violationsTotal;
                    item.notifications.getById("violations").isVisible = item.notifications.getById("violations").value > 0 ? true : false;
                    item.notifications.getById("attachments").value = item.data.attachmentsTotal;
                    item.notifications.getById("attachments").isVisible = item.notifications.getById("attachments").value > 0 ? true : false;
                }
                tree.calcRoot();

                var sessionDivisionsTree = $tree.register({
                    id: "session-divisions-tree",
                    rootKey: 0,
                    class: "stacked",
                    expandOnSelect: true,
                    collapseOnDeselect: true,
                    onSelect: function (item) {}
                });
                sessionDivisionsTree.calcRoot = tree.calcRoot();

                var sessionDivisionRoot = $tree.getItemByKey("global-divisions-tree", $session.getCurrentUser().divisionId.value);
                if (sessionDivisionRoot) {
                    sessionDivisionsTree.initial[sessionDivisionRoot.key] = sessionDivisionRoot;
                    sessionDivisionsTree.stack = tree.stack;
                    $tree.selectItem("session-divisions-tree", sessionDivisionRoot.key);
                    //$tree.expandItem("session-divisions-tree", sessionDivisionRoot.key);
                }

                sessionDivisionsTree.onSelect = function (item) {
                    //$log.log("selected item = ", item);
                    //$violations.violations.setStart(0);
                    if (item.isSelected === true) {
                        $violations.violations.getNew().divisionId.value = item.key;
                        if (currentDivision.id.value !== item.key)
                            $violations.violations.clear();

                        //$log.log("new = ", $violations.violations.getNew());

                        var length = divisions.length;
                        var found = false;
                        for (var i = 0; i < length; i++) {
                            if (divisions[i].id.value === item.key) {
                                found = true;
                                if (divisions[i]._states_.selected() === false) {
                                    divisions[i]._states_.selected(true);
                                    currentDivision = divisions[i];
                                } else {
                                    divisions[i]._states_.selected(false);
                                    currentDivision = undefined;
                                }
                            }
                        }
                        $violations.violations.getByDivisionId(item.key);

                    }
                };



                var newViolationTree = $tree.register({
                    id: "new-violation-tree",
                    rootKey: 0,
                    class: "stacked",
                    expandOnSelect: true,
                    collapseOnDeselect: true,
                    showNotifications: false,
                    onSelect: function (item) {
                        //var division = this.getById(item.key);
                        //$log.log("div = ", division);
                        $violations.violations.getNew().divisionId.value = item.key;
                        //$log.log("div id = ", item.key);
                    }

                });
                var newViolationRoot = $tree.getItemByKey("global-divisions-tree", $session.getCurrentUser().divisionId.value);
                if (newViolationRoot) {
                    newViolationTree.initial[newViolationRoot.key] = newViolationRoot;
                    newViolationTree.stack = tree.stack;
                }
                $tree.expandItem("new-violation-tree", newViolationRoot.key);

                return true;
            },



            /**
             * Возвращает массив со свеми структурными подразделениями
             * @returns {Array}
             */
            getAll: function () {
                return divisions;
            },



            /**
             * Возвращает текущее структурное подразделение
             * @returns {undefined}
             */
            getCurrent: function () {
                return currentDivision;
            },



            /**
             * Возвращает новое структурное подразделение
             * @returns {*}
             */
            getNew: function () {
                return newDivision;
            },



            /**
             * Возвращает структурное подразделение по идентификатору
             * @param divisionId {integer} - идентификатор структурного подразделения
             * @returns {*}
             */
            getById: function (divisionId) {
                if (divisionId === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$divisions -> getById: Не задан параметр - идентификатор структурного подразделения");
                    return false;
                }

                var length = divisions.length;
                for (var i = 0; i < length; i++) {
                    if (divisions[i].id.value === divisionId) {
                        return divisions[i];
                    }
                }
                return false;
            },



            /**
             * Выбирает структурное подразделение
             * @param divisionId {integer} - Идентификатор структурного подразделения
             * @param callback {function} - callback-функция
             * @returns {boolean}
             */
            select: function (divisionId, callback) {
                if (divisionId === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$divisions -> select: Не задан параметр - идентификатор структурного подразделения");
                    return false;
                }

                var length = divisions.length;
                var found = false;
                for (var i = 0; i < length; i++) {
                    if (divisions[i].id.value === divisionId) {
                        found = true;
                        if (divisions[i]._states_.selected() === false) {
                            divisions[i]._states_.selected(true);
                            currentDivision = divisions[i];
                            if (callback !== undefined && typeof callback === "function")
                                callback(currentDivision);
                        } else {
                            divisions[i]._states_.selected(false);
                            currentDivision = undefined;
                        }
                    }
                }
                return found;
            },



            /**
             * Добавляет структурное подразделение
             * @param success {function} - callback-функция в случае успешного завершения
             * @param error {function} - callback-функция в случае ошибки
             */
            add: function (success, error) {
                var params = {
                    action: "addDivision",
                    data: {
                        parentId: newDivision.parentId.value,
                        shortTitle: newDivision.shortTitle.value,
                        fullTitle: newDivision.fullTitle.value,
                        storage: newDivision.storage.value,
                        isDepartment: newDivision.isDepartment.value === true ? 1 : 0
                    }
                };

                newDivision._states_.loading(true);
                $http.post("/serverside/api.php", params)
                    .success(function (data) {
                        newDivision._states_.loading(false);
                        if (data !== undefined) {
                            var division = $factory({ classes: ["Division", "Model", "Backup", "States"], base_class: "Division" });
                            division._model_.fromJSON(data);
                            division._backup_.setup();
                            divisions.push(division);
                            if (success !== undefined && typeof success === "function")
                                success(division);
                            return true;
                        }
                    })
                    .error(function () {
                        $errors.add(ERROR_TYPE_ENGINE, "$divisions -> add: Не удалось добавить структурное подразделение");
                        newDivision._states_.loading(false);
                        if (error !== undefined && typeof error === "function")
                            error();
                        return false;
                    });
            },



            /**
             * Сохраняет изменения в текущем структурном подразделении
             * @param success {function} - callback-функция в случае успешного завершения
             * @param error {function} - callback-функция в случае ошибки
             */
            edit: function (success, error) {
                if (currentDivision === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$divisions -> edit: Не выбрано текущее структурное подразделение");
                    return false;
                }

                var params = {
                    action: "editDivision",
                    data: {
                        id: currentDivision.id.value,
                        parentId: currentDivision.parentId.value,
                        shortTitle: currentDivision.shortTitle.value,
                        fullTitle: currentDivision.fullTitle.value,
                        storage: currentDivision.storage.value,
                        departmentId: this.getDepartmentByDivisionId(currentDivision.id.value).id.value,
                        isDepartment: currentDivision.isDepartment.value === true ? 1 : 0
                    }
                };

                currentDivision._states_.loading(true);
                $http.post("/serverside/api.php", params)
                    .success(function (data) {
                        currentDivision._states_.loading(false);
                        if (data !== undefined) {
                            currentDivision._backup_.setup();
                            if (success !== undefined && typeof success === "function")
                                success(currentDivision);
                            return true;
                        }
                    })
                    .error(function () {
                        $errors.add(ERROR_TYPE_ENGINE, "$divisions -> edit: Не удалось сохранить изменения в структурном подразделнии");
                        currentDivision._states_.loading(false);
                        if (error !== undefined && typeof error === "function")
                            error();
                        return false;
                    });
            },


            getDepartmentByDivisionId: function (divisionId) {
                if (divisionId === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$divisions -> getDepartmentByDivisionId: Не задан параметр - идентификатор структурного подразделения");
                    return false;
                }

                var length = divisions.length;
                for (var i = 0; i < length; i++) {
                    if (divisions[i].id.value === divisionId) {
                        var division = divisions[i];
                        while (division.isDepartment.value === false) {
                            var length2 = divisions.length;
                            for (var x = 0; x < length2; x++) {
                                if (divisions[x].id.value === division.parentId.value)
                                    division = divisions[x];
                            }
                        }
                        return division;
                    }
                }
            }
        }
    }]);