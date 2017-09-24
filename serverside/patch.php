<?php

    $DS = DIRECTORY_SEPARATOR;
    require_once $_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."config.php";

    date_default_timezone_set("Europe/Moscow");

    $mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
    if ($mysqli -> connect_errno) {
        echo "Не удалось подключиться к MySQL: ".$mysqli -> connect_error;
        return false;
    }

    $encoding = mysqli_query($mysqli, "SET NAMES utf8");
    if (!$encoding) {
        echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
        return false;
    }

    $attachments_query = mysqli_query($mysqli, "SELECT * FROM attachments");
    if (!$attachments_query) {
        echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
        return false;
    }

    while ($attachment = mysqli_fetch_assoc($attachments_query)) {
        if (strpos($attachment['URL'], '192.168.88.141')) {
            echo($attachment['URL'].'<br>');

            $attachmentId = $attachment['ID'];
            $violationId = $attachment['VIOLATION_ID'];
            $violation_query = mysqli_query($mysqli, "SELECT * FROM violations WHERE id = $violationId");
            if (!$violation_query) {
                echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
                return false;
            }

            echo('attachemnt id = '.$attachmentId.'<br>');
            $violation = mysqli_fetch_assoc($violation_query);
            $divisionId = $violation['DIVISION_ID'];
            echo('violation id = '.$violation['ID'].'<br>');
            echo('division id = '.$divisionId.'<br>');

            $division_query = mysqli_query($mysqli, "SELECT * FROM divisions WHERE id = $divisionId");
            if (!$division_query) {
                echo "Не удалось выполнить запрос: (".$mysqli -> errno.") ".$mysqli -> error;
                return false;
            }
            $division = mysqli_fetch_assoc($division_query);
            $isDivisionDepartment = intval($division["IS_DEPARTMENT"]);
            $parentDivisionId = intval($division["PARENT_ID"]);
            $storage = $division["FILE_STORAGE_HOST"];
            $parent = "";

            while ($isDivisionDepartment != 1) {
                $parent_division_query = mysqli_query($mysqli, "SELECT * FROM divisions WHERE id = $parentDivisionId");
                if (!$parent_division_query) {
                    echo "Не удалось выполнить запрос: (".$mysqli -> errno.") ".$mysqli -> error;
                    return false;
                }
                $parent = mysqli_fetch_assoc($parent_division_query);
                $isDivisionDepartment = intval($parent["IS_DEPARTMENT"]);
                $parentDivisionId = intval($parent["PARENT_ID"]);
            }
            echo('department id = '.$parent['ID'].'<br>');

            $url = $storage == "" ? "uploads".$DS."violations".$DS.$parent["ID"].$DS.$violationId.$DS.$attachment['TITLE'] : $storage.$DS."uploads".$DS."violations".$DS.$violationId.$DS.$attachment['TITLE'];
            $urlEncoded = mysqli_real_escape_string($mysqli, $url);
            echo("url = ".$url."<br>");

            $update_query = mysqli_query($mysqli, "UPDATE attachments SET url = '$urlEncoded' WHERE id = $attachmentId");
            if (!$update_query) {
                echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
                return false;
            }
        }
    }

?>