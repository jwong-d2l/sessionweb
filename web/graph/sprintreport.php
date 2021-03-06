<?php
session_start();
require_once('../include/validatesession.inc');
include_once('../config/db.php.inc');
include_once('../include/db.php');
include_once ('../include/commonFunctions.php.inc');
include_once ('../include/session_database_functions.php.inc');
include_once ('../include/session_common_functions.php.inc');


echo '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
  <head>
          <meta http-equiv="Content-type" content="text/html;charset=utf-8">
      <title>Sessionweb</title>
           <link rel="stylesheet" type="text/css" href="../css/sprintreport.css">
           <script src="../js/jquery-1.9.1.min.js" type="text/javascript"></script>
           <script type="text/javascript" src="https://www.google.com/jsapi"></script>
  </head>
<body>
<a name="top"></a>
';

if (isset($_REQUEST['sprint'])) {
    $con1 = getMySqlConnection();

    generateReport($_REQUEST['sprint']);
    mysql_close($con1);
}
else
{
    echo '<form method="post" action="sprintreport.php">';

    echo "Sprint summary: ";
    echoSprintSelect("",true);

    echo '<input type="submit" name="Submit" value="Generate report">';
}

echo '</body>
</html>';

function generateReport($sprint)
{


    echo "<H1>Sprint: $sprint</H1>";
//    echo '<div class="shortboldline"></div>';
//    printNumberOrSessions($sprint);
    echo '<div class="shortboldline"></div>';

    printTeamStatistics($sprint);
    echo "</div>";

}

function printNumberOrSessions($sprint)
{
    $sql = "SELECT sessionid,versionid,username,title,teamname,sprintname,setup_percent,test_percent,bug_percent,opportunity_percent,duration_time FROM sessioninfo WHERE sprintname = '$sprint'";
    $result = mysql_query($sql);
    $numberOfSession = mysql_num_rows($result);

    echo "<div>Total number of session executed: $numberOfSession</div>";
}

function printTeamStatistics($sprint)
{
    $sw_settings = getSettingsDoNotCreateMysqlConnection();
    $normalizedSessionTime = $sw_settings['normalized_session_time'];

    echo "<div><h2>Total number of sessions executed:</h2>";
    $sql = "SELECT teamname, COUNT(*) as numberofsessions FROM sessioninfo WHERE sprintname = '$sprint' AND executed=1 GROUP by teamname";
    $resultTeam = mysql_query($sql);
    $totalCount = 0;
    $teamNumberOfSessionArray = array();
    $totalTimeInSessions =0;
    echo '<table border=0><tbody>';
    while ($row = mysql_fetch_array($resultTeam))
    {
        if ($totalTimeInSessions != 0) {
            $hoursInsessions = $totalTimeInSessions / 60;
            $norm_session_cnt = round((int)$totalTimeInSessions / (int)$normalizedSessionTime, 1);
        }

        $teamNameWithoutSpaces = str_replace(" ", "", $row['teamname']);
        echo "<tr><td><a href='#$teamNameWithoutSpaces'>" . $row['teamname'] . "</a></td><td>" . $row['numberofsessions'] . "</td></tr>";
        $totalCount = $totalCount + (int)$row['numberofsessions'];
        $teamNumberOfSessionArray[$row['teamname']] = $row['numberofsessions'];
    }
    echo "<tr><td><span class='stronger'>Total</span></td><td><span class='stronger'>$totalCount</span></td></tr>";

    echo '</tbody></table>';

    //echo createBarChart($teamNumberOfSessionArray);

    echo "</div>";
    echo '<div class="shortboldline"></div>';
    printAreaStatistics($sprint);
}

function printAreaStatistics($sprint)
{
    $sw_settings = getSettingsDoNotCreateMysqlConnection();
    $normalizedSessionTime = $sw_settings['normalized_session_time'];
    echo "<div><h2>Areastatistics:</h2>";


    $sql = "SELECT teamname FROM sessioninfo WHERE sprintname = '$sprint'  AND executed=1  GROUP by teamname";
    $resultTeam = mysql_query($sql);

    while ($row = mysql_fetch_array($resultTeam))
    {

        $areasArray = array();
        $totalTimeInSessions = 0;
        $teamname = $row['teamname'];

        $sql = "SELECT versionid,duration_time,setup_percent,test_percent,bug_percent,opportunity_percent FROM sessioninfo WHERE sprintname = '$sprint'  AND executed=1 AND teamname = '$teamname'";
        $resultTeamSessions = mysql_query($sql);
        $nbrOfSessions = mysql_num_rows($resultTeamSessions);
        while ($rowSessions = mysql_fetch_array($resultTeamSessions))
        {
            list($totalTimeInSessions, $areasArray) = getAreasConnectedToSession($rowSessions, $areasArray, $totalTimeInSessions);
        }
        $teamNameWithoutSpaces = str_replace(" ", "", $teamname);
        echo "<a name='$teamNameWithoutSpaces' ></a>";
        echo "<a href='#top'>Back to top of page</a>";
        echo "<h3>$teamname</h3>";
        echo '<table border=0><tbody>';
        echo "<tr valign='top'><th width='300' valign='top'></th><th></th></tr>";


        echo "<tr><td valign='top'>";
        echo '<table border=0><tbody>';
        echo "<tr valign='top'><td valign='baseline' width='200'>Area</td><td>Number of sessions</td></tr>";
        $treeChartDivName = "treechart_" . str_replace(" ", "", $teamname);
        if (!empty($areasArray)) {
            foreach ($areasArray as $key => $value)
            {
                echo "<tr><td>$key</td><td>$value</td></tr>";
            }
            printTreeChartJavascript($areasArray,$treeChartDivName);
        }
        else
        {
            echo "<tr><td>&nbsp</td><td>&nbsp</td></tr>";

        }

        echo '</tbody></table></td>';

        if (!empty($areasArray)) {
        echo '<div id="' . $treeChartDivName . '" style="width: 1024px; height: 200px;">Treechart</div>';
        }
        echo "<td valign='top'>

        <img alt='pie chart' src='" . getSprintMetricsPieWithChartUrl($teamname) . "'><br>
        <img alt='pie chart' src='" . getSprintSessionStatusPieWithChartUrl($teamname) . "'>

        </td></tr>";
        echo '</tbody></table>';
        if ($totalTimeInSessions != 0) {
            $hoursInsessions = $totalTimeInSessions / 60;
            $norm_session_cnt = round((int)$totalTimeInSessions / (int)$normalizedSessionTime, 1);
        }

        $hoursInsessions = round($hoursInsessions,2);
        echo "Number of sessions: $nbrOfSessions (normalized $norm_session_cnt) ($hoursInsessions h)";

        echo '<div class="shortthinline"></div>';

    }
}

function printTreeChartJavascript($areasArray,$treeChartDivName)
{
    $script = "\n\n<script type='text/javascript'>
      google.load('visualization', '1', {packages:['treemap']});
      google.setOnLoadCallback(drawChart);
      function drawChart() {
          // Create and populate the data table.
          var data = new google.visualization.DataTable();
          data.addColumn('string', 'Region');
          data.addColumn('string', 'Parent');
          data.addColumn('number', 'Number of sessions');
          data.addRows([\n['Area Tree Map',null,0]";
    $script = $script.",";

    $firstItteration = true;
    foreach ($areasArray as $key => $value)
    {
        if (!$firstItteration)
            $script = $script . ",\n";
        $script = $script."\t\t\t";

        $script = $script."['$key','Area Tree Map',$value]";
        $firstItteration  = false;
    }
    $script = $script."]);

//            Create and draw the visualization.
            var tree = new google.visualization.TreeMap(document.getElementById('$treeChartDivName'));\n";
    $script = $script. "tree.draw(data, {
          minColor: '#00FFD5',
          midColor: '#ddd',
          maxColor: '#00C8FF',
          headerHeight: 15,
          fontColor: 'black',
          showScale: false,
          showTooltips: true
          });
            }
            </script>\n";
    echo $script;
}


function getSprintSessionStatusPieWithChartUrl($teamname)
{
    $sprint = $_REQUEST['sprint'];
    $sql = "SELECT COUNT(*) as total, SUM(executed)-SUM(debriefed)-SUM(closed) as executed, SUM(debriefed) as debriefed, SUM(closed) as closed  FROM sessioninfo WHERE sprintname = '$sprint' AND teamname = '$teamname'";
    $result = mysql_query($sql);
    $row = null;
    $valuesAndLables = array();
    while ($row = mysql_fetch_array($result))
    {
        $total = $row['total'];
        $valuesAndLables['executed(' . $row['executed'] . ')'] = $row['executed'];
        $valuesAndLables['debriefed(' . $row['debriefed'] . ')'] = $row['debriefed'];
        $valuesAndLables['closed(' . $row['closed'] . ')'] = $row['closed'];
        $colors = array('ffff77', '99ff99', 'ffcccc');
        return createChartPie($valuesAndLables, "Execution status", 340, 130, $colors);
    }
    return null;

}

function getSprintMetricsPieWithChartUrl($teamname)
{
    $sprint = $_REQUEST['sprint'];
    $sql = "SELECT COUNT(*) as cnt, SUM(setup_percent) as setup, SUM(test_percent) as test, SUM(bug_percent) as bug, SUM(opportunity_percent) as opportunity FROM sessioninfo WHERE sprintname = '$sprint' AND teamname = '$teamname'";
    $result = mysql_query($sql);
    $row = null;
    $valuesAndLables = array();
    while ($row = mysql_fetch_array($result))
    {
        $cnt = $row['cnt'];
        $valuesAndLables['setup(' . round(($row['setup'] / $cnt), 1) . '%)'] = round(($row['setup'] / $cnt), 1);
        $valuesAndLables['test(' . round(($row['test'] / $cnt), 1) . '%)'] = round(($row['test'] / $cnt), 1);
        $valuesAndLables['bug(' . round(($row['bug'] / $cnt), 1) . '%)'] = round(($row['bug'] / $cnt), 1);
        $valuesAndLables['opportunity(' . round(($row['opportunity'] / $cnt), 1) . '%)'] = round(($row['opportunity'] / $cnt), 1);
        $colors = array('0000FF', '00FF00', 'FF0000', '000000');
        return createChartPie($valuesAndLables, "Time distribution", 340, 130, $colors);
    }
       return null;

}

function getAreasConnectedToSession($rowSessions, $areasArray, $totalTimeInSessions)
{
    $versionid = $rowSessions['versionid'];
    $totalTimeInSessions = (int)$totalTimeInSessions + (int)$rowSessions['duration_time'];
    $sqlAreas = "SELECT * FROM mission_areas WHERE versionid = $versionid";
    $resultTeamAreas = mysql_query($sqlAreas);
    while ($rowTeamAreas = mysql_fetch_array($resultTeamAreas))
    {
        $area = $rowTeamAreas['areaname'];
        if (array_key_exists($area, $areasArray)) {
            $areasArray[$area] = $areasArray[$area] + 1;
        }
        else
        {
            $areasArray[$area] = 1;
        }
    }

    return array($totalTimeInSessions, $areasArray);
}

function createBarChart($KeyValueArray)
{
    $barValues = "";
    $barTitles = "";
    print_r($KeyValueArray);
    foreach ($KeyValueArray as $key => $value)
    {
        echo $barValues;
        $barTitles = $barTitles . "|" . $key;
        $barValues = $barValues . "," . $value;
    }
    //echo $barValues;
    //$barTitles = substr($barTitles,1,strlen($barTitles));
    $barValues = substr($barValues, 1, strlen($barValues));


    return "https://chart.googleapis.com/chart?chxt=x&cht=bvs&chd=s:c9uDc&chco=76A4FB&chls=2.0&chs=200x125&chd=t:$barValues&chxl=0:$barTitles";
}
?>