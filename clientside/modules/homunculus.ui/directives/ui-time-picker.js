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
                        //ngModel.$setViewValue(previousHours);
                        //$log.log("rec $viewValue = ", ngModel.$viewValue);
                    }
                });


                angular.element(minutesInput).on("keydown", function (event) {
                    previousMinutes = angular.element(minutesInput).val();
                    $log.log("previousMinutes = ", previousMinutes);
                });


                angular.element(minutesInput).on("keyup", function () {
                    //var exp = new RegExp("^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5]?[0-9]$");
                    var exp = new RegExp("^(0|[0-5]?[0-9])$");
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