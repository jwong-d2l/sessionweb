$(document).ready(function () {

    var sessionID = $(document).getUrlParam("sessionid");
    $.ajax({
        type: "GET",
        data: {
            sessionid: sessionID
        },
        url: 'api/session/get/index.php',
        complete: function (data) {

            if (data.status == '200') {
                var jsonResponseContent = jQuery.parseJSON(data.responseText);
                setSessionData(jsonResponseContent);
                $("#tabs").tabs();

            } else if (data.status == '400') {
                $('#message').prepend('<div class="log_div">Error: Some parameters was missing in request.</div>');
            } else if (data.status == '401') {
                $('#message').prepend('<div class="log_div">Error: Unauthorized.</div>');
            } else if (data.status == '409') {
                $('#message').prepend('<div class="log_div">Warning: User ' + $('#user_username').val() + 'already exist!</div>');
            } else if (data.status == '500') {
                $('#message').prepend('<div class="log_div">Error: User not added due to internal server error.</div>');
            }
        }
    });

    AddRequirementManager();
    AddBugManager();
    AddSessionLinkManager();
    AddNewAreaManager();
    AddNewAutofetchedSwManager();

    ShowHideAreaRows();
    ShowHideAddTester();
    ShowHideSprint();
    ShowHideTeam();
    ShowHideTestenv();

    ChangeOfMode();
    ChangeOfMetrics();
    ChangeOfDuration();
    ChangeOfSprint();
    ChangeOfTeam();
    ChangeOfAdditionalTester();
    ChangeOfArea();
    ChangeOfTestenvironment();
    ChangeOfSwUnderTest();


});

function ChangeOfAdditionalTester() {
    var sessionID = $(document).getUrlParam("sessionid");

    $('#idAdditionalTester').change(function () {
        $.ajax({
            type: "POST",
            data: {
                sessionid: sessionID,
                names: $('#idAdditionalTester').val()
            },
            url: 'api/testers/set/index.php',
            complete: function (data) {
                if (data.status != '200') {
                    alert("Could not update additional testers names");
                }
            }
        });
    });
}

function ChangeOfArea() {
    var sessionID = $(document).getUrlParam("sessionid");

    $('#idArea').change(function () {
        $.ajax({
            type: "POST",
            data: {
                sessionid: sessionID,
                names: $('#idArea').val()
            },
            url: 'api/area/set/index.php',
            complete: function (data) {
                if (data.status != '200') {
                    alert("Could not update areas");
                }
            }
        });
    });
}

function ChangeOfSprint() {
    var sessionID = $(document).getUrlParam("sessionid");
    $('#idSprint').change(function () {
        $.ajax({
            type: "GET",
            data: {
                sessionid: sessionID,
                name: $('#idSprint').val()
            },
            url: 'api/sprint/set/index.php',
            complete: function (data) {
                if (data.status != '200') {
                    alert("Could not update sprint name");
                }
            }
        });
    });
}

function ChangeOfCharter() {
    var sessionID = $(document).getUrlParam("sessionid");
    $('#idSoftwareUnderTest').change(function () {
        $.ajax({
            type: "POST",
            data: {
                sessionid: sessionID,
                text: $('#idSoftwareUnderTest').val()
            },
            url: 'api/software/set/index.php',
            complete: function (data) {
                if (data.status != '200') {
                    alert("Could not update software information");
                }
            }
        });
    });
}

function ChangeOfSwUnderTest() {
    var sessionID = $(document).getUrlParam("sessionid");
    $('#idSoftwareUnderTest').change(function () {
        $.ajax({
            type: "POST",
            data: {
                sessionid: sessionID,
                text: $('#idSoftwareUnderTest').val()
            },
            url: 'api/software/set/index.php',
            complete: function (data) {
                if (data.status != '200') {
                    alert("Could not update software information");
                }
            }
        });
    });
}

function ChangeOfTestenvironment() {
    var sessionID = $(document).getUrlParam("sessionid");
    $('#idEnvironment').change(function () {
        $.ajax({
            type: "GET",
            data: {
                sessionid: sessionID,
                name: $('#idEnvironment').val()
            },
            url: 'api/testenvironment/set/index.php',
            complete: function (data) {
                if (data.status != '200') {
                    alert("Could not update testenvironment name");
                }
            }
        });
    });
}

function ChangeOfTeam() {
    var sessionID = $(document).getUrlParam("sessionid");
    $('#idTeam').change(function () {
        $.ajax({
            type: "GET",
            data: {
                sessionid: sessionID,
                name: $('#idTeam').val()
            },
            url: 'api/team/set/index.php',
            complete: function (data) {
                if (data.status != '200') {
                    alert("Could not update team name");
                }
            }
        });
    });
}

function ChangeOfDuration() {
    var sessionID = $(document).getUrlParam("sessionid");

    $('.duration').change(function () {
        $.ajax({
            type: "GET",
            data: {
                sessionid: sessionID,
                duration: parseInt($("#durId").val())
            },
            url: 'api/duration/set/index.php',
            complete: function (data) {
                if (data.status != '200') {
                    alert("Could not update duration");
                }
            }
        });
    });
}

function ChangeOfMetrics() {
    var sessionID = $(document).getUrlParam("sessionid");

    $('.metrics').change(function () {
        var setup = parseInt($("#setupId").val());
        var test = parseInt($("#testId").val());
        var bug = parseInt($("#bugId").val());
        var opp = parseInt($("#oppId").val());
        var sum = setup + test + bug + opp;
        if (sum == 100) {
            $('#metricsCalc').css('border', "solid 2px green");
            $('#metricsCalc').html(sum + "%");
            $.ajax({
                type: "GET",
                data: {
                    sessionid: sessionID,
                    setup: parseInt($("#setupId").val()),
                    test: parseInt($("#testId").val()),
                    bug: parseInt($("#bugId").val()),
                    opp: parseInt($("#oppId").val()),
                },
                url: 'api/metrics/set/index.php',
                complete: function (data) {
                    if (data.status != '200') {
                        alert("Could not update metrics");
                    }
                }
            });
        }
        else {
            $('#metricsCalc').css('border', "solid 2px red");
            $('#metricsCalc').html(sum + "% (should be 100%)");
        }
    });
}
function ChangeOfMode() {
    var sessionID = $(document).getUrlParam("sessionid");
    $('.session_mode').click(function () {
        $('.session_mode').css('border', "solid 2px white");
        $(this).css('border', "solid 2px green");
        $.ajax({
            type: "GET",
            data: {
                sessionid: sessionID,
                mood: $(this).attr('value')
            },
            url: 'api/mood/set/index.php',
            complete: function (data) {
                if (data.status != '200') {
                    alert("Could not update mood");
                }
            }
        });
    });
}

//Resize of form elements
function ShowHideTeam() {
    $('#minimizeTeam').hide();
    $('#maximizeTeam').click(function () {
        $('#idTeam').attr('size', 20);
        $('#minimizeTeam').show();
        $('#maximizeTeam').hide();
    });

    $('#minimizeTeam').click(function () {
        $('#idTeam').attr('size', 1);
        $('#maximizeTeam').show();
        $('#minimizeTeam').hide();
    });
}

function ShowHideTestenv() {
    $('#minimizeTestenv').hide();
    $('#maximizeTestenv').click(function () {
        $('#idEnvironment').attr('size', 20);
        $('#minimizeTestenv').show();
        $('#maximizeTestenv').hide();
    });

    $('#minimizeTestenv').click(function () {
        $('#idEnvironment').attr('size', 1);
        $('#maximizeTestenv').show();
        $('#minimizeTestenv').hide();
    });
}

function ShowHideAddTester() {
    $('#minimizeAddTest').hide();
    $('#maximizeAddTest').click(function () {
        $('#idAdditionalTester').attr('size', 20);
        $('#minimizeAddTest').show();
        $('#maximizeAddTest').hide();
    });

    $('#minimizeAddTest').click(function () {
        $('#idAdditionalTester').attr('size', 4);
        $('#maximizeAddTest').show();
        $('#minimizeAddTest').hide();
    });
}

function ShowHideSprint() {
    $('#minimizeSprint').hide();
    $('#maximizeSprint').click(function () {
        $('#idSprint').attr('size', 20);
        $('#minimizeSprint').show();
        $('#maximizeSprint').hide();
    });

    $('#minimizeSprint').click(function () {
        $('#idSprint').attr('size', 1);
        $('#maximizeSprint').show();
        $('#minimizeSprint').hide();
    });
}

function ShowHideAreaRows() {
    $('#minimizeArea').hide();
    $('#maximizeArea').click(function () {
        $('#idArea').attr('size', 20);
        $('#minimizeArea').show();
        $('#maximizeArea').hide();
    });

    $('#minimizeArea').click(function () {
        $('#idArea').attr('size', 4);
        $('#maximizeArea').show();
        $('#minimizeArea').hide();
    });
}

/**
 * Set all data in the form to the stored values from DB
 * @param jsonResponseContent jQuery.parseJSON(data) content from URL api/session/get/index.php
 */
function setSessionData(jsonResponseContent) {
    //Title
    $('#input_title').val(jsonResponseContent['title']);
    $('#input_title_span').text(jsonResponseContent['title']);
    //Team
    $('#idTeam').val(jsonResponseContent['teamname']);

    //Sprint
    $('#idSprint').val(jsonResponseContent['sprintname']);

    //Area
    $('#idArea').val(jsonResponseContent['areas']);

    //AdditionalTester
    $('#idAdditionalTester').val(jsonResponseContent['additional_testers']);

    //testenvironment
    $('#idEnvironment').val(jsonResponseContent['testenvironment']);

    //idSoftwareUnderTest
    $('#idSoftwareUnderTest').val(jsonResponseContent['software']);

    //Requriements
    PopulateRequirements(jsonResponseContent['requirements']);

    //Bugs
    PopulateBugs(jsonResponseContent['bugs']);

    //Link to other sessions
    PopulateLinksToOtherSessions(jsonResponseContent['linked_to_session']);

    //Autofetched sw
    PopulateAutofetchedSoftware(jsonResponseContent['softwareuseautofetched']);

    //Mood
    $('#sm_' + jsonResponseContent['mood']).css('border', "solid 2px green");

    //Charter Content
    setTimeout(function () {
        SetContentsCharter(jsonResponseContent['charter']);
    }, 500);

    //Notes Content
    setTimeout(function () {
        SetContentsNotes(jsonResponseContent['notes']);
    }, 500);

    //Metrics
    $('#setupId').val(jsonResponseContent['setup_percent']);
    $('#testId').val(jsonResponseContent['test_percent']);
    $('#bugId').val(jsonResponseContent['bug_percent']);
    $('#oppId').val(jsonResponseContent['opportunity_percent']);
    $('#durId').val(jsonResponseContent['duration_time']);

    $(".colorPopUp").colorbox({
        iframe: true,
        width: "80%",
        height: "80%"
    });
}

//AUTOFETCHED SW MANAGER
function AddNewAutofetchedSwManager() {

    $('#addAutoFetchedSw').click(function () {
        var sessionID = $(document).getUrlParam("sessionid");
        if ($('#idEnvironment option:selected').text() != "") {
            $.ajax({
                type: "GET",
                data: {
                    sessionid: sessionID,
                    env: $('#idEnvironment option:selected').text()
                },
                url: 'api/softwareautofetched/set/index.php',
                complete: function (data) {
                    if (data.status == '200') {
                        var response = data.responseText;

                        var resultArray = $.parseJSON(response);
                        var id = resultArray['id'];
                        var environment = resultArray['environment'];
                        var updated = resultArray['updated'];
                        AddSingelAutofetchedSoftware(id, environment, updated, "Nobody");

                    }
                }
            });
        }
    });

}

function PopulateAutofetchedSoftware(softwareids) {
    $.each(softwareids, function (index, value) {
        AddSingelAutofetchedSoftware(value['id'], value['environment'], value['updated']);
    });
}

function AddSingelAutofetchedSoftware(aId, env, updated) {
    var linkName = env + '(' + updated + ')';
    $('#autoSoftwareVersions').append(
        '<p class="sw_p" id="' + aId + '_sw">' +
            '    <span onClick="onSoftwareAutoFetchedDeleteClick(' + aId + ')">[-]</span>' +
            '    <span onClick="onSoftwareAutoFetchedClick(' + aId + ')" href="api/softwareautofetched/get/index.php?id=' + aId + '">' + linkName + '</span>' +
            "</p>");

}

function onSoftwareAutoFetchedDeleteClick(aId) {
    $.ajax({
        type: "GET",
        data: {
            id: aId
        },
        url: 'api/softwareautofetched/delete/index.php',
        complete: function (data) {
            if (data.status == '200') {
                $('#' + aId + '_sw').remove();
            }
        }
    });
}

function onSoftwareAutoFetchedClick(aId) {
    var url = 'api/softwareautofetched/get/index.php?id=' + aId;
    $(this).colorbox({
        href: url,
        iframe: true,
        innerWidth: "80%",
        innerHeight: "80%",
        open: true
    });
}

//REQ MANAGER
function AddRequirementManager() {
    $('#new_requirement').hide();
    $('#addReq').click(function () {
        $('#new_requirement').show();
        $('#new_requirement').focus();
    });
    $("#new_requirement").keypress(function () {
        if (event.which == 13) {
            CreateRequirement(this.value);
            $('#new_requirement').val("");
        }
    });
    $("#new_requirement").focusout(function () {
        $('#new_requirement').hide();
        $('#new_requirement').val("");
    });
}

function PopulateRequirements(req) {

    req.forEach(function (aReq) {
        AddSingleRequirement(aReq)
    });

}

function onRequirementLinkDeleteClick(aId) {
    var sessionID = $(document).getUrlParam("sessionid");
    $.ajax({
        type: "GET",
        data: {
            sessionid: sessionID,
            id: aId
        },
        url: 'api/requirement/delete/index.php',
        complete: function (data) {
            if (data.status == '200') {
                $('#' + aId + 'REQ').remove();
            }
        }
    });
}

function CreateRequirement(requirementId) {
    var sessionID = $(document).getUrlParam("sessionid");
    $.ajax({
        type: "GET",
        data: {
            sessionid: sessionID,
            id: requirementId
        },
        url: 'api/requirement/set/index.php',
        complete: function (data) {
            if (data.status == '201') {
                AddSingleRequirement(requirementId);
            }
            else if (data.status == '404') {
                alert("Could not create link, please check that the sessionid you link to is valid");
            }
            else if (data.status == '409') {
                alert("Can not add link, requirement already mapped to session");
            }
        }
    });
}

function AddSingleRequirement(aReq) {
    $('#testReqId').append('<p class="sw_p" id="' + aReq + 'REQ">' + aReq + ': Loading title</p>');
    $.ajax({
        type: "GET",
        data: {
            reqId: aReq
        },
        url: 'api/titles/requirement/get/index.php',
        complete: function (data) {

            if (data.status == '200') {
                var title = data.responseText;
                if (title == "") {
                    title = aReq;
                }
                $('#' + aReq + 'REQ').html('<span id="req_del_' + aReq + '>"<span onClick="onRequirementLinkDeleteClick(' + aReq + ')">[-]</span>' + aReq + ': <a class="sw_p" href="' + url_to_rms + '' + aReq + '" target="_blank">' + title + '</a></span><br></span>');
            }
        }
    });
}

//BUG MANAGER
function AddBugManager() {
    $('#new_bug').hide();
    $('#addBug').click(function () {
        $('#new_bug').show();
        $('#new_bug').focus();
    });
    $("#new_bug").keypress(function () {
        if (event.which == 13) {
            CreateBug(this.value);
            $('#new_bug').val("");
        }
    });
    $("#new_bug").focusout(function () {
        $('#new_bug').hide();
        $('#new_bug').val("");
    });
}

function onBugLinkDeleteClick(aId) {
    var sessionID = $(document).getUrlParam("sessionid");
    $.ajax({
        type: "GET",
        data: {
            sessionid: sessionID,
            id: aId
        },
        url: 'api/bug/delete/index.php',
        complete: function (data) {
            if (data.status == '200') {
                $('#' + aId + 'BUG').remove();
            }
        }
    });
}

function CreateBug(bugId) {
    var sessionID = $(document).getUrlParam("sessionid");
    $.ajax({
        type: "GET",
        data: {
            sessionid: sessionID,
            id: bugId
        },
        url: 'api/bug/set/index.php',
        complete: function (data) {
            if (data.status == '201') {
                AddSingleBug(bugId);
            }
            else if (data.status == '404') {
                alert("Could not create link, please check that the sessionid you link to is valid");
            }
            else if (data.status == '409') {
                alert("Can not add link, bug already mapped to session");
            }
        }
    });
}

function AddSingleBug(aBug) {
    $('#testBugId').append('<p class="sw_p" id="' + aBug + 'BUG">' + aBug + ': Loading title</p>');
    $.ajax({
        type: "GET",
        data: {
            id: aBug
        },
        url: 'api/titles/bug/get/index.php',
        complete: function (data) {

            if (data.status == '200') {
                var title = data.responseText;
                if (title == "") {
                    title = aBug;
                }
                $('#' + aBug + 'BUG').html('<span id="bug_del_' + aBug + '>"<span onClick="onBugLinkDeleteClick(' + aBug + ')">[-]</span>' + aBug + ': <a class="sw_p" href="' + url_to_dms + '' + aBug + '" target="_blank">' + title + '</a></span><br></span>');
            }
        }
    });
}

function PopulateBugs(bugs) {

    bugs.forEach(function (aBug) {
        AddSingleBug(aBug)
    });

}

//SESSIONLINKS MANAGER
function AddSessionLinkManager() {
    $('#new_sessionlink').hide();
    $('#addSessionLink').click(function () {
        $('#new_sessionlink').show();
        $('#new_sessionlink').focus();
    });
    $("#new_sessionlink").keypress(function () {
        if (event.which == 13) {
            CreateSessionLink(this.value)
            //AddSingleSessionLink(this.value);
            $('#new_sessionlink').val("");
        }
    });
    $("#new_sessionlink").focusout(function () {
        $('#new_sessionlink').hide();
        $('#new_sessionlink').val("");
    });
}

function onSessionLinkDeleteClick(aId) {
    var sessionID = $(document).getUrlParam("sessionid");
    $.ajax({
        type: "POST",
        data: {
            from: sessionID,
            to: aId
        },
        url: 'api/sessionlink/delete/index.php',
        complete: function (data) {
            if (data.status == '200') {
                $('#sl_del_' + aId).remove();
            }
        }
    });
}

function CreateSessionLink(sessionIdToLinkTo) {
    var sessionID = $(document).getUrlParam("sessionid");
    if (sessionID == sessionIdToLinkTo) {
        alert("Can not link session to itself")
    }
    else {
        $.ajax({
            type: "GET",
            data: {
                from: sessionID,
                to: sessionIdToLinkTo
            },
            url: 'api/sessionlink/set/index.php',
            complete: function (data) {
                if (data.status == '201') {
                    AddSingleSessionLink(sessionIdToLinkTo);
                }
                else if (data.status == '404') {
                    alert("Could not create link, please check that the sessionid you link to is valid");
                }
                else if (data.status == '409') {
                    alert("Can not add link, already mapped to session");
                }
            }
        });
    }
}

function AddSingleSessionLink(aLink) {

    $('#linkToOtherSessions').append('<p id="' + aLink + 'SessionLink">' + aLink + ': Loading title</p>');
    $.ajax({
        type: "GET",
        data: {
            sessionid: aLink
        },
        url: 'api/titles/session/get/index.php',
        complete: function (data) {

            if (data.status == '200') {
                var title = data.responseText;

                $('#' + aLink + 'SessionLink').html('<span class="sw_p" id=sl_del_' + aLink + '> <span onClick="onSessionLinkDeleteClick(' + aLink + ')">[-]</span>' + aLink + ': <a href="session.php?sessionid=' + aLink + '&command=view" target="_blank">' + title + '</a></span>');
            }
            else if (data.status == '404') {
                var title = "Could not find title for session"
                $('#' + aLink + 'SessionLink').html('<span class="sw_p"> <span id="s_' + aLink + '">[-]</span>' + aLink + ': <a href="session.php?sessionid=' + aLink + '&command=view" target="_blank">' + title + '</a></span>');
            }
        }
    });
}

function PopulateLinksToOtherSessions(linksToOtherSessions) {

    linksToOtherSessions.forEach(function (aLink) {
        AddSingleSessionLink(aLink);
    });
}

//ADD NEW AREA MANAGER
function AddNewAreaManager() {
    $('#addNewAreaInput').hide();
    $('#addNewArea').click(function () {
        $('#addNewAreaInput').show();
        $('#addNewAreaInput').focus();
    });
    $("#addNewAreaInput").keypress(function () {
        if (event.which == 13) {
            AddNewAreaToDb(this.value);
            $('#addNewArea').val("");
        }
    });
    $("#addNewAreaInput").focusout(function () {
        $('#addNewAreaInput').hide();
        $('#addNewAreaInput').val("");
    });
}

function AddNewAreaToDb(areaName) {
    $.ajax({
        type: "GET",
        data: {
            area: areaName
        },

        url: 'api/settings/area/add/index.php',
        complete: function (data) {

            if (data.status == '201') {
                updateAreas();
            }
        }
    });
}

function updateAreas() {
    $.ajax({
        type: "GET",
        url: 'api/area/getareas/index.php',
        complete: function (data) {

            if (data.status == '200') {
                var jsonResponseContent = jQuery.parseJSON(data.responseText);
                $('#idArea').html('');
                $.each(jsonResponseContent, function (index, value) {
                    $('#idArea').append('<option>' + value + '</option>');
                });

            }
        }
    });
}

//EDITOR MANAGER
function SetContentsCharter(text) {
    var editor = CKEDITOR.instances.chartereditor;
    editor.setData(text);
}

function SetContentsNotes(text) {
    var editor = CKEDITOR.instances.noteseditor;
    editor.setData(text);
}

function GetContentsCharter() {
    var editor = CKEDITOR.instances.chartereditor;
    return editor.getData();
}

function GetContentsNotes() {
    var editor = CKEDITOR.instances.noteseditor;
    return editor.getData();
}