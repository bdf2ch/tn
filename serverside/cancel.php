<?php
    $DS = DIRECTORY_SEPARATOR;
    require_once($_SERVER["DOCUMENT_ROOT"].$DS."serverside".$DS."config.php");

    function rmdir_recursive($dir) {
    	$it = new RecursiveDirectoryIterator($dir);
    	$it = new RecursiveIteratorIterator($it, RecursiveIteratorIterator::CHILD_FIRST);
    	foreach($it as $file) {
    		if ('.' === $file -> getBasename() || '..' ===  $file -> getBasename()) continue;
    		if ($file -> isDir())
    		    rmdir($file -> getPathname());
    		else
    		    unlink($file -> getPathname());
    	}
    	rmdir($dir);
    }

    $postdata = json_decode(file_get_contents("php://input"));
    $serviceId = $postdata -> data -> serviceId;
    $violationId = $postdata -> data -> violationId;
    $departmentId = $postdata -> data -> departmentId;

    $mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
    if ($mysqli -> connect_errno) {
        echo "Не удалось подключиться к MySQL: " . $mysqli -> connect_error;
    }

    $query = mysqli_query($mysqli, "DELETE FROM violations WHERE ID = $violationId");
    if (!$query) {
        echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
    }

    $query = mysqli_query($mysqli, "DELETE FROM attachments WHERE VIOLATION_ID = $violationId");
    if (!$query) {
        echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
    }


    /*
    if (file_exists($_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId.$DS.$departmentId.$DS.$violationId)) {
        foreach(scandir($_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId.$DS.$departmentId.$DS.$violationId) as $file) {
            if ('.' === $file || '..' === $file) continue;
                if (is_dir($_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId.$DS.$departmentId.$DS.$violationId.$DS.$file))
                    rmdir_recursive($_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId.$DS.$departmentId.$DS.$violationId.$DS.$file);
                else
                    unlink($_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId.$DS.$departmentId.$DS.$violationId.$DS.$file);
            }
            rmdir($_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId.$DS.$departmentId.$DS.$violationId);
    }
    */

    if (file_exists($_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId.$DS.$departmentId.$DS.$violationId)) {
        rmdir_recursive($_SERVER["DOCUMENT_ROOT"].$DS."uploads".$DS.$serviceId.$DS.$departmentId.$DS.$violationId);
    }

    echo json_encode(true);
?>