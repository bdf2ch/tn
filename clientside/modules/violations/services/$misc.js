angular
    .module("violations")
    .factory("$misc", ["$log", "$http", "$errors", "$factory", function ($log, $http, $errors, $factory) {

        var eskGroups = [];
        var weekdays = [
            $factory({ classes: ["Weekday"], base_class: "Weekday", init: { id: 1,title: "Понедельник", code: "monday" } }),
            $factory({ classes: ["Weekday"], base_class: "Weekday", init: { id: 2,title: "Вторник", code: "tuesday" } }),
            $factory({ classes: ["Weekday"], base_class: "Weekday", init: { id: 3, title: "Среда", code: "wednesday" } }),
            $factory({ classes: ["Weekday"], base_class: "Weekday", init: { id: 4, title: "Четверг", code: "thursday" } }),
            $factory({ classes: ["Weekday"], base_class: "Weekday", init: { id: 5, title: "Пятница", code: "friday" } }),
            $factory({ classes: ["Weekday"], base_class: "Weekday", init: { id: 6, title: "Суббота", code: "saturday" } }),
            $factory({ classes: ["Weekday"], base_class: "Weekday", init: { id: 7, title: "Воскресение", code: "sunday" } })
        ];

        $log.info(weekdays);

        return {

            init: function (source) {
                if (source === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$misc -> init: Не задан параметр - источник данных");
                    return false;
                }

                if (source.eskGroups === undefined || source.eskGroups === null) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$misc -> init: Данные о группах ЭСК не найдены");
                    return false;
                }

                var length = source.eskGroups.length;
                for (var i = 0; i < length; i++) {
                    var group = $factory({ classes: ["ESKGroup", "Model", "Backup", "States"], base_class: "ESKGroup" });
                    group._model_.fromJSON(source.eskGroups[i]);
                    group._backup_.setup();
                    eskGroups.push(group);
                }

                return true;
            },


            eskGroups: {

                getAll: function () {
                    return eskGroups;
                },

                getById: function (id) {
                    if (id === undefined) {
                        $errors.add(ERROR_TYPE_DEFAULT, "$misc -> eskGroups -> getById: Не задан параметр - идентификатор группы ЭСК");
                        return false;
                    }

                    var length = eskGroups.length;
                    for (var i = 0; i < length; i++) {
                        if (eskGroups[i].id.value === id)
                            return eskGroups[i];
                    }

                    return false;
                }
            },


            weekdays: {

                getAll: function () {
                    return weekdays;
                }
            }

        }
    }]);
