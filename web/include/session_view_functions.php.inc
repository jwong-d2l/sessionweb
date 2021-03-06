<?php

define("GET_FILE_PATH", "include/filemanagement/get.php");
define("DELETE_FILE_PATH", "include/filemanagement/get.php");
define("THUMB_FILE_PATH", "include/filemanagement/thumbnails/");


function echoAttachments()
{


    $picture_mimetypes = array("jpg" => "image/jpeg", "jpeg" => "image/jpeg", "gif" => "image/gif", "png" => "image/png");

    getMySqlConnection();


    $sql = "SELECT id,mission_versionid, filename, size, mimetype FROM `mission_attachments` WHERE `mission_versionid` = " . $_GET['sessionid'];
    //echo $sql;
    $result = mysql_query($sql);
    if($result)
    {
    echo "<table border='0'>\n";
    while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
        $id = $row[0];
        $filename = $row[2];
        $size = $row[3];
        $mimetype = $row[4];

        echo "<tr>\n";
        if (in_array($mimetype, $picture_mimetypes)) {
            echo "                <td class='preview'> <a href='" . GET_FILE_PATH . "?id=" . $id . "' target='_blank'><img src='" . THUMB_FILE_PATH . htmlspecialchars($filename) . "'></a></td>\n";
        }
        else
        {
            if (strcmp($mimetype, "application/msword") == 0)
                echo "                <td class='preview'><img src='pictures/x-office-document.png'></a></td>\n";
            elseif (strcmp($mimetype, "application/vnd.ms-excel") == 0)
                echo "                <td class='preview'><img src='pictures/x-office-spreadsheet.png'></a></td>\n";
            elseif (strcmp($mimetype, "application/vnd.ms-powerpoint") == 0)
                echo "                <td class='preview'><img src='pictures/x-office-presentation.png'></a></td>\n";
            elseif (strcmp($mimetype, "text/plain") == 0)
                echo "                <td class='preview'><img src='pictures/text-x-generic.png'></a></td>\n";
            elseif (strcmp($mimetype, "application/pdf") == 0)
                echo "                <td class='preview'><img src='pictures/application-pdf.png'></a></td>\n";
            elseif (strcmp($mimetype, "text/html") == 0)
                echo "                <td class='preview'><img src='pictures/text-html-2.png'></a></td>\n";
            elseif (strcmp($mimetype, "application/x-zip-compressed") == 0)
                echo "                <td class='preview'><img src='pictures/zip_icon.jpg'></a></td>\n";
            else
                echo "                <td class='preview'><img src='pictures/blank-mimetype.png'></a></td>\n";

        }

        if (in_array($mimetype, $picture_mimetypes)) {
            echo "                <td class='name'><a href='" . GET_FILE_PATH . "?id=" . $id . "' target='_blank'>" . $filename . "</a></td>\n";

        }
        else
        {
            echo "                <td class='name'><a href='" . GET_FILE_PATH . "?id=" . $id . "'>" . $filename . "</a></td>\n";


        }
        if ($size / 1024 / 1024 > 1)
            echo "                <td class='name'>" . number_format($size / 1024 / 1024, 2) . "MB</td>\n";
        else
            echo "                <td class='name'>" . number_format($size / 1024, 2) . "KB</td>\n";


        echo "                </tr>\n";
    }
    echo "</table>\n";
    }

}


function echoSessionAction()
{
    $sessionid = $_REQUEST["sessionid"];

    $con = getMySqlConnection();

    $row = getSessionData($sessionid);

    //echo "Action menu: ";
    if (strcmp($_SESSION['username'], $row["username"]) == 0 || strcmp($_SESSION['superuser'], "1") == 0 || strcmp($_SESSION['useradmin'], "1") == 0) {
        echo "<a id='edit_session' class='url_edit_session' href='session.php?sessionid=$sessionid&command=edit'>";
        echo "<img class='picture_edit_session' src='pictures/edit.png' border='0' alt='edit session' title='Edit session'>";
        echo "</a>";
        echo " | <span id='reassign_session' class='reassign_session'>";
        echo "<img class='picture_reassign_session' src='pictures/user.gif' border='0' alt='Reassign session' title='Reassign session'>";
        echo "</span>";
    }
    if (strcmp($_SESSION['username'], $row["username"]) == 0 || strcmp($_SESSION['useradmin'], "1") == 0) {
        echo " | <span id='delete_session'>";
        echo "<img src='pictures/close.png' border='0' alt='Delete session' title='Delete session' class='delete_session'>";
        echo "</span>";
    }

    if ($_SESSION['settings']['publicview'] == 1) {
        echo " | <a id='publicview_session' class='publicview_session' href='publicview.php?sessionid=$sessionid&command=view&publickey=" . getSessionPublicKeyBasedOnSessionId($sessionid) . "'>";
        echo "<img src='pictures/share.png' border='0' alt='Share session' title='Share session'>";
        echo "</a>";
    }
    echo " | <span id='copy_session' class='copy_session' href='session.php?command=copy&sessionid=$sessionid'>";
    echo "<img src='pictures/edit-copy-9-small.png' border='0' alt='Copy session' title='Copy session'>";
    echo "</span>";
    echo " | ";
    echo "<a id='addNotification' class='colorboxhreflarge' href='include/notification.php?sessionid=$sessionid&cmd=add'>";

    echo "<img src='pictures/star_smal.png' border='0' alt='Add notification' title=' Add notification'></a>";
    mysql_close($con);
}

function echoViewSession()
{
    if ($_GET["sessionid"] != null) {
        $con = getMySqlConnection();


        $sqlSelectSession = "";
        $sqlSelectSession .= "SELECT * ";
        $sqlSelectSession .= "FROM   mission ";
        $sqlSelectSession .= "WHERE  sessionid = " . $_GET["sessionid"];

        $resultSession = mysql_query($sqlSelectSession);

        if (!$resultSession) {
            echo "echoViewSession: " . mysql_error() . "<br/>";
        }
        else
        {
            $row = mysql_fetch_array($resultSession);
            if ($row["versionid"] != null) {
                $rowSessionMetric = getSessionMetrics($row["versionid"]);

                $rowSessionStatus = getSessionStatus($row["versionid"]);

                echo "<h1>View Session</h1>\n";
                echo "<table style=\"text-align: left;\" border=\"0\" cellpadding=\"0\" cellspacing=\"5\">";
                echo "    <tr>\n";
                echo "        <td></td>\n";
                echo "        <td>\n";
                echo "            <h3>Session title</h3>\n";
                echo "            <div class='graybox'>\n";
                echo "                <span class='grayboxtext'><span class='larger'>" . $row["title"] . "</span></span>\n";
                echo "            </div>\n";
                echo "        </td>\n";
                echo "    </tr>\n";
                echo "    <tr>\n";
                echo "        <td align=\"left\">\n";
                echo "            &nbsp;&nbsp;&nbsp;\n";
                echo "        </td>\n";
                echo "        <td align=\"left\">\n";
                echo "        <table style=\"text-align: left;\" border=\"0\" cellpadding=\"0\" cellspacing=\"4\">";
                echo "            <tr>\n";
                echo "                <td align=\"left\" valign='top'>\n";
                echo "                    <h4>Sessionid</h4>\n";
                echo "                    <div style=\"background-color:#efefef;\">\n";
                echo "                        " . $row["sessionid"] . "\n";
                echo "                    </div>\n";
                echo "                </td>\n";

                $sessionid = $row["sessionid"];
                $versionid = getSessionVersionId($sessionid);
                $testersArray = getSessionAdditionalTester($versionid);
                echo "                <td align=\"left\" valign='top'>\n";
                echo "                    <h4>Testers</h4>\n";
                echo "                    <div style=\"background-color:#efefef;\">\n";
                echo "                        <span class='stronger'>" . $row["username"] . "</span><br>\n";
                foreach ($testersArray as $tester)
                {
                    echo "                        $tester<br>\n";
                }
                echo "                    </div>\n";
                echo "                </td>\n";

                if ($_SESSION['settings']['team'] == 1) {
                    $value = $row["teamname"];
                    if ($row["teamname"] == "") {
                        $value = "&nbsp;";
                    }
                    echo "                <td align=\"left\" valign='top'>\n";
                    echo "                    <h4>Teamname</h4>\n";
                    echo "                    <div style=\"background-color:#efefef;\">\n";
                    echo "                        $value\n";
                    echo "                    </div>\n";
                    echo "                </td>\n";
                }
                if ($_SESSION['settings']['sprint'] == 1) {
                    $value = $row["sprintname"];
                    if ($row["sprintname"] == "") {
                        $value = "&nbsp;";
                    }
                    echo "                <td align=\"left\" valign='top'>\n";
                    echo "                    <h4>Sprintname</h4>\n";
                    echo "                    <div style=\"background-color:#efefef;\">\n";
                    echo "                        $value\n";
                    echo "                    </div>\n";
                    echo "                </td>\n";
                }
                if ($_SESSION['settings']['teamsprint'] == 1) {
                    $value = $row["teamsprintname"];
                    if ($row["teamsprintname"] == "") {
                        $value = "&nbsp;";
                    }
                    echo "                <td align=\"left\" valign='top'>\n";
                    echo "                    <h4>Team sprintname</h4>\n";
                    echo "                    <div style=\"background-color:#efefef;\">\n";
                    echo "                        $value\n";
                    echo "                    </div>\n";
                    echo "                </td>\n";
                }

                if ($_SESSION['settings']['area'] == 1) {
                    $sessionid = $row["sessionid"];
                    $versionid = getSessionVersionId($sessionid);
                    $areaArray = getSessionAreas($versionid);
                    echo "                <td align=\"left\" valign='top'>\n";
                    echo "                    <h4>Area</h4>\n";
                    echo "                    <div style=\"background-color:#efefef;\">\n";
                    if (empty($areaArray)) {
                        echo "                        &nbsp;<br>\n";
                    }
                    else
                    {
                        foreach ($areaArray as $area)
                        {
                            echo "                        $area<br>\n";
                        }
                    }
                    echo "                    </div>\n";
                    echo "                </td>\n";
                }

                if ($_SESSION['settings']['testenvironment'] == 1) {
                    $value = $row["testenvironment"];
                    if ($row["testenvironment"] == "") {
                        $value = "&nbsp;";
                    }
                    echo "                <td align=\"left\" valign='top'>\n";
                    echo "                    <h4>Testenvironment</h4>\n";
                    echo "                    <div style=\"background-color:#efefef;\">\n";
                    echo "                        $value\n";
                    echo "                    </div>\n";
                    echo "                </td>\n";
                }
                echo "                </tr>";
                echo "                <tr>";

                echo "                <td align=\"left\" valign='top'>\n";
                echo "                      <h4>Mood</h4>\n";
                echo "                      <div style=\"background-color:#efefef;\">\n";
                echoMoodStatus($rowSessionMetric);
                echo "                      </div>\n";
                echo "                </td>\n";

                echo "                <td align=\"left\" valign='top'>\n";
                echo "                      <h4>Status</h4>\n";
                echo "                      <div style=\"background-color:#efefef;\">\n";
                echoExecutedStatus($rowSessionStatus);
                echo "                      </div>\n";
                echo "                </td>\n";
                echo "                <td align=\"left\" valign='top'>\n";
                echo "                      <h4>Debriefed</h4>\n";
                echo "                      <div style=\"background-color:#efefef;\">\n";
                echoDebriefedStatus($rowSessionStatus);
                echo "                      </div>\n";
                echo "                </td>\n";
                echo "                <td align=\"left\" valign='top'>\n";
                echo "                    <h4>Last updated by</h4>\n";
                echo "                    <div style=\"background-color:#efefef;\">\n";
                echo "                        " . $row["lastupdatedby"] . "\n";
                echo "                    </div>\n";
                echo "                </td>\n";
                echo "                <td align=\"left\" valign='top'>\n";
                echo "                    <h4>Updated</h4>\n";
                echo "                    <div style=\"background-color:#efefef;\">\n";
                echo "                        " . $row["updated"] . "\n";
                echo "                    </div>\n";
                echo "                </td>\n";
                echo "            </tr>\n";
                echo "        </table>";
                echo " </td>\n";
                echo "    </tr>\n";


                //Customfields
                $selectCustomArray = array("custom1", "custom2", "custom3");
                foreach ($selectCustomArray as $oneSelectToEcho)
                {
                    if ($_SESSION['settings'][$oneSelectToEcho] == 1) {
                        echo "    <tr>\n";
                        echo "        <td></td>\n";
                        echo "        <td>\n";
                        echo "            <h4>" . $_SESSION['settings'][$oneSelectToEcho . '_name'] . "</h4>\n";
                        echo "        </td>\n";
                        echo "    </tr>\n";
                        echo "    <tr>\n";
                        echo "        <td></td>\n";
                        echo "        <td>\n";
                        $itemsToDisplay = getSessionCustomValues($row["versionid"], $oneSelectToEcho);
                        echo "            <div style=\"background-color:#efefef;width: 1024px; height: 100%; background-color: rgb(239, 239, 239);\">\n";

                        foreach ($itemsToDisplay as $item)
                        {
                            echo "$item<br>";
                        }
                        echo "</div>";

                        echo "        </td>\n";
                        echo "    </tr>\n";
                    }
                }

                //WordCloud
                if ($_SESSION['settings']['wordcloud'] == 1) {
                    echo "    <tr>\n";
                    echo "        <td></td>\n";
                    echo "        <td>\n";
                    echo "            <h4>WordCloud</h4>\n";
                    echo "        </td>\n";
                    echo "    </tr>\n";
                    echo "    <tr>\n";
                    echo "        <td></td>\n";
                    echo "        <td>\n";
                    echo "<iframe src='graph/wordcloud.php?sessionid=" . $row["sessionid"] . "' width='100%' height='120' frameborder='0'>";
                    echo "  <p>Your browser does not support iframes.</p>";
                    echo "</iframe>";
                    echo "        </td>\n";
                    echo "    </tr>\n";
                }

                echo "    <tr>\n";
                echo "        <td></td>\n";
                echo "        <td>\n";
                echo "            <h4>Software under test</h4>\n";
                echo "        </td>\n";
                echo "    </tr>\n";
                echo "    <tr>\n";
                echo "        <td></td>\n";
                echo "        <td>\n";
                echo str_replace("\n", "<br>", $row["software"]);
                echo "        </td>\n";
                echo "    </tr>\n";
                echo "    <tr>\n";
                echo "        <td></td>\n";
                echo "        <td>\n";
                echoFetchVersionView();
                echo "        </td>\n";
                echo "    </tr>\n";


                echo "    <tr>\n";
                echo "        <td></td>\n";
                echo "        <td>\n";
                echo "            " . echoRequirementsView($row["versionid"]) . "\n";
                echo "        </td>\n";
                echo "    </tr>\n";

                $con = getMySqlConnection();


                echo "    <tr>\n";
                echo "        <td></td>\n";
                echo "        <td>\n";
                echo "            " . echoConnectedToSessions($row["versionid"]) . "\n";
                echo "        </td>\n";
                echo "    </tr>\n";
                echo "    <tr>\n";
                echo "        <td></td>\n";
                echo "        <td>\n";
                echo "            " . echoConnectedFromSessions($row["versionid"]) . "\n";
                echo "        </td>\n";
                echo "    </tr>\n";

                echo "    <tr>\n";
                echo "        <td></td>\n";
                echo "        <td>\n";
                echo "            <div id='shortboldline'></div>\n";
                echo "        </td>\n";
                echo "    </tr>\n";
                echo "    <tr>\n";
                echo "        <td align=\"left\" valign=\"top\">\n";
                echo "            \n";
                echo "        </td>\n";
                echo "        <td align=\"left\">\n";
                echo "        <h2>Charter</h2>\n";
                echo "            <div class='graybox'>\n";
                echo "                <span class='grayboxtext'>" . $row["charter"] . "</span>\n";
                echo "            </div>\n";
                echo "        </td>\n";
                echo "    </tr>\n";

                echo "    <tr>\n";
                echo "        <td></td>\n";
                echo "        <td>\n";
                echo "            <div id='shortboldline'></div>\n";
                echo "        </td>\n";
                echo "    </tr>\n";
                echo "    <tr>\n";
                echo "        <td align=\"left\" valign=\"top\">\n";
                echo "            \n";
                echo "        </td>\n";
                echo "        <td align=\"left\">\n";
                echo "        <h2>Session notes</h2>\n";
                echo "            <div style=\"background-color:#efefef;width: 1024px; height: 100%; background-color: rgb(239, 239, 239);\">\n";
                echo "                " . $row["notes"] . "\n";
                echo "            </div>\n";
                echo "        </td>\n";
                echo "    </tr>\n";

                echo "    <tr>\n";
                echo "        <td></td>\n";
                echo "        <td>\n";
                echo "            <div id='shortboldline'></div>\n";
                echo "        </td>\n";
                echo "    </tr>\n";

                echo "    <tr>\n";
                echo "        <td></td>\n";
                echo "        <td>\n";
                echo "            <h2>Attachments</h2>\n";
                echo "        </td>\n";
                echo "    </tr>\n";
                echo "    <tr>\n";
                echo "        <td></td>\n";
                echo "        <td>\n";
                echoAttachments();
                echo "        </td>\n";
                echo "    </tr>\n";

                echo "    <tr>\n";
                echo "        <td></td>\n";
                echo "        <td>\n";
                echo "            <div id='shortboldline'></div>\n";
                echo "        </td>\n";
                echo "    </tr>\n";

                echo "    <tr>\n";
                echo "        <td></td>\n";
                echo "        <td>\n";
                echo "            " . echoBugsView($row["versionid"]) . "\n";
                echo "        </td>\n";
                echo "    </tr>\n";

                echo "    <tr>\n";
                echo "        <td></td>\n";
                echo "        <td>\n";
                echo "            <div id='shortboldline'></div>\n";
                echo "        </td>\n";
                echo "    </tr>\n";
                $con = getMySqlConnection();

                echoSessionMetrics($rowSessionMetric, $row["versionid"]);

                $sessionDebriefNotes = getSessionDebrief($row["versionid"]);
                echo "    <tr>\n";
                echo "        <td></td>\n";
                echo "        <td>\n";
                echo "            <h2>Debrief comments</h2>\n";
                echo "        </td>\n";
                echo "    </tr>\n";
                echo "    <tr>\n";
                echo "        <td></td>\n";
                echo "        <td>\n";
                echo "            <div style=\"background-color:#efefef;width: 1024px; height: 100%; background-color: rgb(239, 239, 239);\">\n";
                echo "            <b>Note below made by: " . $sessionDebriefNotes['debriefedby'] . "</b>";

                echo             $sessionDebriefNotes['notes'];
                echo "</div>";
                echo "        </td>\n";
                echo "    </tr>\n";

                echo "    <tr>\n";
                echo "        <td></td>\n";
                echo "        <td>\n";
                if (isSessionDebriefed($row["versionid"]) || isSessionClosed($row["versionid"])) {

                    echo "            Debriefed by: " . $sessionDebriefNotes['debriefedby'];
                }
                else
                {
                    echo "            Session still not debriefed/closed.";
                }
                echo "        </td>\n";
                echo "    </tr>\n";

                echo "</table>";
            } else
            {
                echo "<p>Session does not exit..</p>";
            }

            mysql_close($con);
        }

    }
    else
    {
        echo "No session given in GET parameters..";
    }
}

function echoRequirementsView($versionid)
{
    $rowSessionreqs = getSessionRequirements($versionid);

    echo "<h4>Requirements connected to session</h4>\n";
    echo "<div id=viewreqgid style=\"background-color:#efefef;\">\n";
    foreach ($rowSessionreqs as $aRequirement)
    {
        if (is_file("include/customfunctions.php.inc")) {
            $aRequirementName = getRequirementNameFromServer($aRequirement);

        } else {
            $aRequirementName = "Link to requirement";
        }
        if ($aRequirementName != "" && $aRequirementName != "-1") {
            echo "                                   #$aRequirement:<a href=\"" . $_SESSION['settings']['url_to_rms'] . "$aRequirement\" class=\"requirementurl\" target=\"_blank\">$aRequirementName</a><br>\n";

        }
        elseif ($aRequirementName == -1)
        {
            echo "#$aRequirement:Could not connect to server to get title";
        }
        else
        {
            echo "                                   #$aRequirement:<a href=\"" . $_SESSION['settings']['url_to_rms'] . "$aRequirement\" class=\"requirementurl\" target=\"_blank\">Requirement identifier ($aRequirement) could not be found</a><br>\n";
        }

    }
    echo "</div>\n";
}


function echoBugsView($versionid)
{
    $rowSessionreqs = getSessionBugs($versionid);

    echo "<h4>Defects connected to session</h4>\n";
    echo "<div id=viewbugid style=\"background-color:#efefef;\">\n";

    foreach ($rowSessionreqs as $aBug)
    {
        if (is_file("include/customfunctions.php.inc")) {
            $aBugName = getBugNameFromServer($aBug);
        } else {
            $aBugName = $aBug;
        }
        if ($aBugName != "" && $aBugName != "-1") {
            echo "                                   #$aBug:<a href=\"" . $_SESSION['settings']['url_to_dms'] . "$aBug\" class=\"requirementurl\" target=\"_blank\">$aBugName</a><br>\n";

        }
        elseif ($aBugName == -1)
        {
            echo "#$aBug:Could not connect to server to get title";
        }
        else
        {
            echo "                                   #$aBug:<a href=\"" . $_SESSION['settings']['url_to_dms'] . "$aBug\" class=\"requirementurl\" target=\"_blank\">Defect identifier ($aBug) could not be found</a><br>\n";
        }
    }
    echo "</div>\n";
}

//Connected to sessions
function echoConnectedToSessions($versionid)
{
    $rowSessionLinkedTo = getConnectedSessions($versionid);

    echo "<h4>Connected to sessions</h4>\n";
    echo "<div id=\"sessionslinkedto\" style=\"background-color:#efefef;\">\n";


    //    foreach ($rowSessionLinkedTo as $versionid)
    foreach ($rowSessionLinkedTo as $sessionid)
    {
        $versionid = GetVersionidFromSessionid($sessionid);
        $aSessionToLink = GetSessionIdFromVersionIdNoNewDbConnection($versionid);
        $aSessionTitle = GetSessionTitleFromSessionId($aSessionToLink);

        echo "                                   Linked to: #$aSessionToLink:<a href=\"session.php?sessionid=$aSessionToLink&command=view\" class=\"requirementurl\" target=\"_blank\">$aSessionTitle</a><br>\n";
    }
    //	mysql_close($conSql1);
    echo "</div>\n";
}

function echoConnectedFromSessions($versionid)
{
    $rowSessionLinkedFrom = getSessionsLinkedFrom($versionid);

    echo "<h4>Connected from sessions</h4>\n";
    echo "<div id=\"sessionslinkedfrom\" style=\"background-color:#efefef;\">\n";

    if ($rowSessionLinkedFrom != "") {

        foreach ($rowSessionLinkedFrom as $versionid)
        {
            $aSessionFromLink = GetSessionIdFromVersionIdNoNewDbConnection($versionid);
            $aSessionTitle = GetSessionTitleFromSessionId($aSessionFromLink);

            echo "                                   Linked from: #$aSessionFromLink:<a href=\"session.php?sessionid=$aSessionFromLink&command=view\" class=\"requirementurl\" target=\"_blank\">$aSessionTitle</a><br>\n";
        }
    }
    //  mysql_close($conSql1);
    echo "</div>\n";
}


?>