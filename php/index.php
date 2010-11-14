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
  $loginUrl = $facebook->getLoginUrl();
}

?>
<html xmlns:fb="http://www.facebook.com/2008/fbml">
  <head>
    <title>Photo browser</title>
  </head>
  <body>
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
        // don't refetch the session when PHP already has it
        status  : true, // check login status
        cookie  : true, // enable cookies to allow the server to access
                        // the session
        xfbml   : true // parse XFBML
      });

      // whenever the user logs in, we refresh the page
      FB.Event.subscribe('auth.login', function() {
        window.location.reload();
      });
    </script>

  <?php if (!$session){
    $redirectUri='https://graph.facebook.com/oauth/authorize?client_id='
    .$facebook->getAppId().
    '&scope=user_photos,friends_photos,user_photo_video_tags,friends_photo_video_tags';
  ?>
  <script type="text/javascript">
  window.location='<?php echo $redirectUri; ?>'+'&redirect_uri='+
                  window.location;
  </script>
  <?php } ?>
  
  <?php if ($session): ?>
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
