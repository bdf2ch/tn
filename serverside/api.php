<?php
    session_start();
    require_once $_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."serverside".DIRECTORY_SEPARATOR."config.php";
    date_default_timezone_set("Europe/Moscow");

    $mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
    if ($mysqli -> connect_errno) {
        echo "Не удалось подключиться к MySQL: ".$mysqli -> connect_error;
        return false;
    }

    $encoding = mysqli_query($mysqli, "SET NAMES utf8");
    if (!$encoding) {
        echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
        return false;
    }

    $postdata = json_decode(file_get_contents("php://input"));
    $action = $postdata -> action;
    switch ($action) {
        case "getViolationById":
            getViolationById($postdata -> data);
            break;
        case "searchViolationById":
            searchViolationById($postdata -> data);
            break;
        case "addViolation":
            addViolation($postdata -> data);
            break;
        case "editViolation":
            editViolation($postdata -> data);
            break;
        case "cancelViolation":
            cancelViolation($postdata -> data);
            break;
        case "getViolationsByDivisionId":
            getViolationsByDivisionId($postdata -> data);
            break;
        case "login":
            login($postdata -> data);
            break;
        case "logout":
            logout($postdata -> data);
            break;
        case "addUser":
            addUser($postdata -> data);
            break;
        case "editUser":
            editUser($postdata -> data);
            break;
        case "addDivision":
            addDivision($postdata -> data);
            break;
        case "editDivision":
            editDivision($postdata -> data);
            break;
        case "saveSettings":
            saveSettings($postdata -> data);
            break;
    }



    /**
    * Собирает данные для инициализации
    **/
    function init () {
        global $db_host;
        global $db_user;
        global $db_password;
        global $db_name;
        global $itemsOnPage;
        global $mysqli;

        $result = new stdClass();
        $result -> settings = array();
        $result -> divisions = array();
        $result -> users = array();
        $result -> eskGroups = array();
        $result -> violations = array();
        $result -> total = 0;
        $thursday = strtotime("last thursday");
        //$result -> thursday = date('W', $thursday) == date('W') ? $thursday - (7 * 86400) : $thursday;
        $result -> thursday = $thursday;

        $controlPeriodStartWeekDay = "";
        $controlPeriodStartWeekDayTitle = "";
        $controlPeriodStartHours = 0;
        $controlPeriodStartMinutes = 0;
        $controlPeriodEndWeekDay = "";
        $controlPeriodEndWeekDayTitle = "";
        $controlPeriodEndHours = 0;
        $controlPeriodEndMinutes = 0;


        $userId = $_COOKIE["tn_user_id"];
        $user = mysqli_query($mysqli, "SELECT * FROM users WHERE ID = $userId");
        if (!$user) {
            echo "Не удалось выполнить запрос1: (" . $mysqli -> errno . ") " . $mysqli -> error;
            return false;
        }
        $result -> user = mysqli_fetch_assoc($user);


        $settings = mysqli_query($mysqli, "SELECT * FROM settings");
        if (!$settings) {
            echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
            return false;
        }
        while ($setting = mysqli_fetch_assoc($settings)) {
            switch ($setting["CODE"]) {
                case "control-period-start-weekday":
                    $controlPeriodStartWeekDay = intval($setting["VALUE"]);
                    switch ($controlPeriodStartWeekDay) {
                        case 1:
                            $controlPeriodStartWeekDayTitle = "monday";
                            break;
                        case 2:
                            $controlPeriodStartWeekDayTitle = "tuesday";
                            break;
                        case 3:
                            $controlPeriodStartWeekDayTitle = "wednesday";
                            break;
                        case 4:
                            $controlPeriodStartWeekDayTitle = "thursday";
                            break;
                        case 5:
                            $controlPeriodStartWeekDayTitle = "friday";
                            break;
                        case 6:
                            $controlPeriodStartWeekDayTitle = "saturday";
                            break;
                        case 7:
                            $controlPeriodStartWeekDayTitle = "sunday";
                            break;
                    }
                    break;
                case "control-period-start-hours":
                    $controlPeriodStartHours = intval($setting["VALUE"]);
                    break;
                case "control-period-start-minutes":
                    $controlPeriodStartMinutes = intval($setting["VALUE"]);
                    break;
                case "control-period-end-weekday":
                    $controlPeriodEndWeekDay = intval($setting["VALUE"]);
                    switch ($controlPeriodEndWeekDay) {
                        case 1:
                            $controlPeriodEndWeekDayTitle = "monday";
                            break;
                        case 2:
                            $controlPeriodEndWeekDayTitle = "tuesday";
                            break;
                        case 3:
                            $controlPeriodEndWeekDayTitle = "wednesday";
                            break;
                        case 4:
                            $controlPeriodEndWeekDayTitle = "thursday";
                            break;
                        case 5:
                            $controlPeriodEndWeekDayTitle = "friday";
                            break;
                        case 6:
                            $controlPeriodEndWeekDayTitle = "saturday";
                            break;
                        case 7:
                            $controlPeriodEndWeekDayTitle = "sunday";
                            break;
                    }
                    break;
                case "control-period-end-hours":
                    $controlPeriodEndHours = intval($setting["VALUE"]);
                    break;
                case "control-period-end-minutes":
                    $controlPeriodEndMinutes = intval($setting["VALUE"]);
                    break;
            }
            array_push($result -> settings, $setting);
        }
        $today = strtotime("today 0 hours 0 minutes");
        $todayWeekDay = intval(date("N", $today));
        $result -> startPeriod = strtotime($controlPeriodStartWeekDayTitle." ".$controlPeriodStartHours." hours ".$controlPeriodStartMinutes." minutes");
        $result -> endPeriod = strtotime($controlPeriodEndWeekDayTitle." ".$controlPeriodEndHours." hours ".$controlPeriodEndMinutes." minutes");

        // День начала = текущему дню, время начала > текущего времени, день конца = текущему дню, время конца > текущего времени
        if ($todayWeekDay == $controlPeriodStartWeekDay && strtotime($controlPeriodStartWeekDayTitle." ".$controlPeriodStartHours." hours ".$controlPeriodStartMinutes." minutes") > time() && $todayWeekDay == $controlPeriodEndWeekDay && strtotime($controlPeriodEndWeekDayTitle." ".$controlPeriodEndHours." hours ".$controlPeriodEndMinutes." minutes") > time()) {
            $result -> startPeriod = strtotime("-1 week", $result -> startPeriod);
        }

        // День начала = текущему дню, время начала > текущего времени, день конца = текущему дню, время конца < текущего времени
        if ($todayWeekDay == $controlPeriodStartWeekDay && strtotime($controlPeriodStartWeekDayTitle." ".$controlPeriodStartHours." hours ".$controlPeriodStartMinutes." minutes") > time() && $todayWeekDay == $controlPeriodEndWeekDay && strtotime($controlPeriodEndWeekDayTitle." ".$controlPeriodEndHours." hours ".$controlPeriodEndMinutes." minutes") < time()) {
            $result -> startPeriod = strtotime("-1 week", $result -> startPeriod);
        }

        // День начала = текущему дню, время начала < текущего времени, день конца = текущему дню, время конца > текущего времени
        if ($todayWeekDay == $controlPeriodStartWeekDay && strtotime($controlPeriodStartWeekDayTitle." ".$controlPeriodStartHours." hours ".$controlPeriodStartMinutes." minutes") < time() && $todayWeekDay == $controlPeriodEndWeekDay && strtotime($controlPeriodEndWeekDayTitle." ".$controlPeriodEndHours." hours ".$controlPeriodEndMinutes." minutes") > time()) {
            $result -> endPeriod = strtotime("+1 week", $result -> endPeriod);
        }

        // День начала = текущему дню, время начала < текущего времени, день конца = текущему дню, время конца < текущего времени
        if ($todayWeekDay == $controlPeriodStartWeekDay && strtotime($controlPeriodStartWeekDayTitle." ".$controlPeriodStartHours." hours ".$controlPeriodStartMinutes." minutes") < time() && $todayWeekDay == $controlPeriodEndWeekDay && strtotime($controlPeriodEndWeekDayTitle." ".$controlPeriodEndHours." hours ".$controlPeriodEndMinutes." minutes") < time()) {
            $result -> endPeriod = strtotime("+1 week", $result -> endPeriod);
        }

        if ($todayWeekDay < $controlPeriodStartWeekDay) {
            $result -> startPeriod = strtotime("-1 week", $result -> startPeriod);
        }

        $divisions = mysqli_query($mysqli, "SELECT ID, PARENT_ID, TITLE_FULL, SORT_ID, TITLE_SHORT, IS_DEPARTMENT, PATH, FILE_STORAGE_HOST, (SELECT COUNT(*) FROM violations WHERE DIVISION_ID = divisions.ID AND DATE_HAPPENED >= ".$result -> startPeriod." AND DATE_HAPPENED <= ".$result -> endPeriod.") AS VIOLATIONS_ADDED, (SELECT COUNT(*) FROM attachments WHERE DIVISION_ID = divisions.ID AND DATE_ADDED > ".$result -> startPeriod." AND DATE_ADDED < ".$result -> endPeriod.") AS ATTACHMENTS_ADDED FROM divisions ORDER BY PARENT_ID ASC");
        if (!$divisions) {
            echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
            return false;
        }
        while ($division = mysqli_fetch_assoc($divisions)) {
            array_push($result -> divisions, $division);
        }


        $users = mysqli_query($mysqli, "SELECT * FROM users");
        if (!$users) {
            echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
            return false;
        }
        while ($user = mysqli_fetch_assoc($users)) {
            array_push($result -> users, $user);
        }


        $eskGroups = mysqli_query($mysqli, "SELECT * FROM esk_groups");
        if (!$eskGroups) {
            echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
            return false;
        }
        while ($group = mysqli_fetch_assoc($eskGroups)) {
            array_push($result -> eskGroups, $group);
        }


        $d = mysqli_query($mysqli, "SELECT * FROM divisions WHERE PATH LIKE '%/".$result -> user["DIVISION_ID"]."/%'");
        if (!$d) {
            echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
            return false;
        }
        $divs = " (";
        while ($division = mysqli_fetch_assoc($d)) {
            $divs = $divs.$division["ID"].",";
        }
        $divs = rtrim($divs, ",");
        $divs = $divs.")";


        $violations = mysqli_query($mysqli, "SELECT * FROM violations WHERE DIVISION_ID IN $divs ORDER BY DATE_HAPPENED DESC LIMIT 0, $itemsOnPage");
        if (!$violations) {
            echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
            return false;
        }
        while ($violation = mysqli_fetch_assoc($violations)) {
            $violationItem = new stdClass();
            $violationItem -> violation = $violation;
            $userId = intval($violation["USER_ID"]);
            $violationId = intval($violation["ID"]);

            $user = mysqli_query($mysqli, "SELECT * FROM users WHERE ID = $userId");
            if (!$user) {
                echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
                return false;
            }
            $violationItem -> user = mysqli_fetch_assoc($user);
            $violationItem -> attachments = array();

            $attachments = mysqli_query($mysqli, "SELECT * FROM attachments WHERE VIOLATION_ID = $violationId");
            if (!$attachments) {
                echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
                return false;
            }
            while ($attachment = mysqli_fetch_assoc($attachments)) {
                array_push($violationItem -> attachments, $attachment);
            }
            array_push($result -> violations, $violationItem);
        }


        $total = mysqli_query($mysqli, "SELECT COUNT(*) AS total FROM violations WHERE DIVISION_ID IN $divs");
        if (!$total) {
            echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
            return false;
        }
        $result -> total = intval(mysqli_fetch_assoc($total)["total"]);

        return $result;
    }


    function getViolationById ($data) {
        global $db_host;
        global $db_user;
        global $db_password;
        global $db_name;
        global $mysqli;
        $id = $data -> id;
        $result = new stdClass();
        $result -> attachments = array();

        $query = mysqli_query($mysqli, "SELECT * FROM violations WHERE ID = $id LIMIT 1");
        if (!$query) {
            echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
            return false;
        }

        if (mysqli_num_rows($query) > 0) {
            $violation = mysqli_fetch_assoc($query);
            $result -> violation = $violation;

            $userId = $violation["USER_ID"];
            $user = mysqli_query($mysqli, "SELECT * FROM users WHERE ID = $userId LIMIT 1");
            if (!$user) {
                echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
                return false;
            }
            $result -> user = mysqli_fetch_assoc($user);

            $attachments = mysqli_query($mysqli, "SELECT * FROM attachments WHERE VIOLATION_ID = $id");
            if (!$attachments) {
                echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
                return false;
            }
            while ($attachment = mysqli_fetch_assoc($attachments)) {
                array_push($result -> attachments, $attachment);
            }

            echo(json_encode($result));
        } else
            echo(json_encode(false));
    }




    function searchViolationById ($data) {
        global $mysqli;
        $id = $data -> id;
        $result = new stdClass();
        $result -> attachments = array();

        $query = mysqli_query($mysqli, "SELECT * FROM violations WHERE ID = $id LIMIT 1");
        if (!$query) {
            //echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
            echo(json_encode(false));
            return false;
        }

        $violation = mysqli_fetch_assoc($query);
        $result -> violation = $violation;
        $userId = $violation["USER_ID"];
        $violationAuthor = mysqli_query($mysqli, "SELECT * FROM users WHERE ID = $userId");
        if (!$violationAuthor) {
            //echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
            echo(json_encode(false));
            return false;
        }
        $result -> user = mysqli_fetch_assoc($violationAuthor);

        $attachments = mysqli_query($mysqli, "SELECT * FROM attachments WHERE VIOLATION_ID = $id");
        if (!$attachments) {
            //echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
            echo(json_encode(false));
            return false;
        }
        while ($attachment = mysqli_fetch_assoc($attachments)) {
            array_push($result -> attachments, $attachment);
        }

        echo(json_encode($result));
        return true;
    }





    function addViolation ($data) {
        global $db_host;
        global $db_user;
        global $db_password;
        global $db_name;
        global $mysqli;

        $id = $data -> id;
        $userId = $data -> userId;
        $divisionId = $data -> divisionId;
        $eskGroupId = $data -> eskGroupId;
        $eskObject = $data -> eskObject;
        $happened = $data -> happened;
        $ended = $data -> ended;
        $duration = $ended - $happened;
        $description = $data -> description;
        $added = time();
        $result = new stdClass();
        $result -> attachments = array();

        if ($id != 0) {
            $query = mysqli_query($mysqli, "UPDATE violations SET USER_ID = $userId, DIVISION_ID = $divisionId, ESK_GROUP_ID = $eskGroupId, ESK_OBJECT = '$eskObject', DESCRIPTION = '$description', DATE_HAPPENED = $happened, DATE_ENDED = $ended, DURATION = $duration, DATE_ADDED = $added WHERE ID = $id");
            if (!$query) {
                echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
                return false;
            }

            $query = mysqli_query($mysqli, "UPDATE attachments SET DIVISION_ID = $divisionId WHERE VIOLATION_ID = $id");
            if (!$query) {
                echo "Не удалось выполнить запрос: (" . $mysqli -> errno . ") " . $mysqli -> error;
                return false;
            }

            $violation = mysqli_query($mysqli, "SELECT * FROM violations WHERE ID = $id");
            if (!$violation) {
                echo(json_encode(false));
                return false;
            }
            $result -> violation = mysqli_fetch_assoc($violation);

            $user = mysqli_query($mysqli, "SELECT * FROM users WHERE ID = $userId");
            if (!$user) {
                echo(json_encode(false));
                return false;
            }
            $result -> user = mysqli_fetch_assoc($user);

            $attachments = mysqli_query($mysqli, "SELECT * FROM attachments WHERE VIOLATION_ID = $id");
            if (!$attachments) {
                echo(json_encode(false));
                return false;
            }
            while ($attachment = mysqli_fetch_assoc($attachments)) {
                array_push($result -> attachments, $attachment);
            }

            echo(json_encode($result));
        } else {
            $query = mysqli_query($mysqli, "INSERT INTO violations (USER_ID, DIVISION_ID, ESK_GROUP_ID, ESK_OBJECT, DESCRIPTION, DATE_HAPPENED, DATE_ENDED, DURATION, DATE_ADDED) VALUES ($userId, $divisionId, $eskGroupId, '$eskObject', '$description', $happened, $ended, $duration, $added)");
            if (!$query) {
                echo(json_encode(false));
                return false;
            }

            $id = mysqli_insert_id($mysqli);
            $violation = mysqli_query($mysqli, "SELECT * FROM violations WHERE ID = $id");
            if (!$violation) {
                echo(json_encode(false));
                return false;
            }
            $result -> violation = mysqli_fetch_assoc($violation);

            $user = mysqli_query($mysqli, "SELECT * FROM users WHERE ID = $userId");
            if (!$user) {
                echo(json_encode(false));
                return false;
            }
            $result -> user = mysqli_fetch_assoc($user);

            echo(json_encode($result));
        }
    }





    function editViolation ($data) {
        global $db_host;
        global $db_user;
        global $db_password;
        global $db_name;
        global $mysqli;

        $id = $data -> id;
        $userId = $data -> userId;
        $divisionId = $data -> divisionId;
        $eskGroupId = $data -> eskGroupId;
        $eskObject = $data -> eskObject;
        $happened = $data -> happened;
        $ended = $data -> ended;
        $description = $data -> description;
        $isConfirmed = $data -> isConfirmed;
        $duration = $ended - $happened;

        $query = mysqli_query($mysqli, "UPDATE violations SET USER_ID = $userId, DIVISION_ID = $divisionId, ESK_GROUP_ID = $eskGroupId, ESK_OBJECT = '$eskObject', DESCRIPTION = '$description', DATE_ENDED = $ended, DURATION = $duration, IS_CONFIRMED = $isConfirmed WHERE ID = $id");
        if (!$query) {
            echo(json_encode(false));
            return false;
        }

        $violation = mysqli_query($mysqli, "SELECT * FROM violations WHERE ID = $id");
        if (!$violation) {
            echo(json_encode(false));
            return false;
        }

        echo(json_encode(mysqli_fetch_assoc($violation)));
    }





    function cancelViolation ($data) {
        global $db_host;
        global $db_user;
        global $db_password;
        global $db_name;
        global $mysqli;
        $id = $data -> id;

        $violation = mysqli_query($mysqli, "DELETE FROM violations WHERE ID = $id");
        if (!$violation) {
            echo(json_encode(false));
            return false;
        }

        $attachments = mysqli_query($mysqli, "DELETE FROM attachments WHERE VIOLATION_ID = $id");
        if (!$attachments) {
            echo(json_encode(false));
            return false;
        }

        echo json_encode(true);
    }





    function getViolationsByDivisionId ($data) {
        global $db_host;
        global $db_user;
        global $db_password;
        global $db_name;
        global $itemsOnPage;
        global $mysqli;
        $result = array();

        $violationId = $data -> violationId;
        $divisionId = $data -> divisionId;
        $eskGroupId = $data -> eskGroupId;
        $startDate = $data -> startDate;
        $endDate = $data -> endDate == 0 ? time() : $data -> endDate;
        $start = $data -> start;
        $limit = $data -> limit;
        //if ($endDate != 0 || $startDate != 0 || $eskGroupId != 0)
        //    $limit = "";
        //else
        //    $limit = " LIMIT $start, $itemsOnPage";

        $eskGroupQuery = "";
        if ($eskGroupId != 0) {
            $eskGroupQuery = " AND ESK_GROUP_ID = $eskGroupId";
            //$limit = "";
        }


        $divisions = mysqli_query($mysqli, "SELECT * FROM divisions WHERE PATH LIKE '%/$divisionId/%'");
        if (!$divisions) {
            echo(json_encode(false));
            return false;
        }

        $divs = " (";
        while ($division = mysqli_fetch_assoc($divisions)) {
            $divs = $divs.$division["ID"].",";
        }
        $divs = rtrim($divs, ",");
        $divs = $divs.")";

        $total = mysqli_query($mysqli, "SELECT COUNT(*) AS total FROM violations WHERE DIVISION_ID IN $divs AND DATE_HAPPENED >= $startDate AND DATE_HAPPENED <= $endDate".$eskGroupQuery);
        if (!$total) {
            echo(json_encode(false));
            return false;
        }

        $violations = mysqli_query($mysqli, "SELECT * FROM violations WHERE DIVISION_ID IN $divs AND DATE_HAPPENED >= $startDate AND DATE_HAPPENED <= $endDate".$eskGroupQuery." ORDER BY DATE_HAPPENED DESC LIMIT $start, $limit");
        if (!$violations) {
            echo(json_encode(false));
            return false;
        }

        while ($violation = mysqli_fetch_assoc($violations)) {
            $violationItem = new stdClass();
            $violationItem -> attachments = array();
            $violationItem -> violation = $violation;
            $violationItem -> total = intval(mysqli_fetch_assoc($total)["total"]);
            $userId = intval($violation["USER_ID"]);

            $user = mysqli_query($mysqli, "SELECT * FROM users WHERE ID = $userId LIMIT 1");
            if (!$user) {
                echo(json_encode(false));
                return false;
            }
            $violationItem -> user = mysqli_fetch_assoc($user);

            $violationId = intval($violation["ID"]);

            $attachments = mysqli_query($mysqli, "SELECT * FROM attachments WHERE VIOLATION_ID = $violationId");
            if (!$attachments) {
                echo(json_encode(false));
                return false;
            }
            while ($attachment = mysqli_fetch_assoc($attachments)) {
                array_push($violationItem -> attachments, $attachment);
            }

            array_push($result, $violationItem);
        }

        echo(json_encode($result));
    }





    function login ($data) {
        global $db_host;
        global $db_user;
        global $db_password;
        global $db_name;
        global $ldap_host;
        global $mysqli;

        $login = $data -> login;
        $password = $data -> password;

        $ldap = ldap_connect($ldap_host);
        if (!$ldap) {
            //echo("Не удалось подключиться к серверу LDAP");
            echo(json_encode(false));
            return false;
        }

        $result = ldap_set_option($ldap, LDAP_OPT_PROTOCOL_VERSION, 3);
        if (!$result) {
            //echo(ldap_errno($ldap)." - ".ldap_error($ldap));
            echo(json_encode(false));
            return false;
        }

        $result = ldap_bind($ldap, "NW\\".$login, $password);
        if (!$result) {
            //echo(ldap_errno($ldap)." - ".ldap_error($ldap));
            echo(json_encode(false));
            return false;
        }

        $attributes = array("name", "mail", "samaccountname", "cn");
        $filter = "(&(objectCategory=person)(sAMAccountName=$login))";

        $search = ldap_search($ldap, ('OU=02_USERS,OU=Kolenergo,DC=nw,DC=mrsksevzap,DC=ru'), $filter, $attributes);
        if (!$search) {
            //echo(ldap_errno($ldap)." - ".ldap_error($ldap));
            echo(json_encode(false));
            return false;
        }

        $result = ldap_get_entries($ldap, $search);
        if (!$result) {
            //echo(ldap_errno($ldap)." - ".ldap_error($ldap));
            echo(json_encode(false));
            return false;
        }

        $fio = explode(" ", $result[0]["name"][0]);
        $surname = $fio[0];
        $name = $fio[1];
        $fname = $fio[2];
        $email = $result[0]["mail"][0];

        /*
        $link = mysql_connect($db_host, $db_user, $db_password);
        if (!$link) {
            echo("Error connecting DB: ".mysql_error());
            return false;
        }

        $db = mysql_select_db($db_name, $link);
        if (!$db) {
            echo("Error selecting DB: ".mysql_error());
            return false;
        }

        $encoding = mysql_query("SET NAMES utf8");
        if (!$encoding) {
            echo("Error setting encoding: ".mysql_error());
            return false;
        }
        */
        /*
        $query = mysql_query("SELECT * FROM users WHERE LOGIN = '$login' LIMIT 1", $link);
        if (!$query) {
            //echo("Ошибка при выполнении запроса");
            echo(json_encode(false));
            return false;
        }
        */
        $query = mysqli_query($mysqli, "SELECT * FROM users WHERE LOGIN = '$login'");
        var_dump($query);
        if (!$query) {
            //echo("no local user found");
            echo(json_encode(false));
            return false;
        }

        //echo("num rows = ".mysqli_num_rows($query));

        if (mysqli_num_rows($query) > 0) {
            $result = mysqli_fetch_assoc($query);
            setcookie("tn_user_id", $result["ID"], time() + 2592000, "/");
            echo(json_encode($result));
        } else
            echo(json_encode(false));
    }





    function logout ($data) {
        if (isset($_COOKIE["tn_user_id"])) {
            unset($_COOKIE["tn_user_id"]);
            setcookie("tn_user_id", null, -1, "/");
            echo(json_encode(true));
        }
        return true;
    }





    function addUser ($data) {
        global $db_host;
        global $db_user;
        global $db_password;
        global $db_name;
        global $mysqli;

        $divisionId = $data -> divisionId;
        $surname = $data -> surname;
        $name = $data -> name;
        $fname = $data -> fname;
        $email = $data -> email;
        $login = $data -> login;
        $password = $data -> password;
        $isAdministrator = $data -> isAdministrator;
        $allowEdit = $data -> allowEdit;
        $allowConfirm = $data -> allowConfirm;

        /*
        $link = mysql_connect($db_host, $db_user, $db_password);
        if (!$link) {
            echo("Error connecting DB: ".mysql_error());
            return false;
        }

        $db = mysql_select_db($db_name, $link);
        if (!$db) {
            echo("Error selecting DB: ".mysql_error());
            return false;
        }

        $encoding = mysql_query("SET NAMES utf8");
        if (!$encoding) {
            echo("Error setting encoding: ".mysql_error());
            return false;
        }
        */

        /*
        $user = mysql_query("INSERT INTO users (DIVISION_ID, SURNAME, NAME, FNAME, EMAIL, LOGIN, PASSWORD, IS_ADMINISTRATOR, ALLOW_EDIT, ALLOW_CONFIRM) VALUES ($divisionId, '$surname', '$name', '$fname', '$email', '$login', '$password', $isAdministrator, $allowEdit, $allowConfirm)", $link);
        if (!$user) {
            echo("Error executing query: ".mysql_error());
            return false;
        }
        */

        $user = mysqli_query($mysqli, "INSERT INTO users (DIVISION_ID, SURNAME, NAME, FNAME, EMAIL, LOGIN, PASSWORD, IS_ADMINISTRATOR, ALLOW_EDIT, ALLOW_CONFIRM) VALUES ($divisionId, '$surname', '$name', '$fname', '$email', '$login', '$password', $isAdministrator, $allowEdit, $allowConfirm)");
        if (!$user) {
            echo(json_encode(false));
            return false;
        }


        $id = mysqli_insert_id($mysqli);
        /*
        $user = mysql_query("SELECT ID, DIVISION_ID, SURNAME, NAME, FNAME, EMAIL, LOGIN, PASSWORD, IS_ADMINISTRATOR, ALLOW_EDIT, ALLOW_CONFIRM FROM users WHERE ID = $id", $link);
        if (!$user) {
            echo("Error executing query: ".mysql_error());
            return false;
        }
        */


        $user = mysqli_query($mysqli, "SELECT ID, DIVISION_ID, SURNAME, NAME, FNAME, EMAIL, LOGIN, PASSWORD, IS_ADMINISTRATOR, ALLOW_EDIT, ALLOW_CONFIRM FROM users WHERE ID = $id");
        if (!$user) {
            echo(json_encode(false));
            return false;
        }

        echo(json_encode(mysqli_fetch_assoc($user)));
        return true;
    }





    function editUser ($data) {
        global $db_host;
        global $db_user;
        global $db_password;
        global $db_name;
        global $mysqli;

        $id = $data -> id;
        $divisionId = $data -> divisionId;
        $surname = $data -> surname;
        $name = $data -> name;
        $fname = $data -> fname;
        $email = $data -> email;
        $login = $data -> login;
        $password = $data -> password;
        $isAdministrator = $data -> isAdministrator;
        $allowEdit = $data -> allowEdit;
        $allowConfirm = $data -> allowConfirm;
        $isLDAPEnabled = $data -> isLDAPEnabled;

        $user = mysqli_query($mysqli, "UPDATE users SET DIVISION_ID = $divisionId, SURNAME = '$surname', NAME = '$name', FNAME = '$fname', EMAIL = '$email', LOGIN = '$login', PASSWORD = '$password', IS_ADMINISTRATOR = $isAdministrator, ALLOW_EDIT = $allowEdit, ALLOW_CONFIRM = $allowConfirm, IS_LDAP_ENABLED = $isLDAPEnabled WHERE ID = $id");
        if (!$user) {
            echo(json_encode(false));
            return false;
        }

        $user = mysqli_query($mysqli, "SELECT ID, DIVISION_ID, SURNAME, NAME, FNAME, EMAIL, LOGIN, PASSWORD, IS_ADMINISTRATOR, ALLOW_EDIT, ALLOW_CONFIRM, IS_LDAP_ENABLED FROM users WHERE ID = $id");
        if (!$user) {
            echo(json_encode(false));
            return false;
        }

        echo(json_encode(mysqli_fetch_assoc($user)));
        return true;
    }





    function addDivision ($data) {
        global $db_host;
        global $db_user;
        global $db_password;
        global $db_name;
        global $mysqli;

        $fullTitle = $data -> fullTitle;
        $shortTitle = $data -> shortTitle;
        $parentId = $data -> parentId;
        $storage = $data -> storage;
        $isDepartment = $data -> isDepartment;
        $path = "";

        /*
        $link = mysql_connect($db_host, $db_user, $db_password);
        if (!$link) {
            echo("Error connecting DB: ".mysql_error());
            return false;
        }

        $db = mysql_select_db($db_name, $link);
        if (!$db) {
            echo("Error selecting DB: ".mysql_error());
            return false;
        }

        $encoding = mysql_query("SET NAMES utf8");
        if (!$encoding) {
            echo("Error setting encoding: ".mysql_error());
            return false;
        }
        */

        if ($parentId != 0) {
            /*
            $parent = mysql_query("SELECT * FROM divisions WHERE id = $parentId", $link);
            if (!$parent) {
                echo("Error executing query: ".mysql_error());
                return false;
            }
            */
            $parent = mysqli_query($mysqli, "SELECT * FROM divisions WHERE id = $parentId");
            if (!$parent) {
                echo(json_encode(false));
                return false;
            }
            if (mysqli_num_rows($parent) > 0) {
                $par = mysqli_fetch_assoc($parent);
                $path = $par["PATH"];
            }
        }
        /*
        $division = mysql_query("INSERT INTO divisions (PARENT_ID, TITLE_SHORT, TITLE_FULL, FILE_STORAGE_HOST, IS_DEPARTMENT, PATH) VALUES ($parentId, '$shortTitle', '$fullTitle', '$storage', $isDepartment, '')", $link);
        if (!$division) {
            echo("Error executing query: ".mysql_error());
            return false;
        }
        */
        $division = mysqli_query($mysqli, "INSERT INTO divisions (PARENT_ID, TITLE_SHORT, TITLE_FULL, FILE_STORAGE_HOST, IS_DEPARTMENT, PATH) VALUES ($parentId, '$shortTitle', '$fullTitle', '$storage', $isDepartment, '')");
        if (!$division) {
            echo(json_encode(false));
            return false;
        }

        $id = mysqli_insert_id($mysqli);
        $path .= $id."/";
        /*
        $divUpd = mysql_query("UPDATE divisions SET PATH = '$path' WHERE ID = $id", $link);
        if (!$divUpd) {
            echo("Error executing query: ".mysql_error());
            return false;
        }
        */
        $divUpd = mysqli_query($mysqli, "UPDATE divisions SET PATH = '$path' WHERE ID = $id");
        if (!$divUpd) {
            echo(json_encode(false));
            return false;
        }
        /*
        $division  = mysql_query("SELECT * FROM divisions WHERE ID = $id", $link);
        if (!$division) {
            echo("Error executing query: ".mysql_error());
            return false;
        }
        */
        $division = mysqli_query($mysqli, "SELECT * FROM divisions WHERE ID = $id");
        if (!$division) {
            echo(json_encode(false));
            return false;
        }

        echo(json_encode(mysqli_fetch_assoc($division)));
        return true;
    }





    function editDivision ($data) {
        global $db_host;
        global $db_user;
        global $db_password;
        global $db_name;
        global $mysqli;

        $id = $data -> id;
        $fullTitle = $data -> fullTitle;
        $shortTitle = $data -> shortTitle;
        $parentId = $data -> parentId;
        $departmentId = $data -> departmentId;
        $storage = $data -> storage;
        $isDepartment = $data -> isDepartment;

        /*
        $link = mysql_connect($db_host, $db_user, $db_password);
        if (!$link) {
            echo("Error connecting DB: ".mysql_error());
            return false;
        }

        $db = mysql_select_db($db_name, $link);
        if (!$db) {
            echo("Error selecting DB: ".mysql_error());
            return false;
        }

        $encoding = mysql_query("SET NAMES utf8");
        if (!$encoding) {
            echo("Error setting encoding: ".mysql_error());
            return false;
        }
        */
        /*
        $division = mysql_query("UPDATE divisions SET TITLE_SHORT = '$shortTitle', TITLE_FULL = '$fullTitle', FILE_STORAGE_HOST = '$storage', IS_DEPARTMENT = $isDepartment WHERE ID = $id", $link);
        if (!$division) {
            echo("Error executing query: ".mysql_error());
            return false;
        }
        */
        $division = mysqli_query($mysqli, "UPDATE divisions SET TITLE_SHORT = '$shortTitle', TITLE_FULL = '$fullTitle', FILE_STORAGE_HOST = '$storage', IS_DEPARTMENT = $isDepartment WHERE ID = $id");
        if (!$division) {
            echo(json_encode(false));
            return false;
        }
        /*
        $attachments = mysql_query("SELECT * FROM attachments WHERE DIVISION_ID = $id", $link);
        if (!$attachments) {
            echo("Error executing attachments query: ".mysql_error());
            return false;
        }
        */
        $attachments = mysqli_query($mysqli, "SELECT * FROM attachments WHERE DIVISION_ID = $id");
        if (!$attachments) {
            echo(json_encode(false));
            return false;
        }

        while ($attachment = mysqli_fetch_assoc($attachments)) {
            $attachmentId = $attachment["ID"];
            $violationId = $attachment["VIOLATION_ID"];
            $title = $attachment["TITLE"];
            if ($storage != "")
                $link = $storage."/uploads/violations/".$violationId."/".$title;
            else
                $link = "/uploads/violations/".$departmentId."/".$violationId."/".$title;
            /*
            $url = mysql_query("UPDATE attachments SET URL = '$link' WHERE ID = $attachmentId", $link);
            if (!$url) {
                echo("Error executing url query: ".mysql_error());
                return false;
            }
            */
            $url = mysqli_query($mysqli, "UPDATE attachments SET URL = '$link' WHERE ID = $attachmentId");
            if (!$url) {
                echo(json_encode(false));
                return false;
            }
        }
        /*
        $division = mysql_query("SELECT * FROM divisions WHERE ID = $id", $link);
        if (!$division) {
            echo("Error executing query: ".mysql_error());
            return false;
        }
        */
        $division = mysqli_query($mysqli, "SELECT * FROM divisions WHERE ID = $id");
        if (!$division) {
            echo(json_encode(false));
            return false;
        }

        echo(json_encode(mysqli_fetch_assoc($division)));
        return true;
    }



    function saveSettings ($data) {
        global $mysqli;
        $code = $data -> code;
        $value = $data -> value;

        foreach ($data as $key => $param) {
            $setting = "UPDATE settings SET VALUE = '$param' WHERE CODE = '$key'";
            $query = mysqli_query($mysqli, $setting);
            if (!$query) {
                echo(json_encode(false));
                return false;
            }
        }
        echo(json_encode(true));
        return true;
    }

    //if (!mysqli_close($mysqli)) {
    //    echo "Не удалось закрыть соединение с БД: (".$mysqli -> errno.") ".$mysqli -> error;
    //    return false;
    //}

?>