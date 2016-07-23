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

$todo_text = clean($_POST['todo_text']);

include('auth_selector_validator.php');

if ($auth){
    //CREATE INSERT STATEMENT
	$qry = "INSERT INTO todo_txt (userid, todo_txt) VALUES ($userid, '$todo_text')";
    echo $qry;
    echo "\n";
	$result = @mysql_query($qry, $link) or die("Couldn't execute query.");

    echo "writing=Ok";
}else{
    echo "auth=Bad";
}

exit();
mysql_close();

?>
