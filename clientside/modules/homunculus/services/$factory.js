angular
    .module("homunculus")
    .factory("$factory", ["$log", "$classes", function ($log, $classes) {
        function FactoryObject (parameters) {

            var clone = function _clone(obj) {
                if (obj instanceof Array) {
                    var out = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        var value = obj[i];
                        out[i] = (value !== null && typeof value === "object") ? _clone(value) : value;
                    }
                } else {
                    var out = new obj.constructor();
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            var value = obj[key];
                            out[key] = (value !== null && typeof value === "object") ? _clone(value) : value;
                        }
                    }
                }
                return out;
            };

            var _clone = function (it) {
                return this._clone({
                    it: it
                }).it;
            };


            var classes = $classesInjector.getAll();
            var addClass = function (className, destination) {
                if (className !== undefined && destination !== undefined) {
                    if (classes.hasOwnProperty(className)) {
                        destination.init_functions = [];
                        for (var prop in classes[className]) {
                            if (prop !== "__dependencies__") {
                                if (classes[className][prop].constructor !== Function) {
                                    destination[prop] = clone(classes[className][prop]);
                                    if (destination[prop]["__instance__"] !== undefined)
                                        destination[prop]["__instance__"] = destination;
                                    if (destination[prop]["_init_"] !== undefined && destination[prop]["_init_"].constructor === Function)
                                        destination.init_functions.push(destination[prop]["_init_"]);
                                    if (destination["_init_"] !== undefined && destination["_init_"].constructor === Function)
                                        destination.init_functions.push(destination["_init_"]);

                                } else {
                                    destination[prop] = classes[className][prop];
                                    if (prop === "_init_")
                                        destination.init_functions.push(destination[prop]);
                                }
                            }
                        }
                    }
                }
            };


            if (parameters !== undefined) {
                if (parameters.hasOwnProperty("classes")) {
                    if (parameters["classes"].constructor === Array) {
                        for (var parent in parameters["classes"]) {
                            var class_name = parameters["classes"][parent];
                            addClass(class_name, this);
                        }
                    }
                }
                if (parameters.hasOwnProperty("base_class")) {
                    if (classes.hasOwnProperty(parameters["base_class"])) {
                        this.__class__ = parameters["base_class"];
                    }
                }
            }

        };

        return function (parameters) {
            var obj = new FactoryObject(parameters);
            /*
            if (obj.init_functions.length > 0) {
                for (var i = 0; i < obj.init_functions.length; i++) {
                    obj.init_functions[i].call(obj);
                }
            }
            */
            //return new FactoryObject(parameters);
            return obj;
        };
    }]);

var injector = angular.injector(['ng', 'homunculus']);
var factory = injector.get('$factory');
