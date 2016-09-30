"use strict";


(function () {
    angular
        .module("violations")
        .controller("NewViolationController", ["$log", "$scope", "$violations", "$factory", "$tree", "$location", "$modals", function ($log, $scope, $violations, $factory, $tree, $location, $modals) {
            $scope.violations = $violations;
            $scope.modals = $modals;
            $scope.submitted = false;
            $scope.isUploadInProgress = false;
            $scope.errors = {
                date: undefined,
                divisionId: undefined,
                eskGroupId: undefined,
                eskObject: undefined,
                description: undefined
            };
            $scope.uploaderData = {
                violationId: $violations.violations.getNew().id.value,
                divisionId: $violations.violations.getNew().divisionId.value
            };
            $scope.today = new moment().hours(23).minutes(59).seconds(59).unix();

            $scope.openSelectDivisionModal = function () {
                $modals.open("new-violation-division-modal");
            };


            $scope.selectDivision = function (division) {
                $violations.violations.getNew().divisionId.value = division.key;
                $log.log("new = ", $violations.violations.getNew());
            };

            
            $scope.gotoMain = function () {
                $location.url("/");
                if ($violations.violations.getNew().id.value !== 0) {
                    $violations.violations.cancel($violations.violations.getNew().id.value, function () {
                        $violations.attachments.getNew().splice(0, $violations.attachments.getNew().length);
                    });
                }

                if ($violations.divisions.getCurrent() !== undefined && $violations.divisions.getCurrent().id.value === 1) {
                    $violations.violations.getNew().divisionId.value = 0;
                }
            };





            $scope.add = function () {
                for (var error in $scope.errors) {
                    $scope.errors[error] = undefined;
                }

                if ($violations.violations.getNew().divisionId.value === 0)
                    $scope.errors.divisionId = "Вы не выбрали структурное подразделение";
                if ($violations.violations.getNew().eskGroupId.value === 0)
                    $scope.errors.eskGroupId = "Вы не выбрали группу ЭСК";
                if ($violations.violations.getNew().eskObject.value === "")
                    $scope.errors.eskObject = "Вы не указали объект ЭСК";
                if ($violations.violations.getNew().description.value === "")
                    $scope.errors.description = "Вы не указали описание";

                if ($scope.errors.date === undefined & $scope.errors.divisionId === undefined &&
                    $scope.errors.eskGroupId === undefined && $scope.errors.eskObject === undefined &&
                    $scope.errors.description === undefined) {
                    $violations.violations.add(function (violation) {
                        $location.url("/");
                        $violations.violations.getNew().id.value = 0;
                        $violations.violations.getNew().happened.value = new moment().unix();
                        $violations.violations.getNew().eskGroupId.value = 0;
                        $violations.violations.getNew().eskObject.value = "";
                        $violations.violations.getNew().description.value = "";
                        $violations.attachments.getNew().splice(0, $violations.attachments.getNew().length);


                        var item = $tree.getItemByKey("global-divisions-tree", violation.divisionId.value);
                        item.data.violationsAdded++;
                        item.data.violationsTotal++;
                        item.notifications.getById("violations").value += 1;
                        item.notifications.getById("violations").isVisible = item.notifications.getById("violations").value > 0 ? true : false;
                        var att = violation.attachments.length;
                        item.notifications.getById("attachments").value += att;
                        item.notifications.getById("attachments").isVisible = item.notifications.getById("atachments").value > 0 ? true : false;
                        item.data.attachmentsTotal += att;
                        item.data.attachmentsAdded += att;


                        var parent = $tree.getItemByKey("global-divisions-tree", item.parentKey);
                        while (parent) {
                            $log.log("parent found = ", parent);
                            parent.data.violationsTotal++;
                            parent.notifications.getById("violations").value += 1;
                            parent.notifications.getById("violations").isVisible = parent.notifications.getById("violations").value > 0 ? true : false;

                            parent.data.attachmentsTotal += att;
                            parent.notifications.getById("attachments").value += att;
                            parent.notifications.getById("attachments").isVisible = parent.notifications.getById("attachments").value > 0 ? true : false;

                            parent = $tree.getItemByKey("global-divisions-tree", parent.parentKey);
                        }

                        $tree.getById("global-divisions-tree").calcRoot();
                    });
                }
            };


            $scope.onBeforeUploadAttachment = function () {
                $scope.isUploadInProgress = true;
                $scope.uploaderData.violationId = $violations.violations.getNew().id.value;
            };

            $scope.onCompleteUploadAttachment = function (data) {
                $log.log("upload complete", data);
                var attachment = $factory({ classes: ["Attachment", "Model", "Backup", "States"], base_class: "Attachment" });
                attachment._model_.fromJSON(data);
                $violations.violations.addAttachmentToNew(attachment);
                $violations.attachments.add(attachment);
                $scope.isUploadInProgress = false;

                $log.log("attachment = ", attachment);

                if (attachment.violationId.value !== 0)
                    $violations.violations.getNew().id.value = attachment.violationId.value;
            };
        }]);
})();