<?php
    require_once("config.php");

    $postdata = json_decode(file_get_contents("php://input"));
    $id = $postdata -> data -> id;

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

    echo json_encode(true);
?>