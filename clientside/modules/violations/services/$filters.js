angular
    .module("violations")
    .factory("$vFilters", ["$log", "$errors", "$violations", function ($log, $errors, $violations) {
        var isEnabled = false;
        var isFilterByNumberActive = true;
        var isFilterByDateActive = false;
        var isFilterByEskGroupActive = false;
        var startDate = 0;
        var endDate = 0;
        var filters = [];

        return {
            violationNumber: "",
            startDate: 0,
            endDate: 0,
            eskGroupId: 0,


            enabled: function (flag) {
                //if (flag !== undefined && typeof flag !== "boolean") {
                //    $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "$filters -> Неверно задан тип параметра");
                //    return false;
                //} else
                if (flag !== undefined)
                    isEnabled = flag;
                return isEnabled;
            },

            getActive: function () {
                return filters;
            },

            add: function () {},


            filterByNumber: function (flag) {
                if (flag !== undefined) {
                    isFilterByNumberActive = flag;
                    isFilterByDateActive = false;
                    isFilterByEskGroupActive = false;
                }
                return isFilterByNumberActive;
            },

            filterByDate: function (flag) {
                if (flag !== undefined) {
                    isFilterByDateActive = flag;
                    isFilterByNumberActive = false;
                    isFilterByEskGroupActive = false;
                }
                return isFilterByDateActive;
            },

            filterByEskGroup: function (flag) {
                if (flag !== undefined) {
                    isFilterByEskGroupActive = flag;
                    isFilterByNumberActive = false;
                    isFilterByDateActive = false;
                }
                return isFilterByEskGroupActive;
            }
        }
    }]);