
angular.module("violations")
        .factory("$violations", ["$log", "$classes", "$factory", "$http", "$errors", "$session", "$tree", function ($log, $classes, $factory, $http, $errors, $session, $tree) {
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
            var thursday = 0;
            var isLoading = false;


            var isFilterEnabled = true;
            var isViolationIdSent = false;

            var pages = 0;
            var pagesLoaded = 1;
            var total = 0;
            var start = 0;

            return api = {
                init: function () {
                    if (window.initialData !== undefined) {

                        if (window.initialData.thursday !== undefined && window.initialData.thursday !== null) {
                            thursday = window.initialData.thursday;
                        }

                        if (window.initialData.violations !== undefined) {

                            if (window.initialData.total !== undefined) {
                                total = window.initialData.total;
                                $log.log("total = ", total);
                                //pages = Math.ceil(window.initialData.total / itemsOnPage);
                            }

                            var length = window.initialData.violations.length;
                            for (var i = 0; i < length; i++) {
                                totalViolations++;
                                var violation = $factory({ classes: ["Violation", "Model", "Backup", "States"], base_class: "Violation" });
                                violation._model_.fromJSON(window.initialData.violations[i].violation);
                                violation.isNew = violation.happened.value > moment.unix(thursday).hours(23).minutes(59).seconds(59).unix() ? true : false;
                                violation._backup_.setup();
                                var user = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });
                                user._model_.fromJSON(window.initialData.violations[i].user);
                                violation.user = user;
                                //violation.attachments = [];

                                if (window.initialData.violations[i].attachments !== undefined && window.initialData.violations[i].attachments.length > 0) {
                                    var l = window.initialData.violations[i].attachments.length;
                                    for (var x = 0; x < l; x++) {
                                        totalAttachments++;
                                        var attachment = $factory({ classes: ["Attachment", "Model", "Backup", "States"], base_class: "Attachment" });
                                        attachment._model_.fromJSON(window.initialData.violations[i].attachments[x]);
                                        violation.newAttachments += attachment.added.value > moment.unix(thursday).hours(23).minutes(59).seconds(59).unix() ? 1 : 0;
                                        violation.attachments.push(attachment);
                                    }
                                }

                                violations.push(violation);
                            }
                            start = totalViolations;
                            //$log.log("violations = ", violations);
                        }


                        if (window.initialData.attachments !== undefined) {
                            var length = window.initialData.attachments.length;
                            for (var i = 0; i < length; i++) {
                                var attachment = $factory({ classes: ["Attachment", "Model", "Backup", "States"], base_class: "Attachment" });
                                attachment._model_.fromJSON(window.initialData.attachments[i]);
                                attachment._backup_.setup();
                                attachments.push(attachment);
                            }
                            //$log.log("attachments = ", attachments);
                        }
                    }
                },

                violations: {
                    pages: {
                        isMoreItems: function () {

                        },
                        getTotal: function () {
                            return total;
                        },
                        loadNextPage: function () {
                            var params = {
                                action: "getViolationsByDivisionId",
                                divisionId: currentDivision.id.value,
                                start: start
                            };
                            $http.post("/serverside/api.php", params)
                                .success(function (data) {
                                    if (data !== undefined && data.length > 0) {
                                        var length = data.length;
                                        for (var i = 0; i < length; i++) {
                                            var violation = $factory({ classes: ["Violation", "Model", "Backup", "States"], base_class: "Violation" });
                                            violation._model_.fromJSON(data[i].violation);
                                            violation._backup_.setup();
                                            var user = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });
                                            user._model_.fromJSON(data[i].user);
                                            violation.user = user;
                                            //violation.attachments = [];

                                            if (data[i].attachments !== undefined && data[i].attachments.length > 0) {
                                                var l = data[i].attachments.length;
                                                for (var x = 0; x < l; x++) {
                                                    var attachment = $factory({ classes: ["Attachment", "Model", "Backup", "States"], base_class: "Attachment" });
                                                    attachment._model_.fromJSON(data[i].attachments[x]);
                                                    violation.attachments.push(attachment);
                                                }
                                            }

                                                violations.push(violation);
                                        }




                                            var length = data.length;
                                            for (var i = 0; i < length; i++) {
                                                var violation = $factory({ classes: ["Violation", "Model", "Backup", "States"], base_class: "Violation" });
                                                violation._model_.fromJSON(data[i]);
                                                violation._backup_.setup();
                                                violations.push(violation);
                                            }
                                    }
                                });
                        }
                    },
                    
                    startDate: 0,
                    endDate: 0,
                    loadMore: true,

                    loading: function (flag) {
                        if (flag !== undefined)
                            isLoading = flag;
                        return isLoading;
                    },

                    filterStartDate: function (date) {
                        if (date !== undefined)
                            startDate = date;
                        return startDate;
                    },

                    filterEndDate: function (date) {
                        if (date !== undefined)
                            endDate = date;
                        return endDate;
                    },

                    getControlDate: function () {
                        $log.log("friday = ", moment.unix(thursday).hours(23).minutes(59).seconds(59).format("DD.MM.YYY HH:mm"));
                        return moment.unix(thursday).hours(23).minutes(59).seconds(59).unix();
                    },

                    getNewByDivisionId: function (divisionId) {
                        var length = violations.length;
                        var result = {
                            violations: 0,
                            attachments: 0
                        };
                        for (var i = 0; i < length; i++) {
                            if (violations[i].divisionId.value === divisionId && violations[i].happened.value > this.getLastFriday()) {
                                result.violations++;
                                var al = violations[i].attachments.length;
                                for (var x = 0; x < al; x++) {
                                    if (violations[i].attachments[x].added.value > this.getLastFriday())
                                        result.attachments++;
                                }
                            }
                        }
                        return result;
                    },

                    setStart: function (value) {
                        start = value;
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
                            $errors.add(ERROR_TYPE_DEFAULT, "$violations -> loadById: Не задан параметр - идентификатор технологического нарушения");
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
                                //$log.info("promise success");
                                var violation = $factory({classes: ["Violation", "Model", "Backup", "States"], base_class: "Violation"});
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


                    searchById: function (id, callback) {
                        if (id === undefined) {
                            $errors.throw($errors.type.ERROR_TYPE_DEFAULT, "$violations -> violations -> searchById: Не задан параметр - идентификатор технологического нарушения");
                            return false;
                        }

                        var params = {
                            action: "searchById",
                            data: {
                                id: id
                            }
                        };
                        isLoading = true;
                        $http.post("/serverside/api.php", params).then(
                            function success (response) {
                                if (data !== undefined) {
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
                                }
                            },
                            function error () {
                                $errors.throw($errors.type.ERROR_TYPE_ENGINE, "$violations -> violations -> searchById: В процессе поиска возникла ошибка");
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

                    getByDivisionId: function (divisionId, callback) {
                        //$log.log("startDate = ", this.startDate, ", endDate = ", this.endDate);
                        if (divisionId === undefined) {
                            $errors.add(ERROR_TYPE_DEFAULT, "$violations -> violations -> selectByDivisionId: Не задан парметр - идентификатор структурного подразделения");
                            return false;
                        }

                        /*
                        if (startDate === undefined) {
                            $errors.add(ERROR_TYPE_DEFAULT, "$violations -> violations -> selectByDivisionId: Не задан парметр - начальная дата");
                            return false;
                        }

                        if (endDate === undefined) {
                            $errors.add(ERROR_TYPE_DEFAULT, "$violations -> violations -> selectByDivisionId: Не задан парметр - конечная дата");
                            return false;
                        }
                        */


                        var params = {
                            action: "getViolationsByDivisionId",
                            data: {
                                divisionId: divisionId,
                                startDate: api.violations.filter.startDate,
                                endDate: api.violations.filter.endDate,
                                eskGroupId: api.violations.filter.eskGroupId,
                                start: start
                            }
                        };

                        if (this.startDate !== 0 || this.endDate !== 0)
                            start = 0;

                        if (start === 0) {
                            totalAttachments = 0;
                            totalViolations = 0;
                        }

                        isLoading = true;
                        $http.post("serverside/api.php", params)
                            .success(function (data) {
                                isLoading = false;
                                if (start === 0)
                                    violations = [];
                                if (data !== undefined && data.length > 0) {
                                    total = data[0].total;
                                    var length = data.length;
                                    for (var i = 0; i < length; i++) {
                                        start++;
                                        totalViolations++;
                                        var violation = $factory({ classes: ["Violation", "Model", "Backup", "States"], base_class: "Violation" });
                                        violation._model_.fromJSON(data[i].violation);
                                        violation.isNew = violation.happened.value > moment.unix(thursday).hours(23).minutes(59).seconds(59).unix() ? true : false;
                                        violation._backup_.setup();
                                        var user = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });
                                        user._model_.fromJSON(data[i].user);
                                        violation.user = user;
                                        //violation.attachments = [];

                                        if (data[i].attachments !== undefined && data[i].attachments.length > 0) {
                                            var l = data[i].attachments.length;
                                            for (var x = 0; x < l; x++) {
                                                totalAttachments++;
                                                var attachment = $factory({ classes: ["Attachment", "Model", "Backup", "States"], base_class: "Attachment" });
                                                attachment._model_.fromJSON(data[i].attachments[x]);
                                                violation.newAttachments += attachment.added.value > moment.unix(thursday).hours(23).minutes(59).seconds(59).unix() ? 1 : 0;
                                                violation.attachments.push(attachment);
                                            }
                                        }

                                        violations.push(violation);

                                        if (callback !== undefined && typeof callback === "function")
                                            callback();
                                    }




                                    //var length = data.length;
                                    //for (var i = 0; i < length; i++) {
                                    //    var violation = $factory({ classes: ["Violation", "Model", "Backup", "States"], base_class: "Violation" });
                                    //    violation._model_.fromJSON(data[i]);
                                    //    violation._backup_.setup();
                                    //    violations.push(violation);
                                    //}
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
                                    var violation = $factory({ classes: ["Violation", "Model", "Backup", "States"], base_class: "Violation" });
                                    violation._model_.fromJSON(data.violation);
                                    violation.isNew = violation.happened.value > moment.unix(thursday).hours(23).minutes(59).seconds(59).unix() ? true : false;
                                    violation._backup_.setup();
                                    var user = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });
                                    user._model_.fromJSON(data.user);
                                    violation.user = user;

                                    violation.attachments = [];
                                    var length = data.attachments.length;
                                    for (var i = 0; i < length; i++) {
                                        totalAttachments++;
                                        var attachment = $factory({ classes: ["Attachment", "Model", "Backup", "States"], base_class: "Attachment" });
                                        attachment._model_.fromJSON(data.attachments[i]);
                                        violation.newAttachments += attachment.added.value > moment.unix(thursday).hours(23).minutes(59).seconds(59).unix() ? 1 : 0;
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
                                isConfirmed: currentViolation.isConfirmed.value === true ? 1: 0
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
                        violationId: "",
                        startDate: 0,
                        endDate: 0,
                        eskGroupId: 0,

                        enabled: function (flag) {
                            if (flag !== undefined)
                                isFilterEnabled = flag;
                            return isFilterEnabled;
                        },

                        isIdSent: function (flag) {
                            if (flag !== undefined)
                                isViolationIdSent = flag;
                            return isViolationIdSent;
                        },

                        cancelStartDate: function (callback) {
                            this.startDate = 0;
                            if (callback !== undefined && typeof callback === "function")
                                callback();
                            return true;
                        },

                        cancelEndDate: function (callback) {
                            this.endDate = 0;
                            if (callback !== undefined && typeof callback === "function")
                                callback();
                            return true;
                        },

                        cancelEskGroup: function (callback) {
                            this.eskGroupId = 0;
                            if (callback !== undefined && typeof callback === "function")
                                callback();
                            return true;
                        }
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
        }]);