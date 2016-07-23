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

    if (strlen($name) == 0 || strlen($pass) == 0){
        die("username and password must be filled out!");
    }
    if (strlen($name) > 64){
        die("username too long");
    }
    if (strlen($pass) > 64){
        die("password too long");
    }

    //check to make sure the username doesn't already exist
	$qry = "SELECT username FROM users WHERE username = '".$name."'";
    $result = @mysql_query($qry, $link) or die("Couldn't execute query 1.");
    $num = mysql_numrows($result);

    if ($num > 0){
        //username already exists!!!
        die("username already exists");
        exit();
        mysql_close();
    }else{
    	////////////////////////////////////////////////////////////////////////////////////////////////
        $hash_salt = password_hash($pass, PASSWORD_BCRYPT);
    	//CREATE INSERT STATEMENT
    	$qry = "INSERT INTO users (username, password) VALUES ('$name', '$hash_salt')";
    	$result = @mysql_query($qry, $link) or die("Couldn't execute query 2.");

        //CREATE SELECT STATEMENT
    	$qry = "SELECT userid FROM users WHERE username = '$name'";
    	$result = mysql_query($qry, $link) or die("Couldn't execute query.");

        $userid = -1;
        while ($row = mysql_fetch_array($result)){
            $userid = $row["userid"];
        }

    	echo "writing=Ok";

        include('create_selector_validator.php');

    	exit();
    	mysql_close();
    }
?>
