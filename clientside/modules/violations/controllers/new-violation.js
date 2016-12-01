"use strict";


(function () {
    angular
        .module("violations")
        .controller("NewViolationController", ["$log", "$scope", "$violations", "$divisions", "$misc", "$factory", "$tree", "$location", "$modals", "$session", "$dateTimePicker", function ($log, $scope, $violations, $divisions, $misc, $factory, $tree, $location, $modals, $session, $dateTimePicker) {
            $scope.violations = $violations;
            $scope.divisions = $divisions;
            $scope.misc = $misc;
            $scope.modals = $modals;
            $scope.submitted = false;
            $scope.isUploadInProgress = false;
            $scope.errors = {
                date: undefined,
                divisionId: undefined,
                eskGroupId: undefined,
                eskObject: undefined,
                description: undefined,
                ended: undefined
            };
            $scope.uploaderData = {
                serviceId: "violations",
                violationId: $violations.getNew().id.value,
                divisionId: $violations.getNew().divisionId.value
            };
            $scope.today = new moment().hours(23).minutes(59).seconds(59).unix();
            $scope.hours = 0;
            $scope.minutes = 0;
            $scope.endHours = 0;
            $scope.endMinutes = 0;
            $scope.uploaderLink = "test";



            $scope.openSelectDivisionModal = function () {
                $modals.open("new-violation-division-modal");
            };



            /**
             * Отмена добавления нового нарушения
             */
            $scope.cancel = function () {
                $location.url("/");
                var division = $divisions.getById($violations.getNew().divisionId.value);
                var departmentId = $divisions.getDepartmentByDivisionId($violations.getNew().divisionId.value) !== undefined ? $divisions.getDepartmentByDivisionId($violations.getNew().divisionId.value).id.value : $session.getCurrentUser().divisionId.value;
                var url = division.storage.value !== "" ? division.storage.value + "/serverside/cancel.php" : "/serverside/cancel.php";

                if ($violations.getNew().id.value !== 0) {
                    $violations.cancel($violations.getNew().id.value, url, departmentId, function () {
                        $violations.attachments.getNew().splice(0, $violations.attachments.getNew().length);
                    });
                }

                if ($divisions.getCurrent() !== undefined && $divisions.getCurrent().id.value === 1) {
                    $violations.getNew().divisionId.value = 0;
                }
            };



            $scope.selectStartDate = function (date) {
                //$dateTimePicker.getById("new-violation-end-date").scope.settings.value = moment.unix(date).hours($scope.hours).minutes($scope.minutes).seconds(0).unix();
                $violations.getNew()._states_.changed(true);
                $violations.getNew().ended.value = $violations.getNew().happened.value;
                $dateTimePicker.getById("new-violation-end-date").scope.settings.minDate = $violations.getNew().happened.value;
            };


            $scope.onHoursChange = function () {
                var exp = new RegExp("^(0|[0-9]|[0-2][0-9])$");
                if (exp.test($scope.hours)) {
                    $violations.getNew().happened.value = moment.unix($violations.getNew().happened.value).hours($scope.hours).unix();
                } else {
                    $scope.hours = 0;
                    $violations.getNew().happened.value = moment.unix($violations.getNew().happened.value).hours($scope.hours).unix();
                }
                $violations.getNew()._states_.changed(true);
            };



            $scope.onMinutesChange = function () {
                var exp = new RegExp("^(0|[0-9]|[0-5][0-9])$");
                if (exp.test($scope.minutes)) {
                    $violations.getNew().happened.value = moment.unix($violations.getNew().happened.value).minutes($scope.minutes).unix();
                } else {
                    $scope.minutes = 0;
                    $violations.getNew().happened.value = moment.unix($violations.getNew().happened.value).minutes($scope.minutes).unix();
                }
                $violations.getNew()._states_.changed(true);
            };



            $scope.onEndHoursChange = function () {
                var exp = new RegExp("^(0|[0-9]|[0-2][0-9])$");
                if (exp.test($scope.endHours)) {
                    $violations.getNew().ended.value = moment.unix($violations.getNew().ended.value).hours($scope.endHours).unix();
                } else {
                    $scope.hours = 0;
                    $violations.getNew().ended.value = moment.unix($violations.getNew().ended.value).hours($scope.endHours).unix();
                }
                $violations.getNew()._states_.changed(true);
            };



            $scope.onEndMinutesChange = function () {
                var exp = new RegExp("^(0|[0-9]|[0-5][0-9])$");
                if (exp.test($scope.endMinutes)) {
                    $violations.getNew().ended.value = moment.unix($violations.getNew().ended.value).minutes($scope.endMinutes).unix();
                } else {
                    $scope.endMinutes = 0;
                    $violations.getNew().ended.value = moment.unix($violations.getNew().ended.value).minutes($scope.endMinutes).unix();
                }
                $violations.getNew()._states_.changed(true);
            };



            $scope.add = function () {
                for (var error in $scope.errors) {
                    $scope.errors[error] = undefined;
                }

                if ($violations.getNew().ended.value < $violations.getNew().happened.value)
                    $scope.errors.ended = "Дата устренения не может быть раньше времени ТН";
                if ($violations.getNew().divisionId.value === 0)
                    $scope.errors.divisionId = "Вы не выбрали структурное подразделение";
                if ($violations.getNew().eskGroupId.value === 0)
                    $scope.errors.eskGroupId = "Вы не выбрали группу ЭСК";
                if ($violations.getNew().eskObject.value === "")
                    $scope.errors.eskObject = "Вы не указали объект ЭСК";
                if ($violations.getNew().description.value === "")
                    $scope.errors.description = "Вы не указали описание";

                if ($scope.errors.date === undefined & $scope.errors.divisionId === undefined &&
                    $scope.errors.eskGroupId === undefined && $scope.errors.eskObject === undefined &&
                    $scope.errors.description === undefined && $scope.errors.ended === undefined) {
                    $violations.add(function (violation) {
                        $violations.clear();
                        $violations.getByDivisionId(violation.divisionId.value, function () {
                            $location.url("/");
                        });

                        var item = $tree.getItemByKey("session-divisions-tree", violation.divisionId.value);
                        if ($violations.getNew().happened.value >= $violations.startControlPeriod() && $violations.getNew().happened.value <= $violations.endControlPeriod()) {
                            item.data.violationsAdded++;
                            item.data.violationsTotal++;
                            item.notifications.getById("violations").value += 1;
                            item.notifications.getById("violations").isVisible = item.notifications.getById("violations").value > 0 ? true : false;
                            var att = violation.attachments.length;
                            item.notifications.getById("attachments").value += att;
                            item.notifications.getById("attachments").isVisible = item.notifications.getById("attachments").value > 0 ? true : false;
                            item.data.attachmentsTotal += att;
                            item.data.attachmentsAdded += att;

                            var parent = $tree.getItemByKey("global-divisions-tree", item.parentKey);
                            while (parent) {
                                //$log.log("parent found = ", parent);
                                parent.data.violationsTotal++;
                                parent.notifications.getById("violations").value += 1;
                                parent.notifications.getById("violations").isVisible = parent.notifications.getById("violations").value > 0 ? true : false;
                                parent.data.attachmentsTotal += att;
                                parent.notifications.getById("attachments").value += att;
                                parent.notifications.getById("attachments").isVisible = parent.notifications.getById("attachments").value > 0 ? true : false;
                                parent = $tree.getItemByKey("global-divisions-tree", parent.parentKey);
                            }
                            $tree.getById("global-divisions-tree").calcRoot();
                        }


                        var length = violation.attachments.length;
                        for (var i = 0; i < length; i++) {
                            if (violation.attachments[i].isInAddMode === true)
                                violation.attachments[i].isInAddMode = false;
                        }


                        $violations.getNew().id.value = 0;
                        $violations.getNew().happened.value = new moment().unix();
                        $violations.getNew().eskGroupId.value = 0;
                        $violations.getNew().eskObject.value = "";
                        $violations.getNew().description.value = "";
                        $violations.attachments.getNew().splice(0, $violations.attachments.getNew().length);
                    });
                }
            };



            $scope.onBeforeUploadAttachment = function () {
                //$log.info("uploader onBeforeUpload");

                $scope.isUploadInProgress = true;
                $scope.uploaderData.violationId = $violations.getNew().id.value;

                //var division = $divisions.getById($session.getCurrentUser().divisionId.value);
                var division = $divisions.getById($violations.getNew().divisionId.value);
                //$log.log("current division = ", division);
                if (division.storage.value === "") {
                    $scope.uploaderLink = "/serverside/uploader.php";
                    //$log.log("departments = ", $divisions.getDepartmentByDivisionId($violations.getNew().divisionId.value));
                    $scope.uploaderData.departmentId = $divisions.getDepartmentByDivisionId($violations.getNew().divisionId.value) !== undefined ? $divisions.getDepartmentByDivisionId($violations.getNew().divisionId.value).id.value : $session.getCurrentUser().divisionId.value;
                } else
                    $scope.uploaderLink = division.storage.value + "/upload/share";
                //$log.log("uploaderlink = ", $scope.uploaderLink);
                //$log.log("currentUserDivision = ", division);
                //$log.log("currentUserDepartment = ", $scope.uploaderData.departmentId);
            };



            $scope.onCompleteUploadAttachment = function (data) {
                //$log.log("upload complete", data);
                var attachment = $factory({ classes: ["Attachment", "Model", "Backup", "States"], base_class: "Attachment" });
                attachment._model_.fromJSON(data);
                attachment.isInAddMode = true;
                $violations.addAttachmentToNew(attachment);
                $violations.attachments.add(attachment);
                $scope.isUploadInProgress = false;
                delete $scope.uploaderData.storage;

                //$log.log("attachment = ", attachment);

                if (attachment.violationId.value !== 0)
                    $violations.getNew().id.value = attachment.violationId.value;
            };



            $scope.deleteAttachment = function (attachmentId) {
                if (attachmentId !== undefined) {
                    var division = $divisions.getById($violations.getNew().divisionId.value);
                    var departmentId = $divisions.getDepartmentByDivisionId($violations.getNew().divisionId.value) !== undefined ? $divisions.getDepartmentByDivisionId($violations.getNew().divisionId.value).id.value : $violations.getNew().divisionId.value;
                    var url = division.storage.value !== "" ? division.storage.value + "/serverside/deleteAttachment.php" : "/serverside/deleteAttachment.php";

                    $violations.attachments.delete(attachmentId, departmentId, url, function () {
                        var length = $violations.attachments.getNew().length;
                        for (var i = 0; i < length; i++) {
                            if ($violations.attachments.getNew()[i].id.value === attachmentId) {
                                $violations.attachments.getNew().splice(i, 1);
                                break;
                            }
                        }
                    });
                }
            };




        }]);
})();