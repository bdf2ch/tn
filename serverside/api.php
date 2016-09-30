<?php
    session_start();
    require_once $_SERVER["DOCUMENT_ROOT"].DIRECTORY_SEPARATOR."serverside".DIRECTORY_SEPARATOR."config.php";

    $postdata = json_decode(file_get_contents("php://input"));
    $action = $postdata -> action;
    switch ($action) {
        case "getViolationById":
            getViolationById($postdata -> data);
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

        $result = new stdClass();
        $result -> divisions = array();
        $result -> users = array();
        $result -> eskGroups = array();
        $result -> violations = array();
        $result -> total = 0;
        $result -> attachments = array();
        $thursday = strtotime("last thursday");
        //$result -> thursday = date('W', $thursday) == date('W') ? $thursday - (7 * 86400) : $thursday;
        $result -> thursday = $thursday;


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

        $userId = $_COOKIE["tn_user_id"];
        $user = mysql_query("SELECT * FROM users WHERE ID = $userId", $link);
        if (!$user) {
            echo("Error executing query: ".mysql_error());
            return false;
        }
        $result -> user = mysql_fetch_assoc($user);

        $divisions = mysql_query("SELECT ID, PARENT_ID, TITLE_FULL, SORT_ID, TITLE_SHORT, IS_DEPARTMENT, PATH, (SELECT COUNT(*) FROM violations WHERE division_id = divisions.ID AND date_happened > ".$result -> thursday.") AS VIOLATIONS_ADDED, (SELECT COUNT(*) FROM attachments WHERE DIVISION_ID = divisions.ID AND DATE_ADDED > ".$result -> thursday.") AS ATTACHMENTS_ADDED FROM divisions ORDER By PARENT_ID ASC", $link);
        if (!$divisions) {
            echo("Error executing query: ".mysql_error());
            return false;
        }

        while ($division = mysql_fetch_assoc($divisions)) {
            array_push($result -> divisions, $division);
        }



        $users = mysql_query("SELECT * FROM users", $link);
        if (!$users) {
            echo("Error executing query: ".mysql_error());
            return false;
        }

        while ($user = mysql_fetch_assoc($users)) {
            array_push($result -> users, $user);
        }

        $eskGroups = mysql_query("SELECT * FROM esk_groups", $link);
        if (!$eskGroups) {
            echo("Error executing query: ".mysql_error());
            return false;
        }

        while ($group = mysql_fetch_assoc($eskGroups)) {
            array_push($result -> eskGroups, $group);
        }


        $d = mysql_query("SELECT * FROM divisions WHERE PATH LIKE '%/".$result -> user["DIVISION_ID"] ."/%'", $link);
        if (!$d) {
            echo("Error executing query");
            return false;
        }

        $divs = " (";
        while ($division = mysql_fetch_assoc($d)) {
            $divs = $divs.$division["ID"].",";
        }
        $divs = rtrim($divs, ",");
        $divs = $divs.")";

        $violations = mysql_query("SELECT * FROM violations WHERE DIVISION_ID IN $divs ORDER BY DATE_HAPPENED DESC LIMIT 0, $itemsOnPage", $link);
        if (!$violations) {
            echo("Error executing query: ".mysql_error());
            return false;
        }

        while ($violation = mysql_fetch_assoc($violations)) {
            $violationItem = new stdClass();
            $violationItem -> violation = $violation;
            $userId = intval($violation["USER_ID"]);
            $violationId = intval($violation["ID"]);
            $user = mysql_query("SELECT * FROM users WHERE ID = $userId", $link);
            if (!$user) {
                echo("Error executing query: ".mysql_error());
                return false;
            }
            $violationItem -> user = mysql_fetch_assoc($user);
            $violationItem -> attachments = array();
            $attachments = mysql_query("SELECT * FROM attachments WHERE VIOLATION_ID = $violationId", $link);
            if (!$attachments) {
                echo("Error executing query: ".mysql_error());
                return false;
            }
            while ($attachment = mysql_fetch_assoc($attachments)) {
                array_push($violationItem -> attachments, $attachment);
            }
            array_push($result -> violations, $violationItem);
        }

        $attachments = mysql_query("SELECT * FROM attachments", $link);
        if (!$attachments) {
            echo("Error executing query: ".mysql_error());
            return false;
        }

        while ($attachment = mysql_fetch_assoc($attachments)) {
            array_push($result -> attachments, $attachment);
        }

        $total = mysql_query("SELECT COUNT(*) AS total FROM violations WHERE DIVISION_ID IN $divs");
        if (!$total) {
            echo("Error setting encoding: ".mysql_error());
            return false;
        }
        $result -> total = intval(mysql_fetch_assoc($total)["total"]);

        return $result;
    }




    function getViolationById ($data) {
        global $db_host;
        global $db_user;
        global $db_password;
        global $db_name;
        $id = $data -> id;
        $result = new stdClass();
        $result -> attachments = array();

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

        $query = mysql_query("SELECT * FROM violations WHERE ID = $id LIMIT 1", $link);
        if (!$query) {
            echo("Error executing query: ".mysql_error());
            return false;
        }

        if (mysql_num_rows($query) > 0) {
            $violation = mysql_fetch_assoc($query);
            $result -> violation = $violation;

            $userId = $violation["USER_ID"];
            $user = mysql_query("SELECT * FROM users WHERE ID = $userId LIMIT 1", $link);
            if (!$user) {
                echo("Error executing query: ".mysql_error());
                return false;
            }
            $result -> user = mysql_fetch_assoc($user);

            $attachments = mysql_query("SELECT * FROM attachments WHERE VIOLATION_ID = $id", $link);
            if (!$attachments) {
                echo("Error executing query: ".mysql_error());
                return false;
            }
            while ($attachment = mysql_fetch_assoc($attachments)) {
                array_push($result -> attachments, $attachment);
            }

            echo(json_encode($result));
        } else
            echo(json_encode(false));
    }





    function addViolation ($data) {
        global $db_host;
        global $db_user;
        global $db_password;
        global $db_name;

        $id = $data -> id;
        $userId = $data -> userId;
        $divisionId = $data -> divisionId;
        $eskGroupId = $data -> eskGroupId;
        $eskObject = $data -> eskObject;
        $happened = $data -> happened;
        $description = $data -> description;
        $added = time();
        $result = new stdClass();
        $result -> attachments = array();

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

        if ($id != 0) {
            $query = mysql_query("UPDATE violations SET USER_ID = $userId, DIVISION_ID = $divisionId, ESK_GROUP_ID = $eskGroupId, ESK_OBJECT = '$eskObject', DESCRIPTION = '$description', DATE_HAPPENED = $happened, DATE_ADDED = $added WHERE ID = $id", $link);
            if (!$query) {
                echo("Не удалось обновить информацию о технологическом нарушении");
                return false;
            }

            $violation = mysql_query("SELECT * FROM violations WHERE ID = $id", $link);
            if (!$violation) {
                echo(json_encode(false));
                return false;
            }
            $result -> violation = mysql_fetch_assoc($violation);

            $user = mysql_query("SELECT * FROM users WHERE ID = $userId", $link);
            if (!$user) {
                echo(json_encode(false));
                return false;
            }
            $result -> user = mysql_fetch_assoc($user);

            $attachments = mysql_query("SELECT * FROM attachments WHERE VIOLATION_ID = $id", $link);
            if (!$attachments) {
                echo(json_encode(false));
                return false;
            }
            while ($attachment = mysql_fetch_assoc($attachments)) {
                array_push($result -> attachments, $attachment);
            }

            echo(json_encode($result));
        } else {
            $query = mysql_query("INSERT INTO violations (USER_ID, DIVISION_ID, ESK_GROUP_ID, ESK_OBJECT, DESCRIPTION, DATE_HAPPENED, DATE_ADDED) VALUES ($userId, $divisionId, $eskGroupId, '$eskObject', '$description', $happened, $added)", $link);
            if (!$query) {
                echo(json_encode(false));
                return false;
            }

            $id = mysql_insert_id();
            $violation = mysql_query("SELECT * FROM violations WHERE ID = $id", $link);
            if (!$violation) {
                echo(json_encode(false));
                return false;
            }
            $result -> violation = mysql_fetch_assoc($violation);

            $user = mysql_query("SELECT * FROM users WHERE ID = $userId", $link);
            if (!$user) {
                echo(json_encode(false));
                return false;
            }
            $result -> user = mysql_fetch_assoc($user);

            echo(json_encode($result));
        }
    }





    function editViolation ($data) {
        global $db_host;
        global $db_user;
        global $db_password;
        global $db_name;

        $id = $data -> id;
        $userId = $data -> userId;
        $divisionId = $data -> divisionId;
        $eskGroupId = $data -> eskGroupId;
        $eskObject = $data -> eskObject;
        $happened = $data -> happened;
        $description = $data -> description;
        $isConfirmed = $data -> isConfirmed;

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

        $query = mysql_query("UPDATE violations SET USER_ID = $userId, DIVISION_ID = $divisionId, ESK_GROUP_ID = $eskGroupId, ESK_OBJECT = '$eskObject', DESCRIPTION = '$description', IS_CONFIRMED = $isConfirmed WHERE ID = $id", $link);
        if (!$query) {
            echo("Errors executing query");
            return false;
        }

        $violation = mysql_query("SELECT * FROM violations WHERE ID = $id", $link);
        if (!$query) {
            echo("Error executing query");
            return false;
        }

        echo(json_encode(mysql_fetch_assoc($violation)));
    }





    function cancelViolation ($data) {
        global $db_host;
        global $db_user;
        global $db_password;
        global $db_name;
        $id = $data -> id;

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

        $violation = mysql_query("DELETE FROM violations WHERE ID = $id", $link);
        if (!$violation) {
            echo("Error executing query");
            return false;
        }

        $attachments = mysql_query("DELETE FROM attachments WHERE VIOLATION_ID = $id", $link);
        if (!$attachments) {
            echo("Error executing query");
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
        $result = array();

        $divisionId = $data -> divisionId;
        $startDate = $data -> startDate;
        $endDate = $data -> endDate == 0 ? time() : $data -> endDate;
        $start = $data -> start;
        $limit = "";
        if ($endDate != 0 || $startDate != 0)
            $limit = "";
        else
            $limit = " LIMIT $start, $itemsOnPage";
        //echo("limit = ".$limit);

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

        $divisions = mysql_query("SELECT * FROM divisions WHERE PATH LIKE '%/$divisionId/%'", $link);
        if (!$divisions) {
            echo("Error executing query");
            return false;
        }

        $divs = " (";
        while ($division = mysql_fetch_assoc($divisions)) {
            $divs = $divs.$division["ID"].",";
        }
        $divs = rtrim($divs, ",");
        $divs = $divs.")";

        $total = mysql_query("SELECT COUNT(*) AS total FROM violations WHERE DIVISION_ID IN $divs AND DATE_HAPPENED >= $startDate AND DATE_HAPPENED <= $endDate", $link);
        if (!$total) {
            echo("Error executing query");
            return false;
        }

        $violations = mysql_query("SELECT * FROM violations WHERE DIVISION_ID IN $divs AND DATE_HAPPENED >= $startDate AND DATE_HAPPENED <= $endDate ORDER BY DATE_HAPPENED DESC ".$limit, $link);
        if (!$violations) {
            echo("Error executing query");
            return false;
        }

        while ($violation = mysql_fetch_assoc($violations)) {
            $violationItem = new stdClass();
            $violationItem -> attachments = array();
            $violationItem -> violation = $violation;
            $violationItem -> total = intval(mysql_fetch_assoc($total)["total"]);
            $userId = intval($violation["USER_ID"]);

            $user = mysql_query("SELECT * FROM users WHERE ID = $userId LIMIT 1", $link);
            if (!$user) {
                echo("Error executing query");
                return false;
            }
            $violationItem -> user = mysql_fetch_assoc($user);

            $violationId = intval($violation["ID"]);
            $attachments = mysql_query("SELECT * FROM attachments WHERE VIOLATION_ID = $violationId", $link);
            if (!$attachments) {
                echo("Error executing query");
                return false;
            }
            while ($attachment = mysql_fetch_assoc($attachments)) {
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

        $query = mysql_query("SELECT * FROM users WHERE LOGIN = '$login' LIMIT 1", $link);
        if (!$query) {
            //echo("Ошибка при выполнении запроса");
            echo(json_encode(false));
            return false;
        }

        if (mysql_num_rows($query) > 0) {
            $result = mysql_fetch_assoc($query);
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

        $user = mysql_query("INSERT INTO users (DIVISION_ID, SURNAME, NAME, FNAME, EMAIL, LOGIN, PASSWORD, IS_ADMINISTRATOR, ALLOW_EDIT, ALLOW_CONFIRM) VALUES ($divisionId, '$surname', '$name', '$fname', '$email', '$login', '$password', $isAdministrator, $allowEdit, $allowConfirm)", $link);
        if (!$user) {
            echo("Error executing query: ".mysql_error());
            return false;
        }

        $id = mysql_insert_id();
        $user = mysql_query("SELECT ID, DIVISION_ID, SURNAME, NAME, FNAME, EMAIL, LOGIN, PASSWORD, IS_ADMINISTRATOR, ALLOW_EDIT, ALLOW_CONFIRM FROM users WHERE ID = $id", $link);
        if (!$user) {
            echo("Error executing query: ".mysql_error());
            return false;
        }

        echo(json_encode(mysql_fetch_assoc($user)));
        return true;
    }





    function editUser ($data) {
        global $db_host;
        global $db_user;
        global $db_password;
        global $db_name;

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

        $user = mysql_query("UPDATE users SET DIVISION_ID = $divisionId, SURNAME = '$surname', NAME = '$name', FNAME = '$fname', EMAIL = '$email', LOGIN = '$login', PASSWORD = '$password', IS_ADMINISTRATOR = $isAdministrator, ALLOW_EDIT = $allowEdit, ALLOW_CONFIRM = $allowConfirm WHERE ID = $id", $link);
        if (!$user) {
            echo("Error executing query: ".mysql_error());
            return false;
        }

        $user = mysql_query("SELECT ID, DIVISION_ID, SURNAME, NAME, FNAME, EMAIL, LOGIN, PASSWORD, IS_ADMINISTRATOR, ALLOW_EDIT, ALLOW_CONFIRM FROM users WHERE ID = $id", $link);
        if (!$user) {
            echo("Error executing query: ".mysql_error());
            return false;
        }

        echo(json_encode(mysql_fetch_assoc($user)));
        return true;
    }





    function addDivision ($data) {
        global $db_host;
        global $db_user;
        global $db_password;
        global $db_name;

        $fullTitle = $data -> fullTitle;
        $shortTitle = $data -> shortTitle;
        $parentId = $data -> parentId;
        $isDepartment = $data -> isDepartment;
        $path = "";

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

        if ($parentId != 0) {
            $parent = mysql_query("SELECT * FROM divisions WHERE id = $parentId", $link);
            if (!$parent) {
                echo("Error executing query: ".mysql_error());
                return false;
            }
            if (mysql_num_rows($parent) > 0) {
                $par = mysql_fetch_assoc($parent);
                $path = $par["PATH"];
            }
        }

        $division = mysql_query("INSERT INTO divisions (PARENT_ID, TITLE_SHORT, TITLE_FULL, IS_DEPARTMENT, PATH) VALUES ($parentId, '$shortTitle', '$fullTitle', $isDepartment, '')", $link);
        if (!$division) {
            echo("Error executing query: ".mysql_error());
            return false;
        }

        $id = mysql_insert_id();
        $path .= $id."/";
        $divUpd = mysql_query("UPDATE divisions SET PATH = '$path' WHERE ID = $id", $link);
        if (!$divUpd) {
            echo("Error executing query: ".mysql_error());
            return false;
        }

        $division  = mysql_query("SELECT * FROM divisions WHERE ID = $id", $link);
        if (!$division) {
            echo("Error executing query: ".mysql_error());
            return false;
        }

        echo(json_encode(mysql_fetch_assoc($division)));
        return true;
    }





    function editDivision ($data) {
        global $db_host;
        global $db_user;
        global $db_password;
        global $db_name;

        $id = $data -> id;
        $fullTitle = $data -> fullTitle;
        $shortTitle = $data -> shortTitle;
        $parentId = $data -> parentId;
        $isDepartment = $data -> isDepartment;

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

        $division = mysql_query("UPDATE divisions SET TITLE_SHORT = '$shortTitle', TITLE_FULL = '$fullTitle', IS_DEPARTMENT = $isDepartment WHERE ID = $id", $link);
        if (!$division) {
            echo("Error executing query: ".mysql_error());
            return false;
        }

        $division  = mysql_query("SELECT * FROM divisions WHERE ID = $id", $link);
        if (!$division) {
            echo("Error executing query: ".mysql_error());
            return false;
        }

        echo(json_encode(mysql_fetch_assoc($division)));
        return true;
    }

?>