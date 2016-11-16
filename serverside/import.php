<?php

    $DS = DIRECTORY_SEPARATOR;
    require_once $_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."config.php";
    require_once $_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."libs".$DS."phpexcel".$DS."Classes".$DS."PHPExcel.php";

    if (PHP_SAPI == 'cli')
        die('This example should only be run from a Web Browser');
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

    $violationsFile = PHPExcel_IOFactory::load($_SERVER["DOCUMENT_ROOT"].$DS."import.xls");
    $attachmentsFile = PHPExcel_IOFactory::load($_SERVER["DOCUMENT_ROOT"].$DS."attachments.xls");
    $attachmentsWriter = new PHPExcel_Writer_Excel5($attachmentsFile);

    $violationsFileRows = $violationsFile -> getActiveSheet() -> getHighestRow();
    $attachmentsFileRows = $attachmentsFile -> getActiveSheet() -> getHighestRow();
    echo("violations file rows = ". $violationsFileRows."<br>");
    echo("attachments file rows = ". $attachmentsFileRows."<br><br>");

    for ($i = 2; $i <= $violationsFileRows; $i++) {
        $dateHappened = DateTime::createFromFormat('d.m.Y H:i:s', $violationsFile -> getActiveSheet() -> getCell("B".$i) -> getValue());
        $dateHappenedUnix = $dateHappened -> getTimestamp();
        $dateEnded = $dateHappened -> getTimestamp();
        $duration = 0;
        $dateAdded = time();
        $divisionId = $violationsFile -> getActiveSheet() -> getCell("G".$i) -> getValue();
        $eskObject = $violationsFile -> getActiveSheet() -> getCell("C".$i) -> getValue();
        $eskGroupId = $violationsFile -> getActiveSheet() -> getCell("D".$i) -> getValue();
        $description = $violationsFile -> getActiveSheet() -> getCell("H".$i) -> getValue();
        $userId = $violationsFile -> getActiveSheet() -> getCell("I".$i) -> getValue();
        $isConfirmed = intval($violationsFile -> getActiveSheet() -> getCell("J".$i) -> getValue());
        $oldId = intval($violationsFile -> getActiveSheet() -> getCell("A".$i) -> getValue());

        echo("oldId = ".$oldId."<br>");
        echo("divisionId = ".$divisionId."<br>");
        echo("eskGroupId = ".$eskGroupId."<br>");
        echo("dateHappened = ".$dateHappened -> getTimestamp()."<br>");
        echo("description = ".$description."<br>");
        echo("userId = ".$userId."<br>");
        echo("eskObject = ".$eskObject."<br>");
        echo("isConfirmed = ".$isConfirmed."<br>");

        $violation = mysqli_query($mysqli, "INSERT INTO violations (DIVISION_ID, USER_ID, ESK_GROUP_ID, DATE_HAPPENED, DATE_ENDED, DURATION, DESCRIPTION, ESK_OBJECT, DATE_ADDED, IS_CONFIRMED) VALUES ($divisionId, $userId, $eskGroupId, $dateHappenedUnix, $dateHappenedUnix, $duration, '$description', '$eskObject', $dateAdded, $isConfirmed)");
        if (!$violation) {
            echo "Не удалось выполнить запрос1: (" . $mysqli -> errno . ") " . $mysqli -> error;
            return false;
        }
        $id = mysqli_insert_id($mysqli);

        for ($x = 2; $x <= $attachmentsFileRows; $x++) {
            $attachmentsId = intval($attachmentsFile -> getActiveSheet() -> getCell("A".$x) -> getValue());
            if ($attachmentsId == $oldId) {
                $attachmentAdded = DateTime::createFromFormat('d.m.Y H:i:s', $attachmentsFile -> getActiveSheet() -> getCell("L".$x) -> getValue());
                $attachmentAddedUnix = $attachmentAdded -> getTimestamp();
                $attachmentUserId = $attachmentsFile -> getActiveSheet() -> getCell("M".$x) -> getValue();
                $attachmentUrl = $attachmentsFile -> getActiveSheet() -> getCell("K".$x) -> getValue();
                $attachmentTitleArray = explode("\\", $attachmentUrl);
                $attachmentTitle = end($attachmentTitleArray);

                $attachment = mysqli_query($mysqli, "INSERT INTO attachments (VIOLATION_ID, DIVISION_ID, TITLE, SIZE, MIME_TYPE, URL, USER_ID, DATE_ADDED) VALUES ($id, $divisionId, '$attachmentTitle', 10, 'NONE', '$attachmentUrl', $userId, $attachmentAddedUnix)");
                if (!$attachment) {
                    echo "Не удалось выполнить запрос2: (" . $mysqli -> errno . ") " . $mysqli -> error;
                    return false;
                }

                echo("attachment = ".$attachmentTitle.", added = ".$attachmentAdded -> getTimestamp()."<br>");
                $attachmentsFile -> getActiveSheet() -> setCellValueByColumnAndRow(13, $x, 'checked');
            }
        }
        echo("<br><br>");
    }

    $attachmentsWriter -> save($_SERVER["DOCUMENT_ROOT"].$DS."attachments.xls");

?>