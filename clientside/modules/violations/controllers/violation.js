angular
    .module("violations")
    .controller("ViolationController", ["$log", "$scope", "$routeParams", "$location", "$violations", "$divisions", "$misc", "$factory", "$tree", "$session", "violation", '$modals', function ($log, $scope, $routeParams, $location, $violations, $divisions, $misc, $factory, $tree, $session, violation, $modals) {
        $scope.violations = $violations;
        $scope.divisions = $divisions;
        $scope.misc = $misc;
        $scope.modals = $modals;
        $scope.session = $session;
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
        $scope.endHours = moment.unix(violation.ended.value).hours();
        $scope.endMinutes = moment.unix(violation.ended.value).minutes();
        $scope.currentAttachmentId = 0;
        $scope.inCarouselMode = false;
        $scope.currentImageIndex = 0;



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
            var length = data.length;
            for (var i = 0; i < length; i++) {
                var attachment = $factory({ classes: ["Attachment", "Model", "Backup", "States"], base_class: "Attachment" });
                attachment._model_.fromJSON(data[i]);
                attachment.isInAddMode = true;
                $violations.getCurrent().attachments.push(attachment);
                $violations.addAttachment();
            }
            $violations.getCurrent().newAttachments += length;
           // var attachment = $factory({ classes: ["Attachment", "Model", "Backup", "States"], base_class: "Attachment" });
            //attachment._model_.fromJSON(data);
            //attachment.isInAddMode = true;
            //$violations.getCurrent().attachments.push(attachment);
            //$violations.getCurrent().newAttachments++;
            //$violations.addAttachment();
            $scope.isUploadInProgress = false;

            var tree = $tree.getById("global-divisions-tree");
            if (tree) {
                var item = $tree.getItemByKey("global-divisions-tree", $violations.getCurrent().divisionId.value);
                item.data.attachmentsAdded += length;
                item.data.attachmentsTotal += length;
                item.notifications.getById("attachments").value += length;
                item.notifications.getById("attachments").isVisible = item.notifications.getById("attachments").value > 0 ? true : false;

                var prev = item;
                var parent = $tree.getItemByKey("global-divisions-tree", item.parentKey);
                while (parent) {
                    parent.data.attachmentsTotal += length;
                    parent.notifications.getById("attachments").value += length;
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
                    $violations.getCurrent().newAttachments--;


                    var tree = $tree.getById("global-divisions-tree");
                    if (tree) {
                        var item = $tree.getItemByKey("global-divisions-tree", $violations.getCurrent().divisionId.value);
                        item.data.attachmentsAdded--;
                        item.data.attachmentsTotal--;
                        item.notifications.getById("attachments").value -= 1;
                        item.notifications.getById("attachments").isVisible = item.notifications.getById("attachments").value > 0 ? true : false;

                        var prev = item;
                        var parent = $tree.getItemByKey("global-divisions-tree", item.parentKey);
                        while (parent) {
                            parent.data.attachmentsTotal -= 1;
                            parent.notifications.getById("attachments").value -= 1;
                            parent.notifications.getById("attachments").isVisible = parent.notifications.getById("attachments").value > 0 ? true : false;
                            prev = parent;
                            parent = $tree.getItemByKey("global-divisions-tree", parent.parentKey);
                        }

                        tree.calcRoot();
                    }
                });
            }
        };



        $scope.save = function () {
            for (var error in $scope.errors) {
                $scope.errors[error] = undefined;
            }

            if ($violations.getCurrent().ended.value < $violations.getCurrent().happened.value && $violations.getCurrent().isNotFixed.value === false)
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


        $scope.openDeleteModal = function () {
            $modals.open("delete-violation-modal");
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


        /**
         * Отмена добавления нового нарушения
         */
        $scope.delete = function () {
            var division = $divisions.getById($violations.getCurrent().divisionId.value);
            var departmentId = $divisions.getDepartmentByDivisionId($violations.getCurrent().divisionId.value) !== undefined ? $divisions.getDepartmentByDivisionId($violations.getCurrent().divisionId.value).id.value : $session.getCurrentUser().divisionId.value;
            var url = division.storage.value !== "" ? division.storage.value + "/serverside/cancel.php" : "/serverside/cancel.php";

            $log.log($violations.getCurrent());

            $violations.cancel($violations.getCurrent().id.value, url, departmentId, function () {
                $modals.close();
                $location.url("/");
                var length = $violations.getAll().length;
                for (var i = 0; i < length; i++) {
                    if ($violations.getAll()[i].id.value === $violations.getCurrent().id.value) {
                        $violations.getAll().splice(i, 1);
                        break;
                    }
                }

                var item = $tree.getItemByKey("session-divisions-tree", violation.divisionId.value);
                if ($violations.getCurrent().happened.value >= $violations.startControlPeriod() && $violations.getCurrent().happened.value <= $violations.endControlPeriod()) {
                    item.data.violationsAdded--;
                    item.data.violationsTotal--;
                    item.notifications.getById("violations").value -= 1;
                    item.notifications.getById("violations").isVisible = item.notifications.getById("violations").value > 0 ? true : false;
                    var att = violation.attachments.length;
                    item.notifications.getById("attachments").value -= att;
                    item.notifications.getById("attachments").isVisible = item.notifications.getById("attachments").value > 0 ? true : false;
                    item.data.attachmentsTotal -= att;
                    item.data.attachmentsAdded -= att;

                    var parent = $tree.getItemByKey("global-divisions-tree", item.parentKey);
                    while (parent) {
                        //$log.log("parent found = ", parent);
                        parent.data.violationsTotal--;
                        parent.notifications.getById("violations").value -= 1;
                        parent.notifications.getById("violations").isVisible = parent.notifications.getById("violations").value > 0 ? true : false;
                        parent.data.attachmentsTotal -= att;
                        parent.notifications.getById("attachments").value -= att;
                        parent.notifications.getById("attachments").isVisible = parent.notifications.getById("attachments").value > 0 ? true : false;
                        parent = $tree.getItemByKey("global-divisions-tree", parent.parentKey);
                    }
                    $tree.getById("global-divisions-tree").calcRoot();
                }
            });

            if ($divisions.getCurrent() !== undefined && $divisions.getCurrent().id.value === 1) {
                $violations.getNew().divisionId.value = 0;
            }
        };



        $scope.openDeleteAttachmentModal = function (attachmentId) {
            $scope.currentAttachmentId = attachmentId;
            $log.log('current attachemnt id', $scope.currentAttachmentId);
            $modals.open('delete-attachment-modal');
        };


        $scope.approveDeleteAttachment = function () {
            $scope.deleteAttachment($scope.currentAttachmentId);
            $modals.close();
        };


        $scope.setViolationFixed = function () {
            if ($scope.violations.getCurrent().isNotFixed.value === true) {
                $scope.violations.getCurrent().ended.value = 0;
            } else {
                $scope.violations.getCurrent().ended.value = $scope.violations.getCurrent().happened.value;
                $scope.endHours = moment.unix($violations.getCurrent().ended.value).hours();
                $scope.endMinutes = moment.unix($violations.getCurrent().ended.value).minutes();
            }
        };



        $scope.openCarousel = function (attachmentId) {
            var length = $scope.images.length;
            for (var i = 0; i < length; i++) {
                if ($scope.images[i].id.value === attachmentId)
                    $scope.currentImageIndex = i;
            }
            $scope.inCarouselMode = true;
        };


        $scope.closeCarousel = function () {
            $scope.inCarouselMode = false;
        };


        $scope.nextImage = function () {
            $scope.currentImageIndex = $scope.currentImageIndex >= $scope.images.length - 1 ? 0 : $scope.currentImageIndex + 1;
        };


        $scope.prevImage = function () {
            $scope.currentImageIndex = $scope.currentImageIndex <= 0 ? $scope.images.length - 1 : $scope.currentImageIndex - 1;
        };



        $scope.onTimeChange = function () {
            $violations.getCurrent()._states_.changed(true)
        };
    }]);