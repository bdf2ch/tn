<?php

    require_once $_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."serverside".DIRECTORY_SEPARATOR."libs".DIRECTORY_SEPARATOR."xtemplate".DIRECTORY_SEPARATOR."xtemplate.class.php";
    require_once $_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."serverside".DIRECTORY_SEPARATOR."api.php";

    if (isset($_COOKIE["tn_user_id"])) {
        $template = new XTemplate($_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."serverside".DIRECTORY_SEPARATOR."templates".DIRECTORY_SEPARATOR."application.html");
        $template -> assign("INITIAL_DATA", json_encode(init()));
    } else {
        $template = new XTemplate($_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."serverside".DIRECTORY_SEPARATOR."templates".DIRECTORY_SEPARATOR."authorization.html");
    }

    $template -> parse("main");
    $template -> out("main");
?>