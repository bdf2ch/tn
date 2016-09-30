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