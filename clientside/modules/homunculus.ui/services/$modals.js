angular
    .module("homunculus.ui")
    .factory("$modals", ["$log", "$window", "$compile", "$errors", function ($log, $window, $compile, $errors) {
        var modals = [];

        var redraw = function (elm) {
            if (elm !== undefined) {
                var left = ($window.innerWidth / 2) - angular.element(elm).prop("clientWidth") / 2 + "px";
                var top = ($window.innerHeight / 2) - ((angular.element(elm).prop("clientHeight")) / 2) + "px";

                angular.element(elm).css("left", left);
                angular.element(elm).css("top", top);
            }
        };

        return {

            /**
             * Возвращает массив со всеми модальными окнами
             * @returns {Array}
             */
            getAll: function () {
                return modals;
            },

            /**
             * Возвращает scope модального окна с заданным идентификатором
             * @param id {string} - идентификатор модального окна
             * @returns {scope}
             */
            getById: function (id) {
                if (id === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$modals -> getById: Не задан параметр - идентификатор модального окна");
                    return false;
                }

                var length = modals.length;
                for (var i = 0; i < length; i++) {
                    if (modals[i].id === id)
                        return modals[i];
                }

                return false;
            },

            /**
             * Регистирует модальное окно
             * @param scope {scope} - scope добавляемого модального окна
             * @returns {boolean}
             */
            register: function (modal) {
                if (modal === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$modals -> register: Не задан парметр - объект модального окна");
                    return false;
                }

                modals.push(modal);
                $log.log("modals = ", modals);

                return true;
            },

            /**
             * Открывает модальное окно с заданным идентификатором
             * @param id {string} - идентификатор модального окна
             * @returns {boolean}
             */
            open: function (id) {
                if (id === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "$modals -> open: Не задан параметр - идентификатор модального окна");
                    return false;
                }

                var length = modals.length;
                var found = false;
                for (var i = 0; i < length; i++) {
                    if (modals[i].id === id) {
                        found = true;
                        currentModal = modals[i];
                        var modal = document.getElementsByClassName("krypton-ui-modal")[0];
                        var header = document.getElementById("krypton-ui-modal-caption");
                        var content = document.getElementById("krypton-ui-modal-content");
                        var footer = document.getElementById("krypton-ui-modal-footer");
                        header.innerHTML = modals[i].caption;
                        content.innerHTML = modals[i].content;
                        if (modals[i].footer.content !== undefined) {
                            footer.innerHTML = modals[i].footer.content;
                            angular.element(footer).css("display", "block");

                            if (modals[i].footer.height !== 0) {
                                angular.element(footer).css("height", modals[i].footer.height + "px");
                                //angular.element(footer).css("max-height", modals[i].footer.height + "px");
                                //angular.element(content).css("bottom", modals[i].footer.height + "px");
                                //angular.element(content).css
                            }
                        } else {
                            angular.element(footer).css("display", "none");
                        }
                        $compile(modal)(modals[i].scope);
                        angular.element(modal).css("display", "block");

                        var fog = document.getElementsByClassName("krypton-ui-fog");
                        document.body.style.overflow = "hidden";
                        fog[0].classList.add("visible");
                        redraw(modal);

                        if (modals[i].width !== 0)
                            angular.element(modal).css("width", modals[i].width + "px");
                        if (modals[i].height !== 0) {
                            angular.element(modal).css("height", modals[i].height + "px");
                            angular.element(content).css("height", modals[i].height - 35 - modals[i].footer.height + "px");
                            //angular.element(content).css("height", items[i].height + "px");
                        } else {
                            angular.element(modal).css("height", "auto");
                            if (modals[i].footer.height !== 0)
                                angular.element(content).css("height", "auto");
                            else
                                angular.element(content).css("height", "100%");
                        }


                        modal.addEventListener("DOMSubtreeModified", function () {
                            redraw(modal);
                        }, false);

                        angular.element($window).bind("resize", function () {
                            redraw(modal);
                        });
                    }
                }

                if (found === false) {
                    $errors.add(ERROR_TYPE_ENGINE, "$modals -> open: Модальное окно с идентификатором '" + id + "' не найдено");
                    return false;
                } else
                    return true;
            },

            /**
             * Закрывает модальное окно с заданным идентификатором
             * @returns {boolean}
             */
            close: function () {
                if (currentModal !== undefined) {
                    var modal = document.getElementsByClassName("krypton-ui-modal")[0];
                    if (currentModal.onClose !== undefined)
                        currentModal.onClose();
                    var fog = document.getElementsByClassName("krypton-ui-fog");
                    document.body.style.overflow = "auto";
                    fog[0].classList.remove("visible");
                    angular.element(modal).css("display", "none");
                    currentModal = undefined;
                    return true;
                }

                return false;
            }
        }
    }]);
