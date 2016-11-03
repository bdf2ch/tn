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



        $scope.gotoMain = function () {
            $location.url("/");
            if ($violations.violations.getCurrent()._states_.changed() === true) {
                $violations.violations.getCurrent()._backup_.restore();
                $violations.violations.getCurrent()._states_.changed(false);
            }
            $violations.violations.select(parseInt($routeParams.violationId));
        };



        $scope.onBeforeUploadAttachment = function () {
            //$log.info("data = ", $scope.uploaderData);
            //$scope.uploaderData.violationId = $violations.violations.getCurrent().id.value;
            $scope.uploaderData.divisionId = $violations.violations.getCurrent().divisionId.value;
            //$scope.isUploadInProgress = true;

            $scope.isUploadInProgress = true;
            $scope.uploaderData.violationId = $violations.violations.getCurrent().id.value;

            //var division = $divisions.getById($session.getCurrentUser().divisionId.value);
            var division = $divisions.getById($violations.violations.getCurrent().divisionId.value);
            $log.log("current division = ", division);
            if (division.storage.value === "") {
                $scope.uploaderLink = "/serverside/uploader.php";
                $scope.uploaderData.departmentId = $divisions.getDepartmentByDivisionId($violations.violations.getCurrent().divisionId.value) !== undefined ? $divisions.getDepartmentByDivisionId($violations.violations.getCurrent().divisionId.value).id.value : $session.getCurrentUser().divisionId.value;
            } else
                $scope.uploaderLink = division.storage.value + "/uploader/share";
        };



        $scope.onCompleteUploadAttachment = function (data) {
            //$log.log(data);
            var attachment = $factory({ classes: ["Attachment", "Model", "Backup", "States"], base_class: "Attachment" });
            attachment._model_.fromJSON(data);
            $violations.violations.getCurrent().attachments.push(attachment);
            $violations.violations.getCurrent().newAttachments++;
            $violations.violations.addAttachment();
            $scope.isUploadInProgress = false;

            var tree = $tree.getById("global-divisions-tree");
            if (tree) {
                var item = $tree.getItemByKey("global-divisions-tree", $violations.violations.getCurrent().divisionId.value);
                item.data.attachmentsAdded++;
                item.data.attachmentsTotal++;
                item.notifications.getById("attachments").value += 1;
                item.notifications.getById("attachments").isVisible = item.notifications.getById("attachments").value > 0 ? true : false;

                var prev = item;
                var parent = $tree.getItemByKey("global-divisions-tree", item.parentKey);
                while (parent) {
                    //$log.log("parent found = ", parent);
                    parent.data.attachmentsTotal += 1;
                    parent.notifications.getById("attachments").value += 1;
                    parent.notifications.getById("attachments").isVisible = parent.notifications.getById("attachments").value > 0 ? true : false;
                    prev = parent;
                    parent = $tree.getItemByKey("global-divisions-tree", parent.parentKey);
                }

                tree.calcRoot();
            }
        };


        
        $scope.save = function () {
            var temp = $violations.violations.getCurrent();

            $scope.errors.eskGroupId = undefined;
            $scope.errors.eskObject = undefined;
            $scope.errors.description = undefined;

            if (temp.eskGroupId.value === 0)
                $scope.errors.eskGroupId = "Вы не выбрали группу ЭСК";
            if (temp.eskObject.value === "")
                $scope.errors.eskObject = "Вы не указали объект ЭСК";
            if (temp.description.value === "")
                $scope.errors.description = "Вы не указали описание";

            if ($scope.errors.eskGroupId === undefined && $scope.errors.eskObject === undefined && $scope.errors.description === undefined) {
                $scope.inProgress = true;
                $violations.violations.edit(function () {
                    $scope.inProgress = false;
                    $violations.violations.getCurrent()._states_.changed(false);
                    $violations.violations.getCurrent()._backup_.setup();
                });
            }

        };
    }]);