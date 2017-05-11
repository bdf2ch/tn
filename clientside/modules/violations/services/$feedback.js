angular
    .module('violations')
    .factory('$feedback', ['$log', '$http', '$factory', '$session', function ($log, $http, $factory, $session) {
        var messages = [];

        var api = {

            add: function (message, success, error) {
                var parameters = {
                    action: 'addFeedbackMessage',
                    data: {
                        userId: $session.getCurrentUser().id.value,
                        message: message.message.value
                    }
                };
                $http.post('/serverside/api.php', parameters)
                    .success(function (data) {
                        var message = $factory({ classes: ["FeedbackMessage", "Model"], base_class: "FeedbackMessage" });
                        message._model_.fromJSON(data);
                        messages.push(message);
                        $log.info(message);
                        if (success !== undefined && typeof success === 'function')
                            success(message);
                    })
                    .error(function () {
                        if (error !== undefined && typeof error === 'function')
                            error();
                    });
            }
        };

        return api;
    }]);