/**
 * This file implements the top level functions of the View, obeying the
 * interface of MainView class
 */

goog.provide('view.MainViewImpl');

goog.require('common.helpers');
goog.require('view.MainView');
goog.require('models.AbstractModel');
goog.require('goog.asserts');
goog.require('goog.events.KeyCodes');

view.MainViewImpl = function(model) {
  view.MainView.call(this,model);
}
goog.inherits(view.MainViewImpl,view.MainView);
goog.exportSymbol('view.MainViewImpl',view.MainViewImpl);

view.MainViewImpl.prototype.initialize = function() {
  this._currentIconNode = this._model.getOpenIcon();
  this.updateView(); 
}
//goog.exportProperty(view.MainViewImpl,'initialize',
    //view.MainViewImpl.prototype.initialize);
goog.exportSymbol('view.MainViewImpl.prototype.initialize',
  view.MainViewImpl.prototype.initialize);

view.MainViewImpl.prototype.openFolderEventHandler = function() {
  this._loadingDiv.style.visibility = 'hidden';
  this._currentIconNode = this._model.getOpenIcon();
  this.updateView();
}

view.MainViewImpl.prototype.openPhotoEventHandler = function() {
  this._loadingDiv.style.visibility = 'hidden';
  var photoObj = this._model.getCurrentPhoto();
  this.photoViewDisplayPhoto(photoObj);
}

view.MainViewImpl.prototype.updateView = function() {
  this.consoleViewClose();
  this.consoleViewClear();
  // update navigation bar
  this.navbarViewUpdate();
  // update contextbar
  // this.contextbarViewUpdate();
  // update image array
  this.imageArrayViewUpdate();
}

view.MainViewImpl.prototype.handleKeyPress = function (e) {
  switch(e.keyCode) {
    case goog.events.KeyCodes.CTRL:
      this._consoleZippy.toggle();
      break;
    case goog.events.KeyCodes.RIGHT:
      if (this.photoViewIsOpen())
        this.photoViewNextButtonClickHandler();
      break;
    case goog.events.KeyCodes.LEFT:
      if (this.photoViewIsOpen())
        this.photoViewPrevButtonClickHandler();
      break;
    case goog.events.KeyCodes.ESC:
      if (this._consoleZippy.isExpanded())
        this.consoleViewClose();
      else if (this.photoViewIsOpen())
        this.photoViewClosePhotoButtonClickHandler();
      break;
  }
}

