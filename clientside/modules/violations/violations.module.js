angular.module("violations", [])
    .run(["$log", "$divisions", "$violations", "$misc", "$session", "$users", "$navigation", "$settings", function ($log, $divisions, $violations, $misc, $session, $users, $navigation, $settings) {
        //$log.log("violations module run...");

        $session.init(window.initialData);
        $settings.init(window.initialData.settings);
        $users.users.init(window.initialData.users);
        $divisions.init(window.initialData.divisions);
        $violations.init();
        $misc.init(window.initialData);
        $violations.violations.getNew().userId.value = $session.getCurrentUser().id.value;
        $violations.violations.getNew().divisionId.value = $session.getCurrentUser().divisionId.value;
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