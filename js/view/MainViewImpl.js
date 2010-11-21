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
  this._currentIconNode = this._model.getOpenIcon();
  this.updateView(); 
}

view.MainViewImpl.prototype.openFolderEventHandler = function() {
  this._currentIconNode = this._model.getOpenIcon();
  this.updateView();
}

view.MainViewImpl.prototype.openPhotoEventHandler = function() {
  var photoDiv = document.getElementById('fullres_photo_div');
  var photoImg = document.getElementById('fullres_photo_img');
  photoDiv.style.visibility = 'visible';
  var photoObj = this._model.getCurrentPhoto();
  photoImg.src = photoObj.imgUrl;
}

view.MainViewImpl.prototype.closePhotoButtonClickHandler = function () {
  this.closePhoto();
  var parentNodes = this._model.getParentIcons();
  this._model.gotoIcon(parentNodes[parentNodes.length-2]);  
}

/** closes the photo if it's open 
 */
view.MainViewImpl.prototype.closePhoto = function () {
  var photoDiv = document.getElementById('fullres_photo_div');
  var photoImg = document.getElementById('fullres_photo_img');
  photoDiv.style.visibility = 'hidden';
  photoImg.src = '';
}

view.MainViewImpl.prototype.updateView = function() {
  // update navigation bar
  this.navbarViewUpdate();
  // update contextbar
  // this.contextbarViewUpdate();
  // update image array
  this.imageArrayViewUpdate();
}

