angular.module("violations", [])
    .run(["$log", "$divisions", "$violations", "$session", "$users", "$navigation", function ($log, $divisions, $violations, $session, $users, $navigation) {
        $log.log("violations module run...");

        $session.init(window.initialData);
        $users.users.init(window.initialData.users);
        $divisions.init(window.initialData.divisions);
        $violations.init();
        $violations.violations.getNew().userId.value = $session.getCurrentUser().id.value;
        //$violations.violations.startDate = new moment().unix();


        $navigation.add({
            id: "violations",
            url: "/",
            icon: "fa fa-bolt",
            title: "Нарушения",
            order: 1
        });



        $navigation.add({
            id: "users",
            url: "/users/",
            icon: "fa fa-user",
            title: "Пользователи",
            order: 3,
            isVisible: $session.getCurrentUser().isAdministrator.value === true ? true : false
        });


        $navigation.add({
            id: "user",
            parentId: "users",
            url: "/user/",
            icon: "fa fa-user",
            title: "",
            isVisible: false
        });

        $navigation.add({
            id: "divisions",
            url: "/divisions/",
            icon: "fa fa-building",
            title: "Стр. подразделения",
            order: 2,
            isVisible: $session.getCurrentUser().isAdministrator.value === true ? true : false
        });

        $navigation.add({
            id: "help",
            url: "/help/",
            icon: "fa fa-info",
            title: "Помощь",
            order: 4,
            isVisible: true
        });
        
    }]);
$classesInjector
    .add("Attachment", {
        _dependencies__: [],
        violationId: new Field({ source: "VIOLATION_ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        title: new Field({ source: "TITLE", type: DATA_TYPE_STRING, default_value: "", value: "", backupable: true, displayable: true }),
        type: new Field({ source: "MIME_TYPE", type: DATA_TYPE_STRING, default_value: "", value: "", backupable: true, displayable: true }),
        size: new Field({ source: "SIZE", type: DATA_TYPE_INTEGER, default_value: 0, value: 0, backupable: true, displayable: true }),
        url: new Field({ source: "URL", type: DATA_TYPE_STRING, default_value: "", value: "", backupable: true, displayable: true }),
        added: new Field({ source: "DATE_ADDED", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 })
    });

$classesInjector
    .add("Division", {
        id: new Field({ source: "ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        parentId: new Field({ source: "PARENT_ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0, bacupable: true }),
        sortId: new Field({ source: "SORT_ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        shortTitle: new Field({ source: "TITLE_SHORT", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        fullTitle: new Field({ source: "TITLE_FULL", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        violationsAdded: new Field({ source: "VIOLATIONS_ADDED", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        attachmentsAdded: new Field({ source: "ATTACHMENTS_ADDED", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        storage: new Field({ source: "FILE_STORAGE_HOST", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        isDepartment: new Field({ source: "IS_DEPARTMENT", type: DATA_TYPE_BOOLEAN, value: false, default_value: false, backupable: true }),
        path: new Field({ source: "PATH", type: DATA_TYPE_STRING, value: "", default_value: "" })
    });

$classesInjector
    .add("ESKGroup", {
        id: new Field({ source: "ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        title: new Field({ source: "TITLE", type: DATA_TYPE_STRING, value: "", default_value: "" }),
        description: new Field({ source: "DESCRIPTION", type: DATA_TYPE_STRING, value: "", default_value: "" })
    });
$classesInjector
    .add("Violation", {
        id: new Field({ source: "ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        userId: new Field({ source: "USER_ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        divisionId: new Field({ source: "DIVISION_ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0, backupable: true }),
        eskGroupId: new Field({ source: "ESK_GROUP_ID", type: DATA_TYPE_INTEGER, value: 0, default_value: 0, backupable: true }),
        eskObject: new Field({ source: "ESK_OBJECT", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        happened: new Field({ source: "DATE_HAPPENED", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        added: new Field({ source: "DATE_ADDED", type: DATA_TYPE_INTEGER, value: 0, default_value: 0 }),
        description: new Field({ source: "DESCRIPTION", type: DATA_TYPE_STRING, value: "", default_value: "", backupable: true }),
        isConfirmed: new Field({ source: "IS_CONFIRMED", type: DATA_TYPE_BOOLEAN, value: false, default_value: false, backupable: true }),
        user: 0,
        attachments: [],
        isNew: false,
        newAttachments: 0
    });
angular
    .module("violations")
    .controller("DivisionsController", ["$log", "$scope", "$divisions", "$violations", "$tree", "$modals", function ($log, $scope, $divisions, $violations, $tree, $modals) {
        $scope.divisions = $divisions;
        $scope.violations = $violations;
        $scope.modals = $modals;
        $scope.errors = {
            fullTitle: undefined,
            shortTitle: undefined
        };


        $scope.openNewDivisionModal = function () {
            $modals.open("new-division-modal");
        };


        $scope.cancelAddDivision = function () {
            $divisions.getNew()._backup_.restore();
            for (var index in $scope.errors) {
                $scope.errors[index] = undefined;
            }
        };


        $scope.add = function () {
            for (var index in $scope.errors) {
                $scope.errors[index] = undefined;
            }

            if ($divisions.getNew().shortTitle.value === "")
                $scope.errors.shortTitle = "Вы не указали краткое наименование";

            if ($divisions.getNew().fullTitle.value === "")
                $scope.errors.fullTitle = "Вы не указали полное наименование";

            if ($scope.errors.fullTitle == undefined && $scope.errors.shortTitle === undefined) {
                $divisions.add(function (division) {
                    $modals.close();
                    $tree.addItem({
                        treeId: "divisions-tree",
                        key: division.id.value,
                        parentKey: division.parentId.value,
                        display: division.shortTitle.value
                    });
                });
            }
        };


        $scope.openEditDivisionModal = function () {
            $modals.open("edit-division-modal");
        };


        $scope.cancelEditDivision = function () {
            for (var index in $scope.errors) {
                $scope.errors[index] = undefined;
            }
            $divisions.getCurrent()._backup_.restore();
            $divisions.getCurrent()._states_.changed(false);
        };


        $scope.save = function () {
            for (var index in $scope.errors) {
                $scope.errors[index] = undefined;
            }

            if ($divisions.getCurrent().shortTitle.value === "")
                $scope.errors.shortTitle = "Вы не указали краткое наименование";

            if ($divisions.getCurrent().fullTitle.value === "")
                $scope.errors.fullTitle = "Вы не указали полное наименование";

            if ($scope.errors.fullTitle == undefined && $scope.errors.shortTitle === undefined) {
                $divisions.edit(function (division) {
                    $modals.close();
                    $tree.getItemByKey("divisions-tree", division.id.value).display = division.shortTitle.value;
                });
            }
        };


        if (!$tree.getById("divisions-tree")) {
            $log.log("NO TREE");
            var divisionsTree = $tree.register({
                id: "divisions-tree",
                rootKey: 0,
                expandOnSelect: true,
                collapseOnDeselect: true,
                onSelect: function (division) {
                    if (division.isSelected === true) {
                        $divisions.select(division.key);
                        $log.log("current divivison  = ", $divisions.getCurrent());
                        $divisions.getNew().parentId.value = division.key;
                    } else
                        $divisions.getNew().parentId.value = 0;
                }
            });


            var length = $divisions.getAll().length;
            for (var i = 0; i < length; i++) {
                var division = $divisions.getAll()[i];
                var item = $tree.addItem({
                    treeId: "divisions-tree",
                    key: division.id.value,
                    parentKey: division.parentId.value,
                    display: division.shortTitle.value,
                    order: division.sortId.value
                });
                if (division.id.value === 1) {
                    item.isExpanded = true;
                }
            }
        }
    }]);

angular
    .module("violations")
    .controller("HeaderController", ["$log", "$scope", "$session", "$navigation", "$window", function ($log, $scope, $session, $navigation, $window) {
        $scope.session = $session;
        $scope.navigation = $navigation;


        $scope.logout = function () {
            $session.logout(function () {
                $window.location.reload(true);
            });
        };
    }]);
angular
    .module("violations")
    .controller("HelpController", ["$scope", "$session", function ($scope, $session) {
        $scope.session = $session;
    }]);

angular
    .module("violations")
    .controller("NewUserController", ["$log", "$scope", "$http", "$location", "$users", "$violations", "$modals", "$tree", function ($log, $scope, $http, $location, $users, $violations, $modals, $tree) {
        $scope.users = $users;
        $scope.violations = $violations;
        $scope.modals = $modals;
        $scope.errors = {
            surname: undefined,
            name: undefined,
            fname: undefined,
            divisionId: undefined,
            email: undefined,
            login: undefined,
            password: undefined
        };



        if (!$tree.getById("new-user-tree")) {
            var newUserTree = $tree.register({
                id: "new-user-tree",
                rootKey: 0,
                expandOnSelect: true,
                collapseOnDeselect: true
            });

            newUserTree.onSelect = function (item) {
                $log.log("selected division = ", item);
                $scope.selectDivision(item);
            };


            var length = $violations.divisions.getAll().length;
            for (var i = 0; i < length; i++) {
                var division = $violations.divisions.getAll()[i];
                var item = $tree.addItem({
                    treeId: "new-user-tree",
                    key: division.id.value,
                    parentKey: division.parentId.value,
                    display: division.shortTitle.value,
                    order: division.sortId.value
                });
                if (division.id.value === 1) {
                    item.isExpanded = true;
                }
            }
        }



        $scope.selectDivision = function (division) {
            $users.users.getNew().divisionId.value = division.key;
        };



        $scope.openSelectDivisionModal = function () {
            $modals.open("new-user-division-modal");
        };


        $scope.cancel = function () {
            $location.url("/users");
            $users.users.getNew().divisionId.value = 0;
            $users.users.getNew().surname.value = "";
            $users.users.getNew().name.value = "";
            $users.users.getNew().fname.value = "";
            $users.users.getNew().email.value = "";
            $users.users.getNew().login.value = "";
            $users.users.getNew().password.value = "";
            $users.users.getNew().isAdministrator.value = false;
            $users.users.getNew().allowEdit.value = false;
            $users.users.getNew().allowConfirm.value = false;
        };


        $scope.add = function () {
            for (var index in $scope.errors) {
                $scope.errors[index] = undefined;
            }

            if ($users.users.getNew().divisionId.value === 0)
                $scope.errors.divisionId = "Вы не выбрали структурное подразделение";
            if ($users.users.getNew().surname.value === "")
                $scope.errors.surname = "Вы не указали фамилию";
            if ($users.users.getNew().name.value === "")
                $scope.errors.name = "Вы не указали имя";
            if ($users.users.getNew().fname.value === "")
                $scope.errors.fname = "Вы не указали отчество";
            if ($users.users.getNew().email.value === "")
                $scope.errors.email = "Вы не указали e-mail";
            if ($users.users.getNew().login.value === "")
                $scope.errors.login = "Вы не указали учетную запись в AD";
            if ($users.users.getNew().password.value === "")
                $scope.errors.password = "Вы не указали пароль";

            if ($scope.errors.divisionId === undefined && $scope.errors.surname === undefined &&
                $scope.errors.name === undefined && $scope.errors.fname === undefined &&
                $scope.errors.email === undefined && $scope.errors.login === undefined && $scope.errors.password === undefined) {
                $users.users.add(function () {
                    $location.url("/users");
                    $users.users.getNew()._backup_.restore();
                });
            }
        };

    }]);
"use strict";


(function () {
    angular
        .module("violations")
        .controller("NewViolationController", ["$log", "$scope", "$violations", "$divisions", "$factory", "$tree", "$location", "$modals", "$session", function ($log, $scope, $violations, $divisions, $factory, $tree, $location, $modals, $session) {
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
                serviceId: "violations",
                violationId: $violations.violations.getNew().id.value,
                divisionId: $violations.violations.getNew().divisionId.value
            };
            $scope.today = new moment().hours(23).minutes(59).seconds(59).unix();
            $scope.hours = 0;
            $scope.minutes = 0;
            $scope.uploaderLink = "/serverside/uploader.php";



            $scope.openSelectDivisionModal = function () {
                $modals.open("new-violation-division-modal");
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



            $scope.onHoursChange = function () {
                var exp = new RegExp("^(0|[0-9]|[0-2][0-9])$");
                if (exp.test($scope.hours)) {
                    $violations.violations.getNew().happened.value = moment.unix($violations.violations.getNew().happened.value).hours($scope.hours).unix();
                } else {
                    $scope.hours = 0;
                    $violations.violations.getNew().happened.value = moment.unix($violations.violations.getNew().happened.value).hours($scope.hours).unix();
                }
            };



            $scope.onMinutesChange = function () {
                var exp = new RegExp("^(0|[0-9]|[0-5][0-9])$");
                if (exp.test($scope.minutes)) {
                    $violations.violations.getNew().happened.value = moment.unix($violations.violations.getNew().happened.value).minutes($scope.minutes).unix();
                } else {
                    $scope.minutes = 0;
                    $violations.violations.getNew().happened.value = moment.unix($violations.violations.getNew().happened.value).minutes($scope.minutes).unix();
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
                        $violations.violations.getByDivisionId(violation.divisionId.value, function () {
                            $location.url("/");
                        });

                        $violations.violations.getNew().id.value = 0;
                        $violations.violations.getNew().happened.value = new moment().unix();
                        $violations.violations.getNew().eskGroupId.value = 0;
                        $violations.violations.getNew().eskObject.value = "";
                        $violations.violations.getNew().description.value = "";
                        $violations.attachments.getNew().splice(0, $violations.attachments.getNew().length);

                        var item = $tree.getItemByKey("session-divisions-tree", violation.divisionId.value);
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

                var division = $divisions.getById($session.getCurrentUser().divisionId.value);
                $log.log("current division = ", division);
                if (division.storage.value === "") {
                    $scope.uploaderLink = "/serverside/uploader.php";
                    $scope.uploaderData.departmentId = $divisions.getDepartmentByDivisionId($session.getCurrentUser().divisionId.value) !== undefined ? $divisions.getDepartmentByDivisionId($session.getCurrentUser().divisionId.value).id.value : $session.getCurrentUser().divisionId.value;
                } else
                    $scope.uploaderLink = division.storage.value + "/uploader/share";
                $log.log("uploaderlink = ", $scope.uploaderLink);
                $log.log("currentUserDivision = ", division);
                $log.log("currentUserDepartment = ", $scope.uploaderData.departmentId);
            };

            $scope.onCompleteUploadAttachment = function (data) {
                $log.log("upload complete", data);
                var attachment = $factory({ classes: ["Attachment", "Model", "Backup", "States"], base_class: "Attachment" });
                attachment._model_.fromJSON(data);
                $violations.violations.addAttachmentToNew(attachment);
                $violations.attachments.add(attachment);
                $scope.isUploadInProgress = false;
                delete $scope.uploaderData.storage;

                $log.log("attachment = ", attachment);

                if (attachment.violationId.value !== 0)
                    $violations.violations.getNew().id.value = attachment.violationId.value;
            };
        }]);
})();
angular
    .module("violations")
    .controller("UserController", ["$log", "$scope", "$location", "$users", "$violations", "$tree", "$modals", function ($log, $scope, $location, $users, $violations, $tree, $modals) {
        $scope.users = $users;
        $scope.violations = $violations;
        $scope.modals = $modals;
        $scope.errors = {
            divisionId: undefined,
            surname: undefined,
            name: undefined,
            fname: undefined,
            email: undefined,
            login: undefined,
            password: undefined
        };



        $scope.openSelectDivisionModal = function () {
            $modals.open("current-user-division-modal");
        };



        $scope.selectDivision = function (division) {
            $users.users.getCurrent().divisionId.value = division.key;
            $users.users.getCurrent()._states_.changed(true);
        };



        if (!$tree.getById("current-user-tree")) {
            var currentUserTree = $tree.register({
                id: "current-user-tree",
                rootKey: 0,
                expandOnSelect: true,
                collapseOnDeselect: true
            });

            currentUserTree.onSelect = function (item) {
                $log.log("selected division = ", item);
                $scope.selectDivision(item);
            };


            var length = $violations.divisions.getAll().length;
            for (var i = 0; i < length; i++) {
                var division = $violations.divisions.getAll()[i];
                var item = $tree.addItem({
                    treeId: "current-user-tree",
                    key: division.id.value,
                    parentKey: division.parentId.value,
                    display: division.shortTitle.value,
                    order: division.sortId.value
                });
                if (division.id.value === 1) {
                    item.isExpanded = true;
                }
            }
        }



        $scope.gotoUsers = function () {
            $location.url("/users");
            $users.users.getCurrent()._backup_.restore();
            $users.users.getCurrent()._states_.changed(false);
        };



        $scope.save = function () {
            for (var index in $scope.errors) {
                $scope.errors[index] = undefined;
            }

            if ($users.users.getCurrent().divisionId.value === 0)
                $scope.errors = "Вы не выбрали струтурное подразделение";
            if ($users.users.getCurrent().surname.value === "")
                $scope.errors.surname = "Вы не указали фамилию";
            if ($users.users.getCurrent().name.value === "")
                $scope.errors.name = "Вы не указали имя";
            if ($users.users.getCurrent().fname.value === "")
                $scope.errors.fname = "Вы не указали отчество";
            if ($users.users.getCurrent().email.value === "")
                $scope.errors.email = "Вы не указали e-mail";
            if ($users.users.getCurrent().login.value === "")
                $scope.errors.login = "Вы не указали учетную запись в AD";
            if ($users.users.getCurrent().password.value === "")
                $scope.errors.password = "Вы не указали пароль";

            if ($scope.errors.divisionId === undefined && $scope.errors.surname === undefined &&
                $scope.errors.name === undefined && $scope.errors.fname === undefined &&
                $scope.errors.email === undefined && $scope.errors.login === undefined && $scope.errors.password === undefined) {
                $users.users.edit(function () {

                });
            }
        };
    }]);
angular
    .module("violations")
    .controller("UsersController", ["$log", "$scope", "$location", "$users", "$violations", function ($log, $scope, $location, $users, $violations) {
        $scope.users = $users;
        $scope.violations = $violations;


        $scope.gotoNewUser = function () {
            $location.url("/new-user");
        };


        $scope.selectUser = function (user) {
            $users.users.select(user.id.value, function () {
                $location.url("/user/" + user.id.value);
            });
        };
    }]);
angular
    .module("violations")
    .controller("ViolationController", ["$log", "$scope", "$routeParams", "$location", "$violations", "$factory", "$tree", "$session", function ($log, $scope, $routeParams, $location, $violations, $factory, $tree, $session) {
        $scope.violations = $violations;
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



        $scope.gotoMain = function () {
            $location.url("/");
            if ($violations.violations.getCurrent()._states_.changed() === true) {
                $violations.violations.getCurrent()._backup_.restore();
                $violations.violations.getCurrent()._states_.changed(false);
            }
            $violations.violations.select(parseInt($routeParams.violationId));
        };



        $scope.onBeforeUploadAttachment = function () {
            $log.info("data = ", $scope.uploaderData);
            $scope.uploaderData.violationId = $violations.violations.getCurrent().id.value;
            $scope.uploaderData.divisionId = $violations.violations.getCurrent().divisionId.value;
            $scope.isUploadInProgress = true;
        };



        $scope.onCompleteUploadAttachment = function (data) {
            $log.log(data);
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
                    $log.log("parent found = ", parent);
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
angular
    .module("violations")
    .controller("ViolationsController", ["$log", "$scope", "$violations", "$location", "$tree", "$session", "$dateTimePicker", function ($log, $scope, $violations, $location, $tree, $session, $dateTimePicker) {
        $scope.violations = $violations;
        $scope.today = new moment().hours(23).minutes(59).seconds(59).unix();

        $scope.selectStartDate = function () {
            $log.log("onSelect called");
            $violations.violations.setStart(0);
            $dateTimePicker.getById("violations-end-date").scope.settings.minDate = $violations.violations.startDate;
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined)
                $violations.violations.getByDivisionId(division.key);
        };


        $scope.clearStartDate = function () {
            $violations.violations.startDate = 0;
            $violations.violations.setStart(0);
            $dateTimePicker.getById("violations-end-date").scope.settings.minDate = 0;
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined)
                $violations.violations.getByDivisionId(division.key);
        };


        $scope.selectEndDate = function () {
            $violations.violations.setStart(0);
            $violations.violations.endDate = moment.unix($violations.violations.endDate).hours(23).minutes(59).seconds(59).unix();
            $dateTimePicker.getById("violations-start-date").scope.settings.maxDate = $violations.violations.endDate;
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined)
                $violations.violations.getByDivisionId(division.key);
        };


        $scope.clearEndDate = function () {
            $violations.violations.endDate = 0;
            $violations.violations.setStart(0);
            //$dateTimePicker.getAll()[0].scope.settings.maxDate = $scope.today;
            $dateTimePicker.getById("violations-start-date").scope.settings.maxDate = $scope.today;
            var division = $tree.getById("session-divisions-tree").selectedItem;
            if (division !== undefined)
                $violations.violations.getByDivisionId(division.key);
        };


        $scope.gotoNewViolation = function () {
            $location.url("/new");
        };


        $scope.selectDivision = function (division) {
            $violations.violations.setStart(0);
            if (division.isSelected === true) {
                $violations.violations.getNew().divisionId.value = division.key;
                $violations.violations.getByDivisionId(division.key, $violations.violations.startDate, $violations.violations.endDate);
                $log.log("new = ", $violations.violations.getNew());

            }
        };


        $scope.selectViolation = function (violationId) {
            if (violationId !== undefined) {
                $violations.violations.select(violationId, function () {
                    $location.url("/violations/" + violationId);
                });
            }
        };

    }]);

angular
    .module("violations")
    .directive("structure", ["$log", "$templateCache", "$errors", "$structure", function ($log, $templateCache, $errors, $structure) {

        var template =
            "<div class='container nested'>" +
            "<div class=\"tree-item\" ng-class='{ \"with-children\": node.childrenCount > 0, \"expanded\": node.isExpanded === true && node.childrenCount > 0, \"active\": node.isSelected === true }' ng-repeat=\"node in node.children | toArray | orderBy: \'order\' track by $index\">" +
            "<div class='tree-item-content' ng-click='expand(node)'>" +
            "<div class='item-label' ng-class='{ \"active\": node.isSelected === true }' ng-click='select(node, $event)'>" +
            "<span>{{ node.display }}</span>" +
            "</div>" +
            "<div class='item-controls'>" +
            "<span class='expand fa fa-chevron-down' ng-click='expand(node)' ng-show='node.childrenCount > 0 && node.isExpanded === false'></span>" +
            "<span class='collapse fa fa-chevron-up' ng-if='node.isExpanded === true && node.childrenCount > 0' ng-click='collapse(node)'></span>" +
            "</div>" +
                "<div class='item-notifications' ng-show='node.notifications.items.length === 0'>" +
                    "<div class='notification {{ notification.class }}' ng-repeat='notification in node.notifications.items track by $index' ng-show='notification.isVisible === true'>" +
                        "<span class='fa {{ notification.icon }} notification.class' ng-show='notification.icon !== \"\"'></span>" +
                        "<span class='value'>{{ notification.value }}</span>" +
                    "</div>" +
                    "<div class='notification violation-notification' ng-show='node.data.violationsTotal > 0'>" +
                        "<span class='fa fa-bolt'></span>" +
                        "<span class='value'>{{ node.data.violationsTotal }}</span>" +
                    "</div>" +
                    "<div class='notification attachment-notification' ng-show='node.data.attachmentsTotal > 0'>" +
                        "<span class='fa fa-file'></span>" +
                        "<span class='value'>{{ node.data.attachmentsTotal }}</span>" +
                    "</div>" +
                "</div>" +
            "</div>" +
            "<div ng-show='node.isExpanded === true' ng-include=\"\'structure'\"></div>" +
            "</div>" +
            "</div>";

        return {
            restrict: "E",
            scope: {
                class: "@"
            },
            template:
                "<div class='{{ \"krypton-ui-tree \" + class }}'>" +
                    "<div class='container root'>" +
                        "<div class='tree-item' ng-class='{ \"with-children\": node.childrenCount > 0, \"expanded\": node.isExpanded === true, \"active\": node.isSelected === true }' ng-repeat='node in initial | orderBy:\"order\" track by $index' ng-init='this.nv = this.nv + node.data.violationsAdded'>" +
                            "<div class='tree-item-content' ng-click='expand(node)'>" +
                                "<div class='item-label' ng-class='{ active: node.isSelected === true }' ng-click='select(node, $event)'>" +
                                    "<span>{{ node.display }}</span>" +
                                "</div>" +
                                "<div class='item-controls'>" +
                                    "<span class='expand fa fa-chevron-down' ng-click='expand(node)' ng-show='node.children.length > 0 && node.isExpanded === false'></span>" +
                                    "<span class='collapse fa fa-chevron-up' ng-if='node.isExpanded === true' ng-click='collapse(node)'></span>" +
                                "</div>" +
                                "<div class='item-notifications' ng-show='node.notifications.items.length === 0'>" +
                                    "<div class='notification {{ notification.class }}' ng-repeat='notification in node.notifications.items track by $index' ng-show='notification.isVisible === true'>" +
                                        "<span class='fa {{ notification.icon }}' ng-show='notification.icon !== \"\"'></span>" +
                                        "<span class='value'>{{ notification.value }}</span>" +
                                    "</div>" +
                                    "<div class='notification violation-notification' ng-show='node.data.violationsTotal > 0'>" +
                                        "<span class='fa fa-bolt'></span>" +
                                        "<span class='value'>{{ node.data.violationsTotal }}</span>" +
                                    "</div>" +
                                    "<div class='notification attachment-notification' ng-show='node.data.attachmentsTotal > 0'>" +
                                        "<span class='fa fa-file'></span>" +
                                        "<span class='value'>{{ node.data.attachmentsTotal }}</span>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "<div ng-init='this.parent = this' ng-include=\"\'structure'\" ng-show='node.isExpanded === true'></div>" +
                        "</div>" +
                    "</div>" +
                "</div>",
            link: function (scope, element, attrs) {

                if (attrs.id === undefined || attrs.id === "") {
                    $errors.add(ERROR_TYPE_ENGINE, "structure directive -> Не задан параметр - идентификатор дерева");
                    return false;
                }

                if (attrs.rootKey === undefined || attrs.rootKey === "") {
                    $errors.add(ERROR_TYPE_ENGINE, "structure directive -> Не задан параметр - значение коюча корневого элемента дерева");
                    return false;
                }

                if (attrs.rootKeyDataType === undefined || attrs.rootKeyDataType === "") {
                    $errors.add(ERROR_TYPE_ENGINE, "structure directive -> Не задан параметр - тип данных коюча корневого элемента дерева");
                    return false;
                }


                var initial = scope.initial = {};
                var stack = scope.stack = {};

                var root = 0;
                switch (attrs.rootKeyDataType) {
                    case "DATA_TYPE_INTEGER":
                        if (isNaN(parseInt(attrs.rootKey))) {
                            $errors.add(ERROR_TYPE_ENGINE, "structure directive -> Значение ключа корневого элемента не соответствует типу данных коючевого элемента");
                            return false;
                        }
                        root = parseInt(attrs.rootKey);
                        break;
                    case "DATA_TYPE_FLOAT":
                        if (isNaN(parseFloat(attrs.rootKey))) {
                            $errors.add(ERROR_TYPE_ENGINE, "structure directive -> Значение ключа корневого элемента не соответствует типу данных коючевого элемента");
                            return false;
                        }
                        root = parseFloat(attrs.rootKey);
                        break;
                    case "DATA_TYPE_STRING":
                        root = attrs.rootKey.toString();
                        break;
                    default:
                        $errors.add(ERROR_TYPE_ENGINE, "structure directive -> Неверно задан тип данных корневого элемента");
                        return false;
                        break;
                }


                $log.log(attrs);


                $templateCache.put("structure", template);
                var tree = $structure.getById(attrs.id);
                if (tree !== false) {
                    scope.initial = tree.initial;
                    scope.stack = tree.stack;
                } else {
                    $structure.register({
                        id: attrs.id,
                        rootKey: root,
                        expandOnSelect: attrs.expandOnSelect !== undefined ? true : false,
                        collapseOnDeselect: attrs.collapseOnDeselect !== undefined ? true : false
                    });
                }



                scope.select = function (item, event) {
                    event.stopPropagation();
                    if (item !== undefined) {
                        if (!$structure.selectItem(attrs.id, item.key)) {
                            $errors.add(ERROR_TYPE_ENGINE, "structure directive -> '" + attrs.id + "' select: Не удалось выбрать элемент с идентификатором " + item.key);
                            return false;
                        }
                        return true;
                    }
                };



                scope.expand = function (item) {
                    if (item !== undefined) {
                        $log.log(item);
                        if (item.isExpanded == false) {
                            if (!$structure.expandItem(attrs.id, item.key)) {
                                $errors.add(ERROR_TYPE_ENGINE, "structure directive -> expand: не удвлось развернуть элемент с идентификатором " + item.key);
                                return false;
                            }
                        } else {
                            if (!$structure.collapseItem(attrs.id, item.key)) {
                                $errors.add(ERROR_TYPE_ENGINE, "structure directive -> expand: Не удалось свернуть элемент с идентификатором " + item.key);
                                return false;
                            }
                        }
                        return true;
                    }
                };

            }
        }
    }]);
angular
    .module("violations")
    .factory("$divisions", ["$log", "$http", "$factory", "$errors", "$session", "$violations", "$tree", function ($log, $http, $factory, $errors, $session, $violations, $tree) {
        var divisions = [];
        var currentDivision = undefined;
        var newDivision = $factory({ classes: ["Division",  "Model", "Backup", "States"], base_class: "Division" });
        newDivision._backup_.setup();

        return {


            /**
             * Выполняет инициализацию сервиса
             * @param source {object} - источник данных
             * @returns {boolean}
             */
            init: function (source) {
                if (source === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$divisions -> init: Не задан параметр - источник данных");
                    return false;
                }

                var tree = $tree.register({
                    id: "global-divisions-tree",
                    rootKey: 0,
                    expandOnSelect: true,
                    collapseOnDeselect: true
                    /*
                    onSelect: function (item) {
                        $log.log("selected item = ", item);
                        $violations.violations.setStart(0);
                        if (item.isSelected === true) {
                            $violations.violations.getNew().divisionId.value = item.key;
                            $violations.violations.getByDivisionId(item.key);
                            $log.log("new = ", $violations.violations.getNew());

                        }
                    }
                    */
                });


                tree.calcRoot = function () {
                    var root = $tree.getItemByKey(tree.id, 1);
                    root.data.violationsTotal = root.data.violationsAdded;
                    root.notifications.getById("violations").value = root.data.violationsAdded;
                    root.data.attachmentsTotal = root.data.attachmentsAdded;
                    root.notifications.getById("attachments").value = root.data.attachmentsAdded;
                    for (var index in root.children) {
                        var child = root.children[index];
                        root.data.violationsTotal += child.data.violationsTotal;
                        root.notifications.getById("violations").value += child.data.violationsTotal;
                        root.data.attachmentsTotal += child.data.attachmentsTotal;
                        root.notifications.getById("attachments").value += child.data.attachmentsTotal;
                    }
                    root.notifications.getById("violations").isVisible = root.notifications.getById("violations").value > 0 ? true : false;
                    root.notifications.getById("attachments").isVisible = root.notifications.getById("attachments").value > 0 ? true : false;
                };


                tree.onAddItem = function (itm) {
                    itm.data.violationsTotal = itm.data.violationsAdded;
                    itm.data.attachmentsTotal = itm.data.attachmentsAdded;

                    itm.notifications.add({
                        id: "violations",
                        icon: "fa-bolt",
                        class: "violation-notification",
                        value: 0,
                        isVisible: true
                    });
                    itm.notifications.getById("violations").value = itm.data.violationsAdded;

                    itm.notifications.add({
                        id: "attachments",
                        icon: "fa-file",
                        class: "attachment-notification",
                        value: 0,
                        isVisible: true
                    });
                    itm.notifications.getById("attachments").value = itm.data.attachmentsAdded;

                    var prev = itm;
                    var parent = $tree.getItemByKey("global-divisions-tree", itm.parentKey);
                    while (parent) {
                        if (itm.data.violationsAdded > 0) {
                            parent.data.violationsTotal += itm.data.violationsAdded;
                            parent.notifications.getById("violations").value += itm.data.violationsAdded;
                            parent.notifications.getById("violations").isVisible = parent.notifications.getById("violations").value > 0 ? true : false;
                        }
                        if (itm.data.attachmentsAdded > 0) {
                            parent.data.attachmentsTotal += itm.data.attachmentsAdded;
                            parent.notifications.getById("attachments").value += itm.data.attachmentsAdded;
                            parent.notifications.getById("attachments").isVisible = parent.notifications.getById("attachments").value > 0 ? true : false;
                        }
                        prev = parent;
                        parent = $tree.getItemByKey("global-divisions-tree", parent.parentKey);
                    }
                };

                var length = source.length;
                for (var i = 0; i < length; i++) {
                    var division = $factory({ classes: ["Division", "Model", "Backup", "States"], base_class: "Division" });
                    division._model_.fromJSON(source[i]);
                    division._backup_.setup();
                    divisions.push(division);

                    var item = $tree.addItem({
                        treeId: "global-divisions-tree",
                        key: division.id.value,
                        parentKey: division.parentId.value,
                        display: division.shortTitle.value,
                        order: division.sortId.value,
                        data: {
                            violationsAdded: division.violationsAdded.value,
                            violationsTotal: 0,
                            attachmentsAdded: division.attachmentsAdded.value,
                            attachmentsTotal: 0
                        }
                    });

                    item.notifications.getById("violations").value = item.data.violationsTotal;
                    item.notifications.getById("violations").isVisible = item.notifications.getById("violations").value > 0 ? true : false;
                    item.notifications.getById("attachments").value = item.data.attachmentsTotal;
                    item.notifications.getById("attachments").isVisible = item.notifications.getById("attachments").value > 0 ? true : false;

                    /*
                    var prev = item;
                    var parent = $tree.getItemByKey("global-divisions-tree", item.parentKey);
                    while (parent) {
                        if (item.data.violationsAdded > 0) {
                            parent.data.violationsTotal += item.data.violationsAdded;
                            parent.notifications.getById("violations").value += item.data.violationsAdded;
                            parent.notifications.getById("violations").isVisible = parent.notifications.getById("violations").value > 0 ? true : false;
                        }
                        if (item.data.attachmentsAdded > 0) {
                            parent.data.attachmentsTotal += item.data.attachmentsAdded;
                            parent.notifications.getById("attachments").value += item.data.attachmentsAdded;
                            parent.notifications.getById("attachments").isVisible = parent.notifications.getById("attachments").value > 0 ? true : false;
                        }
                        prev = parent;
                        parent = $tree.getItemByKey("global-divisions-tree", parent.parentKey);

                    }
                    */

                    //if (division.id.value === 1) {
                    //    item.isSelected = true;
                    //    item.isExpanded = true;
                    //}

                    //this.select(1);
                }
                tree.calcRoot();

                var sessionDivisionsTree = $tree.register({
                    id: "session-divisions-tree",
                    rootKey: 0,
                    class: "stacked",
                    expandOnSelect: true,
                    collapseOnDeselect: true,
                    onSelect: function (item) {
                        $log.log("session divisions selected = ", sessionDivisionsTree.selectedItem);
                    }
                });
                sessionDivisionsTree.calcRoot = tree.calcRoot();

                var sessionDivisionRoot = $tree.getItemByKey("global-divisions-tree", $session.getCurrentUser().divisionId.value);
                if (sessionDivisionRoot) {
                    sessionDivisionsTree.initial[sessionDivisionRoot.key] = sessionDivisionRoot;
                    sessionDivisionsTree.stack = tree.stack;
                    $tree.selectItem("session-divisions-tree", sessionDivisionRoot.key);
                    //$tree.expandItem("session-divisions-tree", sessionDivisionRoot.key);
                }

                sessionDivisionsTree.onSelect = function (item) {
                    $log.log("selected item = ", item);
                    $violations.violations.setStart(0);
                    if (item.isSelected === true) {
                        $violations.violations.getNew().divisionId.value = item.key;
                        $violations.violations.getByDivisionId(item.key);
                        $log.log("new = ", $violations.violations.getNew());

                        var length = divisions.length;
                        var found = false;
                        for (var i = 0; i < length; i++) {
                            if (divisions[i].id.value === item.key) {
                                found = true;
                                if (divisions[i]._states_.selected() === false) {
                                    divisions[i]._states_.selected(true);
                                    currentDivision = divisions[i];
                                } else {
                                    divisions[i]._states_.selected(false);
                                    currentDivision = undefined;
                                }
                            }
                        }

                    }
                };



                var newViolationTree = $tree.register({
                    id: "new-violation-tree",
                    rootKey: 0,
                    class: "stacked",
                    expandOnSelect: true,
                    collapseOnDeselect: true,
                    showNotifications: false,
                    onSelect: function (item) {
                        //var division = this.getById(item.key);
                        //$log.log("div = ", division);
                        $violations.violations.getNew().divisionId.value = item.key;
                        $log.log("div id = ", item.key);
                    }

                });
                var newViolationRoot = $tree.getItemByKey("global-divisions-tree", $session.getCurrentUser().divisionId.value);
                if (newViolationRoot) {
                    newViolationTree.initial[newViolationRoot.key] = newViolationRoot;
                    newViolationTree.stack = tree.stack;
                }
                $tree.expandItem("new-violation-tree", newViolationRoot.key);

                return true;
            },



            /**
             * Возвращает массив со свеми структурными подразделениями
             * @returns {Array}
             */
            getAll: function () {
                return divisions;
            },



            /**
             * Возвращает текущее структурное подразделение
             * @returns {undefined}
             */
            getCurrent: function () {
                return currentDivision;
            },



            /**
             * Возвращает новое структурное подразделение
             * @returns {*}
             */
            getNew: function () {
                return newDivision;
            },



            /**
             * Возвращает структурное подразделение по идентификатору
             * @param divisionId {integer} - идентификатор структурного подразделения
             * @returns {*}
             */
            getById: function (divisionId) {
                if (divisionId === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$divisions -> getById: Не задан параметр - идентификатор структурного подразделения");
                    return false;
                }

                var length = divisions.length;
                for (var i = 0; i < length; i++) {
                    if (divisions[i].id.value === divisionId) {
                        return divisions[i];
                    }
                }
                return false;
            },



            /**
             * Выбирает структурное подразделение
             * @param divisionId {integer} - Идентификатор структурного подразделения
             * @param callback {function} - callback-функция
             * @returns {boolean}
             */
            select: function (divisionId, callback) {
                if (divisionId === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$divisions -> select: Не задан параметр - идентификатор структурного подразделения");
                    return false;
                }

                var length = divisions.length;
                var found = false;
                for (var i = 0; i < length; i++) {
                    if (divisions[i].id.value === divisionId) {
                        found = true;
                        if (divisions[i]._states_.selected() === false) {
                            divisions[i]._states_.selected(true);
                            currentDivision = divisions[i];
                            if (callback !== undefined && typeof callback === "function")
                                callback(currentDivision);
                        } else {
                            divisions[i]._states_.selected(false);
                            currentDivision = undefined;
                        }
                    }
                }
                return found;
            },



            /**
             * Добавляет структурное подразделение
             * @param success {function} - callback-функция в случае успешного завершения
             * @param error {function} - callback-функция в случае ошибки
             */
            add: function (success, error) {
                var params = {
                    action: "addDivision",
                    data: {
                        parentId: newDivision.parentId.value,
                        shortTitle: newDivision.shortTitle.value,
                        fullTitle: newDivision.fullTitle.value,
                        storage: newDivision.storage.value,
                        isDepartment: newDivision.isDepartment.value === true ? 1 : 0
                    }
                };

                newDivision._states_.loading(true);
                $http.post("/serverside/api.php", params)
                    .success(function (data) {
                        newDivision._states_.loading(false);
                        if (data !== undefined) {
                            var division = $factory({ classes: ["Division", "Model", "Backup", "States"], base_class: "Division" });
                            division._model_.fromJSON(data);
                            division._backup_.setup();
                            divisions.push(division);
                            if (success !== undefined && typeof success === "function")
                                success(division);
                            return true;
                        }
                    })
                    .error(function () {
                        $errors.add(ERROR_TYPE_ENGINE, "$divisions -> add: Не удалось добавить структурное подразделение");
                        newDivision._states_.loading(false);
                        if (error !== undefined && typeof error === "function")
                            error();
                        return false;
                    });
            },



            /**
             * Сохраняет изменения в текущем структурном подразделении
             * @param success {function} - callback-функция в случае успешного завершения
             * @param error {function} - callback-функция в случае ошибки
             */
            edit: function (success, error) {
                if (currentDivision === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$divisions -> edit: Не выбрано текущее структурное подразделение");
                    return false;
                }

                var params = {
                    action: "editDivision",
                    data: {
                        id: currentDivision.id.value,
                        parentId: currentDivision.parentId.value,
                        shortTitle: currentDivision.shortTitle.value,
                        fullTitle: currentDivision.fullTitle.value,
                        storage: currentDivision.storage.value,
                        departmentId: this.getDepartmentByDivisionId(currentDivision.id.value).id.value,
                        isDepartment: currentDivision.isDepartment.value === true ? 1 : 0
                    }
                };

                currentDivision._states_.loading(true);
                $http.post("/serverside/api.php", params)
                    .success(function (data) {
                        currentDivision._states_.loading(false);
                        if (data !== undefined) {
                            currentDivision._backup_.setup();
                            if (success !== undefined && typeof success === "function")
                                success(currentDivision);
                            return true;
                        }
                    })
                    .error(function () {
                        $errors.add(ERROR_TYPE_ENGINE, "$divisions -> edit: Не удалось сохранить изменения в структурном подразделнии");
                        currentDivision._states_.loading(false);
                        if (error !== undefined && typeof error === "function")
                            error();
                        return false;
                    });
            },


            getDepartmentByDivisionId: function (divisionId) {
                if (divisionId === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$divisions -> getDepartmentByDivisionId: Не задан параметр - идентификатор структурного подразделения");
                    return false;
                }

                var length = divisions.length;
                for (var i = 0; i < length; i++) {
                    if (divisions[i].id.value === divisionId) {
                        var division = divisions[i];
                        while (division.isDepartment.value === false) {
                            var length2 = divisions.length;
                            for (var x = 0; x < length2; x++) {
                                if (divisions[x].id.value === division.parentId.value)
                                    division = divisions[x];
                            }
                        }
                        return division;
                    }
                }
            }
        }
    }]);

angular.module("violations")
        .factory("$violations", ["$log", "$classes", "$factory", "$http", "$errors", "$session", "$tree", function ($log, $classes, $factory, $http, $errors, $session, $tree) {

            var divisions = [];
            var violations = [];
            var eskGroups = [];
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

            var startDate = 0;
            var endDate = 0;

            var pages = 0;
            var pagesLoaded = 1;
            var total = 0;
            var start = 0;

            return {
                init: function () {
                    if (window.initialData !== undefined) {

                        if (window.initialData.thursday !== undefined && window.initialData.thursday !== null) {
                            thursday = window.initialData.thursday;
                        }

                        if (window.initialData.eskGroups !== undefined) {
                            var length = window.initialData.eskGroups.length;
                            for (var i = 0; i < length; i++) {
                                var group = $factory({ classes: ["ESKGroup", "Model", "Backup", "States"], base_class: "ESKGroup" });
                                group._model_.fromJSON(window.initialData.eskGroups[i]);
                                group._backup_.setup();
                                eskGroups.push(group);
                            }
                            $log.log("esk groups = ", eskGroups);
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
                            $log.log("violations = ", violations);
                        }



                        if (window.initialData.divisions !== undefined) {
                            var userDivision = "/" + $session.getCurrentUser().divisionId.value + "/";
                            $log.info("userDiv = ", userDivision);
                            var length = window.initialData.divisions.length;
                            for (var i = 0; i < length; i++) {
                                var division = $factory({ classes: ["Division", "Model", "Backup", "States"], base_class: "Division" });
                                division._model_.fromJSON(window.initialData.divisions[i]);
                                division._backup_.setup();
                                //var added = this.violations.getNewByDivisionId(division.id.value);
                                //$log.log("key = ", division.id.value, ", v = ", added.violations, ", a = ", added.attachments);
                                //division.violationsAdded = added.violations;
                                //division.attachmentsAdded = added.attachments;
                                //if (division.id.value === 1 || division.path.value.indexOf(userDivision) !== -1) {
                                //    $log.log("matched", division);
                                    divisions.push(division);
                                //}
                            }
                            $log.log("divisions = ", divisions);
                            currentDivision = divisions[0];

                        }
                        //divisions[0]._states_.selected(true);



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



                divisions: {
                    getAll: function () {
                        return divisions;
                    },

                    getCurrent: function () {
                        return currentDivision;
                    },

                    getNew: function () {
                        return newDivision;
                    },

                    getById: function (id) {
                        if (id === undefined) {
                            $errors.add(ERROR_TYPE_DEFAULT, "$violations -> divisions -> getById: Не задан параметр - идентификатор структурного подразделения");
                            return false;
                        }

                        var length = divisions.length;
                        for (var i = 0; i < length; i++) {
                            if (divisions[i].id.value === id)
                                return divisions[i];
                        }
                        return false;
                    },

                    select: function (id, callback) {
                        if (id === undefined) {
                            $errors.add(ERROR_TYPE_DEFAULT, "$violations -> divisions -> select: Не задан параметр - идентификатор структурного подразделения");
                            return false;
                        }
                        start = 0;
                        $log.log("start = ", start);

                        var length = divisions.length;
                        for (var i = 0; i < length; i++) {
                            if (divisions[i].id.value === id) {
                                if (divisions[i]._states_.selected() === false) {
                                    divisions[i]._states_.selected(true);
                                    currentDivision = divisions[i];
                                } else {
                                    divisions[i]._states_.selected(false);
                                    currentDivision = undefined;
                                }
                            } else
                                divisions[i]._states_.selected(false);
                        }

                        if (callback !== undefined && typeof callback === "function")
                            callback(currentDivision);

                        return true;
                    },


                    add: function (callback) {
                       var params = {
                           action: "addDivision",
                           data: {
                               title: newDivision.shortTitle.value,
                               parentId: newDivision.parentId.value,
                               isDepartment: newDivision.isDepartment.value === true ? 1 : 0
                           }
                       };

                        $http.post("/serverside/api.php", params)
                            .success(function (data) {
                                if (data !== undefined) {
                                    var division = $factory({ classes: ["Division", "Model", "Backup", "States"], base_class: "Division" });
                                    division._model_.fromJSON(data);
                                    division._backup_.setup();
                                    divisions.push(division);
                                    newDivision.shortTitle.value = "";
                                    if (callback !== undefined && typeof callback === "function")
                                        callback(division);
                                    return true;
                                } else
                                    return false;
                            })
                            .error(function () {
                                $errors.add(ERROR_TYPE_ENGINE, "$violations -> divisions -> add: Не удалось добавить структурное подразделение");
                                return false;
                            });
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
                                $log.info("getting violation from cache");
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
                        return $http.post("/serverside/api.php", params).then(
                            function success(response) {
                                $log.info("promise success");
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
                                return undefined;
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
                        $log.log("startDate = ", this.startDate, ", endDate = ", this.endDate);
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
                                startDate: this.startDate,
                                endDate: this.endDate,
                                start: start
                            }
                        };

                        if (this.startDate !== 0 || this.endDate !== 0)
                            start = 0;

                        if (start === 0) {
                            totalAttachments = 0;
                            totalViolations = 0;
                        }

                        $http.post("serverside/api.php", params)
                            .success(function (data) {
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

                                    violations.push(violation);

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

                    cancel: function (violationId, callback) {
                        if (violationId === undefined) {
                            $errors.add(ERROR_TYPE_DEFAULT, "$violations -> violations -> cancel: Не задан параметр - идентификатор технологического нарушения");
                            return false;
                        }

                        var params = {
                            action: "cancelViolation",
                            data: {
                                serviceId: "violations",
                                id: newViolation.id.value
                            }
                        };

                        newViolation._states_.loading(true);
                        $http.post("http://wfs.kolenergo.ru/cancel.php", params)
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
                    }
                },

                eskGroups: {
                    getAll: function () {
                        return eskGroups;
                    },

                    getById: function (id) {
                        if (id === undefined) {
                            $errors.add(ERROR_TYPE_DEFAULT, "$violations -> eskGroups -> add: Не задан параметр - идентификатор группы ЭКС");
                            return false;
                        }

                        var length = eskGroups.length;
                        for (var i = 0; i < length; i++) {
                            if (eskGroups[i].id.value === id)
                                return eskGroups[i];
                        }

                        return false;
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
                            $errors.add(ERROR_TYPE_DEFAULT, "$violations -> attachments -> getByViolationId: Не задан парметр - идентификатор технологического нарушения");
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
                            $errors.add(ERROR_TYPE_DEFAULT, "$violations -> attachments: не задан параметр - добавляемое вложение");
                            return false;
                        }

                        attachments.push(attachment);
                        if (callback !== undefined && typeof callback === "function")
                            callback(attachment);
                        return true;
                    }
                }
            }
        }]);
angular
    .module("violations")
    .filter("byViolationId", ["$log", function ($log) {
        return function (input, violationId) {
            if (violationId !== undefined && violationId !== 0) {
                var length = input.length;
                var result = [];
                
                for (var i = 0; i < length; i++) {
                    if (input[i].violationId.value === violationId)
                        result.push(input[i]);
                }
                return result;
            } else
                return input;

        }
    }]);
angular.module("violations")
    .filter("dateFilter", ["$log", function ($log) {
        return function (input) {
            return moment.unix(input).format("DD MMMM YYYY, HH:mm");
        }
    }]);
angular.module("violations")
    .filter("dateShort", ["$log", function ($log) {
        return function (input) {
            return moment.unix(input).format("DD.MM.YYYY");
        }
    }]);
angular.module("violations")
    .filter("day", ["$log", function ($log) {
        return function (input) {
            return moment.unix(input).format("DD MMMM YYYY");
        }
    }]);

angular
    .module("violations")
    .filter("filesize", [function () {
        return function (input, precision) {
            if (typeof precision === 'undefined') precision = 1;
            var units = ['байт', 'кб', 'мб', 'гб', 'тв', 'пб'];
            var number = Math.floor(Math.log(input) / Math.log(1024));
            return (input / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
        }
    }]);

angular
    .module("violations")
    .filter("noDateSelected", ["$log", function ($log) {
        return function (input) {
            if (input === 0)
                return "Не выбрано";
            else
                return input;
        }
    }]);
angular.module("violations")
    .filter("time", ["$log", function ($log) {
        return function (input) {
            return moment.unix(input).format("HH:mm");
        }
    }]);
angular
    .module("violations")
    .filter('toArray', [function () {
        return function (input) {
            var result = [];
            for (var index in input) {
                result.push(input[index]);
            }
            return result;
        }
    }]);

angular
    .module("application", ["ngRoute", "ngCookies", "ngAnimate", "violations", "homunculus", "homunculus.ui"])
    .config(["$routeProvider", "$locationProvider", "$httpProvider", function ($routeProvider, $locationProvider, $httpProvider) {

        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};

        //$locationProvider.html5Mode(true);
        $routeProvider
            .when("/", {
                templateUrl: "clientside/modules/violations/templates/violations.html",
                controller: "ViolationsController"
            })
            .when("/new", {
                templateUrl: "clientside/modules/violations/templates/new-violation.html",
                controller: "NewViolationController"
            })
            .when("/violations/:violationId", {
                templateUrl: "clientside/modules/violations/templates/violation.html",
                controller: "ViolationController",
                resolve: {
                    violation: ["$log", "$http", "$route", "$violations", function ($log, $http, $route, $violations) {
                        $violations.violations.getById(parseInt($route.current.params.violationId));
                    }]
                }
            })
            .when("/divisions/", {
                templateUrl: "clientside/modules/violations/templates/divisions/divisions.html",
                controller: "DivisionsController",
                resolve: {
                    access: ["$location", "$session", function ($location, $session) {
                        if ($session.getCurrentUser().isAdministrator.value === false)
                            $location.url("/");
                    }]
                }
            })
            .when("/users/", {
                templateUrl: "clientside/modules/violations/templates/users/users.html",
                controller: "UsersController",
                resolve: {
                    access: ["$location", "$session", function ($location, $session) {
                        if ($session.getCurrentUser().isAdministrator.value === false)
                            $location.url("/");
                    }]
                }
            })
            .when("/user/:userId", {
                templateUrl: "clientside/modules/violations/templates/users/user.html",
                controller: "UserController",
                resolve: {
                    access: ["$location", "$session", function ($location, $session) {
                        if ($session.getCurrentUser().isAdministrator.value === false)
                            $location.url("/");
                    }],
                    user: ["$log", "$http", "$route", "$users", "$session", function ($log, $http, $route, $users, $session) {
                        if ($session.getCurrentUser().isAdministrator.value === true)
                            $users.users.getById(parseInt($route.current.params.userId));
                    }]
                }
            })
            .when("/new-user", {
                templateUrl: "clientside/modules/violations/templates/users/new-user.html",
                controller: "NewUserController",
                resolve: {
                    access: ["$location", "$session", function ($location, $session) {
                        if ($session.getCurrentUser().isAdministrator.value === false)
                            $location.url("/");
                    }]
                }
            })
            .when("/help/", {
                templateUrl: "clientside/modules/violations/templates/help/help.html",
                controller: "HelpController"
            })
            .otherwise({
                redirectTo: "/"
            });
    }])
    .run(["$log", "$violations", "$navigation", function ($log, $violations, $navigation) {
        moment.locale("ru");
        $violations.violations.getNew().happened.value = new moment().hours(0).minutes(0).seconds(0).unix();
        $log.log(window.initialData);
    }]);