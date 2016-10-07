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