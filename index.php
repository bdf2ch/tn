<?php
    //setcookie("tn_user_id", 1, -1, "/");

    $ds = DIRECTORY_SEPARATOR;
    require_once $_SERVER["DOCUMENT_ROOT"].$ds."serverside".$ds."libs".$ds."xtemplate".$ds."xtemplate.class.php";
    require_once $_SERVER["DOCUMENT_ROOT"].$ds."serverside".$ds."api.php";

    if (isset($_COOKIE["tn_user_id"])) {
        $template = new XTemplate($_SERVER["DOCUMENT_ROOT"].$ds."serverside".$ds."templates".$ds."application.html");
        $template -> assign("INITIAL_DATA", json_encode(init()));
    } else {
        $template = new XTemplate($_SERVER["DOCUMENT_ROOT"].$ds."serverside".$ds."templates".$ds."authorization.html");
    }

    $template -> parse("main");
    $template -> out("main");
?>