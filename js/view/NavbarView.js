/** 
 * This file implements the Navbar related function as mentioned in the
 * interface view.MainView
 */

goog.require('view.MainView');
goog.require('common.helpers');
goog.require('view.MainViewImpl');
goog.require('goog.asserts');

view.MainViewImpl.prototype.navbarViewUpdate = function() {
  // make all buttons on the navbar till the current depth visible
  // all buttons after that are invisible
  var i = 0;
  var numButtons = 4; 
  var buttons = common.helpers.getElementByTagAndClassName('div',
                                                           'navigation_button');
  goog.asserts.assert(buttons.length == numButtons);  
  for(i = 0; i < numButtons; ++i) {
    if (i+1 < this._currentIconNode.fileDepth) {
      // visible but unselected
      buttons[i].style.visibility = 'visible';
      buttons[i].id = "";
    } else if ( i+1 == this._currentIconNode.fileDepth) {
      // visible and selected
      buttons[i].style.visibility = 'visible';
      buttons[i].id = "selected_navigation_button";
    } else {
      // make invisible
      buttons[i].style.visibility = 'hidden';
    }
  }
}
