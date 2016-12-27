<?php
    require_once "config.php";

    if (isset($_POST["file_path"])) {

        if ($_POST["file_size"] == 0) {
            echo("Размер загружаемого файла равен 0");
            return false;
        }

        if (!file_exists($_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."uploads")) {
            echo("Папка 'uploads' не найдена");
            return false;
        }

        $mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
        if ($mysqli -> connect_errno) {
            echo "Не удалось подключиться к MySQL: " . $mysqli -> connect_error;
        }

        $encoding = mysqli_query($mysqli, "SET NAMES utf8");
        if (!$encoding) {
            echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
        }

	$serviceId = $_POST["serviceId"];        
	$divisionId = $_POST["divisionId"];
        $violationId = 0;
        if ($_POST["violationId"] == 0) {
            /*
            $query = mysql_query("INSERT INTO violations (DIVISION_ID, USER_ID, ESK_GROUP_ID, ESK_OBJECT, DESCRIPTION, DATE_HAPPENED, DATE_ADDED) VALUES (0, 0, 0, '', '', 0, 0)", $link);
            if (!$query) {
                echo("Error adding new violation");
                return false;
            }
            $violationId = mysql_insert_id();
            */

            $query = mysqli_query($mysqli, "INSERT INTO violations (DIVISION_ID, USER_ID, ESK_GROUP_ID, ESK_OBJECT, DESCRIPTION, DATE_HAPPENED, DATE_ADDED) VALUES (0, 0, 0, '', '', 0, 0)");
            if (!$query) {
                echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
            }
            $violationId = mysqli_insert_id($mysqli);
        } else
            $violationId = $_POST["violationId"];

        if (!file_exists($_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."uploads".DIRECTORY_SEPARATOR.$serviceId.DIRECTORY_SEPARATOR.$violationId)) {
            if (!mkdir($_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."uploads".DIRECTORY_SEPARATOR.$serviceId.DIRECTORY_SEPARATOR.$violationId, 0777)) {
                echo("Не удалось создать папку '".$violationId."'");
                return false;
            }
        }

        $division = mysqli_query($mysqli, "SELECT * FROM divisions WHERE ID = $divisionId");
        if (!$division) {
            echo(false);
        }

        $storage = mysqli_fetch_assoc($division)["FILE_STORAGE_HOST"];
        $encoding = mb_detect_encoding($_POST["file_name"]);
        $rawName = $_POST["file_name"];
        $name = mb_convert_encoding($_POST["file_name"], "UTF-8", $encoding);
        $name1251 = mb_convert_encoding($_POST["file_name"], "WINDOWS-1251", $encoding);
        $tmpName  = $_POST["file_path"];
        $size = $_POST["file_size"];
        $type = $_POST["file_content_type"];
        $url = $storage."/uploads/".$serviceId."/".$violationId."/".$name;
        $added = time();

        if (!copy($tmpName, $_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."uploads".DIRECTORY_SEPARATOR.$serviceId.DIRECTORY_SEPARATOR.$violationId.DIRECTORY_SEPARATOR.$name)) {
            echo("Не удалось переместить загруженный файл ".$tmpName);
            return false;
        } else {
		unlink($tmpName);				
	}


    $query = mysqli_query($mysqli, "INSERT INTO attachments (VIOLATION_ID, DIVISION_ID, TITLE, SIZE, MIME_TYPE, URL, DATE_ADDED) VALUES ($violationId, $divisionId, '$name', $size, '$type', '$url', $added)");
    if (!$query) {
        echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
    }


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
