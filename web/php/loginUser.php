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
	$name = clean($_POST['username']);
	$pass = clean($_POST['password']);

	////////////////////////////////////////////////////////////////////////////////////////////////
	//CREATE SELECT STATEMENT
	$qry = "SELECT userid, password FROM users WHERE username = '".$name."'";
	$result = mysql_query($qry, $link) or die("Couldn't execute query.");

    $userid = -1;
    $hash_salt = -1;
    while ($row = mysql_fetch_array($result)){
        $userid = $row["userid"];
        $hash_salt = $row["password"];
    }
    if (password_verify($pass, $hash_salt)){
        echo "login=Ok";

        include('create_selector_validator.php');
    }else{
        echo "login=Bad";
        die("incorrect username/password.");
    }

	exit();
	mysql_close();
?>
