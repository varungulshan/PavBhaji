/** 
 * This file implements the context bar related function as mentioned in the
 * interface view.MainView
 */
goog.provide('view.MainViewImplPart5');

goog.require('view.MainView');
goog.require('view.MainViewImpl');
goog.require('common.helpers');
goog.require('goog.asserts');

view.MainViewImpl.prototype.contextbarViewUpdate = function () {
  var metaInfo = this._currentIconNode.getMetaInfo();
  common.helpers.setText(this._contextBar, metaInfo.contextBarText);
}
