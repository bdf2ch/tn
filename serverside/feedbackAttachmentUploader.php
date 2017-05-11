<?php
    require_once $_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."serverside".DIRECTORY_SEPARATOR."config.php";
    $DS = DIRECTORY_SEPARATOR;

    if (isset($_FILES["file"])) {

        if ($_FILES["file"]["size"] == 0) {
            echo("Размер загружаемого файла равен 0");
            return false;
        }

        $serviceId = $_POST["serviceId"];
        $messageId = $_POST["messageId"];
        $userId = $_POST["userId"];

        if (!file_exists($_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId)) {
            echo("Папка 'uploads/'".$serviceId." не найдена");
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

        if ($messageId == 0) {
            $time = time();
            $query = mysqli_query($mysqli, "INSERT INTO feedback_messages (USER_ID, MESSAGE, TIMESTAMP) VALUES ($userId, '', $time)");
            if (!$query) {
                echo "Не удалось выполнить запрос: (".$mysqli -> errno.") ".$mysqli -> error;
            }
            $messageId = mysqli_insert_id($mysqli);
        }



        if (!file_exists($_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId.$DS."feedback".$DS.$messageId)) {
            if (!mkdir($_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId.$DS."feedback".$DS.$messageId, 0777)) {
                echo("Не удалось создать папку '".$messageId."'");
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
        $url = "/uploads/".$serviceId."/"."feedback"."/".$messageId."/".$name;

        if (!move_uploaded_file($tmpName, $_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId.$DS."feedback".$DS.$messageId.$DS.$name)) {
            echo("Не удалось переместить загруженный файл ".$_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId.$DS."feedback".$DS.$messageId.$DS.$name);
            return false;
        }

        $query = mysqli_query($mysqli, "INSERT INTO feedback_attachments (MESSAGE_ID, TITLE, MIME_TYPE, SIZE, URL) VALUES ($messageId, '$name', '$type', $size, '$url')");
        if (!$query) {
            echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
        }

        $id = mysqli_insert_id($mysqli);
        $query = mysqli_query($mysqli, "SELECT * FROM feedback_attachments WHERE ID = $id");
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