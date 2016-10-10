angular
    .module("homunculus")
    .factory("$classes", ["$log", function ($log) {
        var items = {};

        /**
         * Добавляет класс в стек классов
         * @param className - Наименование класса
         * @param classDefinition - Определение класса
         * @returns {boolean}
         */
        var add = function (title, definition) {
            if (title !== undefined && definition !== undefined && typeof(definition) == "object") {
                items[title] = definition;
                //$log.info("Класс " + title + " добавлен в стек классов");
                //$log.log("total = ", items);
                return true;
            } else
                return false;
        };
        
        return {
            /**
             * Добавляет класс в стек классов
             * @param className - Наименование класса
             * @param classDefifnition - Определение класса
             * @returns {boolean}
             */
            add: function (className, classDefinition) {
                add(className, classDefinition);
            },

            /**
             * Возвращает все классы из стека
             * @returns {{}}
             */
            getAll: function () {
                return items;
            }
        };
    }]);

var homunculusInjector = angular.injector(['ng', 'homunculus']);
var $classesInjector = homunculusInjector.get('$classes');
