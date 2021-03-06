$(document).ready(function () {
    getUserSettings();
    setupDatePicker();

    populateRemoveAreasSelect();
    populateRemoveTeamsSelect();
    populateRemoveSprintsSelect();
    populateRemovetesTenvironmentsSelect();
    populateRemoveCustomItem1Select();
    populateRemoveCustomItem2Select();
    populateRemoveCustomItem3Select();

    showAndHideHtml();

    addArea();
    removeArea();
    addTeam();
    removeTeam();
    addSprint();
    removeSprint();
    addtestEnvironment();
    removetestEnvironment();
    addCustomItem1();
    removeCustomItem1();
    addCustomItem2();
    removeCustomItem2();
    addCustomItem3();
    removeCustomItem3();
    changePersonalPassword();
    updatePersonalSettings();

    updateCustomFields();
    updateApplicationConfig();
    bulkCloseSessions();
    addNewUser();
    deleteUser();

});

function addNewUser() {
    $('#adduser_add').click(function () {
            $('#usermessages').text('');
            if ($('#user_fullname').val().length > 3) {
                if ($('#user_username').val().length > 3) {
                    if ($('#user_pw1').val().length > 5) {
                        if ($('#user_pw1').val() == $('#user_pw2').val()) {
                            $.ajax({
                                type:"GET",
                                data:$('#adduserForm').serializeArray(),
                                url:'api/settings/user/add/index.php',
                                complete:function (data) {

                                    if (data.status == '201') {
                                        $('#log').prepend('<div class="log_div">New user added</div>');
                                    }
                                    else if (data.status == '400') {
                                        $('#log').prepend('<div class="log_div">Error: Some parameters was missing in request.</div>');
                                    }
                                    else if (data.status == '401') {
                                        $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                                        window.location.replace("index.php?logout=yes");
                                    }
                                    else if (data.status == '409') {
                                        $('#log').prepend('<div class="log_div">Warning: User ' + $('#user_username').val() + 'already exist!</div>');
                                    }
                                    else if (data.status == '500') {
                                        $('#log').prepend('<div class="log_div">Error: User not added due to internal server error.</div>');
                                    }
                                }
                            });
                        }
                        else {
                            $('#usermessages').fadeIn().text("Passwords does not match each other. Please adjust and try again.");
                        }
                    }
                    else {
                        $('#usermessages').fadeIn().text("Password not 6 chars or longer. Please adjust and try again.");
                    }
                }
                else {
                    $('#usermessages').fadeIn().text("Username need to be at least 4 chars or longer. Please adjust and try again.");
                }
            }
            else {
                $('#usermessages').fadeIn().text("Fullname need to be at least 4 chars or longer. Please adjust and try again.");
            }
        }
    )
    ;
}

function deleteUser() {
    $('#deleteuser_delete').click(function () {
        $.ajax({
            type:"DELETE",
            url:'api/settings/user/remove/index.php?username=' + $('#select_tester').val(),
            complete:function (data) {
                if (data.status == '200') {
                    $('#log').prepend('<div class="log_div">User deleted in database</div>');
                    $("#select_tester option:selected").remove();
                }
                else if (data.status == '400') {
                    $('#log').prepend('<div class="log_div">Error 400</div>');
                }
                else if (data.status == '401') {
                    $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                    window.location.replace("index.php?logout=yes");
                }
                else if (data.status == '500') {
                    $('#log').prepend('<div class="log_div">Error: Internal server error. More information exist in server log file.</div>');
                }
            }
        });
    });
}


    function bulkCloseSessions() {
        $('#bulkclosesessions_close').click(function () {
            $.ajax({
                type:"GET",
                data:"from=" + $('#datepicker_bulkclosesessions').val(),
                url:'api/session/bulkclose/index.php',
                complete:function (data) {
                    if (data.status == '200') {
                        $('#log').prepend('<div class="log_div">Sessions older then ' + $('#datepicker_bulkclosesessions').val() + ' is now in state closed.</div>');
                    }
                    else if (data.status == '400') {
                        $('#log').prepend('<div class="log_div">Bulk close: Date parameter is not given.</div>');
                    }
                    else if (data.status == '401') {
                        $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                        window.location.replace("index.php?logout=yes");

                    }
                    else if (data.status == '500') {
                        $('#log').prepend('<div class="log_div">Error: Internal server error. More information exist in server log file.</div>');
                    }
                }
            });
        });
    }

    function setupDatePicker() {
        $("#datepicker_bulkclosesessions").datepicker();
        $("#datepicker_bulkclosesessions").datepicker("option", "dateFormat", "yy-mm-dd");
    }

    function checkBoxHelper(arrayToUse, arrayItem, idToChange) {
        if (arrayToUse[arrayItem] == '1') {
            $(idToChange).attr('checked', true);
        }
        else {
            $(idToChange).attr('checked', false);
        }
    }

    function updateApplicationConfig() {
        $('#update_appconfig').click(function () {
            $.ajax({
                type:"GET",
                data:$('#appForm').serializeArray(),
                url:'api/settings/application/settings/save/index.php',
                complete:function (data) {

                    if (data.status == '201') {
                        $('#log').prepend('<div class="log_div">Application settings updated.</div>');
                    }
                    else if (data.status == '400') {
                        $('#log').prepend('<div class="log_div">Error: Some parameters was missing in request.</div>');
                    }
                    else if (data.status == '401') {
                        $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                        window.location.replace("index.php?logout=yes");


                    }
                    else if (data.status == '500') {
                        $('#log').prepend('<div class="log_div">Error: Application settings not updated due to internal server error.</div>');
                    }
                }
            });

        });
    }

    function populateApplicationSettingsSelect(userSettings) {
        if (parseInt(userSettings['admin']) == 1) {


            $.ajax({
                type:"GET",
                url:'api/application/getsettings/index.php',
                complete:function (data, xhr, statusText) {
                    if (data.status == '200') {
                        var jsonResponseContent = jQuery.parseJSON(data.responseText);
                        var optionTxt = "";
                        $("#normlizedsessiontime").val(jsonResponseContent['normalized_session_time'])
                        $("#url_to_rms").val(jsonResponseContent['url_to_rms']);
                        $("#url_to_dms").val(jsonResponseContent['url_to_dms']);
                        checkBoxHelper(jsonResponseContent, "team", "#app_team");
                        checkBoxHelper(jsonResponseContent, "sprint", "#app_sprint");
                        checkBoxHelper(jsonResponseContent, "area", "#app_area");
                        checkBoxHelper(jsonResponseContent, "testenvironment", "#app_env");
                        checkBoxHelper(jsonResponseContent, "publicview", "#app_publicview");
                        checkBoxHelper(jsonResponseContent, "wordcloud", "#app_wordcloud");
                    }
                    else if (data.status == '401') {
                        $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                        window.location.replace("index.php?logout=yes");


                    }
                    else if (data.status == '500') {
                        $('#log').prepend('<div class="log_div">Error: SQL Error</div>');
                    }
                }
            });
        }
    }

    function updatePersonalSettings() {
        $('#change_personal_settings_exe').click(function () {

            $.ajax({
                type:"GET",
                data:"listsettings=" + $('#personal_changelistsettings_options').val()
                    + "&team=" + $('#personal_select_team').val()
                    + "&sprint=" + $('#personal_select_sprint').val()
                    + "&area=" + $('#personal_select_area').val()
                    + "&autosave=" + $('#autosave').is(':checked'),
                url:'api/settings/user/personalsettings/update/index.php',
                complete:function (data) {

                    if (data.status == '201') {
                        $('#log').prepend('<div class="log_div">User settings updated.</div>');
                    }
                    else if (data.status == '400') {
                        $('#log').prepend('<div class="log_div">Error: User settings not added in request.</div>');
                    }
                    else if (data.status == '401') {
                        $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                        window.location.replace("index.php?logout=yes");


                    }
                    else if (data.status == '500') {
                        $('#log').prepend('<div class="log_div">Error: User settings not updated due to internal server error.</div>');
                    }
                    $('#areaname').val('')
                }
            });
        });
    }

    function addCustomItem1() {
        $('#add_customFieldsc1Entries').click(function () {
            if ($('#c1Name').val() != '') {
                $.ajax({
                    type:"GET",
                    data:"customid=custom1" +
                        "&itemname=" + $('#c1Name').val(),
                    url:'api/settings/customfields/add/index.php',
                    complete:function (data) {
                        populateRemoveCustomItem1Select();
                        if (data.status == '201') {
                            $('#log').prepend('<div class="log_div">Custom item ' + $('#c1Name').val() + ' added.</div>');
                        }
                        else if (data.status == '400') {
                            $('#log').prepend('<div class="log_div">Error: Custom item name not added in request.</div>');
                        }
                        else if (data.status == '401') {
                            $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                            window.location.replace("index.php?logout=yes");


                        }
                        else if (data.status == '409') {
                            $('#log').prepend('<div class="log_div">Custom item ' + $('#c1Name').val() + ' already exist.</div>');
                        }
                        else if (data.status == '500') {
                            $('#log').prepend('<div class="log_div">Error: Item not added due to internal server error.</div>');
                        }
                        $('#c1Name').val('')
                    }
                });
            }
            else {
                $('#log').prepend('<div class="log_div">Custom item 1 name not added in request.</div>');
            }
        });
    }

    function addCustomItem2() {
        $('#add_customFieldsc2Entries').click(function () {
            if ($('#c2Name').val() != '') {
                $.ajax({
                    type:"GET",
                    data:"customid=custom2" +
                        "&itemname=" + $('#c2Name').val(),
                    url:'api/settings/customfields/add/index.php',
                    complete:function (data) {
                        populateRemoveCustomItem2Select();
                        if (data.status == '201') {
                            $('#log').prepend('<div class="log_div">Custom item ' + $('#c2Name').val() + ' added.</div>');
                        }
                        else if (data.status == '400') {
                            $('#log').prepend('<div class="log_div">Error: Custom item name not added in request.</div>');
                        }
                        else if (data.status == '401') {
                            $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                            window.location.replace("index.php?logout=yes");


                        }
                        else if (data.status == '409') {
                            $('#log').prepend('<div class="log_div">Custom item ' + $('#c2Name').val() + ' already exist.</div>');
                        }
                        else if (data.status == '500') {
                            $('#log').prepend('<div class="log_div">Error: Item not added due to internal server error.</div>');
                        }
                        $('#c2Name').val('')
                    }
                });
            }
            else {
                $('#log').prepend('<div class="log_div">Custom item 2 name not added in request.</div>');
            }
        });
    }

    function addCustomItem3() {
        $('#add_customFieldsc3Entries').click(function () {
            if ($('#c3Name').val() != '') {
                $.ajax({
                    type:"GET",
                    data:"customid=custom3" +
                        "&itemname=" + $('#c3Name').val(),
                    url:'api/settings/customfields/add/index.php',
                    complete:function (data) {
                        populateRemoveCustomItem3Select();
                        if (data.status == '201') {
                            $('#log').prepend('<div class="log_div">Custom item ' + $('#c3Name').val() + ' added.</div>');
                        }
                        else if (data.status == '400') {
                            $('#log').prepend('<div class="log_div">Error: Custom item name not added in request.</div>');
                        }
                        else if (data.status == '401') {
                            $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                            window.location.replace("index.php?logout=yes");


                        }
                        else if (data.status == '409') {
                            $('#log').prepend('<div class="log_div">Custom item ' + $('#c3Name').val() + ' already exist.</div>');
                        }
                        else if (data.status == '500') {
                            $('#log').prepend('<div class="log_div">Error: Item not added due to internal server error.</div>');
                        }
                        $('#c3Name').val('')
                    }
                });
            }
            else {
                $('#log').prepend('<div class="log_div">Custom item 3 name not added in request.</div>');
            }
        });
    }

    function populateRemoveCustomItem1Select() {
        $.ajax({
            type:"GET",
            data:"customid=custom1",
            url:'api/customfields/getcustomfields/index.php',
            complete:function (data, xhr, statusText) {
                if (data.status == '200') {
                    $('#remove_customFieldsc1Entries_select').html('');
                    var jsonResponseContent = jQuery.parseJSON(data.responseText);
                    var optionTxt = "";
                    $.each(jsonResponseContent, function (index, value) {
                        $('#remove_customFieldsc1Entries_select').append('<option>' + value + '</option>');
                    });
                }
                else if (data.status == '401') {
                    $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                    window.location.replace("index.php?logout=yes");


                }
                else if (data.status == '500') {
                    $('#log').prepend('<div class="log_div">Error: SQL Error</div>');
                }
            }
        });
    }

    function populateRemoveCustomItem2Select() {
        $.ajax({
            type:"GET",
            data:"customid=custom2",
            url:'api/customfields/getcustomfields/index.php',
            complete:function (data, xhr, statusText) {
                if (data.status == '200') {
                    $('#remove_customFieldsc2Entries_select').html('');
                    var jsonResponseContent = jQuery.parseJSON(data.responseText);
                    var optionTxt = "";
                    $.each(jsonResponseContent, function (index, value) {
                        $('#remove_customFieldsc2Entries_select').append('<option>' + value + '</option>');
                    });
                }
                else if (data.status == '401') {
                    $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                    window.location.replace("index.php?logout=yes");


                }
                else if (data.status == '500') {
                    $('#log').prepend('<div class="log_div">Error: SQL Error</div>');
                }
            }
        });
    }

    function populateRemoveCustomItem3Select() {
        $.ajax({
            type:"GET",
            data:"customid=custom3",
            url:'api/customfields/getcustomfields/index.php',
            complete:function (data, xhr, statusText) {
                if (data.status == '200') {
                    $('#remove_customFieldsc3Entries_select').html('');
                    var jsonResponseContent = jQuery.parseJSON(data.responseText);
                    var optionTxt = "";
                    $.each(jsonResponseContent, function (index, value) {
                        $('#remove_customFieldsc3Entries_select').append('<option>' + value + '</option>');
                    });
                }
                else if (data.status == '401') {
                    $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                    window.location.replace("index.php?logout=yes");


                }
                else if (data.status == '500') {
                    $('#log').prepend('<div class="log_div">Error: SQL Error</div>');
                }
            }
        });
    }

    function removeCustomItem1() {
        $('#remove_customFieldsc1Entries').click(function () {
            $.ajax({
                type:"GET",
                data:"customid=custom1" +
                    "&itemname=" + $('#remove_customFieldsc1Entries_select').val(),
                url:'api/settings/customfields/remove/index.php',
                complete:function (data) {
                    if (data.status == '200') {
                        $('#log').prepend('<div class="log_div">Custom fields ' + $('#remove_customFieldsc1Entries_select').val() + ' removed.</div>');
                    }
                    else if (data.status == '401') {
                        $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                        window.location.replace("index.php?logout=yes");


                    }
                    else if (data.status == '500') {
                        $('#log').prepend('<div class="log_div">Error: Item not removed</div>');
                    }
                    populateRemoveCustomItem1Select();
                }
            });
        });
    }

    function removeCustomItem2() {
        $('#remove_customFieldsc2Entries').click(function () {
            $.ajax({
                type:"GET",
                data:"customid=custom2" +
                    "&itemname=" + $('#remove_customFieldsc2Entries_select').val(),
                url:'api/settings/customfields/remove/index.php',
                complete:function (data) {
                    if (data.status == '200') {
                        $('#log').prepend('<div class="log_div">Custom fields ' + $('#remove_customFieldsc2Entries_select').val() + ' removed.</div>');
                    }
                    else if (data.status == '401') {
                        $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                        window.location.replace("index.php?logout=yes");


                    }
                    else if (data.status == '500') {
                        $('#log').prepend('<div class="log_div">Error: Item not removed</div>');
                    }
                    populateRemoveCustomItem2Select();
                }
            });
        });
    }

    function removeCustomItem3() {
        $('#remove_customFieldsc3Entries').click(function () {
            $.ajax({
                type:"GET",
                data:"customid=custom3" +
                    "&itemname=" + $('#remove_customFieldsc3Entries_select').val(),
                url:'api/settings/customfields/remove/index.php',
                complete:function (data) {
                    if (data.status == '200') {
                        $('#log').prepend('<div class="log_div">Custom fields ' + $('#remove_customFieldsc3Entries_select').val() + ' removed.</div>');
                    }
                    else if (data.status == '401') {
                        $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                        window.location.replace("index.php?logout=yes");


                    }
                    else if (data.status == '500') {
                        $('#log').prepend('<div class="log_div">Error: Item not removed</div>');
                    }
                    populateRemoveCustomItem3Select();
                }
            });
        });
    }

    function applyUserSettingsToLayout(userSettings) {
        if (parseInt(userSettings['superuser']) == 0 && parseInt(userSettings['admin']) == 0) {
            $("#adminmenu").hide();
            $("#contentmenu").hide();

        }
        else if (parseInt(userSettings['superuser']) == 1 && parseInt(userSettings['admin']) == 0) {
            $("#adminmenu").hide();
            $("#testenvironments_menu").hide();
            $("#sprint_menu").hide();
            $("#site_settings").hide();
            $("#team_menu").hide();
        }
//    checkBoxHelper(userSettings, "autosave", "#autosave");

//    else if (parseInt(userSettings['admin']) != 1) {
////        alert("is admin");
////        $("#testenvironments_menu").hide();
////        $("#sprint_menu").hide();
////        $("#site_settings").hide();
//
//    }
//    else
//    {
//        alert("is nothing");
//
//    }

    }

    function getUserSettings() {
        $.ajax({
            type:"GET",
            url:'api/settings/user/sitesettings/get/',
            complete:function (data, xhr, statusText) {
                if (data.status == '200') {
                    $('#remove_area_select').html('');
                    var jsonResponseContent = jQuery.parseJSON(data.responseText);
                    applyUserSettingsToLayout(jsonResponseContent);
                    populateApplicationSettingsSelect(jsonResponseContent);

                }
                else if (data.status == '500') {
                    $('#log').prepend('<div class="log_div">Error: SQL Error during load of personal settings</div>');
                }
//            return jsonResponseContent;
            }
        });
    }

    function populateRemoveAreasSelect() {
        $.ajax({
            type:"GET",
            url:'api/area/getareas/index.php',
            complete:function (data, xhr, statusText) {
                if (data.status == '200') {
                    $('#remove_area_select').html('');
                    var jsonResponseContent = jQuery.parseJSON(data.responseText);
                    var optionTxt = "";
                    $.each(jsonResponseContent, function (index, value) {
                        $('#remove_area_select').append('<option>' + value + '</option>');
                    });
                }
                else if (data.status == '401') {
                    $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                    window.location.replace("index.php?logout=yes");


                }
                else if (data.status == '500') {
                    $('#log').prepend('<div class="log_div">Error: SQL Error</div>');
                }
            }
        });
    }


    function showAndHideHtml() {
        $("#change_personal_password").hide();
        $("#change_personal_settings").hide();
        $("#add_remove_team").hide();
        $("#add_remove_sprint").hide();
        $("#add_remove_area").hide();
        $("#add_remove_testenvironment").hide();
        $("#add_remove_custom_fields").hide();
        $("#change_configuration").hide();
        $("#systemcheck").hide();
        $("#manage_customfields").hide();
        $("#customFieldsEntries_testenvironment").hide();
        $("#add_remove_appconfig").hide();
        $("#bulkclosesessions").hide();
        $("#adduser").hide();
        $("#deleteuser").hide();


        $('#change_personal_password_menu').click(function () {
            if ($("#change_personal_password").is(':hidden'))
                $("#change_personal_password").fadeIn("slow");
            else
                $("#change_personal_password").fadeOut("slow");
        });

        $('#change_personal_settings_menu').click(function () {
            if ($("#change_personal_settings").is(':hidden'))
                $("#change_personal_settings").fadeIn("slow");
            else
                $("#change_personal_settings").fadeOut("slow");
        });

        $('#team_menu').click(function () {
            if ($("#add_remove_team").is(':hidden'))
                $("#add_remove_team").fadeIn("slow");
            else
                $("#add_remove_team").fadeOut("slow");
        });

        $('#sprint_menu').click(function () {
            if ($("#add_remove_sprint").is(':hidden'))
                $("#add_remove_sprint").fadeIn("slow");
            else
                $("#add_remove_sprint").fadeOut("slow");
        });

        $('#area_menu').click(function () {
            if ($("#add_remove_area").is(':hidden'))
                $("#add_remove_area").fadeIn("slow");
            else
                $("#add_remove_area").fadeOut("slow");
        });

        $('#testenvironments_menu').click(function () {
            if ($("#add_remove_testenvironment").is(':hidden'))
                $("#add_remove_testenvironment").fadeIn("slow");
            else
                $("#add_remove_testenvironment").fadeOut("slow");
        });

        $('#custom_fields_menu').click(function () {
            if ($("#add_remove_custom_fields").is(':hidden'))
                $("#add_remove_custom_fields").fadeIn("slow");
            else
                $("#add_remove_custom_fields").fadeOut("slow");
        });

        $('#configuration_menu').click(function () {
            if ($("#change_configuration").is(':hidden'))
                $("#change_configuration").fadeIn("slow");
            else
                $("#change_configuration").fadeOut("slow");
        });

        $('#systemcheck_menu').click(function () {
            if ($("#systemcheck").is(':hidden'))
                $("#systemcheck").fadeIn("slow");
            else
                $("#systemcheck").fadeOut("slow");
        });

        $('#customfields_menu').click(function () {
            if ($("#manage_customfields").is(':hidden'))
                $("#manage_customfields").fadeIn("slow");
            else
                $("#manage_customfields").fadeOut("slow");
        });

        $('#customFieldsEntries_menu').click(function () {
            if ($("#customFieldsEntries_testenvironment").is(':hidden'))
                $("#customFieldsEntries_testenvironment").fadeIn("slow");
            else
                $("#customFieldsEntries_testenvironment").fadeOut("slow");
        });

        $('#appconfig_menu').click(function () {
            if ($("#add_remove_appconfig").is(':hidden'))
                $("#add_remove_appconfig").fadeIn("slow");
            else
                $("#add_remove_appconfig").fadeOut("slow");
        });

        $('#bulkclosesessions_menu').click(function () {
            if ($("#bulkclosesessions").is(':hidden'))
                $("#bulkclosesessions").fadeIn("slow");
            else
                $("#bulkclosesessions").fadeOut("slow");
        });

        $('#adduser_menu').click(function () {
            if ($("#adduser").is(':hidden'))
                $("#adduser").fadeIn("slow");
            else
                $("#adduser").fadeOut("slow");
        });

        $('#deleteuser_menu').click(function () {
            if ($("#deleteuser").is(':hidden'))
                $("#deleteuser").fadeIn("slow");
            else
                $("#deleteuser").fadeOut("slow");
        });
    }

    function removeArea() {
        $('#remove_area').click(function () {
            $.ajax({
                type:"GET",
                data:"area=" + $('#remove_area_select').val(),
                url:'api/settings/area/remove/index.php',
                complete:function (data) {
                    if (data.status == '200') {
                        $('#log').prepend('<div class="log_div">Area ' + $('#remove_area_select').val() + ' removed.</div>');
                    }
                    else if (data.status == '401') {
                        $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                        window.location.replace("index.php?logout=yes");


                    }
                    else if (data.status == '500') {
                        $('#log').prepend('<div class="log_div">Error: Item not removed</div>');
                    }
                    populateRemoveAreasSelect();
                }
            });
        });
    }

    function addArea() {
        $('#add_area').click(function () {
            if ($('#areaname').val() != '') {
                $.ajax({
                    type:"GET",
                    data:"area=" + $('#areaname').val(),
                    url:'api/settings/area/add/index.php',
                    complete:function (data) {
                        populateRemoveAreasSelect();
                        if (data.status == '201') {
                            $('#log').prepend('<div class="log_div">Area ' + $('#areaname').val() + ' added.</div>');
                        }
                        else if (data.status == '400') {
                            $('#log').prepend('<div class="log_div">Error: Area name not added in request.</div>');
                        }
                        else if (data.status == '401') {
                            $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                            window.location.replace("index.php?logout=yes");


                        }
                        else if (data.status == '409') {
                            $('#log').prepend('<div class="log_div">Area ' + $('#areaname').val() + ' already exist.</div>');
                        }
                        else if (data.status == '500') {
                            $('#log').prepend('<div class="log_div">Error: Item not added due to internal server error.</div>');
                        }
                        $('#areaname').val('')
                    }
                });
            }
            else {
                $('#log').prepend('<div class="log_div">Area name not added in request.</div>');
            }
        });
    }

    function populateRemoveTeamsSelect() {
        $.ajax({
            type:"GET",
            url:'api/team/getteams/index.php',
            complete:function (data, xhr, statusText) {
                if (data.status == '200') {
                    $('#remove_team_select').html('');
                    var jsonResponseContent = jQuery.parseJSON(data.responseText);
                    $.each(jsonResponseContent, function (index, value) {
                        $('#remove_team_select').append('<option>' + value + '</option>');
                    });
                }
                else if (data.status == '401') {
                    $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                    window.location.replace("index.php?logout=yes");


                }
                else if (data.status == '500') {
                    $('#log').prepend('<div class="log_div">Error: SQL Error</div>');
                }
            }
        });
    }

    function updateCustomFields() {
        $('#update_customfields').click(function () {
            $.ajax({
                type:"GET",
                data:"cf1=" + $('#cf1Name').val() +
                    "&cf2=" + $('#cf2Name').val() +
                    "&cf3=" + $('#cf3Name').val() +
                    "&cf1multiselect=" + $('#cf1multiselect').is(':checked') +
                    "&cf2multiselect=" + $('#cf2multiselect').is(':checked') +
                    "&cf3multiselect=" + $('#cf3multiselect').is(':checked') +
                    "&cf1enabled=" + $('#cf1enabled').is(':checked') +
                    "&cf2enabled=" + $('#cf2enabled').is(':checked') +
                    "&cf3enabled=" + $('#cf3enabled').is(':checked'),
                url:'api/settings/customfields/addupdate/index.php',
                complete:function (data) {

                    if (data.status == '201') {
                        $('#log').prepend('<div class="log_div">Custom fields added/updated/enabled.</div>');
                        populateRemoveTeamsSelect();
                    }
                    else if (data.status == '400') {
                        $('#log').prepend('<div class="log_div">Error: Custom fields parameters not added in request.</div>');
                    }
                    else if (data.status == '401') {
                        $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                        window.location.replace("index.php?logout=yes");


                    }
                    else if (data.status == '500') {
                        $('#log').prepend('<div class="log_div">Error: Item not added due to internal server error.</div>');
                    }
                    $('#teamname').val('')
                }
            });

        });
    }

    function addTeam() {
        $('#add_team').click(function () {
            if ($('#teamname').val() != '') {
                $.ajax({
                    type:"GET",
                    data:"team=" + $('#teamname').val(),
                    url:'api/settings/team/add/index.php',
                    complete:function (data) {

                        if (data.status == '201') {
                            $('#log').prepend('<div class="log_div">Team ' + $('#teamname').val() + ' added.</div>');
                            populateRemoveTeamsSelect();
                        }
                        else if (data.status == '400') {
                            $('#log').prepend('<div class="log_div">Error: Team name not added in request.</div>');
                        }
                        else if (data.status == '401') {
                            $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                            window.location.replace("index.php?logout=yes");


                        }
                        else if (data.status == '409') {
                            $('#log').prepend('<div class="log_div">Team ' + $('#teamname').val() + ' already exist.</div>');
                        }
                        else if (data.status == '500') {
                            $('#log').prepend('<div class="log_div">Error: Item not added due to internal server error.</div>');
                        }
                        $('#teamname').val('')
                    }
                });
            }
            else {
                $('#log').prepend('<div class="log_div">Team name not added in request.</div>');
            }
        });
    }

    function removeTeam() {
        $('#remove_team').click(function () {
            $.ajax({
                type:"GET",
                data:"team=" + $('#remove_team_select').val(),
                url:'api/settings/team/remove/index.php',
                complete:function (data) {
                    if (data.status == '200') {
                        $('#log').prepend('<div class="log_div">Team ' + $('#remove_team_select').val() + ' removed.</div>');
                    }
                    else if (data.status == '401') {
                        $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                        window.location.replace("index.php?logout=yes");


                    }
                    else if (data.status == '500') {
                        $('#log').prepend('<div class="log_div">Error: Item not removed</div>');
                    }
                    populateRemoveTeamsSelect();
                }
            });
        });
    }


    function populateRemoveSprintsSelect() {
        $.ajax({
            type:"GET",
            url:'api/sprint/getsprints/index.php',
            complete:function (data, xhr, statusText) {
                if (data.status == '200') {
                    $('#remove_sprint_select').html('');
                    var jsonResponseContent = jQuery.parseJSON(data.responseText);
                    $.each(jsonResponseContent, function (index, value) {
                        $('#remove_sprint_select').append('<option>' + value + '</option>');
                    });
                }
                else if (data.status == '401') {
                    $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                    window.location.replace("index.php?logout=yes");


                }
                else if (data.status == '500') {
                    $('#log').prepend('<div class="log_div">Error: SQL Error</div>');
                }
            }
        });
    }


    function addSprint() {
        $('#add_sprint').click(function () {
            if ($('#sprintname').val() != '') {
                $.ajax({
                    type:"GET",
                    data:"sprint=" + $('#sprintname').val(),
                    url:'api/settings/sprint/add/index.php',
                    complete:function (data) {

                        if (data.status == '201') {
                            $('#log').prepend('<div class="log_div">sprint ' + $('#sprintname').val() + ' added.</div>');
                            populateRemoveSprintsSelect();
                        }
                        else if (data.status == '400') {
                            $('#log').prepend('<div class="log_div">Error: sprint name not added in request.</div>');
                        }
                        else if (data.status == '401') {
                            $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                            window.location.replace("index.php?logout=yes");


                        }
                        else if (data.status == '409') {
                            $('#log').prepend('<div class="log_div">sprint ' + $('#sprintname').val() + ' already exist.</div>');
                        }
                        else if (data.status == '500') {
                            $('#log').prepend('<div class="log_div">Error: Item not added due to internal server error.</div>');
                        }
                        $('#sprintname').val('')
                    }
                });
            }
            else {
                $('#log').prepend('<div class="log_div">sprint name not added in request.</div>');
            }
        });
    }

    function removeSprint() {
        $('#remove_sprint').click(function () {
            $.ajax({
                type:"GET",
                data:"sprint=" + $('#remove_sprint_select').val(),
                url:'api/settings/sprint/remove/index.php',
                complete:function (data) {
                    if (data.status == '200') {
                        $('#log').prepend('<div class="log_div">sprint ' + $('#remove_sprint_select').val() + ' removed.</div>');
                    }
                    else if (data.status == '401') {
                        $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                        window.location.replace("index.php?logout=yes");


                    }
                    else if (data.status == '500') {
                        $('#log').prepend('<div class="log_div">Error: Item not removed</div>');
                    }
                    populateRemoveSprintsSelect();
                }
            });
        });
    }

    function populateRemovetesTenvironmentsSelect() {
        $.ajax({
            type:"GET",
            url:'api/testenvironment/gettestenvironment/index.php',
            complete:function (data, xhr, statusText) {
                if (data.status == '200') {
                    $('#remove_testenvironment_select').html('');
                    var jsonResponseContent = jQuery.parseJSON(data.responseText);
                    $.each(jsonResponseContent, function (index, value) {
                        $('#remove_testenvironment_select').append('<option>' + value + '</option>');
                    });
                }
                else if (data.status == '401') {
                    $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                    window.location.replace("index.php?logout=yes");


                }
                else if (data.status == '500') {
                    $('#log').prepend('<div class="log_div">Error: SQL Error</div>');
                }
            }
        });
    }


    function addtestEnvironment() {
        $('#add_testenvironment').click(function () {
            if ($('#testenvironmentname').val() != '') {
                $.ajax({
                    type:"GET",
                    data:"environment=" + $('#teName').val() +
                        "&url=" + $('#teUrl').val() +
                        "&username=" + $('#teUser').val() +
                        "&password=" + $('#tePassword').val(),
                    url:'api/settings/testenvironment/add/index.php',
                    complete:function (data) {

                        if (data.status == '201') {
                            $('#log').prepend('<div class="log_div">testenvironment ' + $('#teName').val() + ' added.</div>');
                            populateRemovetesTenvironmentsSelect();
                        }
                        else if (data.status == '400') {
                            $('#log').prepend('<div class="log_div">Error: testenvironment name not added in request.</div>');
                        }
                        else if (data.status == '401') {
                            $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                            window.location.replace("index.php?logout=yes");


                        }
                        else if (data.status == '409') {
                            $('#log').prepend('<div class="log_div">testenvironment ' + $('#teName').val() + ' already exist.</div>');
                        }
                        else if (data.status == '500') {
                            $('#log').prepend('<div class="log_div">Error: Item not added due to internal server error.</div>');
                        }
                        $('#testenvironmentname').val('')
                    }
                });
            }
            else {
                $('#log').prepend('<div class="log_div">testenvironment name not added in request.</div>');
            }
        });
    }

    function removetestEnvironment() {
        $('#remove_testenvironment').click(function () {
            $.ajax({
                type:"GET",
                data:"environment=" + $('#remove_testenvironment_select').val(),
                url:'api/settings/testenvironment/remove/index.php',
                complete:function (data) {
                    if (data.status == '200') {
                        $('#log').prepend('<div class="log_div">testenvironment ' + $('#remove_testenvironment_select').val() + ' removed.</div>');
                    }
                    else if (data.status == '401') {
                        $('#log').prepend('<div class="log_div">Error: Unauthorized.</div>');
                        window.location.replace("index.php?logout=yes");


                    }
                    else if (data.status == '500') {
                        $('#log').prepend('<div class="log_div">Error: Item not removed</div>');
                    }
                    populateRemovetesTenvironmentsSelect();
                }
            });
        });
    }

    function changePersonalPassword() {
        $('#change_personal_password_exe').click(function () {

            if ($('#changepasswordold').val() != '' && $('#changepassword1').val() != '' && $('#changepassword2').val() != '') {
                if ($('#changepassword1').val() == $('#changepassword2').val()) {
                    if ($('#changepassword1').val().length > 5) {
                        $.ajax({
                            type:"GET",
                            data:"changepasswordold=" + $('#changepasswordold').val() +
                                "&changepassword1=" + $('#changepassword1').val() +
                                "&changepassword2=" + $('#changepassword2').val(),
                            url:'api/settings/user/password/change/index.php',
                            complete:function (data) {

                                if (data.status == '201') {
                                    $('#log').prepend('<div class="log_div">Password changed.</div>');

                                }
                                else if (data.status == '400') {
                                    $('#log').prepend('<div class="log_div">Error: parameters is not correct.</div>');
                                }
                                else if (data.status == '401') {
                                    $('#log').prepend('<div class="log_div">Error: Wrong password provided.</div>');
                                    window.location.replace("index.php?logout=yes");


                                }
                                else if (data.status == '500') {
                                    $('#log').prepend('<div class="log_div">Error: Item not added due to internal server error.</div>');
                                }
                                else {
                                    $('#log').prepend('<div class="log_div">Error: Some error that could not be determined have happend.</div>');

                                }

                            }
                        });
                    }
                    else {
                        $('#log').prepend('<div class="log_div">Password is too short. Need to longer then 5 characters.</div>');

                    }
                }
                else {
                    $('#log').prepend('<div class="log_div">New Password does not match</div>');

                }
            }
            else {
                $('#log').prepend('<div class="log_div">You need to add your old password AND the new one(twice)</div>');
            }
        });
    }



