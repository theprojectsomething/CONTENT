<?php
session_start();
if(!$_SESSION["logged"]) die();

$image_dir = "../media";
$files = scan($image_dir);

function scan($dir){
	$a = scandir($dir);
	var_dump($a);

	return $a;
} 

?>