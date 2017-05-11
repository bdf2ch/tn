angular
    .module("violations")
    .controller("HeaderController", ["$log", "$scope", "$session", "$navigation", "$window", "$modals", "$misc", "$settings", "$violations", "$feedback", '$factory', function ($log, $scope, $session, $navigation, $window, $modals, $misc, $settings, $violations, $feedback, $factory) {
        $scope.misc = $misc;
        $scope.session = $session;
        $scope.settings = $settings;
        $scope.navigation = $navigation;
        $scope.violations = $violations;
        $scope.modals = $modals;
        $scope.feedback = $feedback;
        $scope.feedbackMessage = {
            message: '',
            attachments: []
        };
        $scope.newMessage = $factory({ classes: ['FeedbackMessage', 'Model'], base_class: 'FeedbackMessage' });
        $scope.uploaderData = {
            serviceId: 'violations',
            userId: $session.getCurrentUser().id.value,
            messageId: $scope.newMessage.id.value
        };


        $scope.openMobileMenu = function () {
            $violations.mobileMenu(true);
            $log.log("menu opened = ", $violations.mobileMenu());
        };

        $scope.closeMobileMenu = function () {
            if ($violations.mobileMenu() === true)
                $violations.mobileMenu(false);
        };

        $scope.swipeLeft = function () {
            $log.log("swipe left");
            $violations.mobileMenu(false);

        };

        $scope.openSettingsModal = function () {
            $modals.open("settings-modal");
        };


        $scope.closeSettingsModal = function () {
            if ($settings.changed() === true) {
                for (var setting in $settings.getAll()) {
                    $settings.getAll()[setting]._backup_.restore();
                    $settings.getAll()[setting]._states_.changed(false);
                }
            }
            $settings.changed(false);
            $modals.close();
            $window.location.reload();
        };


        $scope.saveSettings = function () {
            $settings.save(function () {
                $settings.changed(false);
            });
        };


        $scope.openFeedbackModal = function () {
            $modals.open('feedback-modal');
        };


        $scope.closeFeedbackModal = function () {
            $scope.newMessage.message.value = '';
        };


        $scope.onBeforeUploadAttachment = function () {
            $scope.uploaderData.messageId = $scope.newMessage.id.value;
        };


        $scope.onCompleteUploadAttachment = function (data) {
            $log.log(data);
            var attachment = $factory({ classes: ['FeedbackAttachment', 'Model'], base_class: 'FeedbackAttachment' });
            attachment._model_.fromJSON(data);
            $log.log(attachment);
            $scope.newMessage.attachments.push(attachment);
            $scope.newMessage.id.value = parseInt(data['message_id']);
            $log.log($scope.newMessage);
        };


        $scope.sendMessage = function () {
            $feedback.add($scope.newMessage, function () {
                $modals.close();
            });
        };

        $scope.logout = function () {
            $session.logout(function () {
                $window.location.reload(true);
            });
        };

    }]);