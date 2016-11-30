<?php

    class Services {

        //public static function register () {

        //}

        private static $services = array();


        public function __get ($title) {
            echo($title." called");
            $DS = DIRECTORY_SEPARATOR;
            if (file_exists($_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."services".$DS.$title.".service.php")) {
                require_once $_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."services".$DS.$title.".service.php";
                if (!array_key_exists($title, $this -> services)) {
                    $service = new $title();
                    $this -> services[$title] = $service;
                }
                return $this -> services[$title];
            }
            return null;
        }


        public static function test () {
            return "test";
        }
    };

?>