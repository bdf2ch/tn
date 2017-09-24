<?php
    require_once "config.php";

    //echo(var_dump($_FILES));

    if (sizeof($_POST["file"]) > 0) {

        $length = sizeof($_POST["file"]);
        if ($length > 0) {
            $files = array_chunk($_POST["file"], 5);
            //echo(var_dump($files));

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
            $storage_ = mysqli_fetch_assoc($division);
            $storage = $storage["FILE_STORAGE_HOST"];
            $attachments = array();

            for ($i = 0; $i < sizeof($files); $i++) {
                if ($files[$i][4] == 0) {
                    echo("Размер загружаемого файла равен 0");
                    return false;
                }

                $encoding = mb_detect_encoding($files[$i][0]);
                $rawName = $files[$i][0];
                $name = mb_convert_encoding($files[$i][0], "UTF-8", $encoding);
                $name1251 = mb_convert_encoding($files[$i][0], "WINDOWS-1251", $encoding);
                $tmpName  = $files[$i][2];
                $size = $files[$i][4];
                $type = $files[$i][1];
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

                $result = mysqli_fetch_assoc($query);
                array_push($attachments, $result);
            }
        }
        echo(json_encode($attachments));


        /*
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
        */
    } else {
        echo("Загружаемый файл отсутствует");
        return false;
    }

?>
