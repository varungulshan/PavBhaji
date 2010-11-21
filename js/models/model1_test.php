<!DOCTYPE html>
<?php

require '../../../php-sdk/src/facebook.php';

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

<html>

<head>

<title>Pav Bhaji Unit Tests - models.Model1</title>
<script type="text/javascript" 
        src="../../closure-library/closure/goog/base.js"></script>
<script type="text/javascript" 
        src="http://connect.facebook.net/en_US/all.js"></script>
<script type="text/javascript" 
        src="../../js/common/helpers.js"></script>
<script type="text/javascript" 
        src="../../js/common/Event.js"></script>
<script type="text/javascript" 
        src="../../js/common/iconNodes.js"></script>
<script type="text/javascript" 
        src="../../js/models/abstractModel.js"></script>
<script type="text/javascript" 
        src="../../js/models/model1.js"></script>
<script>
  goog.require('models.Model1');
  goog.require('goog.testing.jsunit');
  goog.require('goog.testing.AsyncTestCase');
</script>
<div id="fb-root"></div>
</head>
<script>

  var testCase = new goog.testing.AsyncTestCase(document.title);
  testCase.stepTimeout = 4 * 1000; // = 4000ms=4sec

  // setUpPage is used for setting up once for the entire page of tests
  testCase.setUpPage = function(){
    this.waitForAsync('setUpPage');
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

    var model=new models.Model1();
    this.model = model;
    this.homeIcons = [];
    var _this=this;
    var cb = function(){
      _this.homeIcons=model.getCurrentIcons();
      _this.continueTesting();
    };
    model.attachToOpenFolderEvent(cb);
    model.initialize(FB,'<?php echo $facebook->getUser(); ?>');

    this.add(new goog.testing.TestCase.Test('Test home icons',
            this.testHomeIcons,this));
  };

  testCase.testHomeIcons = function(){
    assertEquals(2,this.homeIcons.length);
  };

  function setUpPage(){
    testCase.runTests();
  }

  // Standalone Closure Test Runner.
  if (typeof G_testRunner != 'undefined') {
    G_testRunner.initialize(testCase);
  }
 
</script>

</head>
<body>
</body>
</html>
