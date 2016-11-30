<?php

    class Errors {
        //public static $type = new stdClass();
        //$type -> ERROR_TYPE_DEFAULT = 0;
        //$type -> ERROR_TYPE_DATABASE = 1;


        public function throw ($errorType, $errorMessage) {
            if (is_null($errorType)) {
                echo(get_class($this)." -> __construct: Не задан параметр - тип ошибки");
                return false;
            }

            if (gettype($errorType) != "integer") {
                echo(get_class($this)." -> __construct: Неверно задан тип параметра - тип ошибки");
                return false;
            }

            if (is_null($errorMessage)) {
                echo(get_class($this)." -> __construct: Не задан параметр - текст ошибки");
                return false;
            }

            if (gettype($errorMessage) != "string") {
                echo(get_class($this)." -> __construct: Неверно задан тип параметра - текст ошибки");
                return false;
            }

        }


        public static function test () {
            return "test";
        }

    };

?>