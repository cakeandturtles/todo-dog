<?php

function generateToken($length = 20){
    return bin2hex(mcrypt_create_iv($length, MCRYPT_DEV_URANDOM));
}

$selector = substr(generateToken(12), 0, 12);
$validator = generateToken();

$token = hash('sha256', $validator);

//current time + 1 year = (60 s * 60 min * 24 hr * 356 days)
$exp_time = time() + (60*60*24*356);
$expires = date("Y-m-d H:i:s", $exp_time);

//CREATE INSERT STATEMENT
$qry = "INSERT INTO auth_tokens (selector, token, userid, expires) VALUES ('$selector', '$token', $userid, '$expires')";
//echo $qry;
$result = @mysql_query($qry, $link) or die("Couldn't execute query 2.");

echo "selector=$selector;";
echo "validator=$validator;";

?>
