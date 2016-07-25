<?php

include('credentials.php');

$link = mysql_connect('catgamescores.db', $username, $password);
if (!$link){
    die('Failed to connect to server: '.mysql_error());
}

//select database
$db = mysql_select_db('todo-dog', $link);

//function to sanitize values recieved from the form. Prevents SQL injection
function clean($str)
{
    $str = @trim($str);
    if (get_magic_quotes_gpc()){
        $str = stripslashes($str);
    }
    return mysql_real_escape_string($str); //error
}

//Sanitize the POST values
$userid = clean($_POST['userid']);

include('auth_selector_validator.php');

if ($auth){
    ////////////////////////////////////////////////////////////////////////////////////////////////
    //CREATE SELECT STATEMENT (for username)
    $qry = "SELECT username FROM users WHERE userid = $userid";
    $result = mysql_query($qry, $link) or die("Couldn't execute query.");

    $username = "a";
    while ($row = mysql_fetch_array($result)){
        $username = $row["username"];
    }

    //CREATE SELECT STATEMENT (for todo_text)
    $qry = "SELECT todo_txt FROM todo_txt WHERE userid = $userid";
    $result = mysql_query($qry, $link) or die("Couldn't execute query 2.");

    $todo_text = "[ ] - fix todo loading... email cakeandturtles@gmail.com";
    //it's stupid that i have so many text/txt var name mismatches
    while ($row = mysql_fetch_array($result)){
        $todo_text = $row["todo_txt"];
    }

    echo "auth=Ok;";
    echo "username=$username;";
    echo "todo_text=$todo_text";
}else{
    echo "auth=Bad";
}

exit();
mysql_close();

?>
