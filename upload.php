<?php
$base_uri = "http://" . $_SERVER['HTTP_HOST'];
$base_dir = "../";
$upload_dir = "media/";
$base_path_len = strlen($_SERVER["DOCUMENT_ROOT"]);

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

//check files exist
if(empty($_FILES)) _f("nothing to upload");

//check valid file type
$valid_types = array('jpg', 'png', 'gif', 'pdf', 'doc', 'txt', 'zip');
$type = pathinfo(strtolower($_FILES['file']['name']), PATHINFO_EXTENSION);
if(!in_array($type, $valid_types)) _f('file not allowed');

//check sub directory
$sub_dir = isset($_POST["subFolder"]) ? $_POST["subFolder"] : '';
if(strlen($sub_dir)>0){
	if(strpos($sub_dir, './')!==false) _f("recursion not allowed");
	if(strpos($sub_dir, '/')===0) $sub_dir = substr($sub_dir, 1);
	$sub_dir = rtrim($sub_dir, '/') . '/';
}
$sub_dir .= date('d-m-y') . '/';

//set upload directory and file name
$upload_dir .= $sub_dir;
$upload_dir_relative = $base_dir . $upload_dir;
$file_name = substr(sha1(microtime()), -8) . '.' . $type;
if(!is_dir($upload_dir_relative)) mkdir($upload_dir_relative, 0777, true);

$temp = $_FILES['file']['tmp_name'];
$file = realpath($upload_dir_relative) . '\\' . $file_name;

$file_url = $base_uri . preg_replace('/\\\/', '/', substr($file, $base_path_len));
$file_url_relative = $upload_dir . $file_name;

if(move_uploaded_file($temp, $file)){
	$details =  getimagesize($file);
	_f("file uploaded", true, array(
		"absolute" => $file_url,
		"url" => $file_url_relative,
		"size" => $_FILES['file']["size"],
		"title" => preg_replace('/\.[^\.]+$/', '', $_FILES['file']["name"]),
		"width" => $details[0],
		"height" => $details[1]
	));
}else _f("upload error");

?>