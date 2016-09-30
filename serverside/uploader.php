<?php
    require_once $_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."serverside".DIRECTORY_SEPARATOR."config.php";

    if (isset($_FILES["file"])) {

        if ($_FILES["file"]["size"] == 0) {
            echo("Размер загружаемого файла равен 0");
            return false;
        }

        if (!file_exists($_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."uploads")) {
            echo("Папка 'uploads' не найдена");
            return false;
        }

        $link = mysql_connect($db_host, $db_user, $db_password);
        if (!$link) {
            echo("Error connecting DB: ".mysql_error());
            return false;
        }

        $db = mysql_select_db($db_name, $link);
        if (!$db) {
            echo("Error selecting DB: ".mysql_error());
            return false;
        }

        $encoding = mysql_query("SET NAMES utf8");
        if (!$encoding) {
            echo("Error setting encoding: ".mysql_error());
            return false;
        }

        $divisionId = $_POST["divisionId"];
        $violationId = 0;
        if ($_POST["violationId"] == 0) {
            $query = mysql_query("INSERT INTO violations (DIVISION_ID, USER_ID, ESK_GROUP_ID, ESK_OBJECT, DESCRIPTION, DATE_HAPPENED, DATE_ADDED) VALUES (0, 0, 0, '', '', 0, 0)", $link);
            if (!$query) {
                echo("Error adding new violation");
                return false;
            }
            $violationId = mysql_insert_id();
        } else
            $violationId = $_POST["violationId"];

        if (!file_exists($_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."uploads".DIRECTORY_SEPARATOR.$violationId)) {
            if (!mkdir($_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."uploads".DIRECTORY_SEPARATOR.$violationId)) {
                echo("Не удалось создать папку '".$violationId."'");
                return false;
            }
        }

        $encoding = mb_detect_encoding($_FILES["file"]["name"]);
        $rawName = $_FILES["file"]["name"];
        $name = mb_convert_encoding($_FILES["file"]["name"], "UTF-8", $encoding);
        $name1251 = mb_convert_encoding($_FILES["file"]["name"], "WINDOWS-1251", $encoding);
        $tmpName  = $_FILES["file"]["tmp_name"];
        $size = $_FILES["file"]["size"];
        $type = $_FILES["file"]["type"];
        $url = "/uploads/".$violationId."/".$name;
        $added = time();

        if (!move_uploaded_file($tmpName, $_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."uploads".DIRECTORY_SEPARATOR.$violationId.DIRECTORY_SEPARATOR.$name1251)) {
            echo("Не удалось переместить загруженный файл");
            return false;
        }

        $query = mysql_query("INSERT INTO attachments (VIOLATION_ID, DIVISION_ID, TITLE, SIZE, MIME_TYPE, URL, DATE_ADDED) VALUES ($violationId, $divisionId, '$name', $size, '$type', '$url', $added)", $link);
        if (!$query) {
            echo("Не удалось выполнить запрос");
            return false;
        }

        $id = mysql_insert_id();
        $query = mysql_query("SELECT * FROM attachments WHERE ID = $id", $link);
        if (!$query) {
            echo("Не удалось выполнить запрос - выбрать информацию о загруженном файле");
            return false;
        }

        $result = mysql_fetch_assoc($query);
        echo(json_encode($result));
    } else {
        echo("Загружаемый файл отсутствует");
        return false;
    }

?>