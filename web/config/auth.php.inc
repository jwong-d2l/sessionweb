<?php
/**
 * This file contains the setup for the LDAP authentication
 * This functionality is provided as it is without support from the sessionweb developer .
 * This AD setup have been verified to work in some environment (Microsoft AD) but is in no way verified to work in all
 * AD/LDAP environments, you may have to adjust checklogin.php to have your ad setup to work with sessionweb.
 */

define('LDAP_ENABLED', false); //enable (true) or disable (false) LDAP integration
define('LDAP_HOST', 'ldaphost.com'); //Your LDAP server DNS Name or IP Address
define('LDAP_DN', 'OU=SOME,DC=NAMES'); //Put your Base DN here
define('LDAP_USER_DOMAIN', '@SOME.DOMAIN'); //Needs the @, but not always the same as the LDAP server domain
define('LDAP_SEARCH_FIELD', 'samaccountname'); //In what Active Directory field do you want to search for the string?


?>