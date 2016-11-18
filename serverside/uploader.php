<?php
    require_once $_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."serverside".DIRECTORY_SEPARATOR."config.php";
    $DS = DIRECTORY_SEPARATOR;

    if (isset($_FILES["file"])) {

        if ($_FILES["file"]["size"] == 0) {
            echo("Размер загружаемого файла равен 0");
            return false;
        }

        $serviceId = $_POST["serviceId"];
        $departmentId = $_POST["departmentId"];

        if (!file_exists($_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId)) {
            echo("Папка 'uploads/'".$serviceId." не найдена");
            return false;
        }

        if (!file_exists($_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId.$DS.$departmentId)) {
            if (!mkdir($_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId.$DS.$departmentId)) {
                echo("Не удалось создать папку для филиала");
                return false;
            }
        }

        $mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
        if ($mysqli -> connect_errno) {
            echo "Не удалось подключиться к MySQL: " . $mysqli -> connect_error;
        }

        $encoding = mysqli_query($mysqli, "SET NAMES utf8");
        if (!$encoding) {
            echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
        }

        copy($_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."attachments".$DS);

        $divisionId = $_POST["divisionId"];
        $violationId = 0;
        if ($_POST["violationId"] == 0) {
            $query = mysqli_query($mysqli, "INSERT INTO violations (DIVISION_ID, USER_ID, ESK_GROUP_ID, ESK_OBJECT, DESCRIPTION, DATE_HAPPENED, DATE_ENDED, DURATION, DATE_ADDED) VALUES (0, 0, 0, '', '', 0, 0, 0, 0)");
            if (!$query) {
                echo "Не удалось выполнить запрос: (".$mysqli -> errno.") ".$mysqli -> error;
            }
            $violationId = mysqli_insert_id($mysqli);
        } else
            $violationId = $_POST["violationId"];

        if (!file_exists($_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId.$DS.$departmentId.$DS.$violationId)) {
            if (!mkdir($_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId.$DS.$departmentId.$DS.$violationId)) {
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
        $url = "/uploads/".$serviceId."/".$departmentId."/".$violationId."/".$name;
        $added = time();

        if (!move_uploaded_file($tmpName, $_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId.$DS.$departmentId.$DS.$violationId.$DS.$name1251)) {
            echo("Не удалось переместить загруженный файл");
            return false;
        }

        /*
        $query = mysql_query("INSERT INTO attachments (VIOLATION_ID, DIVISION_ID, TITLE, SIZE, MIME_TYPE, URL, DATE_ADDED) VALUES ($violationId, $divisionId, '$name', $size, '$type', '$url', $added)", $link);
        if (!$query) {
            echo("Не удалось выполнить запрос");
            return false;
        }
        */

        $query = mysqli_query($mysqli, "INSERT INTO attachments (VIOLATION_ID, DIVISION_ID, TITLE, SIZE, MIME_TYPE, URL, DATE_ADDED) VALUES ($violationId, $divisionId, '$name', $size, '$type', '$url', $added)");
        if (!$query) {
            echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
        }

        /*
        $id = mysql_insert_id();
        $query = mysql_query("SELECT * FROM attachments WHERE ID = $id", $link);
        if (!$query) {
            echo("Не удалось выполнить запрос - выбрать информацию о загруженном файле");
            return false;
        }
        */

        $id = mysqli_insert_id($mysqli);
        $query = mysqli_query($mysqli, "SELECT * FROM attachments WHERE ID = $id");
        if (!$query) {
            echo "Не удалось выполнить запрос - выбрать информацию о загруженном файле: (" . $mysqli -> errno . ") " . $mysqli -> error;
        }


        //$result = mysql_fetch_assoc($query);
        $result = mysqli_fetch_assoc($query);
        echo(json_encode($result));
    } else {
        echo("Загружаемый файл отсутствует");
        return false;
    }

?>