<?php

//Sanitize the POST values
$selector = clean($_POST['selector']);
$validator = clean($_POST['validator']);

$token = hash('sha256', $validator);

//CREATE SELECT STATEMENT
$qry = "SELECT userid FROM auth_tokens WHERE selector = '$selector' AND token = '$token'";
$result = mysql_query($qry, $link) or die("Couldn't execute query.");

$userid = -1;
while ($row = mysql_fetch_array($result)){
    $userid = $row["userid"];
}

$auth = false;
if ($userid >= 0){
    $auth = true;
}
