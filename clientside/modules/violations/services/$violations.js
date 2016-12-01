
angular.module("violations")
        .factory("$violations", ["$log", "$classes", "$factory", "$http", "$errors", "$session", "$tree", "$settings", function ($log, $classes, $factory, $http, $errors, $session, $tree, $settings) {
            var violations = [];
            var attachments = [];
            var currentDivision = undefined;
            var newDivision = $factory({ classes: ["Division", "Model", "Backup", "States"], base_class: "Division" });
            newDivision._backup_.setup();
            var currentViolation = undefined;
            var newViolation = $factory({ classes: ["Violation", "Model", "Backup", "States"], base_class: "Violation" });
            var newViolationAttachments = [];
            var currentViolationAttachments = [];
            var totalViolations = 0;
            var totalAttachments = 0;
            var isLoading = false;

            var filters = [
                $factory({ classes: ["ViolationFilter", "Backup"], base_class: "ViolationFilter", init: { code: "violation-id", title: "Поиск по # ТН", startValue: 0, isActive: true } }),
                $factory({ classes: ["ViolationFilter", "Backup"], base_class: "ViolationFilter", init: { code: "violation-date", title: "Фильтр по дате нарушения"}, startValue: 0, endValue: 0 }),
                $factory({ classes: ["ViolationFilter", "Backup"], base_class: "ViolationFilter", init: { code: "violation-esk-group", title: "Поиск по группе ЭСК"} })
            ];
            var isFilterEnabled = false;
            var isViolationIdSent = false;
            var startControlPeriod = 0;
            var endControlPeriod = 0;
            var violationsTotal = 0;
            var violationsLoaded = 0;

            var start = 0;

            var api = {
                init: function () {
                    if (window.initialData !== undefined) {
                        //$log.log("startPeriod = ", moment.unix(window.initialData.startPeriod).format("DD.MM.YYYY HH:mm"), window.initialData.startPeriod);
                        //$log.log("endPeriod = ", moment.unix(window.initialData.endPeriod).format("DD.MM.YYYY HH:mm"), window.initialData.endPeriod);
                        //$log.log("testError = ", window.initialData.testError);

                        if (window.initialData.startPeriod !== undefined) {
                            startControlPeriod = window.initialData.startPeriod;
                        }
                        if (window.initialData.endPeriod !== undefined) {
                            endControlPeriod = window.initialData.endPeriod;
                        }

                        if (window.initialData.violations !== undefined) {

                            if (window.initialData.total !== undefined) {
                                violationsTotal = window.initialData.total;
                            }

                            var length = window.initialData.violations.length;
                            for (var i = 0; i < length; i++) {
                                var violation = $factory({ classes: ["Violation", "Model", "Backup", "States"], base_class: "Violation" });
                                violation._model_.fromJSON(window.initialData.violations[i].violation);
                                violation.isNew = violation.happened.value >= startControlPeriod && violation.happened.value <= endControlPeriod ? true : false;
                                violation._backup_.setup();
                                var user = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });
                                user._model_.fromJSON(window.initialData.violations[i].user);
                                violation.user = user;

                                if (window.initialData.violations[i].attachments !== undefined && window.initialData.violations[i].attachments.length > 0) {
                                    var l = window.initialData.violations[i].attachments.length;
                                    for (var x = 0; x < l; x++) {
                                        totalAttachments++;
                                        var attachment = $factory({ classes: ["Attachment", "Model", "Backup", "States"], base_class: "Attachment" });
                                        attachment._model_.fromJSON(window.initialData.violations[i].attachments[x]);
                                        violation.newAttachments += attachment.added.value >= startControlPeriod && attachment.added.value <= endControlPeriod ? 1 : 0;
                                        violation.attachments.push(attachment);
                                    }
                                }

                                violations.push(violation);
                                violationsLoaded++;
                            }
                        }
                    }
                },


                loading: function (flag) {
                    if (flag !== undefined)
                        isLoading = flag;
                    return isLoading;
                },

                startControlPeriod: function () {
                    return startControlPeriod;
                },

                endControlPeriod: function () {
                    return endControlPeriod;
                },


                /**
                 * Очищает массив с нарушениями
                 * @returns {boolean}
                 */
                clear: function () {
                    violations = [];
                    violationsTotal = 0;
                    //attachmentsTotal = 0;
                    totalAttachments = 0;
                    violationsLoaded = 0;
                    return true;
                },


                getTotalViolations: function () {
                    return totalViolations;
                },

                getTotalAttachments: function () {
                    return totalAttachments;
                },

                addAttachment: function () {
                    totalAttachments++;
                },

                getAll: function () {
                    return violations;
                },

                getCurrent: function () {
                    return currentViolation;
                },
                getNew: function () {
                    return newViolation;
                },

                getById: function (id, callback) {
                    if (id === undefined) {
                        $errors.add(ERROR_TYPE_DEFAULT, "$violations -> getById: Не задан параметр - идентификатор технологического нарушения");
                        return false;
                    }

                    var length = violations.length;
                    for (var i = 0; i < length; i++) {
                        if (violations[i].id.value === id) {
                            //$log.info("getting violation from cache");
                            currentViolation = violations[i];
                            return currentViolation;
                        }
                    }

                    var params = {
                        action: "getViolationById",
                        data: {
                            id: id
                        }
                    };
                    isLoading = true;
                    return $http.post("/serverside/api.php", params).then(
                        function success(response) {
                            isLoading = false;
                            var violation = $factory({ classes: ["Violation", "Model", "Backup", "States"], base_class: "Violation" });
                            violation._model_.fromJSON(response.data.violation);
                            violation._backup_.setup();

                            var user = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });
                            user._model_.fromJSON(response.data.user);
                            violation.user = user;

                            var length = response.data.attachments.length;
                            for (var i = 0; i < length; i++) {
                                var attachment = $factory({ classes: ["Attachment", "Model", "Backup", "States"], base_class: "Attachment" });
                                attachment._model_.fromJSON(response.data.attachments[i]);
                                violation.attachments.push(attachment);
                            }

                            currentViolation = violation;
                            return currentViolation;
                        },
                        function error() {
                            isLoading = false;
                            return undefined;
                        }
                    );
                },


                searchById: function (id, onSuccess, onFail) {
                    if (id === undefined) {
                        $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "$violations -> violations -> searchById: Не задан параметр - идентификатор технологического нарушения");
                        return false;
                    }

                    var params = {
                        action: "searchViolationById",
                        data: {
                            id: id
                        }
                    };
                    isLoading = true;
                    violations = [];
                    $http.post("/serverside/api.php", params).then(
                        function success(response) {
                            //$log.info(response);
                            isLoading = false;
                            api.filter.isIdSent(true);
                            if (response.data !== "" && response.data !== "false") {
                                var violation = $factory({
                                    classes: ["Violation", "Model", "Backup", "States"],
                                    base_class: "Violation"
                                });
                                violation._model_.fromJSON(response.data.violation);
                                violation._backup_.setup();

                                var user = $factory({
                                    classes: ["AppUser", "Model", "Backup", "States"],
                                    base_class: "AppUser"
                                });
                                user._model_.fromJSON(response.data.user);
                                violation.user = user;

                                var length = response.data.attachments.length;
                                for (var i = 0; i < length; i++) {
                                    var attachment = $factory({
                                        classes: ["Attachment", "Model", "Backup", "States"],
                                        base_class: "Attachment"
                                    });
                                    attachment._model_.fromJSON(response.data.attachments[i]);
                                    violation.attachments.push(attachment);
                                }

                                if (onSuccess !== undefined && typeof onSuccess === "function")
                                    onSuccess(violation);

                                return violation;
                            } else if (onFail !== undefined && typeof onFail === "function")
                                onFail();
                        },
                        function error() {
                            isLoading = false;
                            $errors.throw($errors.type.ERROR_TYPE_ENGINE, "$violations -> violations -> searchById: В процессе поиска ТН возникла ошибка");
                            return false;
                        }
                    );

                },

                select: function (id, callback) {
                    if (id === undefined) {
                        $errors.add(ERROR_TYPE_DEFAULT, "$violations -> violations -> select: Не залан параметр - идентификатор нарушения");
                        return false;
                    }

                    var length = violations.length;
                    for (var i = 0; i < length; i++) {
                        if (violations[i].id.value === id) {
                            if (violations[i]._states_.selected() === false) {
                                violations[i]._states_.selected(true);
                                currentViolation = violations[i];
                            } else {
                                violations[i]._states_.selected(false);
                                currentViolation = undefined;
                            }
                        } else
                            violations[i]._states_.selected(false);
                    }

                    if (callback !== undefined && typeof callback === "function")
                        callback(currentViolation);

                    return true;
                },


                getTotal: function () {
                    return violationsTotal;
                },

                getLoaded: function () {
                    return violationsLoaded;
                },


                getByDivisionId: function (divisionId, callback) {
                    //$log.log("startDate = ", this.startDate, ", endDate = ", this.endDate);
                    if (divisionId === undefined) {
                        $errors.add(ERROR_TYPE_DEFAULT, "$violations -> violations -> selectByDivisionId: Не задан парметр - идентификатор структурного подразделения");
                        return false;
                    }

                    var params = {
                        action: "getViolationsByDivisionId",
                        data: {
                            divisionId: divisionId,
                            startDate: api.filter.getByCode('violation-date').startValue.value,
                            endDate: api.filter.getByCode('violation-date').endValue.value,
                            eskGroupId: api.filter.getByCode('violation-esk-group').startValue.value,
                            limit: $settings.getByCode("violations-on-page").value.value,
                            start: violations.length
                        }
                    };

                    isLoading = true;
                    $http.post("serverside/api.php", params)
                        .success(function (data) {
                            isLoading = false;
                            if (data !== undefined && data.length > 0) {
                                violationsTotal = data[0].total;
                                var length = data.length;
                                for (var i = 0; i < length; i++) {
                                    var violation = $factory({ classes: ["Violation", "Model", "Backup", "States"], base_class: "Violation" });
                                    violation._model_.fromJSON(data[i].violation);
                                    violation.isNew = violation.happened.value >= startControlPeriod && violation.happened.value <= endControlPeriod ? true : false;
                                    violation._backup_.setup();
                                    var user = $factory({ classes: ["AppUser", "Model", "Backup", "States"],  base_class: "AppUser" });
                                    user._model_.fromJSON(data[i].user);
                                    violation.user = user;

                                    if (data[i].attachments !== undefined && data[i].attachments.length > 0) {
                                        var l = data[i].attachments.length;
                                        for (var x = 0; x < l; x++) {
                                            totalAttachments++;
                                            var attachment = $factory({ classes: ["Attachment", "Model", "Backup", "States"], base_class: "Attachment" });
                                            attachment._model_.fromJSON(data[i].attachments[x]);
                                            violation.newAttachments += attachment.added.value >= startControlPeriod && attachment.added.value <= endControlPeriod ? 1 : 0;
                                            violation.attachments.push(attachment);
                                        }
                                    }

                                    violations.push(violation);
                                    violationsLoaded++;

                                    if (callback !== undefined && typeof callback === "function")
                                        callback();
                                }
                            }
                        });
                },

                add: function (callback) {
                    var params = {
                        action: "addViolation",
                        data: {
                            id: newViolation.id.value,
                            userId: newViolation.userId.value,
                            divisionId: newViolation.divisionId.value,
                            eskGroupId: newViolation.eskGroupId.value,
                            eskObject: newViolation.eskObject.value,
                            happened: newViolation.happened.value,
                            ended: newViolation.ended.value,
                            description: newViolation.description.value
                        }
                    };

                    newViolation._states_.loading(true);
                    $http.post("/serverside/api.php", params)
                        .success(function (data) {
                            newViolation._states_.loading(false);
                            if (data !== undefined && data !== false) {
                                totalViolations++;
                                var violation = $factory({
                                    classes: ["Violation", "Model", "Backup", "States"],
                                    base_class: "Violation"
                                });
                                violation._model_.fromJSON(data.violation);
                                violation.isNew = violation.happened.value >= startControlPeriod && violation.happened.value <= endControlPeriod ? true : false;
                                violation._backup_.setup();
                                var user = $factory({
                                    classes: ["AppUser", "Model", "Backup", "States"],
                                    base_class: "AppUser"
                                });
                                user._model_.fromJSON(data.user);
                                violation.user = user;

                                violation.attachments = [];
                                var length = data.attachments.length;
                                for (var i = 0; i < length; i++) {
                                    totalAttachments++;
                                    var attachment = $factory({
                                        classes: ["Attachment", "Model", "Backup", "States"],
                                        base_class: "Attachment"
                                    });
                                    attachment._model_.fromJSON(data.attachments[i]);
                                    violation.newAttachments += attachment.added.value >= startControlPeriod && attachment.added.value <= endControlPeriod ? 1 : 0;
                                    violation.attachments.push(attachment);
                                }

                                //violations.push(violation);

                                if (callback !== undefined && typeof callback === "function")
                                    callback(violation);

                                return true;
                            }
                        });
                },

                edit: function (callback) {
                    var params = {
                        action: "editViolation",
                        data: {
                            id: currentViolation.id.value,
                            divisionId: currentViolation.divisionId.value,
                            userId: currentViolation.userId.value,
                            eskGroupId: currentViolation.eskGroupId.value,
                            eskObject: currentViolation.eskObject.value,
                            description: currentViolation.description.value,
                            happened: currentViolation.happened.value,
                            ended: currentViolation.ended.value,
                            isConfirmed: currentViolation.isConfirmed.value === true ? 1 : 0
                        }
                    };
                    $http.post("/serverside/api.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                currentViolation._backup_.setup();
                                if (callback !== undefined && typeof callback === "function")
                                    callback(currentViolation);
                                return true;
                            }
                            return false;
                        });
                },


                cancel: function (violationId, url, departmentId, callback) {
                    if (violationId === undefined) {
                        $errors.add(ERROR_TYPE_DEFAULT, "$violations -> violations -> cancel: Не задан параметр - идентификатор технологического нарушения");
                        return false;
                    }

                    if (url === undefined) {
                        $errors.add(ERROR_TYPE_DEFAULT, "$violations -> cancel: Не задан параметр - url");
                        return false;
                    }

                    if (departmentId === undefined) {
                        $errors.add(ERROR_TYPE_DEFAULT, "$violations -> violations -> cancel: Не задан параметр - идентификатор филиала организации");
                        return false;
                    }

                    var params = {
                        action: "cancelViolation",
                        data: {
                            serviceId: "violations",
                            violationId: newViolation.id.value,
                            departmentId: departmentId
                        }
                    };

                    newViolation._states_.loading(true);
                    $http.post(url, params)
                        .success(function (data) {
                            newViolation._states_.loading(false);
                            if (data !== undefined) {
                                if (data === "true") {
                                    if (callback !== undefined && typeof callback === "function")
                                        callback();
                                    return true;
                                }
                            }
                        });
                },

                addAttachmentToNew: function (attachment, callback) {
                    if (attachment === undefined) {
                        $errors.add(ERROR_TYPE_DEFAULT, "$violations -> violations -> addAttachmentToNew: Не задан параметр - приложение");
                        return false;
                    }

                    newViolationAttachments.push(attachment);
                    if (callback !== undefined && typeof callback === "function")
                        callback(attachment);

                    return true;
                },




                filter: {
                    //violationId: "",
                    //startDate: 0,
                    //endDate: 0,
                    //eskGroupId: 0,


                    /**
                     *
                     * @returns {[*,*,*]}
                     */
                    getAll: function () {
                        return filters;
                    },



                    /**
                     *
                     * @param code
                     * @returns {*}
                     */
                    getByCode: function (code) {
                        if (code === undefined) {
                            $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "$violations -> filter -> getByCode: Не задан параметр - код фильтра");
                            return false;
                        }

                        var length = filters.length;
                        for (var i = 0; i < length; i++) {
                            if (filters[i].code.value === code)
                                return filters[i];
                        }

                        return false;
                    },


                    /**
                     *
                     * @param code
                     * @returns {boolean}
                     */
                    selectByCode: function (code) {
                        if (code === undefined) {
                            $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "$violations -> filter -> selectByCode: Не задан параметр - код фильтра");
                            return false;
                        }

                        var length = filters.length;
                        for (var i = 0; i < length; i++) {
                            if (filters[i].code.value === code)
                                filters[i].isActive = true;
                            else
                                filters[i].isActive = false;
                        }

                        return true;
                    },


                    /**
                     *
                     * @param flag
                     * @returns {boolean}
                     */
                    enabled: function (flag) {
                        if (flag !== undefined)
                            isFilterEnabled = flag;
                        return isFilterEnabled;
                    },


                    /**
                     *
                     * @param flag
                     * @returns {boolean}
                     */
                    isIdSent: function (flag) {
                        if (flag !== undefined)
                            isViolationIdSent = flag;
                        return isViolationIdSent;
                    },


                    /**
                     *
                     * @returns {boolean}
                     */
                    cancelViolationId: function () {
                        api.filter.getByCode("violation-id").startValue.value = 0;
                        api.filter.getByCode("violation-id")._backup_.setup();
                        return true;
                    },


                    /**
                     *
                     * @param callback
                     * @returns {boolean}
                     */
                    cancelStartDate: function (callback) {
                        api.filter.getByCode("violation-date").startValue.value = 0;
                        if (callback !== undefined && typeof callback === "function")
                            callback();
                        return true;
                    },


                    /**
                     *
                     * @param callback
                     * @returns {boolean}
                     */
                    cancelEndDate: function (callback) {
                        api.filter.getByCode("violation-date").endValue.value = 0;
                        if (callback !== undefined && typeof callback === "function")
                            callback();
                        return true;
                    },


                    /**
                     *
                     * @param callback
                     * @returns {boolean}
                     */
                    cancelEskGroup: function (callback) {
                        this.eskGroupId = 0;
                        api.filter.getByCode("violation-esk-group").startValue.value = 0;
                        if (callback !== undefined && typeof callback === "function")
                            callback();
                        return true;
                    }
                },





                attachments: {
                    getAll: function () {
                        return attachments;
                    },

                    getNew: function () {
                        return newViolationAttachments;
                    },

                    getCurrentViolationAttachments: function () {
                        return currentViolationAttachments;
                    },

                    getByViolationId: function (violationId, callback) {
                        if (violationId === undefined) {
                            $errors.add(ERROR_TYPE_DEFAULT, "$violations -> attachments -> getByViolationId: Не задан параметр - идентификатор технологического нарушения");
                            return false;
                        }

                        var length = attachments.length;
                        currentViolationAttachments = [];
                        for (var i = 0; i < length; i++) {
                            if (attachments[i].violationId.value === violationId) {
                                currentViolationAttachments.push(attachments[i]);
                            }
                        }
                    },


                    /**
                     *
                     * @param attachment
                     * @param callback
                     * @returns {boolean}
                     */
                    add: function (attachment, callback) {
                        if (attachment === undefined) {
                            $errors.add(ERROR_TYPE_DEFAULT, "$violations -> attachments: Не задан параметр - добавляемое вложение");
                            return false;
                        }

                        attachments.push(attachment);
                        if (callback !== undefined && typeof callback === "function")
                            callback(attachment);
                        return true;
                    },


                    /**
                     * Удаляет вложение, загруженное в режиме добавления или редактирования ТН
                     * @param attachmentId {number} - Идеентификатор вложения
                     * @param departmentId {number} - Идентификатор филиали организации
                     * @param url {string} - Url скрипта
                     * @param callback {function} - callback-функция
                     * @returns {boolean} - true в случае успеха, false в противном случае
                     */
                    delete: function (attachmentId, departmentId, url, callback) {
                        if (attachmentId === undefined) {
                            $errors.add(ERROR_TYPE_DEFAULT, "$violations -> attachments -> delete: Не задан параметр - идентификатор вложения");
                            return false;
                        }

                        if (departmentId === undefined) {
                            $errors.add(ERROR_TYPE_DEFAULT, "$violations -> attachments -> delete: Не задан параметр - идентификатор филиала организации");
                            return false;
                        }

                        if (url === undefined || url === "") {
                            $errors.add(ERROR_TYPE_DEFAULT, "$violations -> attachments -> delete: Не задан параметр - url скрипта удаления документа");
                            return false;
                        }

                        var params = {
                            serviceId: "violations",
                            attachmentId: attachmentId,
                            departmentId: departmentId
                        };
                        $http.post(url, params)
                            .success(function (data) {
                                if (data !== undefined) {
                                    if (data === "true") {
                                        if (callback !== undefined && typeof callback === "function")
                                            callback();
                                        return true;
                                    } else
                                        return false;
                                }
                            })
                            .error(function () {
                                return false;
                            });
                    }
                }
            };

            return api;
        }]);