<?php
  // This variable switches between different methods of including scripts,
  // 'manual': scripts are listed by hand
  // 'closureBuilt': the script outputted by closure builder using dependency
  //                 calculations
  // 'closureCompiled': same as 'closureBuilt', but also compiled with simple
  //                    optimizations of the closure compiler
  // 'closureOptimized': same as 'closureBuilt', but also compiled with advanced
  //                     optimizations of the closure compiler

  //$scriptMethod='manual';
  //$scriptMethod='closureBuilt';
  $scriptMethod='closureCompiled';
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

<?php elseif($scriptMethod==='closureBuilt'): ?>
    <script type="text/javascript" 
            src="http://connect.facebook.net/en_US/all.js"></script>
    <script type="text/javascript" 
            src="./js-compiled/all.js"></script>
<?php elseif($scriptMethod==='closureCompiled'): ?>
    <script type="text/javascript" 
            src="http://connect.facebook.net/en_US/all.js"></script>
    <script type="text/javascript" 
            src="./js-compiled/all-compiled.js"></script>
<?php elseif($scriptMethod==='closureOptimized'): ?>
    <script type="text/javascript" 
            src="http://connect.facebook.net/en_US/all.js"></script>
    <script type="text/javascript" 
            src="./js-compiled/all-compiledOpti.js"></script>
<?php endif ?>
