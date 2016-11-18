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

    $encoding = mysqli_query($mysqli, "SET NAMES utf8");
    if (!$encoding) {
        echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
        return false;
    }

    $attachmentsFile = PHPExcel_IOFactory::load($_SERVER["DOCUMENT_ROOT"].$DS."attachments.xls");
    $attachmentsFileRows = $attachmentsFile -> getActiveSheet() -> getHighestRow();
    $notFound = 0;
    echo("attachments file rows = ". $attachmentsFileRows."<br><br>");

    for ($i = 2; $i < $attachmentsFileRows; $i++) {
        $attachmentUrl = $attachmentsFile -> getActiveSheet() -> getCell("K".$i) -> getValue();
        $attachmentTitleArray = explode("\\", $attachmentUrl);
        $attachmentTitle = end($attachmentTitleArray);
        $onDisk = $attachmentTitleArray[sizeof($attachmentTitleArray) - 2];

        echo("title = ".$attachmentTitle."<br>");
        echo("onDisk = ".$onDisk."<br>");

        $attachment = mysqli_query($mysqli, "SELECT * FROM attachments WHERE TITLE = '$attachmentTitle'");
        if (!$attachment) {
            echo "Не удалось выполнить запрос: (".$mysqli -> errno.") ".$mysqli -> error;
            return false;
        }
        $attachment = mysqli_fetch_assoc($attachment);
        $attachmentId = intval($attachment["ID"]);
        $violationId = intval($attachment["VIOLATION_ID"]);
        $divisionId = intval($attachment["DIVISION_ID"]);
        echo("violationId = ".$violationId."<br>");
        echo("divisionId = ".$divisionId."<br>");

        $divisionQuery = mysqli_query($mysqli, "SELECT * FROM divisions WHERE id = $divisionId");
        if (!$divisionQuery) {
            echo "Не удалось выполнить запрос: (".$mysqli -> errno.") ".$mysqli -> error;
            return false;
        }
        $division = mysqli_fetch_assoc($divisionQuery);
        $isDivisionDepartment = intval($division["IS_DEPARTMENT"]);
        $parentDivisionId = intval($division["PARENT_ID"]);
        $storage = $division["FILE_STORAGE_HOST"];
        $parent = "";


        while ($isDivisionDepartment != 1) {
            $parentDivisionQuery = mysqli_query($mysqli, "SELECT * FROM divisions WHERE id = $parentDivisionId");
            if (!$parentDivisionQuery) {
                echo "Не удалось выполнить запрос: (".$mysqli -> errno.") ".$mysqli -> error;
                return false;
            }
            $parent = mysqli_fetch_assoc($parentDivisionQuery);
            $isDivisionDepartment = intval($parent["IS_DEPARTMENT"]);
            $parentDivisionId = intval($parent["PARENT_ID"]);
        }

        $url = $storage == "" ? "uploads".$DS."violations".$DS.$parent["ID"].$DS.$violationId.$DS.$attachmentTitle : $storage.$DS."uploads".$DS."violations".$DS.$violationId.$DS.$attachmentTitle;
        echo("url = ".$url."<br>");

        if (!file_exists($_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."attachments".$DS.$parent["ID"])) {
            mkdir($_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."attachments".$DS.$parent["ID"], 0777);
        }

        if (!file_exists($_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."attachments".$DS.$parent["ID"].$DS.$violationId)) {
            mkdir($_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."attachments".$DS.$parent["ID"].$DS.$violationId, 0777);
        }

        $encoding = mb_detect_encoding($attachmentTitle);
        $title1251 = mb_convert_encoding($attachmentTitle, "WINDOWS-1251", $encoding);
        if (!file_exists($_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."files".$DS.$onDisk.$DS.$title1251)) {
            echo("Файл "."serverside".$DS."files".$DS.$onDisk.$title1251." не найден<br>");
            $notFound++;
            $file = mysqli_query($mysqli, "DELETE FROM attachments WHERE ID = $attachmentId");
            if (!$file) {
                echo "Не удалось выполнить запрос: (".$mysqli -> errno.") ".$mysqli -> error;
                return false;
            }
        } else {
            copy($_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."files".$DS.$onDisk.$DS.$title1251, $_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."attachments".$DS.$parent["ID"].$DS.$violationId.$DS.$title1251);
            $urlEncoded = mysqli_real_escape_string($mysqli, $url);
            $file = mysqli_query($mysqli, "UPDATE attachments SET URL = '$urlEncoded' WHERE ID = $attachmentId");
            if (!$file) {
                echo "Не удалось выполнить запрос: (".$mysqli -> errno.") ".$mysqli -> error;
                return false;
            }
        }



        echo("parent division id = ".$parent["ID"]);


        echo("<br><br>");
    }


    echo("<br><br><b>Итого не найдено: ".$notFound."</b>");

?>