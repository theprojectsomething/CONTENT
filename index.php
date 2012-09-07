<?php
$temp_user = "rory";
$temp_pass = "curryinahurry";
$logged = false;
session_start();
if(isset($_GET["logout"]) && isset($_SESSION["logged"]))
	unset($_SESSION["logged"]);
if(_e($_SESSION["logged"]) || (_e($_POST["user"], $temp_user) && _e($_POST["pass"], $temp_pass))){
	$_SESSION["logged"] = true;
	$logged = true;
}

function _e(&$i, $v=true){
	return isset($i) && $i==$v;
}

?>
<!DOCTYPE HTML>
<!--[if lt IE 10 ]> <html class="ie"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html> <!--<![endif]-->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Rory Gardiner | Admin</title>
<meta name="robots" content="noindex, nofollow">
<link href="../css/html5.css" rel="stylesheet" type="text/css"/>
<link href="css/custom-scroll.css" rel="stylesheet" type="text/css"/>
<link href="css/style.css" rel="stylesheet" type="text/css"/>
<link href="../fonts/style.css" rel="stylesheet" type="text/css"/>
<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/themes/base/jquery-ui.css" type="text/css" media="all" />
</head>
<body class="<?php echo $logged ? '' : 'out' . (isset($_POST["user"]) ? ' error' : ''); ?>">
<?php if($logged): ?>

<div id="right-area">
	<nav class="area-buttons">
		<ul>
			<li class="nav-library" data-type="library"></li>
			<li class="nav-editor active" data-type="editor"></li>
			<li class="nav-settings" data-type="settings"></li>
		</ul>
	</nav>
	<section class="library area">
		<ul class="images"></ul>
	</section>
	<section class="editor area">
		<article class="scroller">
			<div class="cursor">
				<aside class="info">
					<span class="path">home/projects/info</span>
					<span class="updated">23.05.2012 11:56:53PM @rory</span>
				</aside>
				<aside class="lines">1</aside>
				<div class="text-container">
					<aside class="text-edit-fill"><pre></pre></aside>
					<textarea class="text-edit"></textarea>
				</div>
			</div>
		</article>
	</section>
</div>
<aside id="context-menu">
	<ul>
		<li class="upload">upload<span></span></li>
		<li class="add">add to <span></span></li>
		<li class="delete">delete</li>
		<li class="loading disabled">loading...</li>
	</ul>
</aside>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script>
<script src="js/upload.js"></script>
<script src="js/script.js"></script>
<script src="js/jquery.cookie.js"></script>
<?php else: ?>
	<form action="" method="POST">
		<input name="user" type="text" placeholder="user" />
		<input name="pass" type="password" placeholder="password" />
		<button type="submit">Login</button>
	</form>
<?php endif; ?>
</body>
</html>