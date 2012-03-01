<?php
//require_once('../../include/validatesession.inc');
require_once('../../include/db.php');
require_once('../../config/db.php.inc');

$con = getMySqlConnection();

$whereSql = "";
if($_REQUEST['tester']!=null)
{
    if(strpos($whereSql,"WHERE") === false) {
        $whereSql = "WHERE ";
    }
  $username = $_REQUEST['tester'];
  $whereSql = $whereSql ."username='$username' ";
}

if($_REQUEST['sprint']!=null)
{
    if(strpos($whereSql,"WHERE") === false) {
        $whereSql = "WHERE ";
    }
    else
    {
        $whereSql = $whereSql ."AND ";
    }
    $sprint = $_REQUEST['sprint'];
    $whereSql = $whereSql ."sprintname='$sprint' ";
}

if($_REQUEST['team']!=null)
{
    if(strpos($whereSql,"WHERE") === false) {
        $whereSql = "WHERE ";
    }
    else
    {
        $whereSql = $whereSql ."AND ";
    }
    $team = $_REQUEST['team'];
    $whereSql = $whereSql ."teamname='$team' ";
}

if($_REQUEST['status']!=null)
{
    $status = $_REQUEST['status'];

    if(strpos($whereSql,"WHERE") === false) {
        $whereSql = "WHERE ";
    }
    else
    {
        $whereSql = $whereSql ."AND ";
    }
    if($status==1) {
        $whereSql = $whereSql ."executed=0 ";
    }
    elseif($status==2) {
        $whereSql = $whereSql ."executed=1 AND debriefed=0 AND closed=0 ";
    }
    elseif($status==3) {
        $whereSql = $whereSql ."debriefed=1 ";
    }
    elseif($status==4) {
        $whereSql = $whereSql ."closed=1 ";
    }
}

$data = array();
$data['page'] = (int)$_REQUEST['page'];
//$data['total'] = 500;
$data = getNumberOfSessions($data,$whereSql);

$data = getSessions($data,$whereSql);

echo json_encode($data);

mysql_close($con);


function getNumberOfSessions($data,$whereSql)
{
    $sql = "SELECT COUNT(*) as numberofSessions FROM sessioninfo $whereSql";
    //echo $sql;
    $result = mysql_query($sql);
    $result = mysql_fetch_row($result);
    $data['total'] = $result[0];
    return $data;
}

function getSessions($data,$whereSql)
{
    $numberOfSessionsToDisplay = 50;
    if (isset($_REQUEST['page'])) {
        $page = $_REQUEST['page'];
        $startLimit = ((int)$page * (int)$numberOfSessionsToDisplay) - $numberOfSessionsToDisplay;
        $stopLimit = (int)$page * (int)$numberOfSessionsToDisplay;
    }
    else
    {
        $startLimit = 0;
        $stopLimit = (int)$numberOfSessionsToDisplay;
    }

    $sortname = $_REQUEST['sortname'];
    
    if (strstr($sortname,"id")!=false)
        $sortname = "sessionid";
    elseif (strstr($sortname,"updated")!=false)
        $sortname = "updated";
    elseif (strstr($sortname,"executed")!=false)
        $sortname = "executed_timestamp";
    else
        $sortname = "sessionid";

    $sortorder = $_REQUEST['sortorder'];
    $sql = "SELECT * FROM sessioninfo $whereSql ORDER BY $sortname $sortorder LIMIT " . $startLimit . ",50;";

    //echo $sql;

    $result = mysql_query($sql);

    if (!$result) {
        echo mysql_error() . "<br/>";
    }

    while ($row = mysql_fetch_array($result)) {
        $sessionid = $row['sessionid'];
        $versionid = $row['versionid'];
        $title = $row['title'];
        $username = $row['username'];
        $executed = $row['executed'];
        if ($executed == 0) {
            $executed = "-";
        }
        $debriefed = $row['debriefed'];
        $closed = $row['closed'];
        $updated = $row['updated'];
        $executed_timestamp = $row['executed_timestamp'];

        $teamname = $row['teamname'];
        $sprintname = $row['sprintname'];
        $executed_timestamp = $row['executed_timestamp'];

        $status = "Not Executed";
        if ($executed == 1) {
            $status = "Executed";
        }
        if ($debriefed == 1) {
            $status = "Debriefed";
        }
        if ($closed == 1) {
            $status = "Closed";
        }
        $data['rows'][] = array('id' => "1", 'cell' => array("$sessionid", "$status", "$title", "$username", "$sprintname", "$teamname", "$updated", "$executed_timestamp", "keypad,siren"));
    }
    return $data;
}

?>