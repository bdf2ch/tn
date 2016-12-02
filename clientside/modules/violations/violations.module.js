angular.module("violations", [])
    .run(["$log", "$divisions", "$violations", "$misc", "$session", "$users", "$navigation", "$settings",
        function ($log, $divisions, $violations, $misc, $session, $users, $navigation, $settings) {
            //$log.log("violations module run...");

            $session.init(window.initialData);
            $settings.init(window.initialData.settings);
            $users.users.init(window.initialData.users);
            $divisions.init(window.initialData.divisions);
            $violations.init();
            $misc.init(window.initialData);
            $violations.getNew().userId.value = $session.getCurrentUser().id.value;
            $violations.getNew().divisionId.value = $session.getCurrentUser().divisionId.value;
            //$violations.startDate = new moment().unix();

            $navigation.add({
                id: "violations",
                url: "/",
                icon: "fa fa-bolt",
                title: "Нарушения",
                order: 1
            });

            $navigation.add({
                id: "violation",
                parentId: "violations",
                url: "/violations/:violationId",
                title: "",
                onSelect: function () {
                    $navigation.getById("violations").isActive = true;
                }
            });

            $navigation.add({
                id: "tools",
                url: "tools",
                icon: "fa fa-bolt",
                title: "Инструменты"
            });

            $navigation.add({
                id: "users",
                url: "/users/",
                icon: "fa fa-user",
                title: "Пользователи",
                order: 3,
                onSelect: function () {
                    $navigation.getById("tools").isActive = true;
                }
            });


            $navigation.add({
                id: "user",
                parentId: "users",
                url: "/user/:userId",
                icon: "fa fa-user",
                title: "",
                onSelect: function () {
                    $navigation.getById("tools").isActive = true;
                    $navigation.getById("users").isActive = true;
                }
            });

            $navigation.add({
                id: "new-user",
                parentId: "users",
                url: "/new-user/",
                title: "",
                onSelect: function () {
                    $navigation.getById("tools").isActive = true;
                }
            });

            $navigation.add({
                id: "divisions",
                url: "/divisions/",
                icon: "fa fa-building",
                title: "Стр. подразделения",
                order: 2,
                onSelect: function () {
                    $navigation.getById("tools").isActive = true;
                }
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