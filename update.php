<?php
$json = "../data.json";

function _f($msg, $success=false, $data=false){
	$a = array(
		"success" => $success,
		"message" => $msg
	);
	if($data) $a["data"] = $data;
	header('Content-type: application/json; charset=utf-8');
	die(json_encode($a));
}

//check logged in
session_start();
if(!isset($_SESSION["logged"]) || !$_SESSION["logged"]) _f("not logged in");

//check data exist
if(!isset($_POST["json"])) _f("nothing to update");

if(@file_put_contents($json, json_encode($_POST["json"]))) _f("data updated", true);
else _f("update error");

?>