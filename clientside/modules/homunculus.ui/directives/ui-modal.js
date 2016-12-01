angular
    .module("homunculus.ui")
    .directive("uiModal", ["$log", "$sce", "$modals", function ($log, $sce, $modals) {
        return {
            restrict: "A",
            scope: false,
            controller: function ($scope, $element) {
                var footer = $scope.footer = {
                    content: undefined,
                    height: 0
                };

                this.registerFooter = function (content, height) {
                    $scope.footer.content = content;
                    $scope.footer.height = height;
                };

            },
            link: function (scope, element, attrs, ctrl) {
                if (attrs.modalId === undefined) {
                    $errors.add(ERROR_TYPE_DEFAULT, "krypton.ui -> modal: Не задан идентификатор модального окна - аттрибут 'modal-id'");
                    return false;
                }

                var modal  = {
                    id: attrs.modalId,
                    isVisible: false,
                    caption: attrs.modalCaption !== undefined ? attrs.modalCaption : "",
                    content: $sce.trustAsHtml(element[0].innerHTML),
                    footer: scope.footer,
                    scope: scope,
                    width: attrs.modalWidth !== undefined && !isNaN(attrs.modalWidth) ? parseInt(attrs.modalWidth) : 0,
                    height: attrs.modalHeight !== undefined && !isNaN(attrs.modalHeight) ? parseInt(attrs.modalHeight) : 0,
                    onClose: attrs.modalOnClose !== undefined && typeof scope.$eval(attrs.modalOnClose) === "function" ? scope.$eval(attrs.modalOnClose) : undefined,
                    onOpen: attrs.modalOnOpen !== undefined && typeof scope.$eval(attrs.modalOnOpen) === "function" ? scope.$eval(attrs.modalOnOpen) : undefined
                };

                element[0].innerHTML = "";
                element[0].classList.add("ng-hide");
                $modals.register(modal);

                var check = document.getElementsByClassName("krypton-ui-modal");
                if (check.length === 0) {
                    var modal = document.createElement("div");
                    modal.className = "krypton-ui-modal";
                    var header = document.createElement("div");
                    header.className = "modal-header";
                    var headerCaption = document.createElement("span");
                    headerCaption.setAttribute("id", "krypton-ui-modal-caption");
                    headerCaption.className = "modal-caption";
                    var headerClose = document.createElement("span");
                    headerClose.className = "modal-close fa fa-times right";
                    headerClose.setAttribute("title", "Закрыть");
                    headerClose.setAttribute("ng-click", "modals.close()");
                    header.appendChild(headerCaption);
                    header.appendChild(headerClose);
                    var content = document.createElement("div");
                    content.setAttribute("id", "krypton-ui-modal-content");
                    content.className = "modal-content";
                    var footer = document.createElement("div");
                    footer.setAttribute("id", "krypton-ui-modal-footer");
                    footer.className = "modal-footer";
                    document.body.appendChild(modal);
                    modal.appendChild(header);
                    modal.appendChild(content);
                    modal.appendChild(footer);
                }

                var fog = document.getElementsByClassName("krypton-ui-fog");
                if (fog.length === 0) {
                    var fogElement = document.createElement("div");
                    fogElement.className = "krypton-ui-fog";
                    document.body.appendChild(fogElement);
                }
            }
        }
    }]);