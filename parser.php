<?php
	header("Access-Control-Allow-Origin: *");


	//what method to execute
    $method = urldecode($_POST['myFile']);
    print($method);
?>
