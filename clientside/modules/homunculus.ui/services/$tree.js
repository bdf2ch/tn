angular
    .module("homunculus.ui")
    .factory("$tree", ["$log", "$classes", "$factory", "$errors", function ($log, $classes, $factory, $errors) {
        var trees = [];
        
        return {



            register: function (parameters) {
                //$log.log("parameters = ", parameters);
                if (parameters === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> register: Не задан параметр - объект с настройками дерева");
                    return false;
                }

                if (parameters.id === undefined || parameters.id === "") {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> register: Не задан параметр дерева - идентификатор дерева");
                    return false;
                }

                if (parameters.rootKey === undefined || parameters.rootKey === "") {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> register: Не задан параметр дерева - значение ключа корневого элемента дерева");
                    return false;
                }

                var tree = $factory({ classes: ["TreeStructure"], base_class: "TreeStructure" });
                tree.id = parameters.id;
                tree.rootKey = parameters.rootKey;
                tree.expandOnSelect = parameters.expandOnSelect !== undefined ? true : false;
                tree.collapseOnDeselect = parameters.collapseOnDeselect !== undefined ? true: false;
                tree.onSelect = parameters.onSelect !== undefined && typeof parameters.onSelect === "function" ? parameters.onSelect : undefined;
                tree.showNotifications = parameters.showNotifications !== undefined ? parameters.showNotifications : true;
                trees.push(tree);

                //$log.log("structures = ", trees);

                return tree;
            },



            /**
             * Осуществляет поиск дерева по идентификатору
             * @param treeId {string} - идентификатор дерева
             * @returns {TreeStructure / boolean}
             */
            getById: function (treeId) {
                if (treeId === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> getById: Не задан параметр - идентификатор дерева");
                    return false;
                }

                var length = trees.length;
                for (var i = 0; i < length; i++) {
                    if (trees[i].id === treeId)
                        return trees[i];
                }

                return false;
            },



            /**
             * Осуществляет поиск элемента дерева по значению ключа
             * @param treeId {string} идентификатор дерева
             * @param key {*} - значение ключа элемента
             * @returns {TreeItem / boolean}
             */
            getItemByKey: function (treeId, key) {
                if (treeId === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> getItemByKey: Не задан параметр - идентификатор дерева");
                    return false;
                }

                if (key === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> getItemByKey: Не задан параметр - значение ключа элемента");
                    return false;
                }

                var tree = this.getById(treeId);
                if (!tree) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> getItemByKey: Дерево с идентификатором '" + treeId + "' не найдено");
                    return false;
                }

                var item = tree.stack[key];
                return item !== undefined ? item : false;
            },



            /**
             *
             * @param treeId
             * @param key
             * @param parentKey
             * @param display
             * @param order
             * @param data
             * @returns {*}
             */
            addItem: function (parameters) {
                if (parameters === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$tree -> addItem: Не задан объект с параметрами");
                    return false;
                }

                if (parameters.treeId === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> addItem: Не задан параметр - идентификатор дерева");
                    return false;
                }

                if (parameters.key === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> addItem: Не задан параметр - значение ключа элемента");
                    return false;
                }

                if (parameters.parentKey === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> addItem: Не задан параметр - значение родительского ключа элемента");
                    return false;
                }

                if (parameters.display === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> addItem: Не задан параметр - отображаемое значение элемента");
                    return false;
                }

                if (parameters.order !== undefined && parameters.order === "") {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> addItem: Не задан параметр - порядковый номер отображения элемента");
                    return false;
                }

                var tree = this.getById(parameters.treeId);
                if (!tree) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> addItem: Дерево с идентификатором '" + parameters.treeId + "' не найдено");
                    return false;
                }

                var item = $factory({ classes: ["TreeItem"], base_class: "TreeItem" });
                item.key = parameters.key;
                item.parentKey = parameters.parentKey;
                item.display = parameters.display;
                item.order = parameters.order;
                item.data = parameters.data !== undefined ? parameters.data : {};

                if (item.parentKey === tree.rootKey) {
                    tree.initial[item.key] = item;
                    tree.onAddItem(item);
                    tree.stack[item.key] = item;
                } else {
                    var parent = tree.stack[item.parentKey];
                    if (parent === undefined) {
                        $errors.add(ERROR_TYPE_DEFAULT, "$structure -> addItem: родительский элемент с ключом '" + parameters.parentKey + "' не найден");
                        return false;
                    }
                    tree.stack[item.key] = item;
                    parent.children[item.key] = item;
                    parent.childrenCount++;
                    tree.onAddItem(item);
                    parent.onAddChildren(item);
                }


                return item;
            },



            expandItem: function (treeId, key) {
                //$log.log("expand item called");

                if (treeId === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> expandItem: Не задан параметр - идентификатор дерева");
                    return false;
                }

                if (key === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> expandItem: Не задан параметр - значение ключа элемента");
                    return false;
                }

                var tree = this.getById(treeId);
                if (!tree) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> expandItem: Дерево с идентификатором '" + treeId + "' не найдено");
                    return false;
                }

                var item = tree.stack[key];
                if (item === undefined) {
                    $errors.add(ERROR_TYPE_ENGINE, "$structure -> expandItem: Элемент с ключом " + key + " не найден");
                    return false;
                }

                if (item.childrenCount > 0)
                    item.isExpanded = true;
                //$log.log(item);
                return true;
            },



            expandToRoot: function (treeId, key) {
                if (treeId === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> expandToRoot: Не задан параметр - идентификатор дерева");
                    return false;
                }

                if (key === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> expandToRoot: Не задан параметр - значение ключа элемента");
                    return false;
                }

                var tree = this.getById(treeId);
                if (!tree) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> expandToRoot: Дерево с идентификатором '" + treeId + "' не найдено");
                    return false;
                }

                var item = tree.stack[key];
                if (item === undefined) {
                    $errors.add(ERROR_TYPE_ENGINE, "$structure -> expandToRoot: Элемент с ключом " + key + " не найден");
                    return false;
                }

                var parent = tree.stack[item.parentKey];
                while (parent) {
                    parent.isExpanded = true;
                    parent = tree.stack[parent.parentKey];
                }
            },



            collapseItem: function (treeId, key) {
                if (treeId === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> collapseItem: Не задан параметр - идентификатор дерева");
                    return false;
                }

                if (key === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> collapseItem: Не задан параметр - значение ключа элемента");
                    return false;
                }

                var tree = this.getById(treeId);
                if (!tree) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> collapseItem: Дерево с идентификатором '" + treeId + "' не найдено");
                    return false;
                }

                var item = tree.stack[key];
                if (item === undefined) {
                    $errors.add(ERROR_TYPE_ENGINE, "$structure -> collapseItem: Элемент с ключом " + key + " не найден");
                    return false;
                }

                item.isExpanded = false;
                return true;
            },



            selectItem: function (treeId, key) {
                if (treeId === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> selectItem: Не задан параметр - идентификатор дерева");
                    return false;
                }

                if (key === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> selectItem: Не задан параметр - значение ключа элемента");
                    return false;
                }

                var tree = this.getById(treeId);
                if (!tree) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> selectItem: Дерево с идентификатором '" + treeId + "' не найдено");
                    return false;
                }

                var item = tree.stack[key];
                if (item === undefined) {
                    $errors.add(ERROR_TYPE_ENGINE, "$structure -> selectItem: Элемент с ключом " + key + " не найден");
                    return false;
                }



                for (var index in tree.stack) {
                    var itm = tree.stack[index];
                    if (itm.key === key) {
                        if (itm.isSelected === true) {
                            itm.isSelected = false;
                            tree.selectedItem = false;
                            if (tree.collapseOnDeselect === true)
                                itm.isExpanded = false;
                        } else {
                            itm.isSelected = true;
                            tree.selectedItem = itm;
                            if (tree.expandOnSelect === true) {
                                if (itm.childrenCount > 0)
                                    itm.isExpanded = true;
                            }
                        }
                        tree.onSelect(itm);
                        //$log.log("selected item = ", itm);
                    } else
                        itm.isSelected = false;
                }
                return true;
            },
            
            
            isChildrenOf: function (treeId, key, parentKey) {
                if (treeId === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$tree -> isChildrenOf: Не задан параметр - идентификатор дерева");
                    return false;
                }

                if (key === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$tree -> isChildrenOf: Не задан параметр - значение ключа элемента");
                    return false;
                }

                var tree = this.getById(treeId);
                if (!tree) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$tree -> isChildrenOf: Дерево с идентификатором '" + treeId + "' не найдено");
                    return false;
                }

                var item = tree.stack[key];
                if (item === undefined) {
                    $errors.add(ERROR_TYPE_ENGINE, "$tree -> isChildrenOf: Элемент с ключом " + key + " не найден");
                    return false;
                }

                var parent = tree.stack[parentKey];
                if (parent === undefined) {
                    $errors.add(ERROR_TYPE_ENGINE, "$tree -> isChildrenOf: родительсктй элемент с ключом " + parentKey + " не найден");
                    return false;
                }

                var parent = item;
                while (parent) {
                    parent = tree.stack[parent.parentKey];
                }
            },
            


            calcViolations: function (treeId, key) {
                if (treeId === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> calc: Не задан параметр - идентификатор дерева");
                    return false;
                }

                if (key === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> calc: Не задан параметр - значение ключа элемента");
                    return false;
                }

                var tree = this.getById(treeId);
                if (!tree) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$structure -> calc: Дерево с идентификатором '" + treeId + "' не найдено");
                    return false;
                }

                var item = tree.stack[key];
                if (item === undefined) {
                    $errors.add(ERROR_TYPE_ENGINE, "$structure -> calc: Элемент с ключом " + key + " не найден");
                    return false;
                }

                var result = 0;
                for (var index in item.children) {
                    var child = item.children[index];
                    result += child.data.violationsAdded;
                }

                return result;
            }



        }
    }]);
