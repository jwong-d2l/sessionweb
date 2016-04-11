# How to solve when db backup can not be loaded

# Introduction #

Since attachments may be set up to manage large size on one computer and smaller on another this may cause the failure when loading the db backup into the new computer.


# Details #

To solve this issue. Browse to your working sessionweb web page  and navigate to settings->system check (as administrator) and check the Attachment size setup. Adjust accordingly on the second computer. Then the db should be possible to load.

Example from a system  check web page(different depending on your setup of mysql and php).

Attachment size setup
Attachments max size according to php and mysql settings 20 mb
Synchronize this with the parameter maxFileSize in include\filemanagement\application.js. Parameter maxFileSize should be 20971520 in the js file.

If the size is to small or large change the upload\_max\_filesize, post\_max\_size, memory\_limit php configuration values in php.ini and synchronize this with the max\_allowed\_packet config value in mysql settings.