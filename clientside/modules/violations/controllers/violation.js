angular
    .module("violations")
    .controller("ViolationController", ["$log", "$scope", "$routeParams", "$location", "$violations", "$divisions", "$misc", "$factory", "$tree", "$session", function ($log, $scope, $routeParams, $location, $violations, $divisions, $misc, $factory, $tree, $session) {
        $scope.violations = $violations;
        $scope.divisions = $divisions;
        $scope.misc = $misc;
        $scope.session = $session;
        $scope.violation = undefined;
        $scope.uploaderData = {
            serviceId: "violations",
            violationId: 0,
            divisionId: 0
        };
        $scope.errors = {

            eskGroupId: undefined,
            eskObject: undefined,
            description: undefined
        };
        $scope.isUploadInProgress = false;
        $scope.uploaderLink = "test";
        $scope.endHours = moment.unix($violations.getCurrent().ended.value).hours();
        $scope.endMinutes = moment.unix($violations.getCurrent().ended.value).minutes();



        /**
         * Возврат в на главный экран к списку ТН
         */
        $scope.gotoMain = function () {
            $location.url("/");

            /*** Отменяем возможность удаления добавленных файлов в выбранном ТН ***/
            var length = $violations.getCurrent().attachments.length;
            for (var i = 0; i < length; i++) {
                if ($violations.getCurrent().attachments[i].isInAddMode === true)
                    $violations.getCurrent().attachments[i].isInAddMode = false;
            }

            /*** Если ТН было изменено - отменяем изменения ***/
            if ($violations.getCurrent()._states_.changed() === true) {
                $violations.getCurrent()._backup_.restore();
                $violations.getCurrent()._states_.changed(false);
            }
            $violations.select(parseInt($routeParams.violationId));
        };



        $scope.onBeforeUploadAttachment = function () {
            $scope.uploaderData.divisionId = $violations.getCurrent().divisionId.value;
            $violations.getCurrent().isInAddAttachmentMode = true;
            $scope.isUploadInProgress = true;
            $scope.uploaderData.violationId = $violations.getCurrent().id.value;

            //var division = $divisions.getById($session.getCurrentUser().divisionId.value);
            var division = $divisions.getById($violations.getCurrent().divisionId.value);
            //$log.log("current division = ", division);
            if (division.storage.value === "") {
                $scope.uploaderLink = "/serverside/uploader.php";
                $scope.uploaderData.departmentId = $divisions.getDepartmentByDivisionId($violations.getCurrent().divisionId.value) !== undefined ? $divisions.getDepartmentByDivisionId($violations.getCurrent().divisionId.value).id.value : $session.getCurrentUser().divisionId.value;
            } else
                $scope.uploaderLink = division.storage.value + "/upload/share";
        };



        $scope.onCompleteUploadAttachment = function (data) {
            var attachment = $factory({ classes: ["Attachment", "Model", "Backup", "States"], base_class: "Attachment" });
            attachment._model_.fromJSON(data);
            attachment.isInAddMode = true;
            $violations.getCurrent().attachments.push(attachment);
            $violations.getCurrent().newAttachments++;
            $violations.addAttachment();
            $scope.isUploadInProgress = false;

            var tree = $tree.getById("global-divisions-tree");
            if (tree) {
                var item = $tree.getItemByKey("global-divisions-tree", $violations.getCurrent().divisionId.value);
                item.data.attachmentsAdded++;
                item.data.attachmentsTotal++;
                item.notifications.getById("attachments").value += 1;
                item.notifications.getById("attachments").isVisible = item.notifications.getById("attachments").value > 0 ? true : false;

                var prev = item;
                var parent = $tree.getItemByKey("global-divisions-tree", item.parentKey);
                while (parent) {
                    parent.data.attachmentsTotal += 1;
                    parent.notifications.getById("attachments").value += 1;
                    parent.notifications.getById("attachments").isVisible = parent.notifications.getById("attachments").value > 0 ? true : false;
                    prev = parent;
                    parent = $tree.getItemByKey("global-divisions-tree", parent.parentKey);
                }

                tree.calcRoot();
            }
        };



        $scope.deleteAttachment = function (attachmentId) {
            if (attachmentId !== undefined) {
                var division = $divisions.getById($violations.getCurrent().divisionId.value);
                var departmentId = $divisions.getDepartmentByDivisionId($violations.getCurrent().divisionId.value) !== undefined ? $divisions.getDepartmentByDivisionId($violations.getCurrent().divisionId.value).id.value : $violations.getCurrent().divisionId.value;
                var url = division.storage.value !== "" ? division.storage.value + "/serverside/deleteAttachment.php" : "/serverside/deleteAttachment.php";

                $violations.attachments.delete(attachmentId, departmentId, url, function () {
                    var length = $violations.getCurrent().attachments.length;
                    for (var i = 0; i < length; i++) {
                        if ($violations.getCurrent().attachments[i].id.value === attachmentId) {
                            $violations.getCurrent().attachments.splice(i, 1);
                            break;
                        }
                    }
                });
            }
        };



        $scope.save = function () {
            for (var error in $scope.errors) {
                $scope.errors[error] = undefined;
            }

            if ($violations.getCurrent().ended.value < $violations.getCurrent().happened.value)
                $scope.errors.ended = "Дата устренения не может быть раньше времени ТН";
            if ($violations.getCurrent().eskGroupId.value === 0)
                $scope.errors.eskGroupId = "Вы не выбрали группу ЭСК";
            if ($violations.getCurrent().eskObject.value === "")
                $scope.errors.eskObject = "Вы не указали объект ЭСК";
            if ($violations.getCurrent().description.value === "")
                $scope.errors.description = "Вы не указали описание";

            if ($scope.errors.eskGroupId === undefined && $scope.errors.eskObject === undefined && $scope.errors.description === undefined && $scope.errors.ended === undefined) {
                $scope.inProgress = true;
                $violations.edit(function () {
                    $scope.inProgress = false;
                    $violations.getCurrent()._states_.changed(false);
                    $violations.getCurrent()._backup_.setup();
                });
            }

        };


        $scope.selectEndDate = function () {
            $violations.getCurrent()._states_.changed(true);
        };


        $scope.onEndHoursChange = function () {
            $violations.getCurrent()._states_.changed(true);
            var exp = new RegExp("^(0|[0-9]|[0-2][0-9])$");
            if (exp.test($scope.endHours)) {
                $violations.getCurrent().ended.value = moment.unix($violations.getCurrent().ended.value).hours($scope.endHours).unix();
            } else {
                $scope.endHours = 0;
                $violations.getCurrent().ended.value = moment.unix($violations.getCurrent().ended.value).hours($scope.endHours).unix();
            }
        };



        $scope.onEndMinutesChange = function () {
            $violations.getCurrent()._states_.changed(true);
            var exp = new RegExp("^(0|[0-9]|[0-5][0-9])$");
            if (exp.test($scope.endMinutes)) {
                $violations.getCurrent().ended.value = moment.unix($violations.getCurrent().ended.value).minutes($scope.endMinutes).unix();
            } else {
                $scope.endMinutes = 0;
                $violations.getCurrent().ended.value = moment.unix($violations.getCurrent().ended.value).minutes($scope.endMinutes).unix();
            }
        };
    }]);