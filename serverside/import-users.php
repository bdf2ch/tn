<?php

    $DS = DIRECTORY_SEPARATOR;
    require_once $_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."config.php";
    require_once $_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."libs".$DS."phpexcel".$DS."Classes".$DS."PHPExcel.php";

        date_default_timezone_set("Europe/Moscow");
        mysqli_set_charset ($mysqli, "utf8");

        $mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
        if ($mysqli -> connect_errno) {
            echo "Не удалось подключиться к MySQL: ".$mysqli -> connect_error;
            return false;
        }

        var_dump($mysqli);

        $encoding = mysqli_query($mysqli, "SET NAMES utf8");
        if (!$encoding) {
            echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
            return false;
        }

        $usersFile = PHPExcel_IOFactory::load($_SERVER["DOCUMENT_ROOT"].$DS."users.xls");
        $usersFileRows = $usersFile -> getActiveSheet() -> getHighestRow();

         for ($i = 1; $i <= $usersFileRows; $i++) {
                $fio = $usersFile -> getActiveSheet() -> getCell("A".$i) -> getValue();
                echo($fio."<br>");
                $fioArray = explode(" ", $fio);
                $surname = $fioArray[0];
                $name = $fioArray[1];
                $fname = $fioArray[2];
                $adAccount = $usersFile -> getActiveSheet() -> getCell("B".$i) -> getValue();
                $email = $usersFile -> getActiveSheet() -> getCell("C".$i) -> getValue();
                $divisionId = $usersFile -> getActiveSheet() -> getCell("D".$i) -> getValue();

                $user = mysqli_query($mysqli, "INSERT INTO users (DIVISION_ID, SURNAME, NAME, FNAME, EMAIL, LOGIN, PASSWORD, IS_ADMINISTRATOR, ALLOW_EDIT, ALLOW_CONFIRM, IS_LDAP_ENABLED) VALUES ($divisionId, '$surname', '$name', '$fname', '$email', '$adAccount', '', 0, 0, 0, 1)");
                if (!$user) {
                    echo "Не удалось выполнить запрос: (".$mysqli -> errno.") ".$mysqli -> error;
                    return false;
                }
         }

?>