# SessionWeb Installation HowTo #
This page may be outdated. Please read the README file in the root folder of the WEB project for the latest installation instructions.

Sessionweb requires PHP5 and MYSQL to work.
If you do not know how to install/configure it please use XAMPP Server (http://www.apachefriends.org/en/xampp.html)

## SessionWeb 1.4 ##
Go to sessionweb/install to install/upgrade

Upgrade manually:
If you can not upgrade please manualy execute install/SessionwebDbLayoutDelta\_1.3-_1.4.sql to
upgrade from 1.3->1.4_

Install manualy:
got to sessionweb/install/install.php to check that r/w of folders then
execute install/SessionwebDbLayout\_1.4.sql
then create a file called sessionweb/config/db.php.inc
Content of file(Change user and password not host and db name):

<?php
> define('DB\_HOST\_SESSIONWEB', 'localhost');
> define('DB\_USER\_SESSIONWEB', 'sw');
> define('DB\_PASS\_SESSIONWEB', '2easy');
> define('DB\_NAME\_SESSIONWEB', 'sessionwebos');
?>

## SessionWeb 1.3 ##
### Installations Instructions ###
New installation: just go to index.php and follow instructions.
Upgrade: Go to installation/index.php and follow instructions.
#### What is new in 1.2 ####
Attachments to sessions implemented
Personal settings for default sprint, area etc.
Reworked installation script.
Bug fixes


## SessionWeb 1.2 ##
### Installations Instructions ###
For new installation follow 1.0 instruction
For Upgrade from 1.0-1.2:
Replace all files in your sessionweb folder with the new once(do not replace config/db.php.inc) and execute config\migrateToUtf8.bat (Windows) or config/migrateToUtf8.sh (linux or unix)
#### What is new in 1.2 ####
Wordcloud of a session when viewing it. Possible to switch off and on for admin under settings.
UTF-8 support for the database
Bug fixes

## SessionWeb 1.0 ##
### Installations Instructions ###
Put the content into on a web server and browse to sessionweb/install.php page and follow the instructions.