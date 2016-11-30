<?php

    class Error {
        public $type = 0;
        public $message = "";
        public $timestamp = 0;

        public function __construct ($errorType, $errorMessage) {
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

            $this -> type = $errorType;
            $this -> message = $errorMessage;
            $this -> timestamp = time();
        }
    };

?>