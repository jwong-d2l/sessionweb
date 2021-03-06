<?php 

function echoExecutedStatus($rowSessionStatus)
{
    if($rowSessionStatus["closed"]==1)
    {
        echo "                          Closed\n";
    }
    elseif($rowSessionStatus["executed"]==1)
    {
        echo "                          Executed\n";
    }
    elseif($rowSessionStatus["debriefed"]==1)
    {
        echo "                          Debriefed\n";
    }
    else
    {
        echo "                          Not Executed\n";

    }
}

function echoMoodStatus($rowSessionMetric)
{

    if($rowSessionMetric["mood"]==1)
        echo '<img src="pictures/emotes/face-cool.png" alt=""';
    elseif($rowSessionMetric["mood"]==2)
        echo '<img src="pictures/emotes/face-plain.png" alt=""';
    elseif($rowSessionMetric["mood"]==3)
        echo '<img src="pictures/emotes/face-sad.png" alt=""';
    elseif($rowSessionMetric["mood"]==4)
        echo '<img src="pictures/emotes/face-angry.png" alt=""';
    else
        echo '-';

}

function echoDebriefedStatus($rowSessionStatus)
{
    if($rowSessionStatus["debriefed"]==1)
    {
        echo "                          Debriefed\n";
    }
    else
    {
        echo "                          Not debriefed\n";
    }
}


function echoSessionMetrics($rowSessionMetric, $versionid)
{
    $settings = $_SESSION['settings'];
    if($settings=="")
    {
    	$settings = getSessionWebSettings();
    }
    
    $setup_percent = $rowSessionMetric["setup_percent"];
    $test_percent = $rowSessionMetric["test_percent"];
    $bug_percent = $rowSessionMetric["bug_percent"];
    $opportunity_percent = $rowSessionMetric["opportunity_percent"];
    $duration_time = $rowSessionMetric["duration_time"];

    $normalized_session_time = $settings['normalized_session_time'];

    $nbrOfSession = round($duration_time/$normalized_session_time,1);

    echo "    <tr>\n";
    echo "        <td></td>\n";
    echo "        <td>\n";
    echo "            <h2>Session metrics</h2>\n";
    echo "        <table style=\"text-align: left;\" border=\"0\" cellpadding=\"0\" cellspacing=\"4\">";
    echo "            <tr>\n";
    echo "                <td align=\"left\" width=\"60\">\n";
    echo "                    <h4>Setup</h4>\n";
    echo "                    <div style=\"background-color:#efefef;\">\n";
    echo "                        $setup_percent %\n";
    echo "                    </div>\n";
    echo "                </td>\n";
    echo "                <td align=\"left\" width=\"60\">\n";
    echo "                    <h4>Test</h4>\n";
    echo "                    <div style=\"background-color:#efefef;\">\n";
    echo "                        $test_percent %\n";
    echo "                    </div>\n";
    echo "                </td>\n";
    echo "                <td align=\"left\" width=\"60\">\n";
    echo "                    <h4>Bug</h4>\n";
    echo "                    <div style=\"background-color:#efefef;\">\n";
    echo "                        $bug_percent %\n";
    echo "                    </div>\n";
    echo "                </td>\n";
    echo "                <td align=\"left\">\n";
    echo "                    <h4>Opportunity</h4>\n";
    echo "                    <div style=\"background-color:#efefef;\">\n";
    echo "                        $opportunity_percent %\n";
    echo "                    </div>\n";
    echo "                </td>\n";
    echo "                <td align=\"left\">\n";
    echo "                      <h4>Sessions duration</h4>\n";
    echo "                      <div style=\"background-color:#efefef;\">\n";
    echo "                          $duration_time (min)\n";
    echo "                      </div>\n";
    echo "                </td>\n";
    echo "                <td align=\"left\">\n";
    echo "                      <h4>Normalized Sessions count</h4>\n";
    echo "                      <div style=\"background-color:#efefef;\">\n";
    echo "                          $nbrOfSession\n";
    echo "                      </div>\n";
    echo "                </td>\n";
    echo "            </tr>\n";
    echo "        </table>";
    echo "        </td>\n";
    echo "    </tr>\n";
    echo "    <tr>\n";
    echo "        <td></td>\n";
    echo "        <td>\n";
    echo "            <img alt=\"pie chart\" src=\"".getSessionMetricsPieChartUrl($versionid)."\" /\">\n";
    echo "        </td>\n";
    echo "    </tr>\n";
}

?>