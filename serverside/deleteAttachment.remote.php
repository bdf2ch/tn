<?php

    $DS = DIRECTORY_SEPARATOR;
    require_once $_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."config.php";

    $postdata = json_decode(file_get_contents("php://input"));
    $serviceId = $postdata -> serviceId;
    $attachmentId = $postdata -> attachmentId;

    $link = new mysqli($db_host, $db_user, $db_password, $db_name);
    if ($link -> connect_errno) {
        echo "Не удалось подключиться к MySQL: ".$link -> connect_error;
        return false;
    }

    $encoding = mysqli_query($link, "SET NAMES utf8");
    if (!$encoding) {
        echo "Не удалось выполнить запрос: (" . $link -> errno . ") " . $link -> error;
    }

    $selectAttachmentQuery = mysqli_query($link, "SELECT * FROM attachments WHERE ID = $attachmentId");
    if (!$selectAttachmentQuery) {
        echo "Не удалось выполнить запрос1: (".$link -> errno.") ".$link -> error;
        return false;
    }
    $attachment = mysqli_fetch_assoc($selectAttachmentQuery);
    $violationId = $attachment["VIOLATION_ID"];
    $attachmentTitle = $attachment["TITLE"];


    if (mysqli_num_rows($selectAttachmentQuery) > 0) {
        $deleteAttachmentQuery = mysqli_query($link, "DELETE FROM attachments WHERE ID = $attachmentId");
        if (!$deleteAttachmentQuery) {
            echo "Не удалось выполнить запрос2: (".$link -> errno.") ".$link -> error;
            return false;
        }

        if (file_exists($_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId.$DS.$violationId.$DS.$attachmentTitle)) {
            if (!unlink($_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId.$DS.$violationId.$DS.$attachmentTitle)) {
                echo "Не удалось удалить файл";
                return false;
            } else {
                echo(json_encode(true));
                return true;
            }
        } else {
            echo("Файлик ".$attachmentTitle." не найден");
            return false;
        }
    } else {
        echo "Файл не найден";
        echo(json_encode(false));
        return false;
    }

?>