<?php

    $DS = DIRECTORY_SEPARATOR;
    require_once $_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."config.php";
    require_once $_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."libs".$DS."phpexcel".$DS."Classes".$DS."PHPExcel.php";

    //stream_context_set_default(['http'=>['proxy'=>'kolu-proxy2.nw.mrsksevzap.ru:8080']]);

    $mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
    if ($mysqli -> connect_errno) {
        echo "Не удалось подключиться к MySQL: ".$mysqli -> connect_error;
        return false;
    }

    date_default_timezone_set("Europe/Moscow");
    mysqli_set_charset ($mysqli, "utf8");

    $encoding = mysqli_query($mysqli, "SET NAMES utf8");
    if (!$encoding) {
        echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
        return false;
    }

    $attachments_query = mysqli_query($mysqli, "SELECT * FROM attachments");
    if (!$attachments_query) {
        echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
        return false;
    }

    function get_http_response_code($url) {
        $headers = get_headers($url, 1);
        return $headers[0];
    }

    $counter = 0;
    while ($attachment = mysqli_fetch_assoc($attachments_query)) {
        $url = $attachment['URL'];
        if (!strpos($url, "kolu-wfs")) {
            $url = urlencode("http://wfs-prim.mrsksevzap.ru/".$url);
        } else {
            $url = urlencode($url);
        }


        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_NOBODY, true);
        $result = curl_exec($curl);
        if ($result !== false) {
          $statusCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
          if ($statusCode == 404) {
            echo "URL Not Exists";
          } else {
             echo "URL Exists";
          }
        } else {
          echo "URL not Exists";
        }
    }

    echo("total not found: ".$counter);

?>