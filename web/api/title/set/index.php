<?php
/**
 * API to set title of a session
 * api/title/set/index.php
 * [POST]
 * text=[sprintName]
 * sessionid=[sessionId]

 */

session_start();

require_once('../../../include/validatesession.inc');

//error_reporting(0);

require_once('../../../config/db.php.inc');
require_once ('../../../include/commonFunctions.php.inc');
require_once ('../../../include/db.php');
require_once('../../../classes/sessionHelper.php');
require_once('../../../classes/logging.php');
require_once('../../../classes/dbHelper.php');

$logger = new logging();
$sHelper = new sessionHelper();
$dbManager = new dbHelper();

if (isset($_REQUEST['text']) && isset($_REQUEST['sessionid'])) {

    $con = $dbManager->db_getMySqliConnection();
    $sessionid = dbHelper::escape($con, $_REQUEST['sessionid']);
    $title = dbHelper::escape($con, $_REQUEST['text']);
    $so = new sessionObject($sessionid);

    header("HTTP/1.0 501 Internal Server Error");

    if ($so->getSessionExist()) {
        $versionid = $so->getVersionid();
        if ($sHelper->isUserAllowedToEditSession($so)) {
            $sql = "UPDATE mission SET title='$title' WHERE versionid='" . $so->getVersionid() . "'";
            $result = dbHelper::sw_mysqli_execute($con, $sql, __FILE__, __LINE__);
            $logger->debug("Changed title to $title in session $sessionid", __FILE__, __LINE__);
            header("HTTP/1.0 200 OK");
            $response['code'] = ITEM_UPDATED;
            $response['text'] = "ITEM_UPDATED";

            //Reloading SO since it is updated
            unset($so);
            $so = new sessionObject($sessionid);
            $sHelper->updateRemoteStatusForCharter($so);

        } else {
            header("HTTP/1.0 401 Unauthorized");
            $response['code'] = UNAUTHORIZED;
            $response['text'] = "UNAUTHORIZED";
        }
    } else {
        $logger->debug("Tried to change title to $title but sessionid $sessionid does not exist", __FILE__, __LINE__);
        header("HTTP/1.0 404 Not found");
        $response['code'] = ITEM_DOES_NOT_EXIST;
        $response['text'] = "ITEM_DOES_NOT_EXIST";
    }

} else {
    $logger->debug("Tried to change title but one of the parameters is bad", __FILE__, __LINE__);
    header("HTTP/1.0 400 Bad Request");
    $response['code'] = PARAMETER_NOT_PROVIDED_IN_REQUEST;
    $response['text'] = "PARAMETER_NOT_PROVIDED_IN_REQUEST";
}

echo json_encode($response);
