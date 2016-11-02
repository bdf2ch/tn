<?php
    require_once("config.php");

    $ds = DIRECTORY_SEPARATOR;
    $postdata = json_decode(file_get_contents("php://input"));
    $serviceId = $postdata -> data -> serviceId;
    $id = $postdata -> data -> id;
    $departmentId = $postdata -> data -> departmentId;

    $mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
    if ($mysqli -> connect_errno) {
        echo "Не удалось подключиться к MySQL: " . $mysqli -> connect_error;
    }

    $query = mysqli_query($mysqli, "DELETE FROM violations WHERE ID = $id");
    if (!$query) {
        echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
    }

    $query = mysqli_query($mysqli, "DELETE FROM attachments WHERE VIOLATION_ID = $id");
    if (!$query) {
        echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
    }

    if (file_exists($_SERVER["DOCUMENT_ROOT"].$ds."uploads".$ds.$serviceId.$ds.$departmentId.$ds.$id)) {
        foreach(scandir($_SERVER["DOCUMENT_ROOT"].$ds."uploads".$ds.$serviceId.$ds.$departmentId.$ds.$id) as $file) {
            if ('.' === $file || '..' === $file) continue;
                if (is_dir($_SERVER["DOCUMENT_ROOT"].$ds."uploads".$ds.$serviceId.$ds.$departmentId.$ds.$id.$ds.$file)) rmdir_recursive($_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."uploads".DIRECTORY_SEPARATOR.$serviceId.$ds.$departmentId.$ds.$id.$ds.$file);
                else unlink($_SERVER["DOCUMENT_ROOT"].$ds."uploads".$ds.$serviceId.$ds.$departmentId.$ds.$id.$ds.$file);
            }
            rmdir($_SERVER["DOCUMENT_ROOT"].$ds."uploads".$ds.$serviceId.$ds.$departmentId.$ds.$id);
    }


    echo json_encode(true);
?>