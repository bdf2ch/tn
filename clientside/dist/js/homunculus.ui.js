angular
    .module("homunculus.ui", ["homunculus"]);

angular
    .module("homunculus.ui")
    .factory("$dateTimePicker", ["$log", "$window", "$document", "$http", "$compile", "$rootScope", "$errors", "$factory", function ($log, $window, $document, $http, $compile, $rootScope, $errors, $factory) {
        var instances = [];
        var template = "";
        var isTemplateLoading = false;

        return {

            push: function (scope) {
                if (scope !== undefined) {
                    var instance = $factory({ classes: ["DateTimePicker"], base_class: "DateTimePicker" });
                    instance.id = scope.settings.id;
                    instance.isModal = scope.settings.isModal;
                    instance.isOpened = scope.settings.isOpened;
                    instance.element = scope.settings.element;
                    instance.scope = scope;
                    instance.minDate = scope.settings.minDate;
                    instance.maxDate = scope.settings.maxDate;
                    instances.push(instance);
                    $log.log(instances);
                    return instance;
                } else
                    return $errors.add(ERROR_TYPE_DEFAULT, "krypton.ui -> dateTimePicker directive: Не задан параметр - объект с настройками директивы");
            },


            show: function (elementId) {
                $log.log("instances before = ", instances);
                if (elementId !== undefined) {
                    var length = instances.length;
                    for (var i = 0; i < length; i++) {
                        if (instances[i].element.getAttribute("id") === elementId)
                            $log.log("Element with id = " + elementId + " found!");
                    }
                } else
                    return $errors.add(ERROR_TYPE_DEFAULT, "krypton.ui -> dateTimePicker directive : Не задан параметр - идентификатор HTML_элемента");
            },







            /**
             * Добавляет новый элемент в стек
             * @param parameters - Набор параметров инициализации
             * @returns {*}
             */
            add: function (parameters) {
                if (parameters !== undefined) {
                    if (typeof parameters === "object") {
                        if (parameters.element !== undefined) {

                            var element = document.getElementById(parameters.element);
                            $log.log("element = ", element);
                            if (element !== undefined && element !== null) {
                                var picker = $factory({classes: ["DateTimePicker"], base_class: "DateTimePicker"});
                                picker.id = "dateTimePicker" + instances.length;
                                picker.element = element;

                                //var instance = this.exists(angular.element(picker.element).prop("id"));

                                //if (element.classList.contains("ng-isolate-scope") === true)
                                element.setAttribute("ui-date-time-picker", "");
                                ///element.setAttribute("ui-date-time-picker-opened", false);
                                //element.setAttribute("ng-if", "isOpened === true");

                                for (var param in parameters) {
                                    if (picker.hasOwnProperty(param)) {
                                        switch (param) {
                                            case "modelValue":
                                                picker.modelValue = parameters[param];
                                                //element.setAttribute("date-time-picker-model-value", dateTimePicker.modelValue);
                                                break;
                                            case "isModal":
                                                if (typeof parameters[param] === "boolean") {
                                                    picker.isModal = parameters[param];
                                                    //if (picker.isModal === true)
                                                    //    element.setAttribute("date-time-picker-modal", picker.isModal);
                                                } else
                                                    return $errors.add(ERROR_TYPE_DEFAULT, "$dateTimePicker -> add: Неверно задан тип параметра - модальный режим");
                                                break;
                                            case "title":
                                                picker.title = parameters[param] !== undefined && parameters[param] !== "" ? parameters[param] : "";
                                                //if (picker.title !== "")
                                                //    element.setAttribute("date-time-picker-title", picker.title);
                                                break;
                                        }
                                    }
                                }


                                instances.push(picker);
                                $log.log(instances);
                                //element.setAttribute("ui-date-time-picker", "");
                                $log.info("dtp = ", picker);
                                $compile(picker.element)($rootScope.$new());

                                return picker;
                            } else
                                return $errors.add(ERROR_TYPE_DEFAULT, "$dateTimePicker -> add: Элемент с идентификатором '" + parameters[param] + "' не найден");
                        } else
                            return $errors.add(ERROR_TYPE_DEFAULT, "$dateTimePicker -> add: Не задан целевой элемент");
                    } else
                        return $errors.add(ERROR_TYPE_DEFAULT, "$dateTimePicker -> add: Неверно задан тип параметра инициализации");
                } else
                    return $errors.add(ERROR_TYPE_DEFAULT, "$dateTimePicker -> add: Не заданы параметры инициализации");
            },



            open: function (elementId) {
                if (elementId !== undefined) {
                    var length = instances.length;
                    $log.log("instances defore", instances);
                    for (var i = 0; i < length; i++) {
                        var instanceFound = false;
                        if (angular.element(instances[i].element).prop("id") === elementId) {
                            instanceFound = true;
                            $log.log("element with id = " + elementId + " found");
                            $log.log(instances[i]);
                            instances[i].scope.open();
                        }
                        if (instanceFound === false)
                            $log.log("Element " + elementId + " not found");
                    }
                } else
                    return $errors.add(ERROR_TYPE_DEFAULT, "$dateTimePicker -> open: Не задан параметр - идентификатор элемента");
            },


            /**
             * Проверяет на наличие экземпляра по идентификатору элемента
             * @param elementId - Идкнтификатор элемента
             * @returns {*}
             */
            exists: function (elementId) {
                if (elementId !== undefined) {
                    $log.log("elementId = ", elementId.toString());
                    var length = instances.length;
                    for (var i = 0; i < length; i++) {
                        $log.log("instance element = ", instances[i].element.getAttribute("id"));
                        if (instances[i].element.getAttribute("id").toString() === elementId) {
                            $log.log("founded instance = ", instances[i]);
                            return instances[i];
                        }
                    }
                    return false;
                } else
                    return $errors.add(ERROR_TYPE_DEFAULT, "$dateTimePicker -> exists: Не задан параметр - идентификатор элкмкнта");
            },


            getTemplate: function () {
                return template;
            },


            setTemplate: function (tpl) {
                if (tpl !== undefined)
                    template = tpl;
                else
                    return $errors.add(ERROR_TYPE_DEFAULT, "$dateTimePicker -> setTemplate: Не задан параметр - содержимое шаблона");
            },

            loading: function (flag) {
                if (flag !== undefined) {
                    if (typeof flag === "boolean") {
                        isTemplateLoading = flag;
                        return isTemplateLoading;
                    } else
                        return $errors.add(ERROR_TYPE_DEFAULT, "$dateTimePicker -> loading: Неверно задан тип параметр - флаг процесса загрузки шаблона");
                } else
                    return isTemplateLoading;
            },








            getAll: function () {
                return instances;
            },

            getById: function (id) {
                if (id === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$dateTimePicker -> getById: Не задан параметр - идентификатор календаря");
                    return false;
                }

                var length = instances.length;
                for (var i = 0; i < length; i++) {
                    if (instances[i].id === id)
                        return instances[i];
                }
                return false;
            }


        }
    }]);

angular
    .module("homunculus.ui")
    .factory("$modals", ["$log", "$window", "$compile", "$errors", function ($log, $window, $compile, $errors) {
        var modals = [];

        var redraw = function (elm) {
            if (elm !== undefined) {
                var left = ($window.innerWidth / 2) - angular.element(elm).prop("clientWidth") / 2 + "px";
                var top = ($window.innerHeight / 2) - ((angular.element(elm).prop("clientHeight")) / 2) + "px";

                angular.element(elm).css("left", left);
                angular.element(elm).css("top", top);
            }
        };

        return {

            /**
             * Возвращает массив со всеми модальными окнами
             * @returns {Array}
             */
            getAll: function () {
                return modals;
            },

            /**
             * Возвращает scope модального окна с заданным идентификатором
             * @param id {string} - идентификатор модального окна
             * @returns {scope}
             */
            getById: function (id) {
                if (id === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$modals -> getById: Не задан параметр - идентификатор модального окна");
                    return false;
                }

                var length = modals.length;
                for (var i = 0; i < length; i++) {
                    if (modals[i].id === id)
                        return modals[i];
                }

                return false;
            },

            /**
             * Регистирует модальное окно
             * @param scope {scope} - scope добавляемого модального окна
             * @returns {boolean}
             */
            register: function (modal) {
                if (modal === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$modals -> register: Не задан парметр - объект модального окна");
                    return false;
                }

                modals.push(modal);
                //$log.log("modals = ", items);

                return true;
            },

            /**
             * Открывает модальное окно с заданным идентификатором
             * @param id {string} - идентификатор модального окна
             * @returns {boolean}
             */
            open: function (id) {
                if (id === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$modals -> open: Не задан параметр - идентификатор модального окна");
                    return false;
                }

                var length = modals.length;
                var found = false;
                for (var i = 0; i < length; i++) {
                    if (modals[i].id === id) {
                        found = true;
                        currentModal = modals[i];
                        var modal = document.getElementsByClassName("krypton-ui-modal")[0];
                        var header = document.getElementById("krypton-ui-modal-caption");
                        var content = document.getElementById("krypton-ui-modal-content");
                        var footer = document.getElementById("krypton-ui-modal-footer");
                        header.innerHTML = modals[i].caption;
                        content.innerHTML = modals[i].content;
                        if (modals[i].footer.content !== undefined) {
                            footer.innerHTML = modals[i].footer.content;
                            angular.element(footer).css("display", "block");

                            if (modals[i].footer.height !== 0) {
                                angular.element(footer).css("height", modals[i].footer.height + "px");
                                //angular.element(footer).css("max-height", modals[i].footer.height + "px");
                                //angular.element(content).css("bottom", modals[i].footer.height + "px");
                                //angular.element(content).css
                            }
                        } else {
                            angular.element(footer).css("display", "none");
                        }
                        $compile(modal)(modals[i].scope);
                        angular.element(modal).css("display", "block");

                        var fog = document.getElementsByClassName("krypton-ui-fog");
                        document.body.style.overflow = "hidden";
                        fog[0].classList.add("visible");
                        redraw(modal);

                        if (modals[i].width !== 0)
                            angular.element(modal).css("width", modals[i].width + "px");
                        if (modals[i].height !== 0) {
                            angular.element(modal).css("height", modals[i].height + "px");
                            angular.element(content).css("height", modals[i].height - 35 - modals[i].footer.height + "px");
                            //angular.element(content).css("height", items[i].height + "px");
                        } else {
                            angular.element(modal).css("height", "auto");
                            if (modals[i].footer.height !== 0)
                                angular.element(content).css("height", "auto");
                            else
                                angular.element(content).css("height", "100%");
                        }


                        modal.addEventListener("DOMSubtreeModified", function () {
                            redraw(modal);
                        }, false);

                        angular.element($window).bind("resize", function () {
                            redraw(modal);
                        });
                    }
                }

                if (found === false) {
                    $errors.add(ERROR_TYPE_ENGINE, "$modals -> open: Модальное окно с идентификатором '" + id + "' не найдено");
                    return false;
                } else
                    return true;
            },

            /**
             * Закрывает модальное окно с заданным идентификатором
             * @returns {boolean}
             */
            close: function () {
                if (currentModal !== undefined) {
                    var modal = document.getElementsByClassName("krypton-ui-modal")[0];
                    if (currentModal.onClose !== undefined)
                        currentModal.onClose();
                    var fog = document.getElementsByClassName("krypton-ui-fog");
                    document.body.style.overflow = "hidden";
                    fog[0].classList.remove("visible");
                    angular.element(modal).css("display", "none");
                    currentModal = undefined;
                    return true;
                }

                return false;
            }
        }
    }]);

angular
    .module("homunculus.ui")
    .factory("$tree", ["$log", "$classes", "$factory", "$errors", function ($log, $classes, $factory, $errors) {
        var trees = [];
        
        return {



            register: function (parameters) {
                $log.log("parameters = ", parameters);
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

                $log.log("structures = ", trees);

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
                $log.log("expand item called");

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
                $log.log(item);
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

angular
    .module("homunculus.ui")
    .directive("uiDateTimePicker", ["$log", "$compile", "$window", "$document", "$errors", "$dateTimePicker", function ($log, $compile, $window, $document, $errors, $dateTimePicker) {
        return {
            restrict: "A",
            require: "ngModel",
            priority: 10,
            scope: {
                ngModel: "=",
                dateTimePickerModal: "=",
                dateTimePickerEnableTime: "=",
                dateTimePickerEnableMinutes: "=",
                dateTimePickerThroughNavigation: "=",
                dateTimePickerNoValue: "@",
                dateTimePickerOnSelect: "=",
                dateTimePickerMinDate: "=",
                dateTimePickerMaxDate: "="
            },
            link: function (scope, element, attrs, controller) {

                var template =
                    "<div class='toolbar'>" +
                    "<div class='control'><button class='width-100 blue' ng-class='{ \"very-big\": settings.isModal === true }' ng-click='prev()'>&larr;</button></div>" +
                    "<div class='content'>" +
                    "<select class='width-60 no-border' ng-if='isInTimeSelectMode === false' ng-model='month' ng-options='month[0] as month[1] for month in months'></select>" +
                    "<select class='width-40 no-border' ng-if='isInTimeSelectMode === false' ng-model='year' ng-options='year as year for year in years'></select>" +
                    "<span class='selected-date width-100' ng-if='isInTimeSelectMode === true && isInMinutesSelectMode === false && settings.isModal === false'>{{ value.format('DD.MM.YYYY, HH ч.') }}</span>" +
                    "<span class='selected-date width-100' ng-if='isInTimeSelectMode === true && isInMinutesSelectMode === false && settings.isModal === true'>{{ value.format('DD MMM YYYY, HH ч.') }}</span>" +
                    "<span class='selected-date width-100' ng-if='isInTimeSelectMode === true && isInMinutesSelectMode === true && settings.isModal === false'>{{ value.format('DD.MM.YYYY, HH:mm') }}</span>" +
                    "<span class='selected-date width-100' ng-if='isInTimeSelectMode === true && isInMinutesSelectMode === true && settings.isModal === true'>{{ value.format('DD MMM YYYY, HH:mm') }}</span>" +
                    "</div>" +
                    "<div class='control'><button class='width-100 blue' ng-class='{ \"very-big\": settings.isModal === true }' ng-click='next()'>&rarr;</button></div>" +
                    "</div>" +
                    "<div class='weekdays'>" +
                    "<div class='day width-100' ng-if='isInTimeSelectMode === true && isInMinutesSelectMode === false'>часы</div>" +
                    "<div class='day width-100' ng-if='isInTimeSelectMode === true && isInMinutesSelectMode === true'>минуты</div>" +
                    "<div class='day' ng-if='isInTimeSelectMode === false' ng-repeat='weekday in weekdays track by $index'>" +
                    "<span ng-if='settings.isModal === true'>{{ weekday[1] }}</span><span ng-if='settings.isModal === false'>{{ weekday[0] }}</span>" +
                    "</div>" +
                    "</div>" +
                    "<div class='days-container' style='height:{{ height + \"px\" }}; max-height:{{ height }};'>" +
                    "<div class='day' ng-if='isInTimeSelectMode === false' ng-class='{\"sunday\": ($index + 1) % 7 === 0, \"not-this-month\": day.month() !== month, \"current\": day.date() === now.date() && day.month() === value.month(), \"disabled\": day.unix() < settings.minDate || day.unix() > settings.maxDate }' ng-repeat='day in days track by $index' ng-click='select(day.unix())'>{{ day.date() }}</div>" +
                    "<div style='line-height: {{ height / 4 + \"px\" }};' class='hour' ng-if='isInTimeSelectMode === true && isInMinutesSelectMode === false' ng-class='{\"current\": value.hours() === $index}' ng-repeat='hour in hours track by $index' ng-click='select($index)'>{{ hour }}</div>" +
                    "<div style='line-height: {{ height / 3 + \"px\" }};' class='minute' ng-if='isInTimeSelectMode === true && isInMinutesSelectMode === true' ng-class='{\"current\": value.minutes() === ($index * 5)}' ng-repeat='minute in minutes track by $index' ng-click='select(minute)'>{{ minute }}</div>" +
                    "</div>";


                if (attrs.dateTimePickerId === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "date-time-picker: Не задан идентификатор календаря");
                    return false;
                }


                controller.$render = function () {
                    $log.log("dateTimePicker render called");
                    //if (scope.settings.isTimeEnabled === true)
                    //    element.val(moment.unix(controller).format("DD.MM.YYYY HH:mm"));
                    //else
                    //    element.val(moment.unix(controller).format("DD.MM.YYYY"));
                };


                scope.$watch("ngModel", function (val) {
                    $log.log("newVal = ", val);
                    //controller.$render();
                    if (scope.settings.isTimeEnabled === true)
                        element.val(moment.unix(val).format("DD.MM.YYYY HH:mm"));
                    else
                        element.val(moment.unix(val).format("DD.MM.YYYY"));
                });




                var height = scope.height = 0;
                var calendarHeight = scope.calendarHeight = 0;
                var ctrl = scope.ctrl = controller;
                var days = scope.days = [];
                var weekdays = scope.weekdays = [
                    ["Пн", "Понедельник"], ["Вт", "Вторник"],
                    ["Ср", "Среда"], ["Чт", "Четверг"] ,
                    ["Пт", "Пятница"], ["Сб", "Суббота"],
                    ["Вс", "Воскресение"]
                ];
                var months = scope.months =  [
                    [0, "Январь"] ,[1, "Февраль"], [2, "Март"],
                    [3, "Апрель"], [4, "Май"], [5, "Июнь"],
                    [6, "Июль"], [7, "Август"], [8, "Сентябрь"],
                    [9, "Октябрь"], [10, "Ноябрь"], [11, "Декабрь"]
                ];
                var hours = scope.hours = [
                    "00", "01", "02", "03",
                    "04", "05", "06", "07",
                    "08", "09", "10", "11",
                    "12", "13", "14", "15",
                    "16", "17", "18", "19",
                    "20", "21", "22", "23"
                ];
                var minutes = scope.minutes = [
                    "00", "05", "10", "15",
                    "20", "25", "30", "35",
                    "40", "45", "50", "55"
                ];

                var now = scope.now = moment(new Date());
                var date = scope.date = moment(now);
                var value = scope.value = moment(now);
                var day = scope.day = value.date();
                var month = scope.month = date.month();
                var year = scope.year = moment(value).year();
                //var hour = scope.hour = moment(value).hours();
                //var minute = scope.minute = moment(value).minutes();
                var years = scope.years = [];

                for (var i = moment(value).year() - 5; i < moment(value).year() + 5; i++) {
                    years.push(i);
                    if (i === moment(value).year())
                        selectedYear = i;
                }

                var isInTimeSelectMode = scope.isInTimeSelectMode = false;
                var isInMinutesSelectMode = scope.isInMinutesSelectMode = false;

                var settings = scope.settings = {
                    id: attrs.dateTimePickerId,
                    // Модальный режим отображения виджета
                    isModal: scope.dateTimePickerModal !== null && scope.dateTimePickerModal !== undefined ? true : false,
                    isOpened: false,
                    // Режим выбора времени
                    isTimeEnabled: scope.dateTimePickerEnableTime !== null && scope.dateTimePickerEnableTime !== undefined ? true : false,
                    // Сквозная навигация по часам и минутам
                    isTroughNavigationEnabled: scope.dateTimePickerThroughNavigation !== null && scope.dateTimePickerThroughNavigation !== undefined ? true : false,
                    title: "",
                    noValue: scope.dateTimePickerNoValue !== null && scope.dateTimePickerNoValue !== undefined && scope.dateTimePickerNoValue !== "" ? scope.dateTimePickerNoValue : undefined,
                    element: element,
                    onSelect: scope.dateTimePickerOnSelect !== null && scope.dateTimePickerOnSelect !== undefined ? scope.dateTimePickerOnSelect : undefined,
                    minDate: scope.dateTimePickerMinDate !== null && scope.dateTimePickerMinDate !== undefined ? scope.dateTimePickerMinDate : 0,
                    maxDate: scope.dateTimePickerMaxDate !== null && scope.dateTimePickerMaxDate !== undefined ? scope.dateTimePickerMaxDate : Number.POSITIVE_INFINITY
                };


                $log.info("settings = ", scope.settings);


                var recalculate = function (monthNumber) {
                    if (monthNumber !== undefined) {
                        var daysInMonth = moment(monthNumber + "-" + scope.year, "MM-YYYY").daysInMonth();
                        var weekDayOfFirstDay = moment("01." + monthNumber + "." + scope.year, "DD.MM.YYYY").weekday();
                        var weekDayOfLastDay = moment(daysInMonth + "." + monthNumber + "." + scope.year, "DD.MM.YYYY").weekday();
                        var lastDayInSelectedMonth = "";
                        $log.log("in month number " + monthNumber + " - " + daysInMonth + " days");
                        $log.log("first day in month = ", weekDayOfFirstDay);
                        $log.log("last day in month = ", weekDayOfLastDay);

                        days.splice(0, days.length);
                        if (weekDayOfFirstDay > 0) {
                            var start = moment("01." + monthNumber + "." + scope.year + " 00:00", "DD.MM.YYYY HH:mm").subtract(weekDayOfFirstDay, "days");
                            $log.log("first day in calendar = ", moment(start).format("DD.MM.YYYY"));
                            for (var x = 0; x < weekDayOfFirstDay; x++) {
                                var day = moment(start).add(x, "days");
                                days.push(day);
                            }
                        }
                        for (var i = 1; i <= daysInMonth; i++) {
                            var day = moment(i + "." + monthNumber + "." + scope.year + " 00:00", "DD.MM.YYYY HH:mm");
                            days.push(day);
                            if (moment(day).date() === daysInMonth) {
                                lastDayInSelectedMonth = day;
                                $log.log("last day = ", moment(lastDayInSelectedMonth).format("DD.MM.YYYY"));
                            }

                            $log.log("last day in month2 = ", weekDayOfLastDay);

                        }
                        if (weekDayOfLastDay < 6) {
                            //$log.log("last day in calendar = ", moment(start).format("DD.MM.YYYY"));
                            var start = moment(lastDayInSelectedMonth).add(1, "days");
                            for (var i = 1; i <= (6 - weekDayOfLastDay); i++) {
                                var day = moment(lastDayInSelectedMonth).add(i, "days");
                                days.push(day);
                            }
                        }
                    } else
                        return $errors.add(
                            ERROR_TYPE_DEFAULT,
                            "krypton.ui -> dateTimePicker directive: Не задан параметр - порядковый номер месяца"
                        );
                };


                var redraw = function (elm) {
                    if (elm !== undefined) {
                        var elementWidth = angular.element(element).prop("clientWidth");
                        var elementHeight = angular.element(element).prop("clientHeight");
                        var elementLeft = angular.element(element).prop("offsetLeft");
                        var elementTop = angular.element(element).prop("offsetTop");
                        var containerWidth = angular.element(elm).prop("clientWidth");
                        var containerHeight = angular.element(elm).prop("clientHeight");
                        var elementScrollTop = 0;
                        var elementScrollLeft = 0;
                        var windowWidth = $window.innerWidth;
                        var windowHeight = $window.innerHeight;
                        var left = 0;
                        var top = 0;

                        var parent = element[0].offsetParent;
                        //$log.log("parent = ", parent);
                        while (parent) {
                            //elementTop = elementTop + parent.offsetTop;
                            //elementLeft = elementLeft + parent.offsetLeft;
                            elementScrollLeft = elementScrollLeft + parent.scrollLeft;
                            elementScrollTop = elementScrollTop + parent.scrollTop;
                            parent = parent.offsetParent;
                        }
                        //$log.log("containerTop = ", elementScrollTop);
                        //$log.log("containerLeft = ", elementScrollLeft);


                        //return {top: Math.round(top), left: Math.round(left), offsetX: Math.round(offsetX), offsetY: Math.round(offsetY)};
                        //};

                        //$log.log(angular.element($document).parent());

                        if (scope.settings.isModal === true) {
                            left = (windowWidth / 2) - angular.element(elm).prop("clientWidth") / 2 + "px";
                            top = (windowHeight / 2) - ((angular.element(elm).prop("clientHeight")) / 2) + "px"
                        } else {
                            if (containerWidth > elementWidth) {
                                if ((elementLeft > (containerWidth - elementWidth) / 2) && (elementLeft < (windowWidth - elementLeft) + containerWidth / 2))
                                    left = elementLeft - ((containerWidth - elementWidth) / 2);
                            } else
                                left = angular.element(element).prop("offsetLeft") + "px";

                            if ((elementTop - containerHeight) + 10 < 0) {
                                top = elementTop + elementHeight + 10 + "px";
                            } else
                                top = angular.element(elm).prop("clientHeight") + elementScrollTop - 10 + "px";
                        }
                        angular.element(elm).css("left", left);
                        angular.element(elm).css("top", top);

                        if (scope.isInTimeSelectMode === true)
                            scope.height = scope.calendarHeight;
                        else {
                            scope.height = "auto";
                            scope.calendarHeight = scope.settings.isModal === true ? containerHeight - 80 : containerHeight - 55;
                        }
                        return true;
                    } else
                        return $errors.add(ERROR_TYPE_DEFAULT, "krypton.ui -> dateTimePicker directive: Не задан параметр - HTML-элемент");
                };



                controller.$parsers.push(function (value) {
                    scope.$apply();
                    return value;
                });

                controller.$formatters.push(function (value) {
                    if (value === 0) {
                        if (scope.settings.noValue !== undefined)
                            return scope.settings.noValue;
                        else
                            return moment.unix(value).format("DD MMM YYYY");
                    } else {
                        return scope.settings.isTimeEnabled === true ? moment.unix(value).format("DD MMM YYYY, HH:mm") : moment.unix(value).format("DD MMM YYYY");
                    }

                });





                scope.prev = function () {
                    if (scope.settings.isTimeEnabled === true && scope.isInTimeSelectMode === true) {
                        if (scope.isInMinutesSelectMode === false) {
                            if (scope.settings.isTroughNavigationEnabled === false) {
                                if (scope.value.hours() > 0 && scope.value.hours() <= 23)
                                    scope.value.subtract(1, "hours");
                                else if (scope.value.hours() === 0)
                                    scope.value.hours(23);
                            } else
                                scope.value.subtract(1, "hours");
                            $log.log(scope.value.format("DD.MM.YYYY HH:mm"));
                        } else {
                            if (scope.settings.isTroughNavigationEnabled === false) {
                                if (scope.value.minutes() > 0 && scope.value.minutes() <= 59)
                                    scope.value.subtract(5, "minutes");
                                else if (scope.value.minutes() === 0)
                                    scope.value.minutes(55);
                            } else
                                scope.value.subtract(5, "minutes");
                            $log.log(scope.value.format("DD.MM.YYYY HH:mm"));
                        }
                    } else {
                        scope.date.subtract(1, "months");
                        $log.log("currentDate = " + scope.value.format("DD.MM.YYYY"));
                        scope.month = scope.date.month();
                        scope.year = scope.date.year();
                        recalculate(scope.date.month() + 1);
                    }
                };


                scope.next = function () {
                    if (scope.settings.isTimeEnabled === true && scope.isInTimeSelectMode === true) {
                        if (scope.isInMinutesSelectMode === false) {
                            if (scope.settings.isTroughNavigationEnabled === false) {
                                if (scope.value.hours() >= 0 && scope.value.hours() < 23)
                                    scope.value.add(1, "hours");
                                else if (scope.value.hours() === 23)
                                    scope.value.hours(0);
                            } else
                                scope.value.add(5, "minutes");
                        } else
                            scope.value.add(5, "minutes");
                    } else {
                        scope.date.add(1, "months");
                        moment(scope.date).day(1);
                        $log.log("currentDate = " + moment(scope.date).format("DD.MM.YYYY"));
                        scope.month = moment(scope.date).month();
                        scope.year = moment(scope.date).year();
                        recalculate(scope.date.month() +1);
                    }
                };


                scope.select = function (value) {
                    if (value !== undefined) {
                        $log.log("selected value = ", value);
                        if (value >= scope.settings.minDate && value <= scope.settings.maxDate) {
                            if (scope.settings.isTimeEnabled === true) {
                                if (scope.isInTimeSelectMode === false) {
                                    var temp = moment.unix(value).hours(0).minutes(0).seconds(0);
                                    scope.month = temp.month();
                                    scope.day = temp.date();
                                    scope.value.month(scope.month).date(scope.day).hours(0).minutes(0).seconds(0);
                                    controller.$setViewValue(scope.value.unix());
                                    //scope.ngModel = scope.value.unix();
                                    scope.isInTimeSelectMode = true;
                                    $log.log(scope.value.format("DD.MM.YYYY HH:mm"), scope.value.unix());
                                    //scope.$apply();
                                } else {
                                    if (scope.isInMinutesSelectMode === false) {
                                        scope.value.hours(value).minutes(0).seconds(0);
                                        //scope.ngModel = scope.value.unix();
                                        controller.$setViewValue(scope.value.unix());
                                        scope.isInMinutesSelectMode = true;
                                        $log.log(scope.value.format("DD.MM.YYYY HH:mm"), scope.value.unix());
                                    } else {
                                        scope.value.minutes(parseInt(value));
                                        //scope.ngModel = scope.value.unix();
                                        controller.$setViewValue(scope.value.unix());
                                        $log.log(scope.value.format("DD.MM.YYYY HH:mm"), scope.value.unix());
                                        scope.close();
                                        //scope.$apply();
                                    }
                                }
                            } else {
                                var temp = moment.unix(value).hours(0).minutes(0).seconds(0);
                                scope.month = temp.month();
                                scope.day = temp.date();
                                scope.value.month(scope.month).date(scope.day).hours(0).minutes(0).seconds(0);
                                //scope.ngModel = scope.value.unix();
                                controller.$setViewValue(scope.value.unix());
                                $log.log(scope.value.format("DD.MM.YYYY HH:mm"), scope.value.unix());
                                scope.value = moment(new Date());
                                scope.close();
                                //scope.$apply();
                            }
                            if (scope.settings.onSelect !== undefined)
                                scope.settings.onSelect();
                        }

                    } else
                        $log.error("value = ", value);
                };


                var instance = $dateTimePicker.push(scope);
                var container = document.createElement("div");
                container.setAttribute("id", instance.id);
                container.className = "ui-date-time-picker2";
                if (scope.settings.isModal === true) {
                    container.classList.add("modal");
                    var fog = document.getElementsByClassName("krypton-ui-fog");
                    if (fog.length === 0) {
                        var fogElement = document.createElement("div");
                        fogElement.className = "krypton-ui-fog";
                        document.body.appendChild(fogElement);
                    }
                }
                container.innerHTML = template;
                document.body.appendChild(container);
                $compile(container)(scope);
                angular.element(element).css("cursor", "pointer");
                recalculate(scope.date.month() + 1);


                scope.open = function () {
                    if (scope.settings.isModal === true) {
                        var fog = document.getElementsByClassName("krypton-ui-fog");
                        document.body.style.overflow = "hidden";
                        fog[0].classList.add("visible");
                    }
                    angular.element(container).css("display", "block");
                    scope.settings.isOpened = true;
                    redraw(container);

                };


                scope.close = function () {
                    if (scope.settings.isModal === true) {
                        var fog = document.getElementsByClassName("krypton-ui-fog");
                        fog[0].classList.remove("visible");
                        document.body.style.overflow = "auto";
                    }
                    angular.element(container).css("display", "none");
                    scope.settings.isOpened = false;
                    scope.isInMinutesSelectMode = false;
                    scope.isInTimeSelectMode = false;
                    scope.value = new moment(new Date());
                    //scope.$apply();
                };


                container.addEventListener("DOMSubtreeModified", function () {
                    redraw(container);
                }, false);


                angular.element($window).bind("resize", function () {
                    redraw(container);
                });


                angular.element($document).bind("mousedown", function (event) {
                    if (scope.settings.isOpened === true && container.contains(event.target) === false && event.target !== element[0])
                        scope.close();
                });


                element.on("mousedown", function () {
                    if (scope.settings.isOpened === false)
                        scope.open();
                });


                element.on("keydown", function (event) {
                    event.preventDefault();
                });

                angular.element(angular.element(element).parent()).on("scroll", function () {
                    $log.log("parent scrolled");
                    redraw(container);
                });
            }
        }
    }]);
angular
    .module("homunculus.ui")
    .directive("uiModalFooter", ["$log", "$sce", "$modals", function ($log, $sce, $modals) {
        return {
            restrict: "E",
            require: "^uiModal",
            link: function (scope, element, attrs, ctrl) {
                var height = 0;
                if (attrs.height !== undefined && attrs.height !== "")
                    height = parseInt(attrs.height);

                $log.log("ui modal footer");
                ctrl.registerFooter($sce.trustAsHtml(element[0].innerHTML), height);
                angular.element(element).remove();
            }
        }
    }]);
angular
    .module("homunculus.ui")
    .directive("uiModal", ["$log", "$sce", "$modals", function ($log, $sce, $modals) {
        return {
            restrict: "A",
            scope: false,
            controller: function ($scope, $element) {
                var footer = $scope.footer = {
                    content: undefined,
                    height: 0
                };

                this.registerFooter = function (content, height) {
                    $scope.footer.content = content;
                    $scope.footer.height = height;
                };

            },
            link: function (scope, element, attrs, ctrl) {
                $log.log("modal directive");

                if (attrs.modalId === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "krypton.ui -> modal: Не задан идентификатор модального окна - аттрибут 'modal-id'");
                    return false;
                }


                var modal  = {
                    id: attrs.modalId,
                    isVisible: false,
                    caption: attrs.modalCaption !== undefined ? attrs.modalCaption : "",
                    content: $sce.trustAsHtml(element[0].innerHTML),
                    footer: scope.footer,
                    scope: scope,
                    width: attrs.modalWidth !== undefined && !isNaN(attrs.modalWidth) ? parseInt(attrs.modalWidth) : 0,
                    height: attrs.modalHeight !== undefined && !isNaN(attrs.modalHeight) ? parseInt(attrs.modalHeight) : 0,
                    onClose: attrs.modalOnClose !== undefined && typeof scope.$eval(attrs.modalOnClose) === "function" ? scope.$eval(attrs.modalOnClose) : undefined,
                    onOpen: attrs.modalOnOpen !== undefined && typeof scope.$eval(attrs.modalOnOpen) === "function" ? scope.$eval(attrs.modalOnOpen) : undefined
                };


                element[0].innerHTML = "";
                element[0].classList.add("ng-hide");
                $modals.register(modal);


                var check = document.getElementsByClassName("krypton-ui-modal");
                if (check.length === 0) {
                    var modal = document.createElement("div");
                    modal.className = "krypton-ui-modal";
                    var header = document.createElement("div");
                    header.className = "modal-header";
                    var headerCaption = document.createElement("span");
                    headerCaption.setAttribute("id", "krypton-ui-modal-caption");
                    headerCaption.className = "modal-caption";
                    var headerClose = document.createElement("span");
                    headerClose.className = "modal-close fa fa-times right";
                    headerClose.setAttribute("title", "Закрыть");
                    headerClose.setAttribute("ng-click", "modals.close()");
                    header.appendChild(headerCaption);
                    header.appendChild(headerClose);
                    var content = document.createElement("div");
                    content.setAttribute("id", "krypton-ui-modal-content");
                    content.className = "modal-content";
                    var footer = document.createElement("div");
                    footer.setAttribute("id", "krypton-ui-modal-footer");
                    footer.className = "modal-footer";
                    document.body.appendChild(modal);
                    modal.appendChild(header);
                    modal.appendChild(content);
                    modal.appendChild(footer);
                }


                var fog = document.getElementsByClassName("krypton-ui-fog");
                if (fog.length === 0) {
                    var fogElement = document.createElement("div");
                    fogElement.className = "krypton-ui-fog";
                    document.body.appendChild(fogElement);
                }
            }
        }
    }]);
angular
    .module("homunculus.ui")
    .directive("uiTimePicker", ["$log", function ($log) {
        return {
            restrict: "E",
            require: "ngModel",
            priority: 10,
            scope: {
                ngModel: "=",
                class: "@"
            },
            replace: true,
            template:
                "<div class='ui-time-picker {{ class }}'>" +
                    "<div class='time-picker-hours'><input type='text' maxlength='2' value='{{ hours }}'></div>" +
                    "<div class='time-picker-separator'>:</div>" +
                    "<div class='time-picker-minutes'><input type='text' maxlength='2' value='{{ minutes }}'></div>" +
                "</div>",
            link: function (scope, element, attrs, ngModel) {
                var date = 0;
                var hours = scope.hours = "00";
                var minutes = scope.minutes = "00";
                var previousHours = 0;
                var previousMinutes = 0;

                var hoursInput = angular.element(element.children()[0]).children()[0];
                var minutesInput = angular.element(element.children()[2]).children()[0];
                $log.log("hrs = ", hoursInput);
                $log.log("mns = ", minutesInput);

                scope.$watch("ngModel", function (val) {
                    $log.log("time model = ", val);
                });


                ngModel.$formatters.push(function (val) {
                    date = moment.unix(val);
                    $log.log("filter date = ", date.format("DD.MM.YYYY HH:mm"));
                    scope.hours = moment.unix(val).format("HH");
                    scope.minutes = moment.unix(val).format("mm");
                    return moment.unix(val).format("HH:mm");
                });


                ngModel.$parsers.push(function (val) {
                    $log.log("parser val = ", val);
                    return val;
                });


                angular.element(hoursInput).on("keydown", function (event) {
                    previousHours = angular.element(hoursInput).val();
                    $log.log("previousHours = ", previousHours);
                });


                angular.element(hoursInput).on("keyup", function () {
                    //var exp = new RegExp("^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5]?[0-9]$");
                    var exp = new RegExp("^([0-9]|0[0-9]|1[0-9]|2[0-3])$");
                    if (exp.test(angular.element(hoursInput).val())) {
                        $log.log("hours accepted");
                        date.hours(parseInt(angular.element(hoursInput).val()));
                        //ngModel.$modelValue = date.unix();
                        ngModel.$setViewValue(date.unix());
                        //scope.minutes = moment.unix(date).format("mm");
                        $log.info(ngModel);
                        scope.$apply();
                    } else {
                        $log.log("shit");
                        //ngModel.$setViewValue(element.val());
                        //$log.log("rec $viewValue = ", ngModel.$viewValue);
                    }
                });


                angular.element(minutesInput).on("keydown", function (event) {
                    previousMinutes = angular.element(minutesInput).val();
                    $log.log("previousMinutes = ", previousMinutes);
                });


                angular.element(minutesInput).on("keyup", function () {
                    //var exp = new RegExp("^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5]?[0-9]$");
                    var exp = new RegExp("^([0-9]|0[0-9]|1[0-9]|2[0-3])$");
                    if (exp.test(angular.element(minutesInput).val())) {
                        $log.log("minutes accepted");
                        date.minutes(parseInt(angular.element(minutesInput).val()));
                        ngModel.$setViewValue(date.unix());
                        angular.element(minutesInput).val(moment.unix(date).format("mm"));
                        $log.info(ngModel);
                    } else {
                        $log.log("shit");
                        angular.element(minutesInput).val(previousMinutes);
                        //ngModel.$setViewValue(element.val());
                        //$log.log("rec $viewValue = ", ngModel.$viewValue);
                    }
                });
            }
        }
    }]);
angular
    .module("homunculus.ui")
    .directive("uiTree", ["$log", "$templateCache", "$errors", "$tree", function ($log, $templateCache, $errors, $tree) {

        var template =
            "<div class='container nested'>" +
            "<div class=\"tree-item\" ng-show='node.isVisible !== false' ng-class='{ \"with-children\": node.childrenCount > 0, \"expanded\": node.isExpanded === true && node.childrenCount > 0, \"active\": node.isSelected === true }' ng-repeat=\"node in node.children | toArray | orderBy: \'order\' track by $index\">" +
            "<div class='tree-item-content' ng-click='expand(node)'>" +
            "<div class='item-label' ng-class='{ \"active\": node.isSelected === true }' ng-click='select(node, $event)'>" +
            "<span>{{ node.display }}</span>" +
            "</div>" +
            "<div class='item-controls'>" +
            "<span class='expand fa fa-chevron-down' ng-click='expand(node)' ng-show='node.childrenCount > 0 && node.isExpanded == false'></span>" +
            "<span class='collapse fa fa-chevron-up' ng-if='node.isExpanded === true' ng-click='collapse(node)'></span>" +
            "</div>" +
            "<div class='item-notifications' ng-show='tree.showNotifications == true && node.notifications.items.length > 0'>" +
            "<div class='notification {{ notification.class }}' ng-repeat='notification in node.notifications.items track by $index' ng-show='notification.isVisible === true'>" +
            "<span class='fa {{ notification.icon }} notification.class' ng-show='notification.icon !== \"\"'></span>" +
            "<span class='value'>{{ notification.value }}</span>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div ng-show='node.isExpanded === true' ng-include=\"\'tree'\"></div>" +
            "</div>" +
            "</div>";

        return {
            restrict: "E",
            scope: {
                class: "@"
            },
            template:
            "<div class='{{ \"krypton-ui-tree \" + class }}'>" +
            "<div class='container root'>" +
            "<div class='tree-item' ng-show='node.isVisible !== false' ng-class='{ \"with-children\": node.childrenCount > 0, \"expanded\": node.isExpanded === true, \"active\": node.isSelected === true }' ng-repeat='node in initial | toArray | orderBy:\"order\" track by $index'>" +
            "<div class='tree-item-content' ng-click='expand(node)'>" +
            "<div class='item-label' ng-class='{ active: node.isSelected === true }' ng-click='select(node, $event)'>" +
            "<span>{{ node.display }}</span>" +
            "</div>" +
            "<div class='item-controls'>" +
            "<span class='expand fa fa-chevron-down' ng-click='expand(node)' ng-show='node.childrenCount > 0 && node.isExpanded === false'></span>" +
            "<span class='collapse fa fa-chevron-up' ng-if='node.isExpanded === true' ng-click='collapse(node)'></span>" +
            "</div>" +
            "<div class='item-notifications' ng-show='tree.showNotifications === true && node.notifications.items.length > 0'>" +
            "<div class='notification {{ notification.class }}' ng-repeat='notification in node.notifications.items track by $index' ng-show='notification.isVisible === true'>" +
            "<span class='fa {{ notification.icon }}' ng-show='notification.icon !== \"\"'></span>" +
            "<span class='value'>{{ notification.value }}</span>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div ng-include=\"\'tree'\" ng-show='node.isExpanded === true'></div>" +
            "</div>" +
            "</div>" +
            "</div>",
            link: function (scope, element, attrs) {

                if (attrs.id === undefined || attrs.id === "") {
                    $errors.add(ERROR_TYPE_ENGINE, "structure directive -> Не задан параметр - идентификатор дерева");
                    return false;
                }

                if (attrs.rootKey === undefined || attrs.rootKey === "") {
                    $errors.add(ERROR_TYPE_ENGINE, "structure directive -> Не задан параметр - значение коюча корневого элемента дерева");
                    return false;
                }

                if (attrs.rootKeyDataType === undefined || attrs.rootKeyDataType === "") {
                    $errors.add(ERROR_TYPE_ENGINE, "structure directive -> Не задан параметр - тип данных коюча корневого элемента дерева");
                    return false;
                }

                var root = 0;
                switch (attrs.rootKeyDataType) {
                    case "DATA_TYPE_INTEGER":
                        if (isNaN(parseInt(attrs.rootKey))) {
                            $errors.add(ERROR_TYPE_ENGINE, "structure directive -> Значение ключа корневого элемента не соответствует типу данных коючевого элемента");
                            return false;
                        }
                        root = parseInt(attrs.rootKey);
                        break;
                    case "DATA_TYPE_FLOAT":
                        if (isNaN(parseFloat(attrs.rootKey))) {
                            $errors.add(ERROR_TYPE_ENGINE, "structure directive -> Значение ключа корневого элемента не соответствует типу данных коючевого элемента");
                            return false;
                        }
                        root = parseFloat(attrs.rootKey);
                        break;
                    case "DATA_TYPE_STRING":
                        root = attrs.rootKey.toString();
                        break;
                    default:
                        $errors.add(ERROR_TYPE_ENGINE, "structure directive -> Неверно задан тип данных корневого элемента");
                        return false;
                        break;
                }


                var initial = scope.initial = {};
                var stack = scope.stack = {};

                $templateCache.put("tree", template);
                var tree = $tree.getById(attrs.id);
                if (tree !== false) {
                    scope.initial = tree.initial;
                    scope.stack = tree.stack;
                    scope.tree = tree;
                } else {
                    $tree.register({
                        id: attrs.id,
                        rootKey: root,
                        expandOnSelect: attrs.expandOnSelect !== undefined ? true : false,
                        collapseOnDeselect: attrs.collapseOnDeselect !== undefined ? true : false
                    });
                    scope.tree = $tree.getById(attrs.id);
                }



                scope.select = function (item, event) {
                    event.stopPropagation();
                    if (item !== undefined) {
                        if (!$tree.selectItem(attrs.id, item.key)) {
                            $errors.add(ERROR_TYPE_ENGINE, "structure directive -> '" + attrs.id + "' select: Не удалось выбрать элемент с идентификатором " + item.key);
                            return false;
                        }
                        return true;
                    }
                };



                scope.expand = function (item) {
                    if (item !== undefined) {
                        $log.log(item);
                        if (item.isExpanded == false) {
                            if (!$tree.expandItem(attrs.id, item.key)) {
                                $errors.add(ERROR_TYPE_ENGINE, "structure directive -> expand: не удвлось развернуть элемент с идентификатором " + item.key);
                                return false;
                            }
                        } else {
                            if (!$tree.collapseItem(attrs.id, item.key)) {
                                $errors.add(ERROR_TYPE_ENGINE, "structure directive -> expand: Не удалось свернуть элемент с идентификатором " + item.key);
                                return false;
                            }
                        }
                        return true;
                    }
                };

            }
        }
    }]);