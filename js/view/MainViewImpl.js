/**
 * This file implements the top level functions of the View, obeying the
 * interface of MainView class
 */

goog.provide('view.MainViewImpl');

goog.require('common.helpers');
goog.require('view.MainView');
goog.require('models.AbstractModel');
goog.require('goog.asserts');

view.MainViewImpl = function(model) {
  view.MainView.call(this,model);
}
goog.inherits(view.MainViewImpl,view.MainView);

view.MainViewImpl.prototype.initialize = function() {
  this._currentIconNode = new common.IconNode('root','',0,0);
  this.updateView(); 
}

view.MainViewImpl.prototype.openFolderEventHandler = function(obj) {
  obj.updateView();
}

view.MainViewImpl.prototype.updateView = function() {
  // update navigation bar
  this.navbarViewUpdate();
  // update contextbar
  // this.contextbarViewUpdate();
  // update image array
  this.imageArrayViewUpdate();
}


