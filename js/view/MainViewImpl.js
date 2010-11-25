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
  this._currentIconNode = this._model.getOpenIcon();
  this.updateView();
}

view.MainViewImpl.prototype.openPhotoEventHandler = function() {
  // TODO(Rahul): Store these in class vars for efficiency
  var photoDiv = document.getElementById('fullres_photo_div');
  var photoImg = document.getElementById('fullres_photo_img');
  var photoCaption = document.getElementById('caption_div');
  var photoObj = this._model.getCurrentPhoto();
  photoImg.src = photoObj.imgUrl;
  var x_scaling = this._maxImageWidth/photoObj.width;
  var y_scaling = this._maxImageHeight/photoObj.height;
  var scaling = Math.min(x_scaling,y_scaling);
  scaling = Math.min(1.0,scaling);
  var scaledWidth = Math.floor(scaling * photoObj.width);
  var scaledHeight = Math.floor(scaling * photoObj.height);
  photoDiv.style.width = scaledWidth.toString()+"px";
  photoDiv.style.height = scaledHeight.toString()+"px";
  photoDiv.style.visibility = 'visible';
  if (photoObj.caption == '')
    photoCaption.style.visibility = 'hidden';
  else {
    photoCaption.style.visibility = 'visible';
    common.helpers.setText(photoCaption, photoObj.caption);
  }
  // set photo comments
  this.consoleViewUpdateNumComments(photoObj.commentArray.length);
  // first create a map from commenter names to ids;
  var id = 2;
  var maxId = this._commenterColors.length;
  var hashMap = [];
  for (var i = 0; i < photoObj.commentArray.length; ++i) {
    if (hashMap[photoObj.commentArray[i].from.name] == undefined) {
      hashMap[photoObj.commentArray[i].from.name] = id;
      id = (id + 1)%maxId;
    }
  }
  for (var i = 0; i < photoObj.commentArray.length; ++i) {
    var HTMLstring = 
      '<span class="commenter_name" style="color:'+ 
      this._commenterColors[hashMap[photoObj.commentArray[i].from.name]]+'">' 
      + photoObj.commentArray[i].from.name + 
      '</span>: ' + photoObj.commentArray[i].message;
    this.consoleViewAdd(HTMLstring);
  }
}


view.MainViewImpl.prototype.closePhotoButtonClickHandler = function () {
  this._model.closeCurrentPhoto();
  this.closePhoto();
  var parentNodes = this._model.getCurrentPathIcons();
  this._model.gotoIcon(parentNodes[parentNodes.length-1]);  
}

/** closes the photo if it's open 
 */
view.MainViewImpl.prototype.closePhoto = function () {
  var photoDiv = document.getElementById('fullres_photo_div');
  var photoImg = document.getElementById('fullres_photo_img');
  var photoCaption = document.getElementById('caption_div');
  photoDiv.style.visibility = 'hidden';
  photoCaption.style.visibility = 'hidden';
  photoImg.src = '';
  this.consoleViewClose();
  this.consoleViewClear();
  this.consoleViewUpdateNumComments(0);
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
  }
}

