<?php
session_start();

require_once('../../../../include/validatesession.inc');

error_reporting(0);

require_once('../../../../config/db.php.inc');
require_once ('../../../../include/db.php');
require_once ('../../../../include/apistatuscodes.inc');
require_once ('../../../../include/loggingsetup.php');



$response = array();
if ($_SESSION['useradmin'] == 1) {

    if (isset($_REQUEST['environment']) && strlen($_REQUEST['environment']) > 0) {

        $con = getMySqlConnection();

        $envName = mysql_real_escape_string($_REQUEST['environment']);
        $envautofetchurl = mysql_real_escape_string($_REQUEST["url"]);
        $envusername = mysql_real_escape_string($_REQUEST["username"]);
        $envpassword = mysql_real_escape_string($_REQUEST["password"]);

        $sqlInsert = "";
        $sqlInsert .= "INSERT INTO testenvironment ";
        $sqlInsert .= "            (name, ";
        $sqlInsert .= "             url, ";
        $sqlInsert .= "             username, ";
        $sqlInsert .= "             PASSWORD,  ";
        $sqlInsert .= "             project) ";
        $sqlInsert .= "VALUES      ('$envName', ";
        $sqlInsert .= "             '$envautofetchurl', ";
        $sqlInsert .= "             '$envusername', ";
        $sqlInsert .= "             '$envpassword', ";
        $sqlInsert .= "             '".$_SESSION['project']."') ";


        $result = mysql_query($sqlInsert);

        if (!$result) {
            if (mysql_errno() == 1062) {
                header("HTTP/1.0 409 Conflict");
                $response['code'] = ITEM_ALREADY_EXIST;
                $response['text'] = "ITEM_ALREADY_EXIST";

            }
            else
            {
                header("HTTP/1.0 500 Internal Server Error");
                $response['code'] = ITEM_NOT_ADDED;
                $response['text'] = "ITEM_NOT_ADDED";

            }
        }
        else
        {
            $logger->info($_SESSION['username']." added environment $envName");

            header("HTTP/1.0 201 Created");
            $response['code'] = ITEM_ADDED;
            $response['text'] = "ITEM_ADDED";

        }

        mysql_close($con);
    }
    else
    {
        header("HTTP/1.0 400 Bad Request");
        $response['code'] = ITEM_NOT_PROVIDED_IN_REQUEST;
        $response['text'] = "ITEM_NOT_PROVIDED_IN_REQUEST";
    }
}
else
{
    header("HTTP/1.0 401 Unauthorized");
    $response['code'] = UNAUTHORIZED;
    $response['text'] = "UNAUTHORIZED";
}
echo json_encode($response);
?>