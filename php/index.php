<!doctype html>
<?php

require '../../php-sdk/src/facebook.php';

// Create an Application instance.
$appId='';
$appSecret='';
switch($_SERVER['SERVER_NAME']){
  case 'abstract.cs.washington.edu':
    $appId='126766050701493';
    $appSecret='31da91932ffb565e48af20f898f4829e';
    break;
  case 'localhost':
    $appId='145449078803458';
    $appSecret='1034642f5d087b0272bb56ba18ffd1a7';
    break;
  default:
    die('Unknown host!\n'); 
}

$facebook = new Facebook(array(
  'appId'  => $appId,
  'secret' => $appSecret,
  'cookie' => true,
));

$session = $facebook->getSession();

// login or logout url will be needed depending on current user state.
if ($session) {
  $logoutUrl = $facebook->getLogoutUrl();
} else {
  $loginUrl = $facebook->getLoginUrl(array('req_perms' => 
      'user_photos,friends_photos,user_photo_video_tags,friends_photo_video_tags'
      ,'canvas' => 1, 'fbconnect' => 0, 'display' => 'page'
      ));
  // In the above, the canvas => 1 option might not be supported later on
  // in that case, if the session exists you just need to play with the next
  // parameter and do some redirections 
}

?>
<html xmlns:fb="http://www.facebook.com/2008/fbml">
  <head>
    <title>Photo browser</title>
 </head>
  <body>

    <?php if (!$session): ?>
    <script type="text/javascript">
    top.location.href='<?php echo $loginUrl; ?>';
    </script>
    <?php endif ?>
 
    <div id="fb-root"></div>
    <link rel="stylesheet" type="text/css" href="../css/view.css" />
    <script type="text/javascript" 
            src="http://connect.facebook.net/en_US/all.js"></script>
    <script type="text/javascript" 
            src="../closure-library/closure/goog/base.js"></script>
    <script>
      FB.init({
        appId   : '<?php echo $facebook->getAppId(); ?>',
        session : <?php echo json_encode($session); ?>,
        status  : true, // check login status
        cookie  : true, 
        xfbml   : true 
      });

      // whenever the user logs in, we refresh the page
      FB.Event.subscribe('auth.login', function() {
        window.location.reload();
      });
    </script>

  <?php if ($session): ?>
  <?php //print_r($_REQUEST), // the access token can be seen in this
        //array when the first login happens ?>
  <div class ="top_bar" id="navigation_bar">
    <div class="navigation_button">Home</div>
    <div class="navigation_button"></div>
    <div class="navigation_button"></div>
    <div class="navigation_button"></div>
  </div>
  <div class="top_bar" id="tool_bar">You have 4 albums and 32 friends</div>
    Found active session.
  <?php endif ?>

  </body>
</html>
