function validate_required(field, alerttxt) {
    with (field) {
        if (value == null || value == "") {
            alert(alerttxt);
            return false;
        } else {
            return true;
        }
    }
}

function validate_form(thisform) {

    with (thisform) {
        if (validate_required(title, "Title must be filled out!") == false) {
            title.focus();
            return false;
        }

        if (validate_metrics(setuppercent, testpercent, bugpercent,
                oppertunitypercent, executed) == false) {
            setuppercent.focus();
            return false;
        }

    }
}

function autosave_exe() {
    var sessionid = $(document).getUrlParam("sessionid");
    var command = $(document).getUrlParam("command");
    var sPath = window.location.pathname;
    var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
    if (sPage == "session.php" && command == "edit") {
        if (sessionid != null) {

//            var t = setTimeout("autosave()", 120000); //=2min
            var title = $("#input_title").val();
            var textarea1 = CKEDITOR.instances['textarea1'].getSnapshot();//$("#textarea1").val();
            var textarea2 = CKEDITOR.instances['textarea2'].getSnapshot();//$("#textarea2").val();
            var buglist_hidden = $("#buglist_hidden").val();
            var requirementlist_hidden = $("#requirementlist_hidden").val();
            var sessionlinklist_hidden = $("#sessionlinklist_hidden").val();
            var select_area = $("#select_area").val();

            $.ajax(
            {
                type: "POST",
                url: "autosave.php",
                data: "title=" + title + "&sessionid=" + sessionid + "&charter=" + textarea1 + "&notes=" + textarea2 + "&buglist_hidden=" + buglist_hidden + "&requirementlist_hidden=" + requirementlist_hidden + "&sessionlink_hidden=" + sessionlinklist_hidden,
                cache: false,
                success: function(message) {
                    $("#autosaved").empty().append(message);
                }
            });
//            }
        }
        else {
            $("#autosaved").empty().append("Autosave is enabled after it has been saved one time");
        }
    }
    else if (sPage == "session.php" && command == "new") {
        $("#autosaved").empty().append("Autosave is enabled after it has been saved one time");
    }
}