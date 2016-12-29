<?php


    function __autoload ($class) {
        $DS = DIRECTORY_SEPARATOR;
        if (file_exists($_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."classes".$DS.$class.".class.php"))
            require_once $_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."classes".$DS.$class.".class.php";
    }

    $services = new Services();

    $db_host = "192.168.91.24";
    //$db_host = "localhost";
    $db_user = "wfs_base";
    //$db_user = "root";
    $db_password = "iuh";
    //$db_password = "l1mpb1zk1t";
    $db_name = "wfs_base";

    $ldap_host = "10.50.0.1";

    $itemsOnPage = 20;
    $usersOnPage = 20;

?>