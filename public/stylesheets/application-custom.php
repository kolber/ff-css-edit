<?php

	include('../php/common.php');

	session_start();

	$hash = $_SESSION['hash'];

	$link = dbConnect();
	$query = "SELECT customcss FROM users WHERE hash=$hash";
	$result = @mysql_query($query);
	$customcss = mysql_result($result, 0, 'customcss');
	
	echo urldecode($customcss);

?>