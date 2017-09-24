"use strict";

/**
 * Директива ввода и редактирования времени
 */
angular
    .module('violations')
    .directive('timeInput', ['$log', function ($log) {
        return {
            restrict: 'E',
            templateUrl: '/clientside/modules/violations/directives/time-input.directive.html',
            require: 'ngModel',
            scope: {
                disabled: '=',
                onChange: '&'
            },
            link: function (scope, element, attrs, ctrl) {
                var hours = scope.hours = 0;
                var minutes = scope.minutes = 0;
                var isDisabled = scope.isDisabled = false;
                var isChanged = scope.isChanged = false;


                if (attrs.disabled !== undefined && attrs.disabled !== '') {
                    scope.isDisabled = scope.disabled === true ? true : false;
                }


                scope.$watch('disabled', function (val) {
                    scope.isDisabled = val === true ? true : false;
                });


                ctrl.$formatters.push(function (value) {
                    scope.hours = moment.unix(value).format('HH');
                    scope.minutes = moment.unix(value).format('mm');
                    return value;
                });


                scope.hoursUp = function () {
                    var temp = moment.unix(ctrl.$modelValue);
                    temp.hour(temp.hours() < 23 ? temp.hours() + 1 : 0);
                    ctrl.$setViewValue(temp.unix());
                    scope.hours = moment.unix(ctrl.$modelValue).format('HH');
                    scope.change();
                };


                scope.hoursDown = function () {
                    var temp = moment.unix(ctrl.$modelValue);
                    temp.hour(temp.hours() > 0 ? temp.hours() - 1 : 23);
                    ctrl.$setViewValue(temp.unix());
                    scope.hours = moment.unix(ctrl.$modelValue).format('HH');
                    scope.change();
                };


                scope.minutesUp = function () {
                    var temp = moment.unix(ctrl.$modelValue);
                    temp.minutes(temp.minutes() < 59 ? temp.minutes() + 1 : 0);
                    ctrl.$setViewValue(temp.unix());
                    scope.minutes = moment.unix(ctrl.$modelValue).format('mm');
                    scope.change();
                };


                scope.minutesDown = function () {
                    var temp = moment.unix(ctrl.$modelValue);
                    temp.minutes(temp.minutes() > 0 ? temp.minutes() - 1 : 59);
                    ctrl.$setViewValue(temp.unix());
                    scope.minutes = moment.unix(ctrl.$modelValue).format('mm');
                    scope.change();
                };


                scope.change = function () {
                    scope.isChanged = true;
                    scope.onChange();
                };
            }
        }
    }]);