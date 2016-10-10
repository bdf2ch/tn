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
        //$log.log(window.initialData);
    }]);
