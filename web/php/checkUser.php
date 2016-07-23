<?php
	include("credentials.php");

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
	$name = clean($_POST['username']);
	$pass = clean($_POST['password']);

	////////////////////////////////////////////////////////////////////////////////////////////////
	//CREATE SELECT STATEMENT
	$qry = "SELECT username FROM users WHERE username = '".$name."'";
	$result = mysql_query($qry, $link) or die("Couldn't execute query.");
	$num = mysql_numrows($result);

	if ($num > 0){ //THE USERNAME ALREADY EXISTS
		echo "username=Exists";
	}else{ //THE USERNAME DOES NOT EXIST
		echo "username=Ok";
	}

	exit();
	mysql_close();
?>
