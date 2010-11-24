/** 
 * This file implements the Navbar related function as mentioned in the
 * interface view.MainView
 */

goog.provide('view.MainViewImplPart3');

goog.require('view.MainView');
goog.require('view.MainViewImpl');
goog.require('common.helpers');
goog.require('goog.asserts');

view.MainViewImpl.prototype.consoleViewClose = function () {
  this._consoleZippy.collapse();
}

view.MainViewImpl.prototype.consoleViewClear = function () {
  while(this._consoleContent.hasChildNodes())
    this._consoleContent.removeChild(this._consoleContent.firstChild);
}

view.MainViewImpl.prototype.consoleViewAdd = function (str) {
  var divelement = document.createElement("div");
  divelement.id = "comment_div";
  divelement.innerHTML = str;
  this._consoleContent.appendChild(divelement);
}
