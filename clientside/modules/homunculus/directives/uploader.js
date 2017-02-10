angular
    .module("homunculus")
    .directive("uploader", ["$log", "$http", "$errors", function ($log, $http, $errors) {
        return {
            restrict: "A",
            scope: {
                //uploaderUrl: "=",
                uploaderData: "=",
                uploaderOnCompleteUpload: "=",
                uploaderOnBeforeUpload: "="
            },
            link: function (scope, element, attrs) {
                var url = "";
                var fd = new FormData();

                if (attrs.uploaderUrl === undefined || attrs.uploaderUrl === "") {
                    $errors.add(ERROR_TYPE_DEFAULT, "uploader -> Не задан атрибут - url");
                    return false;
                }

                attrs.$observe("uploaderUrl", function (val) {
                    url = val;
                    //$log.log("interpolated url = ", url);

                });

                /**
                 * Отслеживаем выбор файла для загрузки
                 */
                element.bind("change", function () {
                    //var fd = new FormData();
                    angular.forEach(element[0].files, function (file) {
                        //$log.log(file);
                        fd.append("file", file);
                    });

                    /* Если задан коллбэк onBeforeUpload - выполняем его */
                    $log.log(scope.uploaderOnBeforeUpload);
                    if (scope.uploaderOnBeforeUpload !== undefined && typeof scope.uploaderOnBeforeUpload === "function") {
                        scope.$apply(scope.uploaderOnBeforeUpload);
                    }

                    /* Если заданы данные для отправки на сервер - добавляем их в данные формы для отправки */
                    if (scope.uploaderData !== undefined) {
                        //$log.info(scope.uploaderData);
                        for (var param in scope.uploaderData) {
                            fd.append(param, scope.uploaderData[param]);
                        }
                    }

                    scope.upload();
                });

                /**
                 * Отправляет данные на сервер
                 */
                scope.upload = function () {

                    $log.info("upload, link = ", url);
                    //if (fd.has("file")) {
                        element.prop("disabled", "disabled");
                        $http.post(url, fd,
                            {
                                transformRequest: angular.identity,
                                headers: {
                                    "Content-Type": undefined
                                }
                            }
                        ).success(function (data) {
                            //$log.log(data);
                            element.prop("disabled", "");
                            if (scope.uploaderOnCompleteUpload !== undefined && typeof scope.uploaderOnCompleteUpload === "function")
                                scope.uploaderOnCompleteUpload(data);
                            //fd.delete("file");
                            fd = new FormData();
                        });
                    //}
                };

            }
        }
    }]);