<?php
  // This variable switches between different methods of including scripts,
  // 'manual': scripts are listed by hand
  // 'closureBuilt': the script outputted by closure builder using dependency
  //                 calculations
  // 'closureCompiled': same as 'closureBuilt', but also compiled with simple
  //                    optimizations of the closure compiler
  // 'closureOptimized': same as 'closureBuilt', but also compiled with advanced
  //                     optimizations of the closure compiler

  // set the $PHP_ENV variable in .bashrc to change the environment
  // This is not working right now, as PHP_ENV needs to be created
  // in the environment in which apache runs. So currently
  // need to keep this file dirty (change the default case below)
  switch(getenv("PHP_ENV")){
    case "production":
      $scriptMethod='closureCompiled';
      break;
    case "development":
      $scriptMethod='manual';
      break;
    default:
      $scriptMethod='closureCompiled';
  }
  //$scriptMethod='manual';
  //$scriptMethod='closureBuilt';
  //$scriptMethod='closureCompiled';
  //$scriptMethod='closureOptimized';
?>

<?php if($scriptMethod==='manual'): ?>

    <script type="text/javascript" 
            src="http://connect.facebook.net/en_US/all.js"></script>
    <script type="text/javascript" 
            src="../closure-library/closure/goog/base.js"></script>
    <script type="text/javascript" 
            src="../js/common/helpers.js"></script>
    <script type="text/javascript" 
            src="../js/common/Event.js"></script>
    <script type="text/javascript" 
            src="../js/common/miscObjects.js"></script>
    <script type="text/javascript" 
            src="../js/common/iconNodes.js"></script>
    <script type="text/javascript" 
            src="../js/models/abstractModel.js"></script>
    <script type="text/javascript" 
            src="../js/models/model1.js"></script>
    <script type="text/javascript" 
            src="../js/view/MainView.js"></script>
    <script type="text/javascript" 
            src="../js/view/MainViewImpl.js"></script>
    <script type="text/javascript" 
            src="../js/view/NavbarView.js"></script>
    <script type="text/javascript" 
            src="../js/view/ImageArrayView.js"></script>
    <script type="text/javascript" 
            src="../js/view/ConsoleView.js"></script>
    <script type="text/javascript" 
            src="../js/view/PhotoView.js"></script>
    <script type="text/javascript" 
            src="../js/view/ContextbarView.js"></script>

<?php elseif($scriptMethod==='closureBuilt'): ?>
    <script type="text/javascript" 
            src="http://connect.facebook.net/en_US/all.js"></script>
    <script type="text/javascript" 
            src="./js-compiled/all.js"></script>
<?php elseif($scriptMethod==='closureCompiled'): ?>
    <script type="text/javascript" 
            src="http://connect.facebook.net/en_US/all.js"></script>
    <script type="text/javascript" 
            src="./js-compiled/all_compiled.js"></script>
<?php elseif($scriptMethod==='closureOptimized'): ?>
    <script type="text/javascript" 
            src="http://connect.facebook.net/en_US/all.js"></script>
    <script type="text/javascript" 
            src="./js-compiled/all_compiledOpti.js"></script>
<?php endif ?>
