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
                dateTimePickerMaxDate: "=",
                dateTimePickerFormat: "@"
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


                //controller.$render = function () {
                //    $log.log("dateTimePicker render called");
                    //if (scope.settings.isTimeEnabled === true)
                    //    element.val(moment.unix(controller).format("DD.MM.YYYY HH:mm"));
                    //else
                    //    element.val(moment.unix(controller).format("DD.MM.YYYY"));
                //};


                /*
                scope.$watch("ngModel", function (val) {
                    $log.log("newVal = ", val);
                    //controller.$render();
                    if (scope.settings.isTimeEnabled === true)
                        element.val(moment.unix(val).format("DD.MM.YYYY HH:mm"));
                    else
                        element.val(moment.unix(val).format("DD.MM.YYYY"));
                });
                */




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
                    maxDate: scope.dateTimePickerMaxDate !== null && scope.dateTimePickerMaxDate !== undefined ? scope.dateTimePickerMaxDate : Number.POSITIVE_INFINITY,
                    format: scope.dateTimePickerFormat !== null && scope.dateTimePickerFormat !== undefined && scope.dateTimePickerFormat !== "" ? scope.dateTimePickerFormat : "DD MMM YYYY"
                };


                //$log.info("settings = ", scope.settings);


                var recalculate = function (monthNumber) {
                    if (monthNumber !== undefined) {
                        var daysInMonth = moment(monthNumber + "-" + scope.year, "MM-YYYY").daysInMonth();
                        var weekDayOfFirstDay = moment("01." + monthNumber + "." + scope.year, "DD.MM.YYYY").weekday();
                        var weekDayOfLastDay = moment(daysInMonth + "." + monthNumber + "." + scope.year, "DD.MM.YYYY").weekday();
                        var lastDayInSelectedMonth = "";
                        //$log.log("in month number " + monthNumber + " - " + daysInMonth + " days");
                        //$log.log("first day in month = ", weekDayOfFirstDay);
                        //$log.log("last day in month = ", weekDayOfLastDay);

                        days.splice(0, days.length);
                        if (weekDayOfFirstDay > 0) {
                            var start = moment("01." + monthNumber + "." + scope.year + " 00:00", "DD.MM.YYYY HH:mm").subtract(weekDayOfFirstDay, "days");
                            //$log.log("first day in calendar = ", moment(start).format("DD.MM.YYYY"));
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
                                //$log.log("last day = ", moment(lastDayInSelectedMonth).format("DD.MM.YYYY"));
                            }

                            //$log.log("last day in month2 = ", weekDayOfLastDay);

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



                controller.$parsers.push(function(value) {
                    scope.$apply();
                    return value;
                });

                controller.$formatters.push(function(value) {
                    //$log.log("formatter value = ", value);
                    if (value === 0) {
                        //$log.log("formatter value = ", value);
                        if (scope.settings.noValue !== undefined) {
                            //$log.log("noValue = ", scope.settings.noValue);
                            return scope.settings.noValue;
                        } else
                            return moment.unix(value).format("DD MMM YYYY");
                    } else {
                        return scope.settings.isTimeEnabled === true ? moment.unix(value).format("DD MMM YYYY, HH:mm") : moment.unix(value).format(scope.settings.format);
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
                            //$log.log(scope.value.format("DD.MM.YYYY HH:mm"));
                        } else {
                            if (scope.settings.isTroughNavigationEnabled === false) {
                                if (scope.value.minutes() > 0 && scope.value.minutes() <= 59)
                                    scope.value.subtract(5, "minutes");
                                else if (scope.value.minutes() === 0)
                                    scope.value.minutes(55);
                            } else
                                scope.value.subtract(5, "minutes");
                            //$log.log(scope.value.format("DD.MM.YYYY HH:mm"));
                        }
                    } else {
                        scope.date.subtract(1, "months");
                        //$log.log("currentDate = " + scope.value.format("DD.MM.YYYY"));
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
                        //$log.log("currentDate = " + moment(scope.date).format("DD.MM.YYYY"));
                        scope.month = moment(scope.date).month();
                        scope.year = moment(scope.date).year();
                        recalculate(scope.date.month() +1);
                    }
                };


                scope.select = function (value) {
                    if (value !== undefined) {
                        //$log.log("selected value = ", value);
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
                                    //$log.log(scope.value.format("DD.MM.YYYY HH:mm"), scope.value.unix());
                                    //scope.$apply();
                                } else {
                                    if (scope.isInMinutesSelectMode === false) {
                                        scope.value.hours(value).minutes(0).seconds(0);
                                        //scope.ngModel = scope.value.unix();
                                        controller.$setViewValue(scope.value.unix());
                                        scope.isInMinutesSelectMode = true;
                                        //$log.log(scope.value.format("DD.MM.YYYY HH:mm"), scope.value.unix());
                                    } else {
                                        scope.value.minutes(parseInt(value));
                                        //scope.ngModel = scope.value.unix();
                                        controller.$setViewValue(scope.value.unix());
                                        //$log.log(scope.value.format("DD.MM.YYYY HH:mm"), scope.value.unix());
                                        scope.close();
                                        //scope.$apply();
                                    }
                                }
                            } else {
                                var temp = moment.unix(value).hours(0).minutes(0).seconds(0);
                                scope.month = temp.month();
                                scope.day = temp.date();
                                scope.value.month(scope.month).date(scope.day).hours(0).minutes(0).seconds(0);
                                scope.ngModel = scope.value.unix();
                                controller.$setViewValue(scope.value.unix());
                                //$log.log(scope.value.format("DD.MM.YYYY HH:mm"), scope.value.unix());
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
                    //$log.log("parent scrolled");
                    redraw(container);
                });
            }
        }
    }]);